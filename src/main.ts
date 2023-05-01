import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, SessionStorage, Notify } from 'quasar'

import App from './App.vue'
import router from './router'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import './assets/main.css'

const app = createApp(App)
  .use(Quasar, {
    plugins: { SessionStorage, Notify }
  })
  .use(createPinia())
  .use(router)

app.mount('#app')
