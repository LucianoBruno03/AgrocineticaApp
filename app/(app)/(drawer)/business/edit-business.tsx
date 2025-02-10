import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  useColorScheme,
} from "react-native";
import React from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardView } from "@/components/KeyboardAvoidingView";
import { ThemedView } from "@/components/ThemedView";
import { CustomDateField } from "@/components/CustomDateField";
import { CustomTextField } from "@/components/CustomTextField";
import ItemsAutocomplete from "@/components/ui/autocomplete/ItemsAutocomplete";
import BusinessCustomerAutoComplete from "@/components/ui/autocomplete/BusinessCustomerAutocomplete";
import CustomerAutoComplete from "@/components/ui/autocomplete/CustomerAutocomplete";
import GatheringAutoComplete from "@/components/ui/autocomplete/GatheringAutocomplete";
import { ThemedText } from "@/components/ThemedText";
import { ThemedLabeledView } from "@/components/ThemedLabeledView";
import CustomRadioButton from "@/components/CustomRadioButton";
import ScalesAutoComplete from "@/components/ui/autocomplete/ScalesAutocomplete";
import UnloadingPointsList from "@/components/ui/checkboxList/UnloadingPoints";
import LoadingPointsList from "@/components/ui/checkboxList/LoadingPoints";
import UnitTypesList from "@/components/ui/checkboxList/UnitTypes";
import ShipperAutoComplete from "@/components/ui/autocomplete/ShipperAutocomplete";
import { z } from "zod";
import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";
import { fetchNewBusiness } from "@/api/request/business/NewBusiness";
import { BusinessSchema } from "@/schemas/newBusiness";
import axios, { AxiosError } from "axios";
import { ViewProps } from "react-native";
import { useAuthStore } from "@/zustand/authStore";
import { ParsedForm } from "@/types/business/NewBusiness";
import { zodResolver } from "@hookform/resolvers/zod";

const mock = {
  loadDate: "2025-02-08T00:00:00",
  loadTime: "18:00:00",
  unloadDate: "2025-02-09T00:00:00",
  unloadTime: "21:00:00",
  itemId: "01554ca7-29e8-496f-f114-08dd3718932d",
  itemName: "COMMODITIES -  SOJA",
  customerRate: 2000,
  transportRate: 1000,
  quantity: 1,
  businessUserId: "f957d086-0608-4044-ab6c-eeaadc4d0128",
  businessUserName: "Stefania Monte",
  userId: "60cf87a7-189d-4a4e-b22a-3fa894a3140a",
  userName: "Daniela Centeno",
  entityId: "2412f341-b093-44d5-a41e-08dcec436b13",
  shipperId: "2412f341-b093-44d5-a41e-08dcec436b13",
  commission: 8,
  isKilograms: true,
  isKilometers: false,
  isOrigin: false,
  isDestination: true,
  isWeightScaleOrigin: true,
  isWeightScaleDestination: true,
  isPhysicalPapers: true,
  gatheringId: "f71808a5-b6ce-439c-9af9-ea03a1bf2943",
  scaleId: "372476a5-b5e4-46b7-48c5-08dceeb41867",
  isScale: true,
  showOnWeb: true,
  businessesUnitTypes: [
    {
      businessId: "00000000-0000-0000-0000-000000000000",
      typeUnitId: "a84ccd37-5baf-46ab-db11-08dcdd60457e",
      typeUnitName: "ACOPLADO",
    },
    {
      businessId: "00000000-0000-0000-0000-000000000000",
      typeUnitId: "af5dd8e9-e0c3-4216-db12-08dcdd60457e",
      typeUnitName: "BATEA",
    },
  ],
  businessesLoadingPoints: [
    {
      businessId: "00000000-0000-0000-0000-000000000000",
      loadingPointId: "090fdf81-0078-4c27-b143-479d3bcc4906",
      order: 1,
    },
    {
      businessId: "00000000-0000-0000-0000-000000000000",
      loadingPointId: "897defdc-9dfc-4568-af6e-64a4b4b39b5a",
      order: 2,
    },
    {
      businessId: "00000000-0000-0000-0000-000000000000",
      loadingPointId: "c7a5b8ab-2bce-4168-b2eb-4303ff18b39f",
      order: 3,
    },
    {
      businessId: "00000000-0000-0000-0000-000000000000",
      loadingPointId: "16f0a3c0-c627-4c3f-9be0-4b568046f0f7",
      order: 4,
    },
  ],
  businessesUnloadingPoint: [
    {
      businessId: "00000000-0000-0000-0000-000000000000",
      unloadingPointId: "cc43da4b-81cf-47d7-01ba-08dd370057b5",
      order: 1,
    },
    {
      businessId: "00000000-0000-0000-0000-000000000000",
      unloadingPointId: "66d62900-142b-4004-4704-08dd0efbfd55",
      order: 2,
    },
    {
      businessId: "00000000-0000-0000-0000-000000000000",
      unloadingPointId: "a42758cf-af84-4755-ced1-08dcf35f3ee7",
      order: 3,
    },
    {
      businessId: "00000000-0000-0000-0000-000000000000",
      unloadingPointId: "c253ec19-f5a6-49fd-ced0-08dcf35f3ee7",
      order: 4,
    },
    {
      businessId: "00000000-0000-0000-0000-000000000000",
      unloadingPointId: "c0038a04-2943-4995-cecf-08dcf35f3ee7",
      order: 5,
    },
    {
      businessId: "00000000-0000-0000-0000-000000000000",
      unloadingPointId: "3b3aa232-e21a-4ea9-cece-08dcf35f3ee7",
      order: 6,
    },
    {
      businessId: "00000000-0000-0000-0000-000000000000",
      unloadingPointId: "cdbf8848-05eb-4bf4-cecd-08dcf35f3ee7",
      order: 7,
    },
  ],
};

type Props = {};

export interface SearchParams {
  currentFormData: string;
}

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const EditBusiness = (props: Props) => {
  const colorScheme = useColorScheme() ?? "light";

  const color = colorScheme === "light" ? "#000" : "#fff";

  const { user, decodedClaims } = useAuthStore();

  const { currentFormData } = useLocalSearchParams<{
    currentFormData?: string;
  }>();

  const parsedForm: ParsedForm | null = currentFormData
    ? JSON.parse(currentFormData)
    : null;

  const form = useForm<z.infer<typeof BusinessSchema>>({
    defaultValues: {
      loadDate: parsedForm?.loadDate || mock.loadDate,
      loadTime: parsedForm?.loadTime || mock.loadTime,
      unloadDate: parsedForm?.unloadDate || mock.unloadDate,
      unloadTime: parsedForm?.unloadTime || mock.unloadTime,
      itemId: parsedForm?.itemId || mock.itemId,
      itemName: parsedForm?.itemName || mock.itemName,
      customerRate: parsedForm?.customerRate || mock.customerRate,
      transportRate: parsedForm?.transportRate || mock.transportRate,
      quantity: parsedForm?.quantity || mock.quantity,
      businessUserId: parsedForm?.businessUserId || mock.businessUserId,
      businessUserName: parsedForm?.businessUserName || mock.businessUserName,

      userId:
        decodedClaims?.[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] || "",
      userName: decodedClaims!.fullName || "",

      entityId: parsedForm?.entityId || mock.entityId,
      entityBusinessName: parsedForm?.entityBusinessName || "",

      shipperId: parsedForm?.shipperId || mock.shipperId,
      shipperName: parsedForm?.shipperName || "",

      commission: parsedForm?.commission || mock.commission,
      isKilograms: parsedForm?.isKilograms || mock.isKilograms,
      isKilometers: parsedForm?.isKilometers || mock.isKilometers,
      isOrigin: parsedForm?.isOrigin || mock.isOrigin,
      isDestination: parsedForm?.isDestination || mock.isDestination,
      isWeightScaleOrigin:
        parsedForm?.isWeightScaleOrigin || mock.isWeightScaleOrigin,
      isWeightScaleDestination:
        parsedForm?.isWeightScaleDestination || mock.isWeightScaleDestination,
      isPhysicalPapers: parsedForm?.isPhysicalPapers || mock.isPhysicalPapers,
      gatheringId: parsedForm?.gatheringId || mock.gatheringId,
      gatheringName: parsedForm?.gatheringName || "",
      scaleId: parsedForm?.scaleId || mock.scaleId,
      scaleName: parsedForm?.scaleName || "",
      isScale: parsedForm?.isScale || mock.isScale,

      cancellationReasonId: null,

      showOnWeb: parsedForm?.showOnWeb || mock.showOnWeb,
      businessesUnitTypes:
        parsedForm?.businessesUnitTypes || mock.businessesUnitTypes,
      businessesLoadingPoints:
        parsedForm?.businessesLoadingPoints || mock.businessesLoadingPoints,
      businessesUnloadingPoint:
        parsedForm?.businessesUnloadingPoint || mock.businessesUnloadingPoint,
    },
    resolver: zodResolver(BusinessSchema),
  });

  console.log(form.getValues().loadDate);
  console.log(form.getValues().loadTime);
  console.log(form.getValues().unloadDate);
  console.log(form.getValues().unloadTime);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const newBusinessMutation = useMutation({
    mutationFn: fetchNewBusiness,
    onSuccess: async (data) => {
      try {
        // Uncomment these lines when you have the storage functionality ready
        // await SecureStoreSetItemAsync("token", data.token);
        // await SecureStoreSetItemAsync("user", JSON.stringify(data.user));
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Error al guardar los datos de autenticación",
        });
        router.replace("/business");
      } catch (error) {
        console.error("Error saving auth data:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Error al guardar los datos de autenticación",
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
      }

      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Hubo un error inesperado",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof BusinessSchema>) => {
    console.log("onSubmit", data);
    newBusinessMutation.mutateAsync(data);
  };

  console.log({ errors });

  return (
    <KeyboardView>
      <ThemedView style={{ flex: 1 }}>
        <ScrollView>
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

            <ItemsAutocomplete form={form} />

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

            <BusinessCustomerAutoComplete form={form} />

            <CustomerAutoComplete form={form} />

            <GatheringAutoComplete form={form} />

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
                    onValueChange={onChange}
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

            <ScalesAutoComplete form={form} />

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
                selectedValue={
                  form.watch("isPhysicalPapers") ? "true" : "false"
                }
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

            <ShipperAutoComplete form={form} />

            <UnitTypesList form={form} />

            <LoadingPointsList form={form} />

            <UnloadingPointsList form={form} />

            <Pressable
              style={[
                styles.SubmitButton,
                newBusinessMutation.isPending && { opacity: 0.7 },
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={newBusinessMutation.isPending}
            >
              <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>
                Guardar
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
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
    backgroundColor: "#0093D120",
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
