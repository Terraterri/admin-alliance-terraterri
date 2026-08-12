FROM node:18-alpine AS builder
WORKDIR /app

# Improve: Copy package.json first to leverage Docker layer caching for npm install
COPY package*.json ./
# Improve: Use npm ci for clean, reproducible builds
RUN npm ci

# Copy the rest of the code and build
COPY . .

# Per-environment endpoints injected at build time via --build-arg (read in
# src/utils/httpClient.js). Defaults are the PROD URLs so the existing prod
# pipeline (which passes no build-args) is unaffected.
ARG VITE_USER_ENDPOINT=https://micro-api-one.terraterri.com
ARG VITE_SERVICES_ENDPOINT=https://micro-api-two.terraterri.com
ARG VITE_MASTERS_ENDPOINT=https://micro-api-three.terraterri.com
ARG VITE_EXPOADMIN_ENDPOINT=https://expoadminapi.terraterri.com
ENV VITE_USER_ENDPOINT=$VITE_USER_ENDPOINT
ENV VITE_SERVICES_ENDPOINT=$VITE_SERVICES_ENDPOINT
ENV VITE_MASTERS_ENDPOINT=$VITE_MASTERS_ENDPOINT
ENV VITE_EXPOADMIN_ENDPOINT=$VITE_EXPOADMIN_ENDPOINT

RUN npm run build

FROM nginx:alpine
# Improve: Clean up default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config template (used by nginx:alpine natively to generate config)
COPY nginx/nginx.conf /etc/nginx/templates/default.conf.template

# Cloud Run uses port 8080 by default
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
