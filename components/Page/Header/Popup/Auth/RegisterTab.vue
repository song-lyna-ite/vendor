<template>
  <form @submit.prevent="onSubmit">
    <div v-if="alertErrorMessage" class="alert alert-danger" role="alert">
      {{ alertErrorMessage }}
    </div>
    <div class="row mb-3">
      <label class="col-sm-4 col-form-label"
        >{{ $t('auth.last_name') }} <sup class="text-danger"> *</sup></label
      >
      <div class="col-sm-8">
        <input
          v-bind="lastName"
          type="text"
          :placeholder="$t('auth.last_name')"
          :class="errors.last_name ? 'is-invalid' : ''"
          :data-vv-validate-on="['blur', 'change']"
          class="form-control"
        />
        <div class="invalid-feedback">
          {{ errors.last_name }}
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-sm-4 col-form-label"
        >{{ $t('auth.first_name') }} <sup class="text-danger"> *</sup></label
      >
      <div class="col-sm-8">
        <input
          v-bind="firstName"
          type="text"
          :placeholder="$t('auth.first_name')"
          :class="errors.first_name ? 'is-invalid' : ''"
          :data-vv-validate-on="['blur', 'change']"
          class="form-control"
        />
        <div class="invalid-feedback">
          {{ errors.first_name }}
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-sm-4 col-form-label"
        >{{ $t('auth.gender') }} <sup class="text-danger"> *</sup></label
      >
      <div class="col-sm-8">
        <select
          v-bind="gender"
          :class="errors.gender ? 'is-invalid' : ''"
          :data-vv-validate-on="['blur', 'change']"
          class="form-select"
        >
          <option value="male">
            {{ $t('auth.male') }}
          </option>
          <option value="female">
            {{ $t('auth.female') }}
          </option>
          <option value="">
            {{ $t('auth.other_gender') }}
          </option>
        </select>
        <div class="invalid-feedback">
          {{ errors.gender }}
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-sm-4 col-form-label">{{
        $t('auth.phone_number')
      }}</label>
      <div class="col-sm-8">
        <input
          v-bind="phoneNumber"
          type="text"
          :placeholder="$t('auth.phone_number')"
          :class="errors.phone_number ? 'is-invalid' : ''"
          :data-vv-validate-on="['blur', 'change']"
          class="form-control"
          min="0"
        />
        <div class="invalid-feedback">
          {{ errors.phone_number }}
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-sm-4 col-form-label"
        >{{ $t('auth.email_address') }} <sup class="text-danger"> *</sup></label
      >
      <div class="col-sm-8">
        <input
          v-bind="email"
          type="email"
          :placeholder="$t('auth.email_address')"
          :class="errors.email ? 'is-invalid' : ''"
          :data-vv-validate-on="['blur', 'change']"
          class="form-control"
        />
        <div class="invalid-feedback">
          {{ errors.email }}
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-sm-4 col-form-label"
        >{{ $t('auth.username') }} <sup class="text-danger"> *</sup></label
      >
      <div class="col-sm-8">
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
    <div class="row mb-3">
      <label class="col-sm-4 col-form-label"
        >{{ $t('auth.password') }} <sup class="text-danger"> *</sup></label
      >
      <div class="col-sm-8">
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
    </div>
    <div class="row mb-3">
      <label class="col-sm-4 col-form-label"
        >{{ $t('auth.confirm') }} <sup class="text-danger"> *</sup></label
      >
      <div class="col-sm-8">
        <input
          v-bind="passwordConfirmation"
          type="password"
          :placeholder="$t('auth.password_confirmation')"
          :class="errors.password_confirmation ? 'is-invalid' : ''"
          :data-vv-validate-on="['blur', 'change']"
          class="form-control"
        />
        <div class="invalid-feedback">
          {{ errors.password_confirmation }}
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-sm-4 col-form-label"
        >{{ $t('auth.register_as') }} <sup class="text-danger"> *</sup></label
      >
      <div class="col-sm-8">
        <select
          v-bind="userType"
          :class="errors.user_type ? 'is-invalid' : ''"
          :data-vv-validate-on="['blur', 'change']"
          class="form-select"
        >
          <option value="" disabled>
            {{ $t('auth.user_type') }}
          </option>
          <option value="owner">
            {{ $t('auth.owner') }}
          </option>
          <option value="public_user">
            {{ $t('auth.public_user') }}
          </option>
        </select>
        <div class="invalid-feedback">
          {{ errors.user_type }}
        </div>
      </div>
    </div>
    <template v-if="userType.value == UserType.OWNER">
      <div class="row mb-3">
        <label class="col-sm-4 col-form-label"
          >{{ $t('auth.position') }} <sup class="text-danger"> *</sup></label
        >
        <div class="col-sm-8">
          <input
            v-bind="position"
            type="text"
            :placeholder="$t('auth.position')"
            :class="errors.position ? 'is-invalid' : ''"
            :data-vv-validate-on="['blur', 'change']"
            class="form-control"
          />
          <div class="invalid-feedback">
            {{ errors.position }}
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-sm-4 col-form-label"
          >{{ $t('auth.government_institution') }}
          <sup class="text-danger"> *</sup></label
        >
        <div class="col-sm-8">
          <input
            v-bind="governmentInstitution"
            type="text"
            :placeholder="$t('auth.government_institution')"
            :class="errors.government_institution ? 'is-invalid' : ''"
            :data-vv-validate-on="['blur', 'change']"
            class="form-control"
          />
          <div class="invalid-feedback">
            {{ errors.government_institution }}
          </div>
        </div>
      </div>
    </template>
    <div class="row">
      <div class="col-sm-8 offset-sm-4">
        <div class="row">
          <div class="col-sm-6">
            <button
              type="submit"
              class="btn btn-md btn-primary text-white w-100 mt-2"
              :disabled="meta.touched ? !meta.valid : true"
            >
              {{ $t('auth.signup') }}
            </button>
          </div>
          <div class="col-sm-6">
            <button
              type="button"
              class="btn btn-md btn-secondary text-white w-100 mt-2"
              @click="setActiveTab('login')"
            >
              {{ $t('auth.login') }}
            </button>
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
import UserType from '~/enums/UserType'

