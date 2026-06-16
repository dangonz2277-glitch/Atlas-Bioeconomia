# ==========================================
# Etapa 1: Compilación (Build Stage)
# ==========================================
# Utiliza la imagen oficial de Node.js versión 18 basada en Alpine Linux.
# Alpine es seleccionada por su huella de memoria extremadamente reducida (~5MB base).
FROM node:18-alpine AS build-stage

# Establece el directorio de trabajo absoluto dentro del contenedor.
# Todas las instrucciones posteriores (COPY, RUN, CMD) operarán relativas a esta ruta.
WORKDIR /app

# Copia estrictamente los descriptores de dependencias primero.
# Separar este paso aprovecha la memoria caché de las capas de Docker; 
# si el package.json no muta, Docker omite descargar los paquetes nuevamente.
COPY package.json package-lock.json ./

# Ejecuta la instalación estructurada de dependencias (Clean Install).
# A diferencia de 'npm install', 'npm ci' lee estrictamente el package-lock.json,
# previene la alteración de versiones e incrementa drásticamente la velocidad de instalación.
RUN npm ci

# Traspasa la totalidad de los archivos fuentes del proyecto local hacia la ruta /app del contenedor.
COPY . .

# Desencadena el script empaquetador de Vite configurado en package.json.
# Este proceso minifica, transpiliza TypeScript a JavaScript y empaqueta los assets,
# generando la carpeta estática y optimizada /app/dist.
RUN npm run build

# ==========================================
# Etapa 2: Producción (Web Server Stage)
# ==========================================
# Desecha la pesada imagen de Node y transiciona hacia Nginx, 
# el estándar de la industria para servir estáticos asíncronamente con alta concurrencia.
FROM nginx:alpine AS production-stage

# Traslada únicamente la carpeta purificada /dist resultante de la 'build-stage'.
# Los pesados módulos de node (node_modules) y el código fuente no transpasan a esta imagen,
# garantizando un tamaño final de imagen en producción minúsculo e infranqueable a nivel seguridad.
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Opcional pero recomendado para SPA (React Router): 
# Si React Router emplea rutas virtuales, se debe inyectar una configuración de Nginx
# para redirigir todo el tráfico (404) hacia el index.html de origen.
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Declara intencionalmente la exposición del puerto estándar HTTP.
EXPOSE 80

# Comando matriz de orquestación.
# Arranca el demonio de nginx de forma forzosa en primer plano (foreground),
# impidiendo que el contenedor colapse al perder su proceso nativo activo.
CMD ["nginx", "-g", "daemon off;"]
