<template>
  <div class="container-fluid home-content">
    <button @click="navigateTo('/profile')">Go to Dashboard</button>
    <h1>Hell world New world</h1>
    <div v-if="product" class="mt-4">
      <h2>Fetched Product</h2>
      <div class="d-flex flex-wrap" v-for="items in product" :key="items.limit">
        <div class="d-flex" v-for="item in items.products" :key="item.id" style="flex: 1 1 300px; padding: 10px;">
          <el-card style="max-width: 100%">
            <template #header>{{ item.title }}</template>
            <img :src="item.thumbnail" style="width: 100%" />
          </el-card>
        </div>
      </div>
    </div>
    <div v-else>
      <SkeletonProduct />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from '~/store/product.js'

useSeoMeta({ title: 'ITE | Home' })

const product = ref(null)

onMounted(async () => {
  const productStore = useProductStore()
  await productStore.getProduct()
  product.value = productStore.product
})
</script>

<style scoped>

h3 {
  color: #475669;
  font-size: 1.5rem;
}

p {
  color: #555;
}

strong {
  font-weight: bold;
}
</style>
