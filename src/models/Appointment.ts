import { uuid } from 'uuidv4';

class Appointment {
  id: string;

  provider: string;

  date: Date;

  constructor(provider: string, date: Date) {
    this.date = date;
    this.provider = provider;
    this.id = uuid();
  }
}

export default Appointment;
