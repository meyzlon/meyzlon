# ✅ Checklist de Validação: Desktop + Mobile

## 🎯 Objetivo
Validar que seu app funciona perfeitamente em 3 plataformas.

---

## 📝 Pré-requisitos

- [ ] Node.js instalado (`node -v` retorna versão)
- [ ] npm instalado (`npm -v` retorna versão)
- [ ] Git instalado (opcional)
- [ ] Para Mobile: Java instalado (`java -version`)

---

## 🌐 VERSÃO WEB (Navegador)

### Instalação
- [ ] `npm install` executado sem erros
- [ ] Pasta `node_modules` existe
- [ ] `package.json` atualizado

### Teste
- [ ] `npm start` abre em http://localhost:3000
- [ ] Interface carrega corretamente
- [ ] Tema escuro aparece
- [ ] Navegação funciona:
  - [ ] Início (Dashboard)
  - [ ] Transações
  - [ ] Relatórios
  - [ ] Metas
  - [ ] Configurações

### Funcionalidades
- [ ] **Onboarding**
  - [ ] Campos de renda e limite aparecem
  - [ ] Botão "Começar" funciona
  
- [ ] **Dashboard**
  - [ ] Resumo do mês aparece
  - [ ] Seletor de mês funciona
  - [ ] Gráfico de gastos aparece
  
- [ ] **Transações**
  - [ ] Tipo de entrada "Variável" e "Fixa" aparecem
  - [ ] Tipo de entrada é obrigatório para income
  - [ ] Campos de data/valor aparecem
  - [ ] Salvar transação registra dados
  - [ ] Transações aparecem no extrato
  
- [ ] **Metas**
  - [ ] Adicionar meta salva
  - [ ] Meta aparece na lista
  - [ ] Histório de movimentações aparece
  
- [ ] **Relatórios**
  - [ ] Gráficos aparecem
  - [ ] Seletor de mês funciona
  - [ ] Dados calculados corretamente
  
- [ ] **Dados**
  - [ ] Recarregar página mantém dados
  - [ ] localStorage tem dados salvos

---

## 🖥️ VERSÃO DESKTOP (Electron)

### Dependências
- [ ] `npm install` completou (veja node_modules)
- [ ] Electron instalado
- [ ] electron-store instalado

### Teste Desenvolvimento
- [ ] `npm run electron-dev` abre window Electron
- [ ] App carrega interface corretamente
- [ ] Funcionalidades web funcionam igual
- [ ] Dev tools (F12) abrem
- [ ] Console não mostra erros críticos

### Build
- [ ] `npm run build` gera pasta `build/`
- [ ] `npm run electron-build` cria pasta `dist/`
- [ ] Arquivo `Meu Financeiro Setup 1.0.0.exe` existe em `dist/`
- [ ] Arquivo `.exe` tem tamanho razoável (50-150MB)

### Instalação
- [ ] Clique duplo no `.exe` abre instalador
- [ ] Instalador pergunta local de instalação
- [ ] Instalador cria atalho na área de trabalho
- [ ] App abre após instalação
- [ ] Atalho na área de trabalho funciona

### Teste Pós-Instalação
- [ ] App abre corretamente
- [ ] Menu File/Edit/View/Help funciona
- [ ] Todos recursos funcionam igual à web
- [ ] Dados salvam localmente
- [ ] Fechar e reabrir mantém dados
- [ ] Sem erros no console

### Performance
- [ ] App abre em < 2 segundos
- [ ] Transições são suaves
- [ ] Não trava ao adicionar transações
- [ ] Relatórios geram rapidamente

---

## 📱 VERSÃO MOBILE (Android)

### Pré-requisitos
- [ ] Java JDK 11+ instalado (`java -version`)
- [ ] Android SDK instalado (via Android Studio)
- [ ] Android Studio funcionando (abrir e fechar)
- [ ] Emulador ou dispositivo Android físico

### Configuração Capacitor
- [ ] `capacitor.config.json` existe
- [ ] AppId está: `com.meufinanceiro.app`
- [ ] AppName está: `Meu Financeiro`

### Build
- [ ] `npm run build` gera pasta `build/`
- [ ] `npx cap sync android` sincroniza (sem erros)
- [ ] Pasta `android/` existe
- [ ] `npx cap build android` compila (leva 3-5 min)
- [ ] APK criado em `android/app/release/app-release.apk`
- [ ] Tamanho do APK é razoável (20-40MB)

### Instalação (Emulador)
- [ ] Emulador Android abre
- [ ] `adb install android/app/release/app-release.apk` instala
- [ ] App aparece em "Todos os apps"
- [ ] Ícone tem nome "Meu Financeiro"

### Instalação (Dispositivo físico)
- [ ] Dispositivo conectado via USB
- [ ] `adb devices` mostra dispositivo
- [ ] APK transferido para o celular
- [ ] Arquivo instalável abre ao tocar
- [ ] Instalação completa sem erros
- [ ] App aparece na tela inicial

### Teste Mobile
- [ ] App abre na tela inicial
- [ ] Interface carrega corretamente
- [ ] Layout responsivo para tela pequena
- [ ] Todos campos visíveis (sem scroll excessivo)
- [ ] Botões são toqueaveis (20px+ mínimo)
- [ ] Keyboard virtual não quebra layout

