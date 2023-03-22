import path from 'node:path';
import os from 'node:os';

export const CLI_CONFIG_DIR = path.resolve(os.homedir(), '.soul-cli');
export const CLI_AUTH_FILE = 'config.json';
