import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Header } from '../../components/common/Header/Header'
import { CreditSummaryCard } from '../../components/dashboard/SummaryCard/CreditSummaryCard'
import { DebitSummaryCard } from '../../components/dashboard/SummaryCard/DebitSummaryCard'
import { RecentTransactionsTable } from '../../components/dashboard/RecentTransactionsTable/RecentTransactionsTable'
import { WeeklyBarChart } from '../../components/dashboard/WeeklyBarChart/WeeklyBarChart'
import { LoaderView } from '../../components/common/LoaderView/LoaderView'
import { ErrorView } from '../../components/common/ErrorView/ErrorView'
import { EmptyTransactionsView } from '../../components/common/EmptyTransactionsView/EmptyTransactionsView'
import { AddTransactionModal } from '../../components/modals/AddTransactionModal/AddTransactionModal'
import { UpdateTransactionModal } from '../../components/modals/UpdateTransactionModal/UpdateTransactionModal'
import { DeleteConfirmationModal } from '../../components/modals/DeleteConfirmationModal/DeleteConfirmationModal'
import {
  fetchTransactions,
  fetchTotalsForUser,
  fetchTotalsForAdmin,
  fetchDaywiseTotalsForUser,
  fetchDaywiseTotalsForAdmin,
  createTransaction,
  modifyTransaction,
  removeTransaction,
} from '../../services/transactionService'
import { API_STATUS, USER_ROLES, PAGINATION } from '../../constants/AppConstants'
import './DashboardPage.css'

export const DashboardPage = () => {
  const { authUser } = useAuth()
  const isAdmin = authUser?.role === USER_ROLES.ADMIN
  const userId = authUser?.id

  const [apiStatus, setApiStatus] = useState(API_STATUS.INITIAL)
  const [errorMessage, setErrorMessage] = useState('')

  const [totals, setTotals] = useState({ totalCredit: 0, totalDebit: 0 })
  const [recentTransactions, setRecentTransactions] = useState([])
  const [daywiseData, setDaywiseData] = useState([])

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedTxForEdit, setSelectedTxForEdit] = useState(null)
  const [selectedTxForDelete, setSelectedTxForDelete] = useState(null)

  const loadDashboardData = useCallback(async () => {
    try {
      setApiStatus(API_STATUS.IN_PROGRESS)
      setErrorMessage('')

      const totalsPromise = isAdmin
        ? fetchTotalsForAdmin()
        : fetchTotalsForUser({ userId })

      const daywisePromise = isAdmin
        ? fetchDaywiseTotalsForAdmin()
        : fetchDaywiseTotalsForUser({ userId })

      const transactionsPromise = fetchTransactions({
        role: authUser.role,
        userId,
        limit: PAGINATION.RECENT_TRANSACTIONS_LIMIT,
        offset: PAGINATION.INITIAL_OFFSET,
      })

      const [totalsRes, daywiseRes, txListRes] = await Promise.all([
        totalsPromise,
        daywisePromise,
        transactionsPromise,
      ])

      setTotals(totalsRes)
      setDaywiseData(daywiseRes)
      setRecentTransactions(txListRes)
      setApiStatus(API_STATUS.SUCCESS)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setErrorMessage(err.message || 'Failed to load dashboard overview.')
      setApiStatus(API_STATUS.FAILURE)
    }
  }, [isAdmin, userId, authUser.role])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  // Handlers for Add Transaction
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleAddSubmit = async (newTx) => {
    await createTransaction({
      ...newTx,
      userId,
      role: authUser.role,
    })
    await loadDashboardData()
  }

  // Handlers for Edit Transaction
  const handleOpenEditModal = (tx) => {
    setSelectedTxForEdit(tx)
  }

  const handleCloseEditModal = () => {
    setSelectedTxForEdit(null)
  }

  const handleEditSubmit = async (updatedFields) => {
    await modifyTransaction({
      ...updatedFields,
      userId,
      role: authUser.role,
    })
    await loadDashboardData()
  }

  // Handlers for Delete Transaction
  const handleOpenDeleteModal = (tx) => {
    setSelectedTxForDelete(tx)
  }

  const handleCloseDeleteModal = () => {
    setSelectedTxForDelete(null)
  }

  const handleDeleteConfirm = async ({ id }) => {
    await removeTransaction({
      id,
      userId,
      role: authUser.role,
    })
    await loadDashboardData()
  }

  return (
    <div className="dashboard-page-container">
      <Header
        title="Accounts"
        onAddTransactionClick={handleOpenAddModal}
      />

      <div className="dashboard-content-body">
        {apiStatus === API_STATUS.IN_PROGRESS && (
          <LoaderView message="Loading accounts overview..." />
        )}

        {apiStatus === API_STATUS.FAILURE && (
          <ErrorView
            message={errorMessage}
            onRetry={loadDashboardData}
          />
        )}

        {apiStatus === API_STATUS.SUCCESS && (
          <>
            <section className="dashboard-summary-cards-section">
              <CreditSummaryCard amount={totals.totalCredit} />
              <DebitSummaryCard amount={totals.totalDebit} />
            </section>

            {recentTransactions.length === 0 ? (
              <EmptyTransactionsView
                onAddTransactionClick={handleOpenAddModal}
              />
            ) : (
              <section className="dashboard-recent-transactions-section">
                <RecentTransactionsTable
                  transactions={recentTransactions}
                  onEditClick={handleOpenEditModal}
                  onDeleteClick={handleOpenDeleteModal}
                />
              </section>
            )}

            <section className="dashboard-chart-section">
              <WeeklyBarChart daywiseData={daywiseData} />
            </section>
          </>
        )}
      </div>

      {isAddModalOpen && (
        <AddTransactionModal
          onClose={handleCloseAddModal}
          onSubmit={handleAddSubmit}
        />
      )}

      {selectedTxForEdit && (
        <UpdateTransactionModal
          transaction={selectedTxForEdit}
          onClose={handleCloseEditModal}
          onSubmit={handleEditSubmit}
        />
      )}

      {selectedTxForDelete && (
        <DeleteConfirmationModal
          transaction={selectedTxForDelete}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  )
}
