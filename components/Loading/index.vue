<template>
  <Teleport to="body">
    <div
      class="position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center page-loading"
      :class="{ 'd-none': !isLoading }"
    >
      <div class="overlay" />
      <div class="spinner-border" />
      <div>Loading ...</div>
    </div>
  </Teleport>
</template>

<script setup>
const { isLoading } = useLoading()
</script>

<style lang="scss" scoped>
.page-loading {
  z-index: 999999999999;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
}
</style>
