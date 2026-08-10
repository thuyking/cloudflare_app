import { ConfigProvider, theme } from "antd";
import AppRouter from "./router";

const { darkAlgorithm } = theme;

const appTheme = {
  algorithm: darkAlgorithm,
  token: {
    colorPrimary: "#B6FF3B",
    colorInfo: "#38BDF8",
    colorSuccess: "#34D399",
    colorWarning: "#FBBF24",
    colorError: "#F87171",
    colorBgBase: "#070A0D",
    colorBgContainer: "#0D1117",
    colorBgElevated: "#141A21",
    colorBgLayout: "#070A0D",
    colorBorder: "#26313D",
    colorBorderSecondary: "#1A222C",
    colorText: "#F4F7FA",
    colorTextSecondary: "#A7B0BC",
    colorTextTertiary: "#74808E",
    colorLink: "#B6FF3B",
    colorLinkHover: "#C8FF66",
    colorLinkActive: "#9FE62E",
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    controlHeight: 40,
    controlHeightLG: 44,
    controlHeightSM: 32,
    controlOutline: "rgba(182, 255, 59, 0.24)",
    controlItemBgActive: "rgba(182, 255, 59, 0.12)",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 14,
    lineHeight: 1.5,
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 8,
      primaryColor: "#071006",
      colorPrimaryHover: "#C8FF66",
      colorPrimaryActive: "#9FE62E",
      fontWeight: 650,
    },
    Card: {
      colorBgContainer: "#0D1117",
      colorBorderSecondary: "#26313D",
      borderRadiusLG: 12,
      paddingLG: 24,
    },
    Layout: {
      bodyBg: "#070A0D",
      headerBg: "#0D1117",
      siderBg: "#0D1117",
      triggerBg: "#141A21",
      triggerColor: "#F4F7FA",
    },
    Menu: {
      darkItemBg: "transparent",
      darkItemColor: "#A7B0BC",
      darkItemHoverBg: "rgba(255, 255, 255, 0.045)",
      darkItemHoverColor: "#F4F7FA",
      darkItemSelectedBg: "rgba(182, 255, 59, 0.12)",
      darkItemSelectedColor: "#F4F7FA",
      itemBorderRadius: 8,
      itemHeight: 44,
    },
    Table: {
      colorBgContainer: "#0D1117",
      colorFillAlter: "#141A21",
      colorBorderSecondary: "#26313D",
      headerBg: "#141A21",
      headerColor: "#F4F7FA",
      rowHoverBg: "#141A21",
    },
    Tag: {
      borderRadiusSM: 999,
      defaultBg: "#141A21",
      defaultColor: "#A7B0BC",
    },
  },
};

export default function App() {
  return (
    <ConfigProvider theme={appTheme}>
      <AppRouter />
    </ConfigProvider>
  );
}
