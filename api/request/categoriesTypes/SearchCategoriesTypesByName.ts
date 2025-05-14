import { api } from "@/api/axios/api";
import { CategoryTypes } from "@/types/search/CategoriesTypes";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchCategoriesTypesByName = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<CategoryTypes> => {
  const categoryName = queryKey[1] as string;
  const categoryTypeName = queryKey[2] as string;

  const response = await api.get(
    `v1/categoriestypes/byname/${categoryName}/${categoryTypeName}`,
    {
      headers: {
        tenant: TENANT,
      },
    }
  );

  return response.data;
};
