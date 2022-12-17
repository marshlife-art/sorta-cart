import {Auth} from './types'
import {
  localAuth
} from './local/auth'
import {
 supaAuth
} from './supabase/auth'

export const auth:Auth = process.env.USE_LOCAL_SERVICES ? localAuth : supaAuth