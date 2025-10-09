# syntax=docker/dockerfile:1.6

# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev
COPY --from=build /app/dist ./dist
# Expose port (Render provides $PORT)
EXPOSE 10000
CMD ["node", "dist/server.js"]
