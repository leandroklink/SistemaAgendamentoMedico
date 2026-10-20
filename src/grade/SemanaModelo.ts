import { Clonavel } from "./Clonavel";
import { TurnoAtendimento } from "./TurnoAtendimento";
import { SlotHorario } from "./SlotHorario";
import { Medico } from "../models/Medico";

/**
 * PROTOTYPE
 *
 * Problema: os médicos têm turnos fixos que se repetem toda semana (ex.: terça
 * das 08h às 12h, com 4 slots). Criar esses blocos do zero para as 52 semanas
 * do ano seria repetitivo e pesado.
 *
 * Solução: a clínica monta UMA "Semana Modelo" e a clona para as semanas
 * seguintes, alterando só as datas. Cada clone é independente do modelo:
 * reservar um horário numa semana não afeta as outras nem o modelo.
 *
 * O clone é profundo em turnos e slots (que são mutáveis) e compartilha o
 * Medico por referência (ele é só identificação e é imutável).
 * 
 * 
 * 
 */
export class SemanaModelo implements Clonavel<SemanaModelo> {
  constructor(
    public readonly medico: Medico,
    public readonly turnos: TurnoAtendimento[]
  ) {}

  clonar(): SemanaModelo {
    return new SemanaModelo(this.medico, this.turnos.map((t) => t.clonar()));
  }

  deslocarDias(dias: number): void {
    this.turnos.forEach((t) => t.deslocarDias(dias));
  }

  // Cópia desta semana adiantada em N semanas: clona e só ajusta as datas.
  clonarParaSemanaSeguinte(semanasAFrente: number): SemanaModelo {
    const copia = this.clonar();
    copia.deslocarDias(7 * semanasAFrente);
    return copia;
  }

  todosOsSlots(): SlotHorario[] {
    return this.turnos.flatMap((t) => t.slots);
  }
}
