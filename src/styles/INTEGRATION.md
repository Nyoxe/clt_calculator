# Guia de Integração - Estilos App CLT

## 🎨 Como Usar os Estilos no seu Projeto

### Opção 1: Import Automático (Recomendado)

Os estilos já estão sendo importados automaticamente via `index.css`:

```css
/* src/index.css */
@import './styles/app.css';
```

Você não precisa fazer nada! Os estilos já estão disponíveis. ✅

---

### Opção 2: Import Manual em Componentes

Você pode importar diretamente em componentes específicos:

```tsx
// src/components/MeuComponente.tsx
import '../styles/app.css';

function MeuComponente() {
  return (
    <div className="day-row normal-day">
      {/* seu conteúdo */}
    </div>
  );
}
```

---

## 📝 Aplicando Classes nos Componentes React

### Exemplo 1: DayRow com Classes Temáticas

```tsx
import type { DayRecord } from '../core/types';

function DayRowCustom({ day }: { day: DayRecord }) {
  // Determina a classe baseado no tipo de dia
  const getDayClass = () => {
    if (day.ehFeriado) return 'holiday';
    if (day.ehFolga) return 'folga';
    return 'normal-day';
  };

  return (
    <div className={`day-row ${getDayClass()}`}>
      <div className="day-row__date">
        {formatDate(day.date)}
      </div>
      <div className="day-row__times">
        <span>
          <span className="day-row__time-label">Entrada:</span>
          {day.entrada || '--:--'}
        </span>
        <span>
          <span className="day-row__time-label">Saída:</span>
          {day.saida || '--:--'}
        </span>
      </div>
    </div>
  );
}
```

### Exemplo 2: Resumo com Classes de Valores

```tsx
function SummaryCustom({ monthlySummary }: { monthlySummary: MonthlySummary }) {
  return (
    <div className="summary">
      <h2 className="summary__title">Resumo Mensal</h2>
      
      <div className="summary__section">
        <h3 className="summary__section-title">Horas Extras</h3>
        
        <div className="summary__item">
          <span className="summary__label">Extras 50%:</span>
          <span className="summary__value summary__value--warning">
            {monthlySummary.horasExtra50}h
          </span>
        </div>
        
        <div className="summary__item">
          <span className="summary__label">Extras 100%:</span>
          <span className="summary__value summary__value--danger">
            {monthlySummary.horasExtra100}h
          </span>
        </div>
      </div>
      
      <div className="summary__item">
        <span className="summary__label">Valor Líquido:</span>
        <span className="summary__value summary__value--total">
          {formatCurrency(monthlySummary.valorLiquido)}
        </span>
      </div>
    </div>
  );
}
```

---

## 🎯 Classes Mais Usadas

### Para Dias:

```tsx
// Dia normal
<div className="day-row normal-day">

// Feriado
<div className="day-row holiday">

// Folga
<div className="day-row folga">
```

### Para Resumo:

```tsx
// Container do resumo
<div className="summary">

// Valor normal
<span className="summary__value">

// Valor importante (azul)
<span className="summary__value summary__value--primary">

// Valor positivo (verde)
<span className="summary__value summary__value--success">

// Valor de atenção (laranja)
<span className="summary__value summary__value--warning">

// Valor negativo (vermelho)
<span className="summary__value summary__value--danger">

// Valor total (azul escuro, grande)
<span className="summary__value summary__value--total">
```

### Para Badges:

```tsx
<span className="badge badge--holiday">Feriado</span>
<span className="badge badge--folga">Folga</span>
<span className="badge badge--normal">Normal</span>
```

---

## 🛠️ Customização de Cores

Você pode customizar as cores criando um arquivo CSS adicional:

```css
/* src/styles/custom.css */

:root {
  /* Sobrescreve cores padrão */
  --color-holiday: #ffe0e0;        /* Vermelho mais suave */
  --color-folga: #d0e8ff;          /* Azul mais suave */
  --color-primary: #1565c0;        /* Azul mais escuro */
}
```

E importar no `index.css`:

```css
@import './styles/app.css';
@import './styles/custom.css';  /* Suas customizações */
```

---

## 📱 Responsividade Automática

Os estilos são automaticamente responsivos. Não precisa fazer nada:

- **Desktop (> 1024px)**: Layout completo
- **Tablet (768px - 1024px)**: Grid adaptado
- **Mobile (< 768px)**: Layout empilhado

---

## 🖨️ Impressão

Os estilos estão otimizados para impressão. Para imprimir:

```tsx
function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return <button onClick={handlePrint}>Imprimir</button>;
}
```

---

## 💡 Dicas

### 1. **Combine classes para efeitos especiais:**

```tsx
<div className="day-row holiday mb-md">
  {/* Feriado com margem inferior */}
</div>
```

### 2. **Use classes utilitárias:**

```tsx
<div className="text-center text-bold">
  Texto centralizado e negrito
</div>
```

### 3. **Variáveis CSS em inline styles:**

```tsx
<div style={{ color: 'var(--color-primary)' }}>
  Texto com cor primária
</div>
```

---

## 🔍 Ver Exemplo Visual

Abra o arquivo `src/styles/example.html` no navegador para ver todos os estilos em ação!

---

**✨ Pronto! Os estilos já estão funcionando no seu app!**
