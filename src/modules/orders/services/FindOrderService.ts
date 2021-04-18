import { inject, injectable } from 'tsyringe';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import { CONTAINER_NAME_DEPENDENCIES } from '@shared/constants';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IRequest {
  id: string;
}

@injectable()
class FindOrderService {
  constructor(
    @inject(CONTAINER_NAME_DEPENDENCIES.REPOSITORY.ORDER)
    private ordersRepository: IOrdersRepository,

    @inject(CONTAINER_NAME_DEPENDENCIES.REPOSITORY.PRODUCT)
    private productsRepository: IProductsRepository,

    @inject(CONTAINER_NAME_DEPENDENCIES.REPOSITORY.CUSTOMER)
    private customersRepository: ICustomersRepository,
  ) {
    //
  }

  public async execute({ id }: IRequest): Promise<Order | undefined> {
    return this.ordersRepository.findById(id);
  }
}

export default FindOrderService;
