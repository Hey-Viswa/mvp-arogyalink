import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center px-6">
        <h1 className="text-5xl font-bold text-indigo-600">
          AarogyaLink
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          A modern, voice-enabled prescription system.
        </p>
        <p className="mt-2 text-gray-500">
          Built for the modern healthcare professional and patient.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/login" legacyBehavior>
            <a className="px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Login
            </a>
          </Link>
          <Link href="/signup" legacyBehavior>
            <a className="px-6 py-3 text-lg font-semibold text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Sign Up
            </a>
          </Link>
        </div>
      </div>
      <footer className="absolute bottom-8 text-gray-500">
        <p>A Hackathon MVP Prototype</p>
      </footer>
    </div>
  );
}
