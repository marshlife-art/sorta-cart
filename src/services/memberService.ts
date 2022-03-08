import { API_HOST } from '../constants'
import { Member } from '../types/Member'
import { User } from '../types/User'

export async function checkIfEamilExists(email: string): Promise<boolean> {
  try {
    const r = await fetch(`${API_HOST}/members/email-available`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email
      })
    })
    const response = await r.json()
    return response.ok
  } catch (err) {
    console.warn('onoz! register/check err:', err)
    return false
  }
}

export interface RegisterMemberResponse {
  msg: string
  member: Member
  user: User
}

export function registerMember(props: {
  user: Partial<User>
  member: Partial<Member>
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
