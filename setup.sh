#!/bin/bash

echo "🚀 Starting initial setup..."

# Warten auf die Datenbank
echo "⏳ Waiting for database to be ready..."
sleep 10

# Prisma generieren und Datenbank aktualisieren
echo "🔄 Generating Prisma Client and pushing database..."
docker-compose exec app npx prisma generate
docker-compose exec app npx prisma db push

# Seeding der Datenbank
echo "🌱 Seeding the database..."
docker-compose exec app npx prisma db seed

echo "✅ Setup completed!" 