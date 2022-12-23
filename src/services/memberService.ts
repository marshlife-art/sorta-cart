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

    // const r = await fetch(`${API_HOST}/members/email-available`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     email
    //   })
    // })
    // const response = await r.json()
    // return response.ok
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
      const r = await fetch(`${API_HOST}/members/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(props)
      })
      const response = await r.json()
      resolve(response as RegisterMemberResponse)
    } catch (e) {
      reject(e)
    }
  })
}
