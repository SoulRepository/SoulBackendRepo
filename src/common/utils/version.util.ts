import path from 'node:path';
import fs from 'node:fs';

const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'),
);

export const getPackageVersion = () => packageJson.version;
