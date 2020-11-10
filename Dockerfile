################################
# Base
################################
FROM node:12 AS build-deps
LABEL maintainer="datapunt@amsterdam.nl"

WORKDIR /app

COPY sitemap-generator ./sitemap-generator

COPY public ./public

COPY package.json package-lock.json /app/

RUN git config --global url."https://".insteadOf git:// && \
    git config --global url."https://github.com/".insteadOf git@github.com:

RUN npm ci && \
    npm cache clean --force

RUN npm run generate:sitemap

COPY modules /app/modules

COPY .babelrc \
    .browserslistrc \
    index.ejs \
    webpack.* \
    tsconfig.* \
    favicon.png \
    /app/

COPY src /app/src
COPY test /app/test

ARG DEBUG=false
ENV DEBUG ${DEBUG}

RUN npm run build

ARG BUILD_NUMBER=0
RUN echo "build ${BUILD_NUMBER} - `date`" > ./dist/version.txt

################################
# Deploy
################################
FROM nginx:1.19-alpine

COPY scripts/startup.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/startup.sh

COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/
COPY --from=build-deps /app/dist /usr/share/nginx/html

CMD ["/usr/local/bin/startup.sh"]
