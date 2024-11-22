<template>
  <img
    :src="logo"
    :width="getWidth"
    :height="getHeight"
    class="d-inline-block align-top img-thumbnail logo-img"
  />
</template>
<script setup>
const props = defineProps({
  width: {
    type: Number,
    default: 100,
  },
  height: {
    type: Number,
    default: 60,
  },
})

const logo = computed(() => {
  return '/logo/site/square.png'
})

const getWidth = computed(() => {
  return props.width
})

const getHeight = computed(() => {
  return props.height
})
</script>
<style scoped>
.logo-img {
  cursor: pointer;
}
.img-thumbnail {
  border: none !important;
}
</style>
