# 🎯 Guia Rápido: Do Código ao Aplicativo

## ✅ Passo 1: Preparar o Ambiente (5 min)

### Para Windows:
1. Instale [Node.js](https://nodejs.org/) versão 16 ou maior
2. Abra PowerShell e vá até a pasta do projeto:
   ```powershell
   cd C:\Users\Seu-Usuario\Desktop\meu-financeiro
   ```
3. Instale as dependências:
   ```powershell
   npm install
   ```

## 💻 Passo 2: Rodar no Desktop (Electron)

### Desenvolvimento (com hot reload):
```powershell
npm run electron-dev
```
- Abre automaticamente a aplicação
- Muda o código? Recarrega sozinho!

### Criar instalador para Windows:
```powershell
npm run electron-build
```

Após concluir, você terá:
- **Instalador**: `dist/Meu Financeiro Setup 1.0.0.exe` 
  - Duplo clique para instalar normalmente
- **Portable**: `dist/Meu Financeiro 1.0.0.exe`
  - Não precisa instalar, roda direto

## 📱 Passo 3: Criar APK para Android (15 min)

### Pré-requisitos:
1. Instale [Android Studio](https://developer.android.com/studio)
2. Configure as variáveis de ambiente (durante instalação)

### Build do APK:
```powershell
npm run build
npx cap init
npx cap add android
npm run capacitor-build
```

O APK estará em:
```
android\app\build\outputs\apk\release\app-release.apk
```

### Instalar no Celular:
1. Ative "Fontes desconhecidas" nas configurações do Android
2. Conecte o celular ao PC
3. Execute:
   ```powershell
   adb install -r android\app\build\outputs\apk\release\app-release.apk
   ```

## 🎨 Passo 4: Personalizar (Opcional)

### Mudar ícone da aplicação:
1. Crie uma imagem 512x512px em PNG
2. Coloque em: `assets/icon.png`
3. Recompile com `npm run electron-build`

### Mudar nome da app:
No `package.json`, mude:
```json
{
  "name": "seu-novo-nome",
  "productName": "Seu Novo Nome Bonito"
}
```

## 📊 Resultado Final

Você terá:

✅ **Programa Desktop** (`Meu Financeiro.exe`)
- Funciona em Windows, Mac, Linux
- Instalável ou portável
- Dados sincronizados automaticamente

✅ **App Mobile** (`app-release.apk`)
- Instala em qualquer Android 6.0+
- Interface responsiva
- Mesmos dados do desktop

✅ **Versão Web**
- Acessa em qualquer navegador
- `http://localhost:3000` (desenvolvimento)

## 🚀 Distribuir

### Para Desktop:
- Compartilhe o `.exe` do folder `dist/`
- Ou suba para um servidor de download
- Usuários fazem download e executam

### Para Mobile:
- Opção 1: Compartilhe o APK por WhatsApp/Email
- Opção 2: Publique na Google Play Store
- Opção 3: Distribuir via Google Drive com instruções

## 💡 Dicas

1. **Teste tudo** antes de distribuir
   - Rode no seu celular/computador
   - Verifique se os dados salvam corretamente

2. **Para distribuição em massa**:
   - Crie um certificado assinado para Android
   - Configure as credenciais no `capacitor.config.json`

3. **Atualizações futuras**:
   - Mude a versão em `package.json`
   - Rode `npm run electron-build` novamente
   - Distribua o novo `.exe`

## ❓ Troubleshooting

### "npm não encontrado"
- Reinstale Node.js, certifique-se de adicionar ao PATH

### APK muito grande
- Normal, inclui navegador web embutido
- Tamanho típico: 50-100MB

### Electron não abre
- Tente: `npm install` novamente
- Delete `node_modules` e rode novamente

## 📞 Próximos Passos

1. ✅ Teste no seu desktop agora
2. ✅ Teste no seu celular
3. ✅ Compartilhe com amigos
4. ✅ Recolha feedback e melhore

Sucesso! 🎉
