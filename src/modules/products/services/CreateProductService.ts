import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { CONTAINER_NAME_DEPENDENCIES } from '@shared/constants';
import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject(CONTAINER_NAME_DEPENDENCIES.REPOSITORY.PRODUCT)
    private productsRepository: IProductsRepository,
  ) {
    //
  }

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const product = await this.productsRepository.findByName(name);

    if (product) {
      throw new AppError('Product already exists.');
    }

    return this.productsRepository.create(
      Object.assign(new Product(), {
        name,
        price,
        quantity,
      }),
    );
  }
}

export default CreateProductService;
