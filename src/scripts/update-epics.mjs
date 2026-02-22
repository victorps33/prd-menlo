import pg from 'pg';

const { Client } = pg;

const epics = [
  { id: 1, description: 'Permitir que o franqueador configure a plataforma em minutos — do registro à primeira cobrança. Inclui wizard guiado de 4 passos, checklist de progresso e configuração de integrações (Omie, WhatsApp, email).' },
  { id: 2, description: 'Gerenciar a base completa de franqueados com cadastro individual e em lote. Inclui validação de CNPJ, classificação de saúde financeira, importação via planilha e KPIs por franquia.' },
  { id: 3, description: 'Automatizar o ciclo de apuração e faturamento da rede. Inclui cálculo por competência, breakdown detalhado por franquia, importação/exportação de dados e conciliação financeira.' },
  { id: 4, description: 'Criar, emitir e acompanhar cobranças de ponta a ponta. Inclui wizard de criação, sincronização com Omie, ciclo completo de status, filtros avançados e geração de boleto/PIX.' },
  { id: 5, description: 'Automatizar a comunicação de cobrança com réguas multicanal personalizáveis. Inclui timeline visual de ações, execução via cron, templates por canal (email, WhatsApp, SMS) e logging completo.' },
  { id: 6, description: 'Centralizar toda comunicação com franqueados em uma inbox unificada. Inclui conversas por múltiplos canais, filtros, atribuição de agentes e dashboard de atendimento com IA.' },
  { id: 7, description: 'Agente autônomo de cobrança que adapta tom e estratégia ao perfil de cada franqueado. Escala automaticamente para atendente humano quando necessário. Opera via WhatsApp e email.' },
  { id: 8, description: 'Assistente conversacional com IA (Claude) para análise inteligente de dados. Gera insights em tempo real, cria gráficos sob demanda e responde perguntas sobre a operação de cobrança.' },
  { id: 9, description: 'CRM completo voltado para cobrança com cards de cliente, métricas financeiras, timeline de interações, gestão de tarefas e visão 360° do relacionamento com cada franqueado.' },
  { id: 10, description: 'Painel executivo com KPIs em tempo real, gráficos interativos, heatmap de inadimplência, comparativos mensais e Command Palette para navegação rápida entre métricas.' },
  { id: 11, description: 'Registro centralizado de todas as notificações enviadas pela plataforma. Inclui filtros por canal, status de entrega, detalhamento completo e rastreabilidade de cada comunicação.' },
  { id: 12, description: 'Configurações avançadas da plataforma em 7 abas: Empresa, Cobranças, Notificações, Apuração, Integrações, Usuários e Aparência. Controle total sobre o comportamento do sistema.' },
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
