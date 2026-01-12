/**
 * payroll.ts
 * 
 * Converte resultados de horas trabalhadas em valores monetários.
 * 
 * REGRAS DE NEGÓCIO CRÍTICAS:
 * - Valor hora = salário mensal ÷ 220 horas (padrão CLT 44h semanais)
 * - Hora extra 50% = valor hora × 1.5
 * - Hora extra 100% = valor hora × 2.0
 * - DSR calculado sobre horas extras
 * - INSS pode ser calculado automaticamente ou fornecido manualmente
 * - Valor líquido = bruto - INSS
 * 
 * CRITÉRIOS DE DESENVOLVIMENTO:
 * - Funções puras (sem estado global)
 * - Previsível e auditável
 * - Precisão em valores monetários (2 casas decimais)
 * - Transparência total nos cálculos
 */

import type { DailyHoursResult, MonthlySummary } from './types';

/**
 * Calcula o valor de uma hora normal de trabalho.
 * 
 * FÓRMULA:
 * Valor hora = salário mensal ÷ 220 horas
 * 
 * JUSTIFICATIVA:
 * - CLT: 44 horas semanais × 5 semanas (aprox.) = 220 horas mensais
 * - Esta é a divisão padrão para cálculo de hora trabalhada
 * 
 * @param salarioMensal - Salário mensal bruto em reais
 * @returns Valor de uma hora normal em reais
 * 
 * @example
 * calculateHourlyValue(2200.00) // 10.00
 * calculateHourlyValue(3300.00) // 15.00
 * 
 * DECISÃO CONSERVADORA:
 * - Usa divisor fixo de 220h (padrão CLT)
 * - Arredonda para 2 casas decimais (centavos)
 */
export function calculateHourlyValue(salarioMensal: number): number {
    const valorHora = salarioMensal / 220;
    return Math.round(valorHora * 100) / 100;
}

/**
 * Converte resultado de horas trabalhadas em um dia para valores monetários.
 * 
 * CÁLCULOS:
 * - Valor normal = horas normais × valor hora
 * - Valor extra 50% = horas extra 50% × (valor hora × 1.5)
 * - Valor extra 100% = horas extra 100% × (valor hora × 2.0)
 * 
 * @param dailyResult - Resultado de horas do dia (normal, 50%, 100%)
 * @param valorHora - Valor de uma hora normal em reais
 * @returns Objeto com valores monetários do dia
 * 
 * @example
 * const result = { horasNormais: 8, horasExtra50: 2, horasExtra100: 0 };
 * calculatePayrollForDay(result, 10.00)
 * // { valorNormal: 80.00, valorExtra50: 30.00, valorExtra100: 0.00 }
 * 
 * DECISÃO CONSERVADORA:
 * - Todos os valores arredondados para 2 casas decimais
 * - Cálculo transparente sem otimizações prematuras
 */
export function calculatePayrollForDay(
    dailyResult: DailyHoursResult,
    valorHora: number
): {
    valorNormal: number;
    valorExtra50: number;
    valorExtra100: number;
} {
    // Valor hora extra 50% = valor hora × 1.5
    const valorHoraExtra50 = valorHora * 1.5;

    // Valor hora extra 100% = valor hora × 2.0
    const valorHoraExtra100 = valorHora * 2.0;

    // Calcula valores monetários
    const valorNormal = dailyResult.horasNormais * valorHora;
    const valorExtra50 = dailyResult.horasExtra50 * valorHoraExtra50;
    const valorExtra100 = dailyResult.horasExtra100 * valorHoraExtra100;

    return {
        valorNormal: Math.round(valorNormal * 100) / 100,
        valorExtra50: Math.round(valorExtra50 * 100) / 100,
        valorExtra100: Math.round(valorExtra100 * 100) / 100,
    };
}

