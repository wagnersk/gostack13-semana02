import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface CreateTransacion {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, type, value }: CreateTransacion): Transaction {
    const balance = this.transactionsRepository.getBalance();

    if (!(type === 'income' || type === 'outcome')) {
      throw new Error('Type must be income or outcome');
    }

    if (type === 'outcome' && balance.total < value) {
      throw new Error('You dont have balance for this operation');
    }

    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });

    return transaction;
  }
}

export default CreateTransactionService;
