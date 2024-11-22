export default defineNuxtRouteMiddleware(() => {
  const { value: token } = useCookie('token')
  if (token) {
    return navigateTo('/dashboard')
  }
})
