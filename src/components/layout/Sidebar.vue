<template>
  <aside
    class="fixed left-0 top-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300"
    :class="{ '-translate-x-full lg:translate-x-0': !isOpen, 'translate-x-0': isOpen }"
  >
    <div class="flex flex-col h-full">
      <!-- Logo/Brand -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">VAPI Console</h2>
        <button
          @click="$emit('toggle')"
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <OverlayScrollbarsComponent
        :options="{
          scrollbars: {
            theme: 'os-theme-dark',
            autoHide: 'move',
            autoHideDelay: 800,
            clickScroll: true,
          },
          overflow: {
            x: 'hidden',
            y: 'scroll',
          },
        }"
        class="flex-1"
      >
        <nav class="px-4 py-6">
          <ul class="space-y-1">
          <li v-for="item in navigationItems" :key="item.name">
            <!-- Menu item without submenu -->
            <router-link
              v-if="!item.children && item.to"
              :to="item.to"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              :class="
                $route.path === item.to
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              "
            >
              <component :is="item.icon" class="w-5 h-5 mr-3 flex-shrink-0" aria-hidden="true" />
              <span>{{ item.name }}</span>
            </router-link>

            <!-- Menu item with submenu -->
            <div v-else>
              <button
                @click="toggleSubmenu(item.name)"
                class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                :class="
                  isSubmenuOpen(item.name) || isActiveSubmenu(item)
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                "
              >
                <div class="flex items-center">
                  <component :is="item.icon" class="w-5 h-5 mr-3 flex-shrink-0" aria-hidden="true" />
                  <span>{{ item.name }}</span>
                </div>
                <svg
                  class="w-4 h-4 transition-transform duration-200 flex-shrink-0"
                  :class="{ 'rotate-90': isSubmenuOpen(item.name) }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <!-- Submenu -->
              <Transition
                enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-96"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 max-h-96"
                leave-to-class="opacity-0 max-h-0"
              >
                <ul v-if="isSubmenuOpen(item.name)" class="ml-4 mt-1 space-y-1 overflow-hidden">
                  <li v-for="child in item.children" :key="child.name">
                    <router-link
                      :to="child.to"
                      class="flex items-center px-4 py-2 text-sm rounded-lg transition-colors"
                      :class="
                        $route.path === child.to
                          ? 'text-indigo-700 dark:text-indigo-300 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      "
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-current mr-3 opacity-50"></span>
                      {{ child.name }}
                    </router-link>
                  </li>
                </ul>
              </Transition>
            </div>
          </li>
        </ul>
        </nav>
      </OverlayScrollbarsComponent>

      <!-- User Info Footer -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="relative" ref="userMenuRef">
          <button
            @click="showUserMenu = !showUserMenu"
            class="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="flex-shrink-0 relative">
              <img
                v-if="avatarUrl && !avatarError"
                :src="avatarUrl"
                :alt="authStore.userName"
                class="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                @error="avatarError = true"
              />
              <div
                v-else
                class="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold"
              >
                {{ userInitials }}
              </div>
            </div>
            <div class="flex-1 min-w-0 text-left">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ authStore.userName }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ authStore.userPosition }}
              </p>
            </div>
            <svg
              class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': showUserMenu }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown menu -->
          <div
            v-if="showUserMenu"
            class="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
          >
            <router-link
              to="/profile"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="showUserMenu = false"
            >
              Profile
            </router-link>
            <router-link
              to="/settings"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="showUserMenu = false"
            >
              Settings
            </router-link>
            <hr class="my-2 border-gray-200 dark:border-gray-700" />
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>

  <!-- Overlay for mobile -->
  <div
    v-if="isOpen"
    @click="$emit('toggle')"
    class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getAvatarUrl } from '@/utils/avatar'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

interface NavigationChild {
  name: string
  to: string
}

interface NavigationItem {
  name: string
  to?: string
  icon: any
  children?: NavigationChild[]
}

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  toggle: []
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)
const avatarError = ref(false)
const openSubmenus = ref<Set<string>>(new Set())

const avatarUrl = computed(() => {
  if (avatarError.value) return null
  return getAvatarUrl(authStore.userName)
})

// Watch for user name changes to reset avatar error
watch(() => authStore.userName, () => {
  avatarError.value = false
})

// Import Heroicons
import {
  HomeIcon,
  SparklesIcon as BotIcon,
  PhoneIcon,
  PhoneArrowUpRightIcon as CallIcon,
  PuzzlePieceIcon as PlugIcon,
  Cog6ToothIcon as SettingsIcon,
} from '@heroicons/vue/24/outline'

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  {
    name: 'Assistants',
    icon: BotIcon,
    children: [
      { name: 'AI Assistants', to: '/assistants' },
      { name: 'Create Assistant', to: '/assistants/create' },
      { name: 'Assistant Settings', to: '/assistants/settings' },
    ],
  },
  {
    name: 'Telephony',
    icon: PhoneIcon,
    children: [
      { name: 'Campaigns', to: '/telephony/campaigns' },
      { name: 'Manual Dialer', to: '/telephony/dialer' },
      { name: 'Numbers & Routing', to: '/telephony/numbers' },
      { name: 'Telephony Settings', to: '/telephony/settings' },
    ],
  },
  {
    name: 'Calls',
    icon: CallIcon,
    children: [
      { name: 'Call Logs', to: '/calls/logs' },
      { name: 'Recordings', to: '/calls/recordings' },
      { name: 'Call Analytics', to: '/calls/analytics' },
    ],
  },
  {
    name: 'Integrations',
    icon: PlugIcon,
    children: [
      { name: 'Webhooks', to: '/integrations/webhooks' },
      { name: 'APIs', to: '/integrations/apis' },
      { name: 'Third-Party Tools', to: '/integrations/third-party' },
    ],
  },
  {
    name: 'Settings',
    icon: SettingsIcon,
    children: [
      { name: 'User Management', to: '/settings/users' },
      { name: 'Billing', to: '/settings/billing' },
      { name: 'System Settings', to: '/settings/system' },
    ],
  },
]

// Submenu functions
const toggleSubmenu = (menuName: string) => {
  if (openSubmenus.value.has(menuName)) {
    openSubmenus.value.delete(menuName)
  } else {
    openSubmenus.value.add(menuName)
  }
}

const isSubmenuOpen = (menuName: string): boolean => {
  return openSubmenus.value.has(menuName)
}

const isActiveSubmenu = (item: NavigationItem): boolean => {
  if (!item.children) return false
  return item.children.some(child => route.path === child.to)
}

// Auto-open submenu if current route matches a child
watch(
  () => route.path,
  (newPath) => {
    navigationItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) => newPath === child.to)
        if (hasActiveChild) {
          openSubmenus.value.add(item.name)
        }
      }
    })
  },
  { immediate: true }
)

const userInitials = computed(() => {
  const name = authStore.userName
  if (!name) return 'U'
  const parts = name.split(' ').filter(p => p.length > 0)
  if (parts.length >= 2) {
    const first = parts[0]?.[0]
    const last = parts[parts.length - 1]?.[0]
    if (first && last) {
      return (first + last).toUpperCase()
    }
  }
  return name[0]?.toUpperCase() || 'U'
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  showUserMenu.value = false
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Additional styles if needed */
</style>

