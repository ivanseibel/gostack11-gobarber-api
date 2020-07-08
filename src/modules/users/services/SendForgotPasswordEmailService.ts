import { injectable, inject } from 'tsyringe';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRegister {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute(data: IRegister): Promise<void> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    await this.userTokensRepository.generate(user.id);

    this.mailProvider.sendMail(data.email, 'Recovery email.');
  }
}

export default SendForgotPasswordEmailService;
