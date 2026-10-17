import { Clonavel } from "./Clonavel";
import { SlotHorario } from "./SlotHorario";

// Um bloco fixo de atendimento do médico (ex.: "Terça - manhã": 4 slots de 60 min).
export class TurnoAtendimento implements Clonavel<TurnoAtendimento> {
  constructor(
    public readonly nome: string,
    public readonly slots: SlotHorario[]
  ) {}

  // Monta um turno a partir de um dia, hora de início, quantidade de slots e duração.
  static criar(nome: string, dia: Date, horaInicio: number, qtdSlots: number, duracaoMin: number): TurnoAtendimento {
    const slots: SlotHorario[] = [];
    for (let i = 0; i < qtdSlots; i++) {
      const inicio = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), horaInicio, i * duracaoMin);
      slots.push(new SlotHorario(inicio, duracaoMin));
    }
    return new TurnoAtendimento(nome, slots);
  }

  // Clone PROFUNDO: cada slot também é clonado. Se copiássemos só a lista,
  // reservar um horário em uma semana ocuparia o mesmo horário em todas.
  clonar(): TurnoAtendimento {
    return new TurnoAtendimento(this.nome, this.slots.map((s) => s.clonar()));
  }

  deslocarDias(dias: number): void {
    this.slots.forEach((s) => s.deslocarDias(dias));
  }
}
