FROM nginx:alpine
# Copiar el codigo fuente estático a la carpeta raíz de Nginx
COPY src /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
