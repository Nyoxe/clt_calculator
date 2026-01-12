# Estilos - CLT Calculator

Esta pasta contém arquivos CSS globais e temáticos para o aplicativo.

## Arquivos

### `app.css` - Estilos Temáticos do App

Arquivo CSS principal com classes para estilização do app de controle CLT.

## Classes Disponíveis

### 🏠 Container Principal

```css
.app
```
Container principal da aplicação com max-width, padding e fundo.

### 📅 Linha de Dia

```css
.day-row
```
Linha de registro de um dia com layout em grid.

**Variações:**
- `.day-row.holiday` - Destaque para feriados (vermelho claro)
- `.day-row.folga` - Destaque para folgas (azul claro)
- `.day-row.normal-day` - Dia normal (branco)

### 🎯 Estados Especiais

```css
.holiday    /* Feriado - Fundo vermelho claro + emoji 🎉 */
.folga      /* Folga - Fundo azul claro + emoji 😴 */
.normal-day /* Dia normal - Fundo branco */
```

### 📊 Resumo Mensal

```css
.summary                  /* Container do resumo */
.summary__title          /* Título do resumo */
.summary__section        /* Seção do resumo */
.summary__section-title  /* Título de seção */
.summary__item           /* Item do resumo */
.summary__label          /* Label do item */
.summary__value          /* Valor do item */
```

**Valores com destaque:**
```css
.summary__value--primary  /* Valor primário (azul) */
.summary__value--success  /* Valor positivo (verde) */
.summary__value--warning  /* Valor de atenção (laranja) */
.summary__value--danger   /* Valor negativo (vermelho) */
.summary__value--total    /* Valor total (azul escuro, maior) */
```

### 📋 Lista de Dias

```css
.days-list         /* Container da lista */
.days-list__header /* Cabeçalho da lista */
```

### 📊 Tabela de Dias (Alternativa)

```css
.days-table    /* Tabela de dias */
.days-table th /* Cabeçalho da tabela */
.days-table td /* Célula da tabela */
```

### 🏷️ Badges

```css
.badge           /* Badge base */
.badge--holiday  /* Badge de feriado */
.badge--folga    /* Badge de folga */
.badge--normal   /* Badge normal */
```

## Variáveis CSS

O arquivo usa CSS Custom Properties para facilitar customização:

```css
/* Cores de destaque */
--color-holiday: #ffebee;        /* Vermelho claro */
--color-folga: #e3f2fd;          /* Azul claro */
--color-normal: #ffffff;         /* Branco */

/* Cores principais */
--color-primary: #2196f3;
--color-success: #4caf50;
--color-warning: #ff9800;
--color-danger: #f44336;

/* Espaçamentos */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

## Exemplos de Uso

### Exemplo 1: Dia Normal

```html
<div class="day-row normal-day">
  <div class="day-row__date">Seg, 06/01/2026</div>
  <div class="day-row__times">
    <span><span class="day-row__time-label">Entrada:</span> 08:00</span>
    <span><span class="day-row__time-label">Saída:</span> 17:00</span>
  </div>
</div>
```

### Exemplo 2: Feriado

```html
<div class="day-row holiday">
  <div class="day-row__date">Qua, 01/01/2026</div>
  <div class="day-row__times">
    <span>Ano Novo</span>
  </div>
</div>
```

### Exemplo 3: Folga

```html
<div class="day-row folga">
  <div class="day-row__date">Dom, 12/01/2026</div>
  <div class="day-row__times">
    <span>Folga Semanal</span>
  </div>
</div>
```

### Exemplo 4: Resumo

```html
<div class="summary">
  <h2 class="summary__title">Resumo Mensal</h2>
  
  <div class="summary__section">
    <h3 class="summary__section-title">Horas</h3>
    
    <div class="summary__item">
      <span class="summary__label">Horas Normais:</span>
      <span class="summary__value">176.00h</span>
    </div>
    
    <div class="summary__item">
      <span class="summary__label">Horas Extras 50%:</span>
      <span class="summary__value summary__value--warning">12.50h</span>
    </div>
  </div>
  
  <div class="summary__section">
    <h3 class="summary__section-title">Valores</h3>
    
    <div class="summary__item">
      <span class="summary__label">Valor Líquido:</span>
      <span class="summary__value summary__value--total">R$ 2.705,00</span>
    </div>
  </div>
</div>
```

### Exemplo 5: Badges

```html
<span class="badge badge--holiday">Feriado</span>
<span class="badge badge--folga">Folga</span>
<span class="badge badge--normal">Normal</span>
```

## Responsividade

O CSS é totalmente responsivo:

- **Desktop (> 1024px)**: Layout completo com grid de 2 colunas
- **Tablet (768px - 1024px)**: Grid adaptado, resumo abaixo
- **Mobile (< 768px)**: Layout em coluna única, componentes empilhados

## Impressão

Otimizado para impressão com:
- Remoção de sombras e efeitos hover
- Quebras de página adequadas
- Fundo branco para economia de tinta

## Como Importar

### No componente React:

```tsx
import '../styles/app.css';
```

### No arquivo principal (`main.tsx`):

```tsx
import './styles/app.css';
```

## Customização

Para customizar cores, altere as variáveis CSS no topo do arquivo:

```css
:root {
  --color-holiday: #ffebee;  /* Sua cor para feriados */
  --color-folga: #e3f2fd;    /* Sua cor para folgas */
  /* ... outras variáveis ... */
}
```

## Classes Utilitárias

```css
/* Margem */
.mb-sm, .mb-md, .mb-lg

/* Padding */
.p-sm, .p-md, .p-lg

/* Texto */
.text-primary, .text-secondary, .text-center, .text-bold

/* Exibição */
.hidden, .visible
```

---

**💡 Dica:** Use as variáveis CSS para manter consistência visual em toda a aplicação!
