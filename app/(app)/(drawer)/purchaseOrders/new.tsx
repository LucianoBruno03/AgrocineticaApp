import { fetchSearchCategoriesTypes } from "@/api/request/categoriesTypes/SearchCategoriesTypes";
import { fetchNewPurchaseOrder } from "@/api/request/purchaseOrders/NewPurchaseOrder";
import Autocomplete from "@/components/customs/CustomAutocomplete";
import { CustomDateField } from "@/components/customs/CustomDateField";
import CustomDropdown from "@/components/customs/CustomDropdown";
import CustomRadioButton from "@/components/customs/CustomRadioButton";
import { CustomTextArea } from "@/components/customs/CustomTextArea";
import { KeyboardView } from "@/components/KeyboardAvoidingView";
import PurchaseOrdersItemsModal from "@/components/pages/purchaseOrders/PurchaseOrdersItemsModal";
import { ThemedLabeledView } from "@/components/ThemedLabeledView";
import { ThemedText } from "@/components/ThemedText";
import PurchaseOrderItemsCardList from "@/components/ui/cards/PurchaseOrderItemsCardList";
import { AddIcon } from "@/components/ui/icons/AddIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { PurchaseOrdersSchema } from "@/schemas/PurchaseOrders";
import { useAuthStore } from "@/zustand/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, View, ViewProps } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

type Props = {};

