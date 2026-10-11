import { Agendamento } from "../models/Agendamento";
import { Paciente } from "../models/Paciente";
import { Medico } from "../models/Medico";
import { Prontuario, Prescricao, Atestado } from "./Prontuario";

/**
 * BUILDER
 *
 * O prontuário varia muito: consulta de rotina leva só a anamnese; retorno
 * soma análise de exames; emergência pede prescrições e atestado. Em vez de
 * um construtor com vários parâmetros opcionais, o médico vai montando o
 * documento passo a passo (cada método corresponde a um clique na tela de
 * atendimento) e chama build() no final.
 */
export class ProntuarioBuilder {
  private agendamentoId?: string;
  private paciente?: Paciente;
  private medico?: Medico;
  private dataHora?: Date;

  private anamnese?: string;
  private analiseExames?: string;
  private diagnostico?: string;
  private prescricoes: Prescricao[] = [];
  private atestado?: Atestado;

  // Obrigatório: de qual consulta é o prontuário
  paraConsulta(agendamento: Agendamento): this {
    this.agendamentoId = agendamento.id;
    this.paciente = agendamento.paciente;
    this.medico = agendamento.medico;
    this.dataHora = agendamento.dataHora;
    return this;
  }

  // Obrigatório: toda consulta tem anamnese
  comAnamnese(texto: string): this {
    this.anamnese = texto;
    return this;
  }

  adicionarAnaliseDeExames(texto: string): this {
    this.analiseExames = texto;
    return this;
  }

  adicionarDiagnostico(texto: string): this {
    this.diagnostico = texto;
    return this;
  }

  // Pode ser chamado várias vezes
  adicionarPrescricao(medicamento: string, posologia: string): this {
    this.prescricoes.push({ medicamento, posologia });
    return this;
  }

  adicionarAtestado(diasAfastamento: number, motivo: string): this {
    this.atestado = { diasAfastamento, motivo };
    return this;
  }

  build(): Prontuario {
    if (!this.agendamentoId || !this.paciente || !this.medico || !this.dataHora) {
      throw new Error("Prontuário sem consulta: use paraConsulta(agendamento)");
    }
    if (!this.anamnese) {
      throw new Error("Prontuário sem anamnese: ela é obrigatória em toda consulta");
    }

    return new Prontuario({
      agendamentoId: this.agendamentoId,
      paciente: this.paciente,
      medico: this.medico,
      dataHora: this.dataHora,
      anamnese: this.anamnese,
      analiseExames: this.analiseExames,
      diagnostico: this.diagnostico,
      prescricoes: this.prescricoes,
      atestado: this.atestado,
    });
  }
}
