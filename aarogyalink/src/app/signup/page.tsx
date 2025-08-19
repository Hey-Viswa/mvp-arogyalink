import SignUp from "@/components/auth/SignUp";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-lg sm:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 md:text-3xl">
          Create an account
        </h2>
        <div className="mt-6">
          <SignUp />
        </div>
      </div>
    </div>
  );
}
