#!/bin/bash
set -e

# Step 1: Run Nginx in a Docker Container with volume mounting for SSL certificates
docker run --name nginx-container -d -p 80:80 -p 443:443 \
-v "/etc/letsencrypt:/etc/letsencrypt" \
nginx

# Give Nginx a few seconds to initialize
sleep 5

# Step 2: Temporarily stop the Nginx container to free up port 80
docker stop nginx-container

# Obtain SSL Certificates with Certbot
docker run -it --rm --name certbot \
-p 80:80 \
-v "/etc/letsencrypt:/etc/letsencrypt" \
-v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
certbot/certbot certonly --standalone \
-d backend.artaffinity.xyz

# Start the Nginx container again
docker start nginx-container

# Step 3: Configure Nginx to Use the SSL Certificates
# Create a configuration file for Nginx
cat > nginx_backend.conf <<EOF
server {
    listen 80;
    server_name backend.artaffinity.xyz;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name backend.artaffinity.xyz;

    ssl_certificate /etc/letsencrypt/live/backend.artaffinity.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/backend.artaffinity.xyz/privkey.pem;

    location / {
        proxy_pass http://34.89.126.67:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

# Remove the default Nginx configuration to avoid conflicts
docker exec nginx-container rm /etc/nginx/conf.d/default.conf

# Copy the configuration to the Nginx container and reload Nginx
docker cp nginx_backend.conf nginx-container:/etc/nginx/conf.d/
docker exec nginx-container nginx -s reload

# Cleanup
rm nginx_backend.conf

echo "Setup complete. Remember to set up a process for renewing the SSL certificate every 90 days."

