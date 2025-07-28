#!/bin/bash
# Exit on error
set -e

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Install Node.js dependencies and run build
echo "Installing Node.js dependencies and building..."
npm install && npm run build

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Build completed successfully!"

exit 0
