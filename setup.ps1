#!/usr/bin/env pwsh
# Digital Heroes — Quick Setup Script (PowerShell)
# Run from the digital-heroes/ directory

Write-Host "`n🦸 Digital Heroes — Setup Script`n" -ForegroundColor Cyan

# Check Node.js
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
  Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
  exit 1
}
Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green

# Setup server
Write-Host "`n📦 Setting up backend..." -ForegroundColor Yellow
Set-Location server

if (-not (Test-Path "node_modules")) {
  npm install
}

Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "🗄️  Setting up database..." -ForegroundColor Yellow
npx prisma db push

Write-Host "🌱 Seeding database with demo data..." -ForegroundColor Yellow
npx tsx prisma/seed.ts

Set-Location ..

# Setup client
Write-Host "`n📦 Setting up frontend..." -ForegroundColor Yellow
Set-Location client

if (-not (Test-Path "node_modules")) {
  npm install
}

Set-Location ..

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`n🚀 To start the application:" -ForegroundColor Cyan
Write-Host "   Terminal 1 (backend):  cd server && npm run dev" -ForegroundColor White
Write-Host "   Terminal 2 (frontend): cd client && npm run dev" -ForegroundColor White
Write-Host "`n🌐 Open: http://localhost:5173" -ForegroundColor Cyan
Write-Host "`n📋 Demo accounts:" -ForegroundColor Yellow
Write-Host "   demo@digitalhero.dev  / Demo@1234" -ForegroundColor White
Write-Host "   alex@digitalhero.dev  / Hero@1234" -ForegroundColor White
Write-Host "   (All 8 hero accounts use: Hero@1234)`n" -ForegroundColor White
