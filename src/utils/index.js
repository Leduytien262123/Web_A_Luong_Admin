export * from './common'
export * from './http'
export * from './is'
export * from './naiveTools'
export * from './storage'
export { default as api } from '@/api'

// JWT utilities
export function decodeJWT(token) {
  if (!token) return null
  
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

export function isTokenExpired(token) {
  const decoded = decodeJWT(token)
  if (!decoded || !decoded.exp) return true
  
  const currentTime = Math.floor(Date.now() / 1000)
  return decoded.exp < currentTime
}

export function getTokenExpirationTime(token) {
  const decoded = decodeJWT(token)
  return decoded?.exp ? new Date(decoded.exp * 1000) : null
}
