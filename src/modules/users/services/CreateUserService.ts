import { hash } from 'bcryptjs';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

interface Register {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  constructor(private userRepository: IUsersRepository) {}

  public async execute({ name, email, password }: Register): Promise<User> {
    const hashedPassword = await hash(password, 8);

    const emailAlreadyExists = await this.userRepository.findByEmail(email);

    if (emailAlreadyExists) {
      throw new AppError('Email is already in use');
    }

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
