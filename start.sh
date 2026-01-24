#!/bin/sh
echo "Running database migrations..."
npx prisma db push --accept-data-loss
echo "Starting application..."
npm start
