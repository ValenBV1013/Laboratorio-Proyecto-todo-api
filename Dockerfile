# Dockerfile para Node.js
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install 

# Copiar el código fuente dentro de la carpeta src del contenedor
COPY src/ ./src/

# Exponer el puerto
EXPOSE 3000

# Comando de inicio apuntando correctamente a la carpeta src
CMD ["node", "src/index.js"]