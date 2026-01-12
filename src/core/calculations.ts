/**
 * calculations.ts
 * 
 * Implementa os cálculos de jornada CLT baseados em regras específicas.
 * 
 * REGRAS DE NEGÓCIO CRÍTICAS:
 * - Jornada padrão diária é configurável pelo usuário
 * - Domingo NÃO gera automaticamente 100% (apenas se for feriado)
 * - Feriado gera 100% para TODAS as horas trabalhadas
 * - Horas acima da jornada padrão geram 50%
 * - Dia de folga (não feriado) gera 50% para todas as horas
 * - DSR calculado sobre horas extras do período
 * 
 * CRITÉRIOS DE DESENVOLVIMENTO:
 * - Funções puras (sem estado global)
 * - Previsível e auditável
 * - Documentação de todas as decisões
 * - Tratamento de edge cases de forma conservadora
 */

import type { DailyHoursResult, DayRecord, MonthlySummary, Settings } from './types';
import {
    calculateWorkedMinutes,
    minutesToDecimalHours,
} from './time';

/**
 * Calcula o resultado de horas trabalhadas para um único dia.
 * 
 * LÓGICA DE CLASSIFICAÇÃO:
 * 1. Se feriado: TODAS as horas = 100%
 * 2. Se folga (não feriado): TODAS as horas = 50%
 * 3. Dia normal:
 *    - Até jornada padrão = horas normais
 *    - Acima da jornada padrão = 50%
 * 
 * @param entrada - Horário de entrada (HH:mm)
 * @param saida - Horário de saída (HH:mm)
 * @param intervaloHoras - Duração do intervalo em horas
 * @param ehFeriado - Se o dia é feriado
 * @param ehFolga - Se o dia é folga semanal
 * @param jornadaPadraoHoras - Jornada padrão diária em horas (ex: 7.33)
 * @returns Resultado com horas normais, 50% e 100%
 * 
 * DECISÕES CONSERVADORAS:
 * - Se entrada ou saída estiverem vazios, retorna zeros
 * - Feriado tem precedência sobre folga (se ambos forem true)
 * - Não permite horas negativas
 */
export function calculateDailyResult(
    entrada: string,
    saida: string,
    intervaloHoras: number,
    ehFeriado: boolean,
    ehFolga: boolean,
    jornadaPadraoHoras: number
): DailyHoursResult {
    // Se não há entrada/saída válida, retorna zeros
    if (!entrada || !saida) {
        return {
            horasNormais: 0,
            horasExtra50: 0,
            horasExtra100: 0,
        };
    }

    // Calcula total de minutos trabalhados (já descontando intervalo)
    const minutosTrabalhadosTotal = calculateWorkedMinutes(entrada, saida, intervaloHoras);
    const horasTrabalhadasTotal = minutesToDecimalHours(minutosTrabalhadosTotal);

    // REGRA 1: FERIADO - todas as horas são 100%
    if (ehFeriado) {
        return {
            horasNormais: 0,
            horasExtra50: 0,
            horasExtra100: horasTrabalhadasTotal,
        };
    }

    // REGRA 2: FOLGA (não feriado) - todas as horas são 50%
    if (ehFolga) {
        return {
            horasNormais: 0,
            horasExtra50: horasTrabalhadasTotal,
            horasExtra100: 0,
        };
    }

    // REGRA 3: DIA NORMAL
    // Até a jornada padrão = horas normais
    // Acima da jornada padrão = horas extras 50%
    if (horasTrabalhadasTotal <= jornadaPadraoHoras) {
        return {
            horasNormais: horasTrabalhadasTotal,
            horasExtra50: 0,
            horasExtra100: 0,
        };
    } else {
        const horasNormais = jornadaPadraoHoras;
        const horasExtra50 = horasTrabalhadasTotal - jornadaPadraoHoras;

        return {
            horasNormais: horasNormais,
            horasExtra50: horasExtra50,
            horasExtra100: 0,
        };
    }
}

