import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderAvailabilityByMonthService from '@modules/appointments/services/ListProviderAvailabilityByMonthService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { month, year } = request.body;
    const { provider_id } = request.params;

    const listProviderAvailabilityByMonth = container.resolve(
      ListProviderAvailabilityByMonthService,
    );

    const availability = await listProviderAvailabilityByMonth.execute({
      month,
      year,
      provider_id,
    });

    return response.json(availability);
  }
}
