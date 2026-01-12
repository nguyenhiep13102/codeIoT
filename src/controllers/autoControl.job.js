import { autoControlFanByTemperature } from '../services/fanAutoControl.service.js';

export const startAutoControlJob = () => {
  console.log('⏱ Auto fan control started (every 5s)');

  setInterval(async () => {
    try {
      await autoControlFanByTemperature();
    } catch (err) {
      console.error('❌ Auto control error:', err.message);
    }
  }, 5000);
};
