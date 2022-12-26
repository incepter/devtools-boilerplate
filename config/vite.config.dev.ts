import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(() => {
  let env = loadEnv("development", process.cwd(), ["NODE_ENV", "EXTENSION_"]);
  return {
    define: {
      "process.env": env
    },
    plugins: [react()],
    build: {
      outDir: "build",
      assetsDir: "./",
      rollupOptions: {
        output: {
          format: "umd",
        },
      }
    }
  }
})
