/* ============================================================
   JobConnect - Full JavaScript Logic
   Backend Simulation using LocalStorage
   ============================================================ */

/* ==================== DEMO DATA ==================== */
const DEMO_JOBS = [
  { id: 1, title: "Software Developer", company: "TechNova", location: "Chennai", salary: "₹5–8 LPA", type: "Full Time", exp: "1-3 yrs", category: "Software Development", desc: "Build scalable web applications using modern frameworks.", skills: ["JavaScript", "React", "Node.js"], posted: "2 days ago" },
  { id: 2, title: "Frontend Developer", company: "InnovateTech", location: "Bangalore", salary: "₹6–10 LPA", type: "Full Time", exp: "2-4 yrs", category: "Web Development", desc: "Design and develop responsive user interfaces.", skills: ["HTML", "CSS", "React"], posted: "3 days ago" },
  { id: 3, title: "Java Developer", company: "CodeWorks", location: "Hyderabad", salary: "₹5–9 LPA", type: "Full Time", exp: "2-5 yrs", category: "Software Development", desc: "Develop enterprise backend services using Java & Spring.", skills: ["Java", "Spring", "SQL"], posted: "1 day ago" },
  { id: 4, title: "Data Analyst", company: "DataMinds", location: "Pune", salary: "₹4–7 LPA", type: "Full Time", exp: "0-2 yrs", category: "Data Science", desc: "Analyze data to drive business insights.", skills: ["SQL", "Python", "Excel"], posted: "5 days ago" },
  { id: 5, title: "UI/UX Designer", company: "PixelStudio", location: "Mumbai", salary: "₹5–9 LPA", type: "Full Time", exp: "1-3 yrs", category: "Design", desc: "Design delightful user experiences and interfaces.", skills: ["Figma", "Sketch", "UX"], posted: "4 days ago" },
  { id: 6, title: "Backend Developer", company: "CloudNine", location: "Remote", salary: "₹8–12 LPA", type: "Remote", exp: "3-5 yrs", category: "Cloud", desc: "Build APIs and microservices for cloud products.", skills: ["Node.js", "MongoDB", "AWS"], posted: "1 day ago" },
  { id: 7, title: "Web Developer Intern", company: "StartupHub", location: "Chennai", salary: "₹15k/month", type: "Internship", exp: "Fresher", category: "Web Development", desc: "Learn web development with real projects.", skills: ["HTML", "CSS", "JavaScript"], posted: "6 days ago" },
  { id: 8, title: "Full Stack Developer", company: "TechNova", location: "Bangalore", salary: "₹8–15 LPA", type: "Full Time", exp: "3-6 yrs", category: "Web Development", desc: "Work across frontend and backend stacks.", skills: ["React", "Node.js", "SQL"], posted: "2 days ago" },
  { id: 9, title: "DevOps Engineer", company: "CloudNine", location: "Remote", salary: "₹10–16 LPA", type: "Remote", exp: "4-7 yrs", category: "Cloud", desc: "Automate CI/CD pipelines and manage infra.", skills: ["Docker", "Kubernetes", "AWS"], posted: "3 days ago" },
  { id: 10, title: "Mobile App Developer", company: "AppVerse", location: "Hyderabad", salary: "₹6–11 LPA", type: "Full Time", exp: "2-4 yrs", category: "Software Development", desc: "Build cross-platform mobile apps.", skills: ["Flutter", "React Native"], posted: "4 days ago" },
  { id: 11, title: "Business Analyst", company: "DataMinds", location: "Pune", salary: "₹5–8 LPA", type: "Contract", exp: "2-4 yrs", category: "Data Science", desc: "Bridge business and technology teams.", skills: ["Analysis", "SQL", "Excel"], posted: "7 days ago" },
  { id: 12, title: "Graphic Designer", company: "PixelStudio", location: "Mumbai", salary: "₹3–6 LPA", type: "Part Time", exp: "1-2 yrs", category: "Design", desc: "Create visuals for branding and marketing.", skills: ["Photoshop", "Illustrator"], posted: "2 days ago" }
];

