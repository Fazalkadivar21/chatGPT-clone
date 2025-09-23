interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
  return (
    <header className="bg-gray-800 text-white p-4 flex items-center md:hidden">
      <button onClick={toggleSidebar} className="mr-4">
        {isSidebarOpen ? "Close" : "Menu"}
      </button>
      <h1 className="text-xl font-bold">ChatGPT</h1>
    </header>
  );
}