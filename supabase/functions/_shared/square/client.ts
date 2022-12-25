import 'https://deno.land/x/xhr@0.2.1/mod.ts'
import { Client, Environment } from 'https://esm.sh/square@25.0.0'

const SQUARE_ACCESS_TOKEN = Deno.env.get('SQUARE_ACCESS_TOKEN') ?? ''
const SQUARE_ENV = Deno.env.get('SQUARE_ENV') ?? ''

export const client = new Client({
  environment:
    SQUARE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
  accessToken: SQUARE_ACCESS_TOKEN
})
