import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { api } from "../../lib/api";
import { useNavigate } from "react-router-dom";

// Schema matching Backend DTO
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["Mechanic", "Customer"]),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            role: "Mechanic", // Default as per mock (checked)
        },
    });

    const currentRole = watch("role");

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post("/auth/login", data);
            const { access_token } = response.data;
            localStorage.setItem("token", access_token); // Simple storage for MVP
            // Redirect based on role
            if (data.role === "Mechanic") {
                navigate("/dashboard");
            } else {
                navigate("/portal");
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Invalid credentials. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <div className="flex w-full rounded-lg bg-slate-100 p-1">
                    <label className="cursor-pointer flex-1 text-center">
                        <input
                            type="radio"
                            className="peer sr-only"
                            value="Mechanic"
                            {...register("role")}
                        />
                        <div className={
                            `rounded-md py-2 px-4 text-sm font-medium transition-all ${currentRole === 'Mechanic'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-slate-500'
                            }`
                        }>
                            Mechanic
                        </div>
                    </label>
                    <label className="cursor-pointer flex-1 text-center">
                        <input
                            type="radio"
                            className="peer sr-only"
                            value="Customer"
                            {...register("role")}
                        />
                        <div className={
                            `rounded-md py-2 px-4 text-sm font-medium transition-all ${currentRole === 'Customer'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-slate-500'
                            }`
                        }>
                            Customer
                        </div>
                    </label>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-slate-700">
                        Email Address
                    </label>
                    <Input
                        id="email"
                        icon="mail"
                        placeholder="user@example.com"
                        type="email"
                        error={errors.email?.message}
                        {...register("email")}
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <a
                            href="#"
                            className="text-sm font-medium text-primary hover:text-primary/80"
                        >
                            Forgot Password?
                        </a>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            icon="lock"
                            placeholder="••••••••"
                            type="password"
                            error={errors.password?.message}
                            {...register("password")}
                        />
                    </div>
                </div>

                {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                <Button type="submit" isLoading={isLoading}>
                    <span>Sign In</span>
                    <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                    </span>
                </Button>
            </form>
        </div>
    );
}
