const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const root = __dirname;
const providerRoot = path.join(root, 'providers');
const outRoot = path.join(root, 'dist');
const skipMinify = process.env.SKIP_MINIFY === 'true';

async function main() {
  fs.rmSync(outRoot, { recursive: true, force: true });
  fs.mkdirSync(outRoot, { recursive: true });
  const names = fs.readdirSync(providerRoot, { withFileTypes: true }).filter(x => x.isDirectory()).map(x => x.name);
  for (const name of names) {
    const sourceDir = path.join(providerRoot, name);
    const destDir = path.join(outRoot, name);
    fs.mkdirSync(destDir, { recursive: true });
    for (const moduleName of ['catalog', 'posts', 'meta', 'stream', 'episodes', 'settings']) {
      const entry = path.join(sourceDir, `${moduleName}.ts`);
      if (!fs.existsSync(entry)) continue;
      const built = await esbuild.build({ entryPoints: [entry], bundle: true, platform: 'node', format: 'cjs', target: 'es2015', write: false, external: [], minify: false, keepNames: true, treeShaking: true, outfile: `${moduleName}.js` });
      let code = built.outputFiles[0].text;
      code = code.replace(/require\(['"]node:.*?['"]\)/g, '{}');
      const exp = code.match(/__export\((\w+),\s*\{([^}]+)\}\);/);
      if (exp) {
        const entries = exp[2].split(',').map(s => s.trim().match(/(\w+):\s*\(\)\s*=>\s*(\w+)/)).filter(Boolean).map(m => m[1]);
        code = code.replace(/module\.exports\s*=\s*__toCommonJS\((\w+)\);/g, '');
        const assigns = entries.map(k => `exports.${k} = ${k};`).join('\n');
        code = code.replace(/\/\/ Annotate the CommonJS export names for ESM import in node:/, `${assigns}\n// Annotate the CommonJS export names for ESM import in node:`);
      }
      code = code.replace(/0\s*&&\s*\(module\.exports\s*=\s*\{[^}]*\}\);?/g, '');
      if (!skipMinify) {
        const result = await minify(code, { compress: { passes: 2 }, mangle: false, format: { comments: false } });
        if (result.code) code = result.code;
      }
      fs.writeFileSync(path.join(destDir, `${moduleName}.js`), code);
      console.log(`Built ${name}/${moduleName}.js`);
    }
  }
  console.log(`Built ${names.length} provider(s) into dist/`);
}
main().catch(err => { console.error(err); process.exit(1); });