/* ==================== DATABASE HELPERS ==================== */
const DB = {
  get: (key, fallback = []) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch { return fallback; }
  },
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value))
};

/* ==================== SEED DEMO DATA ==================== */
function seedData() {
  if (!localStorage.getItem('jc_jobs')) DB.set('jc_jobs', DEMO_JOBS);
  if (!localStorage.getItem('jc_users')) {
    DB.set('jc_users', [
      { id: 'u1', name: 'Demo User', email: 'demo@job.com', pass: '1234', role: 'jobseeker' },
      { id: 'u2', name: 'Demo Recruiter', email: 'recruiter@job.com', pass: '1234', role: 'recruiter', company: 'TechNova' }
    ]);
  }
  if (!localStorage.getItem('jc_saved')) DB.set('jc_saved', []);
  if (!localStorage.getItem('jc_applied')) DB.set('jc_applied', []);
  if (!localStorage.getItem('jc_notifs')) DB.set('jc_notifs', [
    { id: 'n1', email: 'demo@job.com', msg: 'Welcome to JobConnect! Start applying for jobs.', read: false }
  ]);
}
seedData();

/* ==================== GLOBAL STATE ==================== */
let currentJobId = null;
let currentPage = 'home';

/* ==================== PAGE NAVIGATION ==================== */
function showPage(page) {
  currentPage = page;

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

  // Show requested page
  const target = document.getElementById('page-' + page);
  if (target) target.classList.remove('hidden');

  // Close mobile menu
  document.getElementById('mobileMenu').classList.remove('active');

  // Render page content
  if (page === 'home') renderFeatured();
  if (page === 'jobs') renderJobs();
  if (page === 'companies') renderCompanies();
  if (page === 'saved') renderSaved();
  if (page === 'notifications') renderNotifications();

  // Update navbar active state (optional)
  window.scrollTo(0, 0);
}

/* ==================== TOAST ==================== */
let toastTimer;
function toast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = isError ? '#dc2626' : '#1e293b';
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2500);
}

/* ==================== MODAL HELPERS ==================== */
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

/* Close modal on backdrop click */
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.add('hidden');
  }
});

/* ==================== MOBILE MENU ==================== */
function toggleMobile() {
  document.getElementById('mobileMenu').classList.toggle('active');
}

/* ==================== JOB CARD ==================== */
function jobCard(job) {
  const saved = DB.get('jc_saved').includes(job.id);
  return `
    <div class="job-card">
      <div class="job-header">
        <div class="flex gap-1">
          <div class="job-logo">${job.company[0]}</div>
          <div>
            <div class="job-title" onclick="openJob(${job.id})">${job.title}</div>
            <div class="job-company">${job.company} • ${job.location}</div>
          </div>
        </div>
        <button class="save-btn ${saved ? 'saved' : ''}" onclick="toggleSave(${job.id})">
          <i class="fa-${saved ? 'solid' : 'regular'} fa-bookmark"></i>
        </button>
      </div>

      <div class="job-tags">
        <span class="tag tag-blue">${job.type}</span>
        <span class="tag tag-green">${job.salary}</span>
        <span class="tag tag-purple">${job.exp}</span>
      </div>

      <p class="job-desc">${job.desc}</p>

      <div class="job-footer">
        <span>${job.posted}</span>
        <button class="link-btn" onclick="openJob(${job.id})">View Details →</button>
      </div>
    </div>
  `;
}

/* ==================== HOME - FEATURED JOBS ==================== */
function renderFeatured() {
  const jobs = DB.get('jc_jobs').slice(0, 6);
  const box = document.getElementById('featuredJobs');
  if (box) box.innerHTML = jobs.map(jobCard).join('');
}

function searchFromHome() {
  const q = document.getElementById('searchInput').value;
  const loc = document.getElementById('locationInput').value;

  showPage('jobs');

  document.getElementById('jobSearch').value = q;
  document.getElementById('filterLocation').value = loc;
  renderJobs();
}

function quickSearch(term) {
  showPage('jobs');
  document.getElementById('jobSearch').value = term;
  renderJobs();
}

