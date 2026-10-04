const fs=require('node:fs');
const {spawnSync}=require('node:child_process');
const forced=process.argv.includes('--production')||process.env.VERCEL==='1';
if(forced&&fs.existsSync('.env.production'))process.loadEnvFile('.env.production');
if(fs.existsSync('.env'))process.loadEnvFile('.env');
const production=forced||/^postgres(ql)?:/.test(process.env.DATABASE_URL||'');
if(process.env.VERCEL==='1'&&(!/^postgres(ql)?:/.test(process.env.DATABASE_URL||'')||!/^postgres(ql)?:/.test(process.env.DIRECT_URL||''))){console.error('Na Vercel, configure DATABASE_URL e DIRECT_URL reais do PostgreSQL antes do deploy.');process.exit(1)}
const schema=production?'prisma/postgresql/schema.prisma':'prisma/schema.prisma';
const result=spawnSync(process.execPath,[require.resolve('prisma/build/index.js'),'generate','--schema',schema],{stdio:'inherit',env:process.env});
process.exit(result.status??1);
