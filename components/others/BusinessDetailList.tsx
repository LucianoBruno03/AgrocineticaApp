import { fetchLoadingOrderById } from "@/api/request/loadingOrders/LoadingOrderById";
import { ThemedLabeledView } from "@/components/ThemedLabeledView";
import { ThemedText } from "@/components/ThemedText";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator } from "react-native";
import { StyleSheet, Text, View } from "react-native";

const BusinessDetailList = ({
  idBusinessDetail,
}: {
  idBusinessDetail: string;
}) => {
  const getBusinessDetailByIdQuery = useQuery({
    queryKey: ["getBusinessDetailByIdQuery", idBusinessDetail],
    queryFn: fetchLoadingOrderById,
    enabled: !!idBusinessDetail,
  });

  return (
    <>
      {getBusinessDetailByIdQuery.isLoading ? (
        <View style={styles.noDataContainer}>
          <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
        </View>
      ) : (
        <View style={{ width: "100%", gap: 20 }}>
          <ThemedText
            style={{ fontSize: 24, fontWeight: "bold", paddingBlock: 10 }}
          >
            Detalle de la asignación
          </ThemedText>
          <ThemedLabeledView label="Transporte">
            <View style={{ gap: 8 }}>
              <ThemedText style={{ color: "#0093D1" }}>
                {getBusinessDetailByIdQuery.data?.entityBusinessName}
              </ThemedText>
            </View>
          </ThemedLabeledView>
          <ThemedLabeledView label="Conductor">
            <View style={{ gap: 8 }}>
              <ThemedText style={{ color: "#0093D1" }}>
                {getBusinessDetailByIdQuery.data?.driverName}
              </ThemedText>
            </View>
          </ThemedLabeledView>
          <ThemedLabeledView label="Chasis">
            <View style={{ gap: 8 }}>
              <ThemedText style={{ color: "#0093D1" }}>
                {getBusinessDetailByIdQuery.data?.chassisName}
              </ThemedText>
            </View>
          </ThemedLabeledView>
          <ThemedLabeledView label="Trailer">
            <View style={{ gap: 8 }}>
              <ThemedText style={{ color: "#0093D1" }}>
                {getBusinessDetailByIdQuery.data?.trailerName}
              </ThemedText>
            </View>
          </ThemedLabeledView>
        </View>
      )}
    </>
  );
};

export default BusinessDetailList;

const styles = StyleSheet.create({
  noDataContainer: {
    alignItems: "center",
    padding: 16,
  },
  noDataText: {
    fontSize: 18,
    color: "#888",
  },
});
