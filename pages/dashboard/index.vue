<template>
  <div>Dashboard</div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
useSeoMeta({
  titleTemplate: (title) => {
    return `${title} | ${t('page.dashboard')}`
  },
})
</script>
