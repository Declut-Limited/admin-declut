import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTransactions,
  getTransactionById,
  addTransactionNote,
  updateTransactionNote,
  deleteTransactionNote,
  sendInspectionReminder,
  exportTransaction,
  exportTransactions,
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

export const useTransactionLookup = () => {
  return useMutation({
    mutationFn: (transactionId: string) => getTransactionById(transactionId),
  });
};

export const useAddTransactionNote = (transactionId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (description: string) =>
      addTransactionNote({ transactionId: transactionId as string, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useUpdateTransactionNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      noteId,
      description,
    }: {
      noteId: string;
      description: string;
    }) => updateTransactionNote(noteId, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useDeleteTransactionNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) => deleteTransactionNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useSendInspectionReminder = (transactionId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      reminderType: string;
      channel: string;
      message?: string;
    }) => sendInspectionReminder(transactionId as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useExportTransaction = () => {
  return useMutation({
    mutationFn: (transactionId: string) => exportTransaction(transactionId),
  });
};

export const useExportTransactions = () => {
  return useMutation({
    mutationFn: (params: Omit<TransactionsListParams, "page" | "limit">) =>
      exportTransactions(params),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};