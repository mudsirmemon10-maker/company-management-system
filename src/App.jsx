import { useMemo, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, BriefcaseBusiness, CalendarCheck,
  Check, ChevronDown, CircleHelp, ClipboardList, Clock3, LayoutDashboard, LogOut,
  Menu, Plus, Search, Settings, Users, X, Building2, MoreHorizontal,
} from 'lucide-react';

const seedEmployees = [
  { id: 1, name: 'Aisha Khan', role: 'People Operations Lead', department: 'People', email: 'aisha@companyflow.io', status: 'Active', initials: 'AK', color: 'lavender' },
  { id: 2, name: 'Hamza Ali', role: 'Product Designer', department: 'Design', email: 'hamza@companyflow.io', status: 'Active', initials: 'HA', color: 'peach' },
  { id: 3, name: 'Sara Ahmed', role: 'Software Engineer', department: 'Engineering', email: 'sara@companyflow.io', status: 'On leave', initials: 'SA', color: 'mint' },
  { id: 4, name: 'Usman Malik', role: 'Growth Manager', department: 'Marketing', email: 'usman@companyflow.io', status: 'Active', initials: 'UM', color: 'blue' },
  { id: 5, name: 'Muneeb Tariq', role: 'Frontend Developer', department: 'Engineering', email: 'muneeb@companyflow.io', status: 'Active', initials: 'MT', color: 'rose' },
  { id: 6, name: 'Zara Noor', role: 'Finance Analyst', department: 'Finance', email: 'zara@companyflow.io', status: 'Active', initials: 'ZN', color: 'gold' },
];
const seedLeaves = [
  { id: 1, name: 'Sara Ahmed', initials: 'SA', color: 'mint', kind: 'Annual leave', dates: 'Nov 12 – Nov 15', days: 4, status: 'Pending' },
  { id: 2, name: 'Muneeb Tariq', initials: 'MT', color: 'rose', kind: 'Personal leave', dates: 'Nov 18', days: 1, status: 'Pending' },
  { id: 3, name: 'Aisha Khan', initials: 'AK', color: 'lavender', kind: 'Medical leave', dates: 'Nov 04 – Nov 05', days: 2, status: 'Approved' },
];
const seedTasks = [
  { id: 1, title: 'Finalize Q4 hiring plan', project: 'People operations', assignee: 'Aisha Khan', initials: 'AK', color: 'lavender', due: 'Today', priority: 'High', status: 'In progress' },
  { id: 2, title: 'Review onboarding journey', project: 'Product', assignee: 'Hamza Ali', initials: 'HA', color: 'peach', due: 'Tomorrow', priority: 'Medium', status: 'In progress' },
  { id: 3, title: 'Prepare monthly report', project: 'Finance', assignee: 'Zara Noor', initials: 'ZN', color: 'gold', due: 'Nov 14', priority: 'Low', status: 'To do' },
  { id: 4, title: 'Ship customer feedback page', project: 'Engineering', assignee: 'Muneeb Tariq', initials: 'MT', color: 'rose', due: 'Nov 15', priority: 'High', status: 'Done' },
];
const seedAttendance = [
  { id: 1, employeeId: 1, clockIn: '09:02 AM', status: 'Present' },
  { id: 2, employeeId: 2, clockIn: '09:14 AM', status: 'Present' },
  { id: 3, employeeId: 3, clockIn: '—', status: 'On leave' },
  { id: 4, employeeId: 4, clockIn: '09:27 AM', status: 'Late' },
  { id: 5, employeeId: 5, clockIn: '08:56 AM', status: 'Present' },
  { id: 6, employeeId: 6, clockIn: '—', status: 'Not checked in' },
];
const departments = [
  { name: 'Engineering', label: 'Build and maintain our products', color: 'blue', icon: '⌘' },
  { name: 'Design', label: 'Create thoughtful experiences', color: 'peach', icon: '✳' },
  { name: 'People', label: 'Support our people and culture', color: 'lavender', icon: '♡' },
  { name: 'Marketing', label: 'Tell our story and grow', color: 'mint', icon: '↗' },
  { name: 'Finance', label: 'Keep our business healthy', color: 'gold', icon: '$' },
];
const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Employees', icon: Users },
  { label: 'Departments', icon: Building2 },
  { label: 'Attendance', icon: CalendarCheck },
  { label: 'Leave requests', icon: Clock3, count: 2 },
  { label: 'Tasks', icon: ClipboardList },
];

