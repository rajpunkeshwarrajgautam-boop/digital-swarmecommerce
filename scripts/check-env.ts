
import { env } from '../src/lib/env';

console.log('--- CASHFREE ENV CHECK ---');
console.log('APP_ID:', env.CASHFREE_APP_ID ? 'PRESENT' : 'MISSING');
console.log('SECRET_KEY:', env.CASHFREE_SECRET_KEY ? (env.CASHFREE_SECRET_KEY.startsWith('cfsk_ma_prod_') ? 'PROD_KEY' : 'TEST_KEY') : 'MISSING');
console.log('SITE_URL:', env.NEXT_PUBLIC_SITE_URL);
console.log('--- END CHECK ---');
