const AVATAR_BASE_URL = 'https://api-01.callboxinc.com/v2/api/public/avatar'

/**
 * Converts a full name to the avatar URL format
 * Example: "Lucky John Faderon" -> "lucky-john-faderon"
 */
export function formatNameForAvatar(fullName: string): string {
  if (!fullName) return ''
  return fullName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove special characters except hyphens
}

/**
 * Generates the avatar URL for a user
 * @param fullName - The user's full name
 * @returns The avatar URL
 */
export function getAvatarUrl(fullName: string | null | undefined): string {
  if (!fullName) return ''
  const formattedName = formatNameForAvatar(fullName)
  return `${AVATAR_BASE_URL}/${formattedName}.jpg`
}

