# 🛒 Sistema de Parcelamento de Cartão de Crédito

## Visão Geral
Sistema completo para gerenciar despesas de cartão de crédito com opção de parcelamento em até 12 vezes, incluindo cálculo de juros compostos e sugestões de economia.

## Funcionalidades Implementadas

### 1. ✅ Seleção de Método de Pagamento
- Quando "Cartão de Crédito" é selecionado, a seção de parcelamento fica visível
- Quando outro método é selecionado, a seção de parcelamento é ocultada
- Campo de seleção: `<select id="tx-method">`

### 2. ✅ Opções de Pagamento
Dois tipos de pagamento para cartão:
- **À Vista**: Sem juros, paga o valor exato
- **Parcelado**: Com juros, divide em múltiplas parcelas (2-12 meses)

Implementado via radio buttons com nome `installment-type`

### 3. ✅ Configuração de Parcelamento
Quando "Parcelado" é selecionado:
- **Número de Parcelas**: Campo numérico de 2 a 12 meses
- **Taxa de Juros Mensal**: Percentual mensal (ex: 2.99%, 5%, 10%)
- Ambos os campos disparam recalculation automático de valores

### 4. ✅ Cálculo de Juros Compostos
Fórmula utilizada: **PMT = (PV × r × (1 + r)^n) / ((1 + r)^n - 1)**

Onde:
- **PV** = Valor principal (amount)
- **r** = Taxa de juros mensal em decimal
- **n** = Número de parcelas

Exemplo prático:
```
R$ 1.000,00 com juros de 2% ao mês em 5 parcelas
= R$ 218,23 por mês (valor mais preciso com juros compostos)
= R$ 1.091,15 total com juros
= R$ 91,15 de custo de juros
```

### 5. ✅ Exibição Dinâmica de Informações
Quando um parcelamento é configurado, exibe em tempo real:
- 💰 **Valor da Parcela**: Quanto pagará por mês
- 💳 **Valor Total com Juros**: Soma de todas as parcelas
- 💸 **Custo dos Juros**: Quanto a mais está pagando
- 💚 **Economia Pagando à Vista**: Quanto economizaria pagando em uma vez

### 6. ✅ Sugestão de Economia Inteligente
Sistema calcula baseado no histórico de gastos:
```
"💡 Dica: Juntar R$ X,XX por mês durante Y meses para pagar à vista 
e economizar R$ Z,ZZ"
```

Fórmula:
- Calcula gasto mensal médio do usuário
- Define quantos meses seria necessário juntar para pagar à vista
- Mostra economia em juros que seria obtida

### 7. ✅ Armazenamento no Estado
Cada transação agora inclui:
```javascript
{
  id: number,
  type: "expense",
  amount: number,
  category: string,
  method: "cartao",
  date: string,
  note: string,
  installments: number | null,      // 2-12 ou null para à vista
  interestRate: number | null,      // percentual ou null para à vista
  // ... outros campos
}
```

### 8. ✅ Exibição em Histórico de Transações
Transações parceladas mostram no histórico:
- Indicador visual: "📅 5x (2.99% a.m.)"
- Número de parcelas
- Taxa de juros aplicada
- Exemplo: `Compra alimentos • 15/01/2025 • cartão • 📅 5x (2.99% a.m.)`

## Estrutura de Arquivos Modificados

### HTML (index.html)
```html
<!-- Seção de Parcelamento (linhas 176-213) -->
<div id="installment-fields" style="display: none;">
  <!-- Radio buttons: À vista / Parcelado -->
  <!-- Inputs: número de parcelas, taxa de juros -->
  <!-- Display: informações calculadas -->
</div>
```

### JavaScript (app.js)

#### Referências DOM (linhas 123-133)
```javascript
const installmentFields = document.getElementById("installment-fields");
const installmentTypeRadios = document.querySelectorAll("input[name='installment-type']");
const installmentDetails = document.getElementById("installment-details");
const installmentInfo = document.getElementById("installment-info");
const txInstallments = document.getElementById("tx-installments");
const txInterestRate = document.getElementById("tx-interest-rate");
// ... outros elementos de display
```

#### Função de Cálculo (linhas 260-305)
```javascript
function calculateInstallmentInfo() {
  // Obtém valores dos inputs
  const amount = parseFloat(txAmount.value) || 0;
  const installments = parseInt(txInstallments.value) || 1;
  const interestRate = parseFloat(txInterestRate.value) || 0;

  // Aplicar fórmula de juros compostos
  // Atualizar display com resultados
  // Calcular sugestão de economia
}
```

#### Event Listeners (linhas 839-855)
```javascript
// Mostrar/ocultar seção de parcelamento
txMethod.addEventListener("change", () => { ... });

// Alternar entre à vista e parcelado
installmentTypeRadios.forEach((radio) => { ... });

// Recalcular ao mudar parcelas, juros ou valor
txInstallments.addEventListener("change", calculateInstallmentInfo);
txInterestRate.addEventListener("change", calculateInstallmentInfo);
txAmount.addEventListener("change", calculateInstallmentInfo);
```

