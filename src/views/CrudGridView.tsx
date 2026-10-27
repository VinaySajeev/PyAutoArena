import React, { useState, useMemo } from 'react';
import { Employee } from '../types';
import { INITIAL_EMPLOYEES } from '../data/dummyData';
import { Inspectable } from '../components/Inspectable';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  Download,
  RotateCcw,
  SlidersHorizontal,
  Check,
  X,
  AlertTriangle,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

interface CrudGridViewProps {
  onOpenCheatsheet: () => void;
}

export const CrudGridView: React.FC<CrudGridViewProps> = ({ onOpenCheatsheet }) => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof Employee>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Simulation loading state
  const [isLoadingRows, setIsLoadingRows] = useState(false);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);

  // Form state for Create / Edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'QA Automation' as Employee['department'],
    role: '',
    salary: 100000,
    status: 'Active' as Employee['status'],
    skills: 'Selenium, Playwright, Python',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filtering & Sorting
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        searchQuery === '' ||
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, searchQuery, departmentFilter, statusFilter]);

  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredEmployees, sortField, sortDirection]);

  // Paginated items
  const totalPages = Math.max(1, Math.ceil(sortedEmployees.length / pageSize));
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedEmployees.slice(start, start + pageSize);
  }, [sortedEmployees, currentPage, pageSize]);

  // Handlers for Sort
  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handlers for Selection
  const isAllSelected =
    paginatedEmployees.length > 0 && paginatedEmployees.every((emp) => selectedIds.has(emp.id));
  const isSomeSelected =
    paginatedEmployees.some((emp) => selectedIds.has(emp.id)) && !isAllSelected;

  const toggleSelectAll = () => {
    const next = new Set(selectedIds);
    if (isAllSelected) {
      paginatedEmployees.forEach((emp) => next.delete(emp.id));
    } else {
      paginatedEmployees.forEach((emp) => next.add(emp.id));
    }
    setSelectedIds(next);
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Bulk actions
  const handleBulkDelete = () => {
    setEmployees((prev) => prev.filter((emp) => !selectedIds.has(emp.id)));
    setSelectedIds(new Set());
  };

  const handleBulkActive = () => {
    setEmployees((prev) =>
      prev.map((emp) => (selectedIds.has(emp.id) ? { ...emp, status: 'Active' } : emp))
    );
    setSelectedIds(new Set());
  };

  // CSV Export for automation test validation
  const handleExportCSV = () => {
    const itemsToExport =
      selectedIds.size > 0
        ? employees.filter((emp) => selectedIds.has(emp.id))
        : sortedEmployees;

    const headers = ['ID', 'Name', 'Email', 'Department', 'Role', 'Salary', 'Status'];
    const rows = itemsToExport.map((e) => [
      e.id,
      `"${e.name}"`,
      e.email,
      e.department,
      `"${e.role}"`,
      e.salary,
      e.status,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employees_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulation slow load
  const triggerSimulatedReload = () => {
    setIsLoadingRows(true);
    setTimeout(() => {
      setIsLoadingRows(false);
    }, 1500);
  };

  // Reset data
  const handleResetData = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setSelectedIds(new Set());
    setSearchQuery('');
    setDepartmentFilter('All');
    setStatusFilter('All');
    setCurrentPage(1);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setFormData({
      name: '',
      email: '',
      department: 'QA Automation',
      role: '',
      salary: 105000,
      status: 'Active',
      skills: 'Selenium, Playwright, Python',
    });
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (emp: Employee) => {
    setActiveEmployee(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      role: emp.role,
      salary: emp.salary,
      status: emp.status,
      skills: emp.skills.join(', '),
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (emp: Employee) => {
    setActiveEmployee(emp);
    setIsDeleteModalOpen(true);
  };

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errors.email = 'Valid corporate email is required';
    }
    if (!formData.role.trim()) errors.role = 'Job role is required';
    if (formData.salary < 30000) errors.salary = 'Salary must be at least $30,000';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newEmp: Employee = {
      id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department,
      role: formData.role.trim(),
      salary: Number(formData.salary),
      status: formData.status,
      hireDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop',
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
    };

    setEmployees((prev) => [newEmp, ...prev]);
    setIsCreateModalOpen(false);
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEmployee || !validateForm()) return;

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === activeEmployee.id
          ? {
              ...emp,
              name: formData.name.trim(),
              email: formData.email.trim(),
              department: formData.department,
              role: formData.role.trim(),
              salary: Number(formData.salary),
              status: formData.status,
              skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
            }
          : emp
      )
    );
    setIsEditModalOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!activeEmployee) return;
    setEmployees((prev) => prev.filter((emp) => emp.id !== activeEmployee.id));
    selectedIds.delete(activeEmployee.id);
    setSelectedIds(new Set(selectedIds));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Interactive CRUD Data Grid
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Test locators for search inputs, select dropdowns, table rows, checkboxes, modal forms, and sorting headers.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={triggerSimulatedReload}
            data-testid="simulate-network-delay"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
            title="Simulate slow 1.5s network request to test explicit waits"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoadingRows ? 'animate-spin text-amber-400' : ''}`} />
            <span>Simulate Slow API</span>
          </button>

          <button
            onClick={handleResetData}
            data-testid="reset-grid-data"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
          >
            <span>Reset Data</span>
          </button>

          <Inspectable
            strategy={{
              elementLabel: 'Create Employee Button',
              id: 'btn-create-employee',
              testId: 'create-employee-btn',
              css: '#btn-create-employee',
              xpath: "//button[@id='btn-create-employee']",
              playwrightRole: { role: 'button', name: 'Add Employee' },
              playwrightRecommended: `page.get_by_role("button", name="Add Employee").click()`,
              seleniumRecommended: `driver.find_element(By.ID, "btn-create-employee").click()`,
              note: 'Opens modal dialog with form inputs for automated validation testing.'
            }}
          >
            <button
              onClick={openCreateModal}
              id="btn-create-employee"
              data-testid="create-employee-btn"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          </Inspectable>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="lg:col-span-5">
            <Inspectable
              strategy={{
                elementLabel: 'Employee Search Bar',
                id: 'employee-search',
                testId: 'search-input',
                css: '#employee-search',
                xpath: "//input[@id='employee-search']",
                playwrightRecommended: `page.get_by_placeholder("Search by name, role, email...").fill("Sarah")`,
                seleniumRecommended: `driver.find_element(By.ID, "employee-search").send_keys("Sarah")`,
                note: 'Typing immediately filters table rows in real-time.'
              }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="employee-search"
                  data-testid="search-input"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by name, role, email..."
                  className="w-full pl-9 pr-8 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    data-testid="clear-search-btn"
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </Inspectable>
          </div>

          {/* Department Filter Dropdown */}
          <div className="lg:col-span-4">
            <Inspectable
              strategy={{
                elementLabel: 'Department Filter Dropdown',
                id: 'department-filter',
                testId: 'dept-select',
                css: '#department-filter',
                xpath: "//select[@id='department-filter']",
                playwrightRecommended: `page.get_by_test_id("dept-select").select_option("QA Automation")`,
                seleniumRecommended: `Select(driver.find_element(By.ID, "department-filter")).select_by_visible_text("QA Automation")`,
                note: 'Standard HTML <select> element.'
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline">Dept:</span>
                <select
                  id="department-filter"
                  data-testid="dept-select"
                  value={departmentFilter}
                  onChange={(e) => {
                    setDepartmentFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="All">All Departments</option>
                  <option value="QA Automation">QA Automation</option>
                  <option value="Engineering">Engineering</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Product">Product</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </Inspectable>
          </div>

          {/* Status Filter Tabs */}
          <div className="lg:col-span-3 flex items-center justify-end gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {['All', 'Active', 'On Leave', 'Inactive'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                data-testid={`filter-status-${status.toLowerCase().replace(' ', '-')}`}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Action Bar (Visible when rows selected) */}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
            <span className="text-emerald-400 font-mono font-medium">
              {selectedIds.size} {selectedIds.size === 1 ? 'row' : 'rows'} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkActive}
                data-testid="bulk-active-btn"
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded border border-slate-700 transition-colors"
              >
                Mark as Active
              </button>
              <button
                onClick={handleExportCSV}
                data-testid="bulk-export-btn"
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded border border-slate-700 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handleBulkDelete}
                data-testid="bulk-delete-btn"
                className="flex items-center gap-1 px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded border border-rose-500/40 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="employee-table">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-xs font-semibold text-slate-400">
                {/* Checkbox column */}
                <th className="py-3 px-4 w-10">
                  <Inspectable
                    strategy={{
                      elementLabel: 'Select All Checkbox',
                      id: 'select-all-checkbox',
                      testId: 'select-all-checkbox',
                      css: '#select-all-checkbox',
                      xpath: "//input[@id='select-all-checkbox']",
                      playwrightRecommended: `page.get_by_test_id("select-all-checkbox").check()`,
                      seleniumRecommended: `driver.find_element(By.ID, "select-all-checkbox").click()`,
                      note: 'Checkboxes can be checked, unchecked, or in an indeterminate state.'
                    }}
                  >
                    <input
                      type="checkbox"
                      id="select-all-checkbox"
                      data-testid="select-all-checkbox"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isSomeSelected;
                      }}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                  </Inspectable>
                </th>

                {/* Name & Role (Sortable) */}
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort('name')}
                    data-sort="name"
                    className="flex items-center gap-1.5 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <span>Employee</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>

                {/* Department (Sortable) */}
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort('department')}
                    data-sort="department"
                    className="flex items-center gap-1.5 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <span>Department</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>

                {/* Role */}
                <th className="py-3 px-4">Role</th>

                {/* Salary (Sortable, Tabular Numerals) */}
                <th className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleSort('salary')}
                    data-sort="salary"
                    className="flex items-center justify-end gap-1.5 ml-auto hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <span>Salary</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>

                {/* Status */}
                <th className="py-3 px-4 text-center">Status</th>

                {/* Actions */}
                <th className="py-3 px-4 text-right w-24">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-xs">
              {isLoadingRows ? (
                // Skeleton loading state for practicing explicit wait automation
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-slate-900/50" data-testid="table-row-skeleton">
                    <td className="py-3 px-4"><div className="w-4 h-4 bg-slate-800 rounded" /></td>
                    <td className="py-3 px-4"><div className="w-32 h-4 bg-slate-800 rounded" /></td>
                    <td className="py-3 px-4"><div className="w-20 h-4 bg-slate-800 rounded" /></td>
                    <td className="py-3 px-4"><div className="w-28 h-4 bg-slate-800 rounded" /></td>
                    <td className="py-3 px-4 text-right"><div className="w-16 h-4 bg-slate-800 rounded ml-auto" /></td>
                    <td className="py-3 px-4 text-center"><div className="w-16 h-4 bg-slate-800 rounded mx-auto" /></td>
                    <td className="py-3 px-4 text-right"><div className="w-12 h-4 bg-slate-800 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="text-sm font-medium text-slate-400">No employees match criteria</p>
                      <p className="text-xs text-slate-500">Try adjusting your search query or department filter.</p>
                      <button
                        onClick={handleResetData}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => {
                  const isSelected = selectedIds.has(emp.id);
                  const isExpanded = expandedId === emp.id;

                  return (
                    <React.Fragment key={emp.id}>
                      <tr
                        data-testid={`emp-row-${emp.id}`}
                        id={`emp-row-${emp.id}`}
                        className={`transition-colors hover:bg-slate-800/40 ${
                          isSelected ? 'bg-emerald-500/5' : ''
                        }`}
                      >
                        {/* Select row checkbox */}
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            id={`select-row-${emp.id}`}
                            data-testid={`select-checkbox-${emp.id}`}
                            checked={isSelected}
                            onChange={() => toggleSelectRow(emp.id)}
                            className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                          />
                        </td>

                        {/* Employee Name + ID */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : emp.id)}
                              className="text-slate-500 hover:text-slate-300 p-0.5 rounded"
                              title="Toggle Details"
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                            <div>
                              <div className="font-semibold text-slate-200">{emp.name}</div>
                              <div className="text-[11px] font-mono text-slate-500">{emp.id} · {emp.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-3 px-4 text-slate-300">
                          <span className="font-medium">{emp.department}</span>
                        </td>

                        {/* Role */}
                        <td className="py-3 px-4 text-slate-300">{emp.role}</td>

                        {/* Salary (Tabular Numerals) */}
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                          ${emp.salary.toLocaleString()}
                        </td>

                        {/* Status (Unboxed text with accessible marker) */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block font-mono text-[11px] font-medium ${
                              emp.status === 'Active'
                                ? 'text-emerald-400'
                                : emp.status === 'On Leave'
                                ? 'text-amber-400'
                                : 'text-slate-500'
                            }`}
                          >
                            {emp.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Inspectable
                              strategy={{
                                elementLabel: `Edit Button for ${emp.name}`,
                                testId: `edit-emp-${emp.id}`,
                                css: `button[data-testid='edit-emp-${emp.id}']`,
                                xpath: `//button[@data-testid='edit-emp-${emp.id}']`,
                                playwrightRecommended: `page.get_by_test_id("edit-emp-${emp.id}").click()`,
                                seleniumRecommended: `driver.find_element(By.CSS_SELECTOR, "[data-testid='edit-emp-${emp.id}']").click()`,
                                note: 'Playwright locator chaining: page.locator("tr").filter(has_text="...").get_by_role("button", name="Edit")'
                              }}
                              inlineBadge={false}
                            >
                              <button
                                onClick={() => openEditModal(emp)}
                                data-testid={`edit-emp-${emp.id}`}
                                className="p-1 text-slate-400 hover:text-emerald-400 rounded transition-colors"
                                title="Edit employee"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </Inspectable>

                            <Inspectable
                              strategy={{
                                elementLabel: `Delete Button for ${emp.name}`,
                                testId: `delete-emp-${emp.id}`,
                                css: `button[data-testid='delete-emp-${emp.id}']`,
                                xpath: `//button[@data-testid='delete-emp-${emp.id}']`,
                                playwrightRecommended: `page.get_by_test_id("delete-emp-${emp.id}").click()`,
                                seleniumRecommended: `driver.find_element(By.CSS_SELECTOR, "[data-testid='delete-emp-${emp.id}']").click()`,
                                note: 'Triggers confirmation modal before deleting.'
                              }}
                              inlineBadge={false}
                            >
                              <button
                                onClick={() => openDeleteModal(emp)}
                                data-testid={`delete-emp-${emp.id}`}
                                className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
                                title="Delete employee"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </Inspectable>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable nested details for locator traversal tests */}
                      {isExpanded && (
                        <tr className="bg-slate-950/60" data-testid={`expanded-row-${emp.id}`}>
                          <td colSpan={7} className="py-3 px-6 text-xs text-slate-400 border-t border-slate-800/40">
                            <div className="flex flex-wrap items-center gap-6">
                              <div>
                                <span className="text-slate-500 block text-[11px]">Hire Date:</span>
                                <span className="font-mono text-slate-300">{emp.hireDate}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[11px]">Primary Skills:</span>
                                <div className="flex gap-1.5 mt-0.5">
                                  {emp.skills.map((skill) => (
                                    <span key={skill} className="text-slate-300 font-mono text-[11px]">
                                      {skill} ·
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Row Count Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="font-mono text-slate-200">{paginatedEmployees.length}</strong> of{' '}
              <strong className="font-mono text-slate-200">{filteredEmployees.length}</strong> employees
            </span>

            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-800">
              <span>Rows per page:</span>
              <select
                id="page-size-select"
                data-testid="page-size-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-1.5 py-0.5 font-mono"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {/* Page Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              id="btn-prev-page"
              data-testid="btn-prev-page"
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
            >
              Previous
            </button>
            <span className="px-2 font-mono text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              id="btn-next-page"
              data-testid="btn-next-page"
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CREATE EMPLOYEE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-800 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-slate-100">Add New Employee Record</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  id="create-name"
                  data-testid="create-name-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Maya Lin"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                {formErrors.name && <p className="text-[11px] text-rose-400 mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
                <input
                  type="email"
                  id="create-email"
                  data-testid="create-email-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="maya.lin@cyberqa.io"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                {formErrors.email && <p className="text-[11px] text-rose-400 mt-1">{formErrors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <select
                    id="create-department"
                    data-testid="create-department-select"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value as Employee['department'] })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="QA Automation">QA Automation</option>
                    <option value="Engineering">Engineering</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Product">Product</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Job Role</label>
                  <input
                    type="text"
                    id="create-role"
                    data-testid="create-role-input"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Senior SDET"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                  {formErrors.role && <p className="text-[11px] text-rose-400 mt-1">{formErrors.role}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Base Salary (USD)</label>
                  <input
                    type="number"
                    id="create-salary"
                    data-testid="create-salary-input"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <div className="flex gap-2 pt-1">
                    {(['Active', 'On Leave', 'Inactive'] as const).map((st) => (
                      <label key={st} className="flex items-center gap-1 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="create-status"
                          value={st}
                          checked={formData.status === st}
                          onChange={() => setFormData({ ...formData, status: st })}
                          className="text-emerald-500 bg-slate-950 border-slate-700 focus:ring-emerald-500"
                        />
                        <span>{st}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  id="create-skills"
                  data-testid="create-skills-input"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="Python, Playwright, Selenium, Pytest"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-create-employee"
                  data-testid="submit-create-btn"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EMPLOYEE MODAL */}
      {isEditModalOpen && activeEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-800 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-slate-100">
                Edit Employee: {activeEmployee.name} ({activeEmployee.id})
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  id="edit-name"
                  data-testid="edit-name-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                {formErrors.name && <p className="text-[11px] text-rose-400 mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
                <input
                  type="email"
                  id="edit-email"
                  data-testid="edit-email-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <select
                    id="edit-department"
                    data-testid="edit-department-select"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value as Employee['department'] })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100"
                  >
                    <option value="QA Automation">QA Automation</option>
                    <option value="Engineering">Engineering</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Product">Product</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Job Role</label>
                  <input
                    type="text"
                    id="edit-role"
                    data-testid="edit-role-input"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Base Salary</label>
                  <input
                    type="number"
                    id="edit-salary"
                    data-testid="edit-salary-input"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <div className="flex gap-2 pt-1">
                    {(['Active', 'On Leave', 'Inactive'] as const).map((st) => (
                      <label key={st} className="flex items-center gap-1 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="edit-status"
                          value={st}
                          checked={formData.status === st}
                          onChange={() => setFormData({ ...formData, status: st })}
                          className="text-emerald-500 bg-slate-950 border-slate-700"
                        />
                        <span>{st}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-edit-employee"
                  data-testid="submit-edit-btn"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && activeEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-bold text-slate-100">Confirm Record Deletion</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-white">{activeEmployee.name}</strong> ({activeEmployee.id}) from the database? This action simulates an unrecoverable database delete.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                data-testid="cancel-delete-btn"
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                id="confirm-delete-button"
                data-testid="confirm-delete-btn"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-sm"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
