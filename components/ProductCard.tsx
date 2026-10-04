import Link from "next/link";
import type { Product } from "@prisma/client";
import {money} from "@/lib/money";
import {AddToCart} from "@/components/Cart";
export function ProductCard({product:p,category}:{product:Product;category?:string}) {
 return <article className="card overflow-hidden flex flex-col" data-sku={p.sku}>
  <Link href={`/produtos/${p.slug}`}><img src={p.image||"/gold-fish-logo.jpeg"} alt={p.name} className="w-full aspect-square object-contain bg-white p-4" loading="lazy"/></Link>
  <div className="p-5 flex flex-col flex-1">{category&&<p className="text-xs font-bold text-sky-700">{category}</p>}<p className="text-xs text-slate-500 mt-1">Código: {p.sku}</p><Link href={`/produtos/${p.slug}`} className="font-bold block mt-2 min-h-12">{p.name}</Link><p className="text-2xl font-black my-3">{money(p.promoPrice??p.price)}</p>{!p.priceConfirmed&&<p className="text-xs text-amber-800 mb-4">Valor de referência do catálogo</p>}<div className="mt-auto"><AddToCart product={p}/></div></div>
 </article>
}
