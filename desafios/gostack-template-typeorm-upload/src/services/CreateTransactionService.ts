import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // metodos para poder CRIAR / SAVE
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You dont have balance for this operation');
    }

    let transactionsCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!transactionsCategory) {
      transactionsCategory = categoryRepository.create({ title: category });

      await categoryRepository.save(transactionsCategory);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: transactionsCategory,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
