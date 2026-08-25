import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteListing, emailSeller, getListingBySlug, getListings } from "./api";
import type { EmailSellerPayload, ListingsListParams } from "./types";

export const useListings = (params: ListingsListParams) => {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => getListings(params),
    select: (res) => res.data,
    placeholderData: (previous) => previous,
  });
};

export const useListing = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["listings", "detail", slug],
    queryFn: () => getListingBySlug(slug as string),
    enabled: !!slug,
    select: (res) => res.data,
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId: string) => deleteListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};

export const useEmailSeller = () => {
  return useMutation({
    mutationFn: ({ listingId, payload }: { listingId: string; payload: EmailSellerPayload }) =>
      emailSeller(listingId, payload),
  });
};