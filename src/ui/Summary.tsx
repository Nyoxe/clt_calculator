/**
 * Summary.tsx
 * 
 * Componente React para exibir o resumo mensal da jornada CLT.
 * 
 * RESPONSABILIDADES:
 * - Exibir totalizadores mensais (horas normais, extras, DSR)
 * - Exibir valores financeiros (bruto, INSS, líquido)
 * - Formatar valores monetários em reais
 * - Usar funções de payroll.ts para cálculos
 * 
 * REGRAS:
 * - Não implementa cálculos diretamente (delega para payroll.ts)
 * - Exibe valores com formatação adequada (2 casas decimais)
 * - UI simples com classes CSS básicas
 * - Props tipadas com MonthlySummary
 */

import React from 'react';
import type { MonthlySummary } from '../core/types';
import { calculateHourlyValue, calculateOvertimeBreakdown } from '../core/payroll';
import './Summary.css';

/**
 * Props do componente Summary
 */
type SummaryProps = {
    /**
     * Resumo mensal calculado com totais de horas e valores
     */
    monthlySummary: MonthlySummary;

    /**
     * Salário mensal base em reais
     */
    salarioMensal: number;

    /**
     * Desconto INSS customizado (opcional)
     * Se não fornecido, usa o valor do monthlySummary
     */
    descontoINSS?: number;
};

/**
 * Formata um valor numérico como moeda brasileira (R$)
 */
function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

/**
 * Formata um valor numérico de horas com 2 casas decimais
 */
function formatHours(hours: number): string {
    return hours.toFixed(2);
}

/**
 * Componente principal: resumo mensal
 */
function Summary({ monthlySummary, salarioMensal, descontoINSS }: SummaryProps) {
    // Calcula valor hora para exibição
    const valorHora = calculateHourlyValue(salarioMensal);

    // Calcula breakdown detalhado das horas extras
    const overtimeBreakdown = calculateOvertimeBreakdown(
        monthlySummary.horasExtra50,
        monthlySummary.horasExtra100,
        valorHora
    );

    // Usa desconto INSS customizado se fornecido, senão usa o do summary
    const inssValue = descontoINSS !== undefined ? descontoINSS : monthlySummary.descontoINSS;

    // Valor líquido = bruto - INSS
    const valorLiquidoFinal = monthlySummary.valorBruto - inssValue;

    return (
        <div className="summary">
            <h2 className="summary__title">Resumo Mensal</h2>

            {/* Seção: Horas Trabalhadas */}
            <section className="summary__section">
                <h3 className="summary__section-title">Horas Trabalhadas</h3>

                <div className="summary__grid">
                    <div className="summary__item">
                        <span className="summary__label">Horas Normais:</span>
                        <span className="summary__value">{formatHours(monthlySummary.horasNormais)}h</span>
                    </div>

                    <div className="summary__item">
                        <span className="summary__label">Horas Extras 50%:</span>
                        <span className="summary__value summary__value--extra50">
                            {formatHours(monthlySummary.horasExtra50)}h
                        </span>
                    </div>

                    <div className="summary__item">
                        <span className="summary__label">Horas Extras 100%:</span>
                        <span className="summary__value summary__value--extra100">
                            {formatHours(monthlySummary.horasExtra100)}h
                        </span>
                    </div>
                </div>
            </section>

            {/* Seção: Valores das Horas Extras */}
            <section className="summary__section">
                <h3 className="summary__section-title">Valores de Horas Extras</h3>

                <div className="summary__grid">
                    <div className="summary__item">
                        <span className="summary__label">Valor Hora Normal:</span>
                        <span className="summary__value">{formatCurrency(valorHora)}</span>
                    </div>

                    <div className="summary__item">
                        <span className="summary__label">Valor Extras 50%:</span>
                        <span className="summary__value summary__value--extra50">
                            {formatCurrency(overtimeBreakdown.valorExtra50)}
                        </span>
                    </div>

                    <div className="summary__item">
                        <span className="summary__label">Valor Extras 100%:</span>
                        <span className="summary__value summary__value--extra100">
                            {formatCurrency(overtimeBreakdown.valorExtra100)}
                        </span>
                    </div>

                    <div className="summary__item">
                        <span className="summary__label">Total Extras:</span>
                        <span className="summary__value summary__value--highlight">
                            {formatCurrency(overtimeBreakdown.totalExtras)}
                        </span>
                    </div>
                </div>
            </section>

            {/* Seção: DSR */}
            <section className="summary__section">
                <h3 className="summary__section-title">DSR (Descanso Semanal Remunerado)</h3>

                <div className="summary__grid">
                    <div className="summary__item">
                        <span className="summary__label">DSR sobre Extras:</span>
                        <span className="summary__value summary__value--dsr">
                            {formatCurrency(monthlySummary.dsrTotal)}
                        </span>
                    </div>
                </div>
            </section>

            {/* Seção: Valores Finais */}
            <section className="summary__section summary__section--final">
                <h3 className="summary__section-title">Valores Finais</h3>

                <div className="summary__grid">
                    <div className="summary__item summary__item--large">
                        <span className="summary__label">Salário Base:</span>
                        <span className="summary__value">{formatCurrency(salarioMensal)}</span>
                    </div>

                    <div className="summary__item summary__item--large">
                        <span className="summary__label">Valor Bruto:</span>
                        <span className="summary__value summary__value--highlight">
                            {formatCurrency(monthlySummary.valorBruto)}
                        </span>
                    </div>

                    <div className="summary__item summary__item--large">
                        <span className="summary__label">Desconto INSS:</span>
                        <span className="summary__value summary__value--negative">
                            - {formatCurrency(inssValue)}
                        </span>
                    </div>

                    <div className="summary__item summary__item--large summary__item--total">
                        <span className="summary__label">Valor Líquido:</span>
                        <span className="summary__value summary__value--total">
                            {formatCurrency(valorLiquidoFinal)}
                        </span>
                    </div>
                </div>
            </section>

            {/* Rodapé informativo */}
            <footer className="summary__footer">
                <p className="summary__note">
                    <strong>Nota:</strong> Os valores são calculados com base na CLT e podem variar
                    conforme convenção coletiva da categoria. Utilize como referência pessoal.
                </p>
            </footer>
        </div>
    );
}

export default Summary;
