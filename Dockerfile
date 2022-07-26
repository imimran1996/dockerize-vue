ARG PORT=8081

FROM node:latest as build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:latest as production-stage
WORKDIR /app
ARG PORT
ENV PORT = ${PORT}
EXPOSE 8081
COPY --from=build-stage /app/dist   ./dist
COPY --from=build-stage /app/server ./server
COPY --from=build-stage /app/package*.json ./
RUN npm ci --only=production
CMD ["node", "server/server.js"]
