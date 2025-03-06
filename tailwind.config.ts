
import type { Config } from "tailwindcss";
import { flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";

// Fix: Define the addVariablesForColors function before using it in plugins
function addVariablesForColors({ addBase, theme }: any) {
  try {
    // Only proceed if both addBase and theme are defined and theme has colors
    if (!addBase || !theme || typeof theme !== 'function' || !theme('colors')) {
      console.warn("Couldn't generate CSS variables from colors - missing inputs");
      return;
    }
    
    const colors = flattenColorPalette(theme("colors") || {});
    if (!colors || typeof colors !== 'object') {
      console.warn("No valid colors found in theme");
      return;
    }
    
    const newVars = Object.fromEntries(
      Object.entries(colors).map(([key, val]) => [`--${key}`, val])
    );
  
    addBase({
      ":root": newVars,
    });
  } catch (error) {
    console.error("Error in addVariablesForColors plugin:", error);
  }
}

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'aurora': {
					from: {
						backgroundPosition: "50% 50%, 50% 50%",
					},
					to: {
						backgroundPosition: "350% 50%, 350% 50%",
					},
				},
				'beam-slide': {
					'0%': {
						transform: 'translateY(-30%) rotate(-20deg) scale(2.5)',
						opacity: '0.15',
					},
					'50%': {
						transform: 'translateY(-25%) rotate(-22deg) scale(2.6)',
						opacity: '0.2',
					},
					'100%': {
						transform: 'translateY(-30%) rotate(-20deg) scale(2.5)',
						opacity: '0.15',
					},
				},
				'beam-pulse': {
					'0%': {
						transform: 'translateY(-20%) rotate(20deg) scale(2.5)',
						opacity: '0.15',
					},
					'50%': {
						transform: 'translateY(-22%) rotate(22deg) scale(2.6)',
						opacity: '0.2',
					},
					'100%': {
						transform: 'translateY(-20%) rotate(20deg) scale(2.5)',
						opacity: '0.15',
					},
				},
				'beam-glow': {
					'0%, 100%': {
						opacity: '0.2',
						transform: 'scale(1.5) rotate(-15deg)',
					},
					'50%': {
						opacity: '0.25',
						transform: 'scale(1.6) rotate(-12deg)',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'aurora': 'aurora 60s linear infinite',
				'beam-slide': 'beam-slide 8s ease-in-out infinite',
				'beam-pulse': 'beam-pulse 10s ease-in-out infinite',
				'beam-glow': 'beam-glow 10s ease-in-out infinite',
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"), 
		require("@tailwindcss/typography"),
		addVariablesForColors
	],
} satisfies Config;
