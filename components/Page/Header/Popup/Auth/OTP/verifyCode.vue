<template>
  <div>
    <DialogAppLogo ref="dialogBlank" class="p-2" @hide="handleClose">
      <form class="form px-5 text-center" @submit.prevent="onSubmit">
        <div>
          <div class="fs-5 mb-3">
            {{ $t('auth.otp_verification') }}
          </div>
          <div class="mb-3 verify-code-note">
            {{ $t('auth.otp_verification_description') }}
          </div>
        </div>
        <div>
          <input
            v-bind="code"
            type="text"
            autofocus
            :placeholder="t('auth.otp_code')"
            :class="{ 'is-invalid': errors.code }"
            :data-vv-validate-on="['blur', 'change']"
            class="form-control"
          />
          <div class="invalid-feedback text-start">
            {{ errors.code }}
          </div>
        </div>
        <div class="mt-4">
          <button
            v-if="isResend"
            type="button"
            class="btn btn-md btn-success text-white"
            @click="handleResend"
          >
            {{ $t('auth.resend') }}
          </button>
          <button
            v-else
            type="submit"
            class="btn btn-md btn-primary text-white w-100"
            :disabled="!meta.valid"
          >
            {{ $t('auth.verify_and_continue') }}
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

const props = defineProps({
  actionType: {
    type: String,
    default: '',
  },
  providedValue: {
    type: String,
    default: '',
  },
  twoFactorMethod: {
    type: String,
    default: '',
  },
  twoFactorInfo: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['successVerify'])

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
  code: yup.string().required().max(6).label(t('auth.otp_code')),
})

const {
  errors,
  defineInputBinds,
  handleSubmit,
  meta,
  setFieldValue,
  resetField,
  setFieldError,
} = useForm({
  validationSchema,
})

setFieldValue('code', '')
const code = defineInputBinds('code')

const isResend = ref(false)
const onSubmit = handleSubmit(async (values) => {
  await showLoading()
  const [service, transformer] = await Promise.all([
    useService('Auth'),
    useTransformer('Auth'),
  ])

  const req = await transformer((module) =>
    module.verifyOTPCodeReq({
      action_type: props.actionType,
      provided_value: props.providedValue,
      verify_code: values.code,
      two_factor_method: props.twoFactorMethod,
      two_factor_info: props.twoFactorInfo,
    }),
  )
  const { data, error } = await service((module) => module.verifyOTPCode(req))

  if (data?.value) {
    hideLoading()
    emits('successVerify', {
      auth: data.value,
      action_type: props.actionType,
      provided_value: props.providedValue,
    })
  } else {
    hideLoading()
    const errorRes = error.value
    if (errorRes) {
      setFieldError('code', errorRes.data.message)
      isResend.value = false
      if (errorRes.data?.is_expired) {
        isResend.value = true
      }
    }
  }
})

const handleClose = () => {
  resetField('code')
}

const handleResend = async () => {
  await showLoading()
  const service = await useService('Auth')
  const { data, error } = await service((module) =>
    module.sendOTPCode({ provided_value: props.providedValue }),
  )

  const swal = useSwal()
  if (data?.value) {
    hideLoading()
    isResend.value = false
    resetField('code')
    swal.info('', t('auth.new_otp_code_sent_success'))
  } else {
    hideLoading()
    if (error?.value) {
      swal.error('', error.value.data.message)
    }
  }
}

onMounted(() => {
  isResend.value = false
})

defineExpose({ show, hide })
</script>
<style lang="scss" scoped>
.verify-code-note {
  font-size: 14px;
  font-weight: 400;
}
</style>
