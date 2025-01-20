import type {Config} from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            animation: {
                fivePoints: "fivePoints 60s linear infinite",
                rotateFlash: "rotateFlash 6s ease-in-out infinite",
                suiEasyOut: "suiEasyOut 1s linear 2s forwards",
                circleEasyIn: "circleEasyIn 2s ease-in forwards",
            },
            keyframes: {
                fivePoints: {
                    '0%, 100%': {
                        top: "-50%",
                        left: "-50%",
                        opacity: "0.6"
                    },
                    '10%': {
                        top: "-100%",
                        left: "0%",
                        opacity: "0.1"
                    },
                    '20%': {
                        top: "-50%",
                        left: "50%",
                        opacity: "0.6"
                    },
                    '30%': {
                        opacity: "0.1",
                    },
                    '40%': {
                        top: "50%",
                        left: "-50%",
                        opacity: "0.6"
                    },
                    '50%': {
                        opacity: "0.1",
                    },
                    '60%': {
                        top: "-100%",
                        left: "0%",
                        opacity: "0.6"
                    },
                    '70%': {
                        opacity: "0.1",
                    },
                    '80%': {
                        top: "50%",
                        left: "50%",
                        opacity: "0.6"
                    },
                    '90%': {
                        opacity: "0.1",
                    },
                },
                rotateFlash: {
                    "0%, 100%": {
                        transform: "rotateY(0deg)",
                        opacity: "0.8"
                    },
                    "25%": {
                        opacity: "0.2",
                    },
                    "50%": {
                        transform: "rotateY(720deg)",
                        opacity: "0.8"
                    },
                    "75%": {
                        opacity: "0.2",
                    },
                },
                suiEasyOut: {
                    "0%": {
                        opacity: "0.8",
                    },
                    "100%": {
                        opacity: "0",
                    }
                },
                circleEasyIn: {
                    "0%": {
                        opacity: "0",
                    },
                    "100%": {
                        opacity: "1",
                    }
                }
            }
        },
    },
    plugins: [],
} satisfies Config;
