import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { api } from "../../lib/api";
import { useNavigate } from "react-router-dom";

const registerSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    role: z.enum(["Mechanic", "Customer"]),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: "Customer",
        },
    });

    const currentRole = watch("role");

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            // API expects { email, password, fullName, role }
            const { confirmPassword, ...payload } = data;
            const response = await api.post("/auth/register", payload);
            const { access_token } = response.data;
            localStorage.setItem("token", access_token);

            if (data.role === "Mechanic") {
                navigate("/dashboard");
            } else {
                navigate("/portal");
            }
        } catch (err: any) {
            // Handle specific 400 errors from backend DTO validation
            setError(
                err.response?.data?.message || "Registration failed. Please try again."
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
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium mb-1.5 text-slate-700">
                        Full Name
                    </label>
                    <Input
                        id="fullName"
                        icon="person"
                        placeholder="John Doe"
                        type="text"
                        error={errors.fullName?.message}
                        {...register("fullName")}
                    />
                </div>

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
                    <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-slate-700">
                        Password
                    </label>
                    <Input
                        id="password"
                        icon="lock"
                        placeholder="••••••••"
                        type="password"
                        error={errors.password?.message}
                        {...register("password")}
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5 text-slate-700">
                        Confirm Password
                    </label>
                    <Input
                        id="confirmPassword"
                        icon="lock"
                        placeholder="••••••••"
                        type="password"
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword")}
                    />
                </div>

                {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                <Button type="submit" isLoading={isLoading} className="mt-2">
                    <span>Create Account</span>
                    <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                    </span>
                </Button>
            </form>
        </div>
    );
}
