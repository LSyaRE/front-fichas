const { writeFile, existsSync, mkdirSync } = require('fs');
const { promisify } = require('util');
const dotenv = require('dotenv');

// Lee el archivo .env
dotenv.config();

const writeFilePromisified = promisify(writeFile);

const targetPath = './src/environments/environment.ts';
const prodTargetPath = './src/environments/environment.prod.ts';

const environmentFileContent = `export const environment = {
  production: false,
  apiUrl: '${process.env['API_URL'] || 'http://localhost:3000/api'}'
};
`;

const prodEnvironmentFileContent = `export const environment = {
  production: true,
  apiUrl: '${process.env['API_URL_PROD'] || '/api'}'
};
`;

(async () => {
    try {
        if (!existsSync('./src/environments')) {
            mkdirSync('./src/environments');
        }

        await writeFilePromisified(targetPath, environmentFileContent);
        await writeFilePromisified(prodTargetPath, prodEnvironmentFileContent);

        console.log(`✅ Archivos de entorno generados en ${targetPath} y ${prodTargetPath}`);
    } catch (err) {
        console.error('❌ Error generando archivos de entorno:', err);
    }
})();
