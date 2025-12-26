#!/bin/bash
# Garage Management App - Development Setup

echo "🚀 Starting Garage Management App Initialization..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Start PostgreSQL (Docker)
echo "🐳 Starting Database Container..."
# Ensure docker daemon is running first
docker-compose up -d

# Wait for DB to be ready
echo "⏳ Waiting for Database to be ready..."
sleep 5

# 3. Database Setup (Drizzle)
echo "🏗️ Running Database Migrations..."
npm run db:migrate

echo "🌱 Seeding Initial Data..."
npm run db:seed

# 4. Start Development Servers
echo "⚡ Starting Development Servers..."
# Using concurrently or background processes
npm run dev

# Access points info
echo "
✅ Setup Complete!
-------------------------------------------
🖥️  Frontend: http://localhost:5173
🔌  Backend API: http://localhost:3000
🗄️  Database: localhost:5432
-------------------------------------------
"
