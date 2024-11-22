<template>
  <div>
    <DialogBlank
      ref="dialogBlank"
      class="p-2"
      :title="$t('profile.update_user_profile')"
      title-icon="fa-solid fa-user"
      @hide="handleClose"
    >
      <form class="form" @submit.prevent="onSubmit">
        <div v-if="alertErrorMessage" class="alert alert-danger" role="alert">
          {{ alertErrorMessage }}
        </div>
        <div class="mb-3">
          <div class="w-100 d-flex justify-content-center">
            <div class="position-relative p-2">
              <img
                :src="avatar || '/avatar/profile.png'"
                class="rounded shadow-sm"
                alt="Avatar"
                width="130"
                @error="$event.target.src = '/avatar/profile.png'"
              />
              <span class="position-absolute end-0 bottom-0 p-0">
                <i
                  class="fa-solid fa-pen text-secondary icon-edit-avatar"
                  @click="handleOpenProfileCropperDialog"
                />
                <DialogPictureCropper
                  ref="profileImageCropperDialog"
                  visibility="public"
                  :title="$t('profile.update_profile')"
                  :options="profileImageCropperDialogOptions"
                  @result="handleProfileCropperResult"
                />
              </span>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="Last Name">
            {{ $t('profile.last_name') }}
            <sup class="text-danger"> *</sup>
          </label>
          <input
            v-bind="lastName"
            type="text"
            :placeholder="$t('profile.last_name')"
            :class="{ 'is-invalid': errors.last_name }"
            :data-vv-validate-on="['blur', 'change']"
            class="form-control"
          />
          <div class="invalid-feedback text-start">
            {{ errors.last_name }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="First Name">
            {{ $t('profile.first_name') }}
            <sup class="text-danger"> *</sup>
          </label>
          <input
            v-bind="firstName"
            type="text"
            :placeholder="$t('profile.first_name')"
            :class="{ 'is-invalid': errors.first_name }"
            :data-vv-validate-on="['blur', 'change']"
            class="form-control"
          />
          <div class="invalid-feedback text-start">
            {{ errors.first_name }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="Gender">
            {{ $t('profile.gender') }}
            <sup class="text-danger"> *</sup>
          </label>
          <select
            v-bind="gender"
            :class="errors.gender ? 'is-invalid' : ''"
            :data-vv-validate-on="['blur', 'change']"
            class="form-select"
          >
            <option value="male">
              {{ $t('profile.male') }}
            </option>
            <option value="female">
              {{ $t('profile.female') }}
            </option>
            <option value="">
              {{ $t('profile.other_gender') }}
            </option>
          </select>
          <div class="invalid-feedback">
            {{ errors.gender }}
          </div>
        </div>
        <template v-if="user?.user_type === UserType.OWNER">
          <div class="mb-3">
            <label class="form-label" for="Government Institution">
              {{ $t('profile.government_institution') }}
              <sup class="text-danger"> *</sup>
            </label>
            <input
              v-bind="governmentInstitution"
              type="text"
              :placeholder="$t('profile.government_institution')"
              :class="{ 'is-invalid': errors.government_institution }"
              :data-vv-validate-on="['blur', 'change']"
              class="form-control"
            />
            <div class="invalid-feedback text-start">
              {{ errors.government_institution }}
            </div>
          </div>
        </template>
        <div class="mt-4 text-end">
          <button
            type="submit"
            class="btn btn-md btn-primary text-white"
            :disabled="!meta.valid"
          >
            {{ $t('profile.update_profile') }}
          </button>
        </div>
      </form>
    </DialogBlank>
  </div>
</template>

<script setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useAuthStore } from '~/store/auth'
import UserType from '~/enums/UserType'
import { getHttpValidationMessage } from '~/utils/common'

const emits = defineEmits(['successUpdate'])

const dialogBlank = ref()

const show = () => {
  dialogBlank.value.show()
}
const hide = () => {
  dialogBlank.value.hide()
}

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { showLoading, hideLoading } = useLoading()
const { t } = useI18n()

const validationSchema = yup.object({
  last_name: yup.string().required().max(15).label(t('profile.last_name')),
  first_name: yup.string().required().max(15).label(t('profile.first_name')),
  gender: yup.string().required().label(t('profile.gender')),
})

const { errors, defineInputBinds, handleSubmit, meta, setFieldValue } = useForm(
  {
    validationSchema,
  },
)

const avatar = ref('')
const setInitialValue = () => {
  setFieldValue('last_name', user.value?.last_name || '')
  setFieldValue('first_name', user.value?.first_name || '')
  setFieldValue('gender', user.value?.gender || '')
  setFieldValue(
    'government_institution',
    user.value?.government_institution || '',
  )
  avatar.value = user.value?.avatar
}

setInitialValue()

const firstName = defineInputBinds('first_name')
const lastName = defineInputBinds('last_name')
const gender = defineInputBinds('gender')
const governmentInstitution = defineInputBinds('government_institution')

const alertErrorMessage = ref('')
const onSubmit = handleSubmit(async (values) => {
  alertErrorMessage.value = ''
  await showLoading()
  const [service, transformer] = await Promise.all([
    useService('User'),
    useTransformer('User'),
  ])

  const req = await transformer((module) =>
    module.updateProfileReq({ ...values, avatar: avatar.value }),
  )
  const { data, error } = await service((module) => module.updateProfile(req))
  if (data?.value) {
    const fetch = await transformer((module) => module.fetch(data.value))
    authStore.setUser(fetch)
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
  setInitialValue()
}

// Profile Image Update
const profileImageCropperDialog = ref(null)
const profileImageCropperDialogOptions = {
  viewMode: 1,
  dragMode: 'crop',
  aspectRatio: 16 / 16,
}
const handleOpenProfileCropperDialog = () => {
  profileImageCropperDialog.value.openInput()
}
const handleProfileCropperResult = (image) => {
  avatar.value = image
}
defineExpose({ show, hide })
</script>
<style lang="scss" scoped>
.icon-edit-avatar {
  cursor: pointer;
}
</style>
