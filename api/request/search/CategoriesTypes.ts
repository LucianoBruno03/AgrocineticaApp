import { api } from "@/api/axios/api";
import { CategoryTypesListResponse } from "@/types/search/CategoriesTypes";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchListCategoriesType = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<CategoryTypesListResponse> => {
  const categoryName = queryKey[1] as string;
  const searchWord = queryKey[2] as string;

  const raw = {
    advancedSearch: {
      fields: ["name"],
      keyword: searchWord || "",
    },
    categoryName: categoryName || "",
    pageNumber: 0,
    pageSize: 100,
  };

  const response = await api.post("v1/categoriestypes/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  if (response.status == 200) {
    // quitar chasis de la respuesta
    response.data.data = response.data.data.filter(
      (item: any) => item.name !== "CHASIS"
    );
  }

  return response.data;
};
