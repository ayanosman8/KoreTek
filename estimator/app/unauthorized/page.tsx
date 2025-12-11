import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md text-center">
        <div>
          <h1 className="text-4xl font-bold text-red-600 mb-2">403</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page. This area is restricted to authorized users only.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Go to Home
          </Link>

          <Link
            href="/auth/login"
            className="block w-full py-2 px-4 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-md transition-colors"
          >
            Sign In
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          If you believe you should have access to this page, please contact support.
        </p>
      </div>
    </div>
  );
}
