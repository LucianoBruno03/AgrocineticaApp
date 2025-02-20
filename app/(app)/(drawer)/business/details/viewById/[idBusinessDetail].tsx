import { fetchBusinessById } from "@/api/request/business/BusinessById";
import { fetchEditBusiness } from "@/api/request/business/EditBusiness";
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
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { EditBusinessSchema } from "@/schemas/newBusiness";
import { useAuthStore } from "@/zustand/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

const ViewBusinessDetail = () => {
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
      // shipperName: parsedForm?.shipperName ?? "", // Este campo no existe en el tipo original
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
        id: queryData.id,
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

        shipperName: queryData.shipperName ?? "",
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
    onError: (error: any) => {
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

  const onSubmit = (data: z.infer<typeof EditBusinessSchema>) => {
    console.log("data", data);
    // los datos que sean "" o null, los eliminamos
    Object.keys(data).forEach((key) => {
      if ((data as any)[key] === "" || (data as any)[key] === null) {
        delete (data as any)[key];
      }
    });

    editBusinessMutation.mutateAsync({ data, id: idBusiness });
  };

  console.log("errors", errors);
  console.log("formValues", formValues);

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
                  disabled={true}
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
                  disabled={true}
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
                  disabled={true}
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
                  disabled={true}
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
              }) => <ItemsAutocomplete form={form} error={error} />}
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
                  disabled={true}
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
                  disabled={true}
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
                  disabled={true}
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
                  disabled={true}
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
              }) => <BusinessCustomerAutoComplete form={form} error={error} />}
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
              }) => <CustomerAutoComplete form={form} error={error} />}
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
              }) => <GatheringAutoComplete form={form} error={error} />}
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

            {/* <UnitTypesList form={form} /> */}

            {/* <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => <LoadingPointsList form={form} error={error} />}
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
              }) => <UnloadingPointsList form={form} error={error} />}
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
        </ScrollView>
      </ThemedView>
    </KeyboardView>
  );
};

export default ViewBusinessDetail;

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
