import { Paciente, CanalNotificacao } from "./models/Paciente";
import { Medico } from "./models/Medico";
import { Agendamento } from "./models/Agendamento";
import { GerenciadorDeAgendamentos } from "./agenda/GerenciadorDeAgendamentos";
import { FabricaAtendimento } from "./atendimento/FabricaAtendimento";
import { FabricaPresencial } from "./atendimento/FabricaPresencial";
import { FabricaTelemedicina } from "./atendimento/FabricaTelemedicina";
import { ProntuarioBuilder } from "./prontuario/ProntuarioBuilder";
import { Prontuario } from "./prontuario/Prontuario";
import {
  NotificacaoFactory,
  EmailNotificacaoFactory,
  SMSNotificacaoFactory,
  WhatsAppNotificacaoFactory,
} from "./notificacoes/NotificacaoFactory";

// ---------- FACTORY METHOD: escolhe o canal conforme a preferência do paciente ----------
function escolherFactory(canal: CanalNotificacao): NotificacaoFactory {
  switch (canal) {
    case "email":
      return new EmailNotificacaoFactory();
    case "sms":
      return new SMSNotificacaoFactory();
    case "whatsapp":
      return new WhatsAppNotificacaoFactory();
  }
}

function destinoDe(paciente: Paciente): string {
  return paciente.preferenciaNotificacao === "email" ? paciente.email : paciente.telefone;
}

// ---------- SINGLETON: base central de agendamentos ----------
const gerenciador = GerenciadorDeAgendamentos.getInstance();
console.log("Singleton: mesma instância?", gerenciador === GerenciadorDeAgendamentos.getInstance());

// ---------- ABSTRACT FACTORY: agendar já montando o ambiente da consulta ----------
function agendar(
  id: string,
  paciente: Paciente,
  medico: Medico,
  dataHora: Date,
  fabrica: FabricaAtendimento
): Agendamento {
  const agendamento = new Agendamento(id, paciente, medico, dataHora);
  agendamento.prepararAmbiente(fabrica);
  gerenciador.adicionar(agendamento);

  escolherFactory(paciente.preferenciaNotificacao).notificarAgendamento(
    destinoDe(paciente),
    `Olá ${paciente.nome}, consulta com ${medico.nome} em ${dataHora.toLocaleString("pt-BR")}. ${agendamento.ambiente!.descrever()}`
  );
  return agendamento;
}

// ---------- FACTORY METHOD: despacho dos documentos pós-consulta ----------
function finalizarConsulta(agendamento: Agendamento, prontuario: Prontuario): void {
  agendamento.realizar();
  const factory = escolherFactory(agendamento.paciente.preferenciaNotificacao);
  const destino = destinoDe(agendamento.paciente);

  const receita = prontuario.gerarReceita();
  if (receita) factory.enviarDocumento(destino, "Receita digital", receita);
  factory.enviarDocumento(destino, "Comprovante", prontuario.gerarComprovante());
}

// ---------- Dados de exemplo ----------
const ana = new Paciente("p1", "Ana Souza", "(67) 99999-0001", "ana@email.com", "email");
const bruno = new Paciente("p2", "Bruno Dias", "(67) 99999-0002", "bruno@email.com", "whatsapp");
const carla = new Paciente("p3", "Carla Mota", "(67) 99999-0003", "carla@email.com", "sms");
const carlos = new Medico("m1", "Dr. Carlos Lima", "Cardiologia");

const fabricaConsultorio = new FabricaPresencial("Sala 12 - Cardiologia");
const fabricaOnline = new FabricaTelemedicina();

// ---------- Consulta 1: ROTINA, presencial -> prontuário só com anamnese ----------
console.log("\n=== 1) Consulta de rotina (presencial) ===");
const c1 = agendar("a1", ana, carlos, new Date("2026-10-20T09:00:00"), fabricaConsultorio);
const prontuario1 = new ProntuarioBuilder()
  .paraConsulta(c1)
  .comAnamnese("Check-up anual, sem queixas. Pressão arterial normal.")
  .build();
console.log(prontuario1.resumo());
finalizarConsulta(c1, prontuario1);

// ---------- Consulta 2: RETORNO, telemedicina -> anamnese + exames + diagnóstico + receita ----------
console.log("\n=== 2) Consulta de retorno (telemedicina) ===");
const c2 = agendar("a2", bruno, carlos, new Date("2026-10-27T14:30:00"), fabricaOnline);
const prontuario2 = new ProntuarioBuilder()
  .paraConsulta(c2)
  .comAnamnese("Retorno após ajuste de medicação.")
  .adicionarAnaliseDeExames("Colesterol LDL em queda em relação ao exame anterior.")
  .adicionarDiagnostico("Dislipidemia em controle")
  .adicionarPrescricao("Atorvastatina 20 mg", "1 comprimido à noite por 60 dias")
  .build();
console.log(prontuario2.resumo());
finalizarConsulta(c2, prontuario2);

// ---------- Consulta 3: EMERGÊNCIA, presencial -> prescrições + atestado ----------
console.log("\n=== 3) Consulta de emergência (presencial) ===");
const c3 = agendar("a3", carla, carlos, new Date("2026-11-03T10:00:00"), fabricaConsultorio);
const prontuario3 = new ProntuarioBuilder()
  .paraConsulta(c3)
  .comAnamnese("Dor torácica há 2 horas, sem irradiação.")
  .adicionarDiagnostico("Dor torácica de origem muscular, descartada causa cardíaca aguda")
  .adicionarPrescricao("Ibuprofeno 400 mg", "1 comprimido a cada 8 horas por 5 dias")
  .adicionarPrescricao("Omeprazol 20 mg", "1 cápsula em jejum por 5 dias")
  .adicionarAtestado(2, "Repouso por dor torácica")
  .build();
console.log(prontuario3.resumo());
finalizarConsulta(c3, prontuario3);

// ---------- Validação do Builder ----------
console.log("\n=== 4) Builder sem anamnese (deve falhar) ===");
try {
  new ProntuarioBuilder().paraConsulta(c1).build();
} catch (erro) {
  console.log("Erro esperado:", (erro as Error).message);
}

console.log("\n=== Resumo ===");
console.log("Consultas do Dr. Carlos na base central:", gerenciador.listarPorMedico("m1").length);
gerenciador.listarTodos().forEach((a) => console.log(`  ${a.id} [${a.status}] ${a.paciente.nome} -> ${a.ambiente?.descrever()}`));
