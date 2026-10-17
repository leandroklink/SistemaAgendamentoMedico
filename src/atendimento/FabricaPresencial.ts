import { FabricaAtendimento } from "./FabricaAtendimento";
import { LocalConsulta, CredencialAcesso } from "./ProdutosAtendimento";

class SalaFisica implements LocalConsulta {
  constructor(private readonly identificacao: string) {}

  descrever(): string {
    return `Sala física: ${this.identificacao}`;
  }
}

class SenhaPainel implements CredencialAcesso {
  constructor(private readonly codigo: string) {}

  descrever(): string {
    return `Senha do painel: ${this.codigo}`;
  }
}

// Família PRESENCIAL: Sala Física + Senha do Painel
export class FabricaPresencial implements FabricaAtendimento {
  private proximaSenha = 1;

  constructor(private readonly sala: string = "Sala 01") {}

  criarLocal(): LocalConsulta {
    return new SalaFisica(this.sala);
  }

  criarCredencial(): CredencialAcesso {
    const codigo = `P-${String(this.proximaSenha++).padStart(3, "0")}`;
    return new SenhaPainel(codigo);
  }
}
