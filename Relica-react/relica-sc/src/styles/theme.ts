import { ITheme } from "../interfaces/styled";

export const baseTheme: ITheme = {
  colors: {
    greyPrimary: "#939393",
    greySecondary: "#d6d6d6",
    greyLight: "#ededed",
    white: "#fff",
    black: "#000",
    blueV1: "#10a5f5",
    blueV2: "#00dbff",
    blueV3: "#00aecb",
    blueV4: "#0b91d9",
    shadow: "#00000008",
  },

  media: {
    mobileS: "320px",
    mobileL: "480px",
    tablet: "768px",
    laptop: "1024px",
    desktop: "1366px",
    desktopL: "1920px",
  },

  // in ms
  durations: {
    ms300: 300,
  },

  // z-index
  order: {
    header: 50,
    modal: 100,
  },

  //base font-size=10px
  size: {
    titleBig: "4.3rem",
    titleMedium: "4rem",
    titleSmall: "3.5rem",
    big: "2.8rem",
    medium: "2rem",
    base: "1.6rem",
    small: "1.2rem",
    little: "1rem",
  },

  gradients: {
    bluetobluev1: "linear-gradient(45deg, #00dbff, #10a5f5);",
    bluetobluev2: "linear-gradient(45deg, #00aecb, #0b91d9);",
    bluetobluev3: "linear-gradient(45deg, #10a5f5, #00dbff);",
  },

  lineHeight: {
    big: 1.5,
    medium: 1.4,
    normal: 1.2,
    small: 1,
  },

  weight: {
    bolt: 700,
    large: 600,
    medium: 500,
    normal: 400,
  },

  width: {
    full: "100%",
    half: "50%",
    fullScreen: "100vw",
    fullHeight: "100vh",
    halfHeight: "50%",
  },
};
