<template>
  <div>
    <DialogAppLogo ref="dialogBlank" class="p-2" @hide="handleClose">
      <form class="form px-5 text-center" @submit.prevent="onSubmit">
        <div class="fs-5 mb-4">
          {{ $t('auth.reset_password') }}
        </div>
        <div v-if="alertErrorMessage" class="alert alert-danger" role="alert">
          {{ alertErrorMessage }}
        </div>
        <div class="mb-3">
          <input
            v-bind="newPassword"
            type="password"
            autofocus
            :placeholder="t('auth.new_password')"
            :class="{ 'is-invalid': errors.new_password }"
            :data-vv-validate-on="['blur', 'change']"
            class="form-control"
          />
          <div class="invalid-feedback text-start">
            {{ errors.new_password }}
          </div>
        </div>
        <div>
          <input
            v-bind="passwordConfirmation"
            type="password"
            autofocus
            :placeholder="t('auth.new_password_confirmation')"
            :class="{ 'is-invalid': errors.password_confirmation }"
            :data-vv-validate-on="['blur', 'change']"
            class="form-control"
          />
          <div class="invalid-feedback text-start">
            {{ errors.password_confirmation }}
          </div>
        </div>
        <div class="mt-4">
          <button
            type="submit"
            class="btn btn-md btn-primary text-white w-100"
            :disabled="!meta.valid"
          >
            {{ $t('auth.update_password') }}
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
import { useAuthStore } from '~/store/auth'
import { getHttpValidationMessage } from '~/utils/common'

const props = defineProps({
  providedValue: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['successReset'])

const dialogBlank = ref()

const show = () => {
  dialogBlank.value.show()
}
const hide = () => {
  dialogBlank.value.hide()
}

const { setAccessToken } = useAuthenticate()
const { showLoading, hideLoading } = useLoading()
const { setUser } = useAuthStore()
const { t } = useI18n()

const validationSchema = yup.object({
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
    .label(t('auth.password_confirmation'))
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

setFieldValue('new_password', '')
setFieldValue('password_confirmation', '')

const newPassword = defineInputBinds('new_password')
const passwordConfirmation = defineInputBinds('password_confirmation')

const alertErrorMessage = ref('')
const onSubmit = handleSubmit(async (values) => {
  alertErrorMessage.value = ''
  await showLoading()
  const [service, transformer] = await Promise.all([
    useService('Auth'),
    useTransformer('Auth'),
  ])
  const { data, error } = await service((module) =>
    module.resetPassword({
      provided_value: props.providedValue,
      ...values,
    }),
  )

  if (data?.value) {
    const fetch = await transformer((module) => module.fetch(data.value))
    if (fetch?.access_token) {
      setAccessToken(fetch.access_token)
    }
    if (fetch?.user) {
      setUser(fetch.user)
    }

    hideLoading()
    emits('successReset', true)
  } else {
    hideLoading()
    if (error.value) {
      alertErrorMessage.value = getHttpValidationMessage(error.value.data)
    }
  }
})

const handleClose = () => {
  resetField('new_password')
  resetField('password_confirmation')
}

defineExpose({ show, hide })
</script>
