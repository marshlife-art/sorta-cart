import { Auth, GetSession, SignIn, SingOut } from '../types'

import { supabase } from '../../../lib/supabaseClient'

const getSession: GetSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  return data.session
}

/*
#TODO: deal with redirectTo 
{
redirectTo:
  process.env.NODE_ENV === 'production'
    ? 'https://sorta-cart.vercel.app/store' // this could live elsewhere :/
    : `${window.location.origin}`
}
*/
const signIn: SignIn = async (email: string, password?: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo:
        process.env.NODE_ENV === 'production'
          ? // #TODO: get this url from constants.
            'https://sorta-cart.vercel.app/admin'
          : `${window.location.origin}/store`
    }
  })

  return { session: data.session, user: data.user, error }
}

const signOut: SingOut = () => {
  return supabase.auth.signOut()
}

export const supaAuth: Auth = {
  getSession,
  signIn,
  signOut
}
