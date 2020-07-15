import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO';
import Notification from '../infra/typeorm/schema/Notifications';

export default interface INotificationsRepository {
  create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification>;
}
