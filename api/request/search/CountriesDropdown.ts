import { api } from "@/api/axios/api";
import { CountriesListResponse } from "@/types/search/CountriesDropdown";
import { QueryKey } from "@tanstack/react-query";

export const fetchListCountries = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<CountriesListResponse> => {
  const isAuthFetch = queryKey[1];

  const raw = {
    pageNumber: 0,
    pageSize: 10000,
    advancedSearch: {
      fields: ["name"],
      keyword: "",
    },
  };

  let response;
  if (isAuthFetch) {
    response = await api.post("v1/countries/search", raw);
  } else {
    response = await api.post("v1/countries/searchwithouttoken", raw);
  }

  return response.data;
};
