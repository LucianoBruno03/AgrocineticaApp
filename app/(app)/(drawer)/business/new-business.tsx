import { fetchNewBusiness } from "@/api/request/business/NewBusiness";
import { CustomDateField } from "@/components/CustomDateField";
import CustomRadioButton from "@/components/CustomRadioButton";
import { CustomTextField } from "@/components/CustomTextField";
import { KeyboardView } from "@/components/KeyboardAvoidingView";
import { ThemedLabeledView } from "@/components/ThemedLabeledView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import BusinessCustomerAutoComplete from "@/components/ui/autocomplete/BusinessCustomerAutocomplete";
import CustomerAutoComplete from "@/components/ui/autocomplete/CustomerAutocomplete";
import GatheringAutoComplete from "@/components/ui/autocomplete/GatheringAutocomplete";
import ItemsAutocomplete from "@/components/ui/autocomplete/ItemsAutocomplete";
import ScalesAutoComplete from "@/components/ui/autocomplete/ScalesAutocomplete";
import ShipperAutoComplete from "@/components/ui/autocomplete/ShipperAutocomplete";
import LoadingPointsList from "@/components/ui/checkboxList/LoadingPoints";
import UnitTypesList from "@/components/ui/checkboxList/UnitTypes";
import UnloadingPointsList from "@/components/ui/checkboxList/UnloadingPoints";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { BusinessSchema } from "@/schemas/newBusiness";
import { ParsedForm } from "@/types/business/NewBusiness";
import { useAuthStore } from "@/zustand/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
  ViewProps,
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

const mock = {
  loadDate: "2025-02-06T00:00:00",
  loadTime: null,
  unloadDate: "2025-02-07T00:00:00",
  unloadTime: null,
  itemId: "22962b56-193f-4726-f11b-08dd3718932d",
  itemName: "GRANOS ESPECIALES - POROTO NEGRO",
  customerRate: 2000,
  transportRate: 1000,
  quantity: 1,
  businessUserId: "fbca2de3-1dc1-4593-b76b-1e601dc019e8",
  businessUserName: "Lucio Martino Boronat",
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
  gatheringId: "4e07c2df-5111-41f1-8fad-08dd370845cd",
  scaleId: "372476a5-b5e4-46b7-48c5-08dceeb41867",
  isScale: true,
  showOnWeb: true,

  businessesUnitTypes: [
    {
      businessId: "00000000-0000-0000-0000-000000000000",
      typeUnitId: "af5dd8e9-e0c3-4216-db12-08dcdd60457e",
      typeUnitName: "BATEA",
    },
    {
      businessId: "00000000-0000-0000-0000-000000000000",
      typeUnitId: "a84ccd37-5baf-46ab-db11-08dcdd60457e",
      typeUnitName: "ACOPLADO",
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
      loadingPointId: "c7a5b8ab-2bce-4168-b2eb-4303ff18b39f",
      order: 2,
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
      unloadingPointId: "6ba3e523-70df-44c4-b31f-08dd16190ff0",
      order: 2,
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

const NewBusiness = (props: Props) => {
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
      loadTime: parsedForm?.loadTime || "",
      unloadDate: parsedForm?.unloadDate || mock.unloadDate,
      unloadTime: parsedForm?.unloadTime || "",
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
                  value={value ? new Date(value) : undefined}
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
                  value={value ? new Date(value) : undefined}
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
                  value={value ? new Date(value) : undefined}
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
                  value={value ? new Date(value) : undefined}
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
              // disabled={newBusinessMutation.isPending}
            >
              <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>
                Guardar
              </ThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.SubmitButton,
                newBusinessMutation.isPending && { opacity: 0.7 },
              ]}
              onPress={() => {
                console.log(errors);
              }}
              // disabled={newBusinessMutation.isPending}
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

export default NewBusiness;

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
    marginVertical: 20,
    backgroundColor: "#0093D1",
    padding: 16,
    borderRadius: 10,
  },
});
