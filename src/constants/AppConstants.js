export const API_BASE_URL = '/api/rest'

export const API_STATUS = {
  INITIAL: 'INITIAL',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
}

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
}

export const DEMO_USER = {
  USERNAME: 'praneeth07',
  EMAIL: 'kotalapraneeth07@gmail.com',
}

export const TRANSACTION_TYPES = {
  ALL: 'all',
  CREDIT: 'credit',
  DEBIT: 'debit',
}

export const TRANSACTION_TYPE_OPTIONS = [
  { id: 'type-debit', value: 'debit', label: 'Debit' },
  { id: 'type-credit', value: 'credit', label: 'Credit' },
]

export const TRANSACTION_CATEGORIES = [
  { id: 'cat-shopping', value: 'shopping', label: 'Shopping' },
  { id: 'cat-transfer', value: 'transfer', label: 'Transfer' },
  { id: 'cat-service', value: 'service', label: 'Service' },
  { id: 'cat-food', value: 'food', label: 'Food' },
  { id: 'cat-entertainment', value: 'entertainment', label: 'Entertainment' },
]

export const TRANSACTION_TABS = [
  { id: 'tab-all', type: 'all', label: 'All Transactions' },
  { id: 'tab-credit', type: 'credit', label: 'Credit' },
  { id: 'tab-debit', type: 'debit', label: 'Debit' },
]

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  RECENT_TRANSACTIONS_LIMIT: 3,
  INITIAL_OFFSET: 0,
}

export const VALIDATION_LIMITS = {
  TRANSACTION_NAME_MAX_LENGTH: 30,
  MINIMUM_AMOUNT: 0.01,
}

export const APP_ASSETS = {
  LOGO: 'https://res.cloudinary.com/dedvz7flb/image/upload/v1690691528/Logo_mwe4ia.png',
  USER_AVATAR: 'https://res.cloudinary.com/dedvz7flb/image/upload/v1690732588/Avatar_gtwywh.png',
  PROFILE_PIC: 'https://res.cloudinary.com/dedvz7flb/image/upload/v1690733213/Group_206_ognawd.png',
  LOGOUT_WARNING: 'https://res.cloudinary.com/dedvz7flb/image/upload/v1690761784/Group_848_zitmxv.png',
}
