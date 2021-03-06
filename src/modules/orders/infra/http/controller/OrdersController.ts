import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;

    const findOrderService: FindOrderService = container.resolve(
      FindOrderService,
    );

    const order = await findOrderService.execute({
      id,
    });

    return response.status(200).json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products } = request.body;

    const createOrderService: CreateOrderService = container.resolve(
      CreateOrderService,
    );

    const order = await createOrderService.execute({ customer_id, products });

    return response.status(201).json(order);
  }
}
