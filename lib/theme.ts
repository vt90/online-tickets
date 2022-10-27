import {createTheme} from "@mui/material/styles";
import createCache from "@emotion/cache";

const isBrowser = typeof document !== 'undefined';

export const COLORS = [
    '#A3A1FB',
    '#EC405D',
    '#5EE2A0',
    '#FEC163',
    '#39c1e8',
    '#FFA177',
    '#f53939',
    '#3a416f',
];

export const theme = createTheme({
    palette: {
        primary: {
            main: "#ec405d",
        },
        secondary: {
            main: "#7b819a",
        },
        text: {
            primary: '#3e3e3e',
            secondary: '#7b809a',
        },
        background: {
            default: '#f0f2f5',
            paper: '#ffffff',
        },

    },
    typography: {
        fontFamily: [
            "Gilroy",
            "Poppins",
            "Arial",
            "sans-serif",
        ].join(","),
    },
    components: {
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    boxShadow: '0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
                    minWidth: '40vh',
                }
            },
        },

    }
});

// On the client side, Create a meta tag at the top of the <head> and set it as insertionPoint.
// This assures that MUI styles are loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
export const createEmotionCache = () => {
    let insertionPoint;

    if (isBrowser) {
        const emotionInsertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');
        insertionPoint = emotionInsertionPoint ?? undefined;
    }

    // @ts-ignore
    return createCache({key: 'mui-style', insertionPoint});
}
