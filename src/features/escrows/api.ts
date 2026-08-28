import { api } from "@/lib/api/client";
import type { EscrowsListParams, EscrowsListResponse } from "./types";

export const getEscrows = async (
  params: EscrowsListParams,
): Promise<EscrowsListResponse> => {
  const { data } = await api.get("/admin/escrows", { params });
  return data;
};