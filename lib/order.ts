export function orderNumber(id:number, date=new Date()){
  const y=date.getFullYear(), m=String(date.getMonth()+1).padStart(2,"0"), d=String(date.getDate()).padStart(2,"0");
  return `GF-${y}${m}${d}-${String(id).padStart(4,"0")}`;
}
export function whatsappMessage(o:any){
  const items=o.items.map((i:any)=>`${i.quantity}x ${i.productName}\n${new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(i.unitPrice*i.quantity/100)}`).join("\n\n");
  const money=(n:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n/100);
  return `🛒 NOVO PEDIDO — GOLD FISH\n\nPedido: #${o.number}\n\n📦 PRODUTOS\n\n${items}\n\nSubtotal: ${money(o.subtotal)}\nFrete: ${o.quote?"A combinar":money(o.shipping)}\nDesconto: ${money(o.discount)}\n\n💰 ${o.quote?"TOTAL DE REFERÊNCIA":"TOTAL"}: ${money(o.total)}\n\n👤 CLIENTE\n${o.customer.name}\n\n📱 WhatsApp:\n${o.customer.whatsapp}\n\n📧 E-mail:\n${o.customer.email}\n\n📍 ENDEREÇO\n${o.address.street}, ${o.address.number}${o.address.complement?` - ${o.address.complement}`:""}\n${o.address.city} - ${o.address.state}\nCEP: ${o.address.cep}`;
}
