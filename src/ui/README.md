# UI Components - CLT Calculator

Este diretório contém os componentes React de interface do usuário para o aplicativo de controle de jornada CLT.

## Componentes Disponíveis

### 📄 `DayRow.tsx`
Componente para exibir e editar um dia de registro de jornada.

**Props:**
- `day: DayRecord` - Registro do dia
- `onUpdate: (day: DayRecord) => void` - Callback de atualização

**Recursos:**
- ✅ Visualização de data, entrada, saída e intervalo
- ✅ Marcação de folga e feriado
- ✅ Edição inline de horários
- ✅ Destaque visual para feriados (laranja) e folgas (verde)

**Exemplo de uso:**
```tsx
import DayRow from './ui/DayRow';
import type { DayRecord } from './core/types';

const day: DayRecord = {
  date: new Date(2026, 0, 8),
  entrada: '08:00',
  saida: '17:00',
  intervaloHoras: 1,
  ehFolga: false,
  ehFeriado: false,
};

function App() {
  const handleUpdate = (updatedDay: DayRecord) => {
    console.log('Dia atualizado:', updatedDay);
  };

  return <DayRow day={day} onUpdate={handleUpdate} />;
}
```

---

### 📊 `Summary.tsx`
Componente para exibir o resumo mensal da jornada CLT.

**Props:**
- `monthlySummary: MonthlySummary` - Resumo mensal calculado
- `salarioMensal: number` - Salário mensal base
- `descontoINSS?: number` - Desconto INSS customizado (opcional)

**Recursos:**
- ✅ Exibição de horas normais e extras
- ✅ Valores de horas extras (50% e 100%)
- ✅ DSR (Descanso Semanal Remunerado)
- ✅ Valores bruto, INSS e líquido
- ✅ Formatação monetária em reais
- ✅ Layout responsivo e otimizado para impressão

**Exemplo de uso:**
```tsx
import Summary from './ui/Summary';
import { calculateMonthlySummary } from './core/calculations';

const monthlySummary = calculateMonthlySummary(days, settings);

function App() {
  return (
    <Summary 
      monthlySummary={monthlySummary}
      salarioMensal={2200}
    />
  );
}
```

---

### 🎨 `Layout.tsx` **(NOVO)**
Componente que monta o layout mensal completo integrando `DayRow` e `Summary`.

**Props:**
- `days: DayRecord[]` - Array de dias do mês
- `settings: Settings` - Configurações do trabalhador
- `salarioMensal: number` - Salário mensal base
- `descontoINSS?: number` - Desconto INSS customizado (opcional)

**Recursos:**
- ✅ Layout completo em duas colunas (dias + resumo)
- ✅ Gerenciamento de estado dos dias
- ✅ Recálculo automático do resumo (useMemo)
- ✅ Exibição do mês/ano atual
- ✅ Footer com configurações atuais
- ✅ Resumo sticky (scroll independente)
- ✅ Layout responsivo (desktop/tablet/mobile)

**Exemplo de uso:**
```tsx
import { Layout } from './ui';
import type { DayRecord, Settings } from './core/types';

const settings: Settings = {
  salarioMensal: 2200,
  horaEntradaPadrao: '08:00',
  horaSaidaPadrao: '17:00',
  intervaloPadraoHoras: 1,
  folgaPadrao: 'domingo',
  escala: '6x1',
};

const days: DayRecord[] = [
  // dias do mês...
];

function App() {
  return (
    <Layout
      days={days}
      settings={settings}
      salarioMensal={settings.salarioMensal}
    />
  );
}
```

---

## Arquivos de Estilo

### `DayRow.css`
Estilos para o componente `DayRow` usando metodologia BEM.

### `Summary.css`
Estilos para o componente `Summary` usando metodologia BEM.

### `Layout.css` **(NOVO)**
Estilos para o componente `Layout` usando metodologia BEM.
- Layout em grid de duas colunas
- Resumo sticky para facilitar visualização
- Responsivo (desktop/tablet/mobile)

---

## Integração Simplificada com Layout

**Recomendado:** Use o componente `Layout` para uma integração completa e automática:

```tsx
import { Layout } from './ui';
import { generateMonthDays } from './core/utils'; // função utilitária
import type { Settings } from './core/types';

function App() {
  const settings: Settings = {
    salarioMensal: 2200,
    horaEntradaPadrao: '08:00',
    horaSaidaPadrao: '17:00',
    intervaloPadraoHoras: 1,
    folgaPadrao: 'domingo',
    escala: '6x1',
  };

  const days = generateMonthDays(2026, 0); // Janeiro 2026

  return (
    <div className="app">
      <header>
        <h1>Controle de Jornada CLT</h1>
      </header>
      
      <Layout
        days={days}
        settings={settings}
        salarioMensal={settings.salarioMensal}
      />
    </div>
  );
}
```

---

## Notas Técnicas

- **TypeScript**: Todos os componentes são fortemente tipados
- **React**: Usa hooks (`useState`, `useMemo`) para gerenciamento de estado
- **CSS**: Classes BEM para manutenibilidade
- **Responsividade**: Layout adaptativo para mobile e desktop
- **Impressão**: Componentes otimizados para geração de PDF
- **Sem dependências externas**: Apenas React e TypeScript
- **Performance**: `useMemo` para evitar recálculos desnecessários

---

## Hierarquia de Componentes

```
App
└── Layout **(Componente principal)**
    ├── Header (mês/ano)
    ├── Content Grid
    │   ├── DayRow (lista de dias)
    │   │   └── Edição inline
    │   └── Summary (resumo mensal)
    │       └── Valores calculados
    └── Footer (configurações)
```

---

## Vantagens do Componente Layout

1. **🎯 Tudo-em-um**: Não precisa gerenciar DayRow e Summary separadamente
2. **♻️ Recalculo automático**: useMemo otimiza performance
3. **📱 Responsivo**: Layout adapta para qualquer tela
4. **🖨️ Print-ready**: Otimizado para impressão
5. **🎨 UI Profissional**: Design limpo e moderno

---

**✨ Use o componente `Layout` para uma experiência completa e integrada!**
