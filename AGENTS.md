# AGENTS.md — GOLD FISH E-commerce

## Objetivo
Manter e evoluir este e-commerce da GOLD FISH, uma loja de produtos de pesca com checkout e encaminhamento de pedidos para WhatsApp.

## Stack
- Next.js
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite local por padrão
- PostgreSQL na Vercel: prisma/postgresql/schema.prisma e migrações versionadas
- Build de produção: npm run vercel-build
- Instruções de publicação: VERCEL.md

## Comandos principais
```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

## Antes de executar
Edite `.env` e defina:
- `ADMIN_PASSWORD`
- `AUTH_SECRET`
- `WHATSAPP_NUMBER`

Para desenvolvimento local, `DATABASE_URL="file:./dev.db"` já funciona.

## Regras técnicas importantes
1. Nunca confiar em preço, desconto, frete ou estoque enviados pelo frontend.
2. Validar preço e estoque no backend antes de criar pedidos.
3. Nunca expor tokens ou segredos no frontend.
4. Manter rotas administrativas protegidas.
5. Manter experiência mobile-first.
6. Não inventar credenciais de APIs externas.
   Catálogo sem estoque pode gerar pedido para confirmação, nunca cobrança nem estoque fictício.
   Pagamento confirmado somente por consulta server-side ao provedor após webhook assinado.
7. Integrações de pagamento, frete e WhatsApp Business devem ficar no servidor.
8. Preservar a identidade visual da GOLD FISH e o foco em produtos de pesca.

## Fluxo principal
Home → produto → carrinho → checkout → criação do pedido → número GF-AAAAMMDD-0001 → mensagem do pedido → WhatsApp.

## Onde mexer
- Home: `app/page.tsx`
- Produto: `app/produtos/[slug]/page.tsx`
- Carrinho: `app/carrinho/page.tsx`
- Checkout: `app/checkout/page.tsx`
- Pedido/API: `app/api/orders/route.ts`
- Admin: `app/admin/page.tsx`
- Banco: `prisma/schema.prisma`
- Seed: `prisma/seed.ts`
- WhatsApp/mensagem: `lib/order.ts`
- Variáveis de ambiente: `.env.example`

## Próximas melhorias recomendadas
- CRUD completo de produtos/categorias no admin
- Upload real de imagens
- Tela detalhada do pedido
- Alteração de status no admin
- Integração Mercado Pago/PIX
- Cálculo real de frete
- WhatsApp Business API
- PostgreSQL em produção
- Testes automatizados

Ao alterar modelos do banco, mantenha prisma/schema.prisma e prisma/postgresql/schema.prisma sincronizados.
