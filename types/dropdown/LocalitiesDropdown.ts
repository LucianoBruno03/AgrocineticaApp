import { api } from "@/api/axios/api";
import { QueryKey } from "@tanstack/react-query";

export const fetchListLocalities = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}) => {
  const isAuthFetch = queryKey[1];
  const provinceId = queryKey[2];

  const raw = {
    pageNumber: 0,
    pageSize: 10000,
    advancedSearch: {
      fields: ["name"],
      keyword: "",
    },
    privinceId: provinceId,
  };

  let response;
  if (isAuthFetch) {
    response = await api.post("v1/locations/search", raw);
  } else {
    response = await api.post("v1/locations/searchwithouttoken", raw);
  }

  return response.data;
};
