import { fetchNewLoadingOrders } from "@/api/request/loadingOrders/NewLoadingOrders";
import { KeyboardView } from "@/components/KeyboardAvoidingView";
import { ThemedText } from "@/components/ThemedText";
import Autocomplete from "@/components/customs/CustomAutocomplete";
import { LoadingOrdersSchema } from "@/schemas/LoadingOrders";
import { useAuthStore } from "@/zustand/authStore";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

type Props = {};

// {
//   "businessDetailId": "c5577881-8631-43f9-8969-08dd55cedb6d",
//   "destinationQuantity": 1,
//   "issuingDate": "2025-02-26T10:03:40.747-03:00",
//   "loadDate": "2025-02-26T10:04:16.886-03:00",
//   "capacity": 0,
//   "kgsUnloaded": 0,
//   "kgsDifference": 0,
//   "customerTolerance": 0,
//   "kmTraveled": 0,
//   "userId": "60cf87a7-189d-4a4e-b22a-3fa894a3140a",
//   "userName": "Daniela Centeno",
//   "loadingOrderStatusName": "ASIGNADO",
//   "cancellationReasonId": "00000000-0000-0000-0000-000000000000",
//   "entityId": "1db25376-f2d5-44f1-a4ce-08dcec436b13",
//   "transportUserId": "986e7793-e4d7-4239-af66-bff2767fb913",
//   "transportUserName": "Diego Bulacio",
//   "isCompliantDocumentation": true,
//   "systemDocumentationDate": "2025-02-26T10:03:40.747-03:00",
//   "distance": 0,
//   "isRemainingCapacity": false,
//   "kilograms": 0,
//   "scalableId": "35d57384-f4b6-4324-db1e-08dcdd60457e",
//   "chassisId": "25195718-bc3d-41ab-9c37-7123b30ace66",
//   "chassisName": "FTY810",
//   "trailerId": "ec7de3de-d032-4354-b134-21ad5de1c2ed",
//   "trailerName": "BXU278",
//   "driverId": "243be4c4-eed0-4bb5-97b8-b0021e8a68e7",
//   "driverName": "BRAVO HECTOR GABRIEL",
//   "isItInvoiced": false,
//   "isItSettled": false,
//   "isBackOfficie": true
// }

