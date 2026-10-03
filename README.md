# GOLD FISH — catálogo e checkout

Site privado com 86 produtos e nove categorias. Categorias abrem em novas abas. Logo no cabeçalho e ícone de carrinho com contador. Todos os produtos possuem botão Comprar.

## Fluxo disponível
Compra → carrinho local com quantidades e subtotal → checkout no próprio site, com validação dos dados do cliente e endereço.

O carrinho usa armazenamento do navegador para o estado temporário de compra e sincroniza mudanças entre abas. Os preços exibidos vêm de catalogo.json. O frete está a definir; não há cobrança de frete fictícia.

## Pagamentos pendentes de ativação
A proprietária informou não ter conta em um provedor. Nenhum gateway está conectado. O botão Finalizar compra valida o formulário e informa explicitamente a indisponibilidade. Não cria pedido, não cobra e não simula pagamento aprovado. Não há coleta de dados de cartão.

Para pagamentos reais, será necessário escolher o provedor, conectar a conta por configuração segura no servidor e implementar criação de pagamento, verificação de valores e disponibilidade no backend, idempotência e webhooks autenticados. Valores do navegador nunca deverão ser usados como autoridade na cobrança. A aplicação completa Next.js/Prisma entregue separadamente contém o fluxo de pedidos local; esta publicação preserva sua vitrine e acrescenta o checkout de navegação.

## Arquivos
- dist/catalogo.json: produtos e preços do catálogo fornecido.
- dist/store.js: carrinho, totais e validação do checkout.
- dist/store.css: cabeçalho, carrinho e checkout responsivos.
- dist/index.html e páginas internas: catálogo e produtos.

Nenhum dado de pagamento ou segredo está presente no código cliente.

## Executar esta versão

Na raiz do repositório: `python3 -m http.server 8000 --directory dist`. Abra `http://localhost:8000`. Esta versão pode ser hospedada como site estático. O pagamento permanece desativado até a integração real com um provedor.
