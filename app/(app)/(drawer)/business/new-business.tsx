import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import React from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { CustomTextField } from "@/components/CustomTextField";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { z } from "zod";
import { CustomDateField } from "@/components/CustomDateField";
import ItemsDropdown from "@/components/ui/dropdown/ItemsDropdown";
import { useAuthStore } from "@/zustand/authStore";
import CustomerRateDropdown from "@/components/ui/dropdown/CustomerRateDropdown";
import TransporRateDropdown from "@/components/ui/dropdown/TransportRateDropdown";
import GatheringDropdown from "@/components/ui/dropdown/GatheringDropdown";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemedView } from "@/components/ThemedView";
import { KeyboardView } from "@/components/KeyboardAvoidingView";
import { ThemedText } from "@/components/ThemedText";
import { ItemsSelect } from "@/components/ui/bottomSheet/ItemsSelect";
import { Pressable } from "react-native";
import SearchItemsAutocomplete from "@/components/ui/autocomplete/SearchItemsAutocomplete";

type Props = {};

const SearchSchema = z.object({
  loadDate: z.string(),
  loadTime: z.string(),
  unloadDate: z.string(),
  unloadTime: z.string(),
  itemId: z.string(),
  itemName: z.string(),
  customerRate: z.number(),
  transportRate: z.number(),
  quantity: z.number(),
  businessUserId: z.string(),
  businessUserName: z.string(),
  userId: z.string(),

  userName: z.string(),
  entityId: z.string(),
  customerId: z.string(),
  shipperId: z.string(),
  commission: z.number(),
  isKilograms: z.boolean(),
  isKilometers: z.boolean(),
  isOrigin: z.boolean(),
  isDestination: z.boolean(),
  isWeightScaleOrigin: z.boolean(),
  isWeightScaleDestination: z.boolean(),
  isPhysicalPapers: z.boolean(),
  gatheringId: z.string(),
  scaleId: z.string(),
  isScale: z.boolean(),
  cancellationReasonId: z.string(),
  showOnWeb: z.boolean(),
  businessesUnitTypes: z.array(
    z.object({
      businessId: z.string(),
      typeUnitId: z.string(),
      typeUnitName: z.string(),
    })
  ),
  businessesLoadingPoints: z.array(
    z.object({
      businessId: z.string(),
      loadingPointId: z.string(),
      order: z.number(),
      distance: z.number(),
      statusId: z.string(),
      arrivalDate: z.string(),
      loadedDate: z.string(),
      isArrival: z.boolean(),
      isLoaded: z.boolean(),
    })
  ),
  businessesUnloadingPoint: z.array(
    z.object({
      businessId: z.string(),
      unloadingPointId: z.string(),
      order: z.number(),
      distance: z.number(),
      statusId: z.string(),
      arrivalDate: z.string(),
      unloadedDate: z.string(),
      isArrival: z.boolean(),
      isUnloaded: z.boolean(),
    })
  ),
});

export interface SearchParams {
  currentFormData: string;
}

export interface ParsedForm {
  loadDate: string;
  loadTime: string;
  unloadDate: string;
  unloadTime: string;
  itemId: string;
  itemName: string;
  customerRate: number;
  transportRate: number;
  quantity: number;
  businessUserId: string;
  businessUserName: string;
  userId: string;
  userName: string;
  entityId: string;
  shipperId: string;
  commission: number;
  isKilograms: boolean;
  isKilometers: boolean;
  isOrigin: boolean;
  isDestination: boolean;
  isWeightScaleOrigin: boolean;
  isWeightScaleDestination: boolean;
  isPhysicalPapers: boolean;
  gatheringId: string;
  scaleId: string;
  isScale: boolean;
  cancellationReasonId: string;
  showOnWeb: boolean;
  businessesUnitTypes: BusinessesUnitType[];
  businessesLoadingPoints: BusinessesLoadingPoint[];
  businessesUnloadingPoint: BusinessesUnloadingPoint[];
}

export interface BusinessesUnitType {
  businessId: string;
  typeUnitId: string;
  typeUnitName: string;
}

export interface BusinessesLoadingPoint {
  businessId: string;
  loadingPointId: string;
  order: number;
  distance: number;
  statusId: string;
  arrivalDate: string;
  loadedDate: string;
  isArrival: boolean;
  isLoaded: boolean;
}

export interface BusinessesUnloadingPoint {
  businessId: string;
  unloadingPointId: string;
  order: number;
  distance: number;
  statusId: string;
  arrivalDate: string;
  unloadedDate: string;
  isArrival: boolean;
  isUnloaded: boolean;
}

const NewBusiness = (props: Props) => {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "#000" : "#fff";

  const { accessToken } = useAuthStore();

  const { currentFormData } = useLocalSearchParams<{
    currentFormData?: string;
  }>();

  // const parsedForm = currentFormData as ParsedForm;

  const parsedForm: ParsedForm | null = currentFormData
    ? JSON.parse(currentFormData)
    : null;

  const form = useForm<z.infer<typeof SearchSchema>>({
    defaultValues: {
      loadDate: parsedForm?.loadDate || "",
      loadTime: parsedForm?.loadTime || "",
      unloadDate: parsedForm?.unloadDate || "",
      unloadTime: parsedForm?.unloadTime || "",
      itemId: parsedForm?.itemId || "",
      itemName: parsedForm?.itemName || "",
      customerRate: 0, // OK
      transportRate: 0, // OK
      quantity: 0, // OK
      businessUserId: "string",
      businessUserName: "string",
      userId: "string",
      userName: "string",
      entityId: "string",
      shipperId: "string",
      commission: 0,
      isKilograms: true,
      isKilometers: true,
      isOrigin: true,
      isDestination: true,
      isWeightScaleOrigin: true,
      isWeightScaleDestination: true,
      isPhysicalPapers: true,
      gatheringId: "string",
      scaleId: "string",
      isScale: true, // OK
      cancellationReasonId: "string",
      showOnWeb: true, // OK
      businessesUnitTypes: [
        {
          businessId: "string",
          typeUnitId: "string",
          typeUnitName: "string",
        },
      ],
      businessesLoadingPoints: [
        {
          businessId: "string",
          loadingPointId: "string",
          order: 0,
          distance: 0,
          statusId: "string",
          arrivalDate: "2025-01-23T11:18:28.522Z",
          loadedDate: "2025-01-23T11:18:28.522Z",
          isArrival: true,
          isLoaded: true,
        },
      ],
      businessesUnloadingPoint: [
        {
          businessId: "string",
          unloadingPointId: "string",
          order: 0,
          distance: 0,
          statusId: "string",
          arrivalDate: "2025-01-23T11:18:28.522Z",
          unloadedDate: "2025-01-23T11:18:28.522Z",
          isArrival: true,
          isUnloaded: true,
        },
      ],
    },
  });

  const { control } = form;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                    value={value ? new Date(value) : new Date()}
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
                    value={value ? new Date(value) : new Date()}
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
                    value={value ? new Date(value) : new Date()}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={error}
                    placeholder="Selecciona una fecha"
                    inputProps={{
                      style: [styles.textInput, { color: color }],
                    }}
                    // type="time"
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
                    value={value ? new Date(value) : new Date()}
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

              <ItemsDropdown form={form} />

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
                    value={String(value)}
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
                    value={String(value)}
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
                    value={String(value)}
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
                    value={String(value)}
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

              <CustomerRateDropdown form={form} />

              <TransporRateDropdown form={form} />

              <GatheringDropdown
                form={form}
                isDisabled={!form.getValues("customerId")}
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
                      // trackColor={{ false: "#767577", true: "#81b0ff" }}
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
                      // trackColor={{ false: "#767577", true: "#81b0ff" }}
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
                  <CustomTextField
                    value={String(value)}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={error}
                    type="number"
                    placeholder="Comisión"
                    inputProps={{
                      style: [styles.textInput, { color: color }],
                    }}
                    disabled={!form.getValues("isScale")}
                  />
                )}
                name="scaleId"
              />

              <ItemsSelect
                label="Unidades"
                value={JSON.stringify(form.getValues("businessesUnitTypes"))}
                onChange={(value) =>
                  form.setValue("businessesUnitTypes", JSON.parse(value))
                }
                onBlur={() => {}}
                error={{}}
                data={[
                  { label: "Kilogramos", value: "kg" },
                  { label: "Litros", value: "lt" },
                  { label: "Metros cúbicos", value: "m3" },
                ]}
              />

              <SearchItemsAutocomplete form={form} />
            </View>
          </ScrollView>
        </ThemedView>
      </KeyboardView>
    </GestureHandlerRootView>
  );
};

export default NewBusiness;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
    backgroundColor: "#19191920",
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
});
