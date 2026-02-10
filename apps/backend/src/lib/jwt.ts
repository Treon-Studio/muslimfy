import { SignJWT, jwtVerify } from 'jose'

const ACCESS_TOKEN_EXPIRY = '15m'  // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'  // 7 days

export interface TokenPayload {
  userId: string
  email: string
  type: 'access' | 'refresh'
}

function getSecretKey(secret: string): Uint8Array {
  return new TextEncoder().encode(secret)
}

export async function generateAccessToken(
  payload: Omit<TokenPayload, 'type'>,
  secret: string
): Promise<string> {
  return new SignJWT({ ...payload, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(getSecretKey(secret))
}

export async function generateRefreshToken(
  payload: Omit<TokenPayload, 'type'>,
  secret: string
): Promise<string> {
  return new SignJWT({ ...payload, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(getSecretKey(secret))
}

export async function verifyToken(
  token: string,
  secret: string
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(secret))
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

export function getRefreshTokenExpiry(): Date {
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + 7) // 7 days
  return expiry
}
