FROM node:8-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY src src/
COPY build build/
COPY config config/
COPY index.html ./
COPY .babelrc ./

# Set default values for API Gateway
ARG API_GATEWAY_URL=http://localhost
ENV API_GATEWAY_URL=$API_GATEWAY_URL

ARG API_GATEWAY_PORT=3000
ENV API_GATEWAY_PORT=$API_GATEWAY_PORT

# Make environment variables available during build time
ENV NODE_ENV=production
RUN echo "window.API_GATEWAY_URL='$API_GATEWAY_URL';" > /app/src/env.js
RUN echo "window.API_GATEWAY_PORT='$API_GATEWAY_PORT';" >> /app/src/env.js

RUN npm run build:all

FROM nginx:stable

COPY --from=build /app/public/ /var/www
COPY --from=build /app/src/env.js /var/www/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Append "daemon off;" to the beginning of the configuration
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# Expose ports
EXPOSE 80

# Set the default command to execute
CMD service nginx start
