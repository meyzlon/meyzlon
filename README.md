# 💰 Meu Financeiro - App Desktop + Mobile

> Seu controle financeiro, em 3 plataformas: Web, Desktop (Windows), Mobile (Android)

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Desktop%20%7C%20Mobile-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ O que é?

Um **aplicativo financeiro completo** que funciona em:
- 💻 **Windows/Mac/Linux** (como programa instalável)
- 📱 **Android/iOS** (como app no celular)
- 🌐 **Navegadores** (em qualquer PC/celular)

Totalmente **offline**, sem contas, sem internet, **seus dados são seus**.

---

## 🚀 Quick Start (30 segundos)

### Versão Web
```bash
npm install
npm start
```
Abre em: http://localhost:3000

### Versão Desktop (Windows)
```bash
npm run electron-build
```
Clique no `.exe` em `dist/` para instalar

### Versão Mobile (Android)
```bash
npm run build
npx cap sync android
npx cap build android
```
Instale o APK no seu celular

---

## 🎯 Recursos Principais

### 💳 Transações
- ✅ Entradas e saídas
- ✅ Entradas fixas (contrato com duração)
- ✅ Saídas parceladas (com juros)
- ✅ Categorias customizáveis
- ✅ Associar a metas

### 📊 Dashboard
- ✅ Resumo mensal (entradas, saídas, saldo)
- ✅ Gráfico de gastos por categoria
- ✅ Projeção de meses futuros
- ✅ Progresso do limite de gastos

### 📈 Relatórios
- ✅ Gráficos de gastos (coluna, linha, pizza)
- ✅ Gráfico de saldo ao longo do tempo
- ✅ Gráfico de entradas
- ✅ Exportar em PDF
- ✅ Múltiplas visualizações

### 🎯 Metas
- ✅ Criar e gerenciar metas financeiras
- ✅ Acompanhar economia
- ✅ Histórico de movimentações
- ✅ Associar transações às metas

### ⚙️ Configurações
- ✅ Definir renda mensal
- ✅ Limite de gastos
- ✅ Categorias personalizadas
- ✅ Dados pessoais

---

## 🖥️ Plataformas Suportadas

| Plataforma | Tipo | Funciona Offline? | Dados Locais? |
|-----------|------|-------------------|---------------|
| **Windows** | Electron | ✅ Sim | ✅ Sim |
| **Mac** | Electron | ✅ Sim | ✅ Sim |
| **Linux** | Electron | ✅ Sim | ✅ Sim |
| **Android** | Capacitor | ✅ Sim | ✅ Sim |
| **iOS** | Capacitor | ✅ Sim | ✅ Sim |
| **Navegador** | Web | ✅ Sim | ✅ Sim |

---

## 📱 Instalação

### Windows
1. `npm run electron-build`
2. Clique no `.exe` em `dist/`
3. Instale como qualquer programa

### Android
1. `npm run build`
2. `npx cap sync android`
3. `npx cap build android`
4. Transfira `app-release.apk` para celular
5. Toque para instalar

### Mac/Linux
1. `npm run electron-build`
2. Instale o `.dmg` (Mac) ou `.AppImage`/`.deb` (Linux)

---

## 🗂️ Documentação

| Documento | Descrição | Tempo |
|-----------|-----------|-------|
| [GUIA_RAPIDO_DESKTOP_MOBILE.md](GUIA_RAPIDO_DESKTOP_MOBILE.md) | ⭐ Comece aqui! | 10 min |
| [GUIA_IMPLEMENTACAO_COMPLETA.md](GUIA_IMPLEMENTACAO_COMPLETA.md) | Todas as plataformas | 20 min |
| [GUIA_MOBILE_COMPLETO.md](GUIA_MOBILE_COMPLETO.md) | Setup Android/iOS | 30 min |
| [VALIDACAO_DESKTOP_MOBILE.md](VALIDACAO_DESKTOP_MOBILE.md) | Checklist completo | Consultivo |
| [SETUP-WINDOWS.md](SETUP-WINDOWS.md) | Setup passo-a-passo | 15 min |
| [PUBLICACAO.md](PUBLICACAO.md) | Publicar Play Store/App Store | 20 min |
| [RESUMO-EXECUTIVO.md](RESUMO-EXECUTIVO.md) | Visão geral | 10 min |
| [INDICE_DOCUMENTACAO.md](INDICE_DOCUMENTACAO.md) | Índice completo | - |

