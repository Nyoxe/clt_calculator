/**
 * Layout.example.tsx
 * 
 * Exemplo de uso do componente Layout.
 * 
 * Este arquivo demonstra como integrar o componente Layout
 * com dados de um mês completo de trabalho.
 */

import { Layout } from './';
import type { DayRecord, Settings } from '../core/types';

/**
 * Exemplo básico de uso do Layout
 */
function LayoutExample() {
    // Configurações do trabalhador
    const settings: Settings = {
        salarioMensal: 2500,
        horaEntradaPadrao: '08:00',
        horaSaidaPadrao: '17:00',
        intervaloPadraoHoras: 1,
        folgaPadrao: 'domingo',
        escala: '6x1',
    };

    // Dias de trabalho de exemplo (primeira semana de Janeiro 2026)
    const days: DayRecord[] = [
        {
            date: new Date(2026, 0, 6), // Segunda
            entrada: '08:00',
            saida: '17:00',
            intervaloHoras: 1,
            ehFolga: false,
            ehFeriado: false,
        },
        {
            date: new Date(2026, 0, 7), // Terça
            entrada: '08:00',
            saida: '18:30', // Horas extras
            intervaloHoras: 1,
            ehFolga: false,
            ehFeriado: false,
        },
        {
            date: new Date(2026, 0, 8), // Quarta
            entrada: '08:00',
            saida: '17:00',
            intervaloHoras: 1,
            ehFolga: false,
            ehFeriado: false,
        },
        {
            date: new Date(2026, 0, 9), // Quinta
            entrada: '08:00',
            saida: '17:00',
            intervaloHoras: 1,
            ehFolga: false,
            ehFeriado: false,
        },
        {
            date: new Date(2026, 0, 10), // Sexta
            entrada: '08:00',
            saida: '17:00',
            intervaloHoras: 1,
            ehFolga: false,
            ehFeriado: false,
        },
        {
            date: new Date(2026, 0, 11), // Sábado
            entrada: '08:00',
            saida: '12:00',
            intervaloHoras: 0,
            ehFolga: false,
            ehFeriado: false,
        },
        {
            date: new Date(2026, 0, 12), // Domingo - Folga
            entrada: '',
            saida: '',
            intervaloHoras: 0,
            ehFolga: true,
            ehFeriado: false,
        },
    ];

    return (
        <Layout
            days={days}
            settings={settings}
            salarioMensal={settings.salarioMensal}
        />
    );
}

/**
 * Exemplo com desconto INSS customizado
 */
function LayoutExampleCustomINSS() {
    const settings: Settings = {
        salarioMensal: 3500,
        horaEntradaPadrao: '08:00',
        horaSaidaPadrao: '17:00',
        intervaloPadraoHoras: 1,
        folgaPadrao: 'domingo',
        escala: '6x1',
    };

    const days: DayRecord[] = [
        {
            date: new Date(2026, 0, 1), // Feriado (Ano Novo)
            entrada: '',
            saida: '',
            intervaloHoras: 0,
            ehFolga: false,
            ehFeriado: true,
        },
        // ... mais dias
    ];

    // Fornece desconto INSS customizado (ex: valor fornecido pelo contador)
    const descontoINSSCustomizado = 350.00;

    return (
        <Layout
            days={days}
            settings={settings}
            salarioMensal={settings.salarioMensal}
            descontoINSS={descontoINSSCustomizado}
        />
    );
}

export { LayoutExample, LayoutExampleCustomINSS };
export default LayoutExample;
