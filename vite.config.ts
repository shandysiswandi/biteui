import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const getPackageName = (id: string) => {
  const parts = id.split("node_modules/")
  if (parts.length < 2) return null
  const target = parts[parts.length - 1]
  if (target.startsWith(".pnpm")) {
    const pnpmIndex = target.lastIndexOf("node_modules/")
    if (pnpmIndex === -1) return null
    const pnpmTarget = target.slice(pnpmIndex + "node_modules/".length)
    const pnpmSegments = pnpmTarget.split("/")
    if (!pnpmSegments.length) return null
    if (pnpmSegments[0].startsWith("@")) {
      return pnpmSegments.length >= 2 ? `${pnpmSegments[0]}/${pnpmSegments[1]}` : null
    }
    return pnpmSegments[0]
  }
  const segments = target.split("/")
  if (!segments.length) return null
  if (segments[0].startsWith("@")) {
    return segments.length >= 2 ? `${segments[0]}/${segments[1]}` : null
  }
  return segments[0]
}

// Split vendor code to keep production chunks under the warning threshold.
const manualChunks = (id: string) => {
  if (!id.includes("node_modules")) return
  const pkg = getPackageName(id)
  if (!pkg) return

  if (pkg === "react" || pkg === "react-dom" || pkg === "react-router") {
    return "react"
  }
  if (pkg.startsWith("@radix-ui/")) return "radix-ui"
  if (pkg === "@tanstack/react-table") return "table"
  if (pkg === "recharts") return "charts"
  if (pkg === "motion" || pkg === "embla-carousel-react") return "motion"
  if (pkg === "react-hook-form" || pkg === "@hookform/resolvers" || pkg === "zod") {
    return "forms"
  }
  if (pkg === "@tanstack/react-query" || pkg === "zustand" || pkg === "next-themes") {
    return "state"
  }
  if (pkg === "date-fns" || pkg === "dayjs" || pkg === "react-day-picker") return "date"
  if (pkg === "clsx" || pkg === "tailwind-merge" || pkg === "class-variance-authority") {
    return "styling"
  }
  if (
    pkg === "cmdk" ||
    pkg === "input-otp" ||
    pkg === "lucide-react" ||
    pkg === "qrcode.react" ||
    pkg === "sonner" ||
    pkg === "vaul" ||
    pkg === "react-resizable-panels"
  ) {
    return "ui"
  }

  return "vendor"
}

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
  ],
  server: {
    host: "localhost",
    port: 3330,
    strictPort: true,
  },
  preview: {
    host: "localhost",
    port: 3331,
    strictPort: true,
  },
})
