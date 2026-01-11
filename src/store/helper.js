import { cloneDeep } from 'lodash-es'
import api from '@/api'
import { basePermissions } from '@/settings'

export async function getUserInfo() {
  const res = await api.getUser()
  const userData = res.data || res
  const { id, username, email, full_name, role, is_active, created_at, updated_at } = userData
  
  return {
    id,
    username,
    email,
    full_name,
    nickName: full_name,
    role,
    is_active,
    created_at,
    updated_at,
    avatar: userData.avatar || null,
    currentRole: { name: role },
    roles: [{ name: role }]
  }
}

export async function getPermissions() {
  let asyncPermissions = []
  try {
    const res = await api.getRolePermissions()
    asyncPermissions = res?.data || []
  }
  catch (error) {
    console.error('Failed to get permissions:', error)
  }
  return cloneDeep(basePermissions).concat(asyncPermissions)
}
