# syntax=docker/dockerfile:1.7-labs

# Use multi-stage build for development
FROM node:20 AS build

# Set working directory
WORKDIR /usr/src/app

# Trust npm registry and disable strict SSL
RUN npm config set strict-ssl false
RUN npm config set registry http://registry.npmjs.org/

# Copy package files
COPY package*.json ./

# Install dependencies
RUN --mount=type=cache,target=/root/.npm \
    npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:20-alpine
ARG TICKETZ_REGISTRY_URL

WORKDIR /usr/src/app

# Install required tools
RUN apk add --no-cache wget tar postgresql-client

# Install dockerize
RUN wget -O dockerize.tar.gz https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz && \
    tar -C /usr/local/bin -xzf dockerize.tar.gz && \
    rm dockerize.tar.gz

# Trust npm registry and disable strict SSL
RUN npm config set strict-ssl false
RUN npm config set registry http://registry.npmjs.org/

# Copy built files from build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/scripts ./scripts

# Copy additional required files
COPY ./src/libs/wbot.ts ./src/libs/
COPY ./src/queues.ts ./src/
COPY ./src/server.ts ./src/
COPY ./src/app.ts ./src/
COPY ./src/bootstrap.ts ./src/
COPY ./src/waversion.json ./src/

# Make scripts executable (only if scripts directory exists)
RUN if [ -d "./scripts" ]; then chmod +x ./scripts/*.sh; fi

ENV NODE_ENV=production
ENV PORT=3000
ENV TICKETZ_REGISTRY_URL=${TICKETZ_REGISTRY_URL}

EXPOSE 3000

# Create startup script
COPY <<EOF /usr/src/app/start.sh
#!/bin/sh
set -e

echo "Waiting for database..."
dockerize -wait tcp://\${DB_HOST}:5432 -timeout 60s

echo "Running database migrations..."
npx sequelize db:migrate --config dist/config/database.js --migrations-path dist/database/migrations

echo "Running database seeds..."
npx sequelize db:seed:all --config dist/config/database.js --seeders-path dist/database/seeds

echo "Starting application..."
node dist/server.js
EOF

RUN chmod +x /usr/src/app/start.sh

CMD ["/bin/sh", "/usr/src/app/start.sh"]
