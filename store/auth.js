export const useAuthStore = defineStore('auth', () => {
  const user = ref({})

  const getMe = async () => {
    const [service, transformer] = await Promise.all([
      useService('User'),
      useTransformer('User'),
    ])

    const { data, error } = await service((module) => module.getMe())
    if (error.value?.statusCode === 401) {
      const { setAccessToken } = useAuthenticate()
      setAccessToken(null)
    }
    const res = await transformer((module) => module.fetch(data.value))
    if (res) {
      user.value = res
    }
  }

  const setUser = (value) => {
    user.value = value
  }

  return { user, getMe, setUser }
})
