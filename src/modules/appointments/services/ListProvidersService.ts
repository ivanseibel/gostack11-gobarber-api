import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IListProvidersDTO from '@modules/users/dtos/IListProvidersDTO';
import User from '@modules/users/infra/typeorm/entities/User';

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    except_user_id,
  }: IListProvidersDTO): Promise<User[] | undefined> {
    const users = await this.usersRepository.listProviders({
      except_user_id,
    });

    return users;
  }
}
