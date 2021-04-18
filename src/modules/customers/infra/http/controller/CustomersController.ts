import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';

import { container } from 'tsyringe';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createCustomerService: CreateCustomerService = container.resolve(
      CreateCustomerService,
    );

    const { name, email } = request.body;

    const customer = await createCustomerService.execute({
      name,
      email,
    });

    return response.status(201).json(customer);
  }
}
