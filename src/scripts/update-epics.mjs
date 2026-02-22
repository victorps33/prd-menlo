import pg from 'pg';

const { Client } = pg;

const epics = [
  { id: 1, description: 'O franqueador chega à plataforma, cria sua conta com Google ou email, preenche os dados da empresa em um wizard de 4 passos, ativa o plano de cobrança e conecta Omie, WhatsApp e email. Ao final, um checklist mostra o que falta para começar a operar.' },
  { id: 2, description: 'Com a plataforma configurada, o franqueador importa sua base de franqueados — um a um ou em massa via planilha. O sistema valida cada CNPJ, sincroniza com o Omie e classifica automaticamente a saúde financeira de cada franqueado em verde, amarelo ou vermelho.' },
  { id: 3, description: 'Todo mês, o operador abre um novo ciclo de apuração por competência. O sistema puxa os dados, calcula royalties e taxas por franquia, exibe o breakdown detalhado e permite ajustes antes de fechar o faturamento e gerar as faturas.' },
  { id: 4, description: 'Com o faturamento fechado, o operador cria cobranças via wizard — define valor, vencimento e meio de pagamento (boleto ou PIX). Cada cobrança nasce com status "emitida" e percorre seu ciclo de vida: enviada, visualizada, paga, vencida ou renegociada. Filtros e busca permitem acompanhar tudo.' },
  { id: 5, description: 'O operador monta réguas de cobrança definindo o que acontece antes (D-3, D-7), no dia (D0) e após o vencimento (D+3, D+7, D+15). Cada passo dispara uma mensagem automática por email, WhatsApp ou SMS, usando templates com variáveis do franqueado. A timeline visual mostra o fluxo completo.' },
  { id: 6, description: 'Conforme as réguas disparam e franqueados respondem, todas as mensagens chegam em uma inbox unificada. O operador vê cada conversa com contexto completo — canal, cobrança vinculada, histórico — e responde sem sair da plataforma. Filtros por status, canal e responsável organizam a fila.' },
  { id: 7, description: 'Antes do operador humano intervir, a MIA assume as conversas de cobrança. Ela analisa o perfil do franqueado, escolhe o tom adequado, envia mensagens por WhatsApp e email, registra promessas de pagamento e toma decisões autônomas. Quando o caso exige julgamento humano, escala automaticamente com todo o contexto.' },
  { id: 8, description: 'A qualquer momento, o gestor abre a Júlia e pergunta em linguagem natural: "Qual a taxa de inadimplência deste mês?" ou "Quais franqueados estão atrasados há mais de 30 dias?". A Júlia consulta os dados em tempo real, gera gráficos e responde com insights acionáveis — tudo com dados anonimizados por padrão.' },
  { id: 9, description: 'O operador abre o card de qualquer franqueado e vê tudo: métricas financeiras, cobranças em aberto, timeline completa de interações e tarefas pendentes. Cria novas tarefas com prioridade, vincula a cobranças específicas e acompanha a evolução do relacionamento ao longo do tempo.' },
  { id: 10, description: 'O gestor acessa o dashboard e vê em tempo real os 4 KPIs principais: total emitido, recebido, pendente e taxa de inadimplência. Seleciona a competência, navega entre gráficos interativos, identifica padrões no heatmap e usa o Command Palette para saltar rapidamente para qualquer métrica ou franqueado.' },
  { id: 11, description: 'Quando precisa auditar, o operador acessa os logs e encontra cada notificação enviada — com canal utilizado, status de entrega, conteúdo da mensagem e link direto para a cobrança vinculada. Filtros por data, canal e status permitem encontrar qualquer comunicação em segundos.' },
  { id: 12, description: 'O franqueador acessa as configurações e ajusta a plataforma ao seu modelo de negócio: dados da empresa, regras de cobrança, templates de notificação, parâmetros de apuração, integrações ativas, permissões de usuários e aparência visual. Cada aba é independente e as mudanças aplicam imediatamente.' },
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
