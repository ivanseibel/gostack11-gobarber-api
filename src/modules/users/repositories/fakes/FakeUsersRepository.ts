import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import User from '../../infra/typeorm/entities/User';

class UsersRepository implements IUsersRepository {
  private Users: User[] = [];

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.Users.find(item => item.email === email);
    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.Users.find(item => item.id === id);
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, userData);

    this.Users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const index = this.Users.findIndex(item => item.id === user.id);

    Object.assign(this.Users[index], user);

    return this.Users[index];
  }
}

export default UsersRepository;
