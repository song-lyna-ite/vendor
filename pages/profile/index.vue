<template>
  <div>adwdsdw</div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/store/auth'
import UserType from '~/enums/UserType'
import UserTwoFactorType from '~/enums/UserTwoFactorType'
import VerifyOTPCodeActionType from '~/enums/VerifyOTPCodeActionType'
import UserEnableTwoFactor from '~/enums/UserEnableTwoFactor'
import UserVerifiedEmail from '~/enums/UserVerifiedEmail'

const { t } = useI18n()
// this is need to authenticate the user to access this page
definePageMeta({ middleware: 'authenticate' })
useSeoMeta({
  titleTemplate: (title) => {
    return `${title} | ${t('page.profile')}`
  },
})
</script>
<style lang="scss" scoped></style>
