#!/bin/bash

# Create SSL certificates if they don't exist
if [ ! -f /etc/letsencrypt/live/fsoymaz.tech/fullchain.pem ]; then
    echo "Nginx: Let's Encrypt SSL certificates are being created..."
    certbot certonly --nginx --non-interactive --agree-tos --email fthsymz60@gmail.com --domain fsoymaz.tech
    echo "Nginx: Let's Encrypt SSL certificates created!"
fi

# Start Nginx
echo "Nginx: Starting..."
nginx -g "daemon off;"
