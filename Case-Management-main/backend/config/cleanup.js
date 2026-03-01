import cron from 'node-cron';
import fs from 'fs';
import path from 'path';

export const initCleanupCron = () => {
  cron.schedule('0 0 * * *', () => {
    const directory = './uploads';
    if (!fs.existsSync(directory)) return;

    fs.readdir(directory, (err, files) => {
      if (err) return;
      files.forEach(file => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
        if (Date.now() > new Date(stats.ctime).getTime() + (24 * 60 * 60 * 1000)) {
          fs.unlinkSync(filePath);
        }
      });
    });
  });
};