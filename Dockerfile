FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS dependencies
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Coolify & Live Site URLs passed at build time so prebuild can snapshot live data
ARG COOLIFY_URL
ARG COOLIFY_FQDN
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_APP_URL
ARG LIVE_SITE_URL

ENV COOLIFY_URL=$COOLIFY_URL
ENV COOLIFY_FQDN=$COOLIFY_FQDN
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV LIVE_SITE_URL=$LIVE_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATA_DIR="/app/data"

# Create persistent volume mount directory and immutable seed directory
RUN mkdir -p /app/data /app/data/uploads /app/data-seed /app/public/uploads

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/data-seed ./data-seed
COPY --from=builder /app/data ./data

VOLUME ["/app/data"]

EXPOSE 3000
CMD ["npm", "run", "start"]
