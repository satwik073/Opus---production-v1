# Use Node 20 LTS
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies (try npm ci, fallback to npm install)
COPY package*.json ./
RUN npm ci --silent || npm install --silent

# Copy source and build
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Use built-in 'node' user from the base image instead of creating a new one
# Ensure /app is owned by 'node' so the non-root user can run the app
RUN chown -R node:node /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev --silent || npm install --omit=dev --silent

# Copy built app and static assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
USER node

# Start the Next.js server (expects a "start" script in package.json)
CMD ["npm", "start"]
