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


# Optional build-time assertion. When EXPECT_HOST is supplied the build fails
# unless that string appears in the compiled bundle. The dev pipeline passes
# EXPECT_HOST=dev. so a build that silently fell back to the PROD ARG defaults
# above can never reach the dev environment. Prod passes nothing, so this is a
# no-op there and the existing prod pipeline is completely unaffected.
ARG EXPECT_HOST=
RUN if [ -n "$EXPECT_HOST" ]; then       grep -rq "$EXPECT_HOST" dist/assets/         || (echo "ERROR: expected host '$EXPECT_HOST' missing from the built bundle" && exit 1);       echo "build guard OK: '$EXPECT_HOST' found in bundle";     fi

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
