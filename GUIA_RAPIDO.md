# 📖 Guia Rápido - Sistema de Parcelamento

## Para Usar (Usuário Final)

### Como Criar uma Compra Parcelada:

1. **Clique em "+ Registrar gasto"** (no Dashboard)
2. **Tipo**: Selecione "➖ Saiu" (já vem selecionado)
3. **Valor**: Digite o valor da compra (ex: 1000)
4. **Categoria**: Selecione a categoria (ex: Eletrônicos)
5. **Forma de pagamento**: **SELECIONE "Cartão"** ← IMPORTANTE!
   - Ao selecionar cartão, aparece a seção "Parcelamento"
6. **Parcelamento**: Escolha "Parcelado"
   - Campos aparecem para configurar
7. **Número de parcelas**: Digite de 2 a 12
8. **Taxa de juros**: Digite a taxa mensal em % (ex: 2.99)
   - **Vê os cálculos em tempo real:**
     - Valor de cada parcela
     - Valor total com juros
     - Quanto pagará de juros
     - **Quanto economizaria pagando à vista**
     - Dica de quanto juntar por mês para pagar sem juros
9. **Data**: Selecione a data da compra
10. **Descrição**: Opcional (ex: "Notebook para trabalho")
11. **Clique "Salvar"**

### Ver Compra Parcelada:

- Vá para **"💳 Transações"**
- Procure sua compra no extrato
- Verá indicador: **"📅 5x (2.99% a.m.)"**
  - 5x = número de parcelas
  - 2.99% a.m. = taxa de juros mensal

---

## Para Desenvolvedores

### Arquitetura do Sistema

```
Usuario seleciona "Cartão" → txMethod.addEventListener triggers
                        ↓
installmentFields aparece (display: block)
                        ↓
Usuario escolhe "Parcelado" → installmentTypeRadios listener
                        ↓
installmentDetails aparece, calculateInstallmentInfo() executa
                        ↓
DOM atualizado com cálculos (installment-amount, etc)
                        ↓
Usuario salva → installments + interestRate salvos no state
                        ↓
Recuperado do localStorage → Exibido no histórico com indicador
```

### Arquivos Principais

| Arquivo | Linhas | Função |
|---------|--------|--------|
| `index.html` | 176-213 | Formulário de parcelamento (HTML) |
| `app.js` | 123-133 | Referências DOM |
| `app.js` | 260-305 | Função de cálculo |
| `app.js` | 839-863 | Event listeners |
| `app.js` | 922-932 | Salvamento |
| `app.js` | 510-519 | Exibição no histórico |

### Fluxo de Dados

```javascript
// 1. Usuário digita valores
txAmount.value = "1000"
txInstallments.value = "5"
txInterestRate.value = "2.99"

// 2. Event listener dispara cálculo
txInstallments.addEventListener('change', calculateInstallmentInfo)

// 3. Função calcula
monthlyPayment = 218.23
totalAmount = 1091.15
interestAmount = 91.15

// 4. DOM atualiza
installmentAmount.textContent = "R$ 218,23"
installmentTotal.textContent = "R$ 1.091,15"
installmentInterest.textContent = "R$ 91,15"
installmentSavings.textContent = "R$ 91,15"

// 5. Usuário salva
txSaveBtn.click() 
  → installments = 5
  → interestRate = 2.99
  → transaction.push({ ..., installments: 5, interestRate: 2.99 })

// 6. Recuperação/Exibição
updateTransactionList()
  → if (t.installments > 1) metaText += ` • 📅 ${t.installments}x (${t.interestRate}% a.m.)`
```

### Validações

```javascript
if (type !== "expense") return;  // Só para despesa
if (txMethod.value !== "cartao") return;  // Só para cartão
if (installmentType !== "installment") return;  // Só se parcelado
if (amount <= 0) return;  // Valor válido
if (installments < 2 || installments > 12) return;  // Parcelas válidas
if (interestRate < 0) return;  // Juros não-negativos
```

### Customizações Possíveis

