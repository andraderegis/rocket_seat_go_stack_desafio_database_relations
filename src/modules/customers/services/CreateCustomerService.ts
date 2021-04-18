import { inject, injectable } from 'tsyringe';

import { CONTAINER_NAME_DEPENDENCIES } from '@shared/constants';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject(CONTAINER_NAME_DEPENDENCIES.REPOSITORY.CUSTOMER)
    private customersRepository: ICustomersRepository,
  ) {
    //
  }

  public async execute({ name, email }: IRequest): Promise<Customer> {
    const customer = await this.customersRepository.findByEmail(email);

    if (customer) {
      throw new AppError('Customer already exists');
    }

    return this.customersRepository.create({ name, email });
  }
}

export default CreateCustomerService;
