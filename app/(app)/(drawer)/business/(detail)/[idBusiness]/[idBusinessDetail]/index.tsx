import { fetchBusinessById } from "@/api/request/business/BusinessById";
import { fetchBusinessDetailById } from "@/api/request/business/BusinessDetailById";
import Autocomplete from "@/components/customs/CustomAutocomplete";
import { CustomDateField } from "@/components/customs/CustomDateField";
import CustomRadioButton from "@/components/customs/CustomRadioButton";
import { CustomTextField } from "@/components/customs/CustomTextField";
import { KeyboardView } from "@/components/KeyboardAvoidingView";
import BusinessDetailList from "@/components/others/BusinessDetailList";
import { ThemedLabeledView } from "@/components/ThemedLabeledView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { EditBusinessSchema } from "@/schemas/newBusiness";
import { useAuthStore } from "@/zustand/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Switch, View } from "react-native";
import { z } from "zod";

const ViewBusinessDetail = () => {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "#28282880" : "#555555";
  const { idBusiness, idBusinessDetail } = useLocalSearchParams<{
    idBusiness: string;
    idBusinessDetail: string;
  }>();
  const { decodedClaims } = useAuthStore();

  const getBusinessByIdQuery = useQuery({
    queryKey: ["getBusinessByIdQuery", idBusiness],
    queryFn: fetchBusinessById,
    enabled: !!idBusiness,
  });

  const getBusinessDetailByIdQuery = useQuery({
    queryKey: ["getBusinessDetailByIdQuery", idBusinessDetail],
    queryFn: fetchBusinessDetailById,
    enabled: !!idBusinessDetail,
  });

  // Keep track of which fields have been modified by the user
  const [modifiedFields, setModifiedFields] = React.useState<Set<string>>(
    new Set()
  );

  // errors {"shipperName": {"message": "Required", "ref": undefined, "type": "invalid_type"}, "userId": {"message": "Required", "ref": undefined, "type": "invalid_type"}, "userName": {"message": "Required", "ref": undefined, "type": "invalid_type"}}

  const form = useForm<z.infer<typeof EditBusinessSchema>>({
    defaultValues: {},
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
    if (getBusinessByIdQuery.data) {
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
  }, [getBusinessByIdQuery.data, reset]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <KeyboardView>
      <ThemedView style={{ flex: 1 }}>
        {/* <ScrollView> */}
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
            }) => (
              <Autocomplete
                disabled={true}
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
            }) => (
              <Autocomplete
                disabled={true}
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
                disabled={true}
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
                disabled={true}
                form={form}
                formField="gatheringId"
                displayField="gatheringName"
                label="Acopio"
                navigationPath="/shared/Gathering"
                error={error}
                // enableCondition="entityId"
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
                  disabled={true}
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
                  disabled={true}
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
                disabled={true}
                form={form}
                formField="scaleName"
                label="Balanza"
                navigationPath="/shared/Scales"
                // enableCondition="isScale"
              />
            )}
            name="scaleId"
          />

          <ThemedLabeledView label="Calcular por">
            <CustomRadioButton
              disabled={true}
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
              disabled={true}
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
              disabled={true}
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
              disabled={true}
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
              disabled={true}
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
                disabled={true}
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

          {getBusinessByIdQuery.data?.businessesUnitTypes &&
            getBusinessByIdQuery.data?.businessesUnitTypes.length > 0 && (
              <ThemedLabeledView label="Tipos de unidades">
                <View style={{ gap: 8 }}>
                  {getBusinessByIdQuery.data?.businessesUnitTypes.map(
                    (unitType) => (
                      <ThemedText key={unitType.id}>
                        {unitType.typeUnitName}
                      </ThemedText>
                    )
                  )}
                </View>
              </ThemedLabeledView>
            )}

          {getBusinessByIdQuery.data?.businessLoadingPoints &&
            getBusinessByIdQuery.data?.businessLoadingPoints.length > 0 && (
              <ThemedLabeledView label="Puntos de carga">
                <View style={{ gap: 8 }}>
                  {getBusinessByIdQuery.data?.businessLoadingPoints.map(
                    (loadingPoint, index) => (
                      <ThemedText
                        key={loadingPoint.id}
                        style={{ color: "#0093D1" }}
                      >
                        {index + 1} - {loadingPoint.loadingPointName}
                      </ThemedText>
                    )
                  )}
                </View>
              </ThemedLabeledView>
            )}

          {getBusinessByIdQuery.data?.businessUnloadingPoints &&
            getBusinessByIdQuery.data?.businessUnloadingPoints.length > 0 && (
              <ThemedLabeledView label="Puntos de descarga">
                <View style={{ gap: 8 }}>
                  {getBusinessByIdQuery.data?.businessUnloadingPoints.map(
                    (loadingPoint, index) => (
                      <ThemedText
                        key={loadingPoint.id}
                        style={{ color: "#9CBB3A" }}
                      >
                        {index + 1} - {loadingPoint.unloadingPointName}
                      </ThemedText>
                    )
                  )}
                </View>
              </ThemedLabeledView>
            )}

          {getBusinessDetailByIdQuery.data?.businessDetailStatusName && (
            <ThemedLabeledView label="Estado">
              <ThemedText style={{ color: color }}>
                {getBusinessDetailByIdQuery.data?.businessDetailStatusName}
              </ThemedText>
            </ThemedLabeledView>
          )}
          {getBusinessDetailByIdQuery.data?.businessDetailStatusName !==
            "ACTIVO" &&
            getBusinessDetailByIdQuery.data?.businessDetailStatusName !==
              "CANCELADO" &&
            getBusinessDetailByIdQuery.data?.businessDetailStatusName !==
              "CUBIERTO POR EL CLIENTE" && (
              <BusinessDetailList idBusinessDetail={idBusinessDetail} />
            )}

          {/* <View
            style={{
              width: "50%",

              backgroundColor: "red",
              height: 1000,
            }}
          /> */}
        </View>
        {/* </ScrollView> */}
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
    // width: "100%",
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
});
