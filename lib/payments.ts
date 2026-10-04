import {createHmac,timingSafeEqual} from "node:crypto";
import type {Prisma} from "@prisma/client";
type Order=Prisma.OrderGetPayload<{include:{customer:true;items:true}}>;
export function paymentConfigured(){const base=process.env.NEXT_PUBLIC_BASE_URL||"";return process.env.PAYMENT_PROVIDER==="mercadopago"&&Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN&&process.env.MERCADOPAGO_WEBHOOK_SECRET)&&/^https:\/\//.test(base)}
export async function createPayment(order:Order){
 if(!paymentConfigured())throw new Error("Pagamento online ainda não configurado pela loja.");
 const base=process.env.NEXT_PUBLIC_BASE_URL!.replace(/\/$/,"");const returnUrl=`${base}/pedidos/${order.accessToken}`;
 const response=await fetch("https://api.mercadopago.com/checkout/preferences",{method:"POST",headers:{Authorization:`Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,"Content-Type":"application/json","X-Idempotency-Key":order.accessToken},body:JSON.stringify({external_reference:order.number,items:[...order.items.map(item=>({id:String(item.productId),title:item.productName,quantity:item.quantity,unit_price:item.unitPrice/100,currency_id:"BRL"})),...(order.shipping?[{id:"shipping",title:"Entrega",quantity:1,unit_price:order.shipping/100,currency_id:"BRL"}]:[])],payer:{email:order.customer.email},back_urls:{success:returnUrl,pending:returnUrl,failure:returnUrl},auto_return:"approved",notification_url:`${base}/api/payments/webhook`}),signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw new Error("O gateway não respondeu. Tente novamente pelo acompanhamento do pedido.");const data=await response.json();const url=process.env.MERCADOPAGO_SANDBOX==="true"?data.sandbox_init_point:data.init_point;
 if(!data.id||typeof url!=="string"||!/^https:\/\//.test(url))throw new Error("Resposta inválida do gateway.");return {preferenceId:String(data.id),checkoutUrl:url};
}
export function verifyPaymentSignature(signature:string|null,requestId:string|null,dataId:string|null){
 if(!signature||!requestId||!dataId||!process.env.MERCADOPAGO_WEBHOOK_SECRET)return false;const parts=Object.fromEntries(signature.split(",").map(p=>p.trim().split("=")));if(!/^\d+$/.test(parts.ts||"")||!/^([a-f0-9]{64})$/i.test(parts.v1||""))return false;
 const manifest=`id:${dataId.toLowerCase()};request-id:${requestId};ts:${parts.ts};`;const expected=createHmac("sha256",process.env.MERCADOPAGO_WEBHOOK_SECRET).update(manifest).digest();return timingSafeEqual(expected,Buffer.from(parts.v1,"hex"));
}
export async function readPayment(id:string){const response=await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(id)}`,{headers:{Authorization:`Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`},cache:"no-store",signal:AbortSignal.timeout(10000)});if(!response.ok)throw new Error("Consulta de pagamento indisponível");return response.json()}
