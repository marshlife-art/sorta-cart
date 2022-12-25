import { Session, User, ApiError } from '@supabase/supabase-js'
import { SupaUser } from '../../types/SupaTypes'

export interface GetSession {
  (): Promise<Session | null>
}

export interface SignIn {
  (email: string, password?: string | undefined): Promise<{
    session: Session | null
    user: User | null
    error: ApiError | null
  }>
}

export interface SingOut {
  (): Promise<{
    error: ApiError | null
  }>
}

export interface IsAdmin {
  (user?: SupaUser): boolean
}

export interface Auth {
  getSession: GetSession
  signIn: SignIn
  signOut: SingOut
  isAdmin: IsAdmin
}
