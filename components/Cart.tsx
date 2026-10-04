"use client";
import React,{createContext,useContext,useEffect,useState} from "react";
type Item={id:number;name:string;price:number;image?:string|null;qty:number};
const C=createContext<any>(null);
export function CartProvider({children}:{children:React.ReactNode}){
 const [items,setItems]=useState<Item[]>([]);
 const [ready,setReady]=useState(false);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem("gf-cart")||"[]");if(Array.isArray(saved))setItems(saved.filter(i=>i&&Number.isInteger(i.id)&&typeof i.name==="string"&&Number.isFinite(i.price)&&Number.isInteger(i.qty)&&i.qty>=1&&i.qty<=99))}catch{}finally{setReady(true)}},[]);
 useEffect(()=>{if(ready){try{localStorage.setItem("gf-cart",JSON.stringify(items))}catch{}}},[items,ready]);
 const add=(p:any)=>setItems(x=>{const f=x.find(i=>i.id===p.id);return f?x.map(i=>i.id===p.id?{...i,qty:Math.min(99,i.qty+1)}:i):[...x,{id:p.id,name:p.name,price:p.promoPrice??p.price,image:p.image,qty:1}]});
 const setQty=(id:number,qty:number)=>setItems(x=>x.map(i=>i.id===id?{...i,qty:Math.min(99,Math.max(1,Number.isFinite(qty)?Math.trunc(qty):1))}:i));
 const remove=(id:number)=>setItems(x=>x.filter(i=>i.id!==id));
 const clear=()=>setItems([]);
 return <C.Provider value={{items,add,setQty,remove,clear}}>{children}</C.Provider>
}
export const useCart=()=>useContext(C);
export function AddToCart({product}:{product:any}){const {add}=useCart();const [added,setAdded]=useState(false);return <button className="btn w-full" onClick={()=>{add(product);setAdded(true);setTimeout(()=>setAdded(false),1800)}}>{added?"Adicionado ✓":"Comprar"}</button>}
