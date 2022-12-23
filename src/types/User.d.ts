export interface UserLogin {
  username: string
  password: string
}

export interface LoginError {
  error: string
  reason: string
}

export interface LoginMessage {
  message: string
}
