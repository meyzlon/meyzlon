#!/usr/bin/env powershell
# Script de Build Automático - Meu Financeiro
# Execute: .\build.ps1

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "🎯 Meu Financeiro - Sistema de Build" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$choice = Read-Host @"
Escolha o que deseja fazer:
1. 🖥️  Build Desktop (Windows)
2. 📱 Build Mobile (Android APK)
3. 🌐 Build Web (Produção)
4. 🧪 Testar Desktop (Desenvolvimento)
5. 📦 Build Completo (Web + Desktop + APK)

Digite o número:
"@

switch ($choice) {
    "1" {
        Write-Host "`n⏳ Compilando para Desktop..." -ForegroundColor Yellow
        npm run build
        if ($LASTEXITCODE -eq 0) {
            npm run electron-build
            Write-Host "`n✅ Build Desktop concluído!" -ForegroundColor Green
            Write-Host "📍 Arquivos em: dist/" -ForegroundColor Cyan
        } else {
            Write-Host "`n❌ Erro no build!" -ForegroundColor Red
        }
    }
    
    "2" {
        Write-Host "`n⏳ Compilando para Android..." -ForegroundColor Yellow
        npm run build
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Sincronizando Capacitor..." -ForegroundColor Yellow
            npx cap sync
            npm run capacitor-build
            Write-Host "`n✅ APK criado!" -ForegroundColor Green
            Write-Host "📍 Arquivo: android\app\build\outputs\apk\release\app-release.apk" -ForegroundColor Cyan
        } else {
            Write-Host "`n❌ Erro no build!" -ForegroundColor Red
        }
    }
    
    "3" {
        Write-Host "`n⏳ Compilando para Web..." -ForegroundColor Yellow
        npm run build
        Write-Host "`n✅ Build Web concluído!" -ForegroundColor Green
        Write-Host "📍 Pasta de saída: build/" -ForegroundColor Cyan
    }
    
    "4" {
        Write-Host "`n▶️  Iniciando Electron em desenvolvimento..." -ForegroundColor Yellow
        Write-Host "Pressione Ctrl+C para encerrar" -ForegroundColor Gray
        npm run electron-dev
    }
    
    "5" {
        Write-Host "`n⏳ Build Completo - Isso levará alguns minutos..." -ForegroundColor Yellow
        
        # Build web
        Write-Host "`n[1/3] Compilando Web..." -ForegroundColor Cyan
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Host "`n❌ Erro no build web!" -ForegroundColor Red
            exit
        }
        
        # Desktop
        Write-Host "`n[2/3] Compilando Desktop..." -ForegroundColor Cyan
        npm run electron-build
        
        # Mobile
        Write-Host "`n[3/3] Compilando APK..." -ForegroundColor Cyan
        npx cap sync
        npm run capacitor-build
        
        Write-Host "`n✅ Build Completo Concluído!" -ForegroundColor Green
        Write-Host "`n📦 Arquivos prontos para distribuição:" -ForegroundColor Cyan
        Write-Host "  📍 Desktop: dist/Meu Financeiro Setup 1.0.0.exe" -ForegroundColor Cyan
        Write-Host "  📍 Mobile: android\app\build\outputs\apk\release\app-release.apk" -ForegroundColor Cyan
        Write-Host "  📍 Web: build/ (pasta)" -ForegroundColor Cyan
    }
    
    default {
        Write-Host "Opção inválida!" -ForegroundColor Red
    }
}

Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "✨ Pronto para usar!" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