### Funcionalidades em Mobile
- [ ] Dashboard funciona
- [ ] Transações podem ser adicionadas
- [ ] Dados salvam (offline)
- [ ] Voltar mantém dados
- [ ] Rotação de tela funciona (se suportado)
- [ ] Sem travamentos

### Permissões
- [ ] App solicita permissões necessárias
- [ ] Aceitar permissões permite funcionamento
- [ ] App funciona mesmo sem dar permissões

---

## 🔄 Sincronização de Dados

- [ ] **Dados separados por plataforma**
  - [ ] Web tem seus dados em localStorage
  - [ ] Desktop tem seus dados em %APPDATA%
  - [ ] Mobile tem seus dados em storage do app
  - [ ] Confirmar: dados diferentes = esperado

- [ ] **Se quiser sincronizar (adicional)**
  - [ ] Pesquisar Firebase/Cloud
  - [ ] Será projeto futuro

---

## 📊 Testes de Funcionalidade

### Transações
- [ ] Adicionar entrada (variável)
- [ ] Adicionar entrada fixa com contrato
  - [ ] Mês de início aparece
  - [ ] Duração indefinida/específica funciona
  - [ ] Mês de término aparece (se específica)
- [ ] Adicionar saída simples
- [ ] Adicionar saída parcelada
  - [ ] Selecionar "Parcelado"
  - [ ] Número de parcelas aparece
  - [ ] Taxa de juros aparece
  - [ ] Cálculo de parcelas correto
- [ ] Filtrar por mês
- [ ] Filtrar por tipo
- [ ] Deletar transação

### Metas
- [ ] Adicionar meta nova
- [ ] Meta aparece na lista
- [ ] Associar transação a meta
  - [ ] Checkbox "Associar a meta" funciona
  - [ ] Dropdown de metas aparece
  - [ ] Saldo da meta atualiza
- [ ] Histórico de movimentações aparece
- [ ] Filtrar por meta no histórico

### Relatórios
- [ ] Gráfico de gastos aparece
- [ ] Gráfico de saldo aparece
- [ ] Gráfico de entradas aparece
- [ ] Tipo de gráfico muda (coluna/linha/pizza)
- [ ] Exportar PDF funciona
- [ ] PDF abre no navegador
- [ ] PDF tem dados corretos

### Configurações
- [ ] Alterar renda mensal salva
- [ ] Alterar limite gastos salva
- [ ] Adicionar categoria funciona
- [ ] Nova categoria aparece em selects

---

## 🔐 Segurança & Performance

- [ ] **Segurança**
  - [ ] Dados não viajam pela rede (offline)
  - [ ] Sem conexão com servidores externos
  - [ ] Console não mostra dados sensíveis
  - [ ] localStorage/store encriptado (electron-store faz)

- [ ] **Performance**
  - [ ] App abre em < 3 segundos
  - [ ] Dashboard renderiza em < 1 segundo
  - [ ] Gráficos carregam suavemente
  - [ ] 1000+ transações não travam
  - [ ] Uso de memória abaixo de 300MB

---

## 📱 Responsividade

Testar em tamanhos diferentes:

- [ ] **Desktop** (1920×1080)
  - [ ] Layout desktop funciona
  - [ ] Sem barras de scroll desnecessárias
  
- [ ] **Tablet** (1024×768)
  - [ ] Interface se adapta
  - [ ] Botões acessíveis
  
- [ ] **Mobile** (375×667)
  - [ ] Menu navega sem problemas
  - [ ] Campos visíveis
  - [ ] Sem scroll horizontal indesejado

---

## 🐛 Troubleshooting

Se algo falhar:

- [ ] Erro no npm install?
  - [ ] Limpar cache: `npm cache clean --force`
  - [ ] Deletar node_modules e package-lock.json
  - [ ] Rodar `npm install` novamente

- [ ] Erro no electron-build?
  - [ ] Testar: `npm run electron-dev`
  - [ ] Verificar build folder: `npm run build`
  - [ ] Ver logs do erro

- [ ] Erro no capacitor-build?
  - [ ] Verificar Java: `java -version`
  - [ ] Verificar Android: `npx capacitor doctor`
  - [ ] Limpar cache: `npx cap clean android`

---

## ✅ Conclusão

Se todos checkboxes estão marcados:

✅ **SEU APP ESTÁ PRONTO PARA PRODUÇÃO!**

Você tem:
- ✅ Versão Web (navegador)
- ✅ Versão Desktop (Windows/Mac/Linux)
- ✅ Versão Mobile (Android)

Próximas ações:
1. Compartilhar com amigos/família
2. Publicar na Play Store (Android)
3. Publicar na App Store (iOS, se Mac)
4. Fazer backup dos dados
5. Planejar próximas features

---

## 📞 Suporte

Problemas? Consulte:
- GUIA_RAPIDO_DESKTOP_MOBILE.md
- GUIA_IMPLEMENTACAO_COMPLETA.md
- GUIA_MOBILE_COMPLETO.md
- SETUP-WINDOWS.md
