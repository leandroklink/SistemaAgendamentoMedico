import { FabricaAtendimento } from "./FabricaAtendimento";
import { LocalConsulta, CredencialAcesso } from "./ProdutosAtendimento";

// Cliente da Abstract Factory: monta o ambiente da consulta usando só a
// interface FabricaAtendimento, sem saber se é presencial ou telemedicina.
export class AmbienteConsulta {
  readonly local: LocalConsulta;
  readonly credencial: CredencialAcesso;

  constructor(fabrica: FabricaAtendimento) {
    this.local = fabrica.criarLocal();
    this.credencial = fabrica.criarCredencial();
  }

  descrever(): string {
    return `${this.local.descrever()} | ${this.credencial.descrever()}`;
  }
}
