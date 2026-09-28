import { Agendamento } from "../models/agendamento";



export class GerenciadorDeAgendamentos {
  private static instancia: GerenciadorDeAgendamentos;
  private agendamentos: Agendamento[] = [];

  private constructor() {}
 
  static getInstance(): GerenciadorDeAgendamentos {
    if (!GerenciadorDeAgendamentos.instancia) {
      GerenciadorDeAgendamentos.instancia = new GerenciadorDeAgendamentos();
    }
    return GerenciadorDeAgendamentos.instancia;
  }

  adicionar(agendamento: Agendamento): void {
    this.agendamentos.push(agendamento);
  }

  listarPorMedico(medicoId: string): Agendamento[] {
    return this.agendamentos.filter((a) => a.medico.id === medicoId);
  }

  listarPorPaciente(pacienteId: string): Agendamento[] {
    return this.agendamentos.filter((a) => a.paciente.id === pacienteId);
  }

  listarTodos(): Agendamento[] {
    return [...this.agendamentos];
  }

  cancelar(agendamentoId: string): void {
    const agendamento = this.agendamentos.find((a) => a.id === agendamentoId);
    agendamento?.cancelar();
  }
}
