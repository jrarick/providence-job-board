import type { Config } from "tailwindcss"

export default {
	darkMode: ["class"],
	content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["ibm-plex-sans", "system-ui", "sans-serif"],
				display: ["brandon-grotesque", "sans-serif"],
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			colors: {
				"prov-blue": {
					"50": "#f6f7f9",
					"100": "#eceff2",
					"200": "#d5dbe2",
					"300": "#afbcca",
					"400": "#8498ac",
					"500": "#657b92",
					"600": "#556980",
					"700": "#425162",
					"800": "#394553",
					"900": "#333c47",
					"950": "#22272f",
				},
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				body: {
					DEFAULT: "hsl(var(--body))",
					foreground: "hsl(var(--body-foreground))",
				},
				footer: {
					DEFAULT: "hsl(var(--footer))",
					foreground: "hsl(var(--footer-foreground))",
				},
				longform: {
					DEFAULT: "hsl(var(--longform))",
					foreground: "hsl(var(--longform-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
			},
			typography: () => ({
				"prov-blue": {
					css: {
						"--tw-prose-body": "#556980",
						"--tw-prose-headings": "#556980",
						"--tw-prose-lead": "#556980",
						"--tw-prose-links": "#3b82f6",
						"--tw-prose-bold": "#556980",
						"--tw-prose-counters": "#556980",
						"--tw-prose-bullets": "#8498ac",
						"--tw-prose-hr": "#afbcca",
						"--tw-prose-quotes": "#556980",
						"--tw-prose-quote-borders": "#afbcca",
						"--tw-prose-captions": "#556980",
						"--tw-prose-code": "#556980",
						"--tw-prose-pre-code": "#eceff2",
						"--tw-prose-pre-bg": "#556980",
						"--tw-prose-th-borders": "#afbcca",
						"--tw-prose-td-borders": "#d5dbe2",
						"--tw-prose-invert-body": "#d5dbe2",
						"--tw-prose-invert-headings": "#ffffff",
						"--tw-prose-invert-lead": "#afbcca",
						"--tw-prose-invert-links": "#ffffff",
						"--tw-prose-invert-bold": "#ffffff",
						"--tw-prose-invert-counters": "#8498ac",
						"--tw-prose-invert-bullets": "#556980",
						"--tw-prose-invert-hr": "#556980",
						"--tw-prose-invert-quotes": "#eceff2",
						"--tw-prose-invert-quote-borders": "#556980",
						"--tw-prose-invert-captions": "#8498ac",
						"--tw-prose-invert-code": "#ffffff",
						"--tw-prose-invert-pre-code": "#afbcca",
						"--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
						"--tw-prose-invert-th-borders": "#556980",
						"--tw-prose-invert-td-borders": "#556980",
					},
				},
			}),
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/forms"),
		require("@tailwindcss/typography"),
	],
} satisfies Config
