# 💰 Meu Financeiro - Aplicação Multiplataforma

Aplicação de controle financeiro pessoal disponível para Desktop (Windows, Mac, Linux) e Mobile (Android, iOS).

## 🚀 Instalação Rápida

### Pré-requisitos
- Node.js 16+ e npm
- Para Desktop: Electron será instalado automaticamente
- Para Mobile: Android Studio (para APK) ou XCode (para iOS)

### 1️⃣ Setup Inicial

```bash
cd meu-financeiro
npm install
```

## 💻 Para Desktop (Electron)

### Desenvolvimento
```bash
npm run electron-dev
```
Abre automaticamente a aplicação em modo desenvolvimento.

### Build para Distribuição
```bash
npm run electron-build
```

Gera instaladores para:
- **Windows**: `dist/Meu Financeiro Setup 1.0.0.exe` (instalador) + `.exe` portável
- **macOS**: `dist/Meu Financeiro-1.0.0.dmg`
- **Linux**: `dist/Meu Financeiro-1.0.0.AppImage` + `.deb`

## 📱 Para Mobile (Android)

### 1. Setup Inicial do Capacitor
```bash
npm install @capacitor/core @capacitor/android @capacitor/app @capacitor/filesystem @capacitor/preferences
npx cap init
npx cap add android
```

### 2. Desenvolvimento
```bash
npm run capacitor-dev
```

### 3. Build APK
```bash
npm run capacitor-build
```

O APK estará em: `android/app/build/outputs/apk/release/app-release.apk`

### 4. Instalar em Dispositivo
```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

## 🔄 Recursos Multiplataforma

### Desktop (Electron)
✅ Menu nativo (Arquivo, Editar, Exibir)  
✅ Armazenamento seguro no disco  
✅ Suporte offline completo  
✅ Atalhos de teclado (Ctrl+Q para sair, Ctrl+Dev para DevTools)  
✅ Ícone na bandeja do sistema  

### Mobile (Capacitor)
✅ Interface responsiva para celular/tablet  
✅ Sincronização com localStorage  
✅ Exportação de PDFs  
✅ Compatibilidade com Android 6.0+  

## 📁 Estrutura do Projeto

```
meu-financeiro/
├── index.html              # Interface Web
├── app.js                  # Lógica principal
├── style.css               # Estilos
├── platform-adapter.js     # Adaptação de plataforma
├── main.js                 # Entry point Electron
├── preload.js              # Segurança Electron
├── package.json            # Dependências
├── capacitor.config.json   # Config Capacitor
└── android/                # Projeto Android (Capacitor)
    └── app/
        ├── build/
        └── src/
```

## 🔐 Segurança

- **Desktop**: Context isolation ativado, sem acesso direto ao Node.js
- **Mobile**: Sandbox do Capacitor protege o acesso a APIs nativas
- **Dados**: Armazenamento local, sem envio para servidores

## 📝 Comandos Úteis

### Development
| Comando | Descrição |
|---------|-----------|
| `npm run electron-dev` | Inicia app desktop com hot reload |
| `npm run capacitor-dev` | Inicia servidor de dev para mobile |
| `npm start` | Inicia servidor web padrão (port 3000) |

### Build & Distribution
| Comando | Descrição |
| `npm run electron-build` | Cria instaladores desktop |
| `npm run capacitor-build` | Cria APK android |
| `npm run build` | Build web otimizado |

### Manutenção
| Comando | Descrição |
| `npm install` | Instala todas as dependências |
| `npm update` | Atualiza pacotes |

## 🎯 Roadmap

- [ ] Sincronização na nuvem com backend
- [ ] Export de dados (CSV, Excel)
- [ ] Suporte a iOS
- [ ] Análise de gastos com IA
- [ ] Integração bancária
- [ ] Notificações de parcelas pendentes

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se você tem as versões corretas instaladas
2. Execute `npm install` novamente
3. Para Electron, tente apagar `node_modules` e reinstalar
4. Para Android, limpe com `./gradlew clean`

## 📄 Licença

MIT - Uso livre para projetos pessoais e comerciais
