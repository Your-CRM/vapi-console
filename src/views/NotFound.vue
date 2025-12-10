<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
    <div class="text-center max-w-md w-full px-4">
      <div
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 0.5 } }"
        class="space-y-6"
      >
        <!-- 404 Number -->
        <div class="text-6xl sm:text-8xl md:text-9xl font-bold text-indigo-600 dark:text-indigo-400 opacity-20 leading-none">
          404
        </div>

        <!-- Error Message -->
        <div class="space-y-2">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Page Not Found
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or hasn't been created yet.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            @click="goBack"
            class="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
          <router-link
            to="/dashboard"
            class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-center"
          >
            Go to Dashboard
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>

