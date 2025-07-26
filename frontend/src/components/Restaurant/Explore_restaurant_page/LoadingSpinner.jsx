"use client"

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-solid mx-auto mb-4"></div>
        <p className="text-gray-600">Loading restaurant details...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