export interface SearchParams {
  currentFormData: string;
}

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const NewPurchaseOrder = (props: Props) => {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "#000" : "#fff";

  const [Open, setOpen] = useState<boolean>(false);

  const { user, decodedClaims } = useAuthStore();

  const { currentFormData } = useLocalSearchParams<{
    currentFormData?: string;
  }>();

  const parsedForm: any | null = currentFormData
    ? JSON.parse(currentFormData)
    : null;

  const form = useForm<z.infer<typeof PurchaseOrdersSchema>>({
    defaultValues: {
      loadingOrderId: parsedForm?.loadingOrderId || "",
      loadingOrderIncrementId: parsedForm?.loadingOrderIncrementId || "",
      issuingDate: parsedForm?.issuingDate || "",
      expirationDate: parsedForm?.expirationDate || "",
      userId:
        decodedClaims?.[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ||
        "" ||
        "",
      userName: decodedClaims!.fullName || "" || "",
      cancellationReasonId: parsedForm?.cancellationReasonId || "",
      remittanceNumber: parsedForm?.remittanceNumber || "",
      completedDate: parsedForm?.completedDate || "",
      entityId: parsedForm?.entityId || "",
      entityName: parsedForm?.entityName || "",
      serviceStationId: parsedForm?.serviceStationId || "",
      serviceStationName: parsedForm?.serviceStationName || "",
      paymentMethodId: parsedForm?.paymentMethodId || "",
      royalLiters: parsedForm?.royalLiters || undefined,
      advance: parsedForm?.advance || undefined,
      total: parsedForm?.total || undefined,
      observation: parsedForm?.observation || "",
      compliantDocumentation: parsedForm?.compliantDocumentation || false,
      documentationObservation: parsedForm?.documentationObservation || "",
      purchaseOrderItems: [
        // {
        //   purchaseOrderId: "string",
        //   itemId: "string",
        //   quantity: 0,
        // },
      ],
    },
    resolver: zodResolver(PurchaseOrdersSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const purchaseOrderMutation = useMutation({
    mutationFn: fetchNewPurchaseOrder,
    onSuccess: async (data) => {
      try {
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Orden de compra creada exitosamente",
        });
        router.replace("/purchaseOrders");
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Error al guardar los datos",
        });
      }
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
            text2:
              error.response?.data.message ||
              error.response?.data.messages[0] ||
              "Hubo un error inesperado",
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

  const onSubmit = (data: z.infer<typeof PurchaseOrdersSchema>) => {
    const fieldsToCheck = [
      "RemittanceNumber",
      "expirationDate",
      "cancellationReasonId",
      "completedDate",
      "serviceStationId",
      "paymentMethodId",
    ];

    Object.keys(data).forEach((key) => {
      if (
        fieldsToCheck.includes(key) &&
        ((data as any)[key] === "" || (data as any)[key] === null)
      ) {
        delete (data as any)[key];
      }
    });

    // // los datos que sean "" o null, los eliminamos
    // Object.keys(data).forEach((key) => {
    //   if ((data as any)[key] === "" || (data as any)[key] === null) {
    //     delete (data as any)[key];
    //   }
    // });
    purchaseOrderMutation.mutateAsync(data);
  };

  const { data: TypeOfPayment } = useQuery({
    queryKey: ["getStatusChangeStatePurchaseOrder", "", "TIPO DE COBRO"],
    queryFn: () =>
      fetchSearchCategoriesTypes({
        queryKey: ["getTypeOfPayment", "", "TIPO DE COBRO", []],
      }),
  });

  const dataMapper = (item: any) => ({
    label: item.name,
    value: item.id,
  });

  return (
    <KeyboardView>
      <View style={{ flex: 1 }}>
        <View style={styles.formContainer}>
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
                formField="loadingOrderId"
                displayField="loadingOrderIncrementId"
                label="Orden de carga"
                navigationPath="/shared/LoadingOrders"
                error={error}
              />
            )}
            name="loadingOrderId"
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
                label="Proveedores"
                navigationPath="/shared/Supplier"
                error={error}
                // keysToClear={["entityId", "entityName"]}
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
                formField="serviceStationId"
                displayField="serviceStationName"
                label="Estaciones de servicio"
                navigationPath="/shared/ServiceStations"
                error={error}
                enableCondition={"entityId"}
              />
            )}
            name="serviceStationId"
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
              <CustomDateField
                label="Fecha de emisión"
                value={value ? value : undefined}
                onBlur={onBlur}
                onChange={onChange}
                error={error}
                placeholder="Selecciona una fecha"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="issuingDate"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={() => (
              <CustomDropdown
                form={form}
                label="Tipos de cobro"
                fieldName="paymentMethodId"
                value={form.getValues("paymentMethodId")}
                items={TypeOfPayment?.data?.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                disabled={false}
                searchEnabled={true}
                error={errors.paymentMethodId}
                dataMapper={dataMapper}
                onChange={(value) => {
                  const selected = TypeOfPayment?.data?.find(
                    (item) => item.id === value
                  );
                  if (selected) {
                    form.setValue("paymentMethodId", selected.id);
                  }
                }}
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
              <CustomTextArea
                label="Observaciones"
                value={value ? value : ""}
                onBlur={onBlur}
                onChangeText={onChange}
                error={error}
                numberOfLines={6}
                minHeight={150}
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="observation"
          />

          <ThemedLabeledView label="Documentación conforme">
            <CustomRadioButton
              options={[
                { value: "true", label: "Si" },
                { value: "false", label: "No" },
              ]}
              selectedValue={
                form.watch("compliantDocumentation") ? "true" : "false"
              }
              onSelect={(value) => {
                if (value === "true") {
                  form.setValue("compliantDocumentation", true);
                } else {
                  form.setValue("compliantDocumentation", false);
                }
              }}
              selectedButtonStyle={{ backgroundColor: "transparent" }}
              selectedTextStyle={{ color: "#0093D1" }}
            />
          </ThemedLabeledView>

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <CustomTextArea
                label="Observaciones de la documentación"
                value={value ? value : ""}
                onBlur={onBlur}
                onChangeText={onChange}
                error={error}
                numberOfLines={6}
                minHeight={150}
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="documentationObservation"
          />

          <View style={styles.containerSubtitle}>
            <View style={styles.itemsTitle}>
              <ThemedText style={styles.subtitle}>Items</ThemedText>
              <Pressable
                style={styles.newButton}
                onPress={() => {
                  setOpen(true);
                }}
              >
                <AddIcon
                  width={32}
                  height={32}
                  color="white"
                  style={styles.textButton}
                />
              </Pressable>
            </View>
            <View style={styles.separator}></View>
          </View>

          <PurchaseOrdersItemsModal
            open={Open}
            setOpen={setOpen}
            onSubmit={(data) => {
              const currentItems = form.getValues("purchaseOrderItems");
              form.setValue("purchaseOrderItems", [...currentItems, data]);
              setOpen(false);
            }}
          />

          {form.watch("purchaseOrderItems").length > 0 ? (
            <View style={{ width: "100%", gap: 8, flexDirection: "column" }}>
              {form.getValues("purchaseOrderItems").map((item: any, index) => {
                return (
                  <PurchaseOrderItemsCardList
                    item={item}
                    key={index}
                    isDeletable={true}
                    onDelete={() => {
                      const currentItems = form.getValues("purchaseOrderItems");
                      const newItems = currentItems.filter(
                        (i: any) => i.itemId !== item.itemId
                      );
                      form.setValue("purchaseOrderItems", newItems);
                    }}
                  />
                );
              })}
            </View>
          ) : (
            <ThemedText
              style={{ color: "red", width: "100%", textAlign: "center" }}
            >
              No hay items seleccionados
            </ThemedText>
          )}

          <Pressable
            style={[
              styles.SubmitButton,
              purchaseOrderMutation.isPending && { opacity: 0.7 },
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={purchaseOrderMutation.isPending}
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

export default NewPurchaseOrder;

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
  SubmitButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
    backgroundColor: "#0093D1",
    padding: 12,
    borderRadius: 12,
  },
  separator: {
    height: 2,
    width: "100%",
    backgroundColor: "#ABCA48",
  },
  containerSubtitle: {
    flexDirection: "column",
    gap: 2,
    width: "100%",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBlock: 4,
  },
  newButton: {
    right: 14,
    backgroundColor: "#ABCA48",
    borderRadius: 100,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    zIndex: 100,
  },
  textButton: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
    lineHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    textAlign: "center",
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  itemsTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
  },
});
