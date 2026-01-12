/**
 * time.ts
 * 
 * Funções utilitárias puras para manipulação de horários.
 * 
 * REGRAS:
 * - Funções puras (sem estado global)
 * - Não acessa Date.now()
 * - Não implementa regras CLT (apenas operações matemáticas de tempo)
 * - Não usa bibliotecas externas
 * - Estritamente tipado
 * 
 * CONTEXTO:
 * - Aplicativo pessoal para controle de jornada CLT
 * - Funções base para cálculos financeiros críticos
 * - Resultados devem ser previsíveis e auditáveis
 */

/**
 * Converte uma string de horário no formato HH:mm para total de minutos desde 00:00.
 * 
 * @param time - Horário no formato "HH:mm" (ex: "08:30", "14:15")
 * @returns Total de minutos desde 00:00
 * 
 * @example
 * parseHourToMinutes("00:00") // 0
 * parseHourToMinutes("08:30") // 510
 * parseHourToMinutes("23:59") // 1439
 * 
 * DECISÃO CONSERVADORA:
 * - Não valida se o horário é válido (delegado ao chamador)
 * - Assume formato correto HH:mm
 */
export function parseHourToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * Calcula o total de minutos efetivamente trabalhados em um dia.
 * 
 * @param entrada - Horário de entrada no formato "HH:mm"
 * @param saida - Horário de saída no formato "HH:mm"
 * @param intervaloHoras - Duração do intervalo em horas (ex: 1.0 para 1 hora)
 * @returns Total de minutos trabalhados (mínimo 0)
 * 
 * @example
 * calculateWorkedMinutes("08:00", "17:00", 1) // 480 (9h - 1h = 8h = 480min)
 * calculateWorkedMinutes("08:00", "12:00", 0) // 240 (4h = 240min)
 * calculateWorkedMinutes("08:00", "09:00", 2) // 0 (1h - 2h intervalo = 0, não negativo)
 * 
 * DECISÃO CONSERVADORA:
 * - Retorna 0 se o resultado for negativo (intervalo maior que tempo total)
 * - Não lança erros, comportamento previsível
 */
export function calculateWorkedMinutes(
    entrada: string,
    saida: string,
    intervaloHoras: number
): number {
    const entradaMinutes = parseHourToMinutes(entrada);
    const saidaMinutes = parseHourToMinutes(saida);
    const intervaloMinutes = intervaloHoras * 60;

    const totalMinutes = saidaMinutes - entradaMinutes;
    const workedMinutes = totalMinutes - intervaloMinutes;

    // Não permite resultado negativo
    return Math.max(0, workedMinutes);
}

/**
 * Converte minutos em horas decimais, arredondando para duas casas decimais.
 * 
 * @param minutes - Total de minutos a converter
 * @returns Horas no formato decimal (ex: 1.5, 8.25)
 * 
 * @example
 * minutesToDecimalHours(0)   // 0.00
 * minutesToDecimalHours(60)  // 1.00
 * minutesToDecimalHours(90)  // 1.50
 * minutesToDecimalHours(510) // 8.50
 * 
 * DECISÃO CONSERVADORA:
 * - Arredonda para 2 casas decimais para evitar imprecisão de ponto flutuante
 * - Usa Math.round para arredondamento padrão (0.5 arredonda para cima)
 */
export function minutesToDecimalHours(minutes: number): number {
    const hours = minutes / 60;
    return Math.round(hours * 100) / 100;
}

/**
 * Calcula a diferença total entre entrada e saída em minutos.
 * 
 * @param entrada - Horário de entrada no formato "HH:mm"
 * @param saida - Horário de saída no formato "HH:mm"
 * @returns Diferença total em minutos
 * 
 * @example
 * calculateHourDifference("08:00", "17:00") // 540 (9 horas)
 * calculateHourDifference("08:00", "12:00") // 240 (4 horas)
 * calculateHourDifference("23:00", "23:30") // 30 (30 minutos)
 * 
 * DECISÃO CONSERVADORA:
 * - Considera apenas horários no mesmo dia
 * - Não trata virada de dia (ex: "23:00" até "01:00" do dia seguinte)
 * - Se saída < entrada, o resultado será negativo
 */
export function calculateHourDifference(
    entrada: string,
    saida: string
): number {
    const entradaMinutes = parseHourToMinutes(entrada);
    const saidaMinutes = parseHourToMinutes(saida);
    return saidaMinutes - entradaMinutes;
}
