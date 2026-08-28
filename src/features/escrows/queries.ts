import { useQuery } from "@tanstack/react-query";
import { getEscrows } from "./api";
import type { EscrowsListParams } from "./types";

export const useEscrows = (params: EscrowsListParams) => {
  return useQuery({
    queryKey: ["escrows", params],
    queryFn: () => getEscrows(params),
    select: (res) => res.data,
  });
};