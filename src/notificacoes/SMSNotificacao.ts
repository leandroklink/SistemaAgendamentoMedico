import { Notificacao } from "./Notificacao";

export class SMSNotificacao implements Notificacao {
  enviar(destinatario: string, mensagem: string): void {
    console.log(`[SMS] Para: ${destinatario} | Mensagem: ${mensagem}`);
  }
}
