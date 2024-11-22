import { useAuthPopupStore } from '~/store/auth-popup'

export const useHttp = (url, options) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.serverApiUrl + '/' + config.public.apiVersion
  const cookie = useCookie('token')
  const token = cookie.value
  const { showLoginPopup } = useAuthPopupStore()
  options = {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-SSDAP-Locale': 'en',
    },
    async onResponseError({ request, response, options }) {
      if (response.status === 401) {
        cookie.value = null
        await showLoginPopup()
      } else if (response.status !== 422) {
        if (await response?._data?.message) {
          const swal = await useSwal()
          await swal.error('', response._data.message)
        }
      }
    },
  }
  return useFetch(url, { baseURL, ...options })
}
