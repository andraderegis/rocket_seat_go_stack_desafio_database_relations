import { container } from 'tsyringe';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';
import { CONTAINER_NAME_DEPENDENCIES } from '@shared/constants';

container.registerSingleton<ICustomersRepository>(
  CONTAINER_NAME_DEPENDENCIES.REPOSITORY.CUSTOMER,
  CustomersRepository,
);

container.registerSingleton<IProductsRepository>(
  CONTAINER_NAME_DEPENDENCIES.REPOSITORY.PRODUCT,
  ProductsRepository,
);

container.registerSingleton<IOrdersRepository>(
  CONTAINER_NAME_DEPENDENCIES.REPOSITORY.ORDER,
  OrdersRepository,
);
