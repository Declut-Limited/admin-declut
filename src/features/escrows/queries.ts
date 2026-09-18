import { useQuery } from "@tanstack/react-query";
import { getEscrows, getEscrowById } from "./api";
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
