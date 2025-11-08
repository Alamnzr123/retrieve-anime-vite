# Multi-stage Dockerfile
# 1) build app with Node
# 2) serve static files with nginx (small runtime)

FROM node:20.19.0-bullseye-slim AS builder
WORKDIR /app

# keep PATH for local node_modules binaries
ENV PATH /app/node_modules/.bin:$PATH

# copy package manifests first for better cache
COPY package.json package-lock.json ./

# install deps (use legacy-peer-deps if your lockfile needs it in CI)
RUN npm ci --legacy-peer-deps

# copy source and build
COPY . .
RUN npm run build

### production image
FROM nginx:stable-alpine

# copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# copy nginx config for SPA routing
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
