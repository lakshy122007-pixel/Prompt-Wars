import { httpsCallable } from 'firebase/functions';
import { functions } from './firebaseConfig.js';

const exportUserDataCallable = httpsCallable(functions, 'exportUserData');
const deleteUserAccountCallable = httpsCallable(functions, 'deleteUserAccount');

export const functionsService = {
  exportUserData: async (format: 'csv' | 'pdf') => {
    const result: any = await exportUserDataCallable({ format });
    return result.data.downloadUrl;
  },

  deleteUserAccount: async (confirmationPhrase: string) => {
    const result: any = await deleteUserAccountCallable({ confirmationPhrase });
    return result.data.success;
  }
};
