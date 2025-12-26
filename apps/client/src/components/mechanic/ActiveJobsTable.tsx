
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface JobSummary {
    id: number;
    description: string;
    status: string;
    vehicle: {
        make: string;
        model: string;
        year: number;
    };
    customer: {
        fullName: string;
        imageUrl?: string;
    };
    advisor: {
        fullName: string;
    };
}

export function ActiveJobsTable() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<JobSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await api.get('/mechanic/jobs');
                setJobs(response.data);
            } catch (error) {
                console.error('Failed to fetch jobs', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    return (
        <>
            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white dark:bg-[#1c232b] p-4 rounded-xl border border-slate-200 dark:border-[#3b4754] shadow-sm">
                <div className="w-full lg:w-96">
                    <label className="relative flex w-full items-center">
                        <div className="absolute left-3 text-slate-400">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
                        </div>
                        <input className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-50 dark:bg-[#283039] border border-slate-200 dark:border-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9dabb9] focus:ring-2 focus:ring-primary focus:border-transparent text-sm" placeholder="Search by plate, name, or Job ID..." />
                    </label>
                </div>
                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    <button className="flex h-9 items-center justify-center gap-x-2 rounded-lg border border-slate-200 dark:border-transparent bg-slate-50 dark:bg-[#283039] px-3 hover:bg-slate-100 dark:hover:bg-[#323b46] transition-colors">
                        <span className="text-slate-700 dark:text-white text-xs font-medium">Status: All</span>
                        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400" style={{ fontSize: '18px' }}>keyboard_arrow_down</span>
                    </button>
                    <button className="flex h-9 items-center justify-center gap-x-2 rounded-lg border border-slate-200 dark:border-transparent bg-slate-50 dark:bg-[#283039] px-3 hover:bg-slate-100 dark:hover:bg-[#323b46] transition-colors">
                        <span className="text-slate-700 dark:text-white text-xs font-medium">Mechanic: All</span>
                        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400" style={{ fontSize: '18px' }}>keyboard_arrow_down</span>
                    </button>
                    <button className="flex h-9 items-center justify-center gap-x-2 rounded-lg border border-slate-200 dark:border-transparent bg-slate-50 dark:bg-[#283039] px-3 hover:bg-slate-100 dark:hover:bg-[#323b46] transition-colors">
                        <span className="text-slate-700 dark:text-white text-xs font-medium">Sort by: Date</span>
                        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400" style={{ fontSize: '18px' }}>sort</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#3b4754] bg-white dark:bg-[#1c232b] shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-[#9dabb9]">
                        <thead className="bg-slate-50 dark:bg-[#252b33] text-xs uppercase font-semibold text-slate-500 dark:text-[#9dabb9]">
                            <tr>
                                <th className="px-6 py-4" scope="col">Job ID</th>
                                <th className="px-6 py-4" scope="col">Vehicle</th>
                                <th className="px-6 py-4" scope="col">Customer</th>
                                <th className="px-6 py-4" scope="col">Assigned To</th>
                                <th className="px-6 py-4" scope="col">Status</th>
                                <th className="px-6 py-4 text-right" scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-[#2e3742]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                            <span>Loading jobs...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : jobs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">No active jobs found.</td>
                                </tr>
                            ) : jobs.map((job) => (
                                <tr
                                    key={job.id}
                                    className="hover:bg-slate-50 dark:hover:bg-[#222932] transition-colors group cursor-pointer"
                                    onClick={() => navigate(`/job/${job.id}`)}
                                >
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">#JOB-{job.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 dark:text-white font-medium">{job.vehicle.year} {job.vehicle.make} {job.vehicle.model}</span>
                                            <span className="text-xs truncate max-w-[200px]">{job.description}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                                                {(job.customer?.fullName || 'Unknown User').split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span>{job.customer?.fullName || 'Unknown User'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{job.advisor?.fullName || 'Unassigned'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${job.status === 'In Progress'
                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                            : job.status === 'Waiting on Parts'
                                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">chevron_right</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Visual Pagination Footer */}
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-[#2e3742] bg-white dark:bg-[#1c232b] px-6 py-4">
                    <p className="text-sm text-slate-500 dark:text-[#9dabb9]">Showing <span className="font-medium">{jobs.length}</span> results</p>
                    <div className="flex gap-2">
                        <button className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#283039] px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-[#323b46] disabled:opacity-50" disabled>
                            Previous
                        </button>
                        <button className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#283039] px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-[#323b46] disabled:opacity-50" disabled>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
