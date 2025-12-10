<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <Sidebar :is-open="sidebarOpen" @toggle="toggleSidebar" />

    <!-- Main content area -->
    <div class="lg:pl-64 transition-all duration-300">
      <!-- Header -->
      <Header :page-title="pageTitle" @toggle-sidebar="toggleSidebar" />

      <!-- Page content -->
      <main class="pt-16">
        <div class="p-6">
          <RouterView v-slot="{ Component, route: childRoute }">
            <Transition
              :name="(childRoute.meta?.transition as string) || 'fade'"
              mode="out-in"
            >
              <component :is="Component" :key="childRoute.path" />
            </Transition>
          </RouterView>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'

const route = useRoute()
const sidebarOpen = ref(false)

// Initialize sidebar state based on screen size
if (typeof window !== 'undefined') {
  sidebarOpen.value = window.innerWidth >= 1024
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const pageTitle = computed(() => {
  return (route.meta?.title as string) || route.name?.toString() || 'Dashboard'
})

// Handle responsive sidebar
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = true
  } else {
    sidebarOpen.value = false
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Additional styles if needed */
</style>

<style>
/* Page transition animations for route content */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>