const emits = defineEmits(['tabChange', 'successRegister'])

const { showLoading, hideLoading } = useLoading()
const { t } = useI18n()

const setActiveTab = (tab) => {
  emits('tabChange', tab)
}

const validationSchema = yup.object({
  first_name: yup.string().required().max(15).label(t('auth.first_name')),
  last_name: yup.string().required().max(15).label(t('auth.last_name')),
  phone_number: yup
    .string()
    .nullable()
    .min(9)
    .max(10)
    .matches(/^0\d{8,9}$/, t('auth.phone_number_invalid'))
    .label(t('auth.phone_number')),
  email: yup
    .string()
    .required()
    .email()
    .matches(/^[^\s@]+@[^\s@]+(\.[^\s@]+)+$/, t('auth.email_address_invalid'))
    .label(t('auth.email_address')),
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
  password_confirmation: yup
    .string()
    .required()
    .min(8)
    .max(20)
    .label(t('auth.password_confirmation'))
    .oneOf(
      [yup.ref('password'), null],
      t('auth.password_confirmation_not_match'),
    ),
  user_type: yup.string().required().label(t('auth.register_as')),
  position: yup.string().nullable().label(t('auth.position')),
  government_institution: yup
    .string()
    .nullable()
    .label(t('auth.government_institution')),
})

const { errors, defineInputBinds, setFieldValue, handleSubmit, meta } = useForm(
  {
    validationSchema,
  },
)

const firstName = defineInputBinds('first_name')
const lastName = defineInputBinds('last_name')
const gender = defineInputBinds('gender')
const phoneNumber = defineInputBinds('phone_number')
const username = defineInputBinds('username')
const email = defineInputBinds('email')
const password = defineInputBinds('password')
const passwordConfirmation = defineInputBinds('password_confirmation')
const userType = defineInputBinds('user_type')
const position = defineInputBinds('position')
const governmentInstitution = defineInputBinds('government_institution')

setFieldValue('gender', 'male')

const alertErrorMessage = ref('')
const swal = useSwal()
const onSubmit = handleSubmit(async (values) => {
  alertErrorMessage.value = ''
  showLoading()

  const [service, transformer] = await Promise.all([
    useService('Auth'),
    useTransformer('Auth'),
  ])

  const req = await transformer((module) => module.registerReq(values))
  const { data, error } = await service((module) => module.register(req))

  hideLoading()
  const response = data?.value
  if (response?.data?.message) {
    swal.success(t('auth.register_success'), response.data.message)
    emits('successRegister', true)
  } else if (error?.value) {
    alertErrorMessage.value = getHttpValidationMessage(error.value.data)
  }
})
</script>
<style lang="scss" scoped>
@media (min-width: 576px) {
  :global(.modal) {
    --bs-modal-width: 630px !important;
  }
}
</style>
