import { v4 as uuid } from 'uuid';

import ICreateCustomerDTO from '@modules/customers/dtos/ICreateCustomerDTO';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import AppError from '@shared/errors/AppError';

class MockCustomerRepository implements ICustomersRepository {
  private customers: Customer[];

  public async create({ name, email }: ICreateCustomerDTO): Promise<Customer> {
    const findCustomer = this.customers.find(
      customer => customer.email === email,
    );

    if (findCustomer) {
      throw new AppError(`Already exists customer with email ${email}`);
    }

    const customer = Object.assign(new Customer(), {
      id: uuid(),
      name,
      email,
    });

    this.customers.push(customer);

    return customer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    return this.customers.find(customer => customer.email === email);
  }

  public async findById(id: string): Promise<Customer | undefined> {
    return this.customers.find(customer => customer.id === id);
  }
}

export default MockCustomerRepository;
