FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY panels.json ./
COPY index.html ./
COPY server.mjs ./

ENV PORT=8080
ENV HOST=0.0.0.0
EXPOSE 8080

CMD ["node", "server.mjs"]
