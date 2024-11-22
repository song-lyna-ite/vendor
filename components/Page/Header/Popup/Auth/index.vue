<template>
  <div>
    <DialogAppLogo ref="dialogAuth" class="p-2" @hide="handleCloseAuthPopup">
      <PageHeaderPopupAuthLoginTab
        v-if="activeTab === 'login'"
        @tab-change="setActiveTab"
        @success-login="handleCloseAuthPopup('/dashboard')"
        @hide="handleCloseAuthPopup"
        @forgot-pass-click="showSendCodeResetPass"
        @required-verify-otp="showLoginVerifyCode"
      />
      <PageHeaderPopupAuthRegisterTab
        v-if="activeTab === 'signup'"
        @tab-change="setActiveTab"
        @success-register="handleCloseAuthPopup('/dashboard')"
        @hide="handleCloseAuthPopup"
      />
    </DialogAppLogo>

    <PageHeaderPopupAuthOTPSendCode
      ref="dialogSendCode"
      @success-send="handleSuccessSendCode"
    />
    <PageHeaderPopupAuthOTPVerifyCode
      ref="dialogVerifyCode"
      :action-type="otpActionSendType"
      :provided-value="providedValueOPTSend"
      @success-verify="handleSuccessVerifyCode"
    />
    <PageHeaderPopupAuthResetPass
      ref="dialogReset"
      :provided-value="providedValueOPTSend"
      @success-reset="handleSuccessReset"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAuthPopupStore } from '~/store/auth-popup'
import VerifyOTPCodeActionType from '~/enums/VerifyOTPCodeActionType'
import { useAuthStore } from '~/store/auth'

// Set Show Popup
const authPopupStore = useAuthPopupStore()
const { isShowLoginPopup } = storeToRefs(authPopupStore)

const dialogAuth = ref()
const dialogSendCode = ref()
const dialogVerifyCode = ref()
const dialogReset = ref()
const activeTab = ref('login')

const setActiveTab = (tab) => {
  activeTab.value = tab
}

watch(
  () => isShowLoginPopup.value,
  () => {
    if (isShowLoginPopup.value) {
      dialogAuth.value.show()
    } else {
      dialogAuth.value.hide()
    }
  },
)

const handleCloseAuthPopup = (to = null) => {
  if (isShowLoginPopup.value) {
    authPopupStore.hideLoginPopup()
    setActiveTab('login')
    if (to) navigateTo(to)
  }
}

const otpActionSendType = ref('')
const showSendCodeResetPass = () => {
  otpActionSendType.value = VerifyOTPCodeActionType.RESET_PASSWORD
  dialogSendCode.value.show()
  handleCloseAuthPopup()
}

const providedValueOPTSend = ref('')
const handleSuccessSendCode = (value) => {
  if (value) {
    providedValueOPTSend.value = value
  }
  dialogSendCode.value.hide()
  dialogVerifyCode.value.show()
}

const { setAccessToken } = useAuthenticate()
const { setUser } = useAuthStore()
const handleSuccessVerifyCode = async (data) => {
  handleCloseAuthPopup()
  dialogVerifyCode.value.hide()
  if (data?.action_type === VerifyOTPCodeActionType.RESET_PASSWORD) {
    providedValueOPTSend.value = data?.provided_value
    dialogReset.value.show()
  } else if (data?.action_type === VerifyOTPCodeActionType.LOGIN) {
    const [authTransformer] = await Promise.all([useTransformer('Auth')])
    const fetch = await authTransformer((module) => module.fetch(data?.auth))

    if (await fetch?.access_token) {
      await setAccessToken(fetch.access_token)
    }
    if (await fetch?.user) {
      await setUser(fetch.user)
    }
    await navigateTo('/dashboard')
  }
}

const handleSuccessReset = () => {
  dialogReset.value.hide()
  authPopupStore.hideLoginPopup()
  navigateTo('/profile')
}

const showLoginVerifyCode = (value) => {
  otpActionSendType.value = VerifyOTPCodeActionType.LOGIN
  handleSuccessSendCode(value)
  handleCloseAuthPopup()
}

onMounted(() => {
  otpActionSendType.value = ''
  activeTab.value = 'login'
})
</script>
