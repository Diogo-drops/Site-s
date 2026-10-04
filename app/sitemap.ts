export const dynamic="force-dynamic";
import type {MetadataRoute} from "next";
import {db} from "@/lib/db";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const base=process.env.NEXT_PUBLIC_BASE_URL||"http://localhost:3000";
 const [products,categories]=await Promise.all([db.product.findMany({where:{status:"ACTIVE"},select:{slug:true,createdAt:true}}),db.category.findMany({where:{products:{some:{status:"ACTIVE"}}},select:{slug:true}})]);
 return [{url:base,lastModified:new Date()},...categories.map(c=>({url:`${base}/categorias/${c.slug}`})),...products.map(p=>({url:`${base}/produtos/${p.slug}`,lastModified:p.createdAt}))];
}
