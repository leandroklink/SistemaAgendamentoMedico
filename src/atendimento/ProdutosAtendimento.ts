// Produtos abstratos da Abstract Factory.
// Toda consulta precisa de um LOCAL e de uma CREDENCIAL DE ACESSO,
// e as duas peças só fazem sentido juntas na mesma modalidade:
//   Presencial   -> Sala Física  + Senha do Painel
//   Telemedicina -> Link do Zoom + Token de Acesso à API de Vídeo

export interface LocalConsulta {
  descrever(): string;
}

export interface CredencialAcesso {
  descrever(): string;
}
