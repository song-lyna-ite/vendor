<template>
  <Teleport to="body">
    <div v-if="isModalOpen" class="modal fade show modal-show" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content" :class="props.class">
          <div v-if="!props.hideHeader" class="modal-header">
            <i
              v-if="props.titleIcon && !props.title"
              :class="props.titleIcon"
              class="me-2"
            />
            <h4 v-if="props.title" class="modal-title">
              <i v-if="props.titleIcon" :class="props.titleIcon" class="me-2" />
              <span>{{ props.title }}</span>
            </h4>
            <button type="button" class="btn-close" @click="hide" />
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  titleIcon: {
    type: String,
    default: '',
  },
  hideHeader: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['hide'])

const isModalOpen = ref(false)

const show = () => {
  isModalOpen.value = true
}

const hide = () => {
  isModalOpen.value = false
  emit('hide')
}

defineExpose({ show, hide })
</script>
