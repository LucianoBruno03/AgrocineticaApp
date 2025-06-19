import { useAuthStore } from "@/zustand/authStore";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Appearance,
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Switch } from "react-native-gesture-handler";
import { ThemedText } from "../ThemedText";
import { IconSymbol, IconSymbolName } from "../ui/IconSymbol";
import { ArrowRightIcon } from "../ui/icons/ArrowRightIcon";
import BusIcon from "../ui/icons/BusIcon";
import LogoutIcon from "../ui/icons/LogoutIcon";
import { PackageIcon } from "../ui/icons/PackageIcon";

// Collapsible Section Component
const CollapsibleSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  // icon name props
  // icon: IconSymbolName; sera un componente
  icon: React.ReactNode | IconSymbolName;
  children: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.collapsibleContainer}>
      <Pressable
        style={styles.sectionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.sectionTitle}>
          {typeof icon === "string" ? (
            <IconSymbol size={24} name={icon as any} color="#666" />
          ) : (
            icon
          )}
          <ThemedText style={styles.sectionTitleText}>{title}</ThemedText>
        </View>
        <IconSymbol
          size={20}
          name={isExpanded ? "chevron.down" : "chevron.right"}
          color="#666"
        />
      </Pressable>

      {isExpanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

export default function CustomDrawer(props: any) {
  const router = useRouter();
  const {
    // user,
    decodedClaims,
  } = useAuthStore();

  const colorScheme = useColorScheme();

  const toggleTheme = (value: boolean) => {
    Appearance.setColorScheme(value ? "dark" : "light");
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.profileContainer}>
          {decodedClaims && decodedClaims.image_url ? (
            <>
              <Image
                source={{
                  uri:
                    process.env.EXPO_PUBLIC_WEB_URL! + decodedClaims?.image_url,
                }}
                style={styles.profileImage}
              />
            </>
          ) : (
            <View style={{ margin: "auto" }}>
              <Ionicons name="person-circle" size={200} color="#666" />
            </View>
          )}

          <ThemedText style={styles.profileName}>
            {decodedClaims?.fullName ?? "Usuario desconocido"}
          </ThemedText>
        </View>

        {/* Gestión de Fletes Collapsible Section */}
        <CollapsibleSection
          title="Gestión de Fletes"
          icon={
            <>
              <PackageIcon width={24} height={24} color={"#666"} />
            </>
          }
        >
          <DrawerItem
            label={() => (
              <ThemedText style={styles.menuItemText}>Negocios</ThemedText>
            )}
            onPress={() => router.push("/business")}
            icon={({ color }) => (
              <ArrowRightIcon width={16} height={16} color={color} />
            )}
            style={styles.nestedItem}
          />

          <DrawerItem
            label={() => (
              <ThemedText style={styles.menuItemText}>
                Ordenes de carga
              </ThemedText>
            )}
            onPress={() => router.push("/loadingOrders")}
            icon={({ color }) => (
              <ArrowRightIcon width={16} height={16} color={color} />
            )}
            style={styles.nestedItem}
          />

          <DrawerItem
            label={() => (
              <ThemedText style={styles.menuItemText}>
                Cambiar estado de ordenes de carga
              </ThemedText>
            )}
            onPress={() => router.push("/loadingOrders/changeStatus")}
            icon={({ color }) => (
              <ArrowRightIcon width={16} height={16} color={color} />
            )}
            style={styles.nestedItem}
          />

          <DrawerItem
            label={() => (
              <ThemedText style={styles.menuItemText}>
                Ordenes de compra
              </ThemedText>
            )}
            onPress={() => router.push("/purchaseOrders")}
            icon={({ color }) => (
              <ArrowRightIcon width={16} height={16} color={color} />
            )}
            style={styles.nestedItem}
          />
        </CollapsibleSection>

        {/* Transporte Collapsible Section */}
        <CollapsibleSection
          title="Transporte"
          icon={
            <>
              <BusIcon width={24} height={24} color={"#666"} />
            </>
          }
        >
          <DrawerItem
            label={() => (
              <ThemedText style={styles.menuItemText}>Unidades</ThemedText>
            )}
            onPress={() => router.push("/units")}
            icon={({ color }) => (
              <ArrowRightIcon width={16} height={16} color={color} />
            )}
            style={styles.nestedItem}
          />

          <DrawerItem
            label={() => (
              <ThemedText style={styles.menuItemText}>Choferes</ThemedText>
            )}
            onPress={() => router.push("/chauffeurs")}
            icon={({ color }) => (
              <ArrowRightIcon width={16} height={16} color={color} />
            )}
            style={styles.nestedItem}
          />
        </CollapsibleSection>

        <DrawerItem
          label={() => (
            <ThemedText style={styles.logoutText}>Cerrar sesión</ThemedText>
          )}
          onPress={() => router.push("/login")}
          icon={({ color }) => (
            <>
              <LogoutIcon width={24} height={24} color={"#666"} />
            </>
          )}
        />
      </DrawerContentScrollView>

      <View style={styles.themeToggleContainer}>
        <ThemedText style={{ marginRight: 8, fontSize: 16 }}>
          {colorScheme ? "Modo oscuro" : "Modo claro"}
        </ThemedText>
        <Switch
          value={colorScheme === "dark"}
          onValueChange={toggleTheme}
          thumbColor={colorScheme === "dark" ? "#f4f3f4" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    flexGrow: 1,
  },
  profileContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 160,
    marginInline: "auto",
  },
  profileName: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
  },
  collapsibleContainer: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitleText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 10,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "500",
  },
  sectionContent: {
    paddingLeft: 8,
  },
  nestedItem: {
    marginVertical: 0,
  },
  menuItemText: {
    fontSize: 12,
  },
  themeToggleContainer: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  themeToggleText: {
    marginRight: 8,
    fontSize: 16,
  },
});
