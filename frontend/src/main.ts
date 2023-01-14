import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from './router/router';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { vfmPlugin } from 'vue-final-modal'
import "vue-connect-wallet/dist/style.css";
import VueCookies from 'vue3-cookies'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
    .use(router)
    .use(vfmPlugin({
        key: '$vfm',
        componentName: 'VueFinalModal',
        dynamicContainerName: 'ModalsContainer'
    }))
    .use(pinia)
    .use(VueCookies)
    .mount('#app')
