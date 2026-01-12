/**
 * SettingsPanel.example.tsx
 * 
 * Exemplo de uso do componente SettingsPanel.
 * 
 * Este arquivo demonstra como integrar o SettingsPanel
 * na aplicação para permitir edição de configurações.
 */

import { useState } from 'react';
import SettingsPanel from './SettingsPanel';
import type { Settings } from '../core/types';

/**
 * Exemplo básico de uso do SettingsPanel
 */
function SettingsPanelExample() {
    // Estado das configurações
    const [settings, setSettings] = useState<Settings>({
        salarioMensal: 2200.00,
        horaEntradaPadrao: '08:00',
        horaSaidaPadrao: '17:00',
        intervaloPadraoHoras: 1,
        folgaPadrao: 'domingo',
        escala: '6x1',
    });

    // Estado do salário (pode ser separado)
    const [salarioMensal, setSalarioMensal] = useState(2200.00);

    // Estado do INSS (opcional)
    const [descontoINSS, setDescontoINSS] = useState<number | undefined>(undefined);

    // Handler para mudança de settings
    const handleSettingsChange = (newSettings: Settings) => {
        console.log('Configurações atualizadas:', newSettings);
        setSettings(newSettings);
    };

    // Handler para mudança de salário
    const handleSalarioChange = (newSalario: number) => {
        console.log('Salário atualizado:', newSalario);
        setSalarioMensal(newSalario);
    };

    // Handler para mudança de INSS
    const handleINSSChange = (newINSS: number) => {
        console.log('INSS atualizado:', newINSS);
        setDescontoINSS(newINSS);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px' }}>
            <SettingsPanel
                settings={settings}
                onSettingsChange={handleSettingsChange}
                salarioMensal={salarioMensal}
                onSalarioChange={handleSalarioChange}
                descontoINSS={descontoINSS}
                onINSSChange={handleINSSChange}
            />

            {/* Você pode usar as configurações aqui */}
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f0f0f0' }}>
                <h3>Configurações Atuais:</h3>
                <pre>{JSON.stringify(settings, null, 2)}</pre>
                <p>Salário: R$ {salarioMensal.toFixed(2)}</p>
                {descontoINSS && <p>INSS: R$ {descontoINSS.toFixed(2)}</p>}
            </div>
        </div>
    );
}

/**
 * Exemplo integrado com App
 * Mostra como usar SettingsPanel junto com Layout
 */
function SettingsPanelIntegratedExample() {
    const [settings, setSettings] = useState<Settings>({
        salarioMensal: 2200.00,
        horaEntradaPadrao: '08:00',
        horaSaidaPadrao: '17:00',
        intervaloPadraoHoras: 1,
        folgaPadrao: 'domingo',
        escala: '6x1',
    });

    const [salarioMensal, setSalarioMensal] = useState(2200.00);
    const [descontoINSS, setDescontoINSS] = useState<number | undefined>(undefined);

    // Quando settings mudar, você pode regenerar os dias
    const handleSettingsChange = (newSettings: Settings) => {
        setSettings(newSettings);
        // Aqui você poderia regenerar os dias do mês com novos padrões
        // generateMonthDays(year, month, newSettings);
    };

    const handleSalarioChange = (newSalario: number) => {
        setSalarioMensal(newSalario);
        // Atualiza também no settings
        setSettings(prev => ({ ...prev, salarioMensal: newSalario }));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>App CLT com Configurações</h1>

            {/* Painel de configurações */}
            <div style={{ marginBottom: '24px' }}>
                <SettingsPanel
                    settings={settings}
                    onSettingsChange={handleSettingsChange}
                    salarioMensal={salarioMensal}
                    onSalarioChange={handleSalarioChange}
                    descontoINSS={descontoINSS}
                    onINSSChange={setDescontoINSS}
                />
            </div>

            {/* Aqui viria o Layout com os dias */}
            <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <p>
                    Quando o usuário alterar as configurações, você pode:
                </p>
                <ul>
                    <li>Regenerar todos os dias do mês com os novos horários padrão</li>
                    <li>Recalcular o resumo mensal com o novo salário</li>
                    <li>Aplicar o desconto INSS customizado</li>
                </ul>
            </div>
        </div>
    );
}

/**
 * Exemplo com validação customizada
 */
function SettingsPanelWithValidationExample() {
    const [settings, setSettings] = useState<Settings>({
        salarioMensal: 2200.00,
        horaEntradaPadrao: '08:00',
        horaSaidaPadrao: '17:00',
        intervaloPadraoHoras: 1,
        folgaPadrao: 'domingo',
        escala: '6x1',
    });

    const [salarioMensal, setSalarioMensal] = useState(2200.00);

    const handleSettingsChange = (newSettings: Settings) => {
        // Validação: hora de saída deve ser após hora de entrada
        const entrada = newSettings.horaEntradaPadrao.split(':').map(Number);
        const saida = newSettings.horaSaidaPadrao.split(':').map(Number);

        const entradaMinutes = entrada[0] * 60 + entrada[1];
        const saidaMinutes = saida[0] * 60 + saida[1];

        if (saidaMinutes <= entradaMinutes) {
            alert('Hora de saída deve ser após hora de entrada!');
            return;
        }

        // Validação: salário mínimo
        if (newSettings.salarioMensal < 1412) {
            alert('Salário não pode ser menor que o mínimo nacional (R$ 1.412,00)');
            return;
        }

        setSettings(newSettings);
    };

    const handleSalarioChange = (newSalario: number) => {
        if (newSalario < 1412) {
            alert('Salário não pode ser menor que o mínimo nacional (R$ 1.412,00)');
            return;
        }
        setSalarioMensal(newSalario);
        setSettings(prev => ({ ...prev, salarioMensal: newSalario }));
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px' }}>
            <h2>Configurações com Validação</h2>
            <SettingsPanel
                settings={settings}
                onSettingsChange={handleSettingsChange}
                salarioMensal={salarioMensal}
                onSalarioChange={handleSalarioChange}
            />
        </div>
    );
}

export {
    SettingsPanelExample,
    SettingsPanelIntegratedExample,
    SettingsPanelWithValidationExample
};
export default SettingsPanelExample;
