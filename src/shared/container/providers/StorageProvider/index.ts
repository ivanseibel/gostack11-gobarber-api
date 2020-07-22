import { container } from 'tsyringe';

import uploadsConfig from '@config/uploads';

import IStorageProvider from './models/IStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';
import DiskStorageProvider from './implementations/DiskStorageProvider';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadsConfig.driver],
);
