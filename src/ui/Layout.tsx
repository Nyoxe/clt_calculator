/**
 * Layout.tsx
 * 
 * Componente principal de visualização da jornada CLT.
 * Estilo Cartoonizado Duolingo com agrupamento por semana.
 */

import { useState, useMemo, useEffect } from 'react';
import DayRow from './DayRow';
import Summary from './Summary';
import SettingsPanel from './SettingsPanel';
import { calculateMonthlySummary } from '../core/calculations';
import type { DayRecord, Settings } from '../core/types';
import { isHoliday } from '../core/holidays';
import '../styles/app.css'; // Importando o novo estilo cartoon

/**
 * Props do componente Layout
 */
type LayoutProps = {
    days: DayRecord[];
    settings: Settings;
    onSettingsChange: (settings: Settings) => void;
    salarioMensal: number;
    descontoINSS?: number;
};

/**
 * Helper para formatar Mês/Ano
 */
function formatMonthYear(date: Date): string {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Agrupa os registros em semanas (começando no domingo)
 */
function groupDaysByWeek(days: DayRecord[]): DayRecord[][] {
    if (days.length === 0) return [];

    const weeks: DayRecord[][] = [];
    let currentWeek: DayRecord[] = [];

    days.forEach((day) => {
        // Se for domingo e a semana atual já tiver algo, começamos nova semana
        // Ou se for o primeiro dia
        if (day.date.getDay() === 0 && currentWeek.length > 0) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        currentWeek.push(day);
    });

    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    return weeks;
}

const Layout = ({
    days: initialDays,
    settings,
    onSettingsChange,
    salarioMensal,
    descontoINSS: initialINSS
}: LayoutProps) => {

    // Estados locais (apenas para dias e UI)
    const [days, setDays] = useState<DayRecord[]>(initialDays);
    const [descontoINSS, setDescontoINSS] = useState<number | undefined>(initialINSS);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Gerenciamento de Tema (Dark Mode)
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const saved = localStorage.getItem('app-theme');
        return (saved as 'light' | 'dark') || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    /**
     * Atualização de um dia individual
     */
    const handleDayUpdate = (updatedDay: DayRecord) => {
        setDays(prev => prev.map(d =>
            d.date.getTime() === updatedDay.date.getTime() ? updatedDay : d
        ));
    };

    /**
     * Atualização das configurações globais
     * Reinunda dias que usam o valor padrão ou precisam mudar de folga/feriado
     */
    const handleSettingsChange = (newSettings: Settings) => {
        onSettingsChange(newSettings);

        const weekDayMap: Record<string, number> = {
            'domingo': 0, 'segunda': 1, 'terca': 2, 'quarta': 3, 'quinta': 4, 'sexta': 5, 'sabado': 6,
        };
        const folgaDayNumber = weekDayMap[newSettings.folgaPadrao];

        setDays(prev => prev.map(day => {
            const date = day.date;
            const dayOfWeek = date.getDay();
            const isFolga = dayOfWeek === folgaDayNumber;
            const ehFeriado = isHoliday(date);

            const statusMudou = day.ehFolga !== isFolga || day.ehFeriado !== ehFeriado;

            if (statusMudou) {
                return {
                    ...day,
                    ehFolga: isFolga,
                    ehFeriado: ehFeriado,
                    entrada: isFolga ? '' : newSettings.horaEntradaPadrao,
                    saida: isFolga ? '' : newSettings.horaSaidaPadrao,
                    intervaloHoras: isFolga ? 0 : newSettings.intervaloPadraoHoras
                };
            }

            const isDefaultTime =
                day.entrada === settings.horaEntradaPadrao &&
                day.saida === settings.horaSaidaPadrao;

            if (isDefaultTime && !isFolga) {
                return {
                    ...day,
                    entrada: newSettings.horaEntradaPadrao,
                    saida: newSettings.horaSaidaPadrao,
                    intervaloHoras: newSettings.intervaloPadraoHoras
                };
            }

            return day;
        }));
    };

    // Cálculos derivados
    const monthlySummary = useMemo(() => calculateMonthlySummary(days, settings), [days, settings]);
    const weeks = useMemo(() => groupDaysByWeek(days), [days]);
    const monthYearTitle = days.length > 0 ? formatMonthYear(days[0].date) : 'Mês Atual';

    return (
        <div className="app">
            <header className="layout__header">
                <div className="layout__header-content">
                    <div className="layout__header-left">
                        <h1 className="layout__title">{monthYearTitle}</h1>
                        <span className="layout__subtitle">Controle de Jornada CLT</span>
                    </div>
                    <div className="layout__header-right" style={{ display: 'flex', gap: '12px' }}>
                        <button
                            className="duo-button"
                            onClick={toggleTheme}
                            title="Alternar Tema"
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <button
                            className="duo-button duo-button--navy"
                            onClick={() => setIsSettingsOpen(true)}
                        >
                            ⚙️ Configurações
                        </button>
                    </div>
                </div>
            </header>

            {/* Modal de Configurações */}
            {isSettingsOpen && (
                <div className="layout__settings-overlay" onClick={() => setIsSettingsOpen(false)}>
                    <div className="layout__settings-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="layout__settings-close" onClick={() => setIsSettingsOpen(false)}>✕</button>
                        <SettingsPanel
                            settings={settings}
                            onSettingsChange={(s) => { handleSettingsChange(s); setIsSettingsOpen(false); }}
                            salarioMensal={salarioMensal}
                            onSalarioChange={(s) => onSettingsChange({ ...settings, salarioMensal: s })}
                            descontoINSS={descontoINSS}
                            onINSSChange={setDescontoINSS}
                        />
                    </div>
                </div>
            )}

            <div className="layout__content">
                {/* Coluna Principal: Lista de Dias */}
                <section className="layout__days-section">
                    <div className="cartoon-panel" style={{ padding: 0, overflow: 'hidden' }}>
                        <div className="layout__days-scroll-container" style={{ padding: '24px' }}>
                            {weeks.map((week, wIndex) => (
                                <div key={wIndex} className="week-group">
                                    <h3 className="week-group__title">Semana {wIndex + 1}</h3>
                                    {week.map((day, dIndex) => {
                                        let extraClass = "cartoon-day";
                                        let icon = "💼";
                                        if (day.ehFolga) {
                                            extraClass += " cartoon-day--folga";
                                            icon = "💤";
                                        } else if (day.ehFeriado) {
                                            extraClass += " cartoon-day--feriado";
                                            icon = "🎉";
                                        }

                                        return (
                                            <div key={dIndex} className={extraClass}>
                                                <div className="cartoon-icon">{icon}</div>
                                                <DayRow day={day} onUpdate={handleDayUpdate} />
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Coluna Lateral: Resumo */}
                <aside className="layout__summary-panel">
                    <div className="cartoon-summary">
                        <h2>
                            Resumo Financeiro
                            <span className="cartoon-icon">💰</span>
                        </h2>
                        <Summary
                            monthlySummary={monthlySummary}
                            salarioMensal={salarioMensal}
                            descontoINSS={descontoINSS}
                        />
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Layout;
