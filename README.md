## Publicação na Vercel

Siga o passo a passo completo em [VERCEL.md](VERCEL.md). O deploy usa PostgreSQL e migrações; a prévia local continua em SQLite.

# GOLD FISH — Loja unificada

86 produtos do PDF `loja jun.pdf`, com fotos, códigos e preços de referência conferidos. Nove categorias abrem em novas abas e exibem somente seus produtos. Todos os itens têm botão Comprar, carrinho persistente, checkout, acompanhamento e mensagem para WhatsApp.

## Instalação

Node.js 20+:

```bash
npm install
cp .env.example .env
# Configure ADMIN_PASSWORD e AUTH_SECRET com valores seguros
npm run db:push
npm run db:seed
npm run dev
```

Acesse http://127.0.0.1:3000. Admin: /admin-login. Build: `npm run build`.

## Catálogo e pedidos

Os preços vêm do catálogo de 29/07/2026 e são referências; o PDF não fornece estoque. Não foram inventadas quantidades. Todos os produtos podem ser adicionados e enviados à loja. Se algum item ainda não foi confirmado, o pedido fica AGUARDANDO_CONFIRMACAO, sem cobrança e sem redução de estoque. O frete desses pedidos é combinado com a equipe.

No painel, confirme os preços em reais e os estoques reais dos produtos. Depois clique em Confirmar pedido. O servidor recalcula os valores e reserva estoque em transação. Produtos já confirmados são validados novamente no checkout. O frete de R$15 para pedidos confirmados continua demonstrativo: configure a política real antes de operar.

Os quatro exemplos antigos são desativados sem apagar o histórico. O seed é repetível e preserva preços confirmados e estoques. O código 99999 foi excluído por não ter descrição no PDF; consulte data/catalogo-exclusoes.json.

## WhatsApp

WHATSAPP_NUMBER=5511940216955 é o contato impresso no catálogo. Verifique se continua atual. O botão abre a conversa com produtos, quantidades, cliente, endereço e número do pedido; o cliente confirma o envio no WhatsApp. Nenhuma mensagem real foi enviada durante os testes.

Envio automático opcional: configure WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_GRAPH_VERSION, WHATSAPP_NOTIFICATION_NUMBER e WHATSAPP_ORDER_TEMPLATE. O destinatário das notificações deve ser um número autorizado a receber avisos da loja, diferente do número remetente da API. O template precisa estar aprovado na Meta e ter três parâmetros de texto: número do pedido, nome do cliente e total de referência. A notificação é um resumo; o botão do pedido envia os detalhes. Falhas não apagam o pedido; o fallback manual permanece disponível.

## Gateway de pagamento

A estrutura é configurável em lib/payments.ts. Há um adaptador opcional de Mercado Pago Checkout Pro (Pix/cartão), não ativado por padrão. Outro gateway escolhido pela loja exige identificar o provedor e implementar seu adaptador — não foi presumido um serviço diferente.

Para habilitar o adaptador disponível:

- PAYMENT_PROVIDER=mercadopago
- MERCADOPAGO_ACCESS_TOKEN: credencial real de teste ou produção
- MERCADOPAGO_WEBHOOK_SECRET: chave da aplicação para validar notificações
- MERCADOPAGO_SANDBOX=true para a fase de testes
- NEXT_PUBLIC_BASE_URL: URL pública HTTPS da loja

Configure o webhook da aplicação para /api/payments/webhook, tópico payment. Sem essas configurações, a opção online não aparece no checkout e os pedidos continuam pelo WhatsApp. O gateway só cobra pedidos com preço/estoque confirmados. Nenhum número de cartão é armazenado: pagamento acontece no ambiente do provedor. O retorno do navegador não confirma pagamento; somente a consulta server-side após webhook assinado pode marcar PAGO. A página de acompanhamento usa um token aleatório e não entra no sitemap.

Para operação real, ainda configure frete, políticas comerciais e produtos/estoques atuais. Não compartilhe .env, tokens nem URLs privadas de pedidos.

## Testes

Com npm run dev ativo em outro terminal:

```bash
npm run test:api
npm run test:payments
node --import tsx tests/webhook.test.ts
```

Esses testes criam dados temporários e removem seus registros. Use somente um banco local de desenvolvimento.

Teste de navegador opcional: instale Playwright e @sparticuz/chromium como dependências de teste, depois npm run test:browser. Também pode informar GF_BROWSER com o caminho de um Chromium disponível no sistema.

Consulte VALIDACAO.md e BUILD.log para a validação desta entrega.
