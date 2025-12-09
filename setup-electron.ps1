#!/usr/bin/env powershell
# Script para configurar projeto para Electron

Write-Host "🔧 Configurando projeto para Electron..." -ForegroundColor Cyan

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Copiar arquivos para public/
Write-Host "📁 Copiando arquivos para public/..." -ForegroundColor Yellow

$filesToCopy = @('index.html', 'app.js', 'style.css', 'platform-adapter.js', 'preload.js')

foreach ($file in $filesToCopy) {
    $source = Join-Path $projectRoot $file
    $destination = Join-Path $projectRoot "public\$file"
    
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $destination -Force
        Write-Host "✅ Copiado: $file" -ForegroundColor Green
    }
}

Write-Host "✅ Configuração completa!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. npm install" -ForegroundColor Yellow
Write-Host "2. npm run electron-dev" -ForegroundColor Yellow
Write-Host ""
