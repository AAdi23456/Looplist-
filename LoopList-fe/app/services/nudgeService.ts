import { api } from './api';
import { Loop } from './loopService';

class NudgeService {
  async getMissedCheckins(): Promise<Loop[]> {
    return api.get('/nudge/missed-checkins');
  }
}

const nudgeService = new NudgeService();
export default nudgeService;

// Export individual functions for backward compatibility
export const { getMissedCheckins } = nudgeService; 