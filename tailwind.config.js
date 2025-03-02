/**
 * @format
 * @type {import('tailwindcss').Config}
 */

import defaultTheme from "tailwindcss/defaultTheme";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        general_light: ["general-light", "sans-serif"],
        general_regular: ["general-regular", "sans-serif"],
        general_semiBold: ["general-semiBold", "sans-serif"],
        general_medium: ["general-medium", "sans-serif"],
        general_bold: ["general-bold", "sans-serif"],
      },
      colors: {
        ...defaultTheme.colors,
        c_1C2F40: "#1C2F40",
        c_20415E: "#20415E",
        c_0E73D0: "#0E73D0",
        c_1F3D57: "#1F3D57",
        c_535353: "#535353",
        c_B68C4F: "#B68C4F",
        c_181818: "#181818",
        c_121516: "#121516",
        c_CCCCCC: "#CCCCCC",
        c_D9D9D9: "#D9D9D9",
        c_1C2F3E: "#1C2F3E",
        c_2C84D6: "#2C84D6",
        c_1F3A52: "#1F3A52",
        c_E0E0E0: "#E0E0E0",
        c_CACACA: "#CACACA",
        c_6B6B6B: "#6B6B6B",
        c_000000: "#000000",
        c_FFFFFF: "#FFFFFF",
        c_1F3C55: "#1F3C55",
        c_808080: "#808080",
        c_FDFDFD: "#FDFDFD",
        c_2B4359: "#2B4359",
        c_F6F8F9: "#F6F8F9",
        c_164661: "#164661",
        c_FEFEFE: "#FEFEFE",
        c_737373: "#737373",
        c_F1F1F1: "#F1F1F1",
        c_1f3a53: "#1f3a53",
        c_1e384f: "#1e384f",
        c_787878: "#787878",
        c_203c55: "#203c55",
        c_1d3346: "#1d3346",
        c_2CAB00: "#2CAB00",
        c_FCFCFC: "#FCFCFC",
        c_7C7C7C: "#7C7C7C",
        c_1f3c56: "#1f3c56",
        c_050405: "#050405",
        c_b7b7b7: "#b7b7b7",
        c_dedede: "#dedede",
        c_7f7f7f: "#7f7f7f",
        c_eeeeee: "#eeeeee",
        c_818181: "#818181",
        c_1E3A52: "#1E3A52",
        c_999999: "#999999",
        c_F8F8F8: "#F8F8F8",
        c_35A500: "#35A500",
        c_C30000: "#C30000",
        c_848484: "#848484",
        c_f9f9f9: "#f9f9f9",
        c_4c4c4c: "#4c4c4c",
        c_587c9c: "#587c9c",
        c_E97979: "#E97979",
        c_1e374e: "#1e374e",
        c_979797: "#979797",
        c_A6A6A6: "#A6A6A6",
        c_3c4d59: "#3c4d59",
        c_FF3333: "#FF3333",
        c_F4F4F4: "#F4F4F4",
        c_7D7C7D: "#7D7C7D",
        c_25D366: "#25D366",
        c_A7D5EF: "#A7D5EF",
        c_F3F4F6: "#F3F4F6",
        c_B44242: "#B44242",
        c_FAC9C9: "#FAC9C9",
        c_F1E7FF: "#F1E7FF",
        c_362351: "#362351",
        c_0D6DDE: "#0D6DDE",
        c_E9E9E9: "#E9E9E9",
        c_C0C0C0: "#C0C0C0 ",
        c_00A3FF: "#00A3FF",
        c_1F3C56: "#1F3C56",
        c_DDDDDD: "#DDDDDD",
        c_EFEFEF: "#EFEFEF",
        c_F8941D: "#F8941D",
        c_36B549: "#36B549",
        c_D81920: "#D81920",
        c_ED3131: "#ED3131",
        c_ACACAC: "#ACACAC",
        c_DCDCDC: "#DCDCDC",
        c_6A6A6A: "#6A6A6A",
        c_1F3C57: "#1F3C57",
        c_45D863: "#45D863",
        c_888888: "#888888",
        c_797979: "#797979",
        c_F3F3F3: "#F3F3F3",
        c_9E7C4F: "#9E7C4F",
        gold: "#FFD700",
        silver: "#C0C0C0",
        c_BDA585: "#BDA585",
        c_D3D3D3: "#d3d3d3",
      },
      fontSize: {
        ...defaultTheme.fontSize,
        fs_100: 100,
        fs_11: 11,
        fs_12: 12,
        fs_13: 13,
        fs_14: 14,
        fs_16: 16,
        fs_17: 17,
        fs_18: 18,
        fs_20: 20,
        fs_22: 22,
        fs_24: 24,
        fs_26: 26,
        fs_28: 28,
        fs_30: 30,
        fs_32: 32,
        fs_34: 34,
        fs_36: 36,
        fs_38: 38,
        fs_40: 40,
        fs_41: 41,
        fs_10: 10,
        fs_9: 9,
      },
      gradientColorStops: {
        ...defaultTheme.gradientColorStops,
        g_1C2F40: "#1C2F40",
        g_20415E: "#20415E",
      },
      backgroundImage: {
        "main-hero-bg": "url('/src/assets/images/marketlayout.svg')",
        "sold-out-img-eng": "url('/src/assets/images/sold-out-img-eng.png')",
        "sold-out-img-ar": "url('/src/assets/images/sold-out-img-ar.png')",
      },
    },
  },
  plugins: [],
};
