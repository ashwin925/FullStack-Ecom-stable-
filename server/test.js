import dotenv from 'dotenv';
dotenv.config();

console.log('All env variables:', process.env);
console.log('Refresh token:', process.env.GMAIL_OAUTH_REFRESH_TOKEN);