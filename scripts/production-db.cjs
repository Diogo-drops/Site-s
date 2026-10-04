const fs=require('node:fs');
const {spawnSync}=require('node:child_process');
if(fs.existsSync('.env.production'))process.loadEnvFile('.env.production');
if(!/^postgres(ql)?:/.test(process.env.DATABASE_URL||'')||!/^postgres(ql)?:/.test(process.env.DIRECT_URL||'')){
 console.error('Configure DATABASE_URL e DIRECT_URL reais no ambiente ou em .env.production. Nenhuma migração foi executada.');process.exit(1);
}
const schema='prisma/postgresql/schema.prisma';
function run(args){const r=spawnSync(process.execPath,args,{stdio:'inherit',env:process.env});if(r.status!==0)process.exit(r.status??1)}
if(process.argv[2]==='migrate')run([require.resolve('prisma/build/index.js'),'migrate','deploy','--schema',schema]);
else if(process.argv[2]==='seed'){run([require.resolve('prisma/build/index.js'),'generate','--schema',schema]);run(['--import','tsx','prisma/seed.ts'])}
else{console.error('Use migrate ou seed');process.exit(1)}
