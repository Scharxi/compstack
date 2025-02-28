const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  console.error('Error: ADMIN_USERNAME und ADMIN_PASSWORD müssen in der .env Datei definiert sein');
  process.exit(1);
}

async function main() {
  try {
    // Admin credentials aus .env
    const defaultUser = {
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD
    };

    // Hash the password
    const hashedPassword = await bcrypt.hash(defaultUser.password, 10);

    // Create the user
    const user = await prisma.user.upsert({
      where: { username: defaultUser.username },
      update: {},
      create: {
        username: defaultUser.username,
        password: hashedPassword,
      },
    });

    console.log('Seed erfolgreich. Admin-Benutzer erstellt:', {
      id: user.id,
      username: user.username
    });
  } catch (error) {
    console.error('Fehler beim Seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 