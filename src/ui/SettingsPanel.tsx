/**
 * SettingsPanel.tsx
 * 
 * Componente React para editar configurações do usuário.
 * 
 * RESPONSABILIDADES:
 * - Exibir formulário de configurações
 * - Permitir edição de horários padrão
 * - Permitir edição de salário e INSS
 * - Chamar callbacks quando valores mudam
 * 
 * REGRAS:
 * - Não faz cálculos (delega para parent)
 * - Props tipadas com Settings
 * - UI simples e clara
 * - Validação básica de inputs
 */

import { useState } from 'react';
import type { Settings, WeekDay } from '../core/types';
import './SettingsPanel.css';

/**
 * Props do componente SettingsPanel
 */
type SettingsPanelProps = {
    /**
     * Configurações atuais
     */
    settings: Settings;

    /**
     * Callback chamado quando configurações mudam
     */
    onSettingsChange: (newSettings: Settings) => void;

    /**
     * Salário mensal atual
     */
    salarioMensal: number;

    /**
     * Callback chamado quando salário muda
     */
    onSalarioChange: (newSalario: number) => void;

    /**
     * Desconto INSS customizado (opcional)
     */
    descontoINSS?: number;

    /**
     * Callback chamado quando INSS muda (opcional)
     */
    onINSSChange?: (newINSS: number) => void;
};

/**
 * Opções de dias da semana para o select
 */
const WEEKDAY_OPTIONS: { value: WeekDay; label: string }[] = [
    { value: 'domingo', label: 'Domingo' },
    { value: 'segunda', label: 'Segunda-feira' },
    { value: 'terca', label: 'Terça-feira' },
    { value: 'quarta', label: 'Quarta-feira' },
    { value: 'quinta', label: 'Quinta-feira' },
    { value: 'sexta', label: 'Sexta-feira' },
    { value: 'sabado', label: 'Sábado' },
];

/**
 * Componente principal: painel de configurações
 */
