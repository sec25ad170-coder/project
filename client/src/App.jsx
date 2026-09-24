import { useState } from 'react'
import './App.css'

const COMPANIES = [
  ['TCS', 'Tata Consultancy Services', 'blue'],
  ['Infosys', 'Infosys Limited', 'orange'],
  ['Wipro', 'Wipro Technologies', 'violet'],
  ['Accenture', 'Accenture Solutions', 'black'],
  ['Cognizant', 'Cognizant Technology', 'cyan'],
  ['HCLTech', 'HCL Technologies', 'green'],
  ['Capgemini', 'Capgemini Engineering', 'red'],
  ['Deloitte', 'Deloitte Consulting', 'lime'],
]

const EMPTY_FORM = { name: '', rollNo: '', dob: '', bloodGroup: '', department: '', gender: '', phone: '', year: '', section: '', arrears: '' }

function loadRegistrations() {
  try { return JSON.parse(localStorage.getItem('campus-registrations')) || [] } catch { return [] }
}

function App() {
  const [view, setView] = useState('student')
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(EMPTY_FORM)
  const [selected, setSelected] = useState([])
  const [registrations, setRegistrations] = useState(loadRegistrations)
  const [notice, setNotice] = useState('')

  const updateField = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }))

  const continueToCompanies = (event) => {
    event.preventDefault()
    if (Number(form.arrears) !== 0) {
      setNotice('Students with arrears are not eligible for company preference selection.')
      return
    }
    setNotice('')
    setStep(2)
  }

  const toggleCompany = (name) => setSelected((current) => current.includes(name)
    ? current.filter((item) => item !== name)
    : current.length < 4 ? [...current, name] : current)

  const submitRegistration = (event) => {
    event.preventDefault()
    if (selected.length !== 4) return
    const registration = { id: crypto.randomUUID(), ...form, arrears: Number(form.arrears), companies: selected }
    const updated = [...registrations, registration]
    setRegistrations(updated)
    localStorage.setItem('campus-registrations', JSON.stringify(updated))
    setForm(EMPTY_FORM); setSelected([]); setStep(1)
    setNotice('Registration complete. Your company preferences have been saved.')
  }

  const newRegistration = () => { setForm(EMPTY_FORM); setSelected([]); setStep(1); setNotice(''); setView('student') }
  const eligibleCount = registrations.filter((item) => item.arrears === 0).length

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => setView('student')}><span className="brand-mark">CR</span><span><strong>CampusReady</strong><small>Placement cell</small></span></button>
      <nav className="nav-tabs" aria-label="Main navigation">
        <button className={view === 'student' ? 'nav-tab active' : 'nav-tab'} onClick={() => setView('student')}>Student registration</button>
        <button className={view === 'admin' ? 'nav-tab active' : 'nav-tab'} onClick={() => setView('admin')}>Admin view <span className="nav-count">{registrations.length}</span></button>
      </nav>
      <span className="status-pill"><i /> Registration open</span>
    </header>
    <main>
      {view === 'student' ? <section className="workspace">
        <div className="page-heading"><div><p className="eyebrow">2025 - 26 placement drive</p><h1>Student registration</h1><p className="subheading">Complete your profile to share your company preferences with the placement cell.</p></div><div className="stepper"><span className={step === 1 ? 'step current' : 'step done'}><b>{step > 1 ? '✓' : '01'}</b><small>Your details</small></span><span className="step-line" /><span className={step === 2 ? 'step current' : 'step'}><b>02</b><small>Company choice</small></span></div></div>
        {notice && <div className={notice.startsWith('Registration') ? 'notice success' : 'notice warning'} role="status">{notice}</div>}
        {step === 1 ? <form className="form-card" onSubmit={continueToCompanies}>
          <div className="card-heading"><div><h2>Personal &amp; academic details</h2><p>All fields are required to continue.</p></div><span className="required-note">* Required</span></div>
          <div className="form-grid">
            <label className="field wide"><span>Full name <em>*</em></span><input name="name" value={form.name} onChange={updateField} placeholder="e.g. Ananya Sharma" required /></label>
            <label className="field"><span>Roll number <em>*</em></span><input name="rollNo" value={form.rollNo} onChange={updateField} placeholder="e.g. 22CSE104" required /></label>
            <label className="field"><span>Date of birth <em>*</em></span><input type="date" name="dob" value={form.dob} onChange={updateField} required /></label>
            <label className="field"><span>Blood group <em>*</em></span><select name="bloodGroup" value={form.bloodGroup} onChange={updateField} required><option value="">Select blood group</option>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="field wide"><span>Department of engineering <em>*</em></span><select name="department" value={form.department} onChange={updateField} required><option value="">Select department</option>{['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Electrical & Electronics', 'Mechanical Engineering', 'Civil Engineering'].map((item) => <option key={item}>{item}</option>)}</select></label>
            <fieldset className="field radio-field"><legend>Gender <em>*</em></legend><div className="radio-options">{['Female', 'Male', 'Other'].map((item) => <label key={item}><input type="radio" name="gender" value={item} checked={form.gender === item} onChange={updateField} required /><span>{item}</span></label>)}</div></fieldset>
            <label className="field"><span>Phone number <em>*</em></span><input type="tel" name="phone" value={form.phone} onChange={updateField} placeholder="10-digit mobile number" pattern="[0-9]{10}" required /></label>
            <label className="field"><span>Year <em>*</em></span><select name="year" value={form.year} onChange={updateField} required><option value="">Select year</option>{['1st year', '2nd year', '3rd year', '4th year'].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="field"><span>Section <em>*</em></span><select name="section" value={form.section} onChange={updateField} required><option value="">Select section</option>{['A', 'B', 'C', 'D'].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="field"><span>No. of arrears <em>*</em></span><input type="number" name="arrears" value={form.arrears} onChange={updateField} placeholder="Enter 0 if none" min="0" required /><small className="field-help">Only students with 0 arrears can continue.</small></label>
          </div>
          <div className="form-footer"><span>Step 1 of 2</span><button className="primary-button" type="submit">Continue to company choice <b>→</b></button></div>
        </form> : <form className="form-card company-card" onSubmit={submitRegistration}>
          <div className="card-heading"><div><h2>Choose your companies</h2><p>Select exactly four companies in your preferred order.</p></div><strong className="selection-count">{selected.length}<span>/4 selected</span></strong></div>
          <div className="eligibility"><span className="check-icon">✓</span><div><strong>You are eligible for placement registration</strong><small>Zero arrears confirmed for {form.name} · {form.rollNo}</small></div></div>
          <div className="company-grid">{COMPANIES.map(([name, detail, tone], index) => { const isSelected = selected.includes(name); return <button type="button" className={isSelected ? 'company-option selected' : 'company-option'} key={name} onClick={() => toggleCompany(name)}><span className={`company-logo ${tone}`}>{name.slice(0, 1)}</span><span><strong>{name}</strong><small>{detail}</small></span><i>{isSelected ? selected.indexOf(name) + 1 : index + 1}</i></button> })}</div>
          <p className="order-note">Your selection order will be shared with the placement coordinators.</p><div className="form-footer"><button className="back-button" type="button" onClick={() => setStep(1)}>← Back to details</button><button className="primary-button" type="submit" disabled={selected.length !== 4}>Submit registration <b>✓</b></button></div>
        </form>}
      </section> : <section className="workspace admin-workspace">
        <div className="page-heading"><div><p className="eyebrow">Placement cell workspace</p><h1>Registration overview</h1><p className="subheading">Review student preferences, organized company-wise for easy coordination.</p></div><button className="primary-button compact" onClick={newRegistration}>+ New registration</button></div>
        <div className="stats-row"><div className="stat"><span>Total registrations</span><strong>{registrations.length}</strong></div><div className="stat"><span>Eligible students</span><strong>{eligibleCount}</strong></div><div className="stat"><span>Companies selected</span><strong>{registrations.reduce((total, item) => total + item.companies.length, 0)}</strong></div></div>
        <div className="admin-panel"><div className="panel-heading"><div><h2>Company-wise preferences</h2><p>Students are listed under every company they selected.</p></div><span className="live-dot">● Live data</span></div>{registrations.length === 0 ? <div className="empty-state"><span>✦</span><h3>No registrations yet</h3><p>Completed student registrations will appear here.</p></div> : <div className="company-list">{COMPANIES.map(([name, detail, tone]) => { const students = registrations.filter((item) => item.companies.includes(name)); return <div className="company-row" key={name}><div className={`company-logo ${tone}`}>{name.slice(0, 1)}</div><div className="company-name"><strong>{name}</strong><small>{detail}</small></div><div className="student-list">{students.length ? students.map((student) => <span className="student-chip" key={`${name}-${student.id}`}><b>{student.name.slice(0, 1)}</b>{student.name}<small>{student.rollNo}</small></span>) : <span className="muted">No preferences yet</span>}</div><strong className="student-total">{students.length}</strong></div> })}</div>}</div>
      </section>}
    </main>
    <footer><span>CampusReady <b>•</b> Placement cell</span><span>Secure student registration</span></footer>
  </div>
}

export default App
