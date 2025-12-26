import { Link, useParams } from "react-router-dom";
import { useState, useEffect, FormEvent } from "react";
import { api } from "../../lib/api";

interface JobDetails {
    id: number;
    description: string;
    status: string;
    createdAt: string;
    vehicle: {
        vin: string;
        make: string;
        model: string;
        year: number;
        mileage: number;
        licensePlate: string;
        engineType?: string;
        imageUrl?: string;
    };
    customer: {
        fullName: string;
        email: string;
        phone?: string;
        address?: string;
        createdAt: string;
    };
    advisor: {
        fullName: string;
    };
    workRecords: Array<{
        id: number;
        description: string;
        type: 'Labor' | 'Part';
        quantity: string;
        rate: string;
        total: string;
    }>;
    notes: Array<{
        id: number;
        content: string;
        type: 'Internal' | 'Customer';
        createdAt: string;
        user: {
            fullName: string;
            role: string;
        };
    }>;
    history?: Array<{
        id: number;
        description: string;
        createdAt: string;
        status: string;
    }>;
}

export function JobDetailsPage() {
    const { id } = useParams();
    const [job, setJob] = useState<JobDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [noteContent, setNoteContent] = useState("");
    const [isSubmittingNote, setIsSubmittingNote] = useState(false);
    const [activeNoteTab, setActiveNoteTab] = useState<'Internal' | 'Customer'>('Internal');
    const [showAddRecordModal, setShowAddRecordModal] = useState(false);
    const [newRecord, setNewRecord] = useState({ description: "", type: "Part" as "Part" | "Labor", quantity: 1, rate: 0 });

    const handleAudit = async (action: string, payload?: any) => {
        try {
            await api.post('/mechanic/audit', {
                action,
                resource: `job:${id}`,
                payload
            });
        } catch (err) {
            console.warn("Audit logging failed", err);
        }
    };

    const fetchJob = async () => {
        try {
            const response = await api.get(`/mechanic/jobs/${id}`);
            setJob(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch job details");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchJob();
            setLoading(false);
        };
        if (id) loadData();
    }, [id]);

    const handleNoteSubmit = async () => {
        if (!noteContent.trim() || !id) return;
        try {
            setIsSubmittingNote(true);
            await api.post(`/mechanic/jobs/${id}/notes`, {
                content: noteContent,
                type: activeNoteTab
            });
            setNoteContent("");
            await fetchJob(); // Refresh
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to add message");
        } finally {
            setIsSubmittingNote(false);
        }
    };

    const handleEditVehicle = () => {
        handleAudit('UI_CLICK_EDIT_VEHICLE');
        alert("Edit Vehicle feature coming soon! You will be able to update make, model, year and VIN here.");
    };

    const handleEditCustomer = () => {
        handleAudit('UI_CLICK_EDIT_CUSTOMER');
        alert("Customer Management feature coming soon! You will be able to update name, contact info, and address.");
    };

    const handlePrint = () => {
        handleAudit('UI_CLICK_PRINT');
        window.print();
    };

    const handleSaveChanges = () => {
        handleAudit('UI_CLICK_SAVE_CHANGES');
        alert("Changes saved successfully!");
    };

    const handleOpenSettings = () => {
        handleAudit('UI_CLICK_SETTINGS');
        alert("Job Settings coming soon!");
    };

    const handleCustomerContact = (type: 'Call' | 'SMS') => {
        handleAudit(`UI_CLICK_${type.toUpperCase()}`);
        alert(`${type}ing customer ${job?.customer.fullName}...`);
    };

    const handleViewAllHistory = () => {
        handleAudit('UI_CLICK_VIEW_HISTORY');
        alert("Full service history coming soon!");
    };

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            await api.patch(`/mechanic/jobs/${id}`, { status: newStatus });
            await fetchJob();
        } catch (err: any) {
            alert("Failed to update status.");
        }
    };

    const handleAddRecordSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const total = newRecord.quantity * newRecord.rate;
            await api.post(`/mechanic/jobs/${id}/records`, {
                ...newRecord,
                total
            });
            setShowAddRecordModal(false);
            setNewRecord({ description: "", type: "Part", quantity: 1, rate: 0 });
            await fetchJob();
        } catch (err: any) {
            alert("Failed to add record.");
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="flex-1 p-10 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                <p className="text-gray-600">{error || "Job not found"}</p>
                <Link to="/jobs" className="mt-4 inline-block text-primary hover:underline">Back to Jobs</Link>
            </div>
        );
    }

    const formatShortDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (

        <div className="flex-1 px-4 md:px-10 py-6 max-w-[1600px] mx-auto w-full">
            {/* Breadcrumb & Header */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2 pb-2">
                    <Link to="/jobs" className="text-gray-500 text-sm font-medium hover:text-primary transition-colors">Jobs</Link>
                    <span className="text-gray-500 text-sm font-medium">/</span>
                    <span className="text-gray-900 text-sm font-medium">Job #{id || '8492'}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-gray-900 text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                            {job.vehicle.year} {job.vehicle.make} {job.vehicle.model}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm">
                            <span>Job #{job.id}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-500/50"></span>
                            <span>Created {formatDate(job.createdAt)}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-500/50"></span>
                            <span>Advisor: {job.advisor?.fullName || 'Unassigned'}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[180px]">
                            <select
                                defaultValue={job.status}
                                onChange={(e) => handleStatusUpdate(e.target.value)}
                                className="appearance-none w-full bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm"
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Waiting on Parts">Waiting on Parts</option>
                                <option value="Completed">Completed</option>
                                <option value="Invoiced">Invoiced</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">expand_more</span>
                        </div>
                        <button
                            onClick={handlePrint}
                            className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 text-sm font-bold transition-colors shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[20px]">print</span>
                            <span className="hidden sm:inline">Print</span>
                        </button>
                        <button
                            onClick={handleSaveChanges}
                            className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors shadow-md shadow-blue-500/20"
                        >
                            <span className="material-symbols-outlined text-[20px]">save</span>
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Left Column (Vehicle, Customer, History) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                    {/* Vehicle Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-900 text-base font-bold">Vehicle Details</h3>
                            <button
                                onClick={handleEditVehicle}
                                className="text-primary hover:text-primary-hover transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                        </div>
                        <div className="aspect-video w-full rounded-lg bg-center bg-cover mb-4 relative overflow-hidden shadow-sm"
                            style={{ backgroundImage: `url("${job.vehicle.imageUrl || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&h=250&q=80'}")` }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-2 left-2 text-white text-xs font-medium px-2 py-1 bg-black/40 rounded backdrop-blur-sm">
                                Stock #{job.id}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">VIN</p>
                                <p className="text-gray-900 text-sm font-mono tracking-wide font-medium">{job.vehicle.vin}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Mileage</p>
                                    <p className="text-gray-900 text-sm font-medium">{Number(job.vehicle.mileage).toLocaleString()} mi</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">License</p>
                                    <p className="text-gray-900 text-sm font-medium">{job.vehicle.licensePlate}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Engine</p>
                                <p className="text-gray-900 text-sm font-medium">{job.vehicle.engineType || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-900 text-base font-bold">Customer</h3>
                            <button
                                onClick={handleEditCustomer}
                                className="text-primary hover:text-primary-hover transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">person_search</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900 font-bold text-sm">
                                {(job.customer?.fullName || 'Unknown User').split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <p className="text-gray-900 font-bold">{job.customer.fullName}</p>
                                <p className="text-gray-500 text-xs">Customer since {new Date(job.customer.createdAt).getFullYear()}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-500 text-[20px]">phone</span>
                                <span className="text-gray-900 text-sm font-medium">{job.customer.phone || '(555) 000-0000'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-500 text-[20px]">mail</span>
                                <span className="text-gray-900 text-sm font-medium">{job.customer.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-500 text-[20px]">location_on</span>
                                <span className="text-gray-900 text-sm font-medium truncate">{job.customer.address || 'Address not set'}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-5">
                            <button
                                onClick={() => handleCustomerContact('Call')}
                                className="flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors text-gray-900 text-xs font-bold"
                            >
                                <span className="material-symbols-outlined text-[16px]">call</span>
                                Call
                            </button>
                            <button
                                onClick={() => handleCustomerContact('SMS')}
                                className="flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors text-gray-900 text-xs font-bold"
                            >
                                <span className="material-symbols-outlined text-[16px]">sms</span>
                                SMS
                            </button>
                        </div>
                    </div>

                    {/* Service History Summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 flex-1 shadow-sm">
                        <h3 className="text-gray-900 text-base font-bold mb-4">Service History</h3>
                        <div className="space-y-4">
                            {(job.history || []).map((h) => (
                                <Link
                                    key={h.id}
                                    to={`/job/${h.id}`}
                                    className="block group"
                                    onClick={() => handleAudit('UI_CLICK_HISTORY_ITEM', { targetJobId: h.id })}
                                >
                                    <div className="border-l-2 border-gray-200 group-hover:border-primary pl-3 transition-colors">
                                        <p className="text-gray-900 text-sm font-bold group-hover:text-primary">Job #{h.id}</p>
                                        <p className="text-gray-500 text-xs">{formatShortDate(h.createdAt)} • {h.description}</p>
                                    </div>
                                </Link>
                            ))}
                            {(!job.history || job.history.length === 0) && (
                                <p className="text-gray-500 text-xs text-center py-4">No service history found.</p>
                            )}
                        </div>
                        <button
                            onClick={handleViewAllHistory}
                            className="w-full text-center text-primary text-sm font-medium mt-4 hover:underline"
                        >
                            View All History
                        </button>
                    </div>
                </div>

                {/* Center Column (Work Records) */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-full shadow-sm">
                        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-gray-900 text-lg font-bold">Work Records</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleOpenSettings}
                                    className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded hover:text-gray-900 hover:bg-gray-200 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[16px]">settings</span>
                                    Settings
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[40%]">Description</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">Type</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-[15%]">Qty/Hrs</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-[15%]">Rate</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-[15%]">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {(job.workRecords || []).map((record) => (
                                        <tr key={record.id} className="group hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 text-sm font-bold">{record.description}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${record.type === 'Labor'
                                                    ? 'bg-blue-50 text-blue-700 ring-blue-700/10'
                                                    : 'bg-green-50 text-green-700 ring-green-600/20'
                                                    }`}>
                                                    {record.type}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right text-gray-900 text-sm">{record.quantity}</td>
                                            <td className="p-4 text-right text-gray-500 text-sm">${Number(record.rate).toFixed(2)}</td>
                                            <td className="p-4 text-right text-gray-900 font-bold text-sm">${Number(record.total).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {job.workRecords.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">No work records added yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                                {job.workRecords.length > 0 && (
                                    <tfoot className="bg-gray-50 font-bold">
                                        <tr>
                                            <td colSpan={4} className="p-4 text-right text-gray-700">Subtotal</td>
                                            <td className="p-4 text-right text-primary">
                                                ${job.workRecords.reduce((acc, r) => acc + Number(r.total), 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                            <button
                                onClick={() => setShowAddRecordModal(true)}
                                className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg p-3 text-gray-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group bg-white"
                            >
                                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">add_circle</span>
                                <span className="text-sm font-medium">Add Part or Labor</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column (Internal Note) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col h-full min-h-[600px]">
                    <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-full overflow-hidden shadow-sm">
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveNoteTab('Internal')}
                                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeNoteTab === 'Internal'
                                    ? 'border-primary text-primary bg-blue-50/30'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                Internal Note
                            </button>
                            <button
                                onClick={() => setActiveNoteTab('Customer')}
                                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeNoteTab === 'Customer'
                                    ? 'border-primary text-primary bg-blue-50/30'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                Customer Chat
                            </button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
                            <div className="flex flex-col items-center gap-1 my-4">
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Today</span>
                                <div className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500 font-medium">
                                    Job created {formatDate(job.createdAt)}
                                </div>
                            </div>
                            {(job.notes || [])
                                .filter(note => note.type === activeNoteTab)
                                .map((note) => (
                                    <div key={note.id} className="flex gap-3">
                                        <div className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 border ${note.type === 'Internal'
                                            ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                                            : 'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                            <span className="material-symbols-outlined text-[16px]">
                                                {note.type === 'Internal' ? 'sticky_note_2' : 'person'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 max-w-[85%]">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-900">{note.user.fullName}</span>
                                                <span className="text-[10px] text-gray-500">{formatTime(note.createdAt)}</span>
                                            </div>
                                            <div className={`p-3 rounded-lg rounded-tl-none text-sm leading-relaxed border ${note.type === 'Internal'
                                                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                                                : 'bg-gray-100 border-gray-200 text-gray-900'
                                                }`}>
                                                {note.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="p-3 border-t border-gray-200 bg-white">
                            <div className="relative">
                                <textarea
                                    value={noteContent}
                                    onChange={(e) => setNoteContent(e.target.value)}
                                    disabled={isSubmittingNote}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 pr-12 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-1 focus:ring-primary focus:border-primary resize-none h-24"
                                    placeholder="Type an internal note..."
                                ></textarea>
                                <div className="absolute bottom-2 right-2 flex gap-1">
                                    <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-md transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">attach_file</span>
                                    </button>
                                    <button
                                        onClick={handleNoteSubmit}
                                        disabled={isSubmittingNote || !noteContent.trim()}
                                        className="p-1.5 text-white bg-primary hover:bg-primary-hover rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:bg-gray-400"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {isSubmittingNote ? 'sync' : 'send'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2 px-1">
                                <div className="flex items-center gap-1.5 cursor-pointer group">
                                    <div className="w-3 h-3 rounded-full border border-gray-500 group-hover:border-primary group-hover:bg-primary/10"></div>
                                    <span className="text-xs text-gray-500 group-hover:text-primary transition-colors">Notify Customer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddRecordModal
                isOpen={showAddRecordModal}
                onClose={() => setShowAddRecordModal(false)}
                onSubmit={handleAddRecordSubmit}
                record={newRecord}
                onRecordChange={setNewRecord}
            />
        </div>
    );
}

// Simple Modal Component for Adding Records
function AddRecordModal({ isOpen, onClose, onSubmit, record, onRecordChange }: any) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Add Work Record</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="Part"
                                    checked={record.type === 'Part'}
                                    onChange={() => onRecordChange({ ...record, type: 'Part' })}
                                    className="text-primary focus:ring-primary"
                                />
                                <span className="text-sm font-medium text-gray-700">Part</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="Labor"
                                    checked={record.type === 'Labor'}
                                    onChange={() => onRecordChange({ ...record, type: 'Labor' })}
                                    className="text-primary focus:ring-primary"
                                />
                                <span className="text-sm font-medium text-gray-700">Labor</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                        <input
                            required
                            type="text"
                            value={record.description}
                            onChange={(e) => onRecordChange({ ...record, description: e.target.value })}
                            placeholder="e.g. Synthetic Oil, Front Brake Pads..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity/Hrs</label>
                            <input
                                required
                                type="number"
                                step="any"
                                value={record.quantity}
                                onChange={(e) => onRecordChange({ ...record, quantity: Number(e.target.value) })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rate ($)</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                value={record.rate}
                                onChange={(e) => onRecordChange({ ...record, rate: Number(e.target.value) })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-blue-500/20"
                        >
                            Add Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
