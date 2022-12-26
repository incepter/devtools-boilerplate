import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  let env = loadEnv(mode, process.cwd(), ["NODE_ENV", "EXTENSION_"]);
  return {
    define: {
      "process.env": env
    },
    plugins: [react()],
    build: {
      outDir: "build",
      assetsDir: "./",
      emptyOutDir: false,

      rollupOptions: {
        input: "src/main.ts",
        preserveEntrySignatures: "exports-only",
        output: {
          format: "umd",
          strict: false,
          preserveModules: false,
          inlineDynamicImports: false,
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].js`,
          entryFileNames: `[name].js`,
        },
      }
    }
  }
})
