import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as reportService from '../services/report.service'
import { getErrorMessage } from '../utils/errorHandler'

const API_ORIGIN = import.meta.env.VITE_API_URL

const STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Verified: 'bg-blue-50 text-blue-700 border-blue-200',
  Resolved: 'bg-green-50 text-green-700 border-green-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
}

function StatusBadge({ status }) {
  const styles = STATUS_STYLES[status] || 'bg-gray-50 text-gray-600 border-gray-200'
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles}`}>
      {status}
    </span>
  )
}

const PAGE_SIZE = 10

export default function MyReports() {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  async function loadReports(pageToLoad) {
    setIsLoading(true)
    setError('')
    try {
      const result = await reportService.getMyReports({ page: pageToLoad, limit: PAGE_SIZE })
      const { reports: fetchedReports, total: fetchedTotal, totalPages: fetchedTotalPages } = result.data

      if (fetchedReports.length === 0 && pageToLoad > 1 && fetchedTotal > 0) {
        setPage(1)
        return
      }

      setReports(fetchedReports)
      setTotal(fetchedTotal)
      setTotalPages(Math.max(fetchedTotalPages, 1))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReports(page)
  }, [page])

  function goToPage(nextPage) {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return
    setPage(nextPage)
  }

  return (
    <div className="min-h-screen bg-brand-lavender py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-sans text-3xl font-bold text-gray-900 mb-2">My Reports</h1>
            <p className="text-gray-500 text-sm">Track the status of the outage reports you've submitted.</p>
          </div>
          <Link
            to="/report"
            className="shrink-0 whitespace-nowrap rounded-lg bg-brand-purple px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-purple-dark"
          >
            New Report
          </Link>
        </div>

        {isLoading && (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
            Loading your reports...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => loadReports(page)}
              className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && reports.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">You haven't submitted any reports yet.</p>
            <Link to="/report" className="mt-3 inline-block text-sm font-semibold text-brand-purple hover:underline">
              Submit your first report
            </Link>
          </div>
        )}

        {!isLoading && !error && reports.length > 0 && (
          <>
            <p className="mb-3 text-xs text-gray-400">
              Showing page {page} of {totalPages} ({total} total {total === 1 ? 'report' : 'reports'})
            </p>

            <div className="flex flex-col gap-3">
              {reports.map(report => (
                <div key={report._id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{report.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {report.municipality}, Ward {report.ward}, {report.district}
                      </p>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>

                  <p className="text-xs text-brand-purple font-medium mt-2">{report.outageType}</p>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>

                  {report.status === 'Rejected' && report.rejectionReason && (
                    <p className="text-xs text-red-600 mt-2">Reason: {report.rejectionReason}</p>
                  )}
                  {report.status === 'Resolved' && report.estimatedRestoreTime && (
                    <p className="text-xs text-green-700 mt-2">
                      Restored by: {new Date(report.estimatedRestoreTime).toLocaleString()}
                    </p>
                  )}

                  {report.image && (
                    <img
                      src={`${API_ORIGIN}${report.image}`}
                      alt={report.title}
                      className="mt-3 h-24 w-24 rounded-lg object-cover border border-gray-200"
                    />
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    Submitted {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => goToPage(pageNumber)}
                      aria-current={pageNumber === page ? 'page' : undefined}
                      className={`h-9 w-9 rounded-lg text-sm font-semibold transition-colors ${pageNumber === page
                          ? 'bg-brand-purple text-white'
                          : 'text-gray-600 hover:bg-white'
                        }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}