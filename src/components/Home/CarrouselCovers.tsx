import {
  Image,
  Linking,
  StyleSheet,
  Text,
  Touchable,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { api } from "../../api/api";
import { GetBannersResponse } from "../../interfaces/home/home.interface";
import { useQuery } from "@tanstack/react-query";
import Carousel from "pinar";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { COLORS } from "../../Constants/Colors";
import CarrouselCoversSkeleton from "../Skeletons/CarrouselCoversSkeleton";

type Props = {};

const getBanners = async (): Promise<GetBannersResponse> => {
  const response = await api.get("/BannersPublicitarios/GetFront");

  return response.data;
};
// bruka

const CarrouselCovers = (props: Props) => {
  const { width } = useWindowDimensions();
  const getBannersQuery = useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  const redirect = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <>
      {getBannersQuery.isLoading ? (
        <CarrouselCoversSkeleton />
      ) : getBannersQuery.data ? (
        <View style={{ paddingBottom: 32 }}>
          <Carousel
            showsDots={getBannersQuery.data.length > 1 ? true : false}
            showsControls={false}
            dotsContainerStyle={{
              alignSelf: "center",
              marginTop: 8,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: -16,
              left: 0,
              right: 0,
            }}
            style={{ width: width, aspectRatio: 75 / 50 }}
            activeDotStyle={{
              width: 8,
              height: 8,
              borderRadius: 4,
              marginLeft: 3,
              marginRight: 3,
              backgroundColor: COLORS.secondary,
            }}
            dotStyle={{
              backgroundColor: "rgba(0,0,0,.2)",
              width: 6,
              borderRadius: 3,
              height: 6,
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: 3,
            }}
          >
            {getBannersQuery.data.map((banner) => {
              return (
                <TouchableWithoutFeedback
                  onPress={() => redirect(banner.urlImagen)}
                  key={banner.id}
                >
                  <View>
                    <Image
                      source={{ uri: banner.imagenCelular }}
                      style={{ width: width, aspectRatio: 750 / 500 }}
                    />
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </Carousel>
        </View>
      ) : null}
    </>
  );
};

export default CarrouselCovers;

const styles = StyleSheet.create({});
