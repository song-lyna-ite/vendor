<template>
  <div class="main-tab-block">
    <ul id="pills-tab" class="main-tab nav nav-pills" role="tablist">
      <li
        v-for="(tab, idx) in tabs"
        :key="`tab${idx}`"
        class="nav-item me-2 bg-secondary"
        role="presentation"
      >
        <NuxtLink
          class="nav-link nav-action"
          :class="{ 'nav-active': tab.active }"
          :to="tab.path"
        >
          <i :class="tab.icon" />
          <span class="ms-2">{{ tab.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()

const tabs = ref([
  {
    label: t('page.map'),
    path: '/map',
    icon: 'fa-solid fa-map-location-dot',
    active: false,
  },
  {
    label: t('page.dashboard'),
    path: '/dashboard',
    icon: 'fa-solid fa-bahai',
    active: false,
  },
])

// set active on loaded
tabs.value.forEach((tab, idx) => {
  if (route.path === tab.path) {
    tabs.value[idx].active = true
  } else {
    tabs.value[idx].active = false
  }
})

// set active on route change
watch(
  () => route.path,
  () => {
    // loop through tabs
    tabs.value.forEach((tab, idx) => {
      if (route.path === tab.path) {
        tabs.value[idx].active = true
      } else {
        tabs.value[idx].active = false
      }
    })
  },
)
</script>
<style lang="scss" scoped>
.main-tab-block {
  .main-tab {
    .nav-item {
      border-radius: 8px 8px 0px 0px;
    }

    .nav-action {
      display: flex;
      padding-top: 5px;
      padding-bottom: 5px;
      font-size: 14px;
      color: white;
      width: 170px;
      height: 36px;
      justify-content: center;
      align-items: center;
      border-radius: 8px 8px 0px 0px;

      &.nav-active {
        color: white;
        background: #aeb7c3;
      }
    }
  }

  @media screen and (max-width: 991px) {
    .main-tab {
      .nav-action {
        width: auto;
        height: auto;
      }
    }
  }
}
</style>
