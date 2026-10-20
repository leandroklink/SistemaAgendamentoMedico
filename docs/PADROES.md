# Padrões Criacionais — Sistema Integrado de Agendamento Médico

Este documento explica onde cada um dos cinco padrões criacionais foi aplicado, que problema resolve e por que faz sentido naquele ponto do sistema.

## Visão geral do fluxo

O `src/index.ts` percorre a jornada de uma consulta e usa os cinco padrões em sequência:

1. **Singleton** — a configuração da clínica e a base de agendamentos são únicas e compartilhadas.
2. **Prototype** — a grade de horários do médico é gerada clonando uma Semana Modelo.
3. **Abstract Factory** — ao agendar, o ambiente da consulta (presencial ou online) é montado.
4. **Builder** — durante o atendimento, o médico monta o prontuário passo a passo.
5. **Factory Method** — ao finalizar, receita e comprovante são enviados pelo canal preferido do paciente.

| Padrão | Localização principal |
|---|---|
| Singleton | `src/agenda/GerenciadorDeAgendamentos.ts`, `src/config/ConfiguracaoClinica.ts` |
| Prototype | `src/grade/SemanaModelo.ts` (+ `TurnoAtendimento.ts`, `SlotHorario.ts`) |
| Abstract Factory | `src/atendimento/FabricaAtendimento.ts` (+ `FabricaPresencial.ts`, `FabricaTelemedicina.ts`) |
| Builder | `src/prontuario/ProntuarioBuilder.ts` |
| Factory Method | `src/notificacoes/NotificacaoFactory.ts` |

---

## Singleton

- **Onde:** `src/agenda/GerenciadorDeAgendamentos.ts` e `src/config/ConfiguracaoClinica.ts`
- **Problema que resolve:** vários pontos do sistema (agendamento, atendimento, relatórios) precisam enxergar o mesmo estado: a lista de agendamentos e as regras da clínica (nome, duração padrão da consulta, quantas semanas gerar na grade). Se cada módulo criasse a sua própria cópia, uma consulta marcada em um lugar não existiria para os outros e as regras poderiam divergir.
- **Por que faz sentido aqui:** nas duas classes o construtor é privado e a única forma de obter a instância é `getInstance()`, que cria na primeira chamada e reaproveita nas seguintes. Isso dá uma fonte única de verdade, funcionando como a base central em memória do sistema. O `index.ts` demonstra com `config === ConfiguracaoClinica.getInstance()`.

## Prototype

- **Onde:** `src/grade/SemanaModelo.ts` (protótipo principal), `TurnoAtendimento.ts` e `SlotHorario.ts` (partes clonadas), `Clonavel.ts` (contrato `clonar()`) e `GradeDeHorarios.ts` (quem usa os clones)
- **Problema que resolve:** o médico tem turnos fixos que se repetem toda semana (ex.: terça das 08h às 12h, com 4 slots). Criar esses blocos do zero para todas as semanas do período seria repetitivo e pesado.
- **Por que faz sentido aqui:** a clínica monta uma única `SemanaModelo` e a `GradeDeHorarios` a clona com `clonarParaSemanaSeguinte(n)`, que faz `clonar()` e depois só desloca as datas em `7 × n` dias. O clone é **profundo**: turnos e slots são recriados, porque são mutáveis e têm estado (`ocupado`). Se só a lista fosse copiada, reservar um horário em uma semana ocuparia o mesmo horário em todas as outras. O `Medico` é compartilhado por referência, pois é só identificação e é imutável. O `index.ts` prova a independência: reservar um slot na cópia não altera o modelo.
- **Diferença para os padrões de fábrica:** aqui o objeto novo nasce **copiando um existente**, não sendo construído do zero por uma fábrica ou builder.

## Abstract Factory

- **Onde:** `src/atendimento/FabricaAtendimento.ts` (interface), `FabricaPresencial.ts` e `FabricaTelemedicina.ts` (fábricas concretas), `ProdutosAtendimento.ts` (produtos abstratos) e `AmbienteConsulta.ts` (cliente)
- **Problema que resolve:** a consulta pode ser presencial ou por telemedicina, e cada modalidade exige um conjunto de objetos compatíveis entre si: presencial = Sala Física + Senha do Painel; telemedicina = Link do Zoom + Token de Acesso à API de Vídeo. O sistema não pode misturar esses recursos.
- **Por que faz sentido aqui:** a interface `FabricaAtendimento` declara `criarLocal()` e `criarCredencial()`. Cada fábrica concreta devolve só peças da sua família. `AmbienteConsulta` usa apenas a interface, então não sabe qual modalidade está montando. A diferença para o Factory Method é que aqui se cria uma **família** de produtos relacionados, e não um produto isolado.

## Builder

- **Onde:** `src/prontuario/ProntuarioBuilder.ts` (construtor passo a passo) e `src/prontuario/Prontuario.ts` (objeto construído)
- **Problema que resolve:** o prontuário varia muito: consulta de rotina leva só anamnese; retorno adiciona análise de exames; emergência exige prescrições e atestado. Um construtor com muitos parâmetros opcionais seria rígido e confuso.
- **Por que faz sentido aqui:** o médico monta o prontuário passo a passo (`comAnamnese`, `adicionarAnaliseDeExames`, `adicionarDiagnostico`, `adicionarPrescricao`, `adicionarAtestado`), cada método correspondendo a um clique na tela de atendimento. O `build()` valida o que é obrigatório (consulta e anamnese) e entrega o `Prontuario` pronto. Cada tipo de consulta usa só as etapas de que precisa.

## Factory Method

- **Onde:** `src/notificacoes/NotificacaoFactory.ts` (criador abstrato + `EmailNotificacaoFactory`, `SMSNotificacaoFactory`, `WhatsAppNotificacaoFactory`); produtos em `Notificacao.ts`, `EmailNotificacao.ts`, `SMSNotificacao.ts` e `WhatsAppNotificacao.ts`
- **Problema que resolve:** depois da consulta o paciente precisa receber a receita digital e o comprovante, mas cada paciente tem uma preferência cadastrada (e-mail, SMS ou WhatsApp). O módulo de atendimento não deve saber como cada canal envia mensagem.
- **Por que faz sentido aqui:** a classe abstrata `NotificacaoFactory` define `enviarDocumento` e `notificarAgendamento`, que são iguais para todos os canais, e deixa para as subclasses a decisão de qual `Notificacao` concreta criar, via `criarNotificacao()`. Quem decide é a subclasse, que é exatamente o caso de uso do Factory Method. Para adicionar um novo canal basta criar uma nova subclasse.

---

## Como os padrões se integram

- A **grade** (Prototype) define quando o médico atende; o agendamento só é aceito se houver um slot livre nela.
- Ao agendar, a **Abstract Factory** monta o ambiente da consulta e o **Singleton** guarda o agendamento na base central.
- No atendimento, o **Builder** monta o prontuário; o `Prontuario` gera a receita e o comprovante.
- Ao finalizar, o **Factory Method** envia os documentos pelo canal preferido do paciente.

## Limitações conhecidas

- Tudo fica em memória: o Singleton de agendamentos faz o papel do "banco de dados" citado no `TEMA.md`; não há persistência real.
- O envio de mensagens e a integração com o Zoom são simulados (`console.log` e valores gerados), sem serviços externos.
