import { FabricaAtendimento } from "./FabricaAtendimento";
import { LocalConsulta, CredencialAcesso } from "./ProdutosAtendimento";

class LinkZoom implements LocalConsulta {
  constructor(private readonly url: string) {}

  descrever(): string {
    return `Link do Zoom: ${this.url}`;
  }
}

class TokenAcessoVideo implements CredencialAcesso {
  constructor(private readonly token: string) {}

  descrever(): string {
    return `Token de acesso à API de vídeo: ${this.token}`;
  }
}

// Família TELEMEDICINA: Link do Zoom + Token de Acesso à API de Vídeo
// (valores simulados: não há integração real com o Zoom neste trabalho)
export class FabricaTelemedicina implements FabricaAtendimento {
  private proximaReuniao = 1;

  criarLocal(): LocalConsulta {
    const idReuniao = 84000000000 + this.proximaReuniao;
    return new LinkZoom(`https://zoom.us/j/${idReuniao}`);
  }

  criarCredencial(): CredencialAcesso {
    const token = `vid_tok_${String(this.proximaReuniao++).padStart(6, "0")}`;
    return new TokenAcessoVideo(token);
  }
}
