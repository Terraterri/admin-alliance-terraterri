FROM node:18-alpine AS builder
WORKDIR /app

# Improve: Copy package.json first to leverage Docker layer caching for npm install
COPY package*.json ./
# Improve: Use npm ci for clean, reproducible builds
RUN npm ci

# Copy the rest of the code and build
COPY . .
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
