#!/bin/bash
export NODE_ENV=production

echo "Syncing database schema..."
npx prisma db push --skip-generate 2>&1 || echo "DB push skipped (schema may already be in sync)"

echo "Starting application on port ${PORT:-3000}..."
exec npx next start -p ${PORT:-3000} -H 0.0.0.0
