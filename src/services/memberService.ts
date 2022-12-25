import { API_HOST } from '../constants'
import { supabase } from '../lib/supabaseClient'
import { SupaMember, SupaUser } from '../types/SupaTypes'

// http://localhost:54321/functions/v1/email-available
export async function checkIfEamilExists(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('email-available', {
      body: { email }
    })

    if (error) return false
    return data.ok
  } catch (err) {
    console.warn('onoz! register/check err:', err)
    return false
  }
}

export interface RegisterMemberResponse {
  msg: string
  member: SupaMember
  user: SupaUser
}

export function registerMember(props: {
  user: Partial<SupaUser>
  member: Partial<SupaMember>
  sourceId: string
}): Promise<RegisterMemberResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('zomg gonna registerMember! props:', props)
      const { data, error } = await supabase.functions.invoke('register', {
        body: props
      })

      console.log('register fn error, data:', error, data)

      if (error || !data) {
        reject(error)
      }

      resolve(data as RegisterMemberResponse)
    } catch (e) {
      reject(e)
    }
  })
}
