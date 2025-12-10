<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 0.5 } }"
  >
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile</h2>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <!-- Avatar Section -->
        <div class="flex flex-col items-center mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          <div class="relative">
            <img
              v-if="avatarUrl && !avatarError"
              :src="avatarUrl"
              :alt="authStore.userName"
              class="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 dark:border-indigo-400 shadow-lg"
              @error="avatarError = true"
            />
            <div
              v-else
              class="w-32 h-32 rounded-full bg-indigo-500 dark:bg-indigo-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-indigo-500 dark:border-indigo-400 shadow-lg"
            >
              {{ userInitials }}
            </div>
          </div>
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
            {{ authStore.userName }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            {{ authStore.userPosition }}
          </p>
        </div>

        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Username</p>
                <p class="text-base font-medium text-gray-900 dark:text-white">
                  {{ authStore.user?.username }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p class="text-base font-medium text-gray-900 dark:text-white">
                  {{ authStore.userEmail }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p class="text-base font-medium text-gray-900 dark:text-white">
                  {{ authStore.userName }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Position</p>
                <p class="text-base font-medium text-gray-900 dark:text-white">
                  {{ authStore.userPosition }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getAvatarUrl } from '@/utils/avatar'

const authStore = useAuthStore()
const avatarError = ref(false)

const avatarUrl = computed(() => {
  if (avatarError.value) return null
  return getAvatarUrl(authStore.userName)
})

const userInitials = computed(() => {
  const name = authStore.userName
  if (!name) return 'U'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name[0].toUpperCase()
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style>

