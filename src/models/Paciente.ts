export type CanalNotificacao = "email" | "sms" | "whatsapp";

export class Paciente {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly telefone: string,
    public readonly email: string,
    // Preferência de recebimento cadastrada no sistema (usada pelo Factory Method)
    public readonly preferenciaNotificacao: CanalNotificacao = "email"
  ) {}
}
