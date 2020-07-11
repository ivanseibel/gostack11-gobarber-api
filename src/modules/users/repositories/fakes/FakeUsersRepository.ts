import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import IListProvidersDTO from '@modules/users/dtos/IListProvidersDTO';
import User from '../../infra/typeorm/entities/User';

class UsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(item => item.email === email);
    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(item => item.id === id);
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, userData);

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const index = this.users.findIndex(item => item.id === user.id);

    Object.assign(this.users[index], user);

    return this.users[index];
  }

  public async listProviders({
    except_user_id,
  }: IListProvidersDTO): Promise<User[]> {
    return this.users.filter(user => user.id !== except_user_id);
  }
}

export default UsersRepository;
