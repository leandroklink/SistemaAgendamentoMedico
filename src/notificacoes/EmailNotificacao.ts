import { Notificacao } from "./Notificacao";

export class EmailNotificacao implements Notificacao {
  enviar(destinatario: string, mensagem: string): void {
    console.log(`[E-MAIL] Para: ${destinatario} | Mensagem: ${mensagem}`);
  }
}
