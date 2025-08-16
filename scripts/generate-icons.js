const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Verifica se o diretório existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Gerando ícones PWA...');

sizes.forEach(size => {
  const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
  
  try {
    // Comando para converter SVG para PNG usando svgexport
    const command = `svgexport "${inputSvg}" "${outputFile}" ${size}:${size}`;
    execSync(command, { stdio: 'inherit' });
    console.log(`✓ Gerado: icon-${size}x${size}.png`);
  } catch (error) {
    console.error(`✗ Erro ao gerar icon-${size}x${size}.png:`, error.message);
  }
});

console.log('\nÍcones gerados com sucesso!');
console.log('Você pode usar ferramentas online para converter o SVG para PNG se necessário:');
console.log('- https://convertio.co/svg-png/');
console.log('- https://cloudconvert.com/svg-to-png');
console.log('- https://www.svgviewer.dev/');
