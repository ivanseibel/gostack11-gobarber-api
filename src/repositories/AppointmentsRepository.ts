import { isEqual } from 'date-fns';
import Appointment from '../models/Appointment';

class AppointmentRepository {
  private appointments: Appointment[];

  constructor() {
    this.appointments = [];
  }

  public create(provider: string, date: Date): Appointment {
    const newAppointment = new Appointment(provider, date);
    this.appointments.push(newAppointment);
    return newAppointment;
  }

  public findByDate(date: Date): Appointment | null {
    const appointment = this.appointments.find(item =>
      isEqual(item.date, date),
    );

    return appointment || null;
  }

  public all(): Appointment[] {
    return this.appointments;
  }
}

export default new AppointmentRepository();
