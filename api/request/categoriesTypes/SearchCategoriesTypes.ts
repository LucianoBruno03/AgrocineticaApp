import { api } from "@/api/axios/api";
import { SearchCategoriesTypesResponse } from "@/types/categoriesTypes/SearchCategoriesTypes";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchSearchCategoriesTypes = async ({
  queryKey,
}: {
  queryKey: QueryKey;
} & { filterResponse?: string[] }): Promise<SearchCategoriesTypesResponse> => {
  const [, searchWord, categoryName, filterResponse] = queryKey;

  const raw = {
    categoryName: categoryName, //"ESTADOS DEL NEGOCIO",
    pageNumber: 0,
    pageSize: 50,
    advancedSearch: {
      fields: ["name"],
      keyword: searchWord || "",
    },
  };

  const response = await api.post("v1/categoriestypes/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  // ver en response.data.data filtrando y dejando solo los que tienen name coincidieendo con filterKeys si es un array vacio dejar todos
  if (Array.isArray(filterResponse)) {
    if (filterResponse.length > 0) {
      response.data.data = response.data.data.filter((item: { name: string }) =>
        filterResponse.includes(item.name)
      );
    }
  }

  return response.data;
};
