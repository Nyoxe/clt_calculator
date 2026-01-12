/**
 * DayRow.tsx
 * 
 * Componente React para exibir e editar um dia de registro de jornada.
 * 
 * RESPONSABILIDADES:
 * - Exibir data, horários (entrada/saída/intervalo)
 * - Permitir marcar/desmarcar folga e feriado
 * - Editar horários inline (modo semi-manual)
 * - Destacar visualmente feriados
 * 
 * REGRAS:
 * - Não implementa cálculos (delegados para calculations.ts/payroll.ts)
 * - UI simples com classes CSS básicas
 * - Props tipadas com DayRecord
 * - Exporta componente padrão
 */

import React, { useState } from 'react';
import type { DayRecord } from '../core/types';
import './DayRow.css';

/**
 * Props do componente DayRow
 */
type DayRowProps = {
    /**
     * Registro do dia a ser exibido/editado
     */
    day: DayRecord;

    /**
     * Callback chamado quando o dia é modificado
     */
    onUpdate: (day: DayRecord) => void;
};

/**
 * Formata uma data para exibição (ex: "Seg, 01/01/2026")
 */
function formatDate(date: Date): string {
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const weekDay = weekDays[date.getDay()];

    return `${weekDay}, ${day}/${month}/${year}`;
}

/**
 * Componente principal: linha de dia da jornada
 */
function DayRow({ day, onUpdate }: DayRowProps) {
    // Estado local para modo de edição
    const [isEditing, setIsEditing] = useState(false);
    const [editEntrada, setEditEntrada] = useState(day.entrada);
    const [editSaida, setEditSaida] = useState(day.saida);
    const [editIntervalo, setEditIntervalo] = useState(String(day.intervaloHoras));

    /**
     * Confirma edição de horários
     */
    const handleSaveEdit = () => {
        const updatedDay: DayRecord = {
            ...day,
            entrada: editEntrada,
            saida: editSaida,
            intervaloHoras: parseFloat(editIntervalo) || 0,
        };
        onUpdate(updatedDay);
        setIsEditing(false);
    };

    /**
     * Cancela edição e restaura valores originais
     */
    const handleCancelEdit = () => {
        setEditEntrada(day.entrada);
        setEditSaida(day.saida);
        setEditIntervalo(String(day.intervaloHoras));
        setIsEditing(false);
    };

    /**
     * Marca/desmarca como folga
     */
    const handleToggleFolga = () => {
        const updatedDay: DayRecord = {
            ...day,
            ehFolga: !day.ehFolga,
            // Se marcar como folga, limpa horários
            entrada: !day.ehFolga ? '' : day.entrada,
            saida: !day.ehFolga ? '' : day.saida,
        };
        onUpdate(updatedDay);
    };

    /**
     * Marca/desmarca como feriado
     */
    const handleToggleFeriado = () => {
        const updatedDay: DayRecord = {
            ...day,
            ehFeriado: !day.ehFeriado,
        };
        onUpdate(updatedDay);
    };

    // Determina classes CSS para destacar status especiais
    const rowClass = [
        'day-row',
        day.ehFeriado ? 'day-row--feriado' : '',
        day.ehFolga ? 'day-row--folga' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={rowClass}>
            {/* Data do dia */}
            <div className="day-row__date">
                <strong>{formatDate(day.date)}</strong>
            </div>

            {/* Horários: entrada, saída, intervalo */}
            <div className="day-row__times">
                {isEditing ? (
                    // Modo edição: inputs
                    <>
                        <label className="day-row__input-group">
                            <span>Entrada:</span>
                            <input
                                type="time"
                                className="day-row__input"
                                value={editEntrada}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditEntrada(e.target.value)}
                            />
                        </label>
                        <label className="day-row__input-group">
                            <span>Saída:</span>
                            <input
                                type="time"
                                className="day-row__input"
                                value={editSaida}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditSaida(e.target.value)}
                            />
                        </label>
                        <label className="day-row__input-group">
                            <span>Intervalo (h):</span>
                            <input
                                type="number"
                                className="day-row__input"
                                value={editIntervalo}
                                step="0.5"
                                min="0"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditIntervalo(e.target.value)}
                            />
                        </label>
                    </>
                ) : (
                    // Modo visualização: texto
                    <>
                        <span className="day-row__time-item">
                            <strong>Entrada:</strong> {day.entrada || '--:--'}
                        </span>
                        <span className="day-row__time-item">
                            <strong>Saída:</strong> {day.saida || '--:--'}
                        </span>
                        <span className="day-row__time-item">
                            <strong>Intervalo:</strong> {day.intervaloHoras}h
                        </span>
                    </>
                )}
            </div>

            {/* Marcadores: folga e feriado */}
            <div className="day-row__flags">
                <label className="day-row__checkbox">
                    <input
                        type="checkbox"
                        checked={day.ehFolga}
                        onChange={handleToggleFolga}
                        disabled={isEditing}
                    />
                    <span>Folga</span>
                </label>
                <label className="day-row__checkbox">
                    <input
                        type="checkbox"
                        checked={day.ehFeriado}
                        onChange={handleToggleFeriado}
                        disabled={isEditing}
                    />
                    <span>Feriado</span>
                </label>
            </div>

            {/* Botões de ação */}
            <div className="day-row__actions">
                {isEditing ? (
                    <>
                        <button
                            type="button"
                            className="day-row__button day-row__button--save"
                            onClick={handleSaveEdit}
                        >
                            Salvar
                        </button>
                        <button
                            type="button"
                            className="day-row__button day-row__button--cancel"
                            onClick={handleCancelEdit}
                        >
                            Cancelar
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        className="day-row__button day-row__button--edit"
                        onClick={() => setIsEditing(true)}
                        disabled={day.ehFolga}
                    >
                        Editar
                    </button>
                )}
            </div>
        </div>
    );
}

export default DayRow;
