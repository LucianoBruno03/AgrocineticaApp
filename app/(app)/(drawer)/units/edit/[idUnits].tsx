// import { fetchSearchCancellationReasons } from "@/api/request/categoriesTypes/SearchCancellationReasons";
// import { fetchSearchCategoriesTypes } from "@/api/request/categoriesTypes/SearchCategoriesTypes";
// import { fetchCategoriesTypesByName } from "@/api/request/categoriesTypes/SearchCategoriesTypesByName";
// import { fetchEditUnits } from "@/api/request/units/EditUnits";
// import { fetchUnitsById } from "@/api/request/units/UnitsById";
// import Autocomplete from "@/components/customs/CustomAutocomplete";
// import { CustomDateField } from "@/components/customs/CustomDateField";
// import CustomDropdown from "@/components/customs/CustomDropdown";
// import CustomRadioButton from "@/components/customs/CustomRadioButton";
// import { CustomTextArea } from "@/components/customs/CustomTextArea";
// import { CustomTextField } from "@/components/customs/CustomTextField";
// import { KeyboardView } from "@/components/KeyboardAvoidingView";
// import { ThemedLabeledView } from "@/components/ThemedLabeledView";
// import { ThemedText } from "@/components/ThemedText";
// import UnitsDocuments from "@/components/ui/documents/UnitsDocuments";
// import UnitsItems from "@/components/units/UnitsItems";
// import { useColorScheme } from "@/hooks/useColorScheme";
// import { EditUnitsSchema } from "@/schemas/Units";
// import { useAuthStore } from "@/zustand/authStore";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import axios, { AxiosError } from "axios";
// import { router, useLocalSearchParams } from "expo-router";
// import React, { useEffect } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { Pressable, StyleSheet, Switch, View } from "react-native";
// import Toast from "react-native-toast-message";
// import { z } from "zod";

// const Units = () => {
//   const colorScheme = useColorScheme() ?? "light";

//   // const scrollViewRef = useRef<ScrollView>(null);
//   const color = colorScheme === "light" ? "#000" : "#fff";
//   const { idUnits } = useLocalSearchParams<{
//     idUnits: string;
//   }>();
//   const { decodedClaims } = useAuthStore();
//   const { currentFormData } = useLocalSearchParams<{
//     currentFormData?: string;
//   }>();

//   const queryClient = useQueryClient();

//   const parsedForm = currentFormData ? JSON.parse(currentFormData) : null;

//   const getUnitsByIdQuery = useQuery({
//     queryKey: ["getUnitsByIdQuery", idUnits],
//     queryFn: fetchUnitsById,
//     enabled: !!idUnits,
//   });

//   // Realizar un seguimiento de qué campos han sido modificados por el usuario
//   const [modifiedFields, setModifiedFields] = React.useState<Set<string>>(
//     new Set()
//   );

//   const form = useForm<z.infer<typeof EditUnitsSchema>>({
//     defaultValues: {
//       id: parsedForm?.id ?? idUnits,

//       loadingOrderId: parsedForm?.loadingOrderId || "",
//       loadingOrderIncrementId: parsedForm?.loadingOrderIncrementId || "",
//       issuingDate: parsedForm?.issuingDate || "",
//       expirationDate: parsedForm?.expirationDate || "",
//       userId:
//         parsedForm?.userId ??
//         decodedClaims?.[
//           "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
//         ] ??
//         "",
//       userName: decodedClaims!.fullName || "" || "",
//       cancellationReasonId: parsedForm?.cancellationReasonId || "",
//       remittanceNumber: parsedForm?.remittanceNumber || "",
//       completedDate: parsedForm?.completedDate || "",
//       entityId: parsedForm?.entityId || "",
//       entityName: parsedForm?.entityName || "",
//       serviceStationId: parsedForm?.serviceStationId || "",
//       serviceStationName: parsedForm?.serviceStationName || "",
//       paymentMethodId: parsedForm?.paymentMethodId || "",
//       royalLiters: parsedForm?.royalLiters || undefined,
//       advance: parsedForm?.advance || undefined,
//       total: parsedForm?.total || undefined,
//       observation: parsedForm?.observation || "",
//       compliantDocumentation: parsedForm?.compliantDocumentation || false,
//       documentationObservation: parsedForm?.documentationObservation || "",

