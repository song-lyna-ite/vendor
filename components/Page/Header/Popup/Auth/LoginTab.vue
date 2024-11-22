<template>
  <form @submit.prevent="onSubmit">
    <div class="row">
      <div class="col-sm-9 offset-sm-3">
        <div v-if="alertErrorMessage" class="alert alert-danger" role="alert">
          {{ alertErrorMessage }}
        </div>
      </div>
    </div>

    <div class="row mb-3">
      <label class="col-sm-3 col-form-label"
        >{{ $t('auth.username') }}
        <sup class="text-danger"> *</sup>
      </label>
      <div class="col-sm-9">
        <input
          v-bind="username"
          type="text"
          :placeholder="$t('auth.username')"
          :class="errors.username ? 'is-invalid' : ''"
          :data-vv-validate-on="['blur', 'change']"
          class="form-control"
        />
        <div class="invalid-feedback">
          {{ errors.username }}
        </div>
      </div>
    </div>
    <div class="row">
      <label class="col-sm-3 col-form-label"
        >{{ $t('auth.password') }}
        <sup class="text-danger"> *</sup>
      </label>
      <div class="col-sm-9 mb-3">
        <input
          v-bind="password"
          type="password"
          :placeholder="$t('auth.password')"
          :class="errors.password ? 'is-invalid' : ''"
          :data-vv-validate-on="['blur', 'change']"
          class="form-control"
        />
        <div class="invalid-feedback">
          {{ errors.password }}
        </div>
      </div>
      <div class="col-sm-9 offset-sm-3">
        <div class="row">
          <div class="col-sm-6">
            <button
              type="submit"
              class="btn btn-md btn-primary text-white w-100 mt-2"
              :disabled="meta.touched ? !meta.valid : true"
            >
              {{ $t('auth.login') }}
            </button>
          </div>
          <div class="col-sm-6">
            <button
              type="button"
              class="btn btn-md btn-secondary text-white w-100 mt-2"
              @click="setActiveTab('signup')"
            >
              {{ $t('auth.signup') }}
            </button>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12 text-start">
            <div class="text-primary forgot-pass" @click="showSendEmail">
              {{ $t('auth.forgot_your_password') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import * as yup from 'yup'
import { useAuthStore } from '~/store/auth'
import { getHttpValidationMessage } from '~/utils/common'

const emits = defineEmits([
  'tabChange',
  'successLogin',
  'hide',
  'forgotPassClick',
  'requiredVerifyOtp',
])

const { setAccessToken } = useAuthenticate()
const { showLoading, hideLoading } = useLoading()
const { setUser } = useAuthStore()
const { t } = useI18n()

const setActiveTab = (tab) => {
  emits('tabChange', tab)
}

const validationSchema = yup.object({
  username: yup
    .string()
    .required()
    .max(15)
    .matches(
      /^(?!_)(?!.*\s)[a-z][a-z0-9_]*$|^0\d{8,9}$/,
      t('auth.username_validate'),
    )
    .label(t('auth.username')),
  password: yup.string().required().min(8).max(20).label(t('auth.password')),
})
const { errors, defineInputBinds, handleSubmit, meta } = useForm({
  validationSchema,
})

const username = defineInputBinds('username')
const password = defineInputBinds('password')

const alertErrorMessage = ref('')
const onSubmit = handleSubmit(async (values) => {
  alertErrorMessage.value = ''
  showLoading()

  const [service, transformer] = await Promise.all([
    useService('Auth'),
    useTransformer('Auth'),
  ])

  const req = await transformer((module) => module.loginReq(values))
  const { data, error } = await service((module) => module.login(req))

  hideLoading()
  if (data?.value) {
    if (data.value?.data?.required_verify_otp_code) {
      emits('requiredVerifyOtp', data.value.data.provided_value)
    } else {
      const fetch = await transformer((module) => module.fetch(data.value))
      if (fetch?.access_token) {
        setAccessToken(fetch.access_token)
      }
      if (fetch?.user) {
        setUser(fetch.user)
      }

      emits('successLogin', true)
    }
  } else if (error?.value) {
    alertErrorMessage.value = getHttpValidationMessage(error.value.data)
  }
})

const showSendEmail = () => emits('forgotPassClick', true)
</script>
<style scoped lang="scss">
.forgot-pass {
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
