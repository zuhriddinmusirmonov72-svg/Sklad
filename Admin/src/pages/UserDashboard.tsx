import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";

export default function UserDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <>
      <PageMeta title="Foydalanuvchi Paneli" description="Oddiy foydalanuvchi uchun panel" />
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-2xl p-8 mx-4 bg-white rounded-2xl shadow-xl dark:bg-gray-800">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-blue-100 rounded-full dark:bg-blue-900/30">
              <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            
            <h1 className="mb-3 text-3xl font-bold text-gray-800 dark:text-white">
              Xush kelibsiz! 👋
            </h1>
            
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Siz oddiy foydalanuvchi sifatida kirdingiz
            </p>
            
            <div className="p-6 mb-8 bg-yellow-50 border border-yellow-200 rounded-xl dark:bg-yellow-900/20 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-left">
                  <h3 className="mb-2 font-semibold text-yellow-800 dark:text-yellow-200">
                    Admin panelga kirish uchun:
                  </h3>
                  <div className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                    <p>📧 <strong>Email:</strong> admin@gmail.com</p>
                    <p>🔐 <strong>Parol:</strong> admin</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Chiqish
              </button>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Admin sifatida kirish uchun tizimdan chiqing va qayta kiring
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
