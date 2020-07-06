import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import AppError from '../errors/AppError';

interface Register {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Register): Promise<User> {
    const userRepository = getRepository(User);

    const hashedPassword = await hash(password, 8);

    const emailAlreadyExists = await userRepository.findOne({
      where: { email },
    });

    if (emailAlreadyExists) {
      throw new AppError('Email is already in use');
    }

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;
