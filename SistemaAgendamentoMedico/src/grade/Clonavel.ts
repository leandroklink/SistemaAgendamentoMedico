// Contrato do PROTOTYPE: todo objeto que sabe produzir uma cópia independente de si mesmo.
export interface Clonavel<T> {
  clonar(): T;
}
