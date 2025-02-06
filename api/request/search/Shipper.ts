import { api } from "@/api/axios/api";
import { ShipperListResponse } from "@/types/search/Shipper";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchListShipper = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<ShipperListResponse> => {
  const searchedWord = queryKey[1] as string;

  const raw = {
    resource: "Negocios",
    pageNumber: 0,
    pageSize: 10,
    advancedSearch: {
      fields: ["businessName"],
      keyword: searchedWord || "",
    },
  };

  const response = await api.post("v1/entities/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
