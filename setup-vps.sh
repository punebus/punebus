#!/bin/bash

# =========================================================================
# PuneBus VPS Initial Setup Script
# =========================================================================
# Run this script once on your VPS (as root) to prepare the directories
# and Nginx configurations.
# Usage: sudo bash setup-vps.sh

set -e

echo "=== Starting PuneBus VPS Setup ==="

# 1. Create target deployment directories
echo "Creating deployment directories under /var/www/punebus/..."
mkdir -p /var/www/punebus/frontend
mkdir -p /var/www/punebus/admin
mkdir -p /var/www/punebus/manager
mkdir -p /var/www/punebus/executor
mkdir -p /var/www/punebus/backend

# 2. Setup permissions
echo "Setting permissions..."
chown -R root:www-data /var/www/punebus
chmod -R 755 /var/www/punebus

# 3. Setup Nginx Configuration
echo "Configuring Nginx..."
NGINX_CONF_DEST="/etc/nginx/sites-available/punebus.conf"
NGINX_LINK_DEST="/etc/nginx/sites-enabled/punebus.conf"

# Copy Nginx config to Nginx sites-available
if [ -f "./nginx/punebus.conf" ]; then
    cp ./nginx/punebus.conf "$NGINX_CONF_DEST"
    echo "Copied local nginx/punebus.conf to $NGINX_CONF_DEST"
elif [ -f "/var/www/punebus/nginx/punebus.conf" ]; then
    cp /var/www/punebus/nginx/punebus.conf "$NGINX_CONF_DEST"
    echo "Copied /var/www/punebus/nginx/punebus.conf to $NGINX_CONF_DEST"
else
    echo "Warning: Nginx configuration not found in path. Creating placeholder Nginx file..."
    # We write a backup option just in case the folder was not uploaded yet
    cat << 'EOF' > "$NGINX_CONF_DEST"
# Placeholder configuration. Real config will be uploaded by GitHub Actions.
EOF
fi

# Enable configuration by creating a symlink
if [ ! -f "$NGINX_LINK_DEST" ]; then
    ln -s "$NGINX_CONF_DEST" "$NGINX_LINK_DEST"
    echo "Created symlink to enable site configuration"
fi

# Remove default nginx site to avoid conflicts if present
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    rm /etc/nginx/sites-enabled/default
    echo "Removed default Nginx config to prevent conflicts"
fi

# Test Nginx configuration
echo "Testing Nginx configuration..."
nginx -t

# Restart Nginx
echo "Restarting Nginx..."
systemctl restart nginx

echo "=== Directory and Nginx setup completed successfully! ==="
echo ""
echo "--- Next Steps ---"
echo "1. Set up your backend environment variables:"
echo "   Create a .env file at: /var/www/punebus/backend/.env"
echo "   Define MONGO_URI, JWT_SECRET, PORT=5001, SMTP_HOST, etc."
echo ""
echo "2. Set up GitHub secrets for CI/CD:"
echo "   - SSH_PRIVATE_KEY (private SSH key)"
echo "   - VPS_IP (72.61.171.164)"
echo ""
echo "3. Run your first push to trigger the pipeline."
echo "   This will build and transfer the files to the directories."
echo ""
echo "4. Once the domains are pointing to your VPS and the pipeline runs, secure the sites with SSL:"
echo "   sudo certbot --nginx -d punebus.com -d www.punebus.com -d admin.punebus.com -d manager.punebus.com -d executor.punebus.com -d api.punebus.com"
echo ""
