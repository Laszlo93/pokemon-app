export default () =>
  ({
    nodeEnv: process.env.NODE_ENV ?? 'development',
    app: {
      port: process.env.PORT ? Number(process.env.PORT) : 3000,
      frontendHost: process.env.FRONTEND_HOST,
    },
    db: {
      url: process.env.DATABASE_URL,
      shadowUrl: process.env.SHADOW_DATABASE_URL,
    },
    auth: {
      accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
      authTokenExpirationTime: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
      refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
      refreshTokenExpirationTime: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
    },
  }) as const;
