#!/bin/bash
# Deploy Paws & Pulse to VPS (empaticapet.app)
# Diagnostic and Multi-Proxy Nginx Setup
# Usage: ./deploy.sh

VPS_IP="72.61.52.127"
VPS_USER="root"
APP_DIR="/opt/pawsandpulse"
DOMAIN="empaticapet.app"

echo "=========================================="
echo "  Deploying Paws & Pulse"
echo "  Domain: ${DOMAIN}"
echo "  VPS: ${VPS_IP}"
echo "=========================================="

# 1. Sync files
echo ""
echo "[1/5] Syncing files to VPS..."
rsync -avz -e ssh \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '.env.local' \
  ./ ${VPS_USER}@${VPS_IP}:${APP_DIR}/

# 2. Build and start pawsandpulse container
echo ""
echo "[2/5] Building and starting container..."
ssh ${VPS_USER}@${VPS_IP} << 'EOF'
  cd /opt/pawsandpulse

  # Stop old container if exists
  docker stop pawsandpulse 2>/dev/null
  docker rm pawsandpulse 2>/dev/null

  # Build the image
  echo "Building image..."
  docker build -t pawsandpulse:latest .

  # Start container mapping host port 3008:3000
  docker run -d \
    --name pawsandpulse \
    --restart unless-stopped \
    -p 3008:3000 \
    --env-file .env.production 2>/dev/null || \
  docker run -d \
    --name pawsandpulse \
    --restart unless-stopped \
    -p 3008:3000 \
    -e NODE_ENV=production \
    -e NEXT_TELEMETRY_DISABLED=1 \
    -e NEXT_PUBLIC_APP_URL=https://empaticapet.app \
    pawsandpulse:latest

  echo "Container status:"
  docker ps | grep pawsandpulse
EOF

# 3. Diagnostic & Reverse Proxy Setup
echo ""
echo "[3/5] Diagnosing Nginx & Connecting Proxy..."
ssh ${VPS_USER}@${VPS_IP} << 'EOF'
  echo "--- RUNNING CONTAINERS ---"
  docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

  cd /opt/pawsandpulse

  # Detect Nginx containers (mdcodes_nginx, nginx, etc.)
  CONTAINERS=$(docker ps --format '{{.Names}}')
  NGINX_CONTAINER=""
  for c in $CONTAINERS; do
    if echo "$c" | grep -qi "nginx"; then
      NGINX_CONTAINER="$c"
      break
    fi
  done

  # Fallback: check if mdcodes_nginx exists even if stopped
  if [ -z "$NGINX_CONTAINER" ]; then
    if docker ps -a --format '{{.Names}}' | grep -q "mdcodes_nginx"; then
      NGINX_CONTAINER="mdcodes_nginx"
      docker start mdcodes_nginx 2>/dev/null || true
    fi
  fi

  if [ -n "$NGINX_CONTAINER" ]; then
    echo "Using Nginx container: ${NGINX_CONTAINER}"
    
    # 1. Connect pawsandpulse to all docker networks of Nginx container
    NETWORKS=$(docker inspect ${NGINX_CONTAINER} --format='{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}')
    for net in $NETWORKS; do
      echo "Connecting pawsandpulse to network: ${net}"
      docker network connect ${net} pawsandpulse 2>/dev/null || true
    done

    # 2. Build Nginx config for Docker container
    cat > /tmp/empaticapet.conf << 'CONF'
server {
    listen 80;
    listen [::]:80;
    server_name empaticapet.app www.empaticapet.app;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name empaticapet.app www.empaticapet.app;

    ssl_certificate /etc/letsencrypt/live/empaticapet.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/empaticapet.app/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    client_max_body_size 10M;

    location / {
        proxy_pass http://pawsandpulse:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
CONF

    # Copy config into Nginx container
    docker cp /tmp/empaticapet.conf ${NGINX_CONTAINER}:/etc/nginx/conf.d/empaticapet.conf

    # Check SSL cert in container
    if ! docker exec ${NGINX_CONTAINER} test -f /etc/letsencrypt/live/empaticapet.app/fullchain.pem; then
      echo "SSL cert not found in container. Creating temporary HTTP-only config..."
      docker exec ${NGINX_CONTAINER} sh -c 'cat > /etc/nginx/conf.d/empaticapet.conf << "HTTPCONF"
server {
    listen 80;
    listen [::]:80;
    server_name empaticapet.app www.empaticapet.app;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://pawsandpulse:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
HTTPCONF'
      
      CERTBOT_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i certbot | head -n 1)
      if [ -n "$CERTBOT_CONTAINER" ]; then
        echo "Obtaining SSL certificate via certbot container ${CERTBOT_CONTAINER}..."
        docker exec ${CERTBOT_CONTAINER} certbot certonly --webroot -w /var/www/certbot -d empaticapet.app -d www.empaticapet.app --non-interactive --agree-tos --email marcelo@empaticapet.app 2>/dev/null || true
        # Restore full SSL config
        docker cp /tmp/empaticapet.conf ${NGINX_CONTAINER}:/etc/nginx/conf.d/empaticapet.conf
      fi
    fi

    # Test & reload container Nginx
    docker exec ${NGINX_CONTAINER} nginx -t
    if [ $? -eq 0 ]; then
      docker exec ${NGINX_CONTAINER} nginx -s reload
      echo "Nginx container reloaded successfully."
    else
      echo "Nginx container test failed! Printing logs..."
      docker exec ${NGINX_CONTAINER} nginx -t
    fi

  elif command -v nginx >/dev/null 2>&1; then
    echo "Using Host system Nginx..."
    cat > /etc/nginx/conf.d/empaticapet.conf << 'HOSTCONF'
server {
    listen 80;
    listen [::]:80;
    server_name empaticapet.app www.empaticapet.app;

    location / {
        proxy_pass http://127.0.0.1:3008;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
HOSTCONF

    if command -v certbot >/dev/null 2>&1; then
      certbot --nginx -d empaticapet.app -d www.empaticapet.app --non-interactive --agree-tos --email marcelo@empaticapet.app 2>/dev/null || true
    fi

    nginx -t && systemctl reload nginx
    echo "Host Nginx reloaded successfully."
  fi
EOF

# 4. Verify deployment
echo ""
echo "[4/5] Testing HTTP response from server..."
sleep 2
ssh ${VPS_USER}@${VPS_IP} << 'EOF'
  echo "Local container check (http://127.0.0.1:3008):"
  curl -Is http://127.0.0.1:3008 | head -n 5

  echo ""
  echo "Domain check (http://empaticapet.app):"
  curl -Is http://empaticapet.app | head -n 5
EOF

echo ""
echo "=========================================="
echo "  Deploy diagnostic complete!"
echo "=========================================="
