<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manual Dialer</h2>

    <!-- Selection Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Team Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Team Name
          </label>
          <select
            v-model="selectedTeamId"
            @change="onTeamChange"
            :disabled="isLoadingTeams"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          >
            <option value="">Select a team...</option>
            <option v-for="team in teams" :key="team.id" :value="team.id">
              {{ team.name }}
            </option>
          </select>
        </div>

        <!-- Campaign Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Campaign
          </label>
          <div class="flex items-center gap-2">
            <div class="flex-1 relative">
              <select
                v-model="selectedCampaignId"
                @change="onCampaignChange"
                :disabled="!selectedTeamId || isLoadingCampaigns"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select a campaign...</option>
                <option v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id">
                  {{ campaign.name }}
                </option>
              </select>
              <!-- Loading indicator -->
              <div
                v-if="isLoadingCampaigns"
                class="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
              </div>
            </div>
            <!-- Preview Button -->
            <button
              v-if="selectedCampaignId"
              @click="showCampaignPreview = true"
              class="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/30 transition-colors"
              title="View campaign details"
            >
              <EyeIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Assistant Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            VAPI Assistant
          </label>
          <select
            v-model="selectedAssistantId"
            :disabled="assistants.length === 0"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          >
            <option value="">Select an assistant...</option>
            <option v-for="assistant in assistants" :key="assistant.id" :value="assistant.id">
              {{ assistant.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Active Call Status -->
    <div
      v-if="activeCall"
      class="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl shadow-lg p-6 mb-6"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center">
              <PhoneIcon class="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Call in Progress
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ activeCall.contactName }} - {{ activeCall.phoneNumber }}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Audio Player -->
          <audio
            v-if="activeCall.listenUrl"
            :src="activeCall.listenUrl"
            controls
            class="h-10"
          >
            Your browser does not support the audio element.
          </audio>
          <button
            @click="endCall"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            End Call
          </button>
        </div>
      </div>
    </div>

    <!-- Contacts Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Contacts
          <span v-if="contacts.length > 0" class="text-sm font-normal text-gray-500 dark:text-gray-400">
            ({{ contacts.length }})
          </span>
        </h3>
      </div>

      <div v-if="isLoadingContacts" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading contacts...</p>
      </div>

      <div v-else-if="contacts.length === 0" class="p-8 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          {{ !selectedCampaignId ? 'Please select a team and campaign to view contacts.' : 'No contacts found for this campaign.' }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="contact in contacts"
              :key="contact.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ contact.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ contact.phone }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ contact.email || '—' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="initiateCall(contact)"
                  :disabled="isCalling || (activeCall && activeCall.contactId === contact.id) || !selectedAssistantId"
                  class="inline-flex items-center px-3 py-2 rounded-lg transition-colors"
                  :class="
                    activeCall && activeCall.contactId === contact.id
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 cursor-default'
                      : isCalling || !selectedAssistantId
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/30'
                  "
                >
                  <PhoneIcon
                    v-if="activeCall && activeCall.contactId === contact.id"
                    class="w-5 h-5 mr-2"
                  />
                  <PhoneArrowUpRightIcon
                    v-else
                    class="w-5 h-5 mr-2"
                  />
                  {{ activeCall && activeCall.contactId === contact.id ? 'Calling...' : 'Call' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Campaign Preview Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showCampaignPreview"
          class="fixed inset-0 z-[100]"
        >
          <!-- Background overlay -->
          <div 
            class="fixed inset-0 bg-black/50"
            @click="showCampaignPreview = false"
          ></div>

          <!-- Modal panel -->
          <div class="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
            <div
              class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
              @click.stop
            >
              <!-- Modal Header -->
              <div class="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div class="flex items-center justify-between">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Campaign Details
                  </h3>
                  <button
                    @click="showCampaignPreview = false"
                    class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <XMarkIcon class="w-6 h-6" />
                  </button>
                </div>
              </div>

              <!-- Modal Content -->
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
                <div class="bg-white dark:bg-gray-800 px-6 py-4">
                  <div v-if="selectedCampaign" class="space-y-6">
                    <!-- Campaign Info -->
              <div>
                <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Campaign Information</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Campaign Name</p>
                    <p class="text-base font-medium text-gray-900 dark:text-white">{{ selectedCampaign.name }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="
                        selectedCampaign.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                      "
                    >
                      {{ selectedCampaign.status || 'N/A' }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Team</p>
                    <p class="text-base font-medium text-gray-900 dark:text-white">
                      {{ getTeamName() }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Total Contacts</p>
                    <p class="text-base font-medium text-gray-900 dark:text-white">{{ contacts.length }}</p>
                  </div>
                </div>
              </div>

              <!-- AI Assistant Prompt -->
              <div>
                <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">AI Assistant Prompt</h4>
                <div class="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                  <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {{ getAssistantPrompt() }}
                  </p>
                </div>
              </div>

              <!-- Call Scripts Configuration -->
              <div>
                <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Call Scripts Configuration</h4>
                <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4">
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Opening Script</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {{ getScriptText('opening') }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Main Script</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {{ getScriptText('main') }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Closing Script</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {{ getScriptText('closing') }}
                    </p>
                  </div>
                  <div v-if="selectedCampaign.callScripts?.objections">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Objection Handling</p>
                    <div class="space-y-2">
                      <div
                        v-for="(response, objection) in selectedCampaign.callScripts.objections"
                        :key="objection"
                        class="border-l-4 border-indigo-500 pl-3"
                      >
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ objection }}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">{{ response }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Call Settings -->
              <div>
                <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Call Settings</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Max Call Duration</p>
                    <p class="text-base font-medium text-gray-900 dark:text-white">
                      {{ selectedCampaign.settings?.maxDuration || '5 minutes' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Retry Attempts</p>
                    <p class="text-base font-medium text-gray-900 dark:text-white">
                      {{ selectedCampaign.settings?.retryAttempts || '3' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Call Time Window</p>
                    <p class="text-base font-medium text-gray-900 dark:text-white">
                      {{ selectedCampaign.settings?.timeWindow || '9:00 AM - 6:00 PM' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Recording Enabled</p>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="
                        selectedCampaign.settings?.recording !== false
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      "
                    >
                      {{ selectedCampaign.settings?.recording !== false ? 'Yes' : 'No' }}
                    </span>
                  </div>
                </div>
                    </div>
                  </div>
                </div>
              </OverlayScrollbarsComponent>

              <div class="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  @click="showCampaignPreview = false"
                  class="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, Teleport, Transition } from 'vue'
import { PhoneIcon, PhoneArrowUpRightIcon, EyeIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { type Team, type Campaign, type Contact } from '@/services/api'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

// Mock data
const mockTeams: Team[] = [
  { id: 1, name: 'Sales Team', department: 'Sales' },
  { id: 2, name: 'Support Team', department: 'Customer Support' },
  { id: 3, name: 'Marketing Team', department: 'Marketing' },
]

const mockCampaigns: Record<number, Campaign[]> = {
  1: [
    { id: 101, name: 'Q4 Sales Campaign', team_id: 1, status: 'active' },
    { id: 102, name: 'New Product Launch', team_id: 1, status: 'active' },
    { id: 103, name: 'Customer Follow-up', team_id: 1, status: 'paused' },
  ],
  2: [
    { id: 201, name: 'Support Outreach', team_id: 2, status: 'active' },
    { id: 202, name: 'Customer Satisfaction', team_id: 2, status: 'active' },
  ],
  3: [
    { id: 301, name: 'Brand Awareness', team_id: 3, status: 'active' },
    { id: 302, name: 'Lead Generation', team_id: 3, status: 'active' },
  ],
}

const mockContacts: Record<number, Contact[]> = {
  101: [
    { id: 1001, name: 'John Smith', phone: '+1234567890', email: 'john.smith@example.com', campaign_id: 101 },
    { id: 1002, name: 'Sarah Johnson', phone: '+1234567891', email: 'sarah.j@example.com', campaign_id: 101 },
    { id: 1003, name: 'Michael Brown', phone: '+1234567892', email: 'michael.b@example.com', campaign_id: 101 },
    { id: 1004, name: 'Emily Davis', phone: '+1234567893', email: 'emily.d@example.com', campaign_id: 101 },
  ],
  102: [
    { id: 2001, name: 'Robert Wilson', phone: '+1234567894', email: 'robert.w@example.com', campaign_id: 102 },
    { id: 2002, name: 'Lisa Anderson', phone: '+1234567895', email: 'lisa.a@example.com', campaign_id: 102 },
  ],
  103: [
    { id: 3001, name: 'David Martinez', phone: '+1234567896', email: 'david.m@example.com', campaign_id: 103 },
  ],
  201: [
    { id: 4001, name: 'Jennifer Taylor', phone: '+1234567897', email: 'jennifer.t@example.com', campaign_id: 201 },
    { id: 4002, name: 'William Thomas', phone: '+1234567898', email: 'william.t@example.com', campaign_id: 201 },
  ],
  202: [
    { id: 5001, name: 'Patricia Jackson', phone: '+1234567899', email: 'patricia.j@example.com', campaign_id: 202 },
  ],
  301: [
    { id: 6001, name: 'James White', phone: '+1234567900', email: 'james.w@example.com', campaign_id: 301 },
    { id: 6002, name: 'Linda Harris', phone: '+1234567901', email: 'linda.h@example.com', campaign_id: 301 },
    { id: 6003, name: 'Richard Clark', phone: '+1234567902', email: 'richard.c@example.com', campaign_id: 301 },
  ],
  302: [
    { id: 7001, name: 'Barbara Lewis', phone: '+1234567903', email: 'barbara.l@example.com', campaign_id: 302 },
  ],
}

interface Assistant {
  id: string
  name: string
  description?: string
}

const mockAssistants: Assistant[] = [
  { id: 'asst_001', name: 'Sales Assistant', description: 'Handles sales calls and lead qualification' },
  { id: 'asst_002', name: 'Support Assistant', description: 'Provides customer support and troubleshooting' },
  { id: 'asst_003', name: 'Appointment Scheduler', description: 'Schedules appointments and meetings' },
  { id: 'asst_004', name: 'Follow-up Assistant', description: 'Follows up with customers and prospects' },
]

const teams = ref<Team[]>([])
const campaigns = ref<Campaign[]>([])
const contacts = ref<Contact[]>([])
const assistants = ref<Assistant[]>([])
const selectedTeamId = ref<number | ''>('')
const selectedCampaignId = ref<number | ''>('')
const selectedAssistantId = ref<string>('')
const isLoadingTeams = ref(false)
const isLoadingCampaigns = ref(false)
const isLoadingContacts = ref(false)
const isCalling = ref(false)
const showCampaignPreview = ref(false)
const activeCall = ref<{
  callId: string
  contactId: number
  contactName: string
  phoneNumber: string
  listenUrl?: string
} | null>(null)

// Computed property for selected campaign with mock data
const selectedCampaign = computed(() => {
  if (!selectedCampaignId.value) return null
  
  const campaign = campaigns.value.find(c => c.id === selectedCampaignId.value)
  if (!campaign) return null

  // Add mock call scripts and settings
  return {
    ...campaign,
    callScripts: {
      opening: 'Hello, this is {{assistant_name}} calling from {{company_name}}. I hope you\'re having a great day!',
      main: 'I\'m reaching out regarding {{campaign_topic}}. Would you be interested in learning more about our services?',
      closing: 'Thank you for your time today. Is there anything else I can help you with?',
      objections: {
        'Not interested': 'I completely understand. Would it be okay if I send you some information via email that you can review at your convenience?',
        'Too expensive': 'I appreciate your concern. We actually have flexible payment options and packages that might work better for your budget. Would you like to hear about them?',
        'Call me later': 'Of course! What would be a better time for you? I can schedule a call at your convenience.',
      },
    },
    settings: {
      maxDuration: '5 minutes',
      retryAttempts: 3,
      timeWindow: '9:00 AM - 6:00 PM',
      recording: true,
    },
  }
})

// Load teams and assistants on mount
onMounted(async () => {
  await loadTeams()
  await loadAssistants()
})

const loadTeams = async () => {
  isLoadingTeams.value = true
  try {
    // Mock: Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    teams.value = mockTeams
  } catch (error) {
    console.error('Failed to load teams:', error)
  } finally {
    isLoadingTeams.value = false
  }
}

const loadAssistants = async () => {
  try {
    // Mock: Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    assistants.value = mockAssistants
  } catch (error) {
    console.error('Failed to load assistants:', error)
  }
}

const onTeamChange = async () => {
  selectedCampaignId.value = ''
  campaigns.value = []
  contacts.value = []
  
  if (selectedTeamId.value) {
    await loadCampaigns(selectedTeamId.value as number)
  }
}

const loadCampaigns = async (teamId: number) => {
  isLoadingCampaigns.value = true
  try {
    // Mock: Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    campaigns.value = mockCampaigns[teamId] || []
  } catch (error) {
    console.error('Failed to load campaigns:', error)
  } finally {
    isLoadingCampaigns.value = false
  }
}

const onCampaignChange = async () => {
  contacts.value = []
  
  if (selectedCampaignId.value) {
    await loadContacts(selectedCampaignId.value as number)
  }
}

const loadContacts = async (campaignId: number) => {
  isLoadingContacts.value = true
  try {
    // Mock: Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    contacts.value = mockContacts[campaignId] || []
  } catch (error) {
    console.error('Failed to load contacts:', error)
  } finally {
    isLoadingContacts.value = false
  }
}

const initiateCall = async (contact: Contact) => {
  if (isCalling.value || activeCall.value || !selectedAssistantId.value) {
    return
  }

  isCalling.value = true
  
  try {
    // Mock: Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock call response
    const mockCallId = `call_${Date.now()}`
    const mockListenUrl = `https://api.vapi.ai/call/${mockCallId}/listen`
    
    // In real implementation, this would call:
    // const callData: CallRequest = {
    //   assistant_id: selectedAssistantId.value,
    //   phone_number: contact.phone,
    //   contact_id: contact.id,
    //   campaign_id: selectedCampaignId.value as number,
    // }
    // const response = await apiService.initiateCall(callData)
    
    activeCall.value = {
      callId: mockCallId,
      contactId: contact.id,
      contactName: contact.name,
      phoneNumber: contact.phone,
      listenUrl: mockListenUrl,
    }
    
    console.log('Call initiated:', {
      assistantId: selectedAssistantId.value,
      contact: contact.name,
      phone: contact.phone,
      callId: mockCallId,
    })
  } catch (error) {
    console.error('Failed to initiate call:', error)
    alert('Failed to initiate call. Please try again.')
  } finally {
    isCalling.value = false
  }
}

const endCall = () => {
  activeCall.value = null
  // TODO: Call API to end the call if needed
}

// Helper function to get script text with defaults
const getScriptText = (type: 'opening' | 'main' | 'closing'): string => {
  if (!selectedCampaign.value) return ''
  
  const defaults = {
    opening: 'Hello, this is {{assistant_name}} calling from {{company_name}}. I hope you\'re having a great day!',
    main: 'I\'m reaching out regarding {{campaign_topic}}. Would you be interested in learning more about our services?',
    closing: 'Thank you for your time today. Is there anything else I can help you with?',
  }
  
  return selectedCampaign.value.callScripts?.[type] || defaults[type]
}

// Helper function to get team name
const getTeamName = (): string => {
  const campaign = selectedCampaign.value
  if (!campaign?.team_id) return 'N/A'
  return teams.value.find(t => t.id === campaign.team_id)?.name || 'N/A'
}

// Helper function to get AI assistant prompt
const getAssistantPrompt = (): string => {
  if (!selectedCampaign.value) return ''
  
  const defaultPrompt = `You are a professional sales assistant calling on behalf of ${selectedCampaign.value.name || 'the company'}.

Your role is to:
- Introduce yourself warmly and professionally
- Follow the provided call scripts for opening, main conversation, and closing
- Handle objections gracefully using the provided responses
- Maintain a friendly and helpful tone throughout the call
- Collect relevant information and schedule follow-ups if needed
- End the call on a positive note

Key guidelines:
- Always be respectful and patient
- Listen actively to the customer's needs
- Use the customer's name when appropriate
- Stay focused on the campaign objectives
- Follow the call scripts but adapt naturally to the conversation flow
- If the customer is not interested, respect their decision and offer to send information via email

Remember to personalize the conversation while following the campaign guidelines.`

  return selectedCampaign.value.assistantPrompt || defaultPrompt
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
