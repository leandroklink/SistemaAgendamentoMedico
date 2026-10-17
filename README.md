# Sistema Integrado de Agendamento Médico

Trabalho avaliativo de Padrões Criacionais (TypeScript). Sistema pequeno de agendamento médico que aplica Factory Method, Abstract Factory, Builder, Prototype e Singleton de forma integrada.

- Domínio e planejamento: [`docs/TEMA.md`](docs/TEMA.md)
- Onde e por que cada padrão foi usado: [`docs/PADROES.md`](docs/PADROES.md)

## Como executar

Requer Node.js (versão LTS).

```bash
npm install
npm start          # roda src/index.ts com tsx
npx tsc --noEmit   # verifica os tipos sem gerar arquivos
npm run build      # compila para dist/
```

## Padrões aplicados

| Padrão | Papel no sistema | Pasta |
|---|---|---|
| Singleton | Configuração da clínica e base central de agendamentos | `src/config`, `src/agenda` |
| Prototype | Clonagem da Semana Modelo para gerar a grade de horários | `src/grade` |
| Abstract Factory | Ambiente da consulta: presencial ou telemedicina | `src/atendimento` |
| Builder | Montagem passo a passo do prontuário médico | `src/prontuario` |
| Factory Method | Envio de receita e comprovante pelo canal do paciente | `src/notificacoes` |

## Estrutura

```
src/
├── agenda/          GerenciadorDeAgendamentos (Singleton)
├── config/          ConfiguracaoClinica (Singleton)
├── grade/           SemanaModelo, TurnoAtendimento, SlotHorario, GradeDeHorarios (Prototype)
├── atendimento/     FabricaPresencial / FabricaTelemedicina (Abstract Factory)
├── prontuario/      ProntuarioBuilder, Prontuario (Builder)
├── notificacoes/    NotificacaoFactory e canais (Factory Method)
├── models/          Paciente, Medico, Agendamento
└── index.ts         Fluxo completo integrando os cinco padrões
docs/
├── TEMA.md
└── PADROES.md
```

## Andamento

| Aula | Entrega | Situação |
|------|---------|----------|
| 1 | Planejamento (`TEMA.md`) | Concluída |
| 2 | Factory Method + Singleton | Concluída |
| 3 | Abstract Factory + Builder | Concluída |
| 4 | Prototype + revisão final | Concluída |
