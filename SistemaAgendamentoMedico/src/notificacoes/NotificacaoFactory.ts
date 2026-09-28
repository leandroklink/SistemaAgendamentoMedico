import { Notificacao } from "./Notificacao";
import { EmailNotificacao } from "./EmailNotificacao";
import { SMSNotificacao } from "./SMSNotificacao";
import { WhatsAppNotificacao } from "./WhatsAppNotificacao";


export abstract class NotificacaoFactory {
  abstract criarNotificacao(): Notificacao;

  notificarAgendamento(destinatario: string, mensagem: string): void {
    const notificacao = this.criarNotificacao();
    notificacao.enviar(destinatario, mensagem);
  }
}

export class EmailNotificacaoFactory extends NotificacaoFactory {
  criarNotificacao(): Notificacao {
    return new EmailNotificacao();
  }
}

export class SMSNotificacaoFactory extends NotificacaoFactory {
  criarNotificacao(): Notificacao {
    return new SMSNotificacao();
  }
}

export class WhatsAppNotificacaoFactory extends NotificacaoFactory {
  criarNotificacao(): Notificacao {
    return new WhatsAppNotificacao();
  }
}
