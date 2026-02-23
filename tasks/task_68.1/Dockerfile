FROM node:20-bookworm
WORKDIR /app

ENV HTTP_PROXY=
ENV HTTPS_PROXY=
ENV http_proxy=
ENV https_proxy=
ENV NO_PROXY=localhost,127.0.0.1,mongo
ENV no_proxy=localhost,127.0.0.1,mongo

ENV NPM_CONFIG_REGISTRY=https://registry.npmjs.org/
ENV npm_config_registry=https://registry.npmjs.org/

RUN npm i -g npm@9.9.4 --no-fund --no-audit

COPY package*.json ./

RUN npm install --no-fund --no-audit --registry=https://registry.npmjs.org/

COPY . .
EXPOSE 3000
CMD ["npm", "start"]