FROM node:16-alpine
WORKDIR /app
EXPOSE 3000


COPY package.json package-lock.json ./
RUN npm install npm ci --legacy-peer-deps --no-audit --prefer-offline


CMD ["npm", "run", "start:docker"]


# docker build -t m65535/web-node:16-alpine -f build/app/Dockerfile .