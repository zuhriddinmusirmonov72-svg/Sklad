export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Spinning icon */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Yuklanmoqda text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Yuklanmoqda...
          </p>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
}
