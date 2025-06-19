import { fetchSearchDomain } from "@/api/request/arca/SearchDomain";
import { fetchNewUnits } from "@/api/request/units/NewUnits";
import Autocomplete from "@/components/customs/CustomAutocomplete";
import { CustomDateField } from "@/components/customs/CustomDateField";
import { CustomTextArea } from "@/components/customs/CustomTextArea";
import { CustomTextField } from "@/components/customs/CustomTextField";
import { KeyboardView } from "@/components/KeyboardAvoidingView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
// import UnitItemsCardList from "@/components/ui/cards/UnitItemsCardList";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UnitsSchema } from "@/schemas/Units";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, View, ViewProps } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

export interface SearchParams {
  currentFormData: string;
}

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const NewUnit = () => {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "#000" : "#fff";

  const { currentFormData } = useLocalSearchParams<{
    currentFormData?: string;
  }>();

  const parsedForm: any | null = currentFormData
    ? JSON.parse(currentFormData)
    : null;

  const form = useForm<z.infer<typeof UnitsSchema>>({
    defaultValues: {
      //  id:
      entityId: parsedForm?.entityId || "",
      entityBusinessName: parsedForm?.entityBusinessName || "",
      domain: parsedForm?.domain || "",
      typeUnitId: parsedForm?.typeUnitId || "",
      typeUnitName: parsedForm?.typeUnitName || "",
      brandId: parsedForm?.brandId || "",
      brandName: parsedForm?.brandName || "",
      modelId: parsedForm?.modelId || "",
      modelName: parsedForm?.modelName || "",
      year: parsedForm?.year || "",
      rutaExpiryDate: parsedForm?.rutaExpiryDate || "",
      civilLiabilityInsuranceExpiryDate:
        parsedForm?.civilLiabilityInsuranceExpiryDate || "",
      observation: parsedForm?.observation || "",
      startDate: parsedForm?.startDate || new Date().toISOString(),
      endDate: parsedForm?.endDate || "",
      cargoInsuranceExpiryDate: parsedForm?.cargoInsuranceExpiryDate || "",
      technicalInspectionExpiryDate:
        parsedForm?.technicalInspectionExpiryDate || "",
      scalableId:
        parsedForm?.scalableId || "00000000-0000-0000-0000-000000000000",
      scalableName: parsedForm?.scalableName || "",
      isAvailable: parsedForm?.isAvailable || true,
      active: parsedForm?.active || true,
    },
    resolver: zodResolver(UnitsSchema),
  });

  const {
    control,
    handleSubmit,
    // formState: { errors },
  } = form;

  const unitMutation = useMutation({
    mutationFn: fetchNewUnits,
    onSuccess: async (data) => {
      try {
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Unidad creada exitosamente",
        });
        router.replace("/units");
      } catch {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Error al guardar los datos",
        });
      }
    },
    onError: (error: Error | AxiosError) => {
      if (isAxiosError(error)) {
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

  const onSubmit = (data: z.infer<typeof UnitsSchema>) => {
    // const fieldsToCheck = [
    //   // "RemittanceNumber",
    //   // "expirationDate",
    //   "cancellationReasonId",
    //   // "completedDate",
    //   // "serviceStationId",
    //   // "paymentMethodId",
    // ];

    // Object.keys(data).forEach((key) => {
    //   if (
    //     fieldsToCheck.includes(key) &&
    //     ((data as any)[key] === "" || (data as any)[key] === null)
    //   ) {
    //     delete (data as any)[key];
    //   }
    // });

    // // los datos que sean "" o null, los eliminamos
    Object.keys(data).forEach((key) => {
      if ((data as any)[key] === "" || (data as any)[key] === null) {
        delete (data as any)[key];
      }
    });
    unitMutation.mutateAsync(data);
  };

  const mutationArca = useMutation({
    mutationFn: fetchSearchDomain,
    onSuccess: (data) => {
      const newData = data?.data?.dominios[0];

      form.setValue("domain", newData.dominio);
      form.setValue(
        "technicalInspectionExpiryDate",
        newData?.rto?.fechaVencimiento
      );
      form.setValue("year", newData?.ruta?.anioModelo);
      form.setValue(
        "rutaExpiryDate",
        newData?.ruta?.fechaVencimientoConstancia.slice(0, 10)
      );

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
      if (isAxiosError(error)) {
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

  const searchArca = () => {
    const domain = form.getValues("domain");
    // if (!domain || domain.length !== 11) {
    //   Toast.show({
    //     type: "error",
    //     text1: "domain inválido",
    //     text2: "El CT
    //   });
    //   return;
    // }
    mutationArca.mutate({
      domain: domain ?? "",
      // userId:
      //   decodedClaims?.[
      //     "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      //   ] ?? "",
    });
  };

  return (
    <KeyboardView>
      <View style={{ flex: 1 }}>
        <View style={styles.formContainer}>
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
                  value={
                    typeof value === "string" || typeof value === "number"
                      ? value
                      : ""
                  }
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(String(text))}
                  error={error}
                  type="text"
                  placeholder="Dominio"
                  inputProps={{
                    style: [styles.textInput, { color: color }],
                    // keyboardType: "numeric", // Asegura que se muestre el teclado numérico
                  }}
                />
              )}
              name="domain"
            />
            <Pressable style={styles.searchButton} onPress={searchArca}>
              <IconSymbol size={24} name="magnifyingglass" color={"white"} />
            </Pressable>
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
                formField="typeUnitId"
                displayField="typeUnitName"
                label="Tipo de Unidad"
                navigationPath="/shared/UnitTypes"
                error={error}
              />
            )}
            name="typeUnitId"
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
                formField="brandId"
                displayField="brandName"
                label="Marca"
                navigationPath="/shared/Brands"
                error={error}
                // disabled={true}
                keysToClear={["modelId", "modelName"]}
              />
            )}
            name="brandId"
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
                formField="modelId"
                displayField="modelName"
                label="Modelo"
                navigationPath="/shared/Models"
                error={error}
                disabled={!form.getValues("brandId") ? true : false} // Deshabilitar si no hay marca seleccionada
              />
            )}
            name="modelId"
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
                placeholder="Año"
                inputProps={{
                  style: [styles.textInput, { color: color }],
                  keyboardType: "numeric",
                }}
              />
            )}
            name="year"
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
                navigationPath="/shared/Scalables"
                error={error}
              />
            )}
            name="scalableId"
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
                label="Vencimiento R.U.T.A"
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
            name="rutaExpiryDate"
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
                label="Venc. Seg. Resp. Civil"
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
            name="civilLiabilityInsuranceExpiryDate"
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
                label="Venc. Seguro de Carga"
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
            name="cargoInsuranceExpiryDate"
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
                label="Venc. Inspección Técnica"
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
            name="technicalInspectionExpiryDate"
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

          <Pressable
            style={[
              styles.SubmitButton,
              unitMutation.isPending && { opacity: 0.7 },
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={unitMutation.isPending}
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

export default NewUnit;

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
});
