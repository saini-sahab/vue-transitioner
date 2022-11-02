import { resolve } from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'


export default defineConfig( {
  plugins: [
    vue(),
    dts( {
      insertTypesEntry: true,
      skipDiagnostics: false,
      logDiagnostics: true,
    } ),
  ],

  build: {
    cssCodeSplit: true,
    lib: {
      entry: resolve( __dirname, './src/main.ts' ),
      name: 'VueTransitioner',
    },
    rollupOptions: {
      external: [
        'vue',
      ],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },

  define: {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    VERSION: JSON.stringify( require( './package.json' ).version ),
  },
} )
