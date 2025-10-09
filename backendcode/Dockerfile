<<<<<<< HEAD
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production=false
=======
# syntax=docker/dockerfile:1.6

# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
>>>>>>> ad12634c8f45b8753a0d0a341a263ec26a97f936
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

<<<<<<< HEAD
# Production stage
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --production --ignore-scripts
COPY --from=builder /app/dist ./dist
=======
# --- Runtime stage ---
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev
COPY --from=build /app/dist ./dist
# Expose port (Render provides $PORT)
>>>>>>> ad12634c8f45b8753a0d0a341a263ec26a97f936
EXPOSE 10000
CMD ["node", "dist/server.js"]
