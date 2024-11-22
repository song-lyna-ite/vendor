<template>
  <div>
    <DialogAppLogo ref="dialogBlank" class="p-2" @hide="handleClose">
      <form class="form px-5 text-center" @submit.prevent="onSubmit">
        <div>
          <div class="fs-5 mb-3">
            {{ $t('auth.forgot_password') }}
          </div>
          <div class="mb-3 send-pass-note">
            {{ $t('auth.forgot_password_description') }}
          </div>
        </div>
        <div v-if="alertErrorMessage" class="alert alert-danger" role="alert">
          {{ alertErrorMessage }}
        </div>
        <div>
          <input
            v-bind="providedValue"
            type="text"
            autofocus
            :placeholder="$t('auth.phone_or_email')"
            :class="{ 'is-invalid': errors.provided_value }"
            :data-vv-validate-on="['blur', 'change']"
            class="form-control"
          />
          <div class="invalid-feedback text-start">
            {{ errors.provided_value }}
          </div>
        </div>
        <div class="mt-4">
          <button
            type="submit"
            class="btn btn-md btn-primary text-white w-100"
            :disabled="!meta.valid"
          >
            {{ $t('general.submit') }}
          </button>
        </div>
      </form>
    </DialogAppLogo>
  </div>
</template>

<script setup>
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import * as yup from 'yup'
import { getHttpValidationMessage } from '~/utils/common'

const emits = defineEmits(['successSend'])

const dialogBlank = ref()

const show = () => {
  dialogBlank.value.show()
}
const hide = () => {
  dialogBlank.value.hide()
}

const { showLoading, hideLoading } = useLoading()
const { t } = useI18n()

const validationSchema = yup.object({
  provided_value: yup
    .string()
    .required()
    .test('providedValue', t('auth.phone_or_email_invalid'), (value) => {
      const phoneRegex = /^0\d{8,9}$/
      const emailRegex = /^[^\s@]+@[^\s@]+(\.[^\s@]+)+$/
      return emailRegex.test(value)
    })
    .label(t('auth.phone_or_email')),
})

const {
  errors,
  defineInputBinds,
  handleSubmit,
  meta,
  setFieldValue,
  resetField,
} = useForm({
  validationSchema,
})

setFieldValue('provided_value', '')
const providedValue = defineInputBinds('provided_value')

const alertErrorMessage = ref('')
const onSubmit = handleSubmit(async (values) => {
  alertErrorMessage.value = ''
  await showLoading()
  const service = await useService('Auth')
  const { data, error } = await service((module) => module.sendOTPCode(values))

  if (data?.value) {
    hideLoading()
    emits('successSend', values.provided_value)
  } else {
    hideLoading()
    if (error.value) {
      alertErrorMessage.value = getHttpValidationMessage(error.value.data)
    }
  }
})

const handleClose = () => {
  resetField('provided_value')
}

defineExpose({ show, hide })
</script>
<style lang="scss" scoped>
.send-pass-note {
  font-size: 14px;
  font-weight: 400;
}
</style>
