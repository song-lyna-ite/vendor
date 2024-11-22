export const useProductStore = defineStore('product', () => {
  const product = ref({});

  const getProduct = async () => {
    const service = await useService('Product');

    const { data, error } = await service((module) => module.getProduct());
    if (data) {
      product.value = data;
    } else if (error) {
      console.error('Error fetching product:', error);
    }
  };

  return { product, getProduct };
});
