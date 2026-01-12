/**
 * types.ts
 * 
 * Define todos os tipos TypeScript do sistema de controle de jornada CLT.
 * 
 * REGRAS:
 * - Apenas tipos, sem lógica ou funções
 * - Estritamente tipado, sem uso de `any`
 * - Focado em auditabilidade e clareza
 * 
 * CONTEXTO:
 * - Aplicativo pessoal para controle de jornada CLT
 * - Escala 6x1 (6 dias de trabalho, 1 dia de folga)
 * - Cálculos envolvem direitos trabalhistas e valores financeiros
 */

/**
 * Representa os dias da semana em português.
 * Usado para definir folgas e gerar calendários.
 */
export type WeekDay =
  | 'segunda'
  | 'terca'
  | 'quarta'
  | 'quinta'
  | 'sexta'
  | 'sabado'
  | 'domingo';

/**
 * Configurações globais do trabalhador.
 * Define os parâmetros base para todos os cálculos.
 */
export type Settings = {
  /**
   * Salário mensal bruto em reais (R$).
   */
  salarioMensal: number;

  /**
   * Horário de entrada padrão no formato HH:mm (ex: "08:00").
   */
  horaEntradaPadrao: string;

  /**
   * Horário de saída padrão no formato HH:mm (ex: "17:00").
   */
  horaSaidaPadrao: string;

  /**
   * Duração do intervalo intrajornada em horas (ex: 1 para 1 hora).
   */
  intervaloPadraoHoras: number;

  /**
   * Dia da semana que é folga padrão na escala 6x1.
   */
  folgaPadrao: WeekDay;

  /**
   * Tipo de escala de trabalho.
   * Atualmente suporta apenas '6x1'.
   */
  escala: '6x1';
};

/**
 * Representa o registro de um único dia do mês.
 * Contém os dados brutos de entrada/saída e classificações do dia.
 */
export type DayRecord = {
  /**
   * Data do dia (ano, mês, dia).
   */
  date: Date;

  /**
   * Horário de entrada no formato HH:mm (ex: "08:15").
   * Pode ser vazio se for folga ou feriado.
   */
  entrada: string;

  /**
   * Horário de saída no formato HH:mm (ex: "17:30").
   * Pode ser vazio se for folga ou feriado.
   */
  saida: string;

  /**
   * Duração do intervalo intrajornada em horas (ex: 1.0).
   * Descontado do total de horas trabalhadas.
   */
  intervaloHoras: number;

  /**
   * Indica se o dia é folga semanal (ex: domingo na escala 6x1).
   */
  ehFolga: boolean;

  /**
   * Indica se o dia é feriado nacional/municipal.
   * Feriados têm regras especiais de cálculo.
   */
  ehFeriado: boolean;
};

/**
 * Resultado do cálculo de horas trabalhadas em um único dia.
 * Separa horas normais de horas extras com diferentes percentuais.
 */
export type DailyHoursResult = {
  /**
   * Horas trabalhadas dentro da jornada normal (até 8h/dia ou 44h/semana).
   */
  horasNormais: number;

  /**
   * Horas extras com adicional de 50%.
   * Geralmente as duas primeiras horas extras do dia.
   */
  horasExtra50: number;

  /**
   * Horas extras com adicional de 100%.
   * Geralmente após as duas primeiras horas extras, ou em domingos/feriados.
   */
  horasExtra100: number;
};

/**
 * Resumo consolidado de uma semana de trabalho.
 * Usado para cálculo do DSR (Descanso Semanal Remunerado).
 */
export type WeeklySummary = {
  /**
   * Total de horas trabalhadas na semana (incluindo extras).
   */
  totalHoras: number;

  /**
   * Total de horas extras com adicional de 50% na semana.
   */
  horasExtra50: number;

  /**
   * Valor proporcional do DSR desta semana em reais (R$).
   * Calculado sobre as horas extras trabalhadas.
   */
  dsr: number;
};

/**
 * Resumo consolidado de um mês completo de trabalho.
 * Contém todos os totalizadores e valores financeiros.
 */
export type MonthlySummary = {
  /**
   * Total de horas normais trabalhadas no mês.
   */
  horasNormais: number;

  /**
   * Total de horas extras com adicional de 50% no mês.
   */
  horasExtra50: number;

  /**
   * Total de horas extras com adicional de 100% no mês.
   */
  horasExtra100: number;

  /**
   * Valor total do DSR (Descanso Semanal Remunerado) em reais (R$).
   * Soma dos DSRs de todas as semanas do mês.
   */
  dsrTotal: number;

  /**
   * Valor bruto total do mês em reais (R$).
   * Inclui salário base + horas extras + DSR.
   */
  valorBruto: number;

  /**
   * Valor descontado de INSS em reais (R$).
   * Calculado sobre o valor bruto conforme tabela vigente.
   */
  descontoINSS: number;

  /**
   * Valor líquido a receber em reais (R$).
   * Calculado como: valorBruto - descontoINSS.
   */
  valorLiquido: number;
};
