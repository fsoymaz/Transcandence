#!/bin/bash

# OpenSSL kullanarak self-signed sertifika oluştur
    echo "Nginx: OpenSSL SSL sertifikaları oluşturuluyor..."
    openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt -subj "/C=TR/ST=ISTANBUL/L=SARIYER/O=42Istanbul/CN=43server.com";
    echo "Nginx: OpenSSL SSL sertifikaları oluşturuldu!"

# Start Nginx
echo "Nginx: Başlatılıyor..."
nginx -g "daemon off;"
