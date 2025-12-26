
export function CustomerPortalPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight mb-2 text-gray-900">Welcome back, Alex</h1>
                <p className="text-gray-600 text-base font-normal">You have 1 vehicle currently in service.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 flex flex-col gap-8">
                    {/* Active Repair Section */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                            <span className="material-symbols-outlined text-primary">timelapse</span>
                            Active Repair
                        </h2>
                        <div className="bg-white rounded-xl border border-primary/20 shadow-lg shadow-primary/5 overflow-hidden">
                            <div className="bg-primary/5 px-6 py-3 border-b border-primary/10 flex justify-between items-center flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary text-white">
                                    <span className="material-symbols-outlined text-[16px]">autorenew</span>
                                    In Progress
                                </span>
                                <span className="text-sm font-medium text-primary">Est. Completion: Tomorrow, 2:00 PM</span>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row gap-6 mb-8">
                                    <div className="w-full md:w-1/3 aspect-video md:aspect-auto bg-gray-100 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center text-gray-400">
                                        <span className="material-symbols-outlined text-5xl">directions_car</span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="mb-1 text-gray-500 text-sm uppercase tracking-wider font-semibold">Repair ID: #TR-8829</div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">2018 Ford F-150</h3>
                                        <p className="text-gray-600 mb-4">License Plate: 829-LKS</p>
                                        <div className="flex gap-3 mt-auto">
                                            <button className="flex-1 bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
                                                <span className="material-symbols-outlined text-[18px]">chat</span>
                                                Message Mechanic
                                            </button>
                                            <button className="flex-1 bg-white hover:bg-gray-50 text-gray-900 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-200 shadow-sm">
                                                View Quote
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase mb-1">Current Stage</p>
                                            <p className="text-gray-900 font-semibold flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">search_check</span>
                                                Engine Diagnostics
                                            </p>
                                        </div>
                                        <span className="text-xl font-bold text-primary">50%</span>
                                    </div>
                                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full relative" style={{ width: '50%' }}>
                                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                                        <span>Check-in</span>
                                        <span className="text-primary">Diagnostics</span>
                                        <span>Repair</span>
                                        <span>Quality Check</span>
                                        <span>Ready</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* My Garage Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                                <span className="material-symbols-outlined text-gray-500">garage_home</span>
                                My Garage
                            </h2>
                            <button className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Add Vehicle
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 items-center group cursor-pointer hover:border-primary/50 transition-all hover:shadow-md">
                                <div className="size-16 rounded-lg bg-gray-100 shrink-0 border border-gray-100 flex items-center justify-center text-gray-400">
                                    <span className="material-symbols-outlined">directions_car</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 truncate">2020 Honda Civic</h4>
                                    <p className="text-xs text-gray-500">License: 442-JXA</p>
                                    <div className="flex items-center gap-1 mt-1 text-emerald-600 text-xs font-medium">
                                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                        No Issues
                                    </div>
                                </div>
                                <button className="size-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-primary group-hover:text-white transition-colors border border-gray-200 group-hover:border-primary">
                                    <span className="material-symbols-outlined text-[20px]">calendar_add_on</span>
                                </button>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 items-center group cursor-pointer hover:border-primary/50 transition-all hover:shadow-md">
                                <div className="size-16 rounded-lg bg-gray-100 shrink-0 border border-gray-100 flex items-center justify-center text-gray-400">
                                    <span className="material-symbols-outlined">directions_car</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 truncate">2016 Toyota Camry</h4>
                                    <p className="text-xs text-gray-500">License: 991-PLM</p>
                                    <div className="flex items-center gap-1 mt-1 text-amber-600 text-xs font-medium">
                                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                                        Service Due
                                    </div>
                                </div>
                                <button className="size-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-primary group-hover:text-white transition-colors border border-gray-200 group-hover:border-primary">
                                    <span className="material-symbols-outlined text-[20px]">calendar_add_on</span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Service History Sidebar */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
                        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                            <h2 className="text-lg font-bold text-gray-900">Service History</h2>
                            <a className="text-primary text-xs font-bold hover:underline" href="#">View All</a>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[600px] p-2">
                            <div className="group p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-semibold text-gray-500">Oct 12, 2023</span>
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Paid</span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-900 mb-1">Oil Change & Brake Pads</h4>
                                <p className="text-xs text-gray-500 mb-2">2018 Ford F-150</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">$420.50</span>
                                    <button className="text-primary text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-[16px]">download</span>
                                        Invoice
                                    </button>
                                </div>
                            </div>
                            <hr className="border-gray-100 mx-3 my-1" />
                            <div className="group p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-semibold text-gray-500">Jun 05, 2023</span>
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Paid</span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-900 mb-1">Annual Inspection</h4>
                                <p className="text-xs text-gray-500 mb-2">2020 Honda Civic</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">$85.00</span>
                                    <button className="text-primary text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-[16px]">download</span>
                                        Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50/50 rounded-b-xl">
                            <button className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 font-medium">
                                <span className="material-symbols-outlined text-[18px]">history</span>
                                View Full History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
