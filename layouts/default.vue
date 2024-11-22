<template>
  <div>
    <Loading />
    <PageHeader />
    <main ref="mainContent">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/store/auth'
import { onMounted } from 'vue'

const { isLoggedIn } = useAuthenticate()

onMounted(async () => {
  if (isLoggedIn.value) {
    await useAuthStore().getMe()
  }
})
</script>
