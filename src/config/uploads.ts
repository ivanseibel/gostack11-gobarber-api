import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

const avatarDir = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  avatarDir,
  storage: multer.diskStorage({
    destination: avatarDir,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash} - ${file.originalname}`;
      return callback(null, fileName);
    },
  }),
};
