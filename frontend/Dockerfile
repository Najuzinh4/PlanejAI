# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm ci || npm install
COPY . .
# Expose API URL at build time (default localhost)
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Run stage
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve vite >/dev/null 2>&1 || true
EXPOSE 4173
# Use vite preview to serve built files (fast, supports SPA routing)
CMD ["npx","vite","preview","--host","0.0.0.0","--port","4173","--strictPort"]