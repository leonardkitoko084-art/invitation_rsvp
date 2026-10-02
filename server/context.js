import { AsyncLocalStorage } from 'node:async_hooks';
export const requestContext = new AsyncLocalStorage();
export function context() { return requestContext.getStore() ?? {}; }
