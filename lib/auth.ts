import {cookies} from "next/headers";
import {jwtVerify} from "jose/jwt/verify";
export async function isAdmin(){try{const token=(await cookies()).get("gf_admin")?.value;if(!token||!process.env.AUTH_SECRET)return false;const {payload}=await jwtVerify(token,new TextEncoder().encode(process.env.AUTH_SECRET),{algorithms:["HS256"]});return payload.role==="ADMIN"}catch{return false}}
