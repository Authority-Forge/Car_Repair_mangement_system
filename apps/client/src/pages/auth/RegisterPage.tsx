import { RegisterForm } from "../../components/auth/RegisterForm";

export function RegisterPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Branding/Copy */}
            <div className="hidden lg:flex flex-col justify-between bg-slate-900 p-12 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-lg font-bold mb-12">
                        <span className="material-symbols-outlined text-[32px] text-primary">
                            build_circle
                        </span>
                        <span>AutoTrack Pro</span>
                    </div>
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Join the future of <br />
                        <span className="text-primary">Auto Repair</span> management.
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md">
                        Create an account to track repairs, manage jobs, and streamline communication between mechanics and vehicle owners.
                    </p>
                </div>

                <div className="relative z-10 text-sm text-slate-500">
                    © 2024 AutoTrack Pro. All rights reserved.
                </div>

                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Right: Registration Form */}
            <div className="flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Sign Up</h2>
                        <p className="mt-2 text-slate-600">
                            Already have an account?{" "}
                            <a href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                Sign in
                            </a>
                        </p>
                    </div>

                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}