//       //
//       unitstatusId: parsedForm?.unitstatusId || "",
//       unitstatusName: parsedForm?.unitstatusName || "",
//       loadingOrderEntityId: parsedForm?.loadingOrderEntityId || "",
//       sendEmail: parsedForm?.sendEmail || false,
//     },
//     resolver: zodResolver(EditUnitsSchema),
//   });

//   const { reset, watch } = form;

//   // Esté atento a los cambios en los valores del formulario

//   useEffect(() => {
//     const subscription = watch((value, { name, type }) => {
//       if (name && type === "change") {
//         setModifiedFields((prev) => new Set([...prev, name]));
//       }
//     });
//     return () => subscription.unsubscribe();
//   }, [watch]);

//   useEffect(() => {
//     if (getUnitsByIdQuery.data && !parsedForm) {
//       // Solo establezca valores iniciales de la consulta si no hay datos de formulario analizados
//       const queryData = getUnitsByIdQuery.data;
//       reset({
//         id: queryData.id ?? idUnits,
//         loadingOrderId: queryData.loadingOrderId ?? "",
//         loadingOrderIncrementId: queryData.loadingOrderIncrementId ?? "",
//         issuingDate: queryData.issuingDate ?? "",
//         expirationDate: queryData.expirationDate ?? "",
//         userId: queryData.userId ?? "",
//         userName: queryData.userName ?? "",
//         cancellationReasonId: queryData.cancellationReasonId ?? "",
//         remittanceNumber: queryData.remittanceNumber ?? "",
//         completedDate: queryData.completedDate ?? "",
//         entityId: queryData.entityId ?? "",
//         // entityName: queryData.entityName ?? "",
//         serviceStationId: queryData.serviceStationId ?? "",
//         // serviceStationName: queryData.serviceStationName ?? "",
//         paymentMethodId: queryData.paymentMethodId ?? "",
//         royalLiters: queryData.royalLiters ?? undefined,
//         advance: queryData.advance ?? undefined,
//         total: queryData.total ?? undefined,
//         observation: queryData.observation ?? "",
//         compliantDocumentation: queryData.compliantDocumentation ?? false,
//         documentationObservation: queryData.documentationObservation ?? "",
//         unitstatusId: queryData.unitstatusId ?? "",
//         unitstatusName: queryData.unitstatusName ?? "",
//         loadingOrderEntityId: queryData.loadingOrderEntityId ?? "",
//         // sendEmail: queryData.sendEmail ?? false,
//       });
//     }
//   }, [getUnitsByIdQuery.data, parsedForm, reset]);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = form;

//   const unitsMutation = useMutation({
//     mutationFn: fetchEditUnits,
//     onSuccess: async () => {
//       Toast.show({
//         type: "success",
//         text1: "Éxito",
//         text2: "Orden de compra editada correctamente",
//       });

//       queryClient.refetchQueries({
//         queryKey: ["getUnitsListQuery"],
//       });
//       router.replace("/units");
//     },
//     onError: (error: Error | AxiosError) => {
//       if (axios.isAxiosError(error)) {
//         if (error.response?.status === 401) {
//           Toast.show({
//             type: "error",
//             text1: "Error",
//             text2: "Usuario o contraseña incorrectos",
//           });
//           return;
//         }

//         if (error.response?.status === 403) {
//           Toast.show({
//             type: "error",
//             text1: "Error",
//             text2: error.response?.data.message || "Acceso denegado (403)",
//           });
//           return;
//         }

//         if (error.response?.status === 400) {
//           Toast.show({
//             type: "error",
//             text1: "Error",
//             text2:
//               error.response?.data.messages || "Hubo un error inesperado (400)",
//           });
//           return;
//         }