/* ==================== FIND JOBS ==================== */
function renderJobs() {
  const q = (document.getElementById('jobSearch')?.value || '').toLowerCase();
  const type = document.getElementById('filterType')?.value || '';
  const loc = (document.getElementById('filterLocation')?.value || '').toLowerCase();
  const sort = document.getElementById('sortBy')?.value || '';

  let list = DB.get('jc_jobs').filter(j => {
    const matchQ = !q || j.title.toLowerCase().includes(q) ||
                   j.company.toLowerCase().includes(q) ||
                   j.skills.join(' ').toLowerCase().includes(q);
    const matchType = !type || j.type === type;
    const matchLoc = !loc || j.location.toLowerCase().includes(loc);
    return matchQ && matchType && matchLoc;
  });

  if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === 'company') list.sort((a, b) => a.company.localeCompare(b.company));

  const box = document.getElementById('jobList');
  if (!box) return;

  box.innerHTML = list.length
    ? `<div class="grid-2">${list.map(jobCard).join('')}</div>`
    : `<div class="empty">No jobs found. Try different filters.</div>`;
}

function clearFilters() {
  document.getElementById('jobSearch').value = '';
  document.getElementById('filterType').value = '';
  document.getElementById('filterLocation').value = '';
  document.getElementById('sortBy').value = '';
  renderJobs();
}

/* ==================== COMPANIES ==================== */
function renderCompanies() {
  const jobs = DB.get('jc_jobs');
  const companies = {};
  jobs.forEach(j => {
    if (!companies[j.company]) companies[j.company] = { name: j.company, count: 0, location: j.location };
    companies[j.company].count++;
  });

  const box = document.getElementById('companyList');
  if (!box) return;

  box.innerHTML = Object.values(companies).map(c => `
    <div class="job-card">
      <div class="flex gap-1 mb-2">
        <div class="job-logo">${c.name[0]}</div>
        <div>
          <div class="job-title">${c.name}</div>
          <div class="job-company">${c.location}</div>
        </div>
      </div>
      <div class="job-tags">
        <span class="tag tag-blue">${c.count} open jobs</span>
      </div>
      <button class="btn btn-outline btn-sm btn-full mt-1" onclick="filterByCompany('${c.name}')">
        View Jobs
      </button>
    </div>
  `).join('');
}

function filterByCompany(name) {
  showPage('jobs');
  document.getElementById('jobSearch').value = name;
  renderJobs();
}

/* ==================== SAVE JOBS ==================== */
function toggleSave(id) {
  let saved = DB.get('jc_saved');
  if (saved.includes(id)) {
    saved = saved.filter(x => x !== id);
    toast('Removed from saved');
  } else {
    saved.push(id);
    toast('Job saved successfully ✓');
  }
  DB.set('jc_saved', saved);

  // Re-render current view
  if (currentPage === 'home') renderFeatured();
  if (currentPage === 'jobs') renderJobs();
  if (currentPage === 'saved') renderSaved();
}

function renderSaved() {
  const saved = DB.get('jc_saved');
  const jobs = DB.get('jc_jobs').filter(j => saved.includes(j.id));
  const box = document.getElementById('savedList');
  if (!box) return;

  box.innerHTML = jobs.length
    ? `<div class="grid-2">${jobs.map(jobCard).join('')}</div>`
    : `<div class="empty">No saved jobs yet. <span class="link-btn" onclick="showPage('jobs')">Browse jobs →</span></div>`;
}

