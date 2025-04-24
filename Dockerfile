# Imagen base de nginx
FROM nginx:alpine

# Copia el contenido del proyecto al directorio por defecto de nginx
COPY . /usr/share/nginx/html

# Elimina la configuración por defecto de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia tu propia configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
