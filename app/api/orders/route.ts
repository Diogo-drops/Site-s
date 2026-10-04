import {randomUUID} from "node:crypto";
import {NextResponse} from "next/server";import {z} from "zod";import {db} from "@/lib/db";import {orderNumber} from "@/lib/order";import {whatsappDetails,notifyStore} from "@/lib/whatsapp";import {paymentConfigured} from "@/lib/payments";
const schema=z.object({name:z.string().trim().min(3).max(120),cpf:z.string().max(20).optional(),phone:z.string().min(8).max(25),whatsapp:z.string().min(8).max(25),email:z.string().email().max(200),cep:z.string().min(8).max(12),street:z.string().min(2).max(200),number:z.string().min(1).max(20),complement:z.string().max(200).optional(),district:z.string().min(2).max(100),city:z.string().min(2).max(100),state:z.string().length(2),paymentMethod:z.enum(["WHATSAPP","ONLINE"]).default("WHATSAPP"),checkoutKey:z.string().uuid(),items:z.array(z.object({productId:z.number().int().positive(),quantity:z.number().int().min(1).max(99)})).min(1).max(100)});
export async function POST(req:Request){try{
 const input=schema.parse(await req.json());
 const previous=await db.order.findUnique({where:{checkoutKey:input.checkoutKey},include:{customer:true,address:true,items:true}});
 if(previous)return NextResponse.json({number:previous.number,orderUrl:`/pedidos/${previous.accessToken}`,quote:previous.quote,paymentMethod:previous.paymentMethod,...whatsappDetails(previous)});
 if(input.paymentMethod==="ONLINE"&&!paymentConfigured())return NextResponse.json({error:"Pagamento online ainda não configurado. Escolha atendimento pelo WhatsApp."},{status:503});
 const ids=input.items.map(i=>i.productId);if(new Set(ids).size!==ids.length)return NextResponse.json({error:"Produtos duplicados."},{status:400});
 const created=await db.$transaction(async tx=>{
  const products=await tx.product.findMany({where:{id:{in:ids},status:"ACTIVE"}});if(products.length!==ids.length)throw new Error("Produto inválido.");
  const quote=products.some(p=>!p.stockConfirmed||!p.priceConfirmed);
  if(quote&&input.paymentMethod==="ONLINE")throw new Error("A loja precisa confirmar os produtos antes do pagamento online. Finalize pelo WhatsApp.");
  if(!quote){for(const i of input.items){const p=products.find(p=>p.id===i.productId)!;const reserved=await tx.product.updateMany({where:{id:p.id,status:"ACTIVE",stockConfirmed:true,priceConfirmed:true,stock:{gte:i.quantity},price:p.price,promoPrice:p.promoPrice},data:{stock:{decrement:i.quantity}}});if(reserved.count!==1)throw new Error(`Estoque insuficiente para ${p.name}.`);await tx.inventory.updateMany({where:{productId:p.id},data:{quantity:{decrement:i.quantity}}})}}
  const subtotal=input.items.reduce((sum,i)=>{const p=products.find(p=>p.id===i.productId)!;return sum+(p.promoPrice??p.price)*i.quantity},0);const shipping=quote?0:1500;
  const customer=await tx.customer.create({data:{name:input.name,cpf:input.cpf,phone:input.phone,whatsapp:input.whatsapp,email:input.email,addresses:{create:{cep:input.cep,street:input.street,number:input.number,complement:input.complement,district:input.district,city:input.city,state:input.state}}},include:{addresses:true}});
  const order=await tx.order.create({data:{number:`TEMP-${randomUUID()}`,checkoutKey:input.checkoutKey,quote,status:quote?"AGUARDANDO_CONFIRMACAO":input.paymentMethod==="ONLINE"?"AGUARDANDO_PAGAMENTO":"NOVO",paymentMethod:input.paymentMethod,customerId:customer.id,addressId:customer.addresses[0].id,subtotal,shipping,discount:0,total:subtotal+shipping,items:{create:input.items.map(i=>{const p=products.find(p=>p.id===i.productId)!;return {productId:p.id,productName:p.name,quantity:i.quantity,unitPrice:p.promoPrice??p.price}})}}});
  return tx.order.update({where:{id:order.id},data:{number:orderNumber(order.id)},include:{customer:true,address:true,items:true}})
 });
 const whatsappStatus=await notifyStore(created);await db.order.update({where:{id:created.id},data:{whatsappStatus}});
 return NextResponse.json({number:created.number,quote:created.quote,paymentMethod:created.paymentMethod,orderUrl:`/pedidos/${created.accessToken}`,whatsappStatus,...whatsappDetails(created)});
 }catch(error){if(error instanceof z.ZodError)return NextResponse.json({error:error.issues[0].message},{status:400});return NextResponse.json({error:error instanceof Error&&!error.message.includes("prisma")?error.message:"Não foi possível criar o pedido. Tente novamente."},{status:400})}}