const Assign = (props: Props) => {
  const { decodedClaims } = useAuthStore();
  const { idBusiness, idBusinessDetail, currentFormData } =
    useLocalSearchParams<{
      idBusiness: string;
      idBusinessDetail: string;
      currentFormData?: string;
    }>();

  const parsedForm: any | null = currentFormData
    ? JSON.parse(currentFormData)
    : null;

  const form = useForm<z.infer<typeof LoadingOrdersSchema>>({
    defaultValues: {
      businessDetailId: idBusinessDetail,
      destinationQuantity: 1, //Dato fijo
      issuingDate: new Date().toISOString(),
      loadDate: new Date().toISOString(),
      // journeyStart: "2025-02-26T12:20:46.235Z", // No se uso en la petición
      // timeDifference: "string", // No se uso en la petición
      capacity: 0,
      kgsUnloaded: 0,
      kgsDifference: 0,
      customerTolerance: 0,
      kmTraveled: 0,
      // ctgNumber: "string", // No se uso en la petición
      // remittanceNumber: "string", // No se uso en la petición
      userId:
        decodedClaims?.[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ||
        "" ||
        "",
      userName: decodedClaims!.fullName || "" || "",
      loadingOrderStatusName: "ASIGNADO", //Dato fijo
      cancellationReasonId: "00000000-0000-0000-0000-000000000000", //Dato fijo
      // billOfLading: "string", // No se uso en la petición
      // observation: "string", // No se uso en la petición
      // arrivalDate: "2025-02-26T12:20:46.235Z", // No se uso en la petición
      // unloadedDate: "2025-02-26T12:20:46.235Z", // No se uso en la petición
      // completedDate: "2025-02-26T12:20:46.235Z", // No se uso en la petición
      entityId: parsedForm?.entityId || "",
      entityName: parsedForm?.entityName || "", // Este campo no existe en el tipo original #############################
      transportUserId: parsedForm?.transportUserId || "",
      transportUserName: parsedForm?.transportUserName || "",
      isCompliantDocumentation: true, //Dato fijo
      systemDocumentationDate: new Date().toISOString(),
      // userDocumentationDate: "2025-02-26T12:20:46.235Z", // No se uso en la petición
      distance: 0,
      // isRemainingCapacity: true,
      isRemainingCapacity: false, //Dato fijo
      kilograms: 0,
      scalableId: parsedForm?.scalableId || "",
      scalableName: parsedForm?.scalableName || "", // Este campo no existe en el tipo original #############################
      // documentationObservation: "string", // No se uso en la petición
      chassisId: parsedForm?.chassisId || "",
      chassisName: parsedForm?.chassisName || "",
      trailerId: parsedForm?.trailerId || "",
      trailerName: parsedForm?.trailerName || "",
      driverId: parsedForm?.driverId || "",
      driverName: parsedForm?.driverName || "",
      // isItInvoiced: true,
      // isItSettled: true,
      isBackOfficie: true, //Dato fijo
      isItInvoiced: false,
      isItSettled: false,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const AddLoadingOrdersMutation = useMutation({
    mutationFn: fetchNewLoadingOrders,
    onSuccess: async () => {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Cupo agregado correctamente",
      });
      router.replace(`/business/${idBusiness}`);
    },
    onError: (error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Usuario o contraseña incorrectos",
          });
          return;
        }

        if (error.response?.status === 403) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.response?.data.message || "Acceso denegado",
          });
          return;
        }

        if (error.response?.status === 400) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.response?.data.message || "Hubo un error inesperado",
          });
          return;
        }

        if (error.response?.status === 404) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: `${
              error.response?.data.exception || "Hubo un error inesperado"
            }`,
          });
          return;
        }

        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Hubo un error inesperado",
        });
      }
    },
  });

  const onSubmit = (data: z.infer<typeof LoadingOrdersSchema>) => {
    // los datos que sean "" o null, los eliminamos
    Object.keys(data).forEach((key) => {
      if ((data as any)[key] === "" || (data as any)[key] === null) {
        delete (data as any)[key];
      }
    });

    AddLoadingOrdersMutation.mutateAsync(data);
  };

  return (
    <KeyboardView>
      <View style={{ flex: 1 }}>
        <View style={styles.formContainer}>
          <ThemedText style={{ fontSize: 24, fontWeight: "bold" }}>
            Crear orden de carga
          </ThemedText>

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <Autocomplete
                form={form}
                formField="transportUserId"
                displayField="transportUserName"
                label="Comercial transporte"
                navigationPath="/shared/TransportCustomer"
                error={error}
              />
            )}
            name="transportUserId"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <Autocomplete
                form={form}
                formField="entityId"
                displayField="entityName"
                label="Razon social transporte"
                navigationPath="/shared/TransportEntity"
                error={error}
              />
            )}
            name="entityId"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <Autocomplete
                form={form}
                formField="driverId"
                displayField="driverName"
                label="Chofer"
                navigationPath="/shared/Chauffeur"
                error={error}
                enableCondition={"entityId"}
              />
            )}
            name="driverId"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <Autocomplete
                form={form}
                formField="chassisId"
                displayField="chassisName"
                label="Chasis"
                navigationPath="/shared/MainUnits"
                error={error}
                enableCondition={"entityId"}
              />
            )}
            name="chassisId"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <Autocomplete
                form={form}
                formField="trailerId"
                displayField="trailerName"
                label="Acoplado"
                navigationPath="/shared/SecondaryUnits"
                error={error}
                enableCondition={"entityId"}
              />
            )}
            name="trailerId"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <Autocomplete
                form={form}
                formField="scalableId"
                displayField="scalableName"
                label="Escalable"
                navigationPath="/shared/BusinessCustomer"
                error={error}
                disabled={true}
              />
            )}
            name="scalableId"
          />

          <Pressable
            style={[
              styles.submitButton,
              AddLoadingOrdersMutation.isPending && { opacity: 0.7 },
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={AddLoadingOrdersMutation.isPending}
          >
            <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>
              Guardar
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </KeyboardView>
  );
};

export default Assign;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
    width: "100%",
    gap: 16,
  },
  textInput: {
    padding: 10,
    paddingStart: 20,
    height: 48,
    borderRadius: 10,
  },
  submitButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0093D1",
    padding: 12,
    borderRadius: 12,
  },
});