//         if (error.response?.status === 404) {
//           Toast.show({
//             type: "error",
//             text1: "Error",
//             text2: `${
//               error.response?.data.exception || "Hubo un error inesperado (404)"
//             }`,
//           });
//           return;
//         }

//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: "Hubo un error inesperado",
//         });
//       }
//     },
//   });

//   const onSubmit = (data: z.infer<typeof EditUnitsSchema>) => {
//     const fieldsToCheck = [
//       "RemittanceNumber",
//       "expirationDate",
//       "cancellationReasonId",
//       "completedDate",
//       "serviceStationId",
//       "paymentMethodId",
//     ];

//     Object.keys(data).forEach((key) => {
//       if (
//         fieldsToCheck.includes(key) &&
//         ((data as any)[key] === "" || (data as any)[key] === null)
//       ) {
//         delete (data as any)[key];
//       }
//     });

//     unitsMutation.mutateAsync({ data, id: idUnits });
//   };

//   // Mapeo personalizado para incluir el nombre en el objeto de datos
//   const dataMapper = (item: any) => ({
//     label: item.name,
//     value: item.id,
//     name: item.name, // Guardamos el nombre para usarlo en onChange
//   });

//   const { data: Unitstates } = useQuery({
//     queryKey: ["getStatusChangeStateUnits", "", "ESTADOS ORDEN DE COMPRA"],
//     queryFn: () =>
//       fetchSearchCategoriesTypes({
//         queryKey: [
//           "getStatusChangeStateUnits",
//           "",
//           "ESTADOS ORDEN DE COMPRA",
//           [],
//         ],
//       }),
//   });

//   const { data: CategoryTypeCancelationReasons } = useQuery({
//     queryKey: [
//       "getCategoriesTypesByNameCancelationReasons",
//       "Tipos de cancelacion",
//       "ORDEN DE COMPRA",
//     ],
//     queryFn: () =>
//       fetchCategoriesTypesByName({
//         queryKey: [
//           "getCategoriesTypesByNameCancelationReasons",
//           "Tipos de cancelacion",
//           "ORDEN DE COMPRA",
//         ],
//       }),
//   });

//   const { data: UnitsCancellationReasons } = useQuery({
//     queryKey: [
//       "getCancellationReasonsUnits",
//       CategoryTypeCancelationReasons?.id,
//     ],
//     queryFn: () =>
//       fetchSearchCancellationReasons({
//         queryKey: [
//           "getCancellationReasonsUnits",
//           CategoryTypeCancelationReasons?.id,
//         ],
//       }),
//     enabled: !!CategoryTypeCancelationReasons?.id,
//   });

//   // const mutationAddDocument = useMutation({
//   //   mutationFn: fetchAddUnitsFile,
//   //   onSuccess: async (data) => {
//   //     try {
//   //       Toast.show({
//   //         type: "success",
//   //         text1: "Éxito",
//   //         text2: "El archivo del CTG se guardó correctamente",
//   //         position: "bottom",
//   //       });
//   //       queryClient.refetchQueries({
//   //         queryKey: ["getUnitsFilesListQuery"],
//   //       });
//   //     } catch (error) {
//   //       Toast.show({
//   //         type: "error",
//   //         text1: "Error",
//   //         text2: "Error al guardar los datos de negocio",
//   //       });
//   //     }
//   //   },
//   //   onError: (error: Error | AxiosError) => {
//   //     if (axios.isAxiosError(error)) {
//   //       if (error.response?.status === 401) {
//   //         Toast.show({
//   //           type: "error",
//   //           text1: "Error",
//   //           text2: "Usuario o contraseña incorrectos",
//   //         });
//   //         return;
//   //       }

//   //       if (error.response?.status === 403) {
//   //         Toast.show({
//   //           type: "error",
//   //           text1: "Error",
//   //           text2: error.response?.data.message || "Acceso denegado",
//   //         });
//   //         return;
//   //       }

//   //       if (error.response?.status === 400) {
//   //         Toast.show({
//   //           type: "error",
//   //           text1: "Error",
//   //           text2: error.response?.data.message || "Hubo un error inesperado",
//   //         });
//   //         return;
//   //       }

