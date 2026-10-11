import { Paciente } from "../models/Paciente";
import { Medico } from "../models/Medico";

export interface Prescricao {
  medicamento: string;
  posologia: string;
}

export interface Atestado {
  diasAfastamento: number;
  motivo: string;
}

export interface DadosProntuario {
  agendamentoId: string;
  paciente: Paciente;
  medico: Medico;
  dataHora: Date;
  anamnese: string;
  analiseExames?: string;
  diagnostico?: string;
  prescricoes: Prescricao[];
  atestado?: Atestado;
}

// Objeto complexo: só deve ser criado pelo ProntuarioBuilder.
export class Prontuario {
  readonly agendamentoId: string;
  readonly paciente: Paciente;
  readonly medico: Medico;
  readonly dataHora: Date;
  readonly anamnese: string;
  readonly analiseExames?: string;
  readonly diagnostico?: string;
  readonly prescricoes: Prescricao[];
  readonly atestado?: Atestado;

  constructor(dados: DadosProntuario) {
    this.agendamentoId = dados.agendamentoId;
    this.paciente = dados.paciente;
    this.medico = dados.medico;
    this.dataHora = dados.dataHora;
    this.anamnese = dados.anamnese;
    this.analiseExames = dados.analiseExames;
    this.diagnostico = dados.diagnostico;
    this.prescricoes = [...dados.prescricoes];
    this.atestado = dados.atestado;
  }

  resumo(): string {
    const linhas = [
      `Prontuário da consulta ${this.agendamentoId}`,
      `  Paciente: ${this.paciente.nome}`,
      `  Médico: ${this.medico.nome} (${this.medico.especialidade})`,
      `  Data: ${this.dataHora.toLocaleString("pt-BR")}`,
      `  Anamnese: ${this.anamnese}`,
    ];
    if (this.analiseExames) linhas.push(`  Análise de exames: ${this.analiseExames}`);
    if (this.diagnostico) linhas.push(`  Diagnóstico: ${this.diagnostico}`);
    this.prescricoes.forEach((p, i) =>
      linhas.push(`  Prescrição ${i + 1}: ${p.medicamento} — ${p.posologia}`)
    );
    if (this.atestado) {
      linhas.push(`  Atestado: ${this.atestado.diasAfastamento} dia(s) — ${this.atestado.motivo}`);
    }
    return linhas.join("\n");
  }

  // Receita digital: só existe se o médico adicionou prescrições.
  gerarReceita(): string | undefined {
    if (this.prescricoes.length === 0) return undefined;
    const itens = this.prescricoes.map((p) => `- ${p.medicamento}: ${p.posologia}`).join("\n");
    return `Paciente: ${this.paciente.nome}\nMédico: ${this.medico.nome}\n${itens}`;
  }

  gerarComprovante(): string {
    return `Comprovante de atendimento de ${this.paciente.nome} com ${this.medico.nome} em ${this.dataHora.toLocaleString("pt-BR")}.`;
  }
}
