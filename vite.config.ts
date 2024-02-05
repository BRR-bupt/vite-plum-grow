import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Unocss from 'unocss/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue/macros'], // 自动导入vue和vue-router相关函数
      dts: 'src/auto-import.d.ts' // 生成 `auto-import.d.ts` 全局声明
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts'
    }),
    Unocss()
  ]
})
