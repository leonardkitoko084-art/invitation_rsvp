import { context } from './context.js';
export async function currentSiteBaseUrl() { return context().origin || process.env.PUBLIC_URL?.trim().replace(/\/$/, '') || 'http://localhost:5173'; }
