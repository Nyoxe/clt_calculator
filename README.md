# CLT Calculator 📊

Aplicativo pessoal para controle de jornada CLT (Consolidação das Leis do Trabalho) com cálculo automático de horas extras, DSR e folha de pagamento.

## 🚀 Tecnologias

- **React 19** - Biblioteca para construção da UI
- **TypeScript** - Tipagem estática e segurança de tipos
- **Vite** - Build tool moderna e rápida
- **CSS Vanilla** - Estilos sem frameworks externos

## 📁 Estrutura do Projeto

```
CLT_calculator/
├── src/
│   ├── core/                    # Lógica de negócio e cálculos
│   │   ├── types.ts            # Tipos TypeScript
│   │   ├── calculations.ts     # Cálculos de jornada
│   │   ├── payroll.ts          # Cálculos de folha de pagamento
│   │   └── time.ts             # Funções de manipulação de tempo
│   ├── ui/                      # Componentes React
│   │   ├── DayRow.tsx          # Componente de linha de dia
│   │   ├── DayRow.css
│   │   ├── Summary.tsx         # Componente de resumo mensal
│   │   ├── Summary.css
│   │   ├── Layout.tsx          # Layout mensal completo ✨
│   │   ├── Layout.css
│   │   ├── README.md           # Documentação dos componentes
│   │   └── index.ts            # Exports dos componentes
│   ├── styles/                  # Estilos temáticos ✨
│   │   ├── app.css             # Estilos principais do app
│   │   ├── README.md           # Documentação de classes CSS
│   │   ├── INTEGRATION.md      # Guia de integração
│   │   └── example.html        # Exemplo visual
│   ├── App.tsx                 # Componente principal ✨
│   ├── App.example.tsx         # Exemplos de customização ✨
│   ├── main.tsx                # Ponto de entrada
│   └── index.css               # Estilos globais
├── index.html                  # Template HTML
├── vite.config.ts              # Configuração do Vite
├── tsconfig.json               # Configuração TypeScript
└── package.json                # Dependências e scripts
```

## 🎯 Funcionalidades

### ✅ Controle de Jornada
- **Geração automática** de dias do mês
- Registro de entrada e saída diária
- Controle de intervalo intrajornada
- Marcação de folgas e feriados
- Edição inline de horários

### 📈 Cálculos Automáticos
- Horas normais trabalhadas
- Horas extras 50% (primeiras 2h extras)
- Horas extras 100% (após 2h extras ou em feriados)
- DSR (Descanso Semanal Remunerado)
- Desconto INSS automático
- **Recálculo automático** ao editar qualquer dia

### 💰 Resumo Financeiro
- Valor hora normal
- Valor de horas extras (50% e 100%)
- DSR sobre extras
- Salário bruto
- Desconto INSS
- Salário líquido

### 🎨 Interface
- Layout em **2 colunas** (dias + resumo)
- Resumo **sticky** (sempre visível)
- Destaque visual para feriados e folgas
- 100% responsivo (desktop/tablet/mobile)
- Otimizado para impressão (PDF)

## 🛠️ Instalação e Uso

### Pré-requisitos
- Node.js 18+ instalado

### Instalação

```bash
# Clone ou navegue até o diretório
cd CLT_calculator

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em: **http://localhost:3000**

### Scripts Disponíveis

```bash
# Desenvolvimento (modo watch com hot reload)
npm run dev

# Build de produção
npm run build

# Preview do build de produção
npm run preview
```

## 📝 Como Funciona

### 1. Geração Automática de Dias

O `App.tsx` gera automaticamente todos os dias do mês:

```tsx
// Gera Janeiro 2026 com configurações padrão
const days = generateMonthDays(2026, 0, settings);
```

### 2. Configurações Padrão

```tsx
const settings: Settings = {
  salarioMensal: 2200.00,          // R$ 2.200,00
  horaEntradaPadrao: '08:00',      // 8h da manhã
  horaSaidaPadrao: '17:00',        // 5h da tarde
  intervaloPadraoHoras: 1,         // 1 hora de intervalo
  folgaPadrao: 'domingo',          // Folga aos domingos
  escala: '6x1',                   // Escala 6x1
};
```

### 3. Edição e Recálculo

- Clique em **"Editar"** em qualquer dia
- Altere horários, marque folga ou feriado
- Clique em **"Salvar"**
- O resumo é **recalculado automaticamente**

### 4. Visualização

- **Esquerda**: Lista de dias editáveis
- **Direita**: Resumo mensal (sticky)
- **Footer**: Configurações atuais

## 📚 Regras de Negócio

### Jornada CLT
- Jornada padrão: **220 horas/mês** (44h semanais)
- Escala: **6x1** (6 dias de trabalho, 1 dia de folga)
- Intervalo intrajornada: configurável (padrão 1h)

### Cálculo de Horas Extras
- **Dia normal**: Primeiras 2h extras = 50%, após = 100%
- **Feriado**: Todas as horas = 100%
- **Folga trabalhada**: Todas as horas = 50%

### DSR (Descanso Semanal Remunerado)
- Calculado sobre horas extras trabalhadas
- Proporcional aos domingos/feriados do mês
- Fórmula: `(Valor extras / dias úteis) × dias de repouso`

### INSS
- Cálculo progressivo conforme **tabela 2026**
- Alíquotas: 7,5% / 9% / 12% / 14%
- Teto: R$ 7.786,02

## 🎨 Design e Estilos

### Cores Semânticas

| Tipo | Cor | Uso |
|------|-----|-----|
| **Primária** | `#2196F3` (Azul) | Títulos, valores principais |
| **Feriado** | `#FFEBEE` (Vermelho claro) | Fundo de feriados |
| **Folga** | `#E3F2FD` (Azul claro) | Fundo de folgas |
| **Extras 50%** | `#FF9800` (Laranja) | Valores de extras 50% |
| **Extras 100%** | `#F44336` (Vermelho) | Valores de extras 100% |
| **DSR** | `#4CAF50` (Verde) | Valores de DSR |

### Metodologia
- **BEM** para nomes de classes CSS
- **CSS Variables** para customização
- **Mobile-first** para responsividade

## ⚖️ Princípios de Desenvolvimento

Este projeto segue princípios estritos de:

1. **Previsibilidade**: Código claro e direto
2. **Auditabilidade**: Cálculos transparentes e documentados
3. **Separação de Concerns**: Lógica separada da UI
4. **TypeScript Strict**: Zero uso de `any`
5. **Funções Puras**: Sem efeitos colaterais nos cálculos
6. **Conservadorismo**: Abordagem cautelosa em ambiguidades

## 🔧 Customização

### Mudar Mês/Ano

Edite `src/App.tsx`:

```tsx
const currentYear = 2026;
const currentMonth = 1;  // 0 = Janeiro, 1 = Fevereiro, etc.
```

### Mudar Configurações

Edite as `settings` em `src/App.tsx`:

```tsx
const [settings] = useState<Settings>({
  salarioMensal: 3000.00,      // Seu salário
  horaEntradaPadrao: '07:00',  // Seu horário
  horaSaidaPadrao: '16:00',
  intervaloPadraoHoras: 1.5,   // Seu intervalo
  folgaPadrao: 'sabado',       // Seu dia de folga
  escala: '6x1',
});
```

### Adicionar Feriados

Veja `src/App.example.tsx` para exemplos de como pré-configurar feriados.

## 📖 Documentação

- **`src/core/`**: Lógica e cálculos (totalmente documentado)
- **`src/ui/README.md`**: Documentação dos componentes UI
- **`src/styles/README.md`**: Documentação das classes CSS
- **`src/styles/INTEGRATION.md`**: Guia de integração
- **`src/App.example.tsx`**: Exemplos de customização

## 🐛 Resolução de Problemas

### App não inicia?
```bash
npm install
npm run dev
```

### Valores incorretos?
Verifique as configurações em `src/App.tsx`

### Estilos não aplicados?
Certifique-se de que `src/index.css` importa `./styles/app.css`

## 📄 Licença

Projeto pessoal para uso interno.

## ⚠️ Disclaimer

Os cálculos são baseados na CLT vigente e podem variar conforme convenção coletiva da categoria. Utilize como **referência pessoal** e consulte um contador para cálculos oficiais.

---

**Desenvolvido com ❤️ para controle pessoal de jornada CLT**

**Status**: ✅ Totalmente funcional - Pronto para uso!
