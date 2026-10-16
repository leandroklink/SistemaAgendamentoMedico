import { Clonavel } from "./Clonavel";

// Um horário de atendimento (ex.: terça 08:00, 60 min).
export class SlotHorario implements Clonavel<SlotHorario> {
  ocupado = false;
  agendamentoId?: string;

  constructor(
    public dataHora: Date,
    public readonly duracaoMin: number
  ) {}

  reservar(agendamentoId: string): void {
    if (this.ocupado) {
      throw new Error(`Horário ${this.dataHora.toLocaleString("pt-BR")} já está ocupado`);
    }
    this.ocupado = true;
    this.agendamentoId = agendamentoId;
  }

  // O clone é um slot NOVO: mesma duração e horário, mas livre e sem vínculo
  // com o agendamento do original.
  clonar(): SlotHorario {
    return new SlotHorario(new Date(this.dataHora.getTime()), this.duracaoMin);
  }

  deslocarDias(dias: number): void {
    const nova = new Date(this.dataHora.getTime());
    nova.setDate(nova.getDate() + dias);
    this.dataHora = nova;
  }
}
