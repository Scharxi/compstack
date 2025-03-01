# PowerShell-Skript für die initiale Einrichtung

Write-Host "🚀 Starting initial setup..." -ForegroundColor Green

# Container neu bauen und starten
Write-Host "🏗️ Building and starting containers..." -ForegroundColor Yellow
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Warten auf die Datenbank
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Prisma generieren und Datenbank aktualisieren
Write-Host "🔄 Setting up Prisma..." -ForegroundColor Cyan
docker-compose exec app npx prisma generate
Write-Host "🔄 Pushing database schema..." -ForegroundColor Cyan
docker-compose exec app npx prisma db push

# Seeding der Datenbank
Write-Host "🌱 Seeding the database..." -ForegroundColor Magenta
docker-compose exec app npx prisma db seed

Write-Host "✅ Setup completed!" -ForegroundColor Green
Write-Host "🌐 The application is now available at http://localhost:3000" -ForegroundColor Green 