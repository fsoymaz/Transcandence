# frontend
FROM nginx:latest

# Copy frontend files
COPY . /usr/share/nginx/html

# Expose ports
EXPOSE 80

# Nginx başlatma komutu
CMD ["nginx", "-g", "daemon off;"]
