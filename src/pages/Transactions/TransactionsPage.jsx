import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Header } from '../../components/common/Header/Header'
import { TransactionTabs } from '../../components/transactions/TransactionTabs/TransactionTabs'
import { TransactionsTable } from '../../components/transactions/TransactionsTable/TransactionsTable'
import { PaginationControls } from '../../components/common/PaginationControls/PaginationControls'
import { LoaderView } from '../../components/common/LoaderView/LoaderView'
import { ErrorView } from '../../components/common/ErrorView/ErrorView'
import { EmptyTransactionsView } from '../../components/common/EmptyTransactionsView/EmptyTransactionsView'
import { AddTransactionModal } from '../../components/modals/AddTransactionModal/AddTransactionModal'
import { UpdateTransactionModal } from '../../components/modals/UpdateTransactionModal/UpdateTransactionModal'
import { DeleteConfirmationModal } from '../../components/modals/DeleteConfirmationModal/DeleteConfirmationModal'
import {
  fetchTransactions,
  createTransaction,
  modifyTransaction,
  removeTransaction,
} from '../../services/transactionService'
import {
  API_STATUS,
  USER_ROLES,
  PAGINATION,
  TRANSACTION_TYPES,
} from '../../constants/AppConstants'
import './TransactionsPage.css'

export const TransactionsPage = () => {
  const { authUser } = useAuth()
  const isAdmin = authUser?.role === USER_ROLES.ADMIN
  const userId = authUser?.id

  const [activeTab, setActiveTab] = useState(TRANSACTION_TYPES.ALL)
  const [offset, setOffset] = useState(PAGINATION.INITIAL_OFFSET)
  const [pageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE)

  const [allFetchedTransactions, setAllFetchedTransactions] = useState([])
  const [apiStatus, setApiStatus] = useState(API_STATUS.INITIAL)
  const [errorMessage, setErrorMessage] = useState('')

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedTxForEdit, setSelectedTxForEdit] = useState(null)
  const [selectedTxForDelete, setSelectedTxForDelete] = useState(null)

  const loadTransactionsData = useCallback(async () => {
    try {
      setApiStatus(API_STATUS.IN_PROGRESS)
      setErrorMessage('')

      const data = await fetchTransactions({
        role: authUser.role,
        userId,
        limit: 100, // Fetch ample pool for responsive tabs & client pagination
        offset: 0,
      })

      setAllFetchedTransactions(data)
      setApiStatus(API_STATUS.SUCCESS)
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setErrorMessage(err.message || 'Failed to load transactions.')
      setApiStatus(API_STATUS.FAILURE)
    }
  }, [authUser.role, userId])

  useEffect(() => {
    loadTransactionsData()
  }, [loadTransactionsData])

  // Filter based on active tab
  const filteredTransactions = useMemo(() => {
    if (activeTab === TRANSACTION_TYPES.CREDIT) {
      return allFetchedTransactions.filter((tx) => tx.type === 'credit')
    }
    if (activeTab === TRANSACTION_TYPES.DEBIT) {
      return allFetchedTransactions.filter((tx) => tx.type === 'debit')
    }
    return allFetchedTransactions
  }, [allFetchedTransactions, activeTab])

  // Paginate filtered transactions
  const paginatedTransactions = useMemo(() => {
    return filteredTransactions.slice(offset, offset + pageSize)
  }, [filteredTransactions, offset, pageSize])

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    setOffset(PAGINATION.INITIAL_OFFSET)
  }

  const handlePreviousPage = () => {
    setOffset((prev) => Math.max(0, prev - pageSize))
  }

  const handleNextPage = () => {
    setOffset((prev) => prev + pageSize)
  }

  // Modals Handlers
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
    await loadTransactionsData()
  }

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
    await loadTransactionsData()
  }

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
    await loadTransactionsData()
  }

  const pageTitle = isAdmin ? 'All Transactions' : 'Transactions'
  const hasMore = offset + pageSize < filteredTransactions.length

  return (
    <div className="transactions-page-container">
      <Header
        title={pageTitle}
        onAddTransactionClick={handleOpenAddModal}
      />

      <TransactionTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="transactions-content-body">
        {apiStatus === API_STATUS.IN_PROGRESS && (
          <LoaderView message="Loading transactions..." />
        )}

        {apiStatus === API_STATUS.FAILURE && (
          <ErrorView
            message={errorMessage}
            onRetry={loadTransactionsData}
          />
        )}

        {apiStatus === API_STATUS.SUCCESS && (
          <>
            {filteredTransactions.length === 0 ? (
              <EmptyTransactionsView
                message="No transactions in this category"
                description="Try switching tabs or click below to record a new transaction."
                onAddTransactionClick={handleOpenAddModal}
              />
            ) : (
              <div className="transactions-table-section">
                <TransactionsTable
                  transactions={paginatedTransactions}
                  userRole={authUser.role}
                  onEditClick={handleOpenEditModal}
                  onDeleteClick={handleOpenDeleteModal}
                />

                <PaginationControls
                  offset={offset}
                  pageSize={pageSize}
                  hasMore={hasMore}
                  currentCount={paginatedTransactions.length}
                  onPrevious={handlePreviousPage}
                  onNext={handleNextPage}
                />
              </div>
            )}
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