/**
 * Calcula o DSR (Descanso Semanal Remunerado) sobre horas extras.
 * 
 * LÓGICA:
 * DSR = valor das horas extras multiplicado pelo número de domingos/feriados.
 * 
 * Fórmula simplificada:
 * DSR = (valor hora extra 50% * horas 50% + valor hora extra 100% * horas 100%) * (dias de repouso / dias úteis)
 * 
 * DECISÃO CONSERVADORA:
 * - Para simplificar, calculamos DSR como percentual sobre o total de horas extras
 * - Proporção padrão: 1/6 (aproximadamente 4.33 domingos em um mês de 26 dias úteis)
 * - Esta é uma aproximação. Ajustes podem ser feitos conforme necessidade legal.
 * 
 * @param horasExtra50Total - Total de horas extras 50% do período
 * @param horasExtra100Total - Total de horas extras 100% do período
 * @param valorHoraExtra50 - Valor unitário da hora extra 50%
 * @param valorHoraExtra100 - Valor unitário da hora extra 100%
 * @param diasRepouso - Número de dias de repouso no período (domingos + feriados)
 * @param diasUteis - Número de dias úteis no período
 * @returns Valor do DSR em reais
 * 
 * NOTA IMPORTANTE:
 * Esta implementação usa uma fórmula simplificada.
 * Para cálculos legais precisos, consulte legislação vigente e CCT.
 */
export function calculateDSR(
    horasExtra50Total: number,
    horasExtra100Total: number,
    valorHoraExtra50: number,
    valorHoraExtra100: number,
    diasRepouso: number,
    diasUteis: number
): number {
    // Valor total das horas extras do período
    const valorHorasExtras50 = horasExtra50Total * valorHoraExtra50;
    const valorHorasExtras100 = horasExtra100Total * valorHoraExtra100;
    const valorTotalHorasExtras = valorHorasExtras50 + valorHorasExtras100;

    // Se não há dias úteis ou dias de repouso, DSR é zero
    if (diasUteis === 0 || diasRepouso === 0) {
        return 0;
    }

    // DSR = valor horas extras * (dias repouso / dias úteis)
    const dsr = valorTotalHorasExtras * (diasRepouso / diasUteis);

    // Arredonda para 2 casas decimais (centavos)
    return Math.round(dsr * 100) / 100;
}

/**
 * Calcula o resumo mensal completo baseado em todos os dias registrados.
 * 
 * LÓGICA:
 * 1. Itera sobre todos os dias do mês
 * 2. Calcula resultado diário de cada dia
 * 3. Acumula totais
 * 4. Calcula DSR sobre as horas extras
 * 5. Calcula valores financeiros (bruto, INSS, líquido)
 * 
 * @param days - Array com todos os dias do mês (DayRecord[])
 * @param settings - Configurações do trabalhador
 * @returns Resumo mensal completo com valores financeiros
 * 
 * PREMISSAS:
 * - Salário mensal já está definido em settings.salarioMensal
 * - Jornada padrão é calculada: 220h/mês ÷ 30 dias ≈ 7.33h/dia (ou conforme configurado)
 * - Adicional 50% = valor hora × 1.5
 * - Adicional 100% = valor hora × 2.0
 * - INSS calculado sobre valor bruto (tabela simplificada)
 * 
 * DECISÃO CONSERVADORA:
 * - Jornada padrão diária = 220h/mês ÷ 30 dias = 7.33h/dia (padrão CLT 44h semanais)
 * - Esta é uma aproximação. Ajustar conforme necessidade.
 */
