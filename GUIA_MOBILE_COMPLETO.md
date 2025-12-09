# 📱 Setup Completo: Android + iOS

## 🎯 Visão Geral

Vamos transformar seu aplicativo web em um app nativo para celular.

---

## 🤖 ANDROID (APK)

### 📋 Requisitos

1. **Node.js** (você já tem)
2. **Java JDK 11+**
   ```bash
   # Verificar se tem:
   java -version
   ```

3. **Android SDK**
   - Opção A (Fácil): Instalar **Android Studio**
   - Opção B (Avançado): Instalar só o SDK

### 📥 Passo a passo: Android Studio

**1. Baixar e instalar:**
- Acesse: https://developer.android.com/studio
- Instale normalmente (como qualquer programa)

**2. Configurar após instalação:**
- Abra Android Studio
- Va em: `File` → `Settings` → `Appearance & Behavior` → `System Settings` → `Android SDK`
- Instale:
  - Android SDK Platform 30+
  - Android SDK Build Tools
  - Android Emulator (se quiser testar)

**3. Adicionar ao PATH** (Windows):
- Tecla Windows + `X` → Sistema
- `Configurações avançadas do sistema`
- `Variáveis de Ambiente`
- Nova variável: `ANDROID_SDK_ROOT`
- Valor: `C:\Users\SeuNome\AppData\Local\Android\sdk`

**4. Criar APK:**
```bash
npm run build
npx cap sync android
npx cap build android
```

**5. Seu APK estará em:**
```
android/app/release/app-release.apk
```

**6. Instalar no celular:**
- Copie o `.apk` para o celular
- Abra o gerenciador de arquivos
- Toque no arquivo para instalar

---

## 🍎 iOS (App Store)

### 📋 Requisitos

⚠️ **Só funciona em Mac**
- Mac com Xcode instalado
- Conta Apple Developer (custa $99/ano)
- iPhone para testar (opcional)

### 📥 Passo a passo: iOS

**1. Verificar Xcode:**
```bash
xcode-select --install
```

**2. Criar app:**
```bash
npm run build
npx cap sync ios
npx cap build ios
```

**3. Abrir projeto Xcode:**
```bash
open ios/App/App.xcworkspace
```

**4. Configurar:**
- Selecione `App` no painel esquerdo
- Em `Signing & Capabilities`:
  - Team: Sua conta Apple
  - Bundle Identifier: `com.meufinanceiro.app`

**5. Testar no emulador:**
- Clique em `Play` (botão de run)
- Aguarde compilar
- App abrirá no emulador

**6. Publicar na App Store:**
- Aumentar versão em `Info.plist`
- Clique `Product` → `Archive`
- Clique `Distribute App`
- Siga os passos para App Store Connect

---

## 🔧 Configurações importantes

### `capacitor.config.json`

Você já tem configurado, mas aqui está o significado:

```json
{
  "appId": "com.meufinanceiro.app",        // ID único do app
  "appName": "Meu Financeiro",              // Nome que aparece
  "webDir": "build",                        // Pasta com código HTML/JS
  "plugins": {
    "SplashScreen": { /* Tela inicial */ },
    "Preferences": { /* Armazenamento */ }
  }
}
```

### Mudar logo/ícone

1. Crie um PNG quadrado:
   - Android: 512×512px
   - iOS: 1024×1024px

2. Coloque em: `public/icon.png`

3. Execute:
```bash
npx capacitor-generate-icons
```

---

## 📦 Publicação

### Play Store (Android)

1. Criar conta Google Play Developer ($25 uma vez)
2. Gerar certificado:
```bash
keytool -genkey -v -keystore ~/release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias meu-financeiro
```

3. Atualizar `capacitor.config.json`:
```json
"keystorePath": "~/release.jks",
"keystorePassword": "sua-senha",
"keystoreAlias": "meu-financeiro",
"keystoreAliasPassword": "sua-senha"
```

4. Fazer build:
```bash
npx cap build android --release
```

5. Upload em: https://play.google.com/console

### App Store (iOS)

1. Criar conta Apple Developer ($99/ano)
2. Em Xcode: `Product` → `Archive`
3. Clique `Distribute App`
4. Siga guia da Apple

---

## ✅ Checklist de Publicação

### Antes de publicar:

- [ ] Testar em Android físico (se possível)
- [ ] Testar em iOS físico (se Mac)
- [ ] Verificar ícone (512×512 para Android)
- [ ] Escrever descrição do app
- [ ] Preparar screenshots
- [ ] Testes de funcionalidade:
  - [ ] Adicionar transação
  - [ ] Ver relatórios
  - [ ] Dados salvam corretamente
  - [ ] Offline funciona

### Play Store:

- [ ] Criar conta Google Play Developer
- [ ] Gerar certificado
- [ ] Fazer build APK
- [ ] Upload
- [ ] Preencher detalhes
- [ ] Submeter para review (2-3 horas)

### App Store:

- [ ] Criar conta Apple Developer
- [ ] Configurar bundle ID
- [ ] Archive e Distribute
- [ ] Submeter para review (24-48h)
- [ ] Aguardar aprovação

---

## 🔄 Sincronização de dados entre plataformas

**Status atual**: ❌ Dados separados por plataforma

Se quiser sincronizar (web ↔ mobile ↔ desktop):

### Opção 1: Firebase (Recomendado)
```bash
npm install firebase
```
- Sincroniza em tempo real
- Backup automático
- Acesso de qualquer lugar

### Opção 2: Sua API própria
- Hospede em servidor
- App envia dados para servidor
- Download ao abrir

### Opção 3: iCloud/Google Drive
- Usar CloudKit (iOS)
- Usar Play Services (Android)
- Mais complexo

---

## 🚀 Próximas melhorias

### Já funciona:
✅ App offline
✅ Dados locais
✅ Dashboard com gráficos
✅ Transações e metas
✅ Relatórios

### Pode adicionar:
- [ ] Sincronização cloud
- [ ] Notificações (lembrar metas)
- [ ] Biometria (reconhecimento facial)
- [ ] Compartilhar relatórios
- [ ] Modo escuro automático

---

## 🆘 Troubleshooting

### "java -version não funciona"
```bash
# Instale Java:
# Windows: https://www.oracle.com/java/technologies/downloads/
# Ou: choco install openjdk11
```

### "Android SDK not found"
```bash
# Defina variável:
# ANDROID_SDK_ROOT = C:\Users\SeuNome\AppData\Local\Android\sdk
```

### "APK não instala"
- Verifique se são versões compatíveis
- Desinstale versão anterior
- Tente em outro celular

### "iOS não compila em Mac"
```bash
# Atualize Xcode:
xcode-select --install
```

---

## 📞 Resumo rápido

```bash
# Testar web
npm start

# Build web
npm run build

# Android
npm run build
npx cap sync android
npx cap build android
# APK em: android/app/release/app-release.apk

# iOS (só Mac)
npm run build
npx cap sync ios
npx cap build ios
# Abrir: open ios/App/App.xcworkspace
```

Pronto! Seu app está em 3 plataformas! 🚀
