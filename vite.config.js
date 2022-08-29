import { resolve } from 'path'
import { defineConfig } from 'vite'

const root = resolve(__dirname, 'src')

const outDir = resolve(__dirname, 'dist');

function CustomHmr() {
    return {
        name: 'custom-hmr',
        enforce: 'post',
        // HMR
        handleHotUpdate({ file, server }) {
            if (file.endsWith('.json')) console.log('reloading json file...')
            server.ws.send({ type: 'full-reload', path: '*' });
        },
    }
}

export default defineConfig({
    root,

    json:{
        stringify: true, // json 파일 parse 시켜줌
    },

    build:{
        outDir, 
        emptyOutDir: true,

        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },

        rollupOptions: {
            input: {
                index: resolve(root, "index.html"),
                m_index: resolve(root, "m_index.html")

            },

            /* out 을 명시 안하면 assets 폴더 안에 다 담김 */
            output: {
                // entryFileNames: 'assets/[name]-[hash].js',   // works
                // chunkFileNames: 'assets/[name]-[hash].js',   // works
                // assetFileNames: assetInfo => { /*  사용한 소스 중 js 파일 이외의 것들 처리 (css img 등) */
                //     if (/\.css$/.test(assetInfo.name)) return 'assets/css/[name]-[hash][extname]'
                //     return 'assets/img/[name]-[hash][extname]'
                // }
            }
        },

    },
    plugins:[
        CustomHmr()
    ],
    server: {
        host : true
    }
})