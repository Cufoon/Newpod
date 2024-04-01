import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { vitePluginForArco } from '@arco-plugins/vite-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vitePluginForArco({ style: 'css' })],
  resolve: {
    alias: {
      '@': '/src',
      $assets: '/src/assets',
      $components: '/src/components',
      $hooks: '/src/hooks',
      $pages: '/src/pages',
      $service: '/src/service',
      $src: '/src',
      $store: '/src/store',
      $utils: '/src/utils'
    }
  },
  css: {
    modules: {
      exportGlobals: true,
      generateScopedName: '[hash:base64:12]',
      localsConvention: 'camelCaseOnly'
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://dnspod.tencentcloudapi.com/',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          host: 'dnspod.tencentcloudapi.com',
          'content-type': 'application/json; charset=utf-8'
        }
      }
    }
  },
  preview: {
    proxy: {
      '/api': {
        target: 'https://dnspod.tencentcloudapi.com/',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          host: 'dnspod.tencentcloudapi.com',
          'content-type': 'application/json; charset=utf-8'
        }
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          arco_icon: ['@arco-design/web-react/icon'],
          arco_button: ['@arco-design/web-react/es/Button'],
          arco_form: ['@arco-design/web-react/es/Form'],
          arco_list: ['@arco-design/web-react/es/List'],
          arco_select: ['@arco-design/web-react/es/Select'],
          // arco_image: ['@arco-design/web-react/es/Image'],
          // arco_input: ['@arco-design/web-react/es/Input'],
          // arco_input_number: ['@arco-design/web-react/es/InputNumber'],
          // arco_message: ['@arco-design/web-react/es/Message'],
          // arco_modal: ['@arco-design/web-react/es/Modal'],
          // arco_popconfirm: ['@arco-design/web-react/es/Popconfirm'],
          // arco_radio: ['@arco-design/web-react/es/Radio'],
          arco: ['@arco-design/web-react'],
          fortawesome: [
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-regular-svg-icons',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/react-fontawesome'
          ],
          // axios: ['axios'],
          // classnames: ['classnames'],
          // localforage: ['localforage'],
          // qs: ['qs'],
          // uuid: ['uuid'],
          react: [
            'axios',
            'classnames',
            'localforage',
            'qs',
            'react',
            'react-dom',
            'uuid'
          ],
          react_router: ['react-router-dom']
        }
      }
    }
  }
});
