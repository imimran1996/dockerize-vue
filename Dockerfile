ARG PORT=8081

FROM node:latest as build-stage
WORKDIR /vue
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:latest as production-stage
WORKDIR /vue
ARG PORT
ENV PORT = ${PORT}
EXPOSE 8081
COPY --from=build-stage /vue/dist   ./dist
COPY --from=build-stage /vue/server ./server
COPY --from=build-stage /vue/package*.json ./
RUN npm ci --only=production
CMD ["node", "server/server.js"]
