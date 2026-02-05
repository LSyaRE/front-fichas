# Stage 1: Build
FROM node:20-alpine as build

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código y construir
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copiar configuración de Nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos construidos desde la etapa anterior
# Nota: Ajustado a la estructura típica de Angular 17+ con @angular/build:application
COPY --from=build /app/dist/formulario/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
