import { Outlet, Link } from "react-router-dom";

export function CustomerLayout() {
    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-display text-gray-900 overflow-x-hidden">
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
                <div className="px-4 md:px-10 py-3 max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-900">
                        <div className="text-primary">
                            <span className="material-symbols-outlined text-3xl">build_circle</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-tight">AutoFix Garage</h2>
                    </div>
                    <div className="hidden md:flex flex-1 justify-end items-center gap-8">
                        <nav className="flex items-center gap-6">
                            <Link to="/portal" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                                Dashboard
                            </Link>
                            <Link to="/portal/vehicles" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px] fill-1">directions_car</span>
                                My Vehicles
                            </Link>
                            <Link to="/portal/invoices" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                                Invoices
                            </Link>
                            <Link to="/portal/support" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">support_agent</span>
                                Support
                            </Link>
                        </nav>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-bold">Alex Morgan</p>
                                <p className="text-xs text-gray-500">Premium Member</p>
                            </div>
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-gray-200 flex items-center justify-center bg-gray-100 text-gray-400">
                                <span className="material-symbols-outlined">person</span>
                            </div>
                        </div>
                    </div>
                    <button className="md:hidden p-2 text-gray-600">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </header>
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-10 py-8">
                <Outlet />
            </main>
        </div>
    );
}
