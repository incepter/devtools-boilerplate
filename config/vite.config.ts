import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import copy from 'rollup-plugin-copy'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  let env = loadEnv(mode, process.cwd(), ["NODE_ENV", "EXTENSION_"]);
  return {
    define: {
      "process.env": env,
    },
    plugins: [
      react(),
      copy({
        hook: "writeBundle",
        targets: [
          {
            src: 'src/manifest/manifest.json',
            dest: 'build',
            transform: content => content
              .toString()
              // .replace('__version__', version)
              .replace('EXTENSION_AUTHOR', env.EXTENSION_AUTHOR)
              .replace('EXTENSION_LIB_DISPLAY_NAME', env.EXTENSION_LIB_DISPLAY_NAME)
              .replace('EXTENSION_LIB_DESCRIPTION', env.EXTENSION_LIB_DESCRIPTION)
          },
        ]
      }),
    ],
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
});
