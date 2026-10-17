import { Notificacao } from "./Notificacao";

export class WhatsAppNotificacao implements Notificacao {
  enviar(destinatario: string, mensagem: string): void {
    console.log(`[WHATSAPP] Para: ${destinatario} | Mensagem: ${mensagem}`);
  }
}