export function calculateMonthlySummary(
    days: DayRecord[],
    settings: Settings
): MonthlySummary {
    // CÁLCULO DA JORNADA PADRÃO DIÁRIA
    // CLT: 44 horas semanais = 220 horas mensais (considerando 4 semanas e meia)
    // 220h ÷ 30 dias = 7.33h por dia
    const jornadaPadraoHoras = 220 / 30; // 7.33h/dia

    // CÁLCULO DO VALOR HORA
    // Salário mensal ÷ 220 horas = valor hora
    const valorHora = settings.salarioMensal / 220;
    const valorHoraExtra50 = valorHora * 1.5;  // 50% de adicional
    const valorHoraExtra100 = valorHora * 2.0; // 100% de adicional

    // Acumuladores
    let horasNormaisTotal = 0;
    let horasExtra50Total = 0;
    let horasExtra100Total = 0;
    let diasRepouso = 0;
    let diasUteis = 0;

    // Itera sobre todos os dias do mês
    for (const day of days) {
        const resultado = calculateDailyResult(
            day.entrada,
            day.saida,
            day.intervaloHoras,
            day.ehFeriado,
            day.ehFolga,
            jornadaPadraoHoras
        );

        horasNormaisTotal += resultado.horasNormais;
        horasExtra50Total += resultado.horasExtra50;
        horasExtra100Total += resultado.horasExtra100;

        // Conta dias de repouso (folgas e feriados)
        if (day.ehFolga || day.ehFeriado) {
            diasRepouso++;
        } else {
            diasUteis++;
        }
    }

    // Arredonda totais para 2 casas decimais
    horasNormaisTotal = Math.round(horasNormaisTotal * 100) / 100;
    horasExtra50Total = Math.round(horasExtra50Total * 100) / 100;
    horasExtra100Total = Math.round(horasExtra100Total * 100) / 100;

    // CÁLCULO DO DSR
    const dsrTotal = calculateDSR(
        horasExtra50Total,
        horasExtra100Total,
        valorHoraExtra50,
        valorHoraExtra100,
        diasRepouso,
        diasUteis
    );

    // CÁLCULO DOS VALORES FINANCEIROS
    // Valor bruto = salário base + horas extras + DSR
    const valorHorasExtras50 = horasExtra50Total * valorHoraExtra50;
    const valorHorasExtras100 = horasExtra100Total * valorHoraExtra100;
    const valorBruto = settings.salarioMensal + valorHorasExtras50 + valorHorasExtras100 + dsrTotal;

    // DESCONTO INSS (tabela simplificada 2026)
    // DECISÃO CONSERVADORA: Implementação simplificada com alíquota única
    // Para cálculo preciso, usar tabela progressiva vigente
    const descontoINSS = calculateINSS(valorBruto);

    // Valor líquido = bruto - INSS
    const valorLiquido = valorBruto - descontoINSS;

    return {
        horasNormais: horasNormaisTotal,
        horasExtra50: horasExtra50Total,
        horasExtra100: horasExtra100Total,
        dsrTotal: Math.round(dsrTotal * 100) / 100,
        valorBruto: Math.round(valorBruto * 100) / 100,
        descontoINSS: Math.round(descontoINSS * 100) / 100,
        valorLiquido: Math.round(valorLiquido * 100) / 100,
    };
}

/**
 * Calcula o desconto de INSS sobre o salário bruto.
 * 
 * TABELA INSS 2026 (valores aproximados):
 * - Até R$ 1.412,00: 7,5%
 * - De R$ 1.412,01 até R$ 2.666,68: 9%
 * - De R$ 2.666,69 até R$ 4.000,03: 12%
 * - De R$ 4.000,04 até R$ 7.786,02: 14%
 * 
 * DECISÃO CONSERVADORA:
 * - Implementação com alíquotas progressivas
 * - Valores podem estar desatualizados - VERIFICAR TABELA VIGENTE
 * - Esta é uma aproximação para o aplicativo pessoal
 * 
 * @param valorBruto - Salário bruto em reais
 * @returns Desconto de INSS em reais
 * 
 * IMPORTANTE:
 * Esta implementação é simplificada para uso pessoal.
 * Para cálculos legais oficiais, consulte a tabela INSS vigente.
 */
function calculateINSS(valorBruto: number): number {
    let inss = 0;

    // Faixa 1: até 1412,00 = 7,5%
    if (valorBruto <= 1412.00) {
        inss = valorBruto * 0.075;
    }
    // Faixa 2: 1412,01 até 2666,68 = 9%
    else if (valorBruto <= 2666.68) {
        inss = 1412.00 * 0.075 + (valorBruto - 1412.00) * 0.09;
    }
    // Faixa 3: 2666,69 até 4000,03 = 12%
    else if (valorBruto <= 4000.03) {
        inss = 1412.00 * 0.075 + (2666.68 - 1412.00) * 0.09 + (valorBruto - 2666.68) * 0.12;
    }
    // Faixa 4: 4000,04 até 7786,02 = 14%
    else if (valorBruto <= 7786.02) {
        inss = 1412.00 * 0.075 + (2666.68 - 1412.00) * 0.09 + (4000.03 - 2666.68) * 0.12 + (valorBruto - 4000.03) * 0.14;
    }
    // Acima do teto: desconto máximo
    else {
        inss = 1412.00 * 0.075 + (2666.68 - 1412.00) * 0.09 + (4000.03 - 2666.68) * 0.12 + (7786.02 - 4000.03) * 0.14;
    }

    return inss;
}
