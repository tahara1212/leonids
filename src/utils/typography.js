import Typography from "typography"
import theme from "typography-theme-github"

theme.overrideThemeStyles = () => {
  return {
    a: {
      color: "var(--textLink)",
    },
    // gatsby-remark-autolink-headers - don't underline when hidden
    "a.anchor": {
      boxShadow: "none",
    },
    // gatsby-remark-autolink-headers - use theme colours for the link icon
    'a.anchor svg[aria-hidden="true"]': {
      stroke: "var(--textLink)",
    },
    hr: {
      background: "var(--hr)",
    },
  }
}

theme.googleFonts = [
  {
    name: "Noto+Sans+JP",
    styles: ["400"],
  }
]

const typography = new Typography(theme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
