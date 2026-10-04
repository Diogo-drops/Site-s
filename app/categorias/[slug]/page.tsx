export const dynamic = "force-dynamic";
import Link from "next/link";
import {notFound} from "next/navigation";
import {db} from "@/lib/db";
import {ProductCard} from "@/components/ProductCard";
import {CatalogNotice} from "@/components/CatalogNotice";
export default async function Category({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const category=await db.category.findUnique({where:{slug},include:{products:{where:{status:"ACTIVE"},orderBy:{sku:"asc"}}}});
 if(!category)notFound();
 return <main className="container py-12"><Link href="/#categorias" className="text-sky-700">Voltar às categorias</Link><h1 className="text-4xl font-black mt-4">{category.name}</h1><p className="text-slate-500 mt-2">{category.products.length} produtos nesta categoria</p><CatalogNotice/>{category.products.length?<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-7">{category.products.map(p=><ProductCard product={p} key={p.id}/>)}</div>:<p className="card p-6 mt-7">Nenhum produto cadastrado nesta categoria.</p>}</main>
}
