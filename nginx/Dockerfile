FROM nginx:alpine

# OpenSSL'i yükleyin
RUN apk add --no-cache openssl

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 443

# Nginx başlatma komutu
CMD ["nginx", "-g", "daemon off;"]
