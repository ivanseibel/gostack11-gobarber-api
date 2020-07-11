import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const emailAlreadyUsed = await this.usersRepository.findByEmail(email);

    if (emailAlreadyUsed && emailAlreadyUsed.id !== user_id) {
      throw new AppError('This email is already in use by another user.');
    }

    if (password && !old_password) {
      throw new AppError(
        'You must provide old password to change your password.',
      );
    }

    if (password && old_password) {
      const passwordsMatch = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!passwordsMatch) {
        throw new AppError('Old password does not match.');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    user.email = email;
    user.name = name;

    await this.usersRepository.save(user);

    return user;
  }
}
