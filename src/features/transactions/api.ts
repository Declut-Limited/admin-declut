import { api } from "@/lib/api/client";
import type {
  TransactionsListParams,
  TransactionsListResponse,
  TransactionDetailResponse,
} from "./types";

export const getTransactions = async (
  params: TransactionsListParams,
): Promise<TransactionsListResponse> => {
  const { data } = await api.get("/admin/transactions", { params });
  return data;
};

export const getTransactionById = async (
  transactionId: string,
): Promise<TransactionDetailResponse> => {
  const { data } = await api.get(`/admin/transactions/${transactionId}`);
  return data;
};

export const getTransactionByReference = async (
  reference: string,
): Promise<TransactionDetailResponse> => {
  const { data } = await api.get(`/admin/transactions/reference/${reference}`);
  return data;
};