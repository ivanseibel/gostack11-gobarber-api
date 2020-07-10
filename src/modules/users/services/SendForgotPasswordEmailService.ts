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

    const { token } = await this.userTokensRepository.generate(user.id);

    await this.mailProvider.sendMail({
      to: {
        email: user.email,
        name: user.name,
      },
      subject: '[GoBarber] Password recover email',
      templateData: {
        template:
          'Hello, {{name}}! Use this token ({{token}}) to recover your password.',
        variables: {
          name: user.name,
          token,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
