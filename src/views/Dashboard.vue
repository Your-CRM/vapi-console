<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 0.5 } }"
  >
      <!-- Welcome Card -->
      <div
        v-motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :enter="{ opacity: 1, scale: 1, transition: { delay: 0.2 } }"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Welcome, {{ authStore.userName }}!
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          You have successfully logged in to the VAPI Client Console.
        </p>
      </div>

      <!-- User Information Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- User Details Card -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 0.3 } }"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Information
          </h3>
          <div class="space-y-3">
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
              <p class="text-sm text-gray-500 dark:text-gray-400">Position</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ authStore.userPosition }}
              </p>
            </div>
            <div v-if="authStore.user?.department">
              <p class="text-sm text-gray-500 dark:text-gray-400">Department</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ authStore.user.department }}
              </p>
            </div>
          </div>
        </div>

        <!-- Roles Card -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 0.4 } }"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Roles
          </h3>
          <div class="space-y-2">
            <div
              v-for="(role, key) in authStore.userRoles"
              :key="key"
              class="inline-block mr-2 mb-2"
            >
              <span
                class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium"
              >
                {{ role }}
              </span>
            </div>
            <p
              v-if="Object.keys(authStore.userRoles).length === 0"
              class="text-gray-500 dark:text-gray-400 text-sm"
            >
              No roles assigned
            </p>
          </div>
        </div>

        <!-- User ID Card -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 0.5 } }"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account Details
          </h3>
          <div class="space-y-3">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">User ID</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ authStore.user?.user_id }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
              >
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
/* Additional custom styles if needed */
</style>

