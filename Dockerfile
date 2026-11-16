FROM nginx:alpine
# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copiar el codigo fuente estático a la carpeta raíz de Nginx
COPY src /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
