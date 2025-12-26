
import { Link, Outlet } from 'react-router-dom';

export function DashboardLayout() {
    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200">
            {/* Header */}
            <header className="flex w-full flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-[#111418] lg:px-8 z-50">
                <div className="flex items-center gap-3">
                    <div
                        className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 bg-center bg-cover bg-no-repeat"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCuz0UqM9oDSIxRTDrKleyCB-rFLqhGNIkAwR0OOE2fd37TwcA11c7RsvfpE7rmJLKlUS9fo1ryXp_JiqJaER5S0ufBQ0KLVFw-ZLDXFpgKiNjPZ3ZPZGkc2d8-UcTZKIyYYEdrcQLcwSZ1WBlyiYmQ3a_gfJhbRZlUWtMSHPoOTk3L3Kj0Aa_2Zkr0O_ubxirnY-Ux9aJVH7KoX-YmOgEPFZPEAua1JpizCaspiblsiAu7jJwod_h37YKLOiQXWfrBbXl0UHyCsPE")' }}
                    ></div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">AutoFix Manager</span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-2">
                    <Link to="/dashboard" className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors">
                        Dashboard
                    </Link>
                    <Link to="/jobs" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1c232b] dark:hover:text-white transition-colors">
                        Jobs
                    </Link>
                    <Link to="/inventory" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1c232b] dark:hover:text-white transition-colors">
                        Inventory
                    </Link>
                    <Link to="/customers" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1c232b] dark:hover:text-white transition-colors">
                        Customers
                    </Link>
                    <Link to="/settings" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1c232b] dark:hover:text-white transition-colors">
                        Settings
                    </Link>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-[#283039] transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>notifications</span>
                    </button>
                    <div className="hidden h-6 w-px bg-slate-200 dark:bg-slate-700 lg:block"></div>
                    <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-50 dark:hover:bg-[#283039] transition-colors">
                        <div
                            className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 bg-center bg-cover"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDDiLl5iMQt0qgqsfZAJaIbIF-6Vqt8TD3ZqQOYfemP1jZwl93nDnJsoDn7ioLupWljepI5LoF-nx5I3zfQTfz732OpgBoG_yX6fHEyNFrhvE6CPIcvrxaI1gmAC9SpNT1q2wK8_i5qiCuYlFUByGncPNzmMVManEtx7KMa-Hf_v_NJpe8onSeCVz_o6Dz0jOK5xXXpzEZERy15UQoYBy_1CpRVlnV-riRmTtOMIVCP890XzRifj5ncoSiwxv_1jzA5mytuU-fihr4")' }}
                        ></div>
                        <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 lg:block">Alex M.</span>
                    </button>
                    <button className="lg:hidden p-2 text-slate-600 dark:text-white ml-2">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="container mx-auto max-w-[1200px] p-4 lg:p-8 flex flex-col gap-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
