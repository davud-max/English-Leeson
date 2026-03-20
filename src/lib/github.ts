export function normalizeGitHubToken(raw?: string): string {
  if (!raw) return ''

  return raw
    .trim()
    .replace(/^"+|"+$/g, '')
    .replace(/[\r\n\t]/g, '')
}

export function getGitHubToken(): string {
  return normalizeGitHubToken(process.env.GITHUB_TOKEN)
}

export function getGitHubAuthHeaders() {
  const token = getGitHubToken()

  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
  }
}
