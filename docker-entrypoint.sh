#!/bin/sh
set -e

echo "🚌 LANSUB TRAVEL OS — Starting..."

# Run DB schema push (safe to run every time — idempotent)
echo "📦 Pushing database schema..."
npm run db:push

# Seed only if DB is empty (check if users table has rows)
echo "🌱 Checking if seed is needed..."
node -e "
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const path = process.env.DATABASE_URL.replace('file:', '');
const adapter = new PrismaBetterSqlite3({ url: path });
const prisma = new PrismaClient({ adapter });
prisma.user.count().then(count => {
  if (count === 0) {
    console.log('No users found — running seed...');
    require('child_process').execSync('npm run db:seed', { stdio: 'inherit' });
  } else {
    console.log('Database already seeded (' + count + ' users). Skipping.');
  }
  prisma.\$disconnect();
}).catch(e => { console.error(e); process.exit(1); });
"

echo "🚀 Starting Next.js server..."
exec node server.js
