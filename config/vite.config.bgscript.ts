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
        input: "src/parser/index.ts",
        preserveEntrySignatures: "exports-only",
        output: {
          format: "umd",
          strict: false,
          preserveModules: false,
          inlineDynamicImports: false,
          chunkFileNames: `bgScript.js`,
          assetFileNames: `bgScript.js`,
          entryFileNames: `bgScript.js`,
        },
      }
    }
  }
})
