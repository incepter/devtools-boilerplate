import {defineConfig, loadEnv} from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  let env = loadEnv(mode, process.cwd(), ["NODE_ENV", "EXTENSION_"]);
  return {
    define: {
      "process.env": env
    },
    build: {
      outDir: "build",
      assetsDir: "./",
      emptyOutDir: false,

      rollupOptions: {
        input: "src/bg/background.ts",
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