/* ==================== JOB DETAILS ==================== */
function openJob(id) {
  const job = DB.get('jc_jobs').find(j => j.id === id);
  if (!job) return;
  currentJobId = id;

  const saved = DB.get('jc_saved').includes(id);

  document.getElementById('jobDetailContent').innerHTML = `
    <div class="flex gap-2 mb-3">
      <div class="job-logo" style="width:60px; height:60px; font-size:26px;">${job.company[0]}</div>
      <div>
        <h2 style="font-size:22px; font-weight:700;">${job.title}</h2>
        <p style="color:#64748b; font-size:14px;">${job.company} • ${job.location}</p>
      </div>
    </div>

    <div class="job-tags mb-2">
      <span class="tag tag-blue">${job.type}</span>
      <span class="tag tag-green">${job.salary}</span>
      <span class="tag tag-purple">${job.exp}</span>
      <span class="tag tag-gray">${job.posted}</span>
    </div>

    <h3 style="font-size:16px; margin-top:16px; margin-bottom:6px;">Job Description</h3>
    <p style="color:#64748b; font-size:14px;">${job.desc}</p>

    <h3 style="font-size:16px; margin-top:16px; margin-bottom:6px;">Required Skills</h3>
    <div class="job-tags">
      ${job.skills.map(s => `<span class="tag tag-gray">${s}</span>`).join('')}
    </div>

    <div class="flex gap-1 mt-3">
      <button class="btn btn-primary" style="flex:1;" onclick="openApply()">Apply Now</button>
      <button class="btn btn-outline" onclick="toggleSave(${job.id}); openJob(${job.id});">
        <i class="fa-${saved ? 'solid' : 'regular'} fa-bookmark"></i> Save
      </button>
    </div>
  `;

  openModal('jobModal');
}

/* ==================== APPLY ==================== */
function openApply() {
  const user = DB.get('jc_user', null);
  if (!user) {
    toast('Please login first', true);
    openAuth();
    return;
  }

  // Check duplicate
  const applied = DB.get('jc_applied');
  const already = applied.some(a => a.jobId === currentJobId && a.email === user.email);
  if (already) {
    toast('You already applied for this job', true);
    return;
  }

  // Prefill
  document.getElementById('appName').value = user.name || '';
  document.getElementById('appEmail').value = user.email || '';
  document.getElementById('appPhone').value = user.phone || '';

  closeModal('jobModal');
  openModal('applyModal');
}

function submitApplication(e) {
  e.preventDefault();

  const user = DB.get('jc_user');
  const job = DB.get('jc_jobs').find(j => j.id === currentJobId);

  const app = {
    jobId: currentJobId,
    jobTitle: job.title,
    company: job.company,
    name: document.getElementById('appName').value,
    email: document.getElementById('appEmail').value,
    phone: document.getElementById('appPhone').value,
    resume: document.getElementById('appResume').value,
    portfolio: document.getElementById('appPortfolio').value,
    linkedin: document.getElementById('appLinkedin').value,
    cover: document.getElementById('appCover').value,
    date: new Date().toLocaleDateString('en-IN'),
    status: 'Applied'
  };

  const applied = DB.get('jc_applied');
  applied.push(app);
  DB.set('jc_applied', applied);

  // Add notification
  const notifs = DB.get('jc_notifs');
  notifs.push({
    id: 'n' + Date.now(),
    email: user.email,
    msg: `Application submitted for "${job.title}" at ${job.company}.`,
    read: false
  });
  DB.set('jc_notifs', notifs);

  e.target.reset();
  closeModal('applyModal');
  toast('Application submitted successfully! ✓');
}

/* ==================== AUTH ==================== */
function openAuth() { openModal('authModal'); }

function switchAuth(mode) {
  const isLogin = mode === 'login';
  document.getElementById('loginForm').classList.toggle('hidden', !isLogin);
  document.getElementById('registerForm').classList.toggle('hidden', isLogin);
  document.getElementById('tabLogin').className = isLogin ? 'btn btn-primary btn-full' : 'btn btn-outline btn-full';
  document.getElementById('tabRegister').className = !isLogin ? 'btn btn-primary btn-full' : 'btn btn-outline btn-full';
}

/* Role dropdown - show company field */
document.addEventListener('change', (e) => {
  if (e.target.id === 'regRole') {
    document.getElementById('companyGroup').style.display =
      e.target.value === 'recruiter' ? 'block' : 'none';
  }
});

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;

  const user = DB.get('jc_users').find(u => u.email === email && u.pass === pass);
  if (!user) {
    toast('Invalid email or password', true);
    return;
  }

  DB.set('jc_user', user);
  updateAuthUI();
  closeModal('authModal');
  e.target.reset();
  toast(`Welcome back, ${user.name}!`);

  // Redirect based on role
  if (user.role === 'recruiter') showPage('recruiter-dashboard');
  else showPage('seeker-dashboard');
}

