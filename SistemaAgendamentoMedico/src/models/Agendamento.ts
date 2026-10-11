import { Medico } from "./Medico";
import { Paciente } from "./Paciente";
import { AmbienteConsulta } from "../atendimento/AmbienteConsulta";
import { FabricaAtendimento } from "../atendimento/FabricaAtendimento";


export type StatusAgendamento = "AGENDADO" | "CONFIRMADO" | "CANCELADO" | "REALIZADO";

export class Agendamento {
  public status: StatusAgendamento = "AGENDADO";

  // Infraestrutura da consulta (física ou online), criada pela Abstract Factory
  public ambiente?: AmbienteConsulta;

  constructor(
    public readonly id: string,
    public readonly paciente: Paciente,
    public readonly medico: Medico,
    public readonly dataHora: Date
  ) {}

  prepararAmbiente(fabrica: FabricaAtendimento): void {
    this.ambiente = new AmbienteConsulta(fabrica);
  }

  confirmar(): void {
    this.status = "CONFIRMADO";
  }

  realizar(): void {
    this.status = "REALIZADO";
  }

  cancelar(): void {
    this.status = "CANCELADO";
  }
}