//   //       if (error.response?.status === 404) {
//   //         Toast.show({
//   //           type: "error",
//   //           text1: "Error",
//   //           text2: `${
//   //             error.response?.data.exception || "Hubo un error inesperado"
//   //           }`,
//   //         });
//   //         return;
//   //       }

//   //       Toast.show({
//   //         type: "error",
//   //         text1: "Error",
//   //         text2: "Hubo un error inesperado",
//   //       });
//   //     }
//   //   },
//   // });

//   const { data: TypeOfPayment } = useQuery({
//     queryKey: ["getStatusChangeStateUnits", "", "TIPO DE COBRO"],
//     queryFn: () =>
//       fetchSearchCategoriesTypes({
//         queryKey: ["getTypeOfPayment", "", "TIPO DE COBRO", []],
//       }),
//   });

//   return (
//     <KeyboardView>
//       <View style={{ flex: 1 }}>
//         <View style={styles.formContainer}>
//           <Controller
//             control={control}
//             rules={{
//               required: true,
//             }}
//             render={({
//               field: { onChange, onBlur, value },
//               fieldState: { error },
//             }) => (
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   gap: 8,
//                 }}
//               >
//                 <Switch
//                   value={value}
//                   onValueChange={onChange}
//                   // onBlur={onBlur}
//                   // thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
//                   trackColor={{ false: "#767577", true: "#0093D1" }}
//                 />
//                 <ThemedText style={{ color: color }}>
//                   ¿Deseas enviar un correo electrónico?
//                 </ThemedText>
//               </View>
//             )}
//             name="sendEmail"
//           />

//           <CustomDropdown
//             form={form}
//             label="Estado"
//             fieldName="unitstatusId"
//             value={form.getValues("unitstatusId")}
//             items={Unitstates?.data?.map((item) => ({
//               label: item.name,
//               value: item.id,
//             }))}
//             disabled={false}
//             searchEnabled={true}
//             error={errors.unitstatusId}
//             dataMapper={dataMapper}
//             onChange={(value) => {
//               const selected = Unitstates?.data?.find(
//                 (item) => item.id === value
//               );
//               if (selected) {
//                 form.setValue("unitstatusName", selected.name);
//               }
//             }}
//           />
//           <CustomDropdown
//             form={form}
//             label="Motivo de cancelación"
//             fieldName="cancellationReasonId"
//             value={form.getValues("cancellationReasonId") ?? undefined}
//             items={UnitsCancellationReasons?.data?.map((item) => ({
//               label: item.description,
//               value: item.id,
//             }))}
//             disabled={form.watch("unitstatusName") !== "CANCELADO"}
//             searchEnabled={true}
//             error={errors.unitstatusId}
//             dataMapper={dataMapper}
//             onChange={(value) => {
//               const selected = UnitsCancellationReasons?.data?.find(
//                 (item) => item.id === value
//               );
//               if (selected) {
//                 form.setValue("cancellationReasonId", selected.id);
//               }
//             }}
//           />

//           <Controller
//             control={control}
//             rules={{
//               required: true,
//             }}
//             render={({
//               field: { onChange, onBlur, value },
//               fieldState: { error },
//             }) => (
//               <Autocomplete
//                 form={form}
//                 formField="loadingOrderId"
//                 displayField="loadingOrderIncrementId"
//                 label="Orden de carga"
//                 navigationPath="/shared/LoadingOrders"
//                 error={error}
//               />
//             )}
//             name="loadingOrderId"
//           />

//           <Controller
//             control={control}
//             rules={{
//               required: true,
//             }}
//             render={({
//               field: { onChange, onBlur, value },
//               fieldState: { error },
//             }) => (
//               <Autocomplete
//                 form={form}
//                 formField="entityId"
//                 displayField="entityName"
//                 label="Proveedores"
//                 navigationPath="/shared/Supplier"
//                 error={error}
//                 keysToClear={["serviceStationId", "serviceStationName"]}
//               />
//             )}
//             name="entityId"
//           />

//           <Controller
//             control={control}
//             rules={{
//               required: true,
//             }}
//             render={({
//               field: { onChange, onBlur, value },
//               fieldState: { error },
//             }) => (
//               <Autocomplete
//                 form={form}
//                 formField="serviceStationId"
//                 displayField="serviceStationName"
//                 label="Estaciones de servicio"
//                 navigationPath="/shared/ServiceStations"
//                 error={error}
//                 enableCondition={"entityId"}
//               />
//             )}
//             name="serviceStationId"
//           />

//           <Controller
//             control={control}
//             rules={{
//               required: true,
//             }}
//             render={({
//               field: { onChange, onBlur, value },
//               fieldState: { error },
//             }) => (
//               <CustomDateField
//                 label="Fecha de emisión"
//                 value={value ? value : undefined}
//                 onBlur={onBlur}
//                 onChange={onChange}
//                 error={error}
//                 placeholder="Selecciona una fecha"
//                 inputProps={{
//                   style: [styles.textInput, { color: color }],
//                 }}
//               />
//             )}
//             name="issuingDate"
//           />

//           <Controller
//             control={control}
//             rules={{
//               required: true,
//             }}
//             render={({
//               field: { onChange, onBlur, value },
//               fieldState: { error },
//             }) => (
//               <CustomDateField
//                 disabled={true}
//                 label="Fecha de finalización"
//                 value={value ? value : undefined}
//                 onBlur={onBlur}
//                 onChange={onChange}
//                 error={error}
//                 placeholder="Selecciona una fecha"
//                 inputProps={{
//                   style: [styles.textInput, { color: color }],
//                 }}
//               />
//             )}
//             name="completedDate"
//           />

//           <View style={{ flexDirection: "column", gap: 2, width: "100%" }}>
//             <Controller
//               control={control}
//               rules={{
//                 required: true,
//               }}
//               render={({
//                 field: { onChange, onBlur, value },
//                 fieldState: { error },
//               }) => {
//                 // Format the input as "R-XXXX-XXXXXXXX" without adding zeros
//                 const formatRemittanceNumber = (text: string): string => {
//                   // Remove any non-numeric characters
//                   const numericValue = text.replace(/[^0-9]/g, "");

//                   // Don't format if empty
//                   if (!numericValue) return "";

//                   // Start with R- prefix
//                   let formattedValue = "R-";

//                   // Add first part (up to 4 digits)
//                   if (numericValue.length <= 4) {
//                     formattedValue += numericValue;
//                   } else {
//                     // Add first 4 digits
//                     formattedValue += numericValue.substring(0, 4);

//                     // Add hyphen and the remaining digits (if any)
//                     formattedValue += "-" + numericValue.substring(4, 12);
//                   }

//                   return formattedValue;
//                 };

//                 // Handle text change with formatting
//                 const handleTextChange = (text: string): void => {
//                   // Extract only the numbers
//                   const numericValue = text.replace(/[^0-9]/g, "");
//                   const formattedValue = formatRemittanceNumber(numericValue);

//                   // Save only the numeric part (003900016547)
//                   onChange(numericValue);

//                   // Display the formatted value (R-0039-00016547)
//                   // This is handled by the value prop below
//                 };

//                 // Get the formatted value for display
//                 const displayValue = value
//                   ? formatRemittanceNumber(value)
//                   : "R-";

//                 return (
//                   <CustomTextField
//                     value={displayValue} // Show formatted value
//                     onBlur={onBlur}
//                     onChangeText={handleTextChange}
//                     error={error}
//                     type="text"
//                     placeholder="Remito Nro"
//                     inputProps={{
//                       style: [styles.textInput, { color: color }],
//                       maxLength: 15, // Maximum length of "R-XXXX-XXXXXXXX"
//                       keyboardType: "numeric",
//                     }}
//                   />
//                 );
//               }}
//               name="remittanceNumber"
//             />
//             <ThemedText
//               style={{
//                 color: color,
//                 marginLeft: 16,
//                 opacity: 0.5,
//                 fontSize: 12,
//               }}
//             >
//               R-0000-00000000
//             </ThemedText>
//           </View>

//           <Controller
//             control={control}
//             rules={{
//               required: true,
//             }}
//             render={({
//               field: { onChange, onBlur, value },
//               fieldState: { error },
//             }) => (
//               <CustomDropdown
//                 form={form}
//                 label="Tipos de cobro"
//                 fieldName="paymentMethodId"
//                 value={value ? value : ""}
//                 items={TypeOfPayment?.data?.map((item) => ({
//                   label: item.name,
//                   value: item.id,
//                 }))}
//                 disabled={false}
//                 searchEnabled={true}
//                 error={errors.paymentMethodId}
//                 dataMapper={dataMapper}
//                 onChange={(value) => {
//                   const selected = TypeOfPayment?.data?.find(
//                     (item) => item.id === value
//                   );
//                   if (selected) {
//                     form.setValue("paymentMethodId", selected.id);
//                   }
//                   onChange(value); // Ensure onChange is called
//                 }}
//               />
//             )}
//             name="paymentMethodId"
//           />

//           <Controller
//             control={control}
//             rules={{
//               required: true,
//             }}
//             render={({
//               field: { onChange, onBlur, value },
//               fieldState: { error },
//             }) => (
//               <CustomTextArea
//                 label="Observaciones"
//                 value={value ? value : ""}
//                 onBlur={onBlur}
//                 onChangeText={onChange}
//                 error={error}
//                 numberOfLines={6}
//                 minHeight={150}
//                 inputProps={{
//                   style: [styles.textInput, { color: color }],
//                 }}
//               />
//             )}
//             name="observation"
//           />

//           <Controller
//             control={control}
//             rules={{
//               required: true,
//             }}
//             render={({
//               field: { onChange, onBlur, value },
//               fieldState: { error },
//             }) => (
//               <CustomTextField
//                 value={value ? value : ""}
//                 onBlur={onBlur}
//                 onChangeText={onChange}
//                 error={error}
//                 type="number"
//                 placeholder="Litros reales"
//                 inputProps={{
//                   style: [styles.textInput, { color: color }],
//                 }}
//               />
//             )}
//             name="royalLiters"
//           />

//           <Controller
//             control={control}
//             rules={{
//               required: true,
//             }}
//             render={({
//               field: { onChange, onBlur, value },
//               fieldState: { error },
//             }) => (
//               <CustomTextField
//                 value={value ? value : ""}
//                 onBlur={onBlur}
//                 onChangeText={onChange}
//                 error={error}
//                 type="number"
//                 placeholder="Adelanto"
//                 inputProps={{
//                   style: [styles.textInput, { color: color }],
//                 }}
//               />
//             )}
//             name="advance"
//           />

//           <Controller
//             control={control}
//             rules={{
//               required: true,
//             }}
//             render={({
//               field: { onChange, onBlur, value },
//               fieldState: { error },
//             }) => (
//               <CustomTextField
//                 value={value ? value : ""}
//                 onBlur={onBlur}
//                 onChangeText={onChange}
//                 error={error}
//                 type="number"
//                 placeholder="Total"
//                 inputProps={{
//                   style: [styles.textInput, { color: color }],
//                 }}
//               />
//             )}
//             name="total"
//           />

//           <CustomTextField
//             value={getUnitsByIdQuery.data?.loadingOrderEntityBusinessName}
//             onBlur={() => {}}
//             onChangeText={(text: string) => {}}
//             disabled={true}
//             // error={error}
//             placeholder="Razón social transporte"
//             inputProps={{
//               style: [styles.textInput, { color: color }],
//             }}
//           />

//           <CustomTextField
//             value={getUnitsByIdQuery.data?.loadingOrderDriverName}
//             onBlur={() => {}}
//             onChangeText={(text: string) => {}}
//             disabled={true}
//             // error={error}
//             placeholder="Chofer"
//             inputProps={{
//               style: [styles.textInput, { color: color }],
//             }}
//           />

//           <CustomTextField
//             value={getUnitsByIdQuery.data?.loadingOrderChassisName}
//             onBlur={() => {}}
//             onChangeText={(text: string) => {}}
//             disabled={true}
//             // error={error}
//             placeholder="Chasis"
//             inputProps={{
//               style: [styles.textInput, { color: color }],
//             }}
//           />

//           <UnitsItems idUnits={idUnits} />

//           <View style={styles.containerSubtitle}>
//             <ThemedText style={styles.subtitle}>Documentación</ThemedText>
//             <View style={styles.separator}></View>
//           </View>

//           <UnitsDocuments idUnits={idUnits} />

//           <ThemedLabeledView label="Documentación conforme">
//             <CustomRadioButton
//               options={[
//                 { value: "true", label: "Si" },
//                 { value: "false", label: "No" },
//               ]}
//               selectedValue={
//                 form.watch("compliantDocumentation") ? "true" : "false"
//               }
//               onSelect={(value) => {
//                 if (value === "true") {
//                   form.setValue("compliantDocumentation", true);
//                 } else {
//                   form.setValue("compliantDocumentation", false);
//                 }
//               }}
//               selectedButtonStyle={{ backgroundColor: "transparent" }}
//               selectedTextStyle={{ color: "#0093D1" }}
//             />
//           </ThemedLabeledView>

//           <Controller
//             control={control}
//             rules={{
//               required: true,
//             }}
//             render={({
//               field: { onChange, onBlur, value },
//               fieldState: { error },
//             }) => (
//               <CustomTextArea
//                 label="Observaciones de la documentación"
//                 value={value ? value : ""}
//                 onBlur={onBlur}
//                 onChangeText={onChange}
//                 error={error}
//                 numberOfLines={6}
//                 minHeight={150}
//                 inputProps={{
//                   style: [styles.textInput, { color: color }],
//                 }}
//               />
//             )}
//             name="documentationObservation"
//           />

//           <Pressable
//             style={[
//               styles.SubmitButton,
//               unitsMutation.isPending && { opacity: 0.7 },
//             ]}
//             onPress={handleSubmit(onSubmit)}
//             disabled={unitsMutation.isPending}
//           >
//             <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>
//               Guardar
//             </ThemedText>
//           </Pressable>
//         </View>
//       </View>
//     </KeyboardView>
//   );
// };

// export default Units;

// const styles = StyleSheet.create({
//   formContainer: {
//     flex: 1,
//     justifyContent: "flex-start",
//     alignItems: "flex-start",
//     padding: 20,
//     width: "100%",
//     gap: 16,
//   },
//   textInput: {
//     padding: 10,
//     paddingStart: 20,
//     height: 48,
//     borderRadius: 10,
//   },
//   SubmitButton: {
//     width: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 16,
//     backgroundColor: "#0093D1",
//     padding: 12,
//     borderRadius: 12,
//   },

//   separator: {
//     height: 2,
//     width: "100%",
//     backgroundColor: "#ABCA48",
//   },
//   containerSubtitle: {
//     flexDirection: "column",
//     gap: 2,
//     width: "100%",
//   },
//   subtitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     paddingBlock: 4,
//   },

//   actionButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 8,
//   },
//   actionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//     flex: 1,
//   },
//   addButton: {
//     backgroundColor: "#ABCA48",
//   },
//   actionButtonText: {
//     color: "white",
//     marginLeft: 5,
//     fontWeight: "bold",
//   },
//   newButton: {
//     right: 14,
//     backgroundColor: "#ABCA48",
//     borderRadius: 100,
//     width: 40,
//     height: 40,
//     justifyContent: "center",
//     alignItems: "center",
//     fontWeight: "bold",
//     zIndex: 100,
//   },
//   textButton: {
//     fontSize: 40,
//     color: "white",
//     fontWeight: "bold",
//     lineHeight: 40,
//     alignItems: "center",
//     justifyContent: "center",
//     margin: 0,
//     padding: 0,
//     textAlign: "center",
//     width: 40,
//     height: 40,
//     borderRadius: 100,
//   },
//   itemsTitle: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//     paddingVertical: 8,
//   },
// });
