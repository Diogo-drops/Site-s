# Validação da loja unificada

## Fontes reunidas

Base principal: gold-fish-codex-ready-2.zip, que já incorpora as correções de Prisma, carrinho e autenticação da versão gold-fish-codex-ready(1).zip. Mantidos logo, páginas e histórico dos produtos demonstrativos. Conferidos 86 códigos e preços diretamente no PDF loja jun.pdf; nenhuma divergência. Fotos existentes extraídas do documento preservadas. Nove categorias com páginas próprias.

O WhatsApp 5511940216955 foi lido no cabeçalho do catálogo, sem inventar número.

## Funcionalidades verificadas

- 86 produtos, fotos e botões Comprar.
- Nove categorias abrem em novas abas, com filtragem correta.
- Carrinho com quantidade, persistência após recarga e limpeza após checkout.
- Pedido com código único e chave para prevenir repetição em tentativas de envio.
- Produtos sem confirmação podem gerar pedido para atendimento; nenhum estoque fictício é criado e não há cobrança.
- Admin exige cookie assinado; APIs administrativas exigem autenticação.
- Admin confirma preço/estoque; confirmação do pedido recalcula valores e reserva estoque.
- Mensagem detalhada do pedido abre no WhatsApp do catálogo; nenhum envio externo realizado nos testes.
- Página de acompanhamento por token, fora do sitemap.
- Desktop e mobile sem transbordamento; nenhum erro de JavaScript capturado.

## Gateway e API WhatsApp

Testados em mocks locais isolados, sem credenciais reais, cobrança ou envio externo:

- Criação de preferência de pagamento com valores do banco e retorno configurado.
- Modo sandbox e falha do provedor.
- Assinatura válida/adulterada de webhook.
- Pagamento aprovado atualiza PAGO; repetição não duplica o pagamento.
- Valor divergente é rejeitado; evento pendente não rebaixa pedido pago.
- Notificação WhatsApp por template; fallback manual e tratamento de falha.

A opção de outro gateway foi selecionada pelo usuário, mas o provedor não foi identificado. O adaptador opcional incluído é Mercado Pago Checkout Pro; PAYMENT_PROVIDER=none mantém pagamento online desativado até configurar ou implementar o provedor escolhido. Nenhuma integração real ou liquidação financeira foi validada.

Envio automático depende de conta WhatsApp Business, token, ID remetente, versão Graph, destinatário autorizado e template aprovado. O botão manual depende apenas do contato da loja e da confirmação de envio pelo cliente.

## Resultado

Instalação, db:push e seed executados. Testes de API, navegador e integrações simuladas passaram. Dados de teste removidos. Build final registrado em BUILD.log. Resultados dos testes em TESTES.log.

## Limites comerciais

Preços do catálogo de 29/07/2026 são referências. Estoques precisam ser informados pela loja. Frete de R$15 para pedidos confirmados continua demonstrativo; pedidos pendentes usam entrega a combinar. É necessário configurar a operação real antes de receber vendas pagas.


## Preparação para Vercel

- Schema PostgreSQL separado do SQLite local e migração inicial versionada.
- Prisma Client regenerado no postinstall e no build específico da Vercel.
- prisma em dependencies para disponibilidade durante a instalação/build.
- Migrações e seed de produção em comandos separados do build.
- Sitemap dinâmico: não consulta banco externo durante o build.
- Confirmação administrativa de pedido usa atualização condicional para evitar duas reservas concorrentes no PostgreSQL.
- Configurações vercel.json e .env.vercel.example, guia VERCEL.md.
- Migração aplicada com sucesso em PostgreSQL embutido local (PGlite): 10 tabelas, relações, defaults e inserção de produto.
- Fluxos de API/navegador revalidados com SQLite: todos passaram; nenhum erro JS.
- Build PostgreSQL e build SQLite locais concluídos. Build PostgreSQL final em BUILD-VERCEL.log.
- Nenhuma credencial de banco externo criada, nenhum deploy real na Vercel realizado.
