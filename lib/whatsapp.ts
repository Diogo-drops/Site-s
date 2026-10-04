import type {Prisma} from "@prisma/client";
import {whatsappMessage} from "@/lib/order";
import {money} from "@/lib/money";
type Order=Prisma.OrderGetPayload<{include:{customer:true,address:true,items:true}}>;
export function whatsappDetails(order:Order){const message=(order.quote?"SOLICITAÇÃO DE COMPRA · valores sujeitos à confirmação\n\n":"")+whatsappMessage(order)+`\n\nPagamento: ${order.paymentMethod}\nSituação: ${order.status}`;const number=(process.env.WHATSAPP_NUMBER||"").replace(/\D/g,"");return {message,whatsappUrl:/^\d{10,15}$/.test(number)?`https://wa.me/${number}?text=${encodeURIComponent(message)}`:null}}
export async function notifyStore(order:Order):Promise<string>{
 const token=process.env.WHATSAPP_API_TOKEN,id=process.env.WHATSAPP_PHONE_NUMBER_ID,template=process.env.WHATSAPP_ORDER_TEMPLATE,version=process.env.WHATSAPP_GRAPH_VERSION,recipient=process.env.WHATSAPP_NOTIFICATION_NUMBER;
 if(!token||!id||!template||!version||!recipient)return "MANUAL";
 if(!/^v\d+\.\d+$/.test(version)||!/^\d+$/.test(id)||!/^\d{10,15}$/.test(recipient))return "FAILED";
 try{const response=await fetch(`https://graph.facebook.com/${version}/${id}/messages`,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify({messaging_product:"whatsapp",to:recipient,type:"template",template:{name:template,language:{code:process.env.WHATSAPP_TEMPLATE_LANGUAGE||"pt_BR"},components:[{type:"body",parameters:[order.number,order.customer.name,money(order.total)].map(text=>({type:"text",text}))}]}}),signal:AbortSignal.timeout(10000)});return response.ok?"SENT":"FAILED"}catch{return "FAILED"}}
