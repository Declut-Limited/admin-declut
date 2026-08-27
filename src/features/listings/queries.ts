import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteListing, delistListing, emailSeller, exportListings, flagListing, getListingBySlug, getListings, relistListing, unflagListing, updateListing } from "./api";
import type { EmailSellerPayload, ListingsListParams, UpdateListingPayload } from "./types";

export const useListings = (params: ListingsListParams) => {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => getListings(params),
    select: (res) => res.data,
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

const useListingMutation = <TVars,>(
  mutationFn: (vars: TVars) => Promise<unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};

export const useUpdateListing = () =>
  useListingMutation(
    ({ listingId, payload }: { listingId: string; payload: UpdateListingPayload }) =>
      updateListing(listingId, payload),
  );

export const useFlagListing = () =>
  useListingMutation((listingId: string) => flagListing(listingId));

export const useUnflagListing = () =>
  useListingMutation((listingId: string) => unflagListing(listingId));

export const useDelistListing = () =>
  useListingMutation((listingId: string) => delistListing(listingId));

export const useRelistListing = () =>
  useListingMutation((listingId: string) => relistListing(listingId));

export const useExportListings = () => {
  return useMutation({
    mutationFn: (params: Omit<ListingsListParams, "page" | "limit">) =>
      exportListings(params),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `listings-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};