import { sendApiRequest } from './apiClient'
import { USER_ROLES, PAGINATION } from '../constants/AppConstants'

export const fetchTransactions = async ({ role = USER_ROLES.USER, userId = null, limit = PAGINATION.DEFAULT_PAGE_SIZE, offset = PAGINATION.INITIAL_OFFSET }) => {
  const endpoint = `/all-transactions?limit=${limit}&offset=${offset}`
  const data = await sendApiRequest({
    endpoint,
    method: 'GET',
    role,
    userId,
  })

  return data?.transactions || []
}

export const fetchTotalsForUser = async ({ userId }) => {
  const data = await sendApiRequest({
    endpoint: '/credit-debit-totals',
    method: 'GET',
    role: USER_ROLES.USER,
    userId,
  })

  const rawTotals = data?.totals_credit_debit_transactions || []
  let totalCredit = 0
  let totalDebit = 0

  rawTotals.forEach(({ type, sum }) => {
    const numericSum = Number(sum) || 0
    if (type === 'credit') {
      totalCredit = numericSum
    } else if (type === 'debit') {
      totalDebit = numericSum
    }
  })

  return { totalCredit, totalDebit }
}

export const fetchTotalsForAdmin = async () => {
  const data = await sendApiRequest({
    endpoint: '/transaction-totals-admin',
    method: 'GET',
    role: USER_ROLES.ADMIN,
  })

  const rawTotals = data?.transaction_totals_admin || []
  let totalCredit = 0
  let totalDebit = 0

  rawTotals.forEach(({ type, sum }) => {
    const numericSum = Number(sum) || 0
    if (type === 'credit') {
      totalCredit = numericSum
    } else if (type === 'debit') {
      totalDebit = numericSum
    }
  })

  return { totalCredit, totalDebit }
}

export const fetchDaywiseTotalsForUser = async ({ userId }) => {
  const data = await sendApiRequest({
    endpoint: '/daywise-totals-7-days',
    method: 'GET',
    role: USER_ROLES.USER,
    userId,
  })

  return data?.last_7_days_transactions_credit_debit_totals || []
}

export const fetchDaywiseTotalsForAdmin = async () => {
  const data = await sendApiRequest({
    endpoint: '/daywise-totals-last-7-days-admin',
    method: 'GET',
    role: USER_ROLES.ADMIN,
  })

  return data?.last_7_days_transactions_totals_admin || []
}

export const createTransaction = async ({ name, type, category, amount, date, userId, role = USER_ROLES.USER }) => {
  const payload = {
    name,
    type,
    category,
    amount: Number(amount),
    date,
    user_id: Number(userId),
  }

  const data = await sendApiRequest({
    endpoint: '/add-transaction',
    method: 'POST',
    body: payload,
    role,
    userId,
  })

  return data?.insert_transactions_one || null
}

export const modifyTransaction = async ({ id, name, type, category, amount, date, userId, role = USER_ROLES.USER }) => {
  const payload = {
    id: Number(id),
    name,
    type,
    category,
    amount: Number(amount),
    date,
  }

  const data = await sendApiRequest({
    endpoint: '/update-transaction',
    method: 'POST',
    body: payload,
    role,
    userId,
  })

  return data?.update_transactions_by_pk || null
}

export const removeTransaction = async ({ id, userId, role = USER_ROLES.USER }) => {
  const payload = {
    id: Number(id),
  }

  const data = await sendApiRequest({
    endpoint: '/delete-transaction',
    method: 'DELETE',
    body: payload,
    role,
    userId,
  })

  return data?.delete_transactions_by_pk || null
}