function SettingsPanel({
    settings,
    onSettingsChange,
    salarioMensal,
    onSalarioChange,
    descontoINSS,
    onINSSChange,
}: SettingsPanelProps) {
    // Estado local para edição
    const [isEditing, setIsEditing] = useState(false);

    // Estado local dos campos do formulário
    const [localEntrada, setLocalEntrada] = useState(settings.horaEntradaPadrao);
    const [localSaida, setLocalSaida] = useState(settings.horaSaidaPadrao);
    const [localIntervalo, setLocalIntervalo] = useState(String(settings.intervaloPadraoHoras));
    const [localFolga, setLocalFolga] = useState(settings.folgaPadrao);
    const [localSalario, setLocalSalario] = useState(String(salarioMensal));
    const [localINSS, setLocalINSS] = useState(descontoINSS ? String(descontoINSS) : '');

    /**
     * Reseta campos locais com valores atuais
     */
    const resetLocalFields = () => {
        setLocalEntrada(settings.horaEntradaPadrao);
        setLocalSaida(settings.horaSaidaPadrao);
        setLocalIntervalo(String(settings.intervaloPadraoHoras));
        setLocalFolga(settings.folgaPadrao);
        setLocalSalario(String(salarioMensal));
        setLocalINSS(descontoINSS ? String(descontoINSS) : '');
    };

    /**
     * Inicia modo de edição
     */
    const handleEdit = () => {
        resetLocalFields();
        setIsEditing(true);
    };

    /**
     * Cancela edição e restaura valores originais
     */
    const handleCancel = () => {
        resetLocalFields();
        setIsEditing(false);
    };

    /**
     * Salva alterações e sai do modo de edição
     */
    const handleSave = () => {
        // Atualiza settings
        const newSettings: Settings = {
            ...settings,
            horaEntradaPadrao: localEntrada,
            horaSaidaPadrao: localSaida,
            intervaloPadraoHoras: parseFloat(localIntervalo) || 0,
            folgaPadrao: localFolga,
            salarioMensal: parseFloat(localSalario) || 0,
        };
        onSettingsChange(newSettings);

        // Atualiza salário
        onSalarioChange(parseFloat(localSalario) || 0);

        // Atualiza INSS se callback fornecido
        if (onINSSChange && localINSS) {
            onINSSChange(parseFloat(localINSS) || 0);
        }

        setIsEditing(false);
    };

    return (
        <div className="settings-panel">
            <div className="settings-panel__header">
                <h2 className="settings-panel__title">Configurações</h2>
                {!isEditing && (
                    <button
                        type="button"
                        className="settings-panel__button settings-panel__button--edit"
                        onClick={handleEdit}
                    >
                        ✏️ Editar
                    </button>
                )}
            </div>

            <div className="settings-panel__content">
                {isEditing ? (
                    // Modo edição: formulário
                    <form className="settings-panel__form" onSubmit={(e) => e.preventDefault()}>
                        {/* Seção: Horários */}
                        <fieldset className="settings-panel__fieldset">
                            <legend className="settings-panel__legend">Horários Padrão</legend>

                            <div className="settings-panel__field">
                                <label className="settings-panel__label" htmlFor="entrada">
                                    Hora de Entrada:
                                </label>
                                <input
                                    id="entrada"
                                    type="time"
                                    className="settings-panel__input"
                                    value={localEntrada}
                                    onChange={(e) => setLocalEntrada(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="settings-panel__field">
                                <label className="settings-panel__label" htmlFor="saida">
                                    Hora de Saída:
                                </label>
                                <input
                                    id="saida"
                                    type="time"
                                    className="settings-panel__input"
                                    value={localSaida}
                                    onChange={(e) => setLocalSaida(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="settings-panel__field">
                                <label className="settings-panel__label" htmlFor="intervalo">
                                    Intervalo (horas):
                                </label>
                                <input
                                    id="intervalo"
                                    type="number"
                                    className="settings-panel__input"
                                    value={localIntervalo}
                                    onChange={(e) => setLocalIntervalo(e.target.value)}
                                    step="0.5"
                                    min="0"
                                    max="4"
                                    required
                                />
                            </div>
                        </fieldset>

                        {/* Seção: Escala */}
                        <fieldset className="settings-panel__fieldset">
                            <legend className="settings-panel__legend">Escala de Trabalho</legend>

                            <div className="settings-panel__field">
                                <label className="settings-panel__label" htmlFor="folga">
                                    Dia de Folga Padrão:
                                </label>
                                <select
                                    id="folga"
                                    className="settings-panel__select"
                                    value={localFolga}
                                    onChange={(e) => setLocalFolga(e.target.value as WeekDay)}
                                    required
                                >
                                    {WEEKDAY_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="settings-panel__field">
                                <label className="settings-panel__label">Escala:</label>
                                <span className="settings-panel__value">{settings.escala}</span>
                            </div>
                        </fieldset>

                        {/* Seção: Valores */}
                        <fieldset className="settings-panel__fieldset">
                            <legend className="settings-panel__legend">Valores Financeiros</legend>

                            <div className="settings-panel__field">
                                <label className="settings-panel__label" htmlFor="salario">
                                    Salário Mensal (R$):
                                </label>
                                <input
                                    id="salario"
                                    type="number"
                                    className="settings-panel__input"
                                    value={localSalario}
                                    onChange={(e) => setLocalSalario(e.target.value)}
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="settings-panel__field">
                                <label className="settings-panel__label" htmlFor="inss">
                                    Desconto INSS (R$):
                                    <span className="settings-panel__optional"> (opcional)</span>
                                </label>
                                <input
                                    id="inss"
                                    type="number"
                                    className="settings-panel__input"
                                    value={localINSS}
                                    onChange={(e) => setLocalINSS(e.target.value)}
                                    step="0.01"
                                    min="0"
                                    placeholder="Calculado automaticamente"
                                />
                            </div>
                        </fieldset>

                        {/* Botões de ação */}
                        <div className="settings-panel__actions">
                            <button
                                type="button"
                                className="settings-panel__button settings-panel__button--save"
                                onClick={handleSave}
                            >
                                💾 Salvar
                            </button>
                            <button
                                type="button"
                                className="settings-panel__button settings-panel__button--cancel"
                                onClick={handleCancel}
                            >
                                ❌ Cancelar
                            </button>
                        </div>
                    </form>
                ) : (
                    // Modo visualização: resumo
                    <div className="settings-panel__summary">
                        <div className="settings-panel__summary-section">
                            <h3 className="settings-panel__summary-title">Horários</h3>
                            <div className="settings-panel__summary-item">
                                <span className="settings-panel__summary-label">Entrada:</span>
                                <span className="settings-panel__summary-value">{settings.horaEntradaPadrao}</span>
                            </div>
                            <div className="settings-panel__summary-item">
                                <span className="settings-panel__summary-label">Saída:</span>
                                <span className="settings-panel__summary-value">{settings.horaSaidaPadrao}</span>
                            </div>
                            <div className="settings-panel__summary-item">
                                <span className="settings-panel__summary-label">Intervalo:</span>
                                <span className="settings-panel__summary-value">{settings.intervaloPadraoHoras}h</span>
                            </div>
                        </div>

                        <div className="settings-panel__summary-section">
                            <h3 className="settings-panel__summary-title">Escala</h3>
                            <div className="settings-panel__summary-item">
                                <span className="settings-panel__summary-label">Folga:</span>
                                <span className="settings-panel__summary-value">
                                    {WEEKDAY_OPTIONS.find((opt) => opt.value === settings.folgaPadrao)?.label}
                                </span>
                            </div>
                            <div className="settings-panel__summary-item">
                                <span className="settings-panel__summary-label">Escala:</span>
                                <span className="settings-panel__summary-value">{settings.escala}</span>
                            </div>
                        </div>

                        <div className="settings-panel__summary-section">
                            <h3 className="settings-panel__summary-title">Valores</h3>
                            <div className="settings-panel__summary-item">
                                <span className="settings-panel__summary-label">Salário:</span>
                                <span className="settings-panel__summary-value">
                                    R$ {salarioMensal.toFixed(2)}
                                </span>
                            </div>
                            {descontoINSS !== undefined && (
                                <div className="settings-panel__summary-item">
                                    <span className="settings-panel__summary-label">INSS:</span>
                                    <span className="settings-panel__summary-value">
                                        R$ {descontoINSS.toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SettingsPanel;
