import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderAvailabilityByDayService from '@modules/appointments/services/ListProviderAvailabilityByDayService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { day, month, year } = request.query;
    const { provider_id } = request.params;

    const listProviderAvailabilityByDay = container.resolve(
      ListProviderAvailabilityByDayService,
    );

    const availability = await listProviderAvailabilityByDay.execute({
      day: Number(day),
      month: Number(month),
      year: Number(year),
      provider_id,
    });

    return response.json(availability);
  }
}
