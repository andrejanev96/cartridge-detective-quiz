/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA4_MEASUREMENT_ID: string
  readonly VITE_APP_URL: string
  // MailChimp public identifiers (client-safe)
  readonly VITE_MAILCHIMP_SERVER_PREFIX: string
  readonly VITE_MAILCHIMP_URL: string
  readonly VITE_MAILCHIMP_USER_ID: string
  readonly VITE_MAILCHIMP_LIST_ID: string
  readonly VITE_MAILCHIMP_FORM_ID: string
  readonly VITE_MAILCHIMP_TAGS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
