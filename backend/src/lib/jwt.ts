import { jwtVerify, SignJWT } from "jose";

const ALGORITHM = "HS256";
const TOKEN_TTL = "24h";

const secret = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secret);

export function signToken(adminId: string) {
  return new SignJWT()
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(adminId)
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(key);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify<{ sub: string }>(token, key, {
    algorithms: [ALGORITHM],
    requiredClaims: ["sub", "exp"],
  });
  return payload;
}
