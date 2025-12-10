const BASE_URL = 'https://api-01.callboxinc.com/v2/api'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
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
  access_token: string
  token_type: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

class ApiService {
  private getAuthToken(): string | null {
    return sessionStorage.getItem('access_token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`
    const token = this.getAuthToken()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  // Teams API
  async getTeams(): Promise<Team[]> {
    return this.request<Team[]>('/teams')
  }

  // Campaigns API
  async getCampaignsByTeam(teamId: number): Promise<Campaign[]> {
    return this.request<Campaign[]>(`/teams/${teamId}/campaigns`)
  }

  // Contacts API
  async getContactsByCampaign(campaignId: number): Promise<Contact[]> {
    return this.request<Contact[]>(`/campaigns/${campaignId}/contacts`)
  }

  // VAPI Call API
  async initiateCall(callData: CallRequest): Promise<CallResponse> {
    return this.request<CallResponse>('/calls', {
      method: 'POST',
      body: JSON.stringify(callData),
    })
  }
}

// Type definitions
export interface Team {
  id: number
  name: string
  department?: string
}

export interface Campaign {
  id: number
  name: string
  team_id: number
  status?: string
  assistantPrompt?: string
  callScripts?: {
    opening?: string
    main?: string
    closing?: string
    objections?: Record<string, string>
  }
  settings?: {
    maxDuration?: string
    retryAttempts?: number
    timeWindow?: string
    recording?: boolean
  }
}

export interface Contact {
  id: number
  name: string
  phone: string
  email?: string
  campaign_id: number
  [key: string]: unknown
}

export interface CallRequest {
  assistant_id: string
  phone_number: string
  contact_id?: number
  campaign_id?: number
}

export interface CallResponse {
  call_id: string
  status: string
  listen_url?: string
  recording_url?: string
}

export const apiService = new ApiService()