---

## 🛠️ Tech Stack

### Frontend
- HTML5 + CSS3 + Vanilla JavaScript
- Chart.js (gráficos)
- html2pdf (exportação)

### Desktop (Electron)
- Electron 27
- electron-store (armazenamento local)
- electron-builder (criar instaladores)

### Mobile (Capacitor)
- Capacitor 5
- @capacitor/android
- @capacitor/preferences

### Build
- npm scripts
- PowerShell automation
- GitHub Actions (opcional)

---

## 📊 Arquitetura

```
┌─────────────────────────────────────┐
│      index.html (UI HTML)           │
│      style.css (Design Dark)        │
│      app.js (Lógica Principal)      │
└─────────────────────────────────────┘
           ↓        ↓        ↓
    ┌──────────┬──────────┬──────────┐
    ↓          ↓          ↓
┌─────────┐ ┌──────────┐ ┌────────┐
│  Web    │ │ Electron │ │Capacitor│
│(Browser)│ │(Desktop) │ │(Mobile) │
└─────────┘ └──────────┘ └────────┘
    ↓          ↓          ↓
┌─────────┐ ┌──────────┐ ┌────────┐
│localStorage│ electron-│ Capacitor
│           │  store   │Preferences
└─────────┘ └──────────┘ └────────┘
```

---

## 🚀 Próximos Passos

### 1. Testar agora
```bash
npm install
npm start
```

### 2. Criar desktop
```bash
npm run electron-build
```

### 3. Criar mobile (opcional)
```bash
npm run build
npx cap sync android
npx cap build android
```

### 4. Publicar (opcional)
- Play Store: [PUBLICACAO.md](PUBLICACAO.md)
- App Store: [PUBLICACAO.md](PUBLICACAO.md)

---

## 📋 Pré-requisitos

- Node.js 14+
- npm 6+
- Para Mobile: Java 11+ e Android SDK
- Para iOS: Mac com Xcode

---

## 🔒 Segurança & Privacidade

✅ **Dados locais**: Nenhum dado sai do seu dispositivo
✅ **Offline**: Funciona 100% sem internet
✅ **Sem tracking**: Sem analytics, sem cookies
✅ **Sem contas**: Sem necessidade de login
✅ **Open source**: Código aberto, você controla

---

## 📦 Estrutura

```
meu-financeiro/
├── index.html
├── app.js
├── style.css
├── main.js (Electron)
├── preload.js (Electron)
├── platform-adapter.js
├── capacitor.config.json
├── package.json
├── build.ps1 (Build automation)
└── 📚 Documentação completa
```

---

## 🤝 Contribuir

Quer melhorar? Principais areas:
- [ ] Sincronização cloud (Firebase)
- [ ] Notificações push
- [ ] Biometria (reconhecimento facial)
- [ ] Mais relatórios
- [ ] Tema claro
- [ ] Exportar em Excel
- [ ] App para Web PWA
- [ ] Otimização de performance

---

## 📞 Suporte

Problemas? Consulte:
1. [GUIA_RAPIDO_DESKTOP_MOBILE.md](GUIA_RAPIDO_DESKTOP_MOBILE.md)
2. [VALIDACAO_DESKTOP_MOBILE.md](VALIDACAO_DESKTOP_MOBILE.md)
3. Procure em outros guias

---

## 📄 Licença

MIT License - Livre para usar, modificar e distribuir

---

## 🎉 Você tem

✅ App Web (navegador)
✅ App Desktop (Windows/Mac/Linux)
✅ App Mobile (Android/iOS)
✅ Documentação completa
✅ Scripts de automação

**Comece a usar:**
```bash
npm start
```

**Crie seu programa:**
```bash
npm run electron-build
```

**Crie seu app:**
```bash
npm run build && npx cap sync android && npx cap build android
```

---

**Desenvolvido com ❤️ para controle financeiro simples e direto**

*Última atualização: Dezembro 2025*
*Versão: 1.0.0*
