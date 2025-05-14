import { api } from "@/api/axios/api";
import { UnitsListResponse } from "@/types/search/Units";
import { QueryKey } from "@tanstack/react-query";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

export const fetchListUnits = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<UnitsListResponse> => {
  const searchedWord = queryKey[1] as string;
  const entityId = queryKey[2] as string;

  var typeUnitId = null;
  var differentTypeUnitId = null;

  const typeFilter = queryKey[3];

  if (typeFilter == "CHASIS") {
    typeUnitId = "ffcf2595-f310-437d-db10-08dcdd60457e";
  } else if (typeFilter == "REMOLQUE") {
    differentTypeUnitId = "ffcf2595-f310-437d-db10-08dcdd60457e";
  }

  const raw = {
    advancedSearch: {
      fields: ["domain"],
      keyword: searchedWord || "",
    },

    pageNumber: 1,
    pageSize: 100,
    entityId: entityId,
    typeUnitId: typeUnitId,
    differentTypeUnitId: differentTypeUnitId,
    isAvailable: true,
    active: true,
  };

  const response = await api.post("v1/units/search", raw, {
    headers: {
      tenant: TENANT,
    },
  });

  return response.data;
};
