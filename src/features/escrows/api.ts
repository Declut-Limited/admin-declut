import { api } from "@/lib/api/client";
import type {
  EscrowsListParams,
  EscrowsListResponse,
  EscrowDetailResponse,
} from "./types";

export const getEscrows = async (
  params: EscrowsListParams,
): Promise<EscrowsListResponse> => {
  const { data } = await api.get("/admin/escrows", { params });
  return data;
};

export const getEscrowById = async (
  escrowId: string,
): Promise<EscrowDetailResponse> => {
  const { data } = await api.get(`/admin/escrows/${escrowId}`);
  return data;
};
