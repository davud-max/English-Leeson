export function normalizeAdminKey(raw?: string): string {
  if (!raw) return ''
  return raw
    .trim()
    .replace(/^"+|"+$/g, '')
    .replace(/[\r\n\t]/g, '')
}

export function getAdminKeyFromHeaders(headers: Headers): string | undefined {
  const direct = headers.get('x-admin-key') || headers.get('x-admin-secret-key')
  if (direct && direct.trim()) return direct.trim()

  const authorization = headers.get('authorization') || ''
  const match = /^Bearer\s+(.+)$/i.exec(authorization.trim())
  if (match && match[1] && match[1].trim()) return match[1].trim()

  return undefined
}

export function assertAdminKey(providedRaw?: string) {
  const provided = normalizeAdminKey(providedRaw)
  const expected = normalizeAdminKey(process.env.ADMIN_SECRET_KEY)

  if (!expected) {
    throw new Error('ADMIN_SECRET_KEY is not configured')
  }
  if (!provided || provided !== expected) {
    throw new Error('Unauthorized')
  }
}
