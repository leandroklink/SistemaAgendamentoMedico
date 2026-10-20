/**
 * SINGLETON (configuração)
 *
 * O TEMA.md prevê um gerenciador de configuração da clínica compartilhado por
 * todo o fluxo. As regras (nome, duração padrão da consulta, quantas semanas
 * gerar na grade) precisam ser as mesmas em qualquer módulo; duas instâncias
 * poderiam divergir. Por isso há uma única instância, acessada por getInstance().
 * 
 * Basicamente o singleton aqui faz com que a configuração da clínica seja formada essencialmente pelo nome da clínica,
 *  duração padrão da consulta e quantas semanas gerar na grade, e que essa configuração seja a mesma em qualquer parte do sistema.
 * 
 */
export class ConfiguracaoClinica {
  private static instancia: ConfiguracaoClinica;

  nomeClinica = "Clínica Saúde Integrada";
  duracaoConsultaMin = 60;
  semanasAGerar = 8;

  private constructor() {}

  static getInstance(): ConfiguracaoClinica {
    if (!ConfiguracaoClinica.instancia) {
      ConfiguracaoClinica.instancia = new ConfiguracaoClinica();
    }
    return ConfiguracaoClinica.instancia;
  }
}
