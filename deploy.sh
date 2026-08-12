#!/bin/bash
# Deploy Paws & Pulse to VPS (empaticapet.app)
# Safe deploy: integrates with existing mdcodes_nginx proxy
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

  # Start container (no host port needed - nginx will proxy internally)
  docker run -d \
    --name pawsandpulse \
    --restart unless-stopped \
    --env-file .env.production \
    -e NODE_ENV=production \
    -e NEXT_TELEMETRY_DISABLED=1 \
    -e NEXT_PUBLIC_APP_URL=https://empaticapet.app \
    pawsandpulse:latest

  echo "Container started:"
  docker ps | grep pawsandpulse
EOF

# 3. Connect to mdcodes nginx network
echo ""
echo "[3/5] Connecting to nginx network..."
ssh ${VPS_USER}@${VPS_IP} << 'EOF'
  # Find the network that mdcodes_nginx is on
  NGINX_NETWORK=$(docker inspect mdcodes_nginx --format='{{range $key, $value := .NetworkSettings.Networks}}{{$key}} {{end}}' | awk '{print $1}')
  echo "Nginx network: ${NGINX_NETWORK}"

  # Connect pawsandpulse to that network
  docker network connect ${NGINX_NETWORK} pawsandpulse 2>/dev/null
  if [ $? -eq 0 ]; then
    echo "Connected pawsandpulse to ${NGINX_NETWORK}"
  else
    echo "Already connected or connecting..."
  fi

  # Verify connectivity
  docker exec mdcodes_nginx ping -c 1 pawsandpulse 2>/dev/null && echo "Connectivity OK" || echo "Warning: ping failed (might still work)"
EOF

# 4. Add nginx config and get SSL
echo ""
echo "[4/5] Configuring Nginx + SSL..."
ssh ${VPS_USER}@${VPS_IP} << 'SSLEOF'
  # Copy nginx config into the mdcodes_nginx container
  docker cp /opt/pawsandpulse/nginx/empaticapet.app.conf mdcodes_nginx:/etc/nginx/conf.d/empaticapet.conf

  # Check if SSL cert already exists
  if docker exec mdcodes_nginx test -f /etc/letsencrypt/live/empaticapet.app/fullchain.pem; then
    echo "SSL certificate already exists"
  else
    echo "Getting SSL certificate..."

    # First, add a temporary HTTP-only config for certbot challenge
    docker exec mdcodes_nginx sh -c 'cat > /etc/nginx/conf.d/empaticapet.conf << TMPCONF
server {
    listen 80;
    listen [::]:80;
    server_name empaticapet.app www.empaticapet.app;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 200 "waiting for ssl"; add_header Content-Type text/plain; }
}
TMPCONF'

    # Reload nginx with temp config
    docker exec mdcodes_nginx nginx -t && docker exec mdcodes_nginx nginx -s reload
    sleep 2

    # Run certbot to get the certificate
    docker exec mdcodes_certbot certbot certonly \
      --webroot -w /var/www/certbot \
      -d empaticapet.app -d www.empaticapet.app \
      --non-interactive --agree-tos \
      --email marcelo@empaticapet.app \
      --force-renewal

    # Restore full config with SSL
    docker cp /opt/pawsandpulse/nginx/empaticapet.app.conf mdcodes_nginx:/etc/nginx/conf.d/empaticapet.conf
  fi

  # Test and reload nginx
  docker exec mdcodes_nginx nginx -t
  if [ $? -eq 0 ]; then
    docker exec mdcodes_nginx nginx -s reload
    echo "Nginx reloaded successfully"
  else
    echo "ERROR: Nginx config test failed! Rolling back..."
    docker exec mdcodes_nginx rm /etc/nginx/conf.d/empaticapet.conf
    docker exec mdcodes_nginx nginx -s reload
    exit 1
  fi
SSLEOF

# 5. Verify
echo ""
echo "[5/5] Verifying..."
sleep 3
ssh ${VPS_USER}@${VPS_IP} << 'EOF'
  # Check container is running
  echo "Container status:"
  docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(NAMES|pawsandpulse)"

  # Check nginx can reach the app
  echo ""
  echo "Internal check:"
  docker exec mdcodes_nginx wget -qO- --timeout=5 http://pawsandpulse:3000 | head -c 100
  echo ""

  # List all nginx configs
  echo ""
  echo "Active nginx configs:"
  docker exec mdcodes_nginx ls /etc/nginx/conf.d/
EOF

echo ""
echo "=========================================="
echo "  Deploy complete!"
echo ""
echo "  Sites on this VPS:"
echo "    - https://beautifull.codes (unchanged)"
echo "    - https://painel.dttools.app (unchanged)"
echo "    - https://empaticapet.app (NEW)"
echo ""
echo "  IMPORTANT: Make sure DNS A record"
echo "  for empaticapet.app points to ${VPS_IP}"
echo "=========================================="