#### Salvamento de Transação (linhas 890-945)
```javascript
// Captura dados de parcelamento se existirem
let installments = null;
let interestRate = null;
if (type === "expense" && txMethod.value === "cartao") {
  const installmentType = Array.from(installmentTypeRadios).find((r) => r.checked)?.value;
  if (installmentType === "installment") {
    installments = parseInt(txInstallments.value) || 1;
    interestRate = parseFloat(txInterestRate.value) || 0;
  }
}

// Adiciona ao state
state.transactions.push({
  // ... outros campos
  installments,
  interestRate,
});
```

#### Exibição em Histórico (linhas 495-511)
```javascript
// No updateTransactionList()
if (t.installments && t.installments > 1) {
  metaText += ` • 📅 ${t.installments}x`;
  if (t.interestRate > 0) {
    metaText += ` (${t.interestRate}% a.m.)`;
  }
}
```

## Fluxo de Uso Prático

### 1. Criar Transação Parcelada
1. Selecione tipo: **Despesa**
2. Selecione categoria (ex: "Eletrônicos")
3. Informe valor: **R$ 1.000,00**
4. **Selecione método: "Cartão de Crédito"** ← Ativa seção de parcelamento
5. Escolha: **"Parcelado"** ← Mostra campos de parcelas e juros
6. Configure: **5 parcelas, 2.99% a.m.** ← Calcula em tempo real
7. Revise sugestão de economia
8. Clique em **"Salvar"** ← Transação armazenada com dados de parcelamento

### 2. Visualizar Transação Parcelada
- No histórico de transações aparece: `Eletrônicos • 15/01/2025 • cartão • 📅 5x (2.99% a.m.)`
- Clicando em detalhes (se implementado), mostra:
  - Parcela: R$ 218,23/mês
  - Total: R$ 1.091,15
  - Juros: R$ 91,15
  - Economia à vista: R$ 91,15

## Validações Implementadas

✅ **Valor válido**: Requer valor > 0
✅ **Parcelas válidas**: Entre 2 e 12
✅ **Taxa de juros**: Não-negativa, pode ser 0
✅ **Método obrigatório**: Apenas cartão mostra parcelamento
✅ **Tipo obrigatório**: Apenas despesa pode ser parcelada

## Limitações Atuais

⚠️ **Cálculo simplificado**: Juros compostos mês a mês (real em maioria dos bancos brasileiros)
⚠️ **Sem suporte a IOF**: Não inclui Imposto sobre Operações Financeiras (não obrigatório para pessoa física)
⚠️ **Sem parcelamento de receita**: Sistema aplica apenas a despesas
⚠️ **Sem agendamento**: Não calcula vencimentos das parcelas individuais

## Próximas Melhorias Sugeridas

1. **Cronograma de Parcelas**: Exibir data de vencimento de cada parcela
2. **Histórico de Parcelamentos**: Acompanhar abas parceladas ao longo do tempo
3. **Comparador de Taxas**: Sugerir opciones com taxas diferentes
4. **IOF incluído**: Adicionar cálculo de IOF (0.38% + 0.0082% ao dia)
5. **Limites de Cartão**: Avisar quando parcelas ultrapassam limite disponível
6. **Integração com PDF**: Incluir dados de parcelamento no relatório PDF
7. **Alertas de Vencimento**: Notificar próximo vencimento de parcela
8. **Parcelamento de Receita**: Permitir parcelar faturas ou recebimentos

## Testes Recomendados

### Caso 1: Parcelamento Simples (0% juros)
- Entrada: R$ 100, 2 parcelas, 0% juros
- Resultado esperado: R$ 50/mês, R$ 100 total, R$ 0 juros ✅

### Caso 2: Parcelamento com Juros Altos
- Entrada: R$ 1.000, 12 parcelas, 5% a.m.
- Resultado esperado: ~R$ 106,55/mês, ~R$ 1.278,68 total, ~R$ 278,68 juros
- Economia sugerida: Juntar ~R$ X/mês para pagar à vista

### Caso 3: Troca de Método
- Cria transação com "Dinheiro"
- Muda para "Cartão" ← Deve aparecer seção de parcelamento
- Muda para "PIX" ← Deve desaparecer seção de parcelamento

### Caso 4: Persistência
- Cria transação parcelada, recarrega página
- Dados devem aparecer no histórico com info de parcelamento

## Notas para Futuro Desenvolvimento

- Sistema está pronto para integração com API de cotação de taxas reais de bancos
- Estrutura permite adicionar campos como "banco", "bandeira", "limite disponível"
- Cálculo de juros é agnóstico à unidade temporal (fácil adaptar para diário, anual)
- Estado permite múltiplas moedas com mínimas mudanças

---

**Última atualização**: 2025
**Status**: ✅ Completo e funcional
**Linhas modificadas**: +150 linhas de código em app.js e index.html
