import { api } from "@/api/axios/api";
import { AnyDataTag } from "@tanstack/react-query";
import * as z from "zod";

export const TENANT = process.env.EXPO_PUBLIC_TENANT;

const ChangeStateSchema = z.object({
  id: z.string().optional(),
});

const ChangeStateSchemaArray = z.object({
  loadingOrderIds: z.array(z.string()),
});

export const fetchChangeStateLoadingOrdersCanceled = async ({
  data,
  id,
}: {
  data: z.infer<typeof ChangeStateSchema>;
  id: string;
}): Promise<AnyDataTag> => {
  const formatedData = {
    ...data,
  } as z.infer<typeof ChangeStateSchema>;
  const response = await api.put(
    `v1/loadingorders/${id}/updatetostatuscanceled`,
    formatedData,
    {
      headers: {
        tenant: TENANT,
      },
    }
  );

  return response.data;
};

export const fetchChangeStateLoadingOrdersAssigned = async ({
  data,
  id,
}: {
  data: z.infer<typeof ChangeStateSchema>;
  id: string;
}): Promise<AnyDataTag> => {
  const formatedData = {
    ...data,
  } as z.infer<typeof ChangeStateSchema>;
  const response = await api.put(
    `v1/loadingorders/${id}/updatetostatusassigned`,
    formatedData,
    {
      headers: {
        tenant: TENANT,
      },
    }
  );

  return response.data;
};

export const fetchChangeStateLoadingOrdersDownloaded = async ({
  data,
}: {
  data: z.infer<typeof ChangeStateSchemaArray>;
}): Promise<AnyDataTag> => {
  const formatedData = {
    ...data,
  } as z.infer<typeof ChangeStateSchemaArray>;
  const response = await api.put(
    `v1/loadingorders/updatetostatusdownloaded`,
    formatedData,
    {
      headers: {
        tenant: TENANT,
      },
    }
  );

  return response.data;
};