function load(key, fallback) {
  try { const saved = localStorage.getItem(`companyflow-${key}`); return saved ? JSON.parse(saved) : fallback; }
  catch { return fallback; }
}
function save(key, value) { try { localStorage.setItem(`companyflow-${key}`, JSON.stringify(value)); } catch { /* storage may be disabled */ } }
function Avatar({ initials, color = 'blue', small = false }) { return <span className={`avatar ${color} ${small ? 'avatar-small' : ''}`}>{initials}</span>; }
function Badge({ children, tone }) { return <span className={`badge ${tone || String(children).toLowerCase().replaceAll(' ', '-')}`}>{children}</span>; }
function PageTitle({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}
function SearchBox({ value, onChange, placeholder = 'Search...' }) {
  return <label className="search-box"><Search size={16} /><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} /></label>;
}

export default function App() {
  const [employees, setEmployees] = useState(() => load('employees', seedEmployees));
  const [leaves, setLeaves] = useState(() => load('leaves', seedLeaves));
  const [tasks, setTasks] = useState(() => load('tasks', seedTasks));
  const [attendance, setAttendance] = useState(() => load('attendance', seedAttendance));
  const [page, setPage] = useState('Overview');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState('');
  const notify = message => { setToast(message); window.setTimeout(() => setToast(''), 2600); };
  const update = (setter, key, value) => { setter(value); save(key, value); };
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const pendingCount = leaves.filter(l => l.status === 'Pending').length;
  const filteredEmployees = useMemo(() => employees.filter(e => `${e.name} ${e.role} ${e.department} ${e.email}`.toLowerCase().includes(search.toLowerCase())), [employees, search]);

  function addEmployee(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const colors = ['lavender', 'peach', 'mint', 'blue', 'rose', 'gold'];
    const person = { ...data, id: Date.now(), initials: data.name.trim().split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase(), color: colors[employees.length % colors.length] };
    update(setEmployees, 'employees', [person, ...employees]);
    event.currentTarget.reset(); setShowForm(false); notify('Employee added successfully');
  }
  function updateLeave(id, status) {
    update(setLeaves, 'leaves', leaves.map(item => item.id === id ? { ...item, status } : item));
    notify(`Request ${status.toLowerCase()}`);
  }
  function cycleTask(id) {
    const order = ['To do', 'In progress', 'Done'];
    update(setTasks, 'tasks', tasks.map(task => task.id === id ? { ...task, status: order[(order.indexOf(task.status) + 1) % order.length] } : task));
  }
  function markAttendance(id) {
    update(setAttendance, 'attendance', attendance.map(item => item.id === id ? { ...item, status: 'Present', clockIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : item));
    notify('Attendance updated');
  }

  const addButton = <button className="button button-primary" onClick={() => setShowForm(true)}><Plus size={17} /> Add employee</button>;
  const employeeTable = (compact = false) => <div className="table-scroll"><table><thead><tr><th>Employee</th><th>Department</th><th>Status</th>{!compact && <th>Email</th>}<th></th></tr></thead><tbody>
    {(compact ? employees.slice(0, 5) : filteredEmployees).map(person => <tr key={person.id}><td><div className="person-cell"><Avatar initials={person.initials} color={person.color} /><div><strong>{person.name}</strong><small>{person.role}</small></div></div></td><td>{person.department}</td><td><Badge>{person.status}</Badge></td>{!compact && <td className="muted-cell">{person.email}</td>}<td><button className="icon-button" aria-label={`More options for ${person.name}`}><MoreHorizontal size={18} /></button></td></tr>)}
    {(!compact && filteredEmployees.length === 0) && <tr><td colSpan="5" className="empty-cell">No employees match your search.</td></tr>}
  </tbody></table></div>;

  function renderPage() {
    if (page === 'Employees') return <><PageTitle eyebrow="Your people" title="Employees" description="Manage your team and employee information." action={addButton} /><section className="panel"><div className="panel-toolbar"><div><h2>All employees <span className="count-pill">{employees.length}</span></h2><p>A directory of everyone in your company.</p></div><SearchBox value={search} onChange={setSearch} placeholder="Search people..." /></div>{employeeTable()}</section></>;
    if (page === 'Departments') return <><PageTitle eyebrow="Company structure" title="Departments" description="See how your teams are organized." /><div className="department-grid">{departments.map((dept, i) => { const count = employees.filter(e => e.department === dept.name).length; return <article className="department-card" key={dept.name}><div className={`department-icon ${dept.color}`}>{dept.icon}</div><button className="icon-button more" aria-label="Department options"><MoreHorizontal size={18} /></button><h2>{dept.name}</h2><p>{dept.label}</p><div className="department-footer"><div className="avatar-stack">{employees.filter(e => e.department === dept.name).slice(0, 4).map(e => <Avatar key={e.id} initials={e.initials} color={e.color} small />)}</div><span>{count} {count === 1 ? 'member' : 'members'}</span></div></article>; })}</div></>;
    if (page === 'Attendance') return <><PageTitle eyebrow="Daily operations" title="Attendance" description="Today's team attendance and check-in status." action={<button className="button button-secondary" onClick={() => notify('Attendance is up to date')}><Activity size={16} /> Today, Nov 09</button>} /><div className="metric-row"><div className="metric-card"><span>Present</span><strong>{attendance.filter(a => a.status === 'Present').length}</strong><small className="positive"><ArrowUpRight size={14} /> Team checked in</small></div><div className="metric-card"><span>Late</span><strong>{attendance.filter(a => a.status === 'Late').length}</strong><small className="neutral">Within today's schedule</small></div><div className="metric-card"><span>On leave</span><strong>{attendance.filter(a => a.status === 'On leave').length}</strong><small className="neutral">Approved leave</small></div></div><section className="panel"><div className="panel-toolbar"><div><h2>Daily attendance</h2><p>Team check-ins for today.</p></div><SearchBox value={search} onChange={setSearch} placeholder="Search people..." /></div><div className="table-scroll"><table><thead><tr><th>Employee</th><th>Check-in</th><th>Status</th><th>Action</th></tr></thead><tbody>{attendance.filter(a => employees.find(e => e.id === a.employeeId)?.name.toLowerCase().includes(search.toLowerCase())).map(item => { const person = employees.find(e => e.id === item.employeeId); if (!person) return null; return <tr key={item.id}><td><div className="person-cell"><Avatar initials={person.initials} color={person.color} /><div><strong>{person.name}</strong><small>{person.department}</small></div></div></td><td>{item.clockIn}</td><td><Badge>{item.status}</Badge></td><td>{item.status === 'Not checked in' ? <button className="text-button" onClick={() => markAttendance(item.id)}>Mark present</button> : <span className="muted-cell">—</span>}</td></tr>; })}</tbody></table></div></section></>;
    if (page === 'Leave requests') return <><PageTitle eyebrow="Time off" title="Leave requests" description="Review and manage time-off requests from your team." /><div className="leave-summary"><div><span className="summary-icon lavender"><Clock3 size={18} /></span><span><strong>{pendingCount} requests need review</strong><small>Keep your team in the loop.</small></span></div><Badge tone="pending">{pendingCount} pending</Badge></div><section className="panel"><div className="panel-toolbar"><div><h2>All requests</h2><p>Recent leave requests from your employees.</p></div></div><div className="table-scroll"><table><thead><tr><th>Employee</th><th>Leave type</th><th>Dates</th><th>Days</th><th>Status</th><th>Actions</th></tr></thead><tbody>{leaves.map(leave => <tr key={leave.id}><td><div className="person-cell"><Avatar initials={leave.initials} color={leave.color} /><strong>{leave.name}</strong></div></td><td>{leave.kind}</td><td>{leave.dates}</td><td>{leave.days} {leave.days === 1 ? 'day' : 'days'}</td><td><Badge>{leave.status}</Badge></td><td>{leave.status === 'Pending' ? <div className="row-actions"><button className="approve-button" onClick={() => updateLeave(leave.id, 'Approved')} aria-label="Approve request"><Check size={16} /></button><button className="decline-button" onClick={() => updateLeave(leave.id, 'Declined')} aria-label="Decline request"><X size={16} /></button></div> : <span className="muted-cell">Reviewed</span>}</td></tr>)}</tbody></table></div></section></>;
    if (page === 'Tasks') return <><PageTitle eyebrow="Work in progress" title="Tasks" description="Keep projects moving and see what the team is working on." action={<button className="button button-primary" onClick={() => notify('Task creation is coming soon')}><Plus size={17} /> New task</button>} /><div className="task-summary"><span>{tasks.filter(t => t.status !== 'Done').length} open tasks</span><span className="summary-dot" /> <span>{tasks.filter(t => t.status === 'Done').length} completed</span></div><section className="panel task-panel">{tasks.map(task => <article className="task-row" key={task.id}><button className={`task-check ${task.status === 'Done' ? 'checked' : ''}`} onClick={() => cycleTask(task.id)} aria-label="Cycle task status">{task.status === 'Done' && <Check size={14} />}</button><div className="task-info"><strong className={task.status === 'Done' ? 'task-done' : ''}>{task.title}</strong><small>{task.project} <span>·</span> Due {task.due}</small></div><Badge tone={`priority-${task.priority.toLowerCase()}`}>{task.priority}</Badge><div className="task-assignee"><Avatar initials={task.initials} color={task.color} small /><span>{task.assignee}</span></div><button className="task-status" onClick={() => cycleTask(task.id)}>{task.status}<ChevronDown size={14} /></button></article>)}</section><p className="hint"><CircleHelp size={15} /> Tip: click the status or circle to move a task to its next stage.</p></>;

    return <><PageTitle eyebrow="Monday, November 9, 2026" title="Good morning, Muneeb 👋" description="Here's what's happening with your team today." action={<button className="button button-secondary" onClick={() => notify('You’re all caught up!')}><Bell size={16} /> Notifications <span className="notification-dot" /></button>} />
      <section className="stat-grid"><article className="stat-card"><div className="stat-top"><span>Total employees</span><span className="stat-icon blue"><Users size={18} /></span></div><div className="stat-number">{employees.length}<span className="stat-change"><ArrowUpRight size={14} /> 12%</span></div><small>vs. last month</small><div className="sparkline spark-blue"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></article><article className="stat-card"><div className="stat-top"><span>Departments</span><span className="stat-icon peach"><Building2 size={18} /></span></div><div className="stat-number">{departments.length}<span className="stat-change"><ArrowUpRight size={14} /> 1</span></div><small>new this quarter</small><div className="sparkline spark-peach"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></article><article className="stat-card"><div className="stat-top"><span>Present today</span><span className="stat-icon mint"><CalendarCheck size={18} /></span></div><div className="stat-number">{attendance.filter(a => a.status === 'Present').length}<span className="stat-change">/{employees.length}</span></div><small>{Math.round((attendance.filter(a => a.status === 'Present').length / Math.max(employees.length, 1)) * 100)}% attendance rate</small><div className="sparkline spark-mint"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></article><article className="stat-card"><div className="stat-top"><span>Open tasks</span><span className="stat-icon lavender"><ClipboardList size={18} /></span></div><div className="stat-number">{tasks.filter(t => t.status !== 'Done').length}<span className="stat-change"><ArrowDownRight size={14} /> 3</span></div><small>2 completed this week</small><div className="sparkline spark-purple"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></article></section>
      <section className="overview-grid"><div className="panel"><div className="panel-toolbar"><div><h2>Team members</h2><p>Your people, all in one place.</p></div><button className="link-button" onClick={() => { setPage('Employees'); setSearch(''); }}>View all <ArrowUpRight size={15} /></button></div>{employeeTable(true)}</div><div className="panel leave-panel"><div className="panel-toolbar"><div><h2>Leave requests</h2><p>Requests that need your attention.</p></div><button className="icon-button" onClick={() => setPage('Leave requests')} aria-label="View leave requests"><MoreHorizontal size={19} /></button></div>{leaves.filter(l => l.status === 'Pending').slice(0, 3).map(leave => <div className="leave-item" key={leave.id}><Avatar initials={leave.initials} color={leave.color} /><div className="leave-person"><strong>{leave.name}</strong><small>{leave.kind} · {leave.days} {leave.days === 1 ? 'day' : 'days'}</small><small>{leave.dates}</small></div><button className="approve-button" onClick={() => updateLeave(leave.id, 'Approved')} aria-label="Approve leave"><Check size={16} /></button></div>)}{pendingCount === 0 && <p className="empty-cell">You're all caught up. No pending requests.</p>}<button className="view-requests" onClick={() => setPage('Leave requests')}>View all requests <ArrowUpRight size={15} /></button></div></section>
      <section className="panel tasks-overview"><div className="panel-toolbar"><div><h2>Tasks</h2><p>A quick look at the team's priorities.</p></div><button className="link-button" onClick={() => setPage('Tasks')}>View all <ArrowUpRight size={15} /></button></div><div className="mini-task-list">{tasks.slice(0, 3).map(task => <div className="mini-task" key={task.id}><span className={`task-dot ${task.status === 'Done' ? 'dot-done' : ''}`} /><div><strong>{task.title}</strong><small>{task.project}</small></div><Avatar initials={task.initials} color={task.color} small /><Badge tone={`priority-${task.priority.toLowerCase()}`}>{task.priority}</Badge></div>)}</div></section>
    </>;
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}><div className="brand"><div className="brand-mark"><BriefcaseBusiness size={19} /></div><span>company<span className="brand-light">flow</span></span><button className="close-nav" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={19} /></button></div><div className="workspace-switch"><div className="workspace-avatar">N</div><div><strong>Northstar Studio</strong><small>Free workspace</small></div><ChevronDown size={15} /></div><div className="nav-caption">WORKSPACE</div><nav>{navItems.map(({ label, icon: Icon, count }) => <button key={label} className={`nav-link ${page === label ? 'selected' : ''}`} onClick={() => { setPage(label); setSearch(''); setMobileNav(false); }}><Icon size={18} /><span>{label}</span>{count && pendingCount > 0 ? <span className="nav-count">{pendingCount}</span> : null}</button>)}</nav><div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={17} /></div><strong>Need a hand?</strong><p>Visit our help center to get started.</p><button onClick={() => notify('Help center coming soon')}>Get help <ArrowUpRight size={14} /></button></div><button className="nav-link"><Settings size={18} /><span>Settings</span></button><div className="profile"><Avatar initials="MM" color="blue" /><div><strong>Muneeb Memon</strong><small>Admin</small></div><button className="icon-button" aria-label="Account menu"><MoreHorizontal size={18} /></button></div></div></aside>
    {mobileNav && <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Close menu" />}
    <main className="main-content"><div className="mobile-topbar"><button className="icon-button" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={21} /></button><div className="mobile-brand">company<span>flow</span></div><Avatar initials="MM" color="blue" small /></div><div className="content-wrap">{renderPage()}<footer>© 2026 CompanyFlow <span>·</span> Made for better workdays</footer></div></main>
    {showForm && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowForm(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><div className="eyebrow">GROW YOUR TEAM</div><h2 id="modal-title">Add an employee</h2></div><button className="icon-button" onClick={() => setShowForm(false)} aria-label="Close dialog"><X size={19} /></button></div><form onSubmit={addEmployee}><label>Full name<input name="name" placeholder="e.g. Alex Morgan" required /></label><label>Job title<input name="role" placeholder="e.g. Product Designer" required /></label><label>Department<select name="department" required defaultValue=""><option value="" disabled>Select department</option>{departments.map(d => <option key={d.name}>{d.name}</option>)}</select></label><label>Email address<input name="email" type="email" placeholder="alex@company.com" required /></label><label>Status<select name="status" defaultValue="Active"><option>Active</option><option>On leave</option><option>Inactive</option></select></label><div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="button button-primary"><Plus size={16} /> Add employee</button></div></form></section></div>}
    {toast && <div className="toast"><span><Check size={15} /></span>{toast}</div>}
  </div>;
}
