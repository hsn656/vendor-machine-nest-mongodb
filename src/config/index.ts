import { config } from 'dotenv';
import { resolve } from 'path';
import { getEnvPath } from 'src/helpers/env.helper';

const envFilePath: string = getEnvPath(resolve(__dirname, '..'));

config({ path: envFilePath });

export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
});
