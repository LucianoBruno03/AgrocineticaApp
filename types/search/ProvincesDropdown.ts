import { api } from "@/api/axios/api";
import { QueryKey } from "@tanstack/react-query";

export const fetchListProvinces = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}) => {
  const isAuthFetch = queryKey[1];
  const countryId = queryKey[2];

  const raw = {
    pageNumber: 0,
    pageSize: 10000,
    advancedSearch: {
      fields: ["name"],
      keyword: "",
    },
    countryId: countryId,
  };

  let response;
  if (isAuthFetch) {
    response = await api.post("provinces/search", raw);
  } else {
    response = await api.post("provinces/searchwithouttoken", raw);
  }

  return response.data;
};
