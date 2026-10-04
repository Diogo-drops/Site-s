"use client";
import Link from "next/link";
import {ShoppingCart, X} from "lucide-react";
import {money} from "@/lib/money";
import React,{createContext,useContext,useEffect,useState,useRef} from "react";
export type Item={id:number;name:string;price:number;image?:string|null;qty:number};
const C=createContext<any>(null);
export function CartProvider({children}:{children:React.ReactNode}){
 const [items,setItems]=useState<Item[]>([]);
 const [previewOpen,setPreviewOpen]=useState(false);
 const [ready,setReady]=useState(false);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem("gf-cart")||"[]");if(Array.isArray(saved))setItems(saved.filter(i=>i&&Number.isInteger(i.id)&&typeof i.name==="string"&&Number.isFinite(i.price)&&Number.isInteger(i.qty)&&i.qty>=1&&i.qty<=99))}catch{}finally{setReady(true)}},[]);
 useEffect(()=>{if(ready){try{localStorage.setItem("gf-cart",JSON.stringify(items))}catch{}}},[items,ready]);
 const add=(p:any)=>{setPreviewOpen(true);setItems(x=>{const f=x.find(i=>i.id===p.id);return f?x.map(i=>i.id===p.id?{...i,qty:Math.min(99,i.qty+1)}:i):[...x,{id:p.id,name:p.name,price:p.promoPrice??p.price,image:p.image,qty:1}]});};
 const setQty=(id:number,qty:number)=>setItems(x=>x.map(i=>i.id===id?{...i,qty:Math.min(99,Math.max(1,Number.isFinite(qty)?Math.trunc(qty):1))}:i));
 const remove=(id:number)=>setItems(x=>x.filter(i=>i.id!==id));
 const clear=()=>setItems([]);
 return <C.Provider value={{items,add,setQty,remove,clear,previewOpen,setPreviewOpen}}>{children}</C.Provider>
}
export const useCart=()=>useContext(C);
export function AddToCart({product}:{product:any}){const {add}=useCart();const [added,setAdded]=useState(false);return <button className="btn w-full" onClick={()=>{add(product);setAdded(true);setTimeout(()=>setAdded(false),1800)}}>{added?"Adicionado ✓":"Comprar"}</button>}

export function CartPreview(){
 const {items,remove,previewOpen,setPreviewOpen}=useCart();
 const container=useRef<HTMLDivElement>(null);
 const button=useRef<HTMLButtonElement>(null);
 const count=items.reduce((sum:number,item:Item)=>sum+item.qty,0);
 const total=items.reduce((sum:number,item:Item)=>sum+item.price*item.qty,0);
 useEffect(()=>{
  if(!previewOpen)return;
  const outside=(event:PointerEvent)=>{if(!container.current?.contains(event.target as Node))setPreviewOpen(false)};
  const escape=(event:KeyboardEvent)=>{if(event.key==="Escape"){setPreviewOpen(false);button.current?.focus()}};
  document.addEventListener("pointerdown",outside);document.addEventListener("keydown",escape);
  return ()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape)};
 },[previewOpen,setPreviewOpen]);
 return <div ref={container} className="relative ml-auto">
  <button ref={button} type="button" className="btn gap-2 text-sm" aria-expanded={previewOpen} aria-controls="cart-preview" onClick={()=>setPreviewOpen(!previewOpen)}>
   <ShoppingCart size={21} aria-hidden="true"/><span>Carrinho</span><span className="rounded-full bg-white text-[#0b3a5b] px-2 py-0.5" aria-live="polite" aria-atomic="true">{count}</span>
  </button>
  {previewOpen&&<section id="cart-preview" aria-label="Prévia do carrinho" className="fixed right-3 left-3 top-32 md:absolute md:left-auto md:right-0 md:top-full md:mt-3 md:w-96 card p-5 z-40 max-h-[calc(100dvh-9rem)] overflow-y-auto">
   <div className="flex justify-between items-center mb-4"><h2 className="font-black text-lg">Seu carrinho ({count})</h2><button type="button" aria-label="Fechar prévia do carrinho" className="p-2" onClick={()=>setPreviewOpen(false)}><X size={20}/></button></div>
   {items.length?<><ul className="divide-y">{items.map((item:Item)=><li key={item.id} className="flex items-center gap-3 py-3"><img src={item.image||"/gold-fish-logo.jpeg"} alt={item.name} className="w-14 h-14 object-contain shrink-0"/><div className="min-w-0 flex-1"><p className="font-bold text-sm break-words">{item.name}</p><p className="text-sm text-slate-600">{item.qty} × {money(item.price)}</p></div><button type="button" onClick={()=>remove(item.id)} aria-label={`Remover ${item.name}`} className="p-2 text-red-700"><X size={16}/></button></li>)}</ul><div className="flex justify-between font-bold border-t pt-4 mt-2"><span>Subtotal</span><span>{money(total)}</span></div><p className="text-xs text-slate-500 mt-2">Preços e disponibilidade sujeitos à confirmação da loja. Frete informado no checkout.</p></>:<p className="text-slate-600 py-4">Seu carrinho está vazio. Escolha seus produtos para começar.</p>}
   <Link href="/carrinho" className="btn w-full mt-4" onClick={()=>setPreviewOpen(false)}>Acessar carrinho</Link>
   <button type="button" className="w-full mt-3 text-sm font-bold py-2" onClick={()=>setPreviewOpen(false)}>Continuar comprando</button>
  </section>}
 </div>
}
