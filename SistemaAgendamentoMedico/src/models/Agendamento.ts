import { Medico } from "./medico";
import { Paciente } from "./Paciente";


export type StatusAgendamento = "AGENDADO" | "CONFIRMADO" | "CANCELADO" | "REALIZADO";

export class Agendamento {
  public status: StatusAgendamento = "AGENDADO";

  constructor(
    public readonly id: string,
    public readonly paciente: Paciente,
    public readonly medico: Medico,
    public readonly dataHora: Date
  ) {}

  confirmar(): void {
    this.status = "CONFIRMADO";
  }

  cancelar(): void {
    this.status = "CANCELADO";
  }
}
