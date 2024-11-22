<template>
  <div>
    <DialogBlank
      ref="dialogBlank"
      class="p-2"
      :title="$t('auth.change_password')"
      title-icon="fa-solid fa-lock"
      @hide="handleClose"
    >
      <form class="form" @submit.prevent="onSubmit">
        <div v-if="alertErrorMessage" class="alert alert-danger" role="alert">
          {{ alertErrorMessage }}
        </div>
        <div class="mb-3">
          <label class="form-label" for="Current Password">{{
            $t('auth.current_password')
          }}</label>
          <input
            v-bind="currentPassword"
            type="password"
            :placeholder="$t('auth.current_password')"
            :class="{ 'is-invalid': errors.current_password }"
            :data-vv-validate-on="['blur', 'change']"
            class="form-control"
          />
          <div class="invalid-feedback text-start">
            {{ errors.current_password }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="New Password">{{
            $t('auth.new_password')
          }}</label>
          <input
            v-bind="newPassword"
            type="password"
            :placeholder="$t('auth.new_password')"
            :class="{ 'is-invalid': errors.new_password }"
            :data-vv-validate-on="['blur', 'change']"
            class="form-control"
          />
          <div class="invalid-feedback text-start">
            {{ errors.new_password }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="Confirmation New Password">{{
            $t('auth.new_password_confirmation')
          }}</label>
          <input
            v-bind="passwordConfirmation"
            type="password"
            :placeholder="$t('auth.new_password_confirmation')"
            :class="{ 'is-invalid': errors.password_confirmation }"
            :data-vv-validate-on="['blur', 'change']"
            class="form-control"
          />
          <div class="invalid-feedback text-start">
            {{ errors.password_confirmation }}
          </div>
        </div>
        <div class="mt-4 text-end">
          <button
            type="submit"
            class="btn btn-md btn-primary text-white"
            :disabled="!meta.valid"
          >
            {{ $t('auth.update_password') }}
          </button>
        </div>
      </form>
    </DialogBlank>
  </div>
</template>

<script setup>
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import * as yup from 'yup'
import { getHttpValidationMessage } from '~/utils/common'

const emits = defineEmits(['successUpdate'])

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
  current_password: yup
    .string()
    .required()
    .min(8)
    .max(20)
    .label(t('auth.current_password')),
  new_password: yup
    .string()
    .required()
    .min(8)
    .max(20)
    .label(t('auth.new_password')),
  password_confirmation: yup
    .string()
    .required()
    .min(8)
    .max(20)
    .label(t('auth.new_password_confirmation'))
    .oneOf(
      [yup.ref('new_password'), null],
      t('auth.new_password_confirmation_not_match'),
    ),
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

setFieldValue('current_password', '')
setFieldValue('new_password', '')
setFieldValue('password_confirmation', '')

const currentPassword = defineInputBinds('current_password')
const newPassword = defineInputBinds('new_password')
const passwordConfirmation = defineInputBinds('password_confirmation')

const alertErrorMessage = ref('')
const onSubmit = handleSubmit(async (values) => {
  alertErrorMessage.value = ''
  await showLoading()
  const [service, transformer] = await Promise.all([
    useService('User'),
    useTransformer('User'),
  ])

  const req = await transformer((module) => module.updatePasswordReq(values))
  const { data, error } = await service((module) => module.updatePassword(req))
  if (data?.value) {
    hideLoading()
    emits('successUpdate', true)
  } else {
    hideLoading()
    if (error.value) {
      alertErrorMessage.value = getHttpValidationMessage(error.value.data)
    }
  }
})

const handleClose = () => {
  resetField('current_password')
  resetField('new_password')
  resetField('password_confirmation')
}

defineExpose({ show, hide })
</script>
