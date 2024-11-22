<template>
  <div>
    <span
      v-for="(site, index) in siteTitle"
      :key="index"
      :class="{ 'active-text': site.isActive }"
      >{{ site.text }}</span
    >
  </div>
  <Square />
</template>
<script setup>
import { ref } from 'vue'
import Square from '~/components/Site/Logo/Square.vue'
const siteTitle = ref([
  { text: 'I', isActive: false },
  { text: 'T', isActive: true },
  { text: 'E | ', isActive: false },
  { text: 'R', isActive: true },
  { text: 'U', isActive: false },
  { text: 'P', isActive: true },
  { text: 'P | ', isActive: false },
  { text: 'P', isActive: true },
  { text: 'latform', isActive: false },
])
</script>
<style lang="scss">
.active-text {
  color: red;
}
</style>
