import { LocalConsulta, CredencialAcesso } from "./ProdutosAtendimento";

/**
 * ABSTRACT FACTORY
 *
 * Declara um método de criação para cada peça da família de objetos que
 * uma consulta precisa. Cada modalidade implementa esta interface e só
 * devolve peças compatíveis entre si, então o sistema nunca mistura
 * "sala física" com "token de vídeo".
 */
export interface FabricaAtendimento {
  criarLocal(): LocalConsulta;
  criarCredencial(): CredencialAcesso;
}
