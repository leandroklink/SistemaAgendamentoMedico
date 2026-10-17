# Tema do Trabalho: Sistema Integrado de Agendamento Médico

## 1. Objetivo do Trabalho
O objetivo deste trabalho é desenvolver um sistema funcional de agendamento médico que aplique de forma nativa e integrada os cinco padrões de projeto criacionais do GoF (Factory Method, Abstract Factory, Builder, Prototype e Singleton). 

A arquitetura do sistema foi desenhada para que os padrões não funcionem como exercícios isolados, mas sim como engrenagens de um mesmo fluxo de negócio: a jornada de uma consulta médica, desde a configuração da agenda do profissional até a finalização do atendimento.

---

## 2. O Cenário de Negócio Integrado
O sistema resolve o fluxo completo de uma clínica médica moderna através do seguinte cenário:

1. O sistema inicia e centraliza seus recursos globais via Singleton.
2. A clínica planeja os meses de atendimento clonando agendas base com o Prototype.
3. O paciente escolhe o tipo de consulta, e a infraestrutura correta (física ou online) é montada pela Abstract Factory.
4. Durante a consulta, o médico monta o prontuário por etapas usando o Builder.
5. Ao finalizar, o sistema decide o canal de comunicação correto para enviar a receita médica via Factory Method.

---

## 3. Integração Prática dos Padrões (Onde cada um resolve um problema real)

###  Singleton: Centralização de Infraestrutura
*   O Problema: O sistema precisa gerenciar o estado das sessões dos usuários e a conexão com o banco de dados. Múltiplas instâncias gerariam concorrência de dados e consumo desnecessário de memória.
*   A Solução: O ponto de acesso ao banco de dados e ao gerenciador de configuração da clínica é um Singleton, garantindo que todo o fluxo abaixo consuma a mesma base de dados centralizada.

###  Prototype: Geração da Grade de Horários
*   O Problema: Os médicos possuem turnos fixos que se repetem semanalmente (ex: toda terça-feira, das 08h às 12h, com 4 slots de atendimento). Criar esses blocos de horários do zero para as 52 semanas do ano no banco de dados é um trabalho repetitivo e pesado.
*   A Solução: O sistema cria uma "Semana Modelo" para o médico. O administrador da clínica usa o Prototype para clonar essa semana base para os meses seguintes, apenas alterando as datas de calendário dos blocos copiados.

###  Abstract Factory: Criação do Ambiente da Consulta
*   * O Problema: O agendamento pode ser Presencial ou por Telemedicina. Cada modalidade exige um ecossistema de objetos que devem ser compatíveis entre si. O presencial exige (Sala Física + Senha do Painel). A telemedicina exige (Link do Zoom + Token de Acesso à API de Vídeo). O sistema não pode misturar esses recursos.
*   A Solução: No momento do agendamento, o sistema aciona a Abstract Factory correspondente (`FabricaPresencial` ou `FabricaTelemedicina`) para gerar o conjunto exato de objetos de infraestrutura necessários para aquela consulta acontecer.

###  Builder: Composição do Prontuário Médico
*   O Problema: Durante a consulta, o médico precisa preencher o prontuário do paciente. Esse objeto é complexo e varia muito: uma consulta de rotina leva apenas anamnese; uma consulta de retorno adiciona análise de exames; uma emergência exige receitas e atestado médico. Construtores rígidos quebrariam o sistema.
*   A Solução: O médico utiliza o Builder na tela de atendimento. O prontuário vai sendo construído passo a passo à medida que o médico clica em "Adicionar Prescrição", "Adicionar Atestado" ou "Adicionar Diagnóstico", gerando o documento final de forma dinâmica e limpa.

###  Factory Method: Despacho de Documentos Pós-Consulta
*   O Problema: Assim que o prontuário é salvo, o paciente precisa receber a receita digital e o comprovante. Porém, cada paciente tem uma preferência de recebimento cadastrada no sistema (E-mail, SMS ou WhatsApp). O módulo de atendimento não deve saber como enviar mensagens de texto ou e-mails.
*   A Solução: O sistema passa o documento para um Factory Method de notificações. Esse método avalia o perfil do paciente e cria o emissor correto (Gerador de Alerta por WhatsApp, Gerador de E-mail, etc.) para despachar o arquivo, isolando a regra de comunicação da regra médica.
