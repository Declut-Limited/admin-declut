import { api } from "@/lib/api/client";
import type { EmailSellerPayload, ListingDetailResponse, ListingsListParams, ListingsListResponse, UpdateListingPayload } from "./types";

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

export const updateListing = async (
  listingId: string,
  payload: UpdateListingPayload,
) => {
  const { data } = await api.patch(`/admin/listings/${listingId}`, payload);
  return data;
};

export const flagListing = async (listingId: string) => {
  const { data } = await api.patch(`/admin/listings/${listingId}/flag`);
  return data;
};

export const unflagListing = async (listingId: string) => {
  const { data } = await api.patch(`/admin/listings/${listingId}/unflag`);
  return data;
};

export const delistListing = async (listingId: string) => {
  const { data } = await api.patch(`/admin/listings/${listingId}/delist`);
  return data;
};

export const relistListing = async (listingId: string) => {
  const { data } = await api.patch(`/admin/listings/${listingId}/relist`);
  return data;
};

export const exportListings = async (
  params: Omit<ListingsListParams, "page" | "limit">,
): Promise<Blob> => {
  const { data } = await api.get("/admin/listings/export", {
    params,
    responseType: "blob",
  });
  return data;
};