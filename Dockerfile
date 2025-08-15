# 1. Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://securepasswordgenerator-205697787261.us-east4.run.app
RUN npm run build

# 2. Production stage
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://securepasswordgenerator-205697787261.us-east4.run.app
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Next.js standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER node

EXPOSE 3000

CMD ["node", "server.js"]