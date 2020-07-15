import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO';
import Notification from '../infra/typeorm/schema/Notification';

export default interface INotificationsRepository {
  create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification>;
}
