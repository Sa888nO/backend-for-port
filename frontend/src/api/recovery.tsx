import { Api } from './index';

export type iRecovery = { email: string };

export const RecoveryApi = (params: iRecovery) => Api.post(`/auth/recovery`, params);
