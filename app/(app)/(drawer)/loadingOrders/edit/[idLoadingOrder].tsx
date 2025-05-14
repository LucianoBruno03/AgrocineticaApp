import { fetchSearchCTGQuery } from "@/api/request/arca/SearchCTG";
import { fetchBusinessById } from "@/api/request/business/BusinessById";
import { fetchBusinessDetailById } from "@/api/request/business/BusinessDetailById";
import { fetchSearchCancellationReasons } from "@/api/request/categoriesTypes/SearchCancellationReasons";
import { fetchSearchCategoriesTypes } from "@/api/request/categoriesTypes/SearchCategoriesTypes";
import { fetchCategoriesTypesByName } from "@/api/request/categoriesTypes/SearchCategoriesTypesByName";
import { fetchAddLoadingOrderFile } from "@/api/request/loadingOrders/AddLoadingOrderFile";
import { fetchEditLoadingOrders } from "@/api/request/loadingOrders/EditLoadingOrders";
import { fetchLoadingOrderById } from "@/api/request/loadingOrders/LoadingOrderById";
import Autocomplete from "@/components/customs/CustomAutocomplete";
import { CustomDateField } from "@/components/customs/CustomDateField";
import CustomDropdown from "@/components/customs/CustomDropdown";
import CustomRadioButton from "@/components/customs/CustomRadioButton";
import { CustomTextArea } from "@/components/customs/CustomTextArea";
import { CustomTextField } from "@/components/customs/CustomTextField";
import PDFModalButton from "@/components/customs/PDFModalButton";
import { KeyboardView } from "@/components/KeyboardAvoidingView";
import { ThemedLabeledView } from "@/components/ThemedLabeledView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import LoadingOrderDocuments from "@/components/ui/documents/LoadingOrderDocuments";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { EditLoadingOrdersSchema } from "@/schemas/LoadingOrders";
import { useAuthStore } from "@/zustand/authStore";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

const LoadingOrder = () => {
  const colorScheme = useColorScheme() ?? "light";
  const [pdfValue, setPdfValue] = React.useState<string | null>(null);

  // const scrollViewRef = useRef<ScrollView>(null);
  const color = colorScheme === "light" ? "#000" : "#fff";
  const { idLoadingOrder } = useLocalSearchParams<{ idLoadingOrder: string }>();
  const { decodedClaims } = useAuthStore();
  const { currentFormData } = useLocalSearchParams<{
    currentFormData?: string;
  }>();

  const queryClient = useQueryClient();

  const parsedForm = currentFormData ? JSON.parse(currentFormData) : null;

  const getLoadingOrderByIdQuery = useQuery({
    queryKey: ["getLoadingOrderByIdQuery", idLoadingOrder],
    queryFn: fetchLoadingOrderById,
    enabled: !!idLoadingOrder,
  });

  // Realizar un seguimiento de qué campos han sido modificados por el usuario
  const [modifiedFields, setModifiedFields] = React.useState<Set<string>>(
    new Set()
  );

  const form = useForm<z.infer<typeof EditLoadingOrdersSchema>>({
    defaultValues: {
      id: parsedForm?.id ?? idLoadingOrder,
      businessDetailId: parsedForm?.businessDetailId ?? "",
      destinationQuantity: parsedForm?.destinationQuantity ?? 0,
      issuingDate: parsedForm?.issuingDate ?? "",
      loadDate: parsedForm?.loadDate ?? "",
      journeyStart: parsedForm?.journeyStart ?? "",
      timeDifference: parsedForm?.timeDifference ?? "",
      capacity: parsedForm?.capacity ?? 0,
      kgsUnloaded: parsedForm?.kgsUnloaded ?? 0,
      kgsDifference: parsedForm?.kgsDifference ?? 0,
      customerTolerance: parsedForm?.customerTolerance ?? 0,
      businessDetailBusinessEntityId:
        parsedForm?.businessDetailBusinessEntityId ?? "",
      kmTraveled: parsedForm?.kmTraveled ?? 0,
      ctgNumber: parsedForm?.ctgNumber ?? "",
      remittanceNumber: parsedForm?.remittanceNumber ?? "",
      userId:
        parsedForm?.userId ??
        decodedClaims?.[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ??
        "",
      userName: parsedForm?.userName ?? decodedClaims?.fullName ?? "",
      loadingOrderStatusId: parsedForm?.loadingOrderStatusId ?? "",
      loadingOrderStatusName: parsedForm?.loadingOrderStatusName ?? "",
      cancellationReasonId: parsedForm?.cancellationReasonId ?? "",
      billOfLading: parsedForm?.billOfLading ?? "",
      observation: parsedForm?.observation ?? "",
      arrivalDate: parsedForm?.arrivalDate ?? "",
      unloadedDate: parsedForm?.unloadedDate ?? "",
      completedDate: parsedForm?.completedDate ?? "",
      entityId: parsedForm?.entityId ?? "",
      transportUserId: parsedForm?.transportUserId ?? "",
      transportUserName: parsedForm?.transportUserName ?? "",
      isCompliantDocumentation: parsedForm?.isCompliantDocumentation ?? false,
      systemDocumentationDate: parsedForm?.systemDocumentationDate ?? "",
      userDocumentationDate: parsedForm?.userDocumentationDate ?? "",
      distance: parsedForm?.distance ?? 0,
      isRemainingCapacity: parsedForm?.isRemainingCapacity ?? false,
      kilograms: parsedForm?.kilograms ?? 0,
      scalableId: parsedForm?.scalableId ?? "",
      scalableName: parsedForm?.scalableName ?? "", // Este campo no existe en el tipo original
      documentationObservation: parsedForm?.documentationObservation ?? "",
      chassisId: parsedForm?.chassisId ?? "",
      chassisName: parsedForm?.chassisName ?? "",
      trailerId: parsedForm?.trailerId ?? "",
      trailerName: parsedForm?.trailerName ?? "",
      driverId: parsedForm?.driverId ?? "",
      driverName: parsedForm?.driverName ?? "",
      isItInvoiced: parsedForm?.isItInvoiced ?? false,
      isItSettled: parsedForm?.isItSettled ?? false,

      // campos agregados
      // transportUserId: "",
      // transportUserName: "",
      // businessUserId: "",
      // businessUserName: "",
    },
    resolver: zodResolver(EditLoadingOrdersSchema),
  });

  const { reset, watch } = form;

  // Esté atento a los cambios en los valores del formulario
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
    if (getLoadingOrderByIdQuery.data && !parsedForm) {
      // Solo establezca valores iniciales de la consulta si no hay datos de formulario analizados
      const queryData = getLoadingOrderByIdQuery.data;
      reset({
        id: queryData.id ?? idLoadingOrder,
        businessDetailId: queryData.businessDetailId ?? "",
        destinationQuantity: queryData.destinationQuantity ?? 0,
        issuingDate: queryData.issuingDate ?? "",
        loadDate: queryData.loadDate ?? "",
        journeyStart: queryData.journeyStart ?? "",
        timeDifference: queryData.timeDifference ?? "",
        capacity: queryData.capacity ?? 0,
        kgsUnloaded: queryData.kgsUnloaded ?? 0,
        kgsDifference: queryData.kgsDifference ?? 0,
        customerTolerance: queryData.customerTolerance ?? 0,
        businessDetailBusinessEntityId:
          queryData.businessDetailBusinessEntityId ?? "",
        kmTraveled: queryData.kmTraveled ?? 0,
        ctgNumber: queryData.ctgNumber ?? "",
        remittanceNumber: queryData.remittanceNumber ?? "",
        userId:
          queryData.userId ??
          decodedClaims?.[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] ??
          "",
        userName: queryData.userName ?? decodedClaims?.fullName ?? "",
        loadingOrderStatusId: queryData.loadingOrderStatusId ?? "",
        loadingOrderStatusName: queryData.loadingOrderStatusName ?? "",
        cancellationReasonId: queryData.cancellationReasonId ?? null,
        billOfLading: queryData.billOfLading ?? "",
        observation: queryData.observation ?? "",
        arrivalDate: queryData.arrivalDate ?? "",
        unloadedDate: queryData.unloadedDate ?? "",
        completedDate: queryData.completedDate ?? "",
        entityId: queryData.entityId ?? "",
        transportUserId: queryData.transportUserId ?? "",
        transportUserName: queryData.transportUserName ?? "",
        isCompliantDocumentation: queryData.isCompliantDocumentation ?? false,
        systemDocumentationDate: queryData.systemDocumentationDate ?? "",
        userDocumentationDate: queryData.userDocumentationDate ?? "",
        distance: queryData.distance ?? 0,
        isRemainingCapacity: queryData.isRemainingCapacity ?? false,
        kilograms: queryData.kilograms ?? 0,
        scalableId: queryData.scalableId ?? "",
        documentationObservation: queryData.documentationObservation ?? "",
        chassisId: queryData.chassisId ?? "",
        chassisName: queryData.chassisName ?? "",
        trailerId: queryData.trailerId ?? "",
        trailerName: queryData.trailerName ?? "",
        driverId: queryData.driverId ?? "",
        driverName: queryData.driverName ?? "",
        isItInvoiced: queryData.isItInvoiced ?? false,
        isItSettled: queryData.isItSettled ?? false,
      });
    }
  }, [getLoadingOrderByIdQuery.data, parsedForm, reset]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const loadingOrderMutation = useMutation({
    mutationFn: fetchEditLoadingOrders,
    onSuccess: async () => {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Orden de carga editada correctamente",
      });

      queryClient.refetchQueries({
        queryKey: ["getLoadingOrdersListQuery"],
      });
      router.replace("/loadingOrders");
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
            text2: error.response?.data.message || "Acceso denegado (403)",
          });
          return;
        }

        if (error.response?.status === 400) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2:
              error.response?.data.messages || "Hubo un error inesperado (400)",
          });
          return;
        }

        if (error.response?.status === 404) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: `${
              error.response?.data.exception || "Hubo un error inesperado (404)"
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

  const onSubmit = (data: z.infer<typeof EditLoadingOrdersSchema>) => {
    // Verificar que los campos estan vacios para luego eliminarlos del objeto
    const fieldsToCheck = [
      "journeyStart",
      "arrivalDate",
      "unloadedDate",
      "completedDate",
      "issuingDate",
      "loadDate",
      "systemDocumentationDate",
      "userDocumentationDate",
      "cancellationReasonId",
      "timeDifference",
    ];

    // los datos que sean "" o null, los eliminamos
    Object.keys(data).forEach((key) => {
      // if ((data as any)[key] === "" || (data as any)[key] === null) {
      //   delete (data as any)[key];
      // }
      if (
        fieldsToCheck.includes(key) &&
        ((data as any)[key] === "" || (data as any)[key] === null)
      ) {
        delete (data as any)[key];
      }
    });

    loadingOrderMutation.mutateAsync({ data, id: idLoadingOrder });
  };

  useEffect(() => {
    // calcular la diferencia de kgs
    const capacity = form.getValues("capacity");
    const kgsUnloaded = form.getValues("kgsUnloaded");
    if (capacity && kgsUnloaded) {
      form.setValue(
        "kgsDifference",
        kgsUnloaded ? capacity - kgsUnloaded : capacity
      );
    }
  }, [form.watch("capacity"), form.watch("kgsUnloaded")]);

  const getBusinessDetailByIdQuery = useQuery({
    queryKey: [
      "getBusinessDetailByIdQuery",
      form.getValues("businessDetailId"),
    ],
    queryFn: fetchBusinessDetailById,
    enabled: !!form.getValues("businessDetailId"),
  });

  const getBusinessByIdQuery = useQuery({
    queryKey: [
      "getBusinessByIdQuery",
      getBusinessDetailByIdQuery.data?.businessId,
    ],
    queryFn: fetchBusinessById,
    enabled: !!getBusinessDetailByIdQuery.data?.businessId,
  });

  const searchArca = () => {
    const CTG = form.getValues("ctgNumber");
    // if (!CTG || CTG.length !== 11) {
    //   Toast.show({
    //     type: "error",
    //     text1: "CTG inválido",
    //     text2: "El CT
    //   });
    //   return;
    // }
    mutationArca.mutate({
      CTG: CTG ?? "",
      userId:
        decodedClaims?.[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ?? "",
    });
  };

  const mutationArca = useMutation({
    mutationFn: fetchSearchCTGQuery,
    onSuccess: (data) => {
      setPdfValue(data.pdf);

      if (data.errores && data.errores.length > 0) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data.errores[0].descripcion,
        });

        return;
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

  // useEffect(() => {
  //   // Aqui vamos a cargar datos al form que vienen desde business y businessDetail
  //   // Estos campos osn

  useEffect(() => {
    if (form.getValues("isRemainingCapacity") === false) {
      form.setValue("kilograms", 0);
    }
  }, [form.watch("isRemainingCapacity"), form.watch("kilograms")]);

  // Mapeo personalizado para incluir el nombre en el objeto de datos
  const dataMapper = (item: any) => ({
    label: item.name,
    value: item.id,
    name: item.name, // Guardamos el nombre para usarlo en onChange
  });

  const { data: LoadingOrderStates } = useQuery({
    queryKey: [
      "getStatusChangeStateLoadingOrder",
      "",
      "ESTADOS ORDEN DE CARGA",
    ],
    queryFn: () =>
      fetchSearchCategoriesTypes({
        queryKey: [
          "getStatusChangeStateLoadingOrder",
          "",
          "ESTADOS ORDEN DE CARGA",
          [],
        ],
      }),
  });

  const { data: CategoryTypeCancelationReasons } = useQuery({
    queryKey: [
      "getCategoriesTypesByNameCancelationReasons",
      "Tipos de cancelacion",
      "Orden de carga",
    ],
    queryFn: () =>
      fetchCategoriesTypesByName({
        queryKey: [
          "getCategoriesTypesByNameCancelationReasons",
          "Tipos de cancelacion",
          "Orden de carga",
        ],
      }),
  });

  const { data: LoadingOrderCancellationReasons } = useQuery({
    queryKey: [
      "getCancellationReasonsLoadingOrder",
      CategoryTypeCancelationReasons?.id,
    ],
    queryFn: () =>
      fetchSearchCancellationReasons({
        queryKey: [
          "getCancellationReasonsLoadingOrder",
          CategoryTypeCancelationReasons?.id,
        ],
      }),
    enabled: !!CategoryTypeCancelationReasons?.id,
  });

  const mutationAddDocument = useMutation({
    mutationFn: fetchAddLoadingOrderFile,
    onSuccess: async (data) => {
      try {
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "El archivo del CTG se guardó correctamente",
          position: "bottom",
        });
        queryClient.refetchQueries({
          queryKey: ["getLoadingOrderFilesListQuery"],
        });
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Error al guardar los datos de negocio",
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

  const handleSubmitDocument = () => {
    const formData = {
      loadingOrderFiles: [
        {
          loadingOrderId: idLoadingOrder,
          name: "Archivo.pdf",
          fileExtension: ".pdf",
          file: {
            name: "Archivo.pdf",
            extension: ".pdf",
            data: `data:application/pdf;base64,${pdfValue}`,
          },
        },
      ],
    };
    mutationAddDocument.mutateAsync(formData);
  };

  return (
    <KeyboardView>
      <ThemedView style={{ flex: 1 }}>
        <View style={styles.formContainer}>
          <CustomDropdown
            form={form}
            label="Estado"
            fieldName="loadingOrderStatusId"
            value={form.getValues("loadingOrderStatusId")}
            items={LoadingOrderStates?.data?.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            disabled={false}
            searchEnabled={true}
            error={errors.loadingOrderStatusId}
            dataMapper={dataMapper}
            onChange={(value) => {
              const selected = LoadingOrderStates?.data?.find(
                (item) => item.id === value
              );
              if (selected) {
                form.setValue("loadingOrderStatusName", selected.name);
              }
            }}
          />
          <CustomDropdown
            form={form}
            label="Motivo de cancelación"
            fieldName="cancellationReasonId"
            value={form.getValues("cancellationReasonId") ?? undefined}
            items={LoadingOrderCancellationReasons?.data?.map((item) => ({
              label: item.description,
              value: item.id,
            }))}
            disabled={form.watch("loadingOrderStatusName") !== "CANCELADO"}
            searchEnabled={true}
            error={errors.loadingOrderStatusId}
            dataMapper={dataMapper}
            onChange={(value) => {
              const selected = LoadingOrderCancellationReasons?.data?.find(
                (item) => item.id === value
              );
              if (selected) {
                form.setValue("cancellationReasonId", selected.id);
              }
            }}
          />
          {/* <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => ( */}
          <CustomTextField
            disabled={true}
            // value={value ? value : ""}
            // onBlur={onBlur}
            // onChangeText={onChange}
            // error={error}
            value={getBusinessDetailByIdQuery.data?.incrementId}
            onBlur={() => {}}
            onChangeText={() => {}}
            error={undefined}
            // onBlur={onBlur}
            // onChangeText={onChange}
            // error={error}
            type="number"
            placeholder="Orden de carga"
            inputProps={{
              style: [styles.textInput, { color: color }],
            }}
          />
          {/* //   )}
          //   name="id"
          // /> */}
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
                placeholder="Cantidad de destinos"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="destinationQuantity"
          />
          {/* <Controller
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
          /> */}
          <Controller
            control={control}
            // rules={{
            //   required: true,
            // }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <CustomDateField
                label="Tiempo de diferencia(min)"
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
            name="timeDifference"
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
                placeholder="Kgrs / Km / Unidad"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="capacity"
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
                placeholder="Kgs. Descargados"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="kgsUnloaded"
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
                placeholder="Kgs. Diferencia"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="kgsDifference"
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
                placeholder="Tolerancia cliente"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="customerTolerance"
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
                placeholder="Km. Recorridos"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="kmTraveled"
          />
          <View style={styles.searcher}>
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
                  onChangeText={(text) => onChange(String(text))}
                  error={error}
                  type="number"
                  placeholder="Nro de CTG"
                  inputProps={{
                    style: [styles.textInput, { color: color }],
                    keyboardType: "numeric", // Asegura que se muestre el teclado numérico
                  }}
                />
              )}
              name="ctgNumber"
            />
            <Pressable style={styles.searchButton} onPress={searchArca}>
              <IconSymbol size={24} name="magnifyingglass" color={"white"} />
            </Pressable>
          </View>

          {pdfValue && (
            <View style={styles.actionButtons}>
              <PDFModalButton document={pdfValue} />
              <Pressable
                style={[styles.actionButton, styles.addButton]}
                onPress={() => handleSubmitDocument()}
              >
                <Ionicons name="cloud-upload-outline" size={20} color="white" />
                <ThemedText style={styles.actionButtonText}>Subir</ThemedText>
              </Pressable>
            </View>
          )}

          <View style={{ flexDirection: "column", gap: 2, width: "100%" }}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => {
                // Format the input as "R-XXXX-XXXXXXXX" without adding zeros
                const formatRemittanceNumber = (text: string): string => {
                  // Remove any non-numeric characters
                  const numericValue = text.replace(/[^0-9]/g, "");

                  // Don't format if empty
                  if (!numericValue) return "";

                  // Start with R- prefix
                  let formattedValue = "R-";

                  // Add first part (up to 4 digits)
                  if (numericValue.length <= 4) {
                    formattedValue += numericValue;
                  } else {
                    // Add first 4 digits
                    formattedValue += numericValue.substring(0, 4);

                    // Add hyphen and the remaining digits (if any)
                    formattedValue += "-" + numericValue.substring(4, 12);
                  }

                  return formattedValue;
                };

                // Handle text change with formatting
                const handleTextChange = (text: string): void => {
                  // Extract only the numbers
                  const numericValue = text.replace(/[^0-9]/g, "");
                  const formattedValue = formatRemittanceNumber(numericValue);

                  // Save only the numeric part (003900016547)
                  onChange(numericValue);

                  // Display the formatted value (R-0039-00016547)
                  // This is handled by the value prop below
                };

                // Get the formatted value for display
                const displayValue = value
                  ? formatRemittanceNumber(value)
                  : "R-";

                return (
                  <CustomTextField
                    value={displayValue} // Show formatted value
                    onBlur={onBlur}
                    onChangeText={handleTextChange}
                    error={error}
                    type="text"
                    placeholder="Remito Nro"
                    inputProps={{
                      style: [styles.textInput, { color: color }],
                      maxLength: 15, // Maximum length of "R-XXXX-XXXXXXXX"
                      keyboardType: "numeric",
                    }}
                  />
                );
              }}
              name="remittanceNumber"
            />
            <ThemedText
              style={{
                color: color,
                marginLeft: 16,
                opacity: 0.5,
                fontSize: 12,
              }}
            >
              R-0000-00000000
            </ThemedText>
          </View>

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
                onChangeText={(text) => onChange(String(text))}
                error={error}
                type="number"
                placeholder="CCPP"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                  keyboardType: "numeric", // Asegura que se muestre el teclado numérico
                }}
              />
            )}
            name="billOfLading"
          />
          {/* <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => ( */}
          <CustomTextField
            disabled={true}
            value={getBusinessByIdQuery.data?.transportRate}
            onBlur={() => {}}
            onChangeText={() => {}}
            error={undefined}
            type="number"
            placeholder="Tarifa transporte"
            inputProps={{
              style: [styles.textInput, { color: color }],
            }}
          />
          {/* )}
            name=""
          /> */}
          {/* <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => ( */}
          <CustomTextField
            disabled={true}
            value={getBusinessByIdQuery.data?.customerRate}
            onBlur={() => {}}
            onChangeText={() => {}}
            error={undefined}
            type="number"
            placeholder="Tarifa cliente"
            inputProps={{
              style: [styles.textInput, { color: color }],
            }}
          />
          {/* )}
            name="customerRate"
          /> */}
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
                navigationPath="/shared/BusinessCustomer"
                error={error}
              />
            )}
            name="transportUserId"
          />

          {/* <Controller
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
            // error={error}
          />
          )}
            name="businessUserId"
          /> */}

          <CustomTextField
            value={
              // getBusinessDetailByIdQuery.data?.loadingOrderEntityBusinessName
              "Cambiar esto"
            }
            onBlur={() => {}}
            onChangeText={(text: string) => {}}
            disabled={true}
            // error={error}
            placeholder="Comercial cliente"
            inputProps={{
              style: [styles.textInput, { color: color }],
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
              <Autocomplete
                disabled={true}
                form={form}
                formField="businessDetailBusinessEntityId"
                displayField="businessDetailBusinessEntityBusinessName"
                label="Cliente"
                navigationPath="/shared/Customer"
                error={error}
              />
            )}
            name="businessDetailBusinessEntityId"
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
                placeholder="Distancia"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
              />
            )}
            name="distance"
          />
          <ThemedLabeledView label="Aforo">
            <CustomRadioButton
              options={[
                { value: "true", label: "Si" },
                { value: "false", label: "No" },
              ]}
              selectedValue={
                form.watch("isRemainingCapacity") ? "true" : "false"
              }
              onSelect={(value) => {
                if (value === "true") {
                  form.setValue("isRemainingCapacity", true);
                } else {
                  form.setValue("isRemainingCapacity", false);
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
              <CustomTextField
                value={value ? value : ""}
                onBlur={onBlur}
                onChangeText={onChange}
                error={error}
                type="number"
                placeholder="Kilogramos de aforo"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                }}
                disabled={!form.getValues("isRemainingCapacity")}
              />
            )}
            name="kilograms"
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
                disabled={true}
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
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <CustomDateField
                label="Arribado"
                disabled={true}
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
            name="arrivalDate"
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
                label="Descargado"
                disabled={true}
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
            name="unloadedDate"
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
                label="Finalizado"
                disabled={true}
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
            name="completedDate"
          />
          <ThemedLabeledView label="Calcular por">
            <CustomRadioButton
              disabled={true}
              options={[
                { value: "Kilogramos", label: "Kilogramos" },
                { value: "Kilómetros", label: "Kilómetros" },
              ]}
              selectedValue={
                getLoadingOrderByIdQuery.data?.businessDetailBusinessIsKilograms
                  ? "Kilogramos"
                  : "Kilómetros"
              }
              onSelect={(value) => {
                if (value === "Kilogramos") {
                  // form.setValue("isKilograms", true);
                  // form.setValue("isKilometers", false);
                } else {
                  // form.setValue("isKilometers", true);
                  // form.setValue("isKilograms", false);
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
              selectedValue={
                getLoadingOrderByIdQuery.data?.businessDetailBusinessIsOrigin
                  ? "Origen"
                  : "Destino"
              }
              onSelect={(value) => {
                if (value === "Origen") {
                  // form.setValue("isOrigin", true);
                  // form.setValue("isDestination", false);
                } else {
                  // form.setValue("isDestination", true);
                  // form.setValue("isOrigin", false);
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
                getLoadingOrderByIdQuery.data
                  ?.businessDetailBusinessIsWeightScaleOrigin
                  ? "true"
                  : "false"
              }
              onSelect={(value) => {
                if (value === "true") {
                  // form.setValue("isWeightScaleOrigin", true);
                } else {
                  // form.setValue("isWeightScaleOrigin", false);
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
                getLoadingOrderByIdQuery.data
                  ?.businessDetailBusinessIsWeightScaleDestination
                  ? "true"
                  : "false"
              }
              onSelect={(value) => {
                if (value === "true") {
                  // form.setValue("isWeightScaleDestination", true);
                } else {
                  // form.setValue("isWeightScaleDestination", false);
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
              selectedValue={
                getLoadingOrderByIdQuery.data
                  ?.businessDetailBusinessIsPhysicalPapers
                  ? "true"
                  : "false"
              }
              onSelect={(value) => {
                if (value === "true") {
                  // form.setValue("isPhysicalPapers", true);
                } else {
                  // form.setValue("isPhysicalPapers", false);
                }
              }}
              selectedButtonStyle={{ backgroundColor: "transparent" }}
              selectedTextStyle={{ color: "#0093D1" }}
            />
          </ThemedLabeledView>
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
          <View style={styles.containerSubtitle}>
            <ThemedText style={styles.subtitle}>Transporte</ThemedText>
            <View style={styles.separator}></View>
          </View>
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
          <View style={styles.containerSubtitle}>
            <ThemedText style={styles.subtitle}>Documentación</ThemedText>
            <View style={styles.separator}></View>
          </View>

          <LoadingOrderDocuments idLoadingOrder={idLoadingOrder} />

          <ThemedLabeledView label="Documentación conforme">
            <CustomRadioButton
              options={[
                { value: "true", label: "Si" },
                { value: "false", label: "No" },
              ]}
              selectedValue={
                form.watch("isCompliantDocumentation") ? "true" : "false"
              }
              onSelect={(value) => {
                if (value === "true") {
                  form.setValue("isCompliantDocumentation", true);
                } else {
                  form.setValue("isCompliantDocumentation", false);
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
              <CustomDateField
                label="Fecha documentación"
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
            name="systemDocumentationDate"
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

          <Pressable
            style={[
              styles.SubmitButton,
              loadingOrderMutation.isPending && { opacity: 0.7 },
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={loadingOrderMutation.isPending}
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

export default LoadingOrder;

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

  searchButton: {
    position: "absolute",
    right: 4,
    top: 4,
    backgroundColor: "#0093D1",
    // transform: [{ translateY: "-50%" }],

    borderRadius: "50%",
    padding: 8,
    zIndex: 1,
  },
  searcher: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
  },
  addButton: {
    backgroundColor: "#ABCA48",
  },
  actionButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "bold",
  },
});