**Mudar limite de parcelas (de 12 para 24)**:
```html
<!-- Antes -->
<input type="number" id="tx-installments" min="2" max="12" />

<!-- Depois -->
<input type="number" id="tx-installments" min="2" max="24" />
```

**Mudar taxa de juros padrão (de 0 para 1)**:
```html
<!-- Antes -->
<input type="number" id="tx-interest-rate" min="0" step="0.01" value="0" />

<!-- Depois -->
<input type="number" id="tx-interest-rate" min="0" step="0.01" value="1" />
```

**Desabilitar sugestão de poupança**:
```javascript
// Em calculateInstallmentInfo(), comente/remova:
// if (monthsToSave > 0) {
//   installmentSuggestion.textContent = `💡 Dica: ...`;
// }
```

---

## Fórmula Matemática

### Juros Compostos
```
PMT = (PV × r × (1 + r)^n) / ((1 + r)^n - 1)

Onde:
PV = Valor principal (R$ 1.000)
r = Taxa mensal (2.99% = 0.0299)
n = Número de parcelas (5)

Exemplo:
PMT = (1000 × 0.0299 × (1.0299)^5) / ((1.0299)^5 - 1)
    = (1000 × 0.0299 × 1.1589) / (1.1589 - 1)
    = 34.65 / 0.1589
    ≈ 218,23
```

---

## Testes Rápidos

### Teste 1: Sem Juros
```
Valor: 100
Parcelas: 2
Taxa: 0%
Esperado: 50/mês, 100 total, 0 juros ✓
```

### Teste 2: Com Juros Baixos
```
Valor: 1000
Parcelas: 5
Taxa: 2%
Esperado: ~206,04/mês (calculado)
Verificação: Digite e veja o cálculo
```

### Teste 3: Parcelamento Longo
```
Valor: 5000
Parcelas: 12
Taxa: 5%
Esperado: Mostrar parcelas altas e juros significativos
```

### Teste 4: Mudança Dinâmica
```
1. Digite valor: 1000
2. Mude para 2000 → Valores devem DOBRAR
3. Mude parcelas de 5 para 10 → Valor parcela deve cair pela metade
4. Mude taxa de 0 para 2% → Valor deve aumentar
```

---

## Troubleshooting

### Problema: Seção de parcelamento não aparece
**Solução**: Certifique-se que:
- [x] Tipo de transação é "Saída" (expense)
- [x] Forma de pagamento é "Cartão"
- [x] Navegador suporta ES6

### Problema: Cálculos estão errados
**Verificação**:
1. Abra DevTools (F12)
2. Console → Digite: `calculateInstallmentInfo()`
3. Verifique valores em: `installmentAmount.textContent`

### Problema: Dados não persistem
**Solução**:
1. Verifique localStorage:
   ```javascript
   // No console:
   localStorage.getItem('financeiro-state')
   ```
2. Certifique que JSON é válido
3. Limpe localStorage e recrie transação:
   ```javascript
   localStorage.clear()
   ```

### Problema: Sugestão de economia não aparece
**Verificação**:
1. Certifique que tem histórico de gastos (12 últimas transações)
2. Se for primeira transação, sugestão usa valor padrão (100)
3. Adicione mais transações para melhorar cálculo

---

## Fatos Importantes

✅ **Funciona offline**: Usa apenas localStorage, sem API
✅ **Sem permissões**: Não acessa câmera, microfone, localização
✅ **Seguro**: Todos os dados ficam no seu navegador
✅ **Portável**: Exporte PDF dos relatórios quando necessário
✅ **Sem limite**: Quantas transações quiser

---

## Suporte

**Dúvidas sobre o sistema?**
- Verifique PARCELAMENTO.md (guia completo)
- Verifique RELATORIO_PARCELAMENTO.md (detalhes técnicos)
- Verifique CHECKLIST_PARCELAMENTO.md (implementação)

**Quer customizar?**
- Edite index.html para UI
- Edite app.js para lógica
- Edite style.css para design

---

**Versão**: 1.0 - Sistema de Parcelamento Completo
**Status**: ✅ PRONTO PARA USO
**Data**: Janeiro de 2025
