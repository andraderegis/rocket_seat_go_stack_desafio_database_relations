import { getManager, getRepository, In, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Product from '@modules/products/infra/typeorm/entities/Product';
import AppError from '@shared/errors/AppError';
import Order from '../entities/Order';

interface ICreateOrderTransaction {
  order: Order;
}

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create({
      customer,
      order_products: products,
    });

    const savedOrder = await this.createTransaction({
      order,
    });

    if (!savedOrder) {
      throw new AppError('Cannot process order');
    }

    return savedOrder;
  }

  private async createTransaction({
    order,
  }: ICreateOrderTransaction): Promise<Order | undefined> {
    let savedOrder;

    await getManager().transaction(
      'READ COMMITTED',
      async transactionEntityManager => {
        savedOrder = await transactionEntityManager.save(order);

        const { order_products } = savedOrder;

        const productsInDatabase = await transactionEntityManager.find(
          Product,
          {
            where: {
              id: In(order_products.map(product => product.product_id)),
            },
            select: ['id', 'quantity'],
          },
        );

        const productQuantityToUpdateAfterOrderedPromises = order_products.map(
          orderedProduct => {
            const productInDatabase = productsInDatabase.find(
              product => product.id === orderedProduct.product_id,
            );

            if (!productInDatabase) {
              return undefined;
            }

            return transactionEntityManager.update(
              Product,
              productInDatabase.id,
              {
                quantity: productInDatabase.quantity - orderedProduct.quantity,
              },
            );
          },
        );

        await Promise.all(productQuantityToUpdateAfterOrderedPromises);
      },
    );

    return savedOrder;
  }

  public async findById(id: string): Promise<Order | undefined> {
    return this.ormRepository.findOne(id, {
      relations: ['customer', 'order_products'],
    });
  }
}

export default OrdersRepository;
