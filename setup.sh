#!/bin/bash

# Color definitions
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Print with color
echo -e "${GREEN}🚀 Starting initial setup...${NC}"

# Build and start containers
echo -e "${YELLOW}🏗️  Building and starting containers...${NC}"
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Wait for database
echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
sleep 15

# Generate Prisma and update database
echo -e "${CYAN}🔄 Setting up Prisma...${NC}"
docker-compose exec -T app npx prisma generate
echo -e "${CYAN}🔄 Pushing database schema...${NC}"
docker-compose exec -T app npx prisma db push

# Seed the database
echo -e "${MAGENTA}🌱 Seeding the database...${NC}"
docker-compose exec -T app npx prisma db seed

echo -e "${GREEN}✅ Setup completed!${NC}"
echo -e "${GREEN}🌐 The application is now available at http://localhost:3000${NC}" 