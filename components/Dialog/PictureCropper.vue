<template>
  <ClientOnly>
    <Teleport to="body">
      <div class="position-fixed top-0 start-0" style="z-index: 9999999">
        <input
          ref="input"
          type="file"
          class="d-none"
          accept="image/png, image/gif, image/jpeg"
          @input="handleFileSelected"
        />
        <div
          v-if="imagCropperDialog"
          class="modal fade show modal-show"
          tabindex="-1"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-lg">
              <div class="modal-header">
                <h4 class="modal-title text-center text-xl font-semibold">
                  {{ title }}
                </h4>
              </div>
              <div class="modal-body">
                <vuePictureCropper
                  ref="cropperDialog"
                  class="cropper-box"
                  :box-style="boxStyle"
                  :img="image"
                  :options="options"
                />
              </div>
              <div class="modal-footer">
                <button
                  class="btn btn-secondary btn-sm me-2"
                  @click="handleBackgroundCropCancel"
                >
                  {{ $t('general.cancel') }}
                </button>
                <button
                  class="btn btn-primary btn-sm text-white"
                  @click="handleBackgroundCropSave"
                >
                  {{ $t('general.save') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import vuePictureCropper, { cropper } from 'vue-picture-cropper'
const { showLoading, hideLoading } = useLoading()
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  visibility: {
    type: String,
    default: '',
  },
  options: {
    type: Object,
    default: function () {
      return {}
    },
  },
})
const emit = defineEmits(['result'])

const input = ref(null)
const image = ref('')
const imagCropperDialog = ref(false)
const cropperDialog = ref()

const boxStyle = computed(() => {
  const style = {
    backgroundColor: '#f8f8f8',
    margin: 'auto',
  }
  if (window.innerWidth < 640) {
    return {
      ...style,
      width: '300px',
      height: '300px',
    }
  } else {
    return {
      ...style,
      width: '400px',
      height: '400px',
    }
  }
})

const openInput = () => {
  input.value.click()
}

const handleFileSelected = (e) => {
  const files = e.target.files[0]
  const reader = new FileReader()
  reader.onload = function (e) {
    image.value = e.target.result
    imagCropperDialog.value = true
    input.value.value = ''
  }
  reader.readAsDataURL(files)
}

const handleBackgroundCropCancel = () => {
  imagCropperDialog.value = false
  input.value.value = ''
  cropper.reset()
}

const handleBackgroundCropSave = () => {
  showLoading()
  const imgBase64 = cropper.getCroppedCanvas().toDataURL()
  cropper.reset()
  emit('result', imgBase64)
  hideLoading()
  imagCropperDialog.value = false
}

defineExpose({ openInput })
</script>

<style lang="scss" scoped>
@media (max-width: 640px) {
  .cropper-box {
    width: 100%;
    height: 100%;
  }
}
</style>
