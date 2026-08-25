import { api } from "@/lib/api/client";
import type { EmailSellerPayload, ListingDetailResponse, ListingsListParams, ListingsListResponse } from "./types";

export const getListings = async (
  params: ListingsListParams,
): Promise<ListingsListResponse> => {
  const { data } = await api.get("/admin/listings", { params });
  return data;
};

export const getListingBySlug = async (slug: string): Promise<ListingDetailResponse> => {
  const { data } = await api.get(`/admin/listings/${slug}`);
  return data;
};

export const deleteListing = async (listingId: string) => {
  const { data } = await api.delete(`/admin/listings/${listingId}`);
  return data;
};

export const emailSeller = async (listingId: string, payload: EmailSellerPayload) => {
  const { data } = await api.post(`/admin/listings/${listingId}/email-seller`, payload);
  return data;
};