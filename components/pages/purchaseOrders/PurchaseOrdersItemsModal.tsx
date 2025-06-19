import { PurchaseOrderItemSchema } from "@/schemas/PurchaseOrders";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { z } from "zod";
import CustomDropdown from "../../customs/CustomDropdown";
import { CustomModal } from "../../customs/CustomModal";
import { CustomTextField } from "../../customs/CustomTextField";
import { ThemedText } from "../../ThemedText";

import { fetchListItems } from "@/api/request/search/Items";

type PurchaseOrderItem = {
  id?: string;
  purchaseOrderId: string;
  itemId: string;
  itemName?: string;
  quantity: number;
};

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: PurchaseOrderItem) => void;
  onClose?: () => void;
  initialData?: PurchaseOrderItem | null;
  isEditing?: boolean;
  purchaseOrderId?: string;
};

const PurchaseOrdersItemsModal = ({
  open,
  setOpen,
  onSubmit,
  initialData = null,
  isEditing = false,
  purchaseOrderId = "00000000-0000-0000-0000-000000000000",
  onClose = () => {},
}: Props) => {
  const colorScheme = useColorScheme() ?? "light";
  const color = colorScheme === "light" ? "#000" : "#fff";

  const form = useForm<z.infer<typeof PurchaseOrderItemSchema>>({
    defaultValues: {
      purchaseOrderId,
      itemId: initialData?.itemId || "",
      quantity: initialData?.quantity || 0,
    },
    resolver: zodResolver(PurchaseOrderItemSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const { data: ItemsQuery } = useQuery({
    queryKey: ["ItemsQuery", "", "Orden De Compras"],
    queryFn: fetchListItems,
  });

  useEffect(() => {
    if (initialData) {
      reset({
        purchaseOrderId,
        itemId: initialData.itemId,
        quantity: initialData.quantity,
      });
    } else {
      reset({
        purchaseOrderId,
        itemId: "",
        quantity: 0,
      });
    }
  }, [initialData, purchaseOrderId, reset]);

  const dataMapper = (item: any) => ({
    label: item.name,
    value: item.id,
    name: item.name,
  });

  const handleFormSubmit = (data: z.infer<typeof PurchaseOrderItemSchema>) => {
    const selectedItem = ItemsQuery?.data.find(
      (item: { id: string; name: string }) => item.id === data.itemId
    );

    const itemData = {
      ...data,
      itemName: selectedItem?.name || "",
      ...(isEditing && initialData?.id && { id: initialData.id }),
    };

    onSubmit(itemData);
    setOpen(false);
    // borrar el formulario
    form.reset({
      purchaseOrderId,
      itemId: "",
      quantity: 0,
    });
    Keyboard.dismiss();
  };

  return (
    <CustomModal
      title={isEditing ? "Editar Item" : "Agregar Item"}
      visible={open}
      onClose={() => {
        setOpen(false);
        // if (onClose) {
        //   onClose();
        // }
      }}
    >
      <View style={styles.formContainer}>
        <CustomDropdown
          form={form}
          label={form.watch("itemId") ? "Item" : "Selecciona un item"}
          fieldName="itemId"
          value={form.getValues("itemId")}
          items={ItemsQuery?.data?.map(
            (item: { id: string; name: string }) => ({
              label: item.name,
              value: item.id,
            })
          )}
          disabled={false}
          searchEnabled={false}
          error={errors.itemId}
          dataMapper={dataMapper}
          onChange={(value) => {
            const selected = ItemsQuery?.data?.find(
              (item: { id: string; name: string }) => item.id === value
            );
            if (selected) {
              form.setValue("itemId", selected.id);
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
            <CustomTextField
              value={value ? value : ""}
              onBlur={onBlur}
              onChangeText={onChange}
              error={error}
              type="number"
              placeholder="Cantidad"
              inputProps={{
                style: [styles.textInput, { color: color }],
                keyboardType: "numeric",
              }}
            />
          )}
          name="quantity"
        />

        <Pressable
          style={[styles.SubmitButton, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmit(handleFormSubmit)}
          disabled={isSubmitting}
        >
          <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>
            {isEditing ? "Actualizar" : "Guardar"}
          </ThemedText>
        </Pressable>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  textInput: {
    padding: 10,
    paddingStart: 20,
    height: 48,
    borderRadius: 10,
  },
  formContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    gap: 16,
  },
  SubmitButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0093D1",
    padding: 12,
    borderRadius: 12,
  },
});

export default PurchaseOrdersItemsModal;
