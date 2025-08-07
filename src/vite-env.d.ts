/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA4_MEASUREMENT_ID: string
  readonly VITE_MAILCHIMP_API_KEY: string
  readonly VITE_MAILCHIMP_SERVER_PREFIX: string
  readonly VITE_MAILCHIMP_LIST_ID: string
  readonly VITE_APP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}