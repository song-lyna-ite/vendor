<template>
  <div class="container-fluid home-content">
    <button @click="navigateTo('/profile')">Go to Dashboard</button>
    <div class="block text-center" m="t-4">
      <span class="demonstration">Switch when indicator is clicked</span>
      <el-carousel trigger="click" height="150px">
        <el-carousel-item v-for="item in 4" :key="item">
          <h3 class="small justify-center" text="2xl">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div v-if="product" class="mt-4">
      <h2>Fetched Product</h2>
      <pre>{{ product }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProductStore } from "~/store/product.js";

useSeoMeta({ title: "ITE | Home" });

const product = ref(null);

onMounted(async () => {
  const productStore = useProductStore();
  await productStore.getProduct();
  product.value = productStore.product;
});
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
