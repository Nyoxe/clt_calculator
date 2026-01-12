/**
 * core/holidays.ts
 * 
 * Lógica para identificação de feriados nacionais, estaduais (RJ) 
 * e municipais (Maricá).
 */

/**
 * Retorna uma lista de feriados para um ano e mês específicos.
 * Feriados incluídos: Federais (Brasil), Estaduais (RJ) e Municipais (Maricá).
 * 
 * @param year - Ano de consulta
 * @param month - Mês de consulta (0-11)
 * @returns Array com os números dos dias que são feriados
 */
export function getHolidays(year: number, month: number): number[] {
    const holidaysByMonth: Record<number, number[]> = {
        0: [1], // 01/Jan: Confraternização Universal
        3: [21, 23], // 21/Abr: Tiradentes | 23/Abr: São Jorge (RJ)
        4: [1, 26], // 01/Mai: Dia do Trabalhador | 26/Mai: Aniversário de Maricá
        7: [15], // 15/Ago: Padroeira de Maricá
        8: [7], // 07/Set: Independência do Brasil
        9: [12], // 12/Out: Nossa Senhora Aparecida
        10: [2, 15, 20], // 02/Nov: Finados | 15/Nov: Proclamação da República | 20/Nov: Consciência Negra
        11: [25], // 25/Dez: Natal
    };

    // Feriados móveis (Cálculo simplificado para 2026)
    if (year === 2026) {
        if (month === 1) holidaysByMonth[1] = [...(holidaysByMonth[1] || []), 17]; // Carnaval: 17/Fev
        if (month === 3) holidaysByMonth[3] = [...(holidaysByMonth[3] || []), 3]; // Sexta-feira Santa: 03/Abr
        if (month === 5) holidaysByMonth[5] = [...(holidaysByMonth[5] || []), 4]; // Corpus Christi: 04/Jun
    }

    return holidaysByMonth[month] || [];
}

/**
 * Verifica se uma data específica é feriado
 */
export function isHoliday(date: Date): boolean {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const holidays = getHolidays(year, month);
    return holidays.includes(day);
}
