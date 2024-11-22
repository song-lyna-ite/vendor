<template>
  <header class="top-header bg-primary text-white">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <router-link to="/map" class="text-white">
            <h1 class="h4 mb-0 ms text-white">Home</h1>
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const { showLoading, hideLoading } = useLoading()
const { t } = useI18n()
</script>
<style lang="scss" scoped>
.profile-img {
  cursor: pointer;
}
</style>