/**
 * Calcula a folha de pagamento mensal completa.
 * 
 * COMPOSIÇÃO DO SALÁRIO BRUTO:
 * - Salário base mensal
 * - + Valor das horas extras 50%
 * - + Valor das horas extras 100%
 * - + DSR (já calculado no MonthlySummary)
 * 
 * COMPOSIÇÃO DO SALÁRIO LÍQUIDO:
 * - Salário bruto
 * - - Desconto INSS
 * 
 * @param monthSummary - Resumo mensal com totais de horas e valores
 * @param salarioMensal - Salário mensal base em reais
 * @param descontoINSS - Desconto INSS (opcional, usa o do summary se não fornecido)
 * @returns Objeto com valores bruto, INSS e líquido
 * 
 * @example
 * const summary = {
 *   horasNormais: 176,
 *   horasExtra50: 10,
 *   horasExtra100: 2,
 *   dsrTotal: 50.00,
 *   valorBruto: 2450.00,
 *   descontoINSS: 200.00,
 *   valorLiquido: 2250.00
 * };
 * calculateMonthlyPayroll(summary, 2200.00)
 * // { bruto: 2450.00, inss: 200.00, liquido: 2250.00 }
 * 
 * DECISÃO CONSERVADORA:
 * - Usa valores já calculados no MonthlySummary
 * - Permite override do INSS para casos especiais (ex: edição manual)
 * - Mantém transparência total dos valores
 * - Arredonda todos os valores para 2 casas decimais
 * 
 * NOTA IMPORTANTE:
 * O MonthlySummary já contém valorBruto e descontoINSS calculados.
 * Esta função serve principalmente para:
 * 1. Permitir recálculo com INSS customizado
 * 2. Fornecer interface clara para UI
 * 3. Isolar lógica de apresentação de valores
 */
export function calculateMonthlyPayroll(
    monthSummary: MonthlySummary,
    salarioMensal: number,
    descontoINSS?: number
): {
    bruto: number;
    inss: number;
    liquido: number;
} {
    // Valor hora (para referência/auditoria)
    const valorHora = calculateHourlyValue(salarioMensal);
    const valorHoraExtra50 = valorHora * 1.5;
    const valorHoraExtra100 = valorHora * 2.0;

    // Calcula valores das horas extras
    const valorHorasExtras50 = monthSummary.horasExtra50 * valorHoraExtra50;
    const valorHorasExtras100 = monthSummary.horasExtra100 * valorHoraExtra100;

    // VALOR BRUTO = salário base + horas extras + DSR
    // Nota: DSR já vem calculado no MonthlySummary
    const valorBruto = salarioMensal + valorHorasExtras50 + valorHorasExtras100 + monthSummary.dsrTotal;

    // DESCONTO INSS
    // Se fornecido manualmente, usa o valor fornecido
    // Caso contrário, usa o calculado no MonthlySummary
    const inss = descontoINSS !== undefined ? descontoINSS : monthSummary.descontoINSS;

    // VALOR LÍQUIDO = bruto - INSS
    const valorLiquido = valorBruto - inss;

    return {
        bruto: Math.round(valorBruto * 100) / 100,
        inss: Math.round(inss * 100) / 100,
        liquido: Math.round(valorLiquido * 100) / 100,
    };
}

/**
 * Calcula valores detalhados de horas extras mensais.
 * 
 * Função auxiliar para exibir breakdown detalhado na UI.
 * 
 * @param horasExtra50 - Total de horas extras 50% no mês
 * @param horasExtra100 - Total de horas extras 100% no mês
 * @param valorHora - Valor de uma hora normal
 * @returns Objeto com valores individuais e total
 * 
 * @example
 * calculateOvertimeBreakdown(10, 2, 10.00)
 * // {
 * //   valorExtra50: 150.00,
 * //   valorExtra100: 40.00,
 * //   totalExtras: 190.00
 * // }
 * 
 * DECISÃO CONSERVADORA:
 * - Função utilitária para UI/relatórios
 * - Mantém cálculos transparentes e auditáveis
 */
export function calculateOvertimeBreakdown(
    horasExtra50: number,
    horasExtra100: number,
    valorHora: number
): {
    valorExtra50: number;
    valorExtra100: number;
    totalExtras: number;
} {
    const valorHoraExtra50 = valorHora * 1.5;
    const valorHoraExtra100 = valorHora * 2.0;

    const valorExtra50 = horasExtra50 * valorHoraExtra50;
    const valorExtra100 = horasExtra100 * valorHoraExtra100;
    const totalExtras = valorExtra50 + valorExtra100;

    return {
        valorExtra50: Math.round(valorExtra50 * 100) / 100,
        valorExtra100: Math.round(valorExtra100 * 100) / 100,
        totalExtras: Math.round(totalExtras * 100) / 100,
    };
}
