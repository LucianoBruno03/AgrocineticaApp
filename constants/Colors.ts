/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    // background: "rgba(224, 224, 224, 1)",
    backgroundSecondary: "rgba(255, 255, 255, 1)",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    shadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    // new colors
    background: "#ffffff",
    foreground: "#D4D4D8",
    // card: "#ffffff",
    // cardforeground: "#1a1a1a",
    // popover: "#ffffff",
    // popoverforeground: "#1a1a1a",
    // primary: "#0093D1",
    // primaryforeground: "#fafafa",
    // secondary: "#ABCA48",
    // secondaryforeground: "#1a1a1a",
    // muted: "#f2f2f2",
    // mutedforeground: "#767676",
    // accent: "#f2f2f2",
    // accentforeground: "#1a1a1a",
    // destructive: "#e63946",
    // destructiveforeground: "#fafafa",
    border: "#e5e5e5",
    // input: "#e5e5e5",
    // ring: "#1a1a1a",
    // radius: " 0.5rem",
    // chart1: "#f24444",
    // chart2: "#34c58f",
    // chart3: "#319795",
    // chart4: "#86d992",
    // chart5: "#f2dc50",
  },
  dark: {
    text: "#ECEDEE",
    // background: "rgba(21, 23, 24, 1)",
    backgroundSecondary: "rgba(16, 18, 19, 1)",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    shadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 6,
    },
    // new colors
    background: "#1a1a1a",
    foreground: "#171717",
    // card: "#1a1a1a",
    // cardforeground: "#fafafa",
    // popover: "#1a1a1a",
    // popoverforeground: "#fafafa",
    // primary: "#fafafa",
    // primaryforeground: "#1a1a1a",
    // secondary: "#262626",
    // secondaryforeground: "#fafafa",
    // muted: "#262626",
    // mutedforeground: "#a3a3a3",
    // accent: "#262626",
    // accentforeground: "#fafafa",
    // destructive: "#8b2e2e",
    // destructiveforeground: "#fafafa",
    border: "#262626",
    // input: "#262626",
    // ring: "#a1a1a1",
    // chart1: "#4a90e2",
    // chart2: "#2cb672",
    // chart3: "#ed993c",
    // chart4: "#9c4cb2",
    // chart5: "#d83d6b",
  },
};

export const statusColors: { [key: string]: string } = {
  // Business States (ESTADOS DEL NEGOCIO)
  GENERADO: "#fbbf24", // amarillo-400
  ACTIVO: "#2563eb", // azul-600 (más visible en modo oscuro)
  ASIGNADO: "#ea580c", // naranja-600 (más fuerte)
  CANCELADO: "#dc2626", // rojo-600 (más contrastado)
  CUBIERTO: "#16a34a", // verde-600
  "CUBIERTO POR EL CLIENTE": "#14532d", // verde-900
  "CUBIERTO PARCIAL": "#4ade80", // verde-400 (más fuerte para visibilidad)

  // Loading Order States (ESTADOS ORDEN DE CARGA)
  "INICIO DE VIAJE": "#3b82f6", // azul-500
  ARRIBADO: "#38bdf8", // sky-400
  DESCARGADO: "#15803d", // verde-700 (mejor contraste)
  "DESCARGADO PARCIAL": "#34d399", // verde-400
  LIQUIDADO: "#064e3b", // verde-900 (más oscuro para diferencia)
  "NO DESCARGADO": "#6b7280", // gris-500 (mejor contraste)
  ANULADO: "#991b1b", // rojo-800 (más oscuro para diferenciar de "CANCELADO")
  "FINALIZADO PARA LP": "#7c3aed", // púrpura-500
  PENDIENTE: "#71717a", // gris-600 (más contraste con “FINALIZADO”)
  DEMORADO: "#d97706", // ámbar-600 (más fuerte)
  FINALIZADO: "#4b5563", // gris-700 (más oscuro para no confundirse con PENDIENTE)

  // Purchase Order States (ESTADOS ORDEN DE COMPRA)
  "SIN ASIGNAR": "#9ca3af", // gris-400
  GENERADA: "#fbbf24", // amarillo-400
  AUTORIZADA: "#2563eb", // azul-600 (más fuerte)
  LIQUIDADA: "#16a34a", // verde-600
  RECHAZADA: "#dc2626", // rojo-600
  FINALIZADA: "#4b5563", // gris-700

  // Document States (ESTADOS DE DOCUMENTO)
  FACTURADO: "#22c55e", // verde-500
  "FACTURADO PARCIAL": "#34d399", // verde-400
  COBRADO: "#064e3b", // verde-900 (mejor contraste)
  "COBRADO PARCIAL": "#16a34a", // verde-600
  ENTREGADO: "#06b6d4", // cyan-500 (mejor visibilidad)
  "ENTREGADO PARCIAL": "#22d3ee", // cyan-400
  DEVUELTO: "#ea580c", // naranja-600 (más fuerte)
  "DEVUELTO PARCIAL": "#f97316", // naranja-500
  CONFIRMADO: "#2563eb", // azul-600
  PAGADO: "#15803d", // verde-700
  "COBRADO PENDIENTE PAGO": "#d97706", // ámbar-600
};
