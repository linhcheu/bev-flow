import { MotionPlugin } from '@vueuse/motion'

export default defineNuxtPlugin((nuxtApp) => {
  // Only register if not already registered
  if (!nuxtApp.vueApp._context.directives?.motion) {
    nuxtApp.vueApp.use(MotionPlugin)
  }
})
