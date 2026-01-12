/**
 * App.tsx
 * 
 * Componente principal da aplicação de controle CLT.
 * 
 * RESPONSABILIDADES:
 * - Inicializar estado da aplicação
 * - Gerar dias do mês automaticamente
 * - Definir configurações padrão
 * - Renderizar layout completo
 * 
 * REGRAS:
 * - Usa Layout para renderização
 * - Delega cálculos para calculations.ts/payroll.ts
 * - Estado gerenciado com React Hooks
 * - Código auditável e claro
 */

import { useState, useMemo } from 'react';
import { Layout } from './ui';
import type { DayRecord, Settings } from './core/types';
import './styles/app.css';
import { isHoliday } from './core/holidays';

/**
 * Gera automaticamente todos os dias de um mês
 * 
 * @param year - Ano (ex: 2026)
 * @param month - Mês (0-11, onde 0 = Janeiro)
 * @param settings - Configurações do usuário
 * @returns Array de DayRecord com todos os dias do mês
 * 
 * LÓGICA:
 * - Cria um dia para cada data do mês
 * - Aplica horários padrão definidos em settings
 * - Marca folgas baseado no dia da semana (settings.folgaPadrao)
 * - Identifica feriados nacionais, estaduais (RJ) e municipais (Maricá)
 */
function generateMonthDays(year: number, month: number, settings: Settings): DayRecord[] {
    const days: DayRecord[] = [];

    // Determina quantos dias tem o mês
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Mapeia nome do dia da semana para número (0 = Domingo, 6 = Sábado)
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

    // Gera cada dia do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        const isFolga = dayOfWeek === folgaDayNumber;
        const ehFeriado = isHoliday(date);

        days.push({
            date,
            entrada: isFolga ? '' : settings.horaEntradaPadrao,
            saida: isFolga ? '' : settings.horaSaidaPadrao,
            intervaloHoras: isFolga ? 0 : settings.intervaloPadraoHoras,
            ehFolga: isFolga,
            ehFeriado: ehFeriado,
        });
    }

    return days;
}

/**
 * Componente principal da aplicação
 */
function App() {
    // ============================================
    // CONFIGURAÇÕES GLOBAIS
    // ============================================
    const [settings, setSettings] = useState<Settings>({
        salarioMensal: 2200.00,          // R$ 2.200,00
        horaEntradaPadrao: '08:00',       // 8h da manhã
        horaSaidaPadrao: '17:00',         // 5h da tarde
        intervaloPadraoHoras: 1,          // 1 hora de intervalo
        folgaPadrao: 'domingo',           // Folga aos domingos
        escala: '6x1',                    // Escala 6x1
    });

    // ============================================
    // ESTADO DE DATA (Mês e Ano selecionados)
    // ============================================
    const now = new Date();
    const [currentYear, setCurrentYear] = useState(now.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(now.getMonth());

    // ============================================
    // GERAÇÃO AUTOMÁTICA DE DIAS DO MÊS
    // ============================================
    // Os dias são gerados sempre que o mês, ano ou configurações mudam
    const days = useMemo(() =>
        generateMonthDays(currentYear, currentMonth, settings),
        [currentYear, currentMonth, settings]
    );

    // Navegação de meses
    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentYear(prev => prev - 1);
            setCurrentMonth(11);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentYear(prev => prev + 1);
            setCurrentMonth(0);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // ============================================
    // RENDERIZAÇÃO
    // ============================================
    return (
        <div className="app">
            {/* Header da aplicação */}
            <header className="app__header" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ margin: 0, color: 'var(--duo-navy)' }}>Controle de Jornada CLT</h1>
                        <p style={{ margin: 0, color: 'var(--duo-gray-dark)' }}>Gestão automática para Maricá - RJ</p>
                    </div>

                    <div className="month-selector cartoon-panel" style={{ margin: 0, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button className="duo-button" onClick={handlePrevMonth}>◀</button>
                        <div style={{ textAlign: 'center', minWidth: '150px' }}>
                            <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--duo-navy)' }}>
                                {months[currentMonth]}
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--duo-gray-dark)' }}>
                                {currentYear}
                            </div>
                        </div>
                        <button className="duo-button" onClick={handleNextMonth}>▶</button>
                    </div>
                </div>
            </header>

            {/* Layout principal com lista de dias e resumo */}
            <main className="app__main">
                {/* Usamos a key para forçar o reset do estado interno do Layout ao mudar de mês */}
                <Layout
                    key={`${currentYear}-${currentMonth}`}
                    days={days}
                    settings={settings}
                    onSettingsChange={setSettings}
                    salarioMensal={settings.salarioMensal}
                />
            </main>

            {/* Footer da aplicação */}
            <footer className="app__footer">
                <p>
                    Desenvolvido para controle pessoal de jornada CLT.
                    Os cálculos seguem regras da CLT vigente e são atualizados automaticamente.
                </p>
            </footer>
        </div>
    );
}

export default App;
