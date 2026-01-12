/**
 * Summary.example.tsx
 * 
 * Exemplo de uso do componente Summary.
 * 
 * Este arquivo demonstra como integrar o componente Summary
 * com os dados calculados de um mês de trabalho.
 */

import React from 'react';
import Summary from './Summary';
import type { MonthlySummary } from '../core/types';

/**
 * Exemplo de uso do componente Summary
 */
function SummaryExample() {
    // Dados de exemplo: resumo mensal calculado
    const monthlySummary: MonthlySummary = {
        horasNormais: 176.0,
        horasExtra50: 12.5,
        horasExtra100: 4.0,
        dsrTotal: 150.0,
        valorBruto: 2950.0,
        descontoINSS: 245.0,
        valorLiquido: 2705.0,
    };

    // Salário mensal base
    const salarioMensal = 2200.0;

    return (
        <div style={{ padding: '20px' }}>
            <Summary
                monthlySummary={monthlySummary}
                salarioMensal={salarioMensal}
            />
        </div>
    );
}

/**
 * Exemplo com desconto INSS customizado
 */
function SummaryExampleCustomINSS() {
    const monthlySummary: MonthlySummary = {
        horasNormais: 176.0,
        horasExtra50: 12.5,
        horasExtra100: 4.0,
        dsrTotal: 150.0,
        valorBruto: 2950.0,
        descontoINSS: 245.0,
        valorLiquido: 2705.0,
    };

    const salarioMensal = 2200.0;

    // Fornece desconto INSS customizado (ex: edição manual)
    const descontoINSSCustomizado = 260.0;

    return (
        <div style={{ padding: '20px' }}>
            <Summary
                monthlySummary={monthlySummary}
                salarioMensal={salarioMensal}
                descontoINSS={descontoINSSCustomizado}
            />
        </div>
    );
}

export { SummaryExample, SummaryExampleCustomINSS };
export default SummaryExample;
