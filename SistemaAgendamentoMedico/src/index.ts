import { Paciente, CanalNotificacao } from "./models/Paciente";
import { Medico } from "./models/Medico";
import { Agendamento } from "./models/Agendamento";
import { GerenciadorDeAgendamentos } from "./agenda/GerenciadorDeAgendamentos";
import { ConfiguracaoClinica } from "./config/ConfiguracaoClinica";
import { SemanaModelo } from "./grade/SemanaModelo";
import { TurnoAtendimento } from "./grade/TurnoAtendimento";
import { GradeDeHorarios } from "./grade/GradeDeHorarios";
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

// =====================================================================
// 1) SINGLETON: infraestrutura central (configuração + base de agendamentos)
// =====================================================================
const config = ConfiguracaoClinica.getInstance();
const gerenciador = GerenciadorDeAgendamentos.getInstance();
console.log(`${config.nomeClinica}`);
console.log("Singleton: configuração é a mesma instância?", config === ConfiguracaoClinica.getInstance());
console.log("Singleton: gerenciador é a mesma instância?", gerenciador === GerenciadorDeAgendamentos.getInstance());

// =====================================================================
// 2) PROTOTYPE: Semana Modelo do médico clonada para os meses seguintes
// =====================================================================
const carlos = new Medico("m1", "Dr. Carlos Lima", "Cardiologia");

// Semana modelo: segunda 12/10/2026. Terça manhã e tarde + quinta manhã.
const terca = new Date(2026, 9, 13);
const quinta = new Date(2026, 9, 15);
const semanaModelo = new SemanaModelo(carlos, [
  TurnoAtendimento.criar("Terça - manhã", terca, 8, 4, config.duracaoConsultaMin),
  TurnoAtendimento.criar("Terça - tarde", terca, 14, 4, config.duracaoConsultaMin),
  TurnoAtendimento.criar("Quinta - manhã", quinta, 8, 4, config.duracaoConsultaMin),
]);

const grade = new GradeDeHorarios(semanaModelo);
grade.gerarProximasSemanas(config.semanasAGerar);

console.log("\n=== PROTOTYPE: grade gerada a partir da Semana Modelo ===");
console.log(`Semanas: ${grade.totalDeSemanas()} | Slots: ${grade.totalDeSlots()} | Livres: ${grade.slotsLivres()}`);

// Prova de que o clone é independente do modelo (clone profundo)
const copia = semanaModelo.clonarParaSemanaSeguinte(1);
copia.todosOsSlots()[0].reservar("teste");
console.log(
  "Reservar na cópia afeta o modelo?",
  semanaModelo.todosOsSlots()[0].ocupado,
  "(false = clone independente)"
);

// =====================================================================
// 3) FACTORY METHOD: canal de notificação conforme a preferência do paciente
// =====================================================================
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

// =====================================================================
// 4) ABSTRACT FACTORY: ao agendar, reserva o slot e monta o ambiente da consulta
// =====================================================================
function agendar(
  id: string,
  paciente: Paciente,
  dataHora: Date,
  fabrica: FabricaAtendimento
): Agendamento {
  grade.reservar(dataHora, id); // falha se não houver horário livre na grade

  const agendamento = new Agendamento(id, paciente, carlos, dataHora);
  agendamento.prepararAmbiente(fabrica);
  gerenciador.adicionar(agendamento);

  escolherFactory(paciente.preferenciaNotificacao).notificarAgendamento(
    destinoDe(paciente),
    `Olá ${paciente.nome}, consulta com ${carlos.nome} em ${dataHora.toLocaleString("pt-BR")}. ${agendamento.ambiente!.descrever()}`
  );
  return agendamento;
}

// Despacho dos documentos pós-consulta (Factory Method)
function finalizarConsulta(agendamento: Agendamento, prontuario: Prontuario): void {
  agendamento.realizar();
  const factory = escolherFactory(agendamento.paciente.preferenciaNotificacao);
  const destino = destinoDe(agendamento.paciente);

  const receita = prontuario.gerarReceita();
  if (receita) factory.enviarDocumento(destino, "Receita digital", receita);
  factory.enviarDocumento(destino, "Comprovante", prontuario.gerarComprovante());
}

const ana = new Paciente("p1", "Ana Souza", "(67) 99999-0001", "ana@email.com", "email");
const bruno = new Paciente("p2", "Bruno Dias", "(67) 99999-0002", "bruno@email.com", "whatsapp");
const carla = new Paciente("p3", "Carla Mota", "(67) 99999-0003", "carla@email.com", "sms");

const fabricaConsultorio = new FabricaPresencial("Sala 12 - Cardiologia");
const fabricaOnline = new FabricaTelemedicina();

// ---------- Consulta 1: ROTINA, presencial -> prontuário só com anamnese ----------
console.log("\n=== Consulta 1: rotina (presencial) ===");
const c1 = agendar("a1", ana, new Date(2026, 9, 20, 9, 0), fabricaConsultorio);
const prontuario1 = new ProntuarioBuilder()
  .paraConsulta(c1)
  .comAnamnese("Check-up anual, sem queixas. Pressão arterial normal.")
  .build();
console.log(prontuario1.resumo());
finalizarConsulta(c1, prontuario1);

// ---------- Consulta 2: RETORNO, telemedicina -> anamnese + exames + diagnóstico + receita ----------
console.log("\n=== Consulta 2: retorno (telemedicina) ===");
const c2 = agendar("a2", bruno, new Date(2026, 9, 27, 14, 0), fabricaOnline);
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
console.log("\n=== Consulta 3: emergência (presencial) ===");
const c3 = agendar("a3", carla, new Date(2026, 10, 3, 10, 0), fabricaConsultorio);
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

// =====================================================================
// 5) Regras que a integração garante
// =====================================================================
console.log("\n=== Validações ===");
try {
  agendar("a4", ana, new Date(2026, 9, 20, 9, 0), fabricaConsultorio); // horário já reservado
} catch (erro) {
  console.log("Horário ocupado:", (erro as Error).message);
}
try {
  agendar("a5", ana, new Date(2026, 9, 21, 9, 0), fabricaConsultorio); // quarta: médico não atende
} catch (erro) {
  console.log("Dia sem atendimento:", (erro as Error).message);
}
try {
  new ProntuarioBuilder().paraConsulta(c1).build();
} catch (erro) {
  console.log("Builder sem anamnese:", (erro as Error).message);
}

console.log("\n=== Resumo final ===");
console.log(`Consultas na base central: ${gerenciador.listarPorMedico("m1").length}`);
gerenciador.listarTodos().forEach((a) =>
  console.log(`  ${a.id} [${a.status}] ${a.paciente.nome} -> ${a.ambiente?.descrever()}`)
);
console.log(`Slots livres na grade: ${grade.slotsLivres()} de ${grade.totalDeSlots()}`);
