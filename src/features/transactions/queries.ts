import { useQuery } from "@tanstack/react-query";
import {
  getTransactions,
  getTransactionById,
  getTransactionByReference,
} from "./api";
import type { TransactionsListParams } from "./types";

export const useTransactions = (params: TransactionsListParams) => {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => getTransactions(params),
    select: (res) => res.data,
  });
};

export const useTransaction = (transactionId: string | undefined) => {
  return useQuery({
    queryKey: ["transactions", "detail", transactionId],
    queryFn: () => getTransactionById(transactionId as string),
    enabled: !!transactionId,
    select: (res) => res.data,
  });
};

export const useTransactionByReference = (reference: string | undefined) => {
  return useQuery({
    queryKey: ["transactions", "reference", reference],
    queryFn: () => getTransactionByReference(reference as string),
    enabled: !!reference,
    select: (res) => res.data,
  });
};