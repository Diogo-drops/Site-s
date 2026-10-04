import {NextResponse} from "next/server";import {paymentConfigured} from "@/lib/payments";
export const dynamic="force-dynamic";
export function GET(){return NextResponse.json({onlinePayment:paymentConfigured(),provider:paymentConfigured()?"Mercado Pago":null})}
