import sgMail from '@sendgrid/mail';
import { injectable, inject } from 'tsyringe';

import mailConfig from '@config/mail';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

interface IMessage {
  to: string;
  body: string;
}

@injectable()
class SendGridMailProvider implements IMailProvider {
  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {}

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { email, name } = mailConfig.defaults.from;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

    await sgMail.send({
      to: {
        email: to.email,
        name: to.name,
      },
      from: {
        email: from?.email || email,
        name: from?.name || name,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}

export default SendGridMailProvider;
