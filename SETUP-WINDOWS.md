# 🪟 Guia de Setup no Windows - Meu Financeiro

## ✅ Requisitos

- ✔️ Windows 10 ou 11
- ✔️ 4GB RAM mínimo
- ✔️ 500MB de espaço livre
- ✔️ Conexão com internet (para primeira instalação)

## 📥 Passo 1: Instalar Node.js (5 min)

1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS** (recomendada)
3. Execute o instalador
4. Marque "Add to PATH" durante a instalação
5. Conclua a instalação

### Verificar instalação:
Abra PowerShell e execute:
```powershell
node --version
npm --version
```

Deve mostrar versões (ex: v18.17.0)

## 🚀 Passo 2: Setup da Aplicação (10 min)

### 2.1 Abrir PowerShell
- Pressione `Win + X`
- Selecione "Windows PowerShell (Admin)"

### 2.2 Navegar até a pasta
```powershell
cd C:\Users\SEU-USUARIO\Desktop\meu-financeiro
```

### 2.3 Instalar dependências
```powershell
npm install
```

⏳ Isso levará 5-10 minutos na primeira vez.

## 🖥️ Passo 3: Testar no Navegador (2 min)

### Iniciar servidor web:
```powershell
npm start
```

- Abre automaticamente em `http://localhost:3000`
- Pode editar o código e recarrega sozinho
- Pressione `Ctrl+C` para parar

## 💻 Passo 4: Testar no Desktop (Electron)

### Iniciar aplicação:
```powershell
npm run electron-dev
```

- Abre uma janela nativa do Windows
- Funciona como programa instalado
- Mesma funcionalidade do navegador

## 📦 Passo 5: Criar Instalador

### Build para distribuição:
```powershell
npm run electron-build
```

⏳ Demora 3-5 minutos.

### Resultado:
Na pasta `dist/` você terá:

```
dist/
├── Meu Financeiro Setup 1.0.0.exe    ← Instalador (recomendado)
├── Meu Financeiro 1.0.0.exe          ← Portável (sem instalação)
└── builder-effective-config.yaml
```

### Como usar:

**Instalador** (Meu Financeiro Setup.exe):
- Duplo clique
- Segue o assistente
- Atalhos na área de trabalho e menu Iniciar

**Portável** (Meu Financeiro.exe):
- Copia em qualquer lugar
- Não precisa instalar
- Roda direto

## 📱 Passo 6: Criar APK para Android (30 min)

### 6.1 Instalar Android Studio
1. Acesse: https://developer.android.com/studio
2. Faça download
3. Execute o instalador
4. Deixe instalar com configurações padrão
5. **Importante**: Anote a pasta de instalação

### 6.2 Configurar variáveis de ambiente
1. Pressione `Win + X` → "Sistema"
2. "Configurações avançadas do sistema"
3. "Variáveis de ambiente"
4. Clique "Novo" (Variáveis do sistema)

Crie 2 variáveis:

**ANDROID_HOME**
- Nome: `ANDROID_HOME`
- Valor: `C:\Users\SEU-USUARIO\AppData\Local\Android\Sdk`

**ANDROID_SDK_ROOT**
- Nome: `ANDROID_SDK_ROOT`
- Valor: `C:\Users\SEU-USUARIO\AppData\Local\Android\Sdk`

Clique OK e feche as abas.

### 6.3 Compilar APK
No PowerShell:
```powershell
npm run build
npx cap init
npx cap add android
npm run capacitor-build
```

⏳ Primeira vez demora ~15 min.

### Resultado:
```
android\app\build\outputs\apk\release\app-release.apk
```

## 📲 Passo 7: Instalar APK no Celular

### Opção A: Via Conexão USB

1. Conecte o Android ao PC
2. Ative "Modo Desenvolvedor" no celular:
   - Configurações → Sobre → Número da compilação (toque 7x)
   - Volta → Opções de desenvolvedor → Ativar depuração USB

3. No PowerShell:
```powershell
adb install -r android\app\build\outputs\apk\release\app-release.apk
```

4. Pronto! App instalado no celular

### Opção B: Via WhatsApp/Email

1. Copie o arquivo `.apk` para o celular
2. Abre nos arquivos do Android
3. Toca no APK
4. Confirma instalação

**Aviso**: Pode pedir "Fontes desconhecidas"
- Vá em Configurações → Segurança
- Ativa "Fontes desconhecidas"
- Tenta instalar novamente

## 🎯 Checklist Final

- [ ] Node.js instalado
- [ ] Pasta `meu-financeiro` preparada
- [ ] `npm install` concluído
- [ ] `npm start` funciona no navegador
- [ ] `npm run electron-dev` abre programa
- [ ] `.exe` criado com sucesso
- [ ] APK criado (opcional)
- [ ] APK instalado no celular (opcional)

## 🆘 Problemas Comuns

### "npm: comando não encontrado"
- Feche o PowerShell
- Abra novamente como Admin
- Ou reinicie o PC após instalar Node.js

### "Electron não abre"
```powershell
npm install
npm run electron-dev
```

### "APK muito grande"
- Normal, pode ter 60-100MB
- Inclui navegador web embutido

### "Erro ao instalar APK"
- Verifique "Fontes desconhecidas"
- Desinstale versão anterior se existir
- Use: `adb uninstall com.meufinanceiro.app`

### "Android Studio não encontrado"
```powershell
# Procure por: C:\Program Files\Android\Android Studio
# Ajuste ANDROID_HOME se necessário
```

## 🚀 Próximos Passos

1. ✅ Distribuir `.exe` para outros usuários Windows
2. ✅ Distribuir `.apk` para usuários Android
3. ✅ Publicar na Google Play Store (futuro)
4. ✅ Atualizar versão conforme melhora a app

## 📞 Suporte

Se tiver problemas:
1. Leia este guia novamente
2. Verifique os "Problemas Comuns"
3. Google: "como [seu problema]"
4. Stack Overflow: mesma busca

---

**Parabéns! Sua app está pronta para usar em PC e celular! 🎉**