function handleRegister(e) {
  e.preventDefault();
  const role = document.getElementById('regRole').value;
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPass').value;
  const company = document.getElementById('regCompany').value.trim();

  const users = DB.get('jc_users');
  if (users.some(u => u.email === email)) {
    toast('Email already registered', true);
    return;
  }

  const user = { id: 'u' + Date.now(), name, email, pass, role };
  if (role === 'recruiter') user.company = company || name;

  users.push(user);
  DB.set('jc_users', users);
  DB.set('jc_user', user);

  // Welcome notification
  const notifs = DB.get('jc_notifs');
  notifs.push({
    id: 'n' + Date.now(),
    email: email,
    msg: 'Welcome to JobConnect! Your account is ready.',
    read: false
  });
  DB.set('jc_notifs', notifs);

  updateAuthUI();
  closeModal('authModal');
  e.target.reset();
  toast('Account created successfully!');

  if (role === 'recruiter') showPage('recruiter-dashboard');
  else showPage('seeker-dashboard');
}

function logout() {
  DB.set('jc_user', null);
  updateAuthUI();
  toast('Logged out');
  showPage('home');
}

function updateAuthUI() {
  const user = DB.get('jc_user', null);

  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const dashBtn = document.getElementById('dashBtn');
  const navUser = document.getElementById('navUser');

  const mobDash = document.getElementById('mobDash');
  const mobLogout = document.getElementById('mobLogout');

  if (user) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-flex';
    dashBtn.style.display = 'inline-flex';
    navUser.textContent = `Hi, ${user.name.split(' ')[0]}`;

    mobDash.style.display = 'block';
    mobLogout.style.display = 'block';
  } else {
    loginBtn.style.display = 'inline-flex';
    logoutBtn.style.display = 'none';
    dashBtn.style.display = 'none';
    navUser.textContent = '';

    mobDash.style.display = 'none';
    mobLogout.style.display = 'none';
  }
}

function goToDashboard() {
  const user = DB.get('jc_user', null);
  if (!user) {
    openAuth();
    return;
  }
  if (user.role === 'recruiter') {
    showPage('recruiter-dashboard');
    showRecruiterTab('overview');
  } else {
    showPage('seeker-dashboard');
    showSeekerTab('overview');
  }
}

