import { useMutation, useQuery } from "@tanstack/react-query";
import { getEscrows, getEscrowById, exportEscrows } from "./api";
import type { EscrowsListParams } from "./types";

export const useEscrows = (params: EscrowsListParams) => {
  return useQuery({
    queryKey: ["escrows", params],
    queryFn: () => getEscrows(params),
    select: (res) => res.data,
  });
};

export const useEscrow = (escrowId: string | undefined) => {
  return useQuery({
    queryKey: ["escrows", "detail", escrowId],
    queryFn: () => getEscrowById(escrowId as string),
    enabled: !!escrowId,
    select: (res) => res.data,
  });
};

export const useExportEscrows = () => {
  return useMutation({
    mutationFn: (params: Omit<EscrowsListParams, "page" | "limit">) =>
      exportEscrows(params),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `escrows-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};
