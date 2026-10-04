import { PrismaClient } from "@prisma/client";
import catalog from "../data/catalogo.json";
const db = new PrismaClient();
const slug = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
async function main() {
  await db.$transaction(async tx => {
    // Retira somente os quatro exemplos originais da vitrine, preservando históricos.
    await tx.product.updateMany({where:{sku:{in:["GF-B001","GF-K001","GF-L001","GF-I001"]}},data:{status:"INACTIVE"}});
    for (const item of catalog) {
      const category = await tx.category.upsert({where:{slug:slug(item.category)},update:{name:item.category},create:{name:item.category,slug:slug(item.category)}});
      const data = {name:item.name,slug:item.slug,price:item.price,categoryId:category.id,image:item.image,description:`${item.name}. Informações do catálogo GOLD FISH, atualizado em 29/07/2026, página ${item.sourcePage}. Escolha este produto para montar seu pedido.`};
      // Estoque e confirmação existentes não são alterados ao repetir o seed.
      const existing = await tx.product.findUnique({where:{sku:item.sku},select:{priceConfirmed:true}});
      const {price,...metadata}=data;
      await tx.product.upsert({where:{sku:item.sku},update:existing?.priceConfirmed?metadata:data,create:{...data,sku:item.sku,stock:0,stockConfirmed:false,priceConfirmed:false,status:"ACTIVE",inventory:{create:{quantity:0}}}});
    }
  },{timeout:30000});
  console.log(`Catálogo importado: ${catalog.length} produtos. Preços e estoque aguardam confirmação da loja.`);
}
main().catch(error=>{console.error(error);process.exitCode=1}).finally(()=>db.$disconnect());
