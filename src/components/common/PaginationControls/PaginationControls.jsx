import { ChevronLeft, ChevronRight } from 'lucide-react'
import './PaginationControls.css'

export const PaginationControls = ({
  offset,
  pageSize,
  hasMore,
  onPrevious,
  onNext,
  currentCount,
}) => {
  const currentPage = Math.floor(offset / pageSize) + 1
  const isPreviousDisabled = offset <= 0
  const isNextDisabled = !hasMore || currentCount < pageSize

  return (
    <div className="pagination-controls-container">
      <div className="pagination-info">
        <span>Showing {currentCount} items</span>
        <span className="pagination-divider">&bull;</span>
        <span>Page {currentPage}</span>
      </div>

      <div className="pagination-buttons">
        <button
          type="button"
          className="pagination-btn"
          onClick={onPrevious}
          disabled={isPreviousDisabled}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <button
          type="button"
          className="pagination-btn"
          onClick={onNext}
          disabled={isNextDisabled}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
