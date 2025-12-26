import { LoginForm } from "../../components/auth/LoginForm";

export function LoginPage() {
    return (
        <>
            <header className="w-full flex items-center justify-between border-b border-solid border-slate-200 px-6 py-4 bg-white">
                <div className="flex items-center gap-3">
                    <div className="size-8 text-primary flex items-center justify-center rounded-lg bg-primary/10">
                        <span className="material-symbols-outlined text-2xl">
                            garage_home
                        </span>
                    </div>
                    <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em]">
                        Garage OS
                    </h2>
                </div>
                <div className="hidden sm:flex gap-4 text-sm font-medium">
                    <a
                        href="#"
                        className="text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        Support
                    </a>
                    <a
                        href="#"
                        className="text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        Contact
                    </a>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                        <div className="px-6 pt-8 pb-6">
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold leading-tight tracking-tight mb-2 text-slate-900">
                                    Welcome Back
                                </h1>
                                <p className="text-slate-500 text-sm">
                                    Sign in to manage your vehicle or garage.
                                </p>
                            </div>

                            <LoginForm />

                        </div>
                        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 text-center">
                            <p className="text-sm text-slate-500">
                                Don't have an account?{" "}
                                <a
                                    href="#"
                                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                                >
                                    Sign up
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center gap-6 text-xs text-slate-400">
                        <a href="#" className="hover:text-slate-600">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-slate-600">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </main>
        </>
    );
}
