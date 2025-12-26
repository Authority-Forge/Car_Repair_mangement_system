import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { StatsCard } from '../../components/mechanic/StatsCard';
import { ActiveJobsTable } from '../../components/mechanic/ActiveJobsTable';

export function DashboardPage() {
    const [stats, setStats] = useState<{ activeJobs: number; dailyRevenue: number; pendingParts: number } | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/mechanic/dashboard');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl lg:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">Garage Dashboard</h1>
                    <p className="text-slate-500 dark:text-[#9dabb9] text-base font-normal">Overview of active repairs and shop performance</p>
                </div>
                <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-white shadow-lg shadow-primary/30 hover:bg-blue-600 transition-all active:scale-95">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                    <span className="text-sm font-bold">New Job</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                    title="Active Jobs"
                    icon="build_circle"
                    value={stats?.activeJobs.toString() || '0'}
                    subText="In the shop"
                    subIcon="garage"
                    subColor="text-blue-500"
                />
                <StatsCard
                    title="Revenue Today"
                    icon="payments"
                    value={`$${stats?.dailyRevenue.toLocaleString() || '0'}`}
                    iconColor="text-green-500"
                    progressBarValue={stats ? Math.min((stats.dailyRevenue / 5000) * 100, 100) : 0}
                    progressBarColor="bg-green-500"
                />
                <StatsCard
                    title="Pending Parts"
                    icon="inventory"
                    value={stats?.pendingParts.toString() || '0'}
                    iconColor="text-amber-500"
                    subText="Action needed"
                    subIcon="warning"
                    subColor="text-amber-500"
                />
            </div>

            <ActiveJobsTable />
        </>
    );
}
