import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Product from '@modules/products/infra/typeorm/entities/Product';
import { CONTAINER_NAME_DEPENDENCIES } from '@shared/constants';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IProductToOrder {
  product_id: string;
  price: number;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
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

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const findCustomer = await this.customersRepository.findById(customer_id);

    if (!findCustomer) {
      throw new AppError('Invalid customer');
    }

    const productsInDatabase = await this.getProductsToOrder(products);

    const productsToCreateOrder = await this.getProductsToCreateOrder(
      products,
      productsInDatabase,
    );

    return this.ordersRepository.create({
      customer: findCustomer,
      products: productsToCreateOrder,
    });
  }

  private async getProductsToOrder(
    productsToOrder: IProduct[],
  ): Promise<Product[]> {
    const productsToOrderIds = productsToOrder.map(product => ({
      id: product.id,
    }));

    const productsInDatabase = await this.productsRepository.findAllById(
      productsToOrderIds,
    );

    if (!productsInDatabase || !productsInDatabase.length) {
      throw new AppError('Invalid products');
    }

    const productsInDatabaseIds = productsToOrderIds.map(product => product.id);

    const isArrayEquals = await this.arrayEquals(
      productsToOrderIds.map(product => product.id),
      productsInDatabaseIds,
    );

    if (!isArrayEquals) {
      throw new AppError('Some products is invalid');
    }

    return productsInDatabase;
  }

  private async arrayEquals(
    array1: unknown[],
    array2: unknown[],
  ): Promise<boolean> {
    return (
      array1.length === array2.length &&
      array1.every((value, index) => {
        return value === array2[index];
      })
    );
  }

  private async getProductsToCreateOrder(
    productsToOrder: IProduct[],
    productsInDatabase: Product[],
  ): Promise<IProductToOrder[]> {
    return productsToOrder.map(productToOrder => {
      const productInDatabase = productsInDatabase.find(
        product => product.id === productToOrder.id,
      );

      if (!productInDatabase) {
        throw new AppError('Invalid product');
      }

      if (productInDatabase.quantity < productToOrder.quantity) {
        throw new AppError(
          `Insuficient product quantities for product ${productInDatabase.id} `,
        );
      }

      return {
        product_id: productToOrder.id,
        quantity: productToOrder.quantity,
        price: productInDatabase.price,
      };
    });
  }
}

export default CreateOrderService;
