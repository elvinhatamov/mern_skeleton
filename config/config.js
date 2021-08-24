const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECTRET || 'elvin',
  mongoUri: process.env.MONGODB_URI || process.env.Mongo_HOST || '....',
}

export default config
