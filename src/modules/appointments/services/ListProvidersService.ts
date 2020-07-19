import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IListProvidersDTO from '@modules/users/dtos/IListProvidersDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ except_user_id }: IListProvidersDTO): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${except_user_id}`,
    );

    if (!users) {
      users = await this.usersRepository.listProviders({
        except_user_id,
      });

      await this.cacheProvider.save(`providers-list:${except_user_id}`, users);
    }

    return users;
  }
}
