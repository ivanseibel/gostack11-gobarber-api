import { container } from 'tsyringe';

import IStorageProvider from './models/IStorageProvider';
import DiskStorageProvider from './fakes/FakeStorageProvider';

const providers = {
  disk: DiskStorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers.disk,
);
