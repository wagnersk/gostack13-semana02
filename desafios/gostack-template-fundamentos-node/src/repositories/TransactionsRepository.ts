import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const totalIncome = this.transactions.reduce(
      (accumulator, currentValue) => {
        if (currentValue.type === 'income') {
          accumulator.push(currentValue.value);
        }
        return accumulator;
      },
      [0],
    );

    const income = totalIncome.reduce((a, b) => a + b);

    const totalOutcome = this.transactions.reduce(
      (accumulator, currentValue) => {
        if (currentValue.type === 'outcome') {
          accumulator.push(currentValue.value);
        }
        return accumulator;
      },
      [0],
    );

    const outcome = totalOutcome.reduce((a, b) => a + b);

    const total = income - outcome;

    return { income, outcome, total };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;

    // TODO
  }
}

export default TransactionsRepository;
