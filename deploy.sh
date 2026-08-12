#!/bin/bash
# Deploy Paws & Pulse to VPS (empaticapet.app)
# Auto-detects Nginx configuration (Docker container vs Host Nginx)
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

  # Start container (mapping 3008:3000 for direct fallback access)
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

  echo "Container started:"
  docker ps | grep pawsandpulse
EOF

# 3. Configure Reverse Proxy & SSL
echo ""
echo "[3/5] Configuring Proxy and SSL..."
ssh ${VPS_USER}@${VPS_IP} << 'EOF'
  cd /opt/pawsandpulse

  # Detect running Nginx container
  NGINX_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i nginx | head -n 1)
  CERTBOT_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i certbot | head -n 1)

  if [ -n "$NGINX_CONTAINER" ]; then
    echo "Found Nginx Docker container: ${NGINX_CONTAINER}"
    
    # Connect pawsandpulse to Nginx container network
    NGINX_NET=$(docker inspect ${NGINX_CONTAINER} --format='{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}' | awk '{print $1}')
    if [ -n "$NGINX_NET" ]; then
      docker network connect ${NGINX_NET} pawsandpulse 2>/dev/null || true
    fi

    # Adjust config for docker container internal proxying
    cp nginx/empaticapet.app.conf /tmp/empaticapet.app.conf
    sed -i 's/127.0.0.1:3008/pawsandpulse:3000/g' /tmp/empaticapet.app.conf

    # Copy Nginx config into container
    docker cp /tmp/empaticapet.app.conf ${NGINX_CONTAINER}:/etc/nginx/conf.d/empaticapet.conf 2>/dev/null || \
    docker exec ${NGINX_CONTAINER} sh -c "cat > /etc/nginx/conf.d/empaticapet.conf" < /tmp/empaticapet.app.conf

    # Check SSL or run Certbot
    if [ -n "$CERTBOT_CONTAINER" ]; then
      echo "Running Certbot via ${CERTBOT_CONTAINER}..."
      docker exec ${CERTBOT_CONTAINER} certbot certonly --webroot -w /var/www/certbot -d empaticapet.app -d www.empaticapet.app --non-interactive --agree-tos --email marcelo@empaticapet.app 2>/dev/null || true
    fi

    docker exec ${NGINX_CONTAINER} nginx -t && docker exec ${NGINX_CONTAINER} nginx -s reload
    echo "Nginx container reloaded successfully."

  elif command -v nginx >/dev/null 2>&1; then
    echo "Found Nginx installed on host system."
    
    # Copy Nginx config to host Nginx
    cp nginx/empaticapet.app.conf /etc/nginx/conf.d/empaticapet.conf 2>/dev/null || \
    cp nginx/empaticapet.app.conf /etc/nginx/sites-available/empaticapet.app 2>/dev/null

    if command -v certbot >/dev/null 2>&1; then
      certbot --nginx -d empaticapet.app -d www.empaticapet.app --non-interactive --agree-tos --email marcelo@empaticapet.app 2>/dev/null || true
    fi

    nginx -t && systemctl reload nginx
    echo "Host Nginx reloaded successfully."
  else
    echo "Notice: Nginx reverse proxy not found on host or docker. Container running on port 3008."
  fi
EOF

# 4. Verify deployment
echo ""
echo "[4/5] Verifying Deployment..."
sleep 3
ssh ${VPS_USER}@${VPS_IP} << 'EOF'
  echo "Containers status:"
  docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(NAMES|pawsandpulse)"
EOF

echo ""
echo "=========================================="
echo "  Deploy complete!"
echo "  App running on VPS!"
echo "=========================================="
