import { MongoRepository, getMongoRepository } from 'typeorm';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Notification from '../schema/Notifications';

class AppointmentsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const appointment = this.ormRepository.create({ content, recipient_id });

    return this.ormRepository.save(appointment);
  }
}

export default AppointmentsRepository;
