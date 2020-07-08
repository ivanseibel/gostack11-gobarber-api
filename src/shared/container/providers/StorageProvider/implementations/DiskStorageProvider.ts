import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/uploads';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  constructor(private storageProvider: IStorageProvider) {}

  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpDir, file),
      path.resolve(uploadConfig.uploadsDir, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsDir, file);

    try {
      await fs.promises.stat(filePath);
      await fs.promises.unlink(filePath);
    } catch {
      // nothing to do
    }
  }
}