/* ==================== JOB SEEKER DASHBOARD ==================== */
function showSeekerTab(tab) {
  document.querySelectorAll('#page-seeker-dashboard .sidebar a').forEach(a => a.classList.remove('active'));
  event?.target?.closest('a')?.classList.add('active');

  const main = document.getElementById('seekerMain');
  const user = DB.get('jc_user');
  if (!user) return;

  if (tab === 'overview') {
    const apps = DB.get('jc_applied').filter(a => a.email === user.email);
    const saved = DB.get('jc_saved');

    main.innerHTML = `
      <h2 class="section-title">Dashboard</h2>
      <div class="dash-cards">
        <div class="dash-card"><div class="num">${apps.length}</div><div class="lbl">Jobs Applied</div></div>
        <div class="dash-card"><div class="num">${saved.length}</div><div class="lbl">Jobs Saved</div></div>
        <div class="dash-card"><div class="num">${apps.filter(a => a.status === 'Under Review').length}</div><div class="lbl">Pending</div></div>
        <div class="dash-card"><div class="num">${apps.filter(a => a.status === 'Shortlisted').length}</div><div class="lbl">Shortlisted</div></div>
      </div>

      <h3 style="margin-bottom:12px;">Recent Applications</h3>
      ${apps.length ? `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Job</th><th>Company</th><th>Applied</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${apps.slice().reverse().map(a => `
                <tr>
                  <td>${a.jobTitle}</td>
                  <td>${a.company}</td>
                  <td>${a.date}</td>
                  <td><span class="status status-${a.status.toLowerCase().replace(' ', '-')}">${a.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `<div class="empty">No applications yet. <span class="link-btn" onclick="showPage('jobs')">Browse jobs →</span></div>`}
    `;
  }

  if (tab === 'applied') {
    const apps = DB.get('jc_applied').filter(a => a.email === user.email);
    main.innerHTML = `
      <h2 class="section-title">Applied Jobs</h2>
      ${apps.length ? `
        <div class="table-wrap">
          <table>
            <thead><tr><th>Job</th><th>Company</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              ${apps.map(a => `
                <tr>
                  <td>${a.jobTitle}</td>
                  <td>${a.company}</td>
                  <td>${a.date}</td>
                  <td><span class="status status-${a.status.toLowerCase().replace(' ', '-')}">${a.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `<div class="empty">No applications yet.</div>`}
    `;
  }

  if (tab === 'saved') {
    const saved = DB.get('jc_saved');
    const jobs = DB.get('jc_jobs').filter(j => saved.includes(j.id));
    main.innerHTML = `
      <h2 class="section-title">Saved Jobs</h2>
      ${jobs.length ? `<div class="grid-2">${jobs.map(jobCard).join('')}</div>`
        : `<div class="empty">No saved jobs yet.</div>`}
    `;
  }

  if (tab === 'profile') {
    main.innerHTML = `
      <h2 class="section-title">My Profile</h2>
      <div class="job-card" style="max-width:600px;">
        <form onsubmit="saveProfile(event)">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="pName" value="${user.name || ''}" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="pEmail" value="${user.email || ''}" required>
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="text" id="pPhone" value="${user.phone || ''}">
          </div>
          <div class="form-group">
            <label>Location</label>
            <input type="text" id="pLocation" value="${user.location || ''}">
          </div>
          <div class="form-group">
            <label>Skills (comma separated)</label>
            <input type="text" id="pSkills" value="${(user.skills || []).join(', ')}">
          </div>
          <div class="form-group">
            <label>Education</label>
            <input type="text" id="pEdu" value="${user.education || ''}">
          </div>
          <div class="form-group">
            <label>Experience</label>
            <input type="text" id="pExp" value="${user.experience || ''}">
          </div>
          <button type="submit" class="btn btn-primary btn-full">Save Profile</button>
        </form>
      </div>
    `;
  }
}

function saveProfile(e) {
  e.preventDefault();
  const user = DB.get('jc_user');
  const users = DB.get('jc_users');

  user.name = document.getElementById('pName').value;
  user.email = document.getElementById('pEmail').value;
  user.phone = document.getElementById('pPhone').value;
  user.location = document.getElementById('pLocation').value;
  user.skills = document.getElementById('pSkills').value.split(',').map(s => s.trim()).filter(Boolean);
  user.education = document.getElementById('pEdu').value;
  user.experience = document.getElementById('pExp').value;

  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) users[idx] = user;

  DB.set('jc_users', users);
  DB.set('jc_user', user);
  updateAuthUI();
  toast('Profile updated successfully ✓');
}

/* ==================== RECRUITER DASHBOARD ==================== */
function showRecruiterTab(tab) {
  document.querySelectorAll('#page-recruiter-dashboard .sidebar a').forEach(a => a.classList.remove('active'));
  event?.target?.closest('a')?.classList.add('active');

  const main = document.getElementById('recruiterMain');
  const user = DB.get('jc_user');
  if (!user) return;

  const myJobs = DB.get('jc_jobs').filter(j => j.company === user.company);
  const myJobIds = myJobs.map(j => j.id);
  const myApps = DB.get('jc_applied').filter(a => myJobIds.includes(a.jobId));

  if (tab === 'overview') {
    main.innerHTML = `
      <h2 class="section-title">Recruiter Dashboard</h2>
      <div class="dash-cards">
        <div class="dash-card"><div class="num">${myJobs.length}</div><div class="lbl">Active Jobs</div></div>
        <div class="dash-card"><div class="num">${myApps.length}</div><div class="lbl">Total Applicants</div></div>
        <div class="dash-card"><div class="num">${myApps.filter(a => a.status === 'Shortlisted').length}</div><div class="lbl">Shortlisted</div></div>
        <div class="dash-card"><div class="num">${myApps.filter(a => a.status === 'Hired').length}</div><div class="lbl">Hired</div></div>
      </div>

      <h3 style="margin-bottom:12px;">Recent Applicants</h3>
      ${myApps.length ? `
        <div class="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Job</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              ${myApps.slice(-5).reverse().map(a => `
                <tr>
                  <td>${a.name}</td>
                  <td>${a.jobTitle}</td>
                  <td>${a.date}</td>
                  <td><span class="status status-${a.status.toLowerCase().replace(' ', '-')}">${a.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `<div class="empty">No applicants yet.</div>`}
    `;
  }

  if (tab === 'post') {
    main.innerHTML = `
      <h2 class="section-title">Post a Job</h2>
      <div class="job-card" style="max-width:700px;">
        <form onsubmit="postJob(event)">
          <div class="form-group">
            <label>Job Title *</label>
            <input type="text" id="pjTitle" required>
          </div>
          <div class="form-group">
            <label>Company *</label>
            <input type="text" id="pjCompany" value="${user.company || ''}" required>
          </div>
          <div class="form-group">
            <label>Location *</label>
            <input type="text" id="pjLocation" required>
          </div>
          <div class="form-group">
            <label>Salary *</label>
            <input type="text" id="pjSalary" placeholder="e.g. ₹5–8 LPA" required>
          </div>
          <div class="form-group">
            <label>Job Type *</label>
            <select id="pjType">
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Internship</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>
          </div>
          <div class="form-group">
            <label>Experience *</label>
            <input type="text" id="pjExp" placeholder="e.g. 2-4 yrs" required>
          </div>
          <div class="form-group">
            <label>Category</label>
            <select id="pjCategory">
              <option>Software Development</option>
              <option>Web Development</option>
              <option>Data Science</option>
              <option>Design</option>
              <option>Cloud</option>
            </select>
          </div>
          <div class="form-group">
            <label>Skills (comma separated)</label>
            <input type="text" id="pjSkills" placeholder="JavaScript, React, Node.js">
          </div>
          <div class="form-group">
            <label>Description *</label>
            <textarea id="pjDesc" rows="3" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-full">Post Job</button>
        </form>
      </div>
    `;
  }

  if (tab === 'manage') {
    main.innerHTML = `
      <h2 class="section-title">Manage Jobs</h2>
      ${myJobs.length ? `
        <div class="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Location</th><th>Applicants</th><th>Actions</th></tr></thead>
            <tbody>
              ${myJobs.map(j => {
                const count = DB.get('jc_applied').filter(a => a.jobId === j.id).length;
                return `
                  <tr>
                    <td>${j.title}</td>
                    <td>${j.location}</td>
                    <td>${count}</td>
                    <td>
                      <button class="btn btn-outline btn-sm" onclick="editJob(${j.id})">Edit</button>
                      <button class="btn btn-danger btn-sm" onclick="deleteJob(${j.id})">Delete</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      ` : `<div class="empty">No jobs posted yet.</div>`}
    `;
  }

  if (tab === 'applicants') {
    main.innerHTML = `
      <h2 class="section-title">Applicants</h2>
      ${myApps.length ? `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Job</th><th>Date</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              ${myApps.map(a => `
                <tr>
                  <td>${a.name}</td>
                  <td>${a.email}</td>
                  <td>${a.jobTitle}</td>
                  <td>${a.date}</td>
                  <td>
                    <select onchange="updateAppStatus('${a.email}', ${a.jobId}, this.value)" style="padding:4px 8px; border-radius:6px; border:1px solid #e2e8f0; font-size:13px;">
                      ${['Applied','Under Review','Shortlisted','Interview','Rejected','Hired'].map(s =>
                        `<option ${a.status === s ? 'selected' : ''}>${s}</option>`
                      ).join('')}
                    </select>
                  </td>
                  <td>
                    <button class="btn btn-success btn-sm" onclick="updateAppStatus('${a.email}', ${a.jobId}, 'Shortlisted')">Shortlist</button>
                    <button class="btn btn-danger btn-sm" onclick="updateAppStatus('${a.email}', ${a.jobId}, 'Rejected')">Reject</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `<div class="empty">No applicants yet.</div>`}
    `;
  }
}

function postJob(e) {
  e.preventDefault();
  const user = DB.get('jc_user');
  const jobs = DB.get('jc_jobs');

  const newJob = {
    id: Date.now(),
    title: document.getElementById('pjTitle').value,
    company: document.getElementById('pjCompany').value,
    location: document.getElementById('pjLocation').value,
    salary: document.getElementById('pjSalary').value,
    type: document.getElementById('pjType').value,
    exp: document.getElementById('pjExp').value,
    category: document.getElementById('pjCategory').value,
    skills: document.getElementById('pjSkills').value.split(',').map(s => s.trim()).filter(Boolean),
    desc: document.getElementById('pjDesc').value,
    posted: 'Just now'
  };

  jobs.push(newJob);
  DB.set('jc_jobs', jobs);

  e.target.reset();
  toast('Job posted successfully ✓');
  showRecruiterTab('manage');
}

function editJob(id) {
  const job = DB.get('jc_jobs').find(j => j.id === id);
  if (!job) return;

  document.getElementById('editJobId').value = job.id;
  document.getElementById('editTitle').value = job.title;
  document.getElementById('editCompany').value = job.company;
  document.getElementById('editLocation').value = job.location;
  document.getElementById('editSalary').value = job.salary;
  document.getElementById('editType').value = job.type;
  document.getElementById('editExp').value = job.exp;
  document.getElementById('editDesc').value = job.desc;

  openModal('editJobModal');
}

function saveEditedJob(e) {
  e.preventDefault();
  const id = Number(document.getElementById('editJobId').value);
  const jobs = DB.get('jc_jobs');
  const job = jobs.find(j => j.id === id);
  if (!job) return;

  job.title = document.getElementById('editTitle').value;
  job.company = document.getElementById('editCompany').value;
  job.location = document.getElementById('editLocation').value;
  job.salary = document.getElementById('editSalary').value;
  job.type = document.getElementById('editType').value;
  job.exp = document.getElementById('editExp').value;
  job.desc = document.getElementById('editDesc').value;

  DB.set('jc_jobs', jobs);
  closeModal('editJobModal');
  toast('Job updated successfully ✓');
  showRecruiterTab('manage');
}

function deleteJob(id) {
  if (!confirm('Are you sure you want to delete this job?')) return;
  const jobs = DB.get('jc_jobs').filter(j => j.id !== id);
  DB.set('jc_jobs', jobs);
  toast('Job deleted');
  showRecruiterTab('manage');
}

function updateAppStatus(email, jobId, status) {
  const apps = DB.get('jc_applied');
  const app = apps.find(a => a.email === email && a.jobId === jobId);
  if (!app) return;

  app.status = status;
  DB.set('jc_applied', apps);

  // Notify the applicant
  const notifs = DB.get('jc_notifs');
  notifs.push({
    id: 'n' + Date.now(),
    email: email,
    msg: `Your application for "${app.jobTitle}" is now: ${status}.`,
    read: false
  });
  DB.set('jc_notifs', notifs);

  toast(`Status updated to ${status}`);
  showRecruiterTab('applicants');
}

/* ==================== NOTIFICATIONS ==================== */
function renderNotifications() {
  const user = DB.get('jc_user');
  const box = document.getElementById('notifList');
  if (!box) return;

  if (!user) {
    box.innerHTML = `<div class="empty">Please login to see notifications.</div>`;
    return;
  }

  const notifs = DB.get('jc_notifs').filter(n => n.email === user.email).reverse();

  if (!notifs.length) {
    box.innerHTML = `<div class="empty">No notifications yet.</div>`;
    return;
  }

  // Mark as read
  const all = DB.get('jc_notifs');
  all.forEach(n => { if (n.email === user.email) n.read = true; });
  DB.set('jc_notifs', all);

  box.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}">
      <i class="fa-solid fa-bell"></i>
      <div>${n.msg}</div>
    </div>
  `).join('');
}

/* ==================== INIT ==================== */
function init() {
  updateAuthUI();
  renderFeatured();
  showPage('home');
}

window.addEventListener('DOMContentLoaded', init);