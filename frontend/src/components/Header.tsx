interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
  // Only show header if sidebar is closed
  if (isSidebarOpen) return null;

  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-gray-800 text-white p-4 flex items-center md:hidden">
      <button
        onClick={toggleSidebar}
        className="mr-4 flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full hover:bg-gray-600 transition"
      >
        {/* Right arrow for opening sidebar */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <h1 className="text-xl font-bold">ChatGPT</h1>
    </header>
  );
}
