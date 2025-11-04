declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_APP_NAME: string
    NEXT_PUBLIC_APP_URL: string
    ETHEREUM_RPC_URL: string
    AAVE_V3_POOL_ADDRESS: string
    MONITORED_ADDRESS: string
    HEALTH_FACTOR_THRESHOLD: string
    RESEND_API_KEY: string
    NOTIFICATION_EMAIL: string
    CRON_SCHEDULE: string
  }
}
