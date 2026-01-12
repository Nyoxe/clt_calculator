/**
 * App.example.tsx
 * 
 * Exemplos de customização do App.tsx
 * 
 * Este arquivo mostra diferentes formas de configurar o App
 * para casos de uso variados.
 */

import { useState } from 'react';
import { Layout } from './ui';
import type { DayRecord, Settings } from './core/types';

// ============================================
// EXEMPLO 1: Gerar Mês Específico
// ============================================

/**
 * App configurado para um mês específico
 */
function AppCustomMonth() {
    const settings: Settings = {
        salarioMensal: 2500.00,
        horaEntradaPadrao: '07:00',
        horaSaidaPadrao: '16:00',
        intervaloPadraoHoras: 1,
        folgaPadrao: 'sabado',  // Folga aos sábados
        escala: '6x1',
    };

    // Gera dias de Fevereiro 2026
    const [days] = useState<DayRecord[]>(() =>
        generateMonthDays(2026, 1, settings) // 1 = Fevereiro
    );

    return (
        <Layout
            days={days}
            settings={settings}
            salarioMensal={settings.salarioMensal}
        />
    );
}

// ============================================
// EXEMPLO 2: Com INSS Customizado
// ============================================

/**
 * App com desconto INSS customizado
 * Útil quando o valor é fornecido manualmente
 */
function AppCustomINSS() {
    const settings: Settings = {
        salarioMensal: 3500.00,
        horaEntradaPadrao: '08:00',
        horaSaidaPadrao: '17:00',
        intervaloPadraoHoras: 1,
        folgaPadrao: 'domingo',
        escala: '6x1',
    };

    const [days] = useState<DayRecord[]>(() =>
        generateMonthDays(2026, 0, settings)
    );

    // INSS fornecido manualmente (ex: valor do contador)
    const [descontoINSS] = useState<number>(350.00);

    return (
        <Layout
            days={days}
            settings={settings}
            salarioMensal={settings.salarioMensal}
            descontoINSS={descontoINSS}
        />
    );
}

// ============================================
// EXEMPLO 3: Com Feriados Pré-configurados
// ============================================

/**
 * App com feriados já marcados
 * Útil para pré-configurar feriados nacionais
 */
function AppWithHolidays() {
    const settings: Settings = {
        salarioMensal: 2200.00,
        horaEntradaPadrao: '08:00',
        horaSaidaPadrao: '17:00',
        intervaloPadraoHoras: 1,
        folgaPadrao: 'domingo',
        escala: '6x1',
    };

    const [days] = useState<DayRecord[]>(() => {
        const generatedDays = generateMonthDays(2026, 0, settings);

        // Marca feriados nacionais de Janeiro
        return generatedDays.map(day => {
            const dayOfMonth = day.date.getDate();

            // 01/01 - Ano Novo
            if (dayOfMonth === 1) {
                return {
                    ...day,
                    ehFeriado: true,
                    entrada: '',
                    saida: '',
                    intervaloHoras: 0,
                };
            }

            return day;
        });
    });

    return (
        <Layout
            days={days}
            settings={settings}
            salarioMensal={settings.salarioMensal}
        />
    );
}

// ============================================
// EXEMPLO 4: Com Dados Salvos (LocalStorage)
// ============================================

/**
 * App que salva e carrega dados do localStorage
 * Útil para persistir dados entre sessões
 */
function AppWithPersistence() {
    const settings: Settings = {
        salarioMensal: 2200.00,
        horaEntradaPadrao: '08:00',
        horaSaidaPadrao: '17:00',
        intervaloPadraoHoras: 1,
        folgaPadrao: 'domingo',
        escala: '6x1',
    };

    // Tenta carregar do localStorage
    const loadDays = (): DayRecord[] => {
        const saved = localStorage.getItem('clt-days-2026-01');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Converte strings de data de volta para Date objects
                return parsed.map((day: any) => ({
                    ...day,
                    date: new Date(day.date),
                }));
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        }
        return generateMonthDays(2026, 0, settings);
    };

    const [days, setDays] = useState<DayRecord[]>(loadDays);

    // Salva no localStorage quando days mudar
    const handleDaysUpdate = (updatedDays: DayRecord[]) => {
        setDays(updatedDays);
        localStorage.setItem('clt-days-2026-01', JSON.stringify(updatedDays));
    };

    // Nota: você precisaria modificar o Layout para aceitar onDaysUpdate
    return (
        <Layout
            days={days}
            settings={settings}
            salarioMensal={settings.salarioMensal}
        />
    );
}

// ============================================
// FUNÇÃO AUXILIAR: Gerar dias do mês
// ============================================

function generateMonthDays(year: number, month: number, settings: Settings): DayRecord[] {
    const days: DayRecord[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const weekDayMap: Record<string, number> = {
        'domingo': 0,
        'segunda': 1,
        'terca': 2,
        'quarta': 3,
        'quinta': 4,
        'sexta': 5,
        'sabado': 6,
    };

    const folgaDayNumber = weekDayMap[settings.folgaPadrao];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        const isFolga = dayOfWeek === folgaDayNumber;

        days.push({
            date,
            entrada: isFolga ? '' : settings.horaEntradaPadrao,
            saida: isFolga ? '' : settings.horaSaidaPadrao,
            intervaloHoras: isFolga ? 0 : settings.intervaloPadraoHoras,
            ehFolga: isFolga,
            ehFeriado: false,
        });
    }

    return days;
}

// ============================================
// EXEMPLO 5: Seletor de Mês
// ============================================

/**
 * App com seletor de mês/ano
 * Permite ao usuário navegar entre meses
 */
function AppWithMonthSelector() {
    const settings: Settings = {
        salarioMensal: 2200.00,
        horaEntradaPadrao: '08:00',
        horaSaidaPadrao: '17:00',
        intervaloPadraoHoras: 1,
        folgaPadrao: 'domingo',
        escala: '6x1',
    };

    const [selectedYear, setSelectedYear] = useState(2026);
    const [selectedMonth, setSelectedMonth] = useState(0); // Janeiro

    const [days, setDays] = useState<DayRecord[]>(() =>
        generateMonthDays(selectedYear, selectedMonth, settings)
    );

    const handleMonthChange = (year: number, month: number) => {
        setSelectedYear(year);
        setSelectedMonth(month);
        setDays(generateMonthDays(year, month, settings));
    };

    const handlePreviousMonth = () => {
        const newMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
        const newYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
        handleMonthChange(newYear, newMonth);
    };

    const handleNextMonth = () => {
        const newMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
        const newYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
        handleMonthChange(newYear, newMonth);
    };

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button onClick={handlePreviousMonth}>← Mês Anterior</button>
                <span style={{ margin: '0 20px' }}>
                    {selectedMonth + 1}/{selectedYear}
                </span>
                <button onClick={handleNextMonth}>Próximo Mês →</button>
            </div>

            <Layout
                days={days}
                settings={settings}
                salarioMensal={settings.salarioMensal}
            />
        </div>
    );
}

export {
    AppCustomMonth,
    AppCustomINSS,
    AppWithHolidays,
    AppWithPersistence,
    AppWithMonthSelector,
};
