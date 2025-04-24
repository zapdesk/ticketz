# syntax=docker/dockerfile:1.7-labs

# Stage 1: Build the application
FROM node:20 AS build

WORKDIR /usr/src/app
COPY . .

RUN --mount=type=cache,target=/root/.npm \
    npm ci && npm run build

# Stage 2: Create the final image without source files
FROM node:20-alpine
ARG TICKETZ_REGISTRY_URL

WORKDIR /usr/src/app

# Install required tools
RUN apk add --no-cache wget tar postgresql-client

# Install dockerize
RUN wget -O dockerize.tar.gz https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz && \
    tar -C /usr/local/bin -xzf dockerize.tar.gz && \
    rm dockerize.tar.gz

# Copy only the necessary build artifacts from the build stage
COPY --from=build /usr/src/app/dist ./dist/
COPY --from=build /usr/src/app/node_modules ./node_modules/
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/scripts ./scripts/

# Make scripts executable
RUN chmod +x ./scripts/*.sh

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
