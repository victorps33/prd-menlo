import pg from 'pg';

const { Client } = pg;

const epics = [
  { id: 1, description: `Tudo começa quando o franqueador cria sua conta. Em poucos minutos, ele preenche os dados da empresa, define as regras padrão de cobrança (vencimento, juros, multa) e conecta as integrações que vão sustentar toda a operação: o ERP para dados financeiros, WhatsApp e SMS para falar com franqueados, email para notificações.

Um checklist acompanha esse setup e deixa claro o que falta. Se o franqueador tem time, já pode convidar outros usuários com diferentes níveis de acesso. Se optar pela assistente de IA (Júlia), um fluxo dedicado coleta o consentimento LGPD.

Com o checklist completo, a plataforma está viva e pronta para receber a base de franqueados.

→ Próximo: importar a rede (Etapa 2)` },
  { id: 2, description: `Com a plataforma de pé, o próximo passo é trazer a rede para dentro.

Se o ERP já está conectado, a base vem automaticamente e se mantém atualizada em tempo real via webhook. Sem integração, o franqueador importa via planilha ou cadastra manualmente. O sistema valida na entrada (CNPJ duplicado, campos faltando) e classifica cada unidade: aberta, fechada ou vendida.

A partir daqui, toda a rede está visível em um só lugar, com busca e filtros para encontrar qualquer franqueado em segundos.

→ Próximo: apurar quanto cada um deve (Etapa 3)` },
  { id: 3, description: `Todo mês, o ciclo recomeça: quanto cada franqueado deve pagar?

O operador abre uma nova apuração por competência, importa os dados de venda de cada loja e configura as regras (percentual de royalties, taxas, base de cálculo). O sistema faz as contas, exibe o breakdown por franquia e permite ajustes antes de fechar.

Na hora do fechamento, dois caminhos: com ERP integrado, as cobranças são geradas automaticamente. Sem integração, o operador exporta a planilha e alimenta o ERP manualmente.

→ Próximo: acompanhar as cobranças emitidas (Etapa 4)` },
  { id: 4, description: `As cobranças chegam (vindas da apuração ou criadas sob demanda) e cada uma entra com status "Pendente". Daqui, ela segue seu ciclo de vida: enviada, visualizada, paga, vencida ou renegociada. O status se atualiza sozinho conforme o vencimento e sincroniza com o ERP.

O operador tem uma visão consolidada por competência com KPIs, filtros e acesso rápido a boleto, NF e renegociação. Mas essa tela é para acompanhamento. O trabalho pesado de cobrar acontece sozinho, nas réguas.

→ Próximo: automatizar o acionamento (Etapa 5)` },
  { id: 5, description: `Com as cobranças emitidas, a pergunta é: quem cobra, quando e por qual canal?

O operador monta réguas definindo ações antes do vencimento (D-7, D-3), no dia (D0) e depois (D+3, D+7, D+15). Cada passo dispara uma mensagem automática por email, WhatsApp ou SMS, usando templates com variáveis do franqueado. A timeline visual mostra o fluxo inteiro de uma vez.

Cada step pode ser ativado ou desativado individualmente. Mensagens que falham entram em retry automático. Todo envio respeita horário comercial configurável e fica registrado em log. Para inadimplência grave, a régua pode escalar para negativação em bureau de crédito ou protesto em cartório.

A régua cuida do operacional. O operador só intervém quando precisa.

→ Próximo: gerenciar as conversas que surgem (Etapa 6)` },
  { id: 6, description: `As réguas disparam, os franqueados respondem e tudo cai numa inbox unificada.

Cada conversa chega com contexto completo: canal de origem, cobrança vinculada, histórico de interações. O operador filtra por status (aberta, pendente IA, humano, resolvida), por canal ou por responsável. Responde sem sair da plataforma, com indicador visual do canal sendo usado.

Confirmações de leitura mostram o que foi visto. Mensagens inbound chegam via webhook da Twilio e Customer.io. Um badge no menu lateral sinaliza conversas não lidas.

Quando o volume é alto demais para o time humano, entra a MIA.

→ Próximo: delegar para a IA (Etapa 7)` },
  { id: 7, description: `Antes do operador precisar intervir, a MIA já está trabalhando.

Ela processa cada mensagem inbound, analisa o perfil do franqueado (canal preferido, nível de risco, histórico) e decide o próximo passo sozinha: cobrar, oferecer parcelamento, registrar uma promessa de pagamento ou escalar para humano. Cada decisão é logada com nível de confiança e reasoning.

O operador acompanha tudo por um dashboard com métricas de performance do agente e uma lista de escalações ativas com motivo. Quando a MIA escala (por ameaça, distress ou disputa), o operador assume com todo o contexto já reunido.

O objetivo é simples: o time humano só toca nos casos que realmente precisam de julgamento humano.

→ Próximo: extrair inteligência dos dados (Etapa 8)` },
  { id: 8, description: `A qualquer momento, o gestor abre a Júlia e pergunta em linguagem natural.

"Qual a taxa de inadimplência deste mês?" "Quais franqueados pioraram nos últimos 90 dias?" "Compara o recebimento de março com abril." A Júlia consulta os dados reais da rede, gera gráficos inline e responde com dois níveis de detalhe (resumido ou aprofundado). Cada resposta vem com sugestões de follow-up e, quando aplicável, um plano de ações executáveis.

Ela também trabalha proativamente: alertas automáticos disparam quando métricas pioram. Todos os dados passam por anonimização de PII antes de chegar ao modelo. O histórico de conversas fica salvo localmente.

A Júlia transforma dados em decisão, sem precisar de analista, planilha ou BI.

→ Próximo: gestão individual de cada franqueado (Etapa 9)` },
  { id: 9, description: `Quando o operador precisa mergulhar em um caso específico, ele abre o CRM.

Cada franqueado tem um card com visão completa: dados de contato, cobranças em aberto, saldo, saúde financeira e métricas calculadas. Uma timeline cronológica reúne todas as interações (mensagens, ligações, notas, mudanças de status) num único lugar.

O operador cria tarefas vinculadas ao franqueado e à cobrança, com prioridade (baixa a crítica) e prazo. O fluxo é simples: pendente, em andamento, concluída. Filtros por status e prioridade organizam a fila de trabalho.

O CRM é onde cobrança vira relacionamento.

→ Próximo: visão executiva da operação (Etapa 10)` },
  { id: 10, description: `O gestor precisa de resposta rápida: como está a operação?

O dashboard mostra os 4 KPIs centrais em tempo real (total emitido, total recebido, taxa de inadimplência e cobranças pendentes). Gráficos interativos comparam recebido vs. emitido, mostram a evolução de status ao longo do tempo e a distribuição por forma de pagamento. Um seletor de competência permite navegar entre meses.

Para análise avançada, uma curva de safra mostra o envelhecimento da carteira e um mapa de calor revela concentrações geográficas de inadimplência. O Command Palette (Cmd+K) permite saltar para qualquer métrica, franqueado ou cobrança sem tirar as mãos do teclado.

→ Próximo: rastreabilidade das comunicações (Etapa 11)` },
  { id: 11, description: `Quando alguém pergunta "essa mensagem foi enviada?", a resposta está aqui.

Cada notificação disparada pela plataforma (por régua, por agente IA ou manualmente) fica registrada com canal utilizado, status de entrega, conteúdo completo da mensagem e link direto para a cobrança vinculada. A indicação da régua e trigger de origem mostra exatamente por que aquela mensagem foi enviada.

Filtros por data, canal e status permitem encontrar qualquer comunicação em segundos. É a camada de auditoria de toda a operação.

→ Próximo: configurar a plataforma ao modelo de negócio (Etapa 12)` },
  { id: 12, description: `A plataforma se adapta ao franqueador, não o contrário.

Nas configurações, ele ajusta tudo: dados da empresa, regras de cobrança, templates de notificação, parâmetros de apuração (% de royalties, FNP, base de cálculo), integrações ativas e suas credenciais. Na aba de usuários, gerencia o time (convida por email, atribui perfis de acesso). Na aba de aparência, escolhe tema claro ou escuro e personaliza a sidebar.

Cada aba funciona de forma independente. As mudanças aplicam imediatamente. O franqueador tem controle total sem depender de desenvolvimento.

→ Ciclo completo. No próximo mês, volta para a Etapa 3.` },
];

const client = new Client({
  host: 'db.vomwlbumdrylohcgrufk.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Diadesol@123',
  ssl: { rejectUnauthorized: false },
});

await client.connect();

for (const epic of epics) {
  await client.query(
    'UPDATE sections SET description = $1, updated_at = now() WHERE id = $2',
    [epic.description, epic.id]
  );
  console.log(`✓ Etapa ${epic.id} atualizada`);
}

await client.end();
console.log('\nTodas as 12 etapas atualizadas com épicos!');
