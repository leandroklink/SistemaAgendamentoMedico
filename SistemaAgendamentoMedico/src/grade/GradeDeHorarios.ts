import { SemanaModelo } from "./SemanaModelo";
import { SlotHorario } from "./SlotHorario";

// Agenda de horários de um médico: a semana modelo mais as cópias geradas.
export class GradeDeHorarios {
  private readonly semanas: SemanaModelo[] = [];

  constructor(private readonly modelo: SemanaModelo) {
    this.semanas.push(modelo);
  }

  // Usa o PROTOTYPE: cada semana nova é um clone do modelo com as datas deslocadas.
  gerarProximasSemanas(quantidade: number): void {
    for (let i = 1; i <= quantidade; i++) {
      this.semanas.push(this.modelo.clonarParaSemanaSeguinte(i));
    }
  }

  totalDeSemanas(): number {
    return this.semanas.length;
  }

  totalDeSlots(): number {
    return this.semanas.reduce((soma, s) => soma + s.todosOsSlots().length, 0);
  }

  slotsLivres(): number {
    return this.semanas.reduce((soma, s) => soma + s.todosOsSlots().filter((x) => !x.ocupado).length, 0);
  }

  buscarSlot(dataHora: Date): SlotHorario | undefined {
    for (const semana of this.semanas) {
      const achado = semana.todosOsSlots().find((s) => s.dataHora.getTime() === dataHora.getTime());
      if (achado) return achado;
    }
    return undefined;
  }

  reservar(dataHora: Date, agendamentoId: string): void {
    const slot = this.buscarSlot(dataHora);
    if (!slot) {
      throw new Error(`Não há horário de atendimento em ${dataHora.toLocaleString("pt-BR")}`);
    }
    slot.reservar(agendamentoId);
  }

  primeiroSlotLivre(): SlotHorario | undefined {
    for (const semana of this.semanas) {
      const livre = semana.todosOsSlots().find((s) => !s.ocupado);
      if (livre) return livre;
    }
    return undefined;
  }
}
