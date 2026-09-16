import { api } from "@/lib/api/client";
import type {
  TransactionsListParams,
  TransactionsListResponse,
  TransactionDetailResponse,
  TransactionNoteRecord,
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

export const addTransactionNote = async (payload: {
  transactionId: string;
  description: string;
}): Promise<{ success: boolean; data: TransactionNoteRecord }> => {
  const { data } = await api.post("/admin/transaction-notes", payload);
  return data;
};

export const updateTransactionNote = async (
  noteId: string,
  description: string,
): Promise<{ success: boolean; data: TransactionNoteRecord }> => {
  const { data } = await api.patch(`/admin/transaction-notes/${noteId}`, {
    description,
  });
  return data;
};

export const deleteTransactionNote = async (
  noteId: string,
): Promise<{ success: boolean }> => {
  const { data } = await api.delete(`/admin/transaction-notes/${noteId}`);
  return data;
};

export const sendInspectionReminder = async (
  transactionId: string,
  payload: { reminderType: string; channel: string; message?: string },
): Promise<{ success: boolean; data: unknown }> => {
  const { data } = await api.post(
    `/admin/transactions/${transactionId}/send-inspection-reminder`,
    payload,
  );
  return data;
};

export const exportTransaction = async (transactionId: string): Promise<Blob> => {
  const { data } = await api.get(`/admin/transactions/${transactionId}/export`, {
    responseType: "blob",
  });
  return data;
};

export const exportTransactions = async (
  params: Omit<TransactionsListParams, "page" | "limit">,
): Promise<Blob> => {
  const { data } = await api.get("/admin/transactions/export", {
    params,
    responseType: "blob",
  });
  return data;
};