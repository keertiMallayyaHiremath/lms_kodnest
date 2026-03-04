export const securityConfig = {
  bcryptRounds: 12,
  refreshTokenCookie: {
    name: 'refreshToken',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
};
