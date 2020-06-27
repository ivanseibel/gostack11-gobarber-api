import { getRepository } from 'typeorm';
import User from '../models/User';

interface Register {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Register): Promise<User> {
    const userRepository = getRepository(User);

    const emailAlreadyExists = await userRepository.findOne({
      where: { email },
    });

    if (emailAlreadyExists) {
      throw Error('Email is already in use');
    }

    const user = userRepository.create({ name, email, password });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;
