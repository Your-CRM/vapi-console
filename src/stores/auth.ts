import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService, type LoginResponse } from '@/services/api'

interface User {
  user_id: number
  username: string
  name: string
  email: string
  position: string
  roles: Record<string, string>
  department: string | null
  teams: unknown[]
  subordinates: unknown
  users: Record<string, string>
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Initialize from sessionStorage
  const initAuth = () => {
    const storedToken = sessionStorage.getItem('access_token')
    const storedUser = sessionStorage.getItem('user')

    if (storedToken && storedUser) {
      accessToken.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        // Invalid stored user data
        clearAuth()
      }
    }
  }

  // Clear authentication data
  const clearAuth = () => {
    user.value = null
    accessToken.value = null
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('user')
  }

  // Login action
  const login = async (username: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response: LoginResponse = await apiService.login({
        username,
        password,
      })

      // Store user data and token
      user.value = {
        user_id: response.user_id,
        username: response.username,
        name: response.name,
        email: response.email,
        position: response.position,
        roles: response.roles,
        department: response.department,
        teams: response.teams,
        subordinates: response.subordinates,
        users: response.users,
      }
      accessToken.value = response.access_token

      // Persist to sessionStorage
      sessionStorage.setItem('access_token', response.access_token)
      sessionStorage.setItem('user', JSON.stringify(user.value))

      return { success: true }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Login failed. Please try again.'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  // Logout action
  const logout = () => {
    clearAuth()
  }

  // Computed properties
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')
  const userPosition = computed(() => user.value?.position || '')
  const userRoles = computed(() => user.value?.roles || {})

  // Initialize on store creation
  initAuth()

  return {
    user,
    accessToken,
    isLoading,
    error,
    isAuthenticated,
    userName,
    userEmail,
    userPosition,
    userRoles,
    login,
    logout,
    initAuth,
  }
})

