import { fetchBusinessById } from "@/api/request/business/BusinessById";
import { fetchEditBusiness } from "@/api/request/business/EditBusiness";
import Autocomplete from "@/components/customs/CustomAutocomplete";
import { CustomDateField } from "@/components/customs/CustomDateField";
import CustomRadioButton from "@/components/customs/CustomRadioButton";
import { CustomTextField } from "@/components/customs/CustomTextField";
import { KeyboardView } from "@/components/KeyboardAvoidingView";
import { ThemedLabeledView } from "@/components/ThemedLabeledView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { EditBusinessSchema } from "@/schemas/newBusiness";
import { useAuthStore } from "@/zustand/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";
import BusinessDetailStatusDropdown from "@/components/ui/dropdown/BusinessDetailStatusDropdown";
import { fetchSearchCancellationReasons } from "@/api/request/categoriesTypes/SearchCancellationReasons";
import { fetchCategoriesTypesByName } from "@/api/request/categoriesTypes/SearchCategoriesTypesByName";
import { fetchSearchCategoriesTypes } from "@/api/request/categoriesTypes/SearchCategoriesTypes";
import CustomDropdown from "@/components/customs/CustomDropdown";

const EditBusiness = () => {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "#000" : "#fff";
  const { idBusiness } = useLocalSearchParams<{ idBusiness: string }>();
  const { decodedClaims } = useAuthStore();
  const { currentFormData } = useLocalSearchParams<{
    currentFormData?: string;
  }>();

  const parsedForm = currentFormData ? JSON.parse(currentFormData) : null;

  const getBusinessByIdQuery = useQuery({
    queryKey: ["getBusinessByIdQuery", idBusiness],
    queryFn: fetchBusinessById,
    enabled: !!idBusiness,
  });

  // Keep track of which fields have been modified by the user
  const [modifiedFields, setModifiedFields] = React.useState<Set<string>>(
    new Set()
  );

  // errors {"shipperName": {"message": "Required", "ref": undefined, "type": "invalid_type"}, "userId": {"message": "Required", "ref": undefined, "type": "invalid_type"}, "userName": {"message": "Required", "ref": undefined, "type": "invalid_type"}}

  const form = useForm<z.infer<typeof EditBusinessSchema>>({
    defaultValues: {
      id: parsedForm?.id ?? idBusiness,
      loadDate: parsedForm?.loadDate ?? "",
      loadTime: parsedForm?.loadTime ?? "",
      unloadDate: parsedForm?.unloadDate ?? "",
      unloadTime: parsedForm?.unloadTime ?? "",
      itemId: parsedForm?.itemId ?? "",
      itemName: parsedForm?.itemName ?? "",
      customerRate: parsedForm?.customerRate,
      transportRate: parsedForm?.transportRate,
      quantity: parsedForm?.quantity ?? 1,
      businessUserId: parsedForm?.businessUserId ?? "",
      businessUserName: parsedForm?.businessUserName ?? "",
      userId:
        decodedClaims?.[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ?? "",
      userName: decodedClaims?.fullName ?? "",
      entityId: parsedForm?.entityId ?? "",
      entityBusinessName: parsedForm?.entityBusinessName ?? "", // Este campo no existe en el tipo original
      shipperId: parsedForm?.shipperId ?? "",
      shipperName: parsedForm?.shipperName ?? "", // Este campo no existe en el tipo original
      commission: parsedForm?.commission ?? 8,
      isKilograms: parsedForm?.isKilograms ?? false,
      isKilometers: parsedForm?.isKilometers ?? false,
      isOrigin: parsedForm?.isOrigin ?? false,
      isDestination: parsedForm?.isDestination ?? false,
      isWeightScaleOrigin: parsedForm?.isWeightScaleOrigin ?? false,
      isWeightScaleDestination: parsedForm?.isWeightScaleDestination ?? false,
      isPhysicalPapers: parsedForm?.isPhysicalPapers ?? false,
      gatheringId: parsedForm?.gatheringId ?? "",
      gatheringName: parsedForm?.gatheringName ?? "", // Este campo no existe en el tipo original
      scaleId: parsedForm?.scaleId ?? "",
      scaleName: parsedForm?.scaleName ?? "", // Este campo no existe en el tipo original
      isScale: parsedForm?.isScale ?? false,
      cancellationReasonId: null,
      showOnWeb: parsedForm?.showOnWeb ?? false,
      businessStatusId: parsedForm?.businessStatusId,
      businessStatusName: parsedForm?.businessStatusName,
    },
    resolver: zodResolver(EditBusinessSchema),
  });

  const { reset, watch } = form;

  // Watch for changes in form values
  const formValues = watch();
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name && type === "change") {
        setModifiedFields((prev) => new Set([...prev, name]));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (getBusinessByIdQuery.data && !parsedForm) {
      // Only set initial values from query if there's no parsed form data
      const queryData = getBusinessByIdQuery.data;
      reset({
        id: queryData.id ?? idBusiness,
        loadDate: queryData.loadDate ?? "",
        loadTime: queryData.loadTime ?? "",
        unloadDate: queryData.unloadDate ?? "",
        unloadTime: queryData.unloadTime ?? "",
        itemId: queryData.itemId ?? "",
        itemName: queryData.itemName ?? "",
        customerRate: queryData.customerRate,
        transportRate: queryData.transportRate,
        quantity: queryData.quantity ?? 1,
        businessUserId: queryData.businessUserId ?? "",
        businessUserName: queryData.businessUserName ?? "",
        entityId: queryData.entityId ?? "",
        entityBusinessName: queryData.entityBusinessName ?? "",
        shipperId: queryData.shipperId ?? "",
        userId:
          decodedClaims?.[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] ?? "",
        userName: decodedClaims?.fullName ?? "",
        shipperName: queryData.shipperBusinessName ?? "",
        commission: queryData.commission ?? 8,
        isKilograms: queryData.isKilograms ?? false,
        isKilometers: queryData.isKilometers ?? false,
        isOrigin: queryData.isOrigin ?? false,
        isDestination: queryData.isDestination ?? false,
        isWeightScaleOrigin: queryData.isWeightScaleOrigin ?? false,
        isWeightScaleDestination: queryData.isWeightScaleDestination ?? false,
        isPhysicalPapers: queryData.isPhysicalPapers ?? false,
        gatheringId: queryData.gatheringId ?? "",
        gatheringName: queryData.gatheringName ?? "",
        businessStatusId: queryData.businessStatusId,
        businessStatusName: queryData.businessStatusName,
        scaleId: queryData.scaleId ?? "",
        scaleName: queryData.scaleName ?? "",
        isScale: queryData.isScale ?? false,
        showOnWeb: queryData.showOnWeb ?? false,
        cancellationReasonId: null,
      });
    }
  }, [getBusinessByIdQuery.data, parsedForm, reset]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const editBusinessMutation = useMutation({
    mutationFn: fetchEditBusiness,
    onSuccess: async () => {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Negocio modificado exitosamente",
      });
      router.replace("/business");
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

  const onSubmit = (data: z.infer<typeof EditBusinessSchema>) => {
    // los datos que sean "" o null, los eliminamos
    Object.keys(data).forEach((key) => {
      if ((data as any)[key] === "" || (data as any)[key] === null) {
        delete (data as any)[key];
      }
    });

    editBusinessMutation.mutateAsync({ data, id: idBusiness });
  };

  const { data: BusinessStates } = useQuery({
    queryKey: ["getStatusChangeStateBusiness", "", "ESTADOS DEL NEGOCIO"],
    queryFn: () =>
      fetchSearchCategoriesTypes({
        queryKey: [
          "getStatusChangeStateBusiness",
          "",
          "ESTADOS DEL NEGOCIO",
          [],
        ],
      }),
  });

  const { data: CategoryTypeCancelationReasons } = useQuery({
    queryKey: [
      "getCategoriesTypesByNameCancelationReasons",
      "Tipos de cancelacion",
      "NEGOCIO",
    ],
    queryFn: () =>
      fetchCategoriesTypesByName({
        queryKey: [
          "getCategoriesTypesByNameCancelationReasons",
          "Tipos de cancelacion",
          "NEGOCIO",
        ],
      }),
  });

  const { data: BusinessCancellationReasons } = useQuery({
    queryKey: [
      "getCancellationReasonsBusiness",
      CategoryTypeCancelationReasons?.id,
    ],
    queryFn: () =>
      fetchSearchCancellationReasons({
        queryKey: [
          "getCancellationReasonsBusiness",
          CategoryTypeCancelationReasons?.id,
        ],
      }),
    enabled: !!CategoryTypeCancelationReasons?.id,
  });

  const dataMapper = (item: any) => ({
    label: item.name,
    value: item.id,
    name: item.name, // Guardamos el nombre para usarlo en onChange
  });

  return (
    <KeyboardView>
      <ThemedView style={{ flex: 1 }}>
        <View style={styles.formContainer}>
          <CustomDropdown
            form={form}
            label="Estado"
            fieldName="businessStatusId"
            value={form.getValues("businessStatusId")}
            items={BusinessStates?.data?.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            disabled={false}
            searchEnabled={true}
            error={errors.businessStatusId}
            dataMapper={dataMapper}
            onChange={(value) => {
              const selected = BusinessStates?.data?.find(
                (item) => item.id === value
              );
              if (selected) {
                form.setValue("businessStatusName", selected.name);
              }
            }}
          />
          <CustomDropdown
            form={form}
            label="Motivo de cancelación"
            fieldName="cancellationReasonId"
            value={form.getValues("cancellationReasonId") ?? undefined}
            items={BusinessCancellationReasons?.data?.map((item) => ({
              label: item.description,
              value: item.id,
            }))}
            disabled={form.watch("businessStatusName") !== "CANCELADO"}
            searchEnabled={true}
            error={errors.businessStatusId}
            dataMapper={dataMapper}
            onChange={(value) => {
              const selected = BusinessCancellationReasons?.data?.find(
                (item) => item.id === value
              );
              if (selected) {
                form.setValue("cancellationReasonId", selected.id);
              }
            }}
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
                label="Fecha de carga"
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
            name="loadDate"
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
                label="Hora de carga"
                value={value ? value : undefined}
                onBlur={onBlur}
                onChange={onChange}
                error={error}
                placeholder="Selecciona una fecha"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
                type="time"
              />
            )}
            name="loadTime"
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
                label="Fecha de descarga"
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
            name="unloadDate"
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
                label="Hora de descarga"
                value={value ? value : undefined}
                onBlur={onBlur}
                onChange={onChange}
                error={error}
                placeholder="Selecciona una fecha"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
                type="time"
              />
            )}
            name="unloadTime"
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
                formField="itemId"
                displayField="itemName"
                label="Item"
                navigationPath="/shared/Items"
                error={error}
              />
            )}
            name="itemId"
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
              <CustomTextField
                value={value ? value : ""}
                onBlur={onBlur}
                onChangeText={onChange}
                error={error}
                type="number"
                placeholder="Cupos"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="quantity"
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
              <CustomTextField
                value={value ? value : ""}
                onBlur={onBlur}
                onChangeText={onChange}
                error={error}
                type="number"
                placeholder="Tarifa transporte"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="transportRate"
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
              <CustomTextField
                value={value ? value : ""}
                onBlur={onBlur}
                onChangeText={onChange}
                error={error}
                type="number"
                placeholder="Tarifa cliente"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="customerRate"
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
              <CustomTextField
                value={value ? String(value) : ""}
                onBlur={onBlur}
                onChangeText={onChange}
                error={error}
                type="number"
                placeholder="Comisión"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="commission"
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
                formField="businessUserId"
                displayField="businessUserName"
                label="Comercial cliente"
                navigationPath="/shared/BusinessCustomer"
                error={error}
              />
            )}
            name="businessUserId"
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
                displayField="entityBusinessName"
                label="Cliente"
                navigationPath="/shared/Customer"
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
                formField="gatheringId"
                displayField="gatheringName"
                label="Acopio"
                navigationPath="/shared/Gathering"
                error={error}
                enableCondition="entityId"
              />
            )}
            name="gatheringId"
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Switch
                  value={value}
                  onValueChange={onChange}
                  // onBlur={onBlur}
                  // thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
                  trackColor={{ false: "#767577", true: "#0093D1" }}
                />
                <ThemedText style={{ color: color }}>
                  Mostrar en la web
                </ThemedText>
              </View>
            )}
            name="showOnWeb"
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Switch
                  value={value}
                  onValueChange={() => {
                    onChange(!value);
                    form.setValue("scaleName", "");
                    form.setValue("scaleId", "");
                  }}
                  // onBlur={onBlur}
                  // thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
                  trackColor={{ false: "#767577", true: "#0093D1" }}
                />
                <ThemedText style={{ color: color }}>
                  ¿Seleccionar balanza?
                </ThemedText>
              </View>
            )}
            name="isScale"
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
                formField="scaleName"
                label="Balanza"
                navigationPath="/shared/Scales"
                enableCondition="isScale"
                error={error}
              />
            )}
            name="entityId"
          />

          <ThemedLabeledView label="Calcular por">
            <CustomRadioButton
              options={[
                { value: "Kilogramos", label: "Kilogramos" },
                { value: "Kilómetros", label: "Kilómetros" },
              ]}
              selectedValue={
                form.watch("isKilograms") ? "Kilogramos" : "Kilómetros"
              }
              onSelect={(value) => {
                if (value === "Kilogramos") {
                  form.setValue("isKilograms", true);
                  form.setValue("isKilometers", false);
                } else {
                  form.setValue("isKilometers", true);
                  form.setValue("isKilograms", false);
                }
              }}
              selectedButtonStyle={{ backgroundColor: "transparent" }}
              selectedTextStyle={{ color: "#0093D1" }}
            />

            <CustomRadioButton
              options={[
                { value: "Origen", label: "Origen" },
                { value: "Destino", label: "Destino" },
              ]}
              selectedValue={form.watch("isOrigin") ? "Origen" : "Destino"}
              onSelect={(value) => {
                if (value === "Origen") {
                  form.setValue("isOrigin", true);
                  form.setValue("isDestination", false);
                } else {
                  form.setValue("isDestination", true);
                  form.setValue("isOrigin", false);
                }
              }}
              selectedButtonStyle={{ backgroundColor: "transparent" }}
              selectedTextStyle={{ color: "#0093D1" }}
            />
          </ThemedLabeledView>

          <ThemedLabeledView label="Peso en balanza en origen">
            <CustomRadioButton
              options={[
                { value: "true", label: "Si" },
                { value: "false", label: "No" },
              ]}
              selectedValue={
                form.watch("isWeightScaleOrigin") ? "true" : "false"
              }
              onSelect={(value) => {
                if (value === "true") {
                  form.setValue("isWeightScaleOrigin", true);
                } else {
                  form.setValue("isWeightScaleOrigin", false);
                }
              }}
              selectedButtonStyle={{ backgroundColor: "transparent" }}
              selectedTextStyle={{ color: "#0093D1" }}
            />
          </ThemedLabeledView>

          <ThemedLabeledView label="Peso en balanza en destino">
            <CustomRadioButton
              options={[
                { value: "true", label: "Si" },
                { value: "false", label: "No" },
              ]}
              selectedValue={
                form.watch("isWeightScaleDestination") ? "true" : "false"
              }
              onSelect={(value) => {
                if (value === "true") {
                  form.setValue("isWeightScaleDestination", true);
                } else {
                  form.setValue("isWeightScaleDestination", false);
                }
              }}
              selectedButtonStyle={{ backgroundColor: "transparent" }}
              selectedTextStyle={{ color: "#0093D1" }}
            />
          </ThemedLabeledView>

          <ThemedLabeledView label="Papeles físicos">
            <CustomRadioButton
              options={[
                { value: "true", label: "Si" },
                { value: "false", label: "No" },
              ]}
              selectedValue={form.watch("isPhysicalPapers") ? "true" : "false"}
              onSelect={(value) => {
                if (value === "true") {
                  form.setValue("isPhysicalPapers", true);
                } else {
                  form.setValue("isPhysicalPapers", false);
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
              <Autocomplete
                form={form}
                formField="shipperId"
                displayField="shipperName"
                label="Dador de carga"
                navigationPath="/shared/Shipper"
                error={error}
              />
            )}
            name="shipperId"
          />

          {/* <BusinessDetailStatusDropdown form={form} /> */}

          {/* <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <CustomCheckboxList
                  form={form}
                  error={error}
                  title="Tipos de Unidades"
                  route="/shared/UnitTypes"
                  fieldName="businessesUnitTypes"
                />
              )}
              name="businessesUnitTypes"
            /> */}

          {/* <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <CustomCheckboxList
                  form={form}
                  error={error}
                  title="Puntos de carga"
                  route="/shared/LoadingPoints"
                  fieldName="businessesLoadingPoints"
                  isDisabled={!form.getValues().entityId}
                />
              )}
              name="businessesLoadingPoints"
            /> */}

          {/* <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <CustomCheckboxList
                  form={form}
                  error={error}
                  title="Puntos de descarga"
                  route="/shared/UnloadingPoints"
                  fieldName="businessesUnloadingPoint"
                />
              )}
              name="businessesUnloadingPoint"
            /> */}

          <Pressable
            style={[
              styles.SubmitButton,
              editBusinessMutation.isPending && { opacity: 0.7 },
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={editBusinessMutation.isPending}
          >
            <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>
              Guardar
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </KeyboardView>
  );
};

export default EditBusiness;

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
    // backgroundColor: "#0093D120",
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
});
