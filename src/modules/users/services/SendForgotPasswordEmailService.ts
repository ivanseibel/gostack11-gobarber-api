import { injectable, inject } from 'tsyringe';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';

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
  ) {}

  public async execute(data: IRegister): Promise<void> {
    this.mailProvider.sendMail(data.email, 'Recovery email.');
  }
}

export default SendForgotPasswordEmailService;
