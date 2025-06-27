export interface Transaction {
  reference: string;
  amount: number;
  date: string;
  status: string;
}

export interface ReconciliationResult {
  matched: Transaction[];
  internalOnly: Transaction[];
  providerOnly: Transaction[];
  amountMismatches: {
    transaction_reference: string;
    internalAmount: number;
    providerAmount: number;
  }[];
}
