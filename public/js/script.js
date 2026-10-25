(function () {
  'use strict';
  var KEYS = {
    complaints: 'hd_complaints',
    users: 'hd_users',
    session: 'hd_session',
    mine: 'hd_mine',
    messages: 'hd_messages'
  };

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(d) {
    d = new Date(d);
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }
  function fmtDateTime(d) {
    d = new Date(d);
    var h = d.getHours(), m = d.getMinutes();
    var ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return fmtDate(d) + ', ' + h + ':' + (m < 10 ? '0' : '') + m + ' ' + ap;
  }
  function iso(y, mo, d, h, mi) { return new Date(y, mo - 1, d, h, mi).toISOString(); }
  function seed() {
    if (!load(KEYS.users, null)) {
      save(KEYS.users, [
        { name: 'Aarav Sharma', email: 'aarav.sharma@campus.edu', password: 'student123', role: 'student' },
        { name: 'Warden Office', email: 'warden@campus.edu', password: 'warden123', role: 'staff' }
      ]);
    }
    if (!load(KEYS.complaints, null)) {
      var A = 'aarav.sharma@campus.edu', N = 'Aarav Sharma';
      save(KEYS.complaints, [
        {
          id: 'HD-1008', title: 'Geyser not heating water', hostel: 'Patel Hostel', room: '62',
          category: 'Plumbing', priority: 'High', status: 'Resolved', name: N, email: A,
          description: 'The geyser in the common washroom has stopped heating water since Monday. Mornings are very difficult without hot water.',
          created: iso(2026, 8, 20, 8, 30),
          timeline: [
            { date: iso(2026, 8, 20, 8, 30), text: 'Complaint filed by student' },
            { date: iso(2026, 8, 20, 12, 10), text: 'Acknowledged by warden\'s office' },
            { date: iso(2026, 8, 22, 10, 0), text: 'Status changed to Resolved' }
          ]
        },
        {
          id: 'HD-1021', title: 'Wi-Fi drops every evening', hostel: 'Nehru Hostel', room: '305',
          category: 'Wi-Fi & internet', priority: 'Low', status: 'Resolved', name: N, email: A,
          description: 'The Wi-Fi disconnects every evening between 7 and 10 PM and reconnects only after several minutes.',
          created: iso(2026, 8, 29, 19, 45),
          timeline: [
            { date: iso(2026, 8, 29, 19, 45), text: 'Complaint filed by student' },
            { date: iso(2026, 8, 31, 11, 20), text: 'Status changed to Resolved' }
          ]
        },
        {
          id: 'HD-1039', title: 'Leaking tap in washroom', hostel: 'Gandhi Hostel', room: '118',
          category: 'Plumbing', priority: 'High', status: 'Open', name: N, email: A,
          description: 'The tap in the attached washroom leaks continuously and has started flooding the floor at night.',
          created: iso(2026, 9, 5, 7, 50),
          timeline: [{ date: iso(2026, 9, 5, 7, 50), text: 'Complaint filed by student' }]
        },
        {
          id: 'HD-1042', title: 'Ceiling fan not working', hostel: 'Ashoka Hostel', room: '214',
          category: 'Electrical', priority: 'Medium', status: 'In Progress', name: N, email: A,
          description: 'The ceiling fan in the room has stopped turning on entirely — flipping the switch does nothing, and the regulator has no effect either. It was working fine last week. There\'s no sound or smell of burning, just no response at all. Room gets quite warm in the afternoon, so any visit before then would help.',
          created: iso(2026, 9, 8, 9, 14),
          timeline: [
            { date: iso(2026, 9, 8, 9, 14), text: 'Complaint filed by student' },
            { date: iso(2026, 9, 8, 14, 40), text: 'Acknowledged by warden\'s office' },
            { date: iso(2026, 9, 9, 11, 5), text: 'Assigned to maintenance — status set to In Progress' }
          ]
        },
        {
          id: 'HD-1044', title: 'Cupboard door won\'t close', hostel: 'Tagore Hostel', room: '27',
          category: 'Furniture & fixtures', priority: 'Low', status: 'Open', name: N, email: A,
          description: 'The hinge on the cupboard door is bent, so the door will not close properly.',
          created: iso(2026, 9, 10, 16, 20),
          timeline: [{ date: iso(2026, 9, 10, 16, 20), text: 'Complaint filed by student' }]
        }
      ]);
    }
  }
  function getComplaints() { return load(KEYS.complaints, []); }
  function setComplaints(list) { save(KEYS.complaints, list); }
  function getUsers() { return load(KEYS.users, []); }
  function getSession() { return load(KEYS.session, null); }
  function isStaff() { var s = getSession(); return !!(s && s.role === 'staff'); }

  function nextId() {
    var max = 1000;
    getComplaints().forEach(function (c) {
      var n = parseInt(String(c.id).replace(/\D/g, ''), 10);
      if (n > max) max = n;
    });
    return 'HD-' + (max + 1);
  }

  function badgeFor(status) {
    return status === 'Resolved' ? 'badge-resolved' : status === 'In Progress' ? 'badge-progress' : 'badge-open';
  }
  function priBadge(p) { return 'badge-priority-' + String(p).toLowerCase(); }
  function injectStyles() {
    var css =
      '.hd-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(20px);' +
      'background:#1B2547;color:#fff;padding:12px 20px;border-radius:10px;font-size:.92rem;font-weight:500;' +
      'box-shadow:0 8px 24px rgba(0,0,0,.2);opacity:0;pointer-events:none;transition:all .25s ease;z-index:200;max-width:90vw}' +
      '.hd-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}' +
      '.hd-toast.error{background:#B0433B}.hd-toast.success{background:#3F7D53}' +
      '.hd-alert{border-radius:6px;padding:12px 16px;margin-bottom:20px;font-size:.9rem}' +
      '.hd-alert.error{background:#F5DEDB;color:#7a2c26}.hd-alert.success{background:#DFEFE2;color:#234a30}' +
      '.hd-alert.info{background:#DDE2EF;color:#1B2547}' +
      '.hd-inline{display:flex;gap:10px;flex-wrap:wrap;align-items:center}' +
      '.hd-inline select{flex:1;min-width:140px;padding:10px 12px;border:1px solid #E4DECF;border-radius:6px;font:inherit;background:#fff}' +
      '.site-nav a.hd-user{font-size:.85rem}';
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  var toastTimer;
  function toast(msg, type) {
    var t = document.getElementById('hdToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'hdToast';
      t.className = 'hd-toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className = 'hd-toast ' + (type || '');
    void t.offsetWidth;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3200);
  }

  function flash(msg, type) { save('hd_flash', { msg: msg, type: type || 'success' }); }
  function showFlash() {
    var f = load('hd_flash', null);
    if (f) {
      try { localStorage.removeItem('hd_flash'); } catch (e) {}
      toast(f.msg, f.type);
    }
  }

  function alertBox(container, msg, type, before) {
    var old = container.querySelector('.hd-alert');
    if (old) old.remove();
    var d = document.createElement('div');
    d.className = 'hd-alert ' + (type || 'info');
    d.textContent = msg;
    container.insertBefore(d, before || container.firstChild);
    return d;
  }
  function initNav() {
    var cb = document.getElementById('navToggle');
    var nav = document.getElementById('siteNav');
    if (!nav) return;

    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { if (cb) cb.checked = false; });
    });

    var session = getSession();
    var loginLink = nav.querySelector('a[href="login.html"]');
    if (session && loginLink) {
      var first = session.name.split(' ')[0];
      loginLink.textContent = 'Logout (' + first + ')';
      loginLink.title = 'Signed in as ' + session.email;
      loginLink.classList.remove('active');
      loginLink.addEventListener('click', function (e) {
        e.preventDefault();
        try { localStorage.removeItem(KEYS.session); } catch (err) {}
        flash('You have been logged out.', 'success');
        window.location.href = 'index.html';
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && cb) cb.checked = false;
    });
  }
  function initHome() {
    var nums = document.querySelectorAll('.stat-row .stat-num');
    if (nums.length < 3) return;
    var all = getComplaints();
    var base = { total: 142 - 5, progress: 18 - 1, resolved: 124 - 2 };
    var live = {
      total: all.length,
      progress: all.filter(function (c) { return c.status === 'In Progress'; }).length,
      resolved: all.filter(function (c) { return c.status === 'Resolved'; }).length
    };
    var vals = [base.total + live.total, base.progress + live.progress, base.resolved + live.resolved];
    nums.forEach(function (el, i) {
      if (i > 2) return;
      countUp(el, vals[i]);
    });
  }

  function countUp(el, target) {
    var start = 0, dur = 700, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = Math.round(start + (target - start) * p);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function initSubmit() {
    var form = document.querySelector('form.form-card');
    if (!form) return;

    var note = form.querySelector('.form-note');
    if (note) {
      note.textContent = 'Your complaint is saved instantly and gets a reference number you can track under My Complaints.';
    }

    var session = getSession();
    if (session) {
      var n = document.getElementById('studentName');
      var e = document.getElementById('studentEmail');
      if (n && !n.value) n.value = session.name;
      if (e && !e.value) e.value = session.email;
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var get = function (id) { return document.getElementById(id).value.trim(); };
      var complaint = {
        id: nextId(),
        title: get('title'),
        hostel: get('hostel'),
        room: get('room'),
        category: get('category'),
        priority: get('priority'),
        status: 'Open',
        name: get('studentName'),
        email: get('studentEmail').toLowerCase(),
        description: get('description'),
        created: new Date().toISOString(),
        timeline: [{ date: new Date().toISOString(), text: 'Complaint filed by student' }]
      };

      var list = getComplaints();
      list.push(complaint);
      setComplaints(list);

      var mine = load(KEYS.mine, []);
      mine.push(complaint.id);
      save(KEYS.mine, mine);

      flash('Complaint submitted! Your reference number is #' + complaint.id, 'success');
      window.location.href = 'complaint-details.html?id=' + encodeURIComponent(complaint.id);
    });
  }
  function visibleComplaints() {
    var session = getSession();
    var all = getComplaints();
    if (session && session.role === 'staff') return all;
    if (session) {
      var mine = load(KEYS.mine, []);
      return all.filter(function (c) {
        return c.email === session.email.toLowerCase() || mine.indexOf(c.id) !== -1;
      });
    }
    var ids = load(KEYS.mine, []);
    return all.filter(function (c) { return ids.indexOf(c.id) !== -1; });
  }

  function rowHtml(c) {
    return '<a class="complaint-row" href="complaint-details.html?id=' + encodeURIComponent(c.id) + '">' +
      '<div><h3>' + esc(c.title) + '</h3>' +
      '<div class="meta">#' + esc(c.id) + ' &middot; ' + esc(c.hostel) + ', Room ' + esc(c.room) +
      ' &middot; Filed ' + fmtDate(c.created) + '</div></div>' +
      '<div class="badges"><span class="badge ' + priBadge(c.priority) + '">' + esc(c.priority) + '</span>' +
      '<span class="badge ' + badgeFor(c.status) + '">' + esc(c.status) + '</span></div></a>';
  }

  function initMyComplaints() {
    var tabs = document.querySelector('.status-tabs');
    if (!tabs) return;

    var items = visibleComplaints().sort(function (a, b) { return new Date(b.created) - new Date(a.created); });
    var session = getSession();

    var groups = [
      { status: 'Open', panel: '.panel-open', tab: 'tab-open', msg: 'No open complaints.' },
      { status: 'In Progress', panel: '.panel-progress', tab: 'tab-progress', msg: 'Nothing is being worked on right now.' },
      { status: 'Resolved', panel: '.panel-resolved', tab: 'tab-resolved', msg: 'No resolved complaints yet.' }
    ];

    groups.forEach(function (g) {
      var list = items.filter(function (c) { return c.status === g.status; });
      var panel = tabs.querySelector(g.panel);
      if (panel) {
        panel.innerHTML = list.length
          ? '<div class="complaint-list">' + list.map(rowHtml).join('') + '</div>'
          : '<div class="empty-state">' + g.msg + '</div>';
      }
      var count = tabs.querySelector('label[for="' + g.tab + '"] .tab-count');
      if (count) count.textContent = '(' + list.length + ')';
    });
    var intro = document.querySelector('.flex-between p');
    if (intro) {
      intro.textContent = session && session.role === 'staff'
        ? 'Staff view — all complaints across every hostel.'
        : session
          ? 'Complaints filed by you, grouped by status.'
          : 'Complaints filed from this device, grouped by status.';
    }
    if (!session) {
      var holder = tabs.parentNode;
      var banner = document.createElement('div');
      banner.className = 'hd-alert info';
      banner.innerHTML = 'Tip: <a href="login.html" style="text-decoration:underline">log in</a> to see all complaints linked to your campus email.';
      holder.insertBefore(banner, tabs);
    }
    var firstWithItems = groups.filter(function (g) {
      return items.some(function (c) { return c.status === g.status; });
    })[0];
    if (firstWithItems) {
      var radio = document.getElementById(firstWithItems.tab);
      if (radio) radio.checked = true;
    }
  }
  function initDetails() {
    var container = document.querySelector('main .container');
    if (!container || !document.querySelector('.detail-header')) return;

    var params = new URLSearchParams(window.location.search);
    var id = params.get('id') || 'HD-1042';
    var complaint = getComplaints().filter(function (c) { return c.id === id; })[0];

    if (!complaint) {
      container.innerHTML =
        '<p><a href="my-complaints.html">&larr; Back to My Complaints</a></p>' +
        '<div class="empty-state"><h2>Complaint not found</h2>' +
        '<p>We couldn\'t find a complaint with reference <strong>' + esc(id) + '</strong>. It may have been deleted.</p></div>';
      return;
    }

    render(complaint);

    function render(c) {
      var staff = isStaff();
      var timeline = c.timeline.map(function (t) {
        return '<li><div class="t-date">' + fmtDateTime(t.date) + '</div><div>' + esc(t.text) + '</div></li>';
      }).join('');

      var staffCard = staff
        ? '<p style="font-size:.85rem">Signed in as staff. Update the status or remove this complaint.</p>' +
          '<div class="hd-inline" style="margin-bottom:12px">' +
          '<select id="statusSelect" aria-label="Status">' +
          ['Open', 'In Progress', 'Resolved'].map(function (s) {
            return '<option' + (s === c.status ? ' selected' : '') + '>' + s + '</option>';
          }).join('') + '</select>' +
          '<button class="btn btn-primary btn-sm" id="updateStatus" type="button">Update</button></div>' +
          '<button class="btn btn-danger btn-sm btn-block" id="deleteComplaint" type="button">Delete complaint</button>'
        : '<p style="font-size:.85rem">Status updates and deletion are handled by the warden\'s office. ' +
          '<a href="login.html" style="text-decoration:underline">Staff log in</a> to manage this complaint.</p>';

      container.innerHTML =
        '<p><a href="my-complaints.html">&larr; Back to My Complaints</a></p>' +
        '<div class="detail-header"><div>' +
        '<div class="meta" style="color:var(--color-ink-faint);font-size:.85rem">#' + esc(c.id) + '</div>' +
        '<h1 style="margin-top:4px">' + esc(c.title) + '</h1>' +
        '<div class="badges" style="display:flex;gap:8px">' +
        '<span class="badge ' + badgeFor(c.status) + '">' + esc(c.status) + '</span>' +
        '<span class="badge ' + priBadge(c.priority) + '">' + esc(c.priority) + '</span></div></div></div>' +
        '<div class="detail-grid"><div>' +
        '<div class="card" style="margin-bottom:20px"><h3 class="mt-0">Description</h3>' +
        '<p style="margin:0;color:var(--color-ink);white-space:pre-wrap">' + esc(c.description) + '</p></div>' +
        '<div class="card"><h3 class="mt-0">Timeline</h3><ul class="timeline">' + timeline + '</ul></div></div>' +
        '<div><div class="card" style="margin-bottom:20px"><h3 class="mt-0">Details</h3><ul class="info-list">' +
        '<li><span>Hostel</span><span>' + esc(c.hostel) + '</span></li>' +
        '<li><span>Room</span><span>' + esc(c.room) + '</span></li>' +
        '<li><span>Category</span><span>' + esc(c.category) + '</span></li>' +
        '<li><span>Filed by</span><span>' + esc(c.name) + '</span></li>' +
        '<li><span>Email</span><span>' + esc(c.email) + '</span></li>' +
        '<li><span>Filed on</span><span>' + fmtDate(c.created) + '</span></li></ul></div>' +
        '<div class="card"><h3 class="mt-0">Warden &amp; staff actions</h3>' + staffCard + '</div></div></div>';

      if (staff) {
        document.getElementById('updateStatus').addEventListener('click', function () {
          var newStatus = document.getElementById('statusSelect').value;
          if (newStatus === c.status) { toast('Status is already ' + newStatus + '.'); return; }
          var list = getComplaints();
          list.forEach(function (item) {
            if (item.id === c.id) {
              item.status = newStatus;
              item.timeline.push({ date: new Date().toISOString(), text: 'Status changed to ' + newStatus + ' by warden\'s office' });
              c = item;
            }
          });
          setComplaints(list);
          render(c);
          toast('Status updated to ' + newStatus, 'success');
        });

        document.getElementById('deleteComplaint').addEventListener('click', function () {
          if (!confirm('Delete complaint #' + c.id + '? This cannot be undone.')) return;
          setComplaints(getComplaints().filter(function (item) { return item.id !== c.id; }));
          flash('Complaint #' + c.id + ' deleted.', 'success');
          window.location.href = 'my-complaints.html';
        });
      }
    }
  }
  function initAuth() {
    var loginForm = document.querySelector('.login-content form');
    var regForm = document.querySelector('.register-content form');
    if (!loginForm || !regForm) return;

    var session = getSession();
    if (session) {
      var card = document.querySelector('.auth-card .card');
      card.innerHTML =
        '<h2>You\'re signed in</h2>' +
        '<p>Logged in as <strong>' + esc(session.name) + '</strong> (' + esc(session.email) + ')' +
        (session.role === 'staff' ? ' — staff account.' : '.') + '</p>' +
        '<a class="btn btn-primary btn-block" href="my-complaints.html" style="margin-bottom:10px">Go to My Complaints</a>' +
        '<button class="btn btn-ghost btn-block" id="logoutBtn" type="button">Log out</button>';
      document.getElementById('logoutBtn').addEventListener('click', function () {
        try { localStorage.removeItem(KEYS.session); } catch (e) {}
        window.location.reload();
      });
      return;
    }
    var hint = document.querySelector('.login-content p');
    if (hint) {
      var d = document.createElement('p');
      d.style.cssText = 'font-size:.82rem;margin-top:-6px';
      d.innerHTML = 'Demo — student: <strong>aarav.sharma@campus.edu</strong> / <strong>student123</strong><br>' +
                    'Warden: <strong>warden@campus.edu</strong> / <strong>warden123</strong>';
      hint.parentNode.insertBefore(d, hint.nextSibling);
    }
    var demoNote = document.querySelector('.login-tabs > p');
    if (demoNote) demoNote.textContent = 'Accounts are stored in this browser only.';

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('loginEmail').value.trim().toLowerCase();
      var pass = document.getElementById('loginPassword').value;
      var user = getUsers().filter(function (u) { return u.email === email && u.password === pass; })[0];
      var wrap = loginForm.parentNode;
      if (!user) {
        alertBox(wrap, 'Incorrect email or password.', 'error', loginForm);
        return;
      }
      save(KEYS.session, { name: user.name, email: user.email, role: user.role });
      flash('Welcome back, ' + user.name.split(' ')[0] + '!', 'success');
      window.location.href = user.role === 'staff' ? 'my-complaints.html' : 'my-complaints.html';
    });

    regForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('registerName').value.trim();
      var email = document.getElementById('registerEmail').value.trim().toLowerCase();
      var pass = document.getElementById('registerPassword').value;
      var conf = document.getElementById('confirmPassword').value;
      var wrap = regForm.parentNode;

      if (name.length < 2) return alertBox(wrap, 'Please enter your full name.', 'error', regForm);
      if (pass.length < 6) return alertBox(wrap, 'Password must be at least 6 characters.', 'error', regForm);
      if (pass !== conf) return alertBox(wrap, 'Passwords do not match.', 'error', regForm);

      var users = getUsers();
      if (users.some(function (u) { return u.email === email; })) {
        return alertBox(wrap, 'An account with this email already exists. Try logging in.', 'error', regForm);
      }
      var user = { name: name, email: email, password: pass, role: 'student' };
      users.push(user);
      save(KEYS.users, users);
      save(KEYS.session, { name: user.name, email: user.email, role: 'student' });
      flash('Account created. Welcome, ' + name.split(' ')[0] + '!', 'success');
      window.location.href = 'submit-complaint.html';
    });
  }
  function initContact() {
    var form = document.querySelector('.contact-grid form');
    if (!form) return;

    var note = form.querySelector('.form-note');
    if (note) note.textContent = 'Send a message to the warden\'s office — we\'ll reply to the email you provide.';
    form.removeAttribute('action');
    form.removeAttribute('enctype');

    var session = getSession();
    if (session) {
      var n = document.getElementById('contactName');
      var e = document.getElementById('contactEmail');
      if (n && !n.value) n.value = session.name;
      if (e && !e.value) e.value = session.email;
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var msgs = load(KEYS.messages, []);
      msgs.push({
        name: document.getElementById('contactName').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        message: document.getElementById('contactMessage').value.trim(),
        date: new Date().toISOString()
      });
      save(KEYS.messages, msgs);
      document.getElementById('contactMessage').value = '';
      toast('Message sent. The warden\'s office will get back to you soon.', 'success');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    seed();
    initNav();
    showFlash();

    var page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    switch (page) {
      case '':
      case 'index.html': initHome(); break;
      case 'submit-complaint.html': initSubmit(); break;
      case 'my-complaints.html': initMyComplaints(); break;
      case 'complaint-details.html': initDetails(); break;
      case 'login.html': initAuth(); break;
      case 'contact.html': initContact(); break;
    }
  });
})();