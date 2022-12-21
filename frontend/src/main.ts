import { createApp } from 'vue'
import './style.css'
import router from './router/router';
import { createPinia } from 'pinia'
import { vfmPlugin } from 'vue-final-modal'
import App from './App.vue'

createApp(App)
    .use(router)
    .use(vfmPlugin({
        key: '$vfm',
        componentName: 'VueFinalModal',
        dynamicContainerName: 'ModalsContainer'
    }))
    .use(createPinia())
    .mount('#app')
