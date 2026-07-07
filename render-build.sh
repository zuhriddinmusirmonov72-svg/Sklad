#!/usr/bin/env sh

# Exit on error
set -e

echo "Starting build process..."

# Install dependencies
npm ci

echo "Generating Prisma Client..."
npx prisma generate

echo "Building NestJS application..."
npm run build

echo "Build complete!"
