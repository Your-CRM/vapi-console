import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth, requireGuest } from './guards'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout.vue'

const DEFAULT_TITLE = 'VAPI Client Console'
const TITLE_SUFFIX = ' | VAPI Console'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      beforeEnter: requireGuest,
      meta: {
        title: 'Login',
        description: 'Sign in to your VAPI Client Console account',
      },
    },
    {
      path: '/',
      component: AuthenticatedLayout,
      beforeEnter: requireAuth,
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: {
            title: 'Dashboard',
            description: 'View your dashboard and account overview',
          },
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/Profile.vue'),
          meta: {
            title: 'Profile',
            description: 'View and manage your profile information',
          },
        },
        {
          path: 'assistants',
          name: 'assistants',
          component: () => import('@/views/Assistants.vue'),
          meta: {
            title: 'AI Assistants',
            description: 'Manage your AI assistants',
          },
        },
        {
          path: 'assistants/create',
          name: 'assistants-create',
          component: () => import('@/views/AssistantsCreate.vue'),
          meta: {
            title: 'Create Assistant',
            description: 'Create a new AI assistant',
          },
        },
        {
          path: 'assistants/settings',
          name: 'assistants-settings',
          component: () => import('@/views/AssistantsSettings.vue'),
          meta: {
            title: 'Assistant Settings',
            description: 'Configure assistant settings',
          },
        },
        {
          path: 'telephony/campaigns',
          name: 'telephony-campaigns',
          component: () => import('@/views/TelephonyCampaigns.vue'),
          meta: {
            title: 'Campaigns',
            description: 'Manage telephony campaigns',
          },
        },
        {
          path: 'telephony/dialer',
          name: 'telephony-dialer',
          component: () => import('@/views/TelephonyDialer.vue'),
          meta: {
            title: 'Manual Dialer',
            description: 'Manual dialer for calls',
          },
        },
        {
          path: 'telephony/numbers',
          name: 'telephony-numbers',
          component: () => import('@/views/TelephonyNumbers.vue'),
          meta: {
            title: 'Numbers & Routing',
            description: 'Manage phone numbers and routing',
          },
        },
        {
          path: 'telephony/settings',
          name: 'telephony-settings',
          component: () => import('@/views/TelephonySettings.vue'),
          meta: {
            title: 'Telephony Settings',
            description: 'Configure telephony settings',
          },
        },
        {
          path: 'calls/logs',
          name: 'calls-logs',
          component: () => import('@/views/CallsLogs.vue'),
          meta: {
            title: 'Call Logs',
            description: 'View call logs and history',
          },
        },
        {
          path: 'calls/recordings',
          name: 'calls-recordings',
          component: () => import('@/views/CallsRecordings.vue'),
          meta: {
            title: 'Recordings',
            description: 'View and manage call recordings',
          },
        },
        {
          path: 'calls/analytics',
          name: 'calls-analytics',
          component: () => import('@/views/CallsAnalytics.vue'),
          meta: {
            title: 'Call Analytics',
            description: 'View call analytics and insights',
          },
        },
        {
          path: 'integrations/webhooks',
          name: 'integrations-webhooks',
          component: () => import('@/views/IntegrationsWebhooks.vue'),
          meta: {
            title: 'Webhooks',
            description: 'Manage webhook integrations',
          },
        },
        {
          path: 'integrations/apis',
          name: 'integrations-apis',
          component: () => import('@/views/IntegrationsApis.vue'),
          meta: {
            title: 'APIs',
            description: 'Manage API integrations',
          },
        },
        {
          path: 'integrations/third-party',
          name: 'integrations-third-party',
          component: () => import('@/views/IntegrationsThirdParty.vue'),
          meta: {
            title: 'Third-Party Tools',
            description: 'Manage third-party integrations',
          },
        },
        {
          path: 'settings/users',
          name: 'settings-users',
          component: () => import('@/views/SettingsUsers.vue'),
          meta: {
            title: 'User Management',
            description: 'Manage users and permissions',
          },
        },
        {
          path: 'settings/billing',
          name: 'settings-billing',
          component: () => import('@/views/SettingsBilling.vue'),
          meta: {
            title: 'Billing',
            description: 'Manage billing and subscriptions',
          },
        },
        {
          path: 'settings/system',
          name: 'settings-system',
          component: () => import('@/views/SettingsSystem.vue'),
          meta: {
            title: 'System Settings',
            description: 'Configure system settings',
          },
        },
        {
          path: ':pathMatch(.*)*',
          name: 'not-found-authenticated',
          component: () => import('@/views/NotFound.vue'),
          meta: {
            title: 'Page Not Found',
            description: 'The page you are looking for does not exist',
          },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
      meta: {
        title: 'Page Not Found',
        description: 'The page you are looking for does not exist',
      },
    },
  ],
})

// Helper function to update meta tag
const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
  let metaTag = document.querySelector(`meta[${attribute}="${name}"]`)
  if (!metaTag) {
    metaTag = document.createElement('meta')
    metaTag.setAttribute(attribute, name)
    document.head.appendChild(metaTag)
  }
  metaTag.setAttribute('content', content)
}

// Update document title and meta tags on route change
router.beforeEach((to, _from, next) => {
  // Get the title from route meta or use default
  const title = to.meta?.title as string | undefined
  const fullTitle = title ? `${title}${TITLE_SUFFIX}` : DEFAULT_TITLE

  // Update document title
  document.title = fullTitle

  // Update meta description if available
  const description = (to.meta?.description as string | undefined) || 
    'VAPI Client Console - Manage your VAPI account and services'
  updateMetaTag('description', description)

  // Update Open Graph tags for better SEO
  updateMetaTag('og:title', fullTitle, 'property')
  updateMetaTag('og:description', description, 'property')
  updateMetaTag('og:type', 'website', 'property')
  
  // Update Twitter Card tags
  updateMetaTag('twitter:title', fullTitle)
  updateMetaTag('twitter:description', description)
  updateMetaTag('twitter:card', 'summary')

  next()
})

// Handle component loading errors
router.onError((error) => {
  console.error('Route error:', error)
  // If component fails to load, redirect to not found
  // This handles cases where route exists but component file is missing
  if (error.message.includes('Failed to fetch dynamically imported module') || 
      error.message.includes('Loading chunk') ||
      error.name === 'ChunkLoadError') {
    // Check if we're in authenticated area
    const currentPath = router.currentRoute.value.path
    if (currentPath.startsWith('/dashboard') || 
        currentPath.startsWith('/profile') || 
        currentPath.startsWith('/settings') ||
        currentPath === '/') {
      router.replace({ name: 'not-found-authenticated' })
    } else {
      router.replace({ name: 'not-found' })
    }
  }
})

export default router

