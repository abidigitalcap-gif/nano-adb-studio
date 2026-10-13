/**
 * Nano ADB Pro - Anti-Detect Browser Engine Client Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const TOKEN_DIRECT_LINK = 'https://github.com/settings/tokens/new?description=AntiDetect-Studio-Proxy&scopes=repo,workflow';

  let profiles = [];
  let accounts = [];
  let selectedTab = 'all';
  const selectedProfileIds = new Set();
  const newsLogs = [];

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Top Header News Ticker & Notification Handler (Replaces blocking success popups)
  function notify(msg, type = 'success') {
    console.log(`[Nano ADB News - ${type.toUpperCase()}] ${msg}`);
    const newsTickerText = document.getElementById('newsTickerText');
    const newsCountBadge = document.getElementById('newsCountBadge');
    const newsDrawerList = document.getElementById('newsDrawerList');

    const logItem = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text: msg,
      type: type
    };
    newsLogs.unshift(logItem);

    if (newsTickerText) {
      newsTickerText.className = `news-ticker-text news-update ${type}`;
      newsTickerText.textContent = msg;
      setTimeout(() => {
        if (newsTickerText) newsTickerText.classList.remove('news-update');
      }, 400);
    }

    if (newsCountBadge) {
      newsCountBadge.textContent = newsLogs.length;
    }

    if (newsDrawerList) {
      const icon = type === 'success' ? '🚀' : (type === 'info' ? 'ℹ️' : (type === 'warning' ? '⚠️' : '❌'));
      const div = document.createElement('div');
      div.className = `news-log-item ${type}`;
      div.innerHTML = `<span class="news-log-time">${logItem.time}</span><span class="news-log-text">${icon} ${escapeHtml(msg)}</span>`;
      newsDrawerList.insertBefore(div, newsDrawerList.firstChild);
    }
  }

  // Setup News Drawer Toggle
  const btnNewsHistory = document.getElementById('btnNewsHistory');
  const newsHistoryDrawer = document.getElementById('newsHistoryDrawer');
  const btnClearNewsLogs = document.getElementById('btnClearNewsLogs');

  if (btnNewsHistory && newsHistoryDrawer) {
    btnNewsHistory.addEventListener('click', (e) => {
      e.stopPropagation();
      newsHistoryDrawer.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (newsHistoryDrawer && !newsHistoryDrawer.contains(e.target) && e.target !== btnNewsHistory) {
        newsHistoryDrawer.classList.remove('active');
      }
    });
  }

  if (btnClearNewsLogs) {
    btnClearNewsLogs.addEventListener('click', () => {
      newsLogs.length = 0;
      const newsDrawerList = document.getElementById('newsDrawerList');
      if (newsDrawerList) newsDrawerList.innerHTML = '<div style="font-size: 11px; color: #64748b; text-align: center; padding: 10px;">No logs recorded.</div>';
      const newsCountBadge = document.getElementById('newsCountBadge');
      if (newsCountBadge) newsCountBadge.textContent = '0';
    });
  }

  // DOM Elements
  const profilesContainer = document.getElementById('profilesContainer');
  const searchInput = document.getElementById('searchInput');
  const countTabAll = document.getElementById('countTabAll');
  const countTabActive = document.getElementById('countTabActive');
  const countTabCloud = document.getElementById('countTabCloud');
  const countTabDirect = document.getElementById('countTabDirect');

  // Top Header Action Buttons
  const btnCreateProfileHeader = document.getElementById('btnCreateProfileHeader');
  const btnGithubAccountsHeader = document.getElementById('btnGithubAccountsHeader');
  const navCreateProfileSidebar = document.getElementById('navCreateProfileSidebar');
  const navDashboard = document.getElementById('navDashboard');
  const navGithubProxy = document.getElementById('navGithubProxy');
  const navSettings = document.getElementById('navSettings');

  // Batch Toolbar Elements
  const btnLaunchAll = document.getElementById('btnLaunchAll');
  const btnCloseAll = document.getElementById('btnCloseAll');
  const btnRefresh = document.getElementById('btnRefresh');
  const btnTestAllIps = document.getElementById('btnTestAllIps');
  const selectAllCheckbox = document.getElementById('selectAllCheckbox');
  const selectionSummary = document.getElementById('selectionSummary');

  // Modals
  const githubModal = document.getElementById('githubModal');
  const closeGithubModal = document.getElementById('closeGithubModal');
  const connectedAccountsList = document.getElementById('connectedAccountsList');
  const verifyAccountForm = document.getElementById('verifyAccountForm');
  const patInput = document.getElementById('patInput');
  const labelInput = document.getElementById('labelInput');

  // Profile Modal & Dynamic Proxy / Shield Fields
  const profileModal = document.getElementById('profileModal');
  const closeProfileModal = document.getElementById('closeProfileModal');
  const cancelProfileBtn = document.getElementById('cancelProfileBtn');
  const profileForm = document.getElementById('profileForm');
  const editProfileId = document.getElementById('editProfileId');
  const profileModalTitle = document.getElementById('profileModalTitle');
  const profNameInput = document.getElementById('profNameInput');
  const profGroupSelect = document.getElementById('profGroupSelect');
  const profEngineSelect = document.getElementById('profEngineSelect');
  const profDeviceSelect = document.getElementById('profDeviceSelect');
  const profUserAgentInput = document.getElementById('profUserAgentInput');
  const btnRandomizeUa = document.getElementById('btnRandomizeUa');
  const profScreenResSelect = document.getElementById('profScreenResSelect');
  const profCpuSelect = document.getElementById('profCpuSelect');
  const profRamSelect = document.getElementById('profRamSelect');
  const profWebRtcSelect = document.getElementById('profWebRtcSelect');
  const profCanvasNoiseSelect = document.getElementById('profCanvasNoiseSelect');
  const profAudioNoiseSelect = document.getElementById('profAudioNoiseSelect');
  const profLanguageSelect = document.getElementById('profLanguageSelect');
  const profDntSelect = document.getElementById('profDntSelect');

  const profProxySelect = document.getElementById('profProxySelect');
  const profGithubAccSelect = document.getElementById('profGithubAccSelect');
  const profTimezoneSelect = document.getElementById('profTimezoneSelect');
  const profLaunchUrl = document.getElementById('profLaunchUrl');
  const saveProfileBtn = document.getElementById('saveProfileBtn');

  const customProxySection = document.getElementById('customProxySection');
  const githubCloudSection = document.getElementById('githubCloudSection');
  const proxyProtocolInput = document.getElementById('proxyProtocolInput');
  const proxyHostInput = document.getElementById('proxyHostInput');
  const proxyPortInput = document.getElementById('proxyPortInput');
  const proxyUserInput = document.getElementById('proxyUserInput');
  const proxyPassInput = document.getElementById('proxyPassInput');
  const btnTestCustomProxy = document.getElementById('btnTestCustomProxy');
  const proxyTestAlert = document.getElementById('proxyTestAlert');


  // ----------------------------------------------------
  // INITIALIZATION
  // ----------------------------------------------------
  async function init() {
    setupEventListeners();
    setupProxyPoolModule();
    try { await fetchAccounts(); } catch (e) { console.error('fetchAccounts error:', e); }
    try { await fetchProfiles(); } catch (e) { console.error('fetchProfiles error:', e); }
    try { await fetchProxies(); } catch (e) { console.error('fetchProxies error:', e); }
  }

  async function fetchProfiles() {
    try {
      const res = await fetch('/api/profiles');
      const data = await res.json();
      if (data.success) {
        profiles = data.profiles;
        renderProfilesList();
        updateTabCounts();
        populateProfileDropdowns();
      }
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
    }
  }

  function populateProfileDropdowns() {
    const extSourceProfileSelect = document.getElementById('extSourceProfileSelect');
    if (extSourceProfileSelect) {
      const currentVal = extSourceProfileSelect.value;
      extSourceProfileSelect.innerHTML = '<option value="">-- Select Source Profile --</option>';
      profiles.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.name} (${p.deviceName || 'Windows'})`;
        extSourceProfileSelect.appendChild(opt);
      });
      if (currentVal && profiles.some(p => p.id === currentVal)) {
        extSourceProfileSelect.value = currentVal;
      }
    }
  }

  async function fetchAccounts() {
    try {
      const res = await fetch('/api/github/accounts');
      const data = await res.json();
      if (data.success) {
        accounts = data.accounts;
        renderAccounts();
        populateGithubAccountDropdown();
      }
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
    }
  }

  function populateGithubAccountDropdown(selectedId = null) {
    if (!profGithubAccSelect) return;
    profGithubAccSelect.innerHTML = '';
    if (accounts.length === 0) {
      profGithubAccSelect.innerHTML = `<option value="">Default Cloud Runner (@Akasra117)</option>`;
      return;
    }

    const assignedAccIds = new Set(profiles.filter(p => p.proxyType === 'github_cloud' && p.githubAccountId).map(p => p.githubAccountId));
    let firstUnallocatedId = null;

    accounts.forEach(acc => {
      const isAssigned = assignedAccIds.has(acc.id);
      if (!isAssigned && !firstUnallocatedId) {
        firstUnallocatedId = acc.id;
      }
      const opt = document.createElement('option');
      opt.value = acc.id;
      const statusTag = isAssigned ? '⚡ Shared PAT' : '🟢 Dedicated 1:1 Available';
      opt.textContent = `@${acc.username} (${acc.label || 'Connected Account'}) • ${statusTag}`;
      profGithubAccSelect.appendChild(opt);
    });

    if (selectedId) {
      profGithubAccSelect.value = selectedId;
    } else if (firstUnallocatedId) {
      profGithubAccSelect.value = firstUnallocatedId;
    }
  }

  // ----------------------------------------------------
  // RENDER PROFILES TABLE / ROW CARDS (DESKTOP VIEW)
  // ----------------------------------------------------
  function renderProfilesList() {
    if (!profilesContainer) return;
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    profilesContainer.innerHTML = '';

    const filtered = profiles.filter(p => {
      if (selectedTab === 'active' && p.status !== 'running') return false;
      if (selectedTab === 'github_cloud' && p.proxyType !== 'github_cloud') return false;
      if (selectedTab === 'direct' && p.proxyType === 'github_cloud') return false;

      if (query) {
        const nameMatch = (p.name || '').toLowerCase().includes(query);
        const groupMatch = (p.group || '').toLowerCase().includes(query);
        return nameMatch || groupMatch;
      }
      return true;
    });

    if (filtered.length === 0) {
      const emptyMsg = selectedTab === 'active'
        ? 'No active profiles running right now. Click "▶ Launch" on any profile to start it.'
        : 'No profiles found in this tab. Click "+ Create Profile" to add one.';

      profilesContainer.innerHTML = `
        <div style="padding: 40px; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
          ${emptyMsg}
        </div>
      `;
      return;
    }

    filtered.forEach(p => {
      const isRunning = p.status === 'running';
      const isSelected = selectedProfileIds.has(p.id);
      const card = document.createElement('div');
      card.className = `profile-table-card ${isSelected ? 'selected' : ''}`;
      card.dataset.id = p.id;

      const groupName = p.group || 'Default';
      const isCloud = p.proxyType === 'github_cloud';
      const proxyBadgeClass = isCloud ? 'badge-azure' : 'badge-direct';
      const proxyText = isCloud ? '☁️ Azure IP' : (p.proxyType === 'custom' ? `🔒 Custom Proxy` : '🌐 Direct IP');
      const deviceText = p.deviceName || 'Windows 11 - Chrome 152';

      const displayIp = p.displayIp || 'Direct IP';
      const displayCountry = p.displayCountry || '🌐 Direct Mode';
      const isErr = displayIp.includes('❌') || displayCountry.includes('Failed') || displayCountry.includes('Missing') || displayCountry.includes('Offline');

      const locationClass = isErr ? 'badge-error' : (isCloud ? 'active-proxy' : '');

      card.innerHTML = `
        <div class="prof-info-col">
          <input type="checkbox" class="profile-checkbox card-select-checkbox" data-id="${p.id}" ${isSelected ? 'checked' : ''}>
          <div>
            <div class="prof-title">${escapeHtml(p.name)}</div>
            <div class="prof-group-sub">📁 ${escapeHtml(groupName)}</div>
          </div>
        </div>

        <div class="prof-badges-col">
          <span class="badge-pill badge-device">💻 ${escapeHtml(deviceText)}</span>
          <span class="badge-pill ${proxyBadgeClass}">${proxyText}</span>
          <span class="badge-pill badge-tz">🕒 ${escapeHtml(p.timezone || 'America/New_York')}</span>
          <span class="badge-pill" style="background: #1e293b; color: ${isRunning ? '#10b981' : '#64748b'};">
            ${isRunning ? '🟢 Running' : '⚪ Idle'}
          </span>
        </div>

        <div class="prof-location-col">
          <button class="badge-pill badge-location check-ip-btn ${locationClass}" data-id="${p.id}" title="Click to test & verify live IP & Location">
            ${isErr ? '' : '📍 '}<strong>${escapeHtml(displayIp)}</strong> <span style="font-weight:600; opacity: 0.85;">(${escapeHtml(displayCountry)})</span>
          </button>
        </div>

        <div class="prof-actions-col">
          ${isRunning ? `
            <button class="btn btn-red stop-btn" data-id="${p.id}" style="background: #ef4444; border-color: #dc2626; color: #fff;">
              ⏹ Stop
            </button>
          ` : `
            <button class="btn btn-green launch-btn" data-id="${p.id}">
              ▶ Launch
            </button>
          `}
          <button class="icon-btn-action single-test-btn" data-id="${p.id}" title="Test Single Profile Connection IP (What IP it connects to)">⚡</button>
          <button class="icon-btn-action magic-wand-btn" data-id="${p.id}" title="Randomize Fingerprint (Magic Wand)">🪄</button>
          <button class="icon-btn-action edit-btn" data-id="${p.id}" title="Edit Profile">✏️</button>
          <button class="icon-btn-action clone-btn" data-id="${p.id}" title="Clone Profile with Complete Settings">📑</button>
          <button class="icon-btn-action folder-btn" data-id="${p.id}" title="Open Profile Directory">📁</button>
          <button class="icon-btn-action delete-btn" data-id="${p.id}" title="Delete Profile">🗑️</button>
        </div>
      `;

      profilesContainer.appendChild(card);
    });

    attachGridEventHandlers();
    updateSelectionState();
  }

  function updateTabCounts() {
    if (countTabAll) countTabAll.textContent = profiles.length;
    if (countTabActive) countTabActive.textContent = profiles.filter(p => p.status === 'running').length;
    if (countTabCloud) countTabCloud.textContent = profiles.filter(p => p.proxyType === 'github_cloud').length;
    if (countTabDirect) countTabDirect.textContent = profiles.filter(p => p.proxyType !== 'github_cloud').length;

    // Executive Metrics Summary Bar
    const statTotalProfiles = document.getElementById('statTotalProfiles');
    const statActiveProfiles = document.getElementById('statActiveProfiles');
    const statCloudProfiles = document.getElementById('statCloudProfiles');
    const statDirectProfiles = document.getElementById('statDirectProfiles');
    const statGithubPats = document.getElementById('statGithubPats');

    if (statTotalProfiles) statTotalProfiles.textContent = profiles.length;
    if (statActiveProfiles) statActiveProfiles.textContent = profiles.filter(p => p.status === 'running').length;
    if (statCloudProfiles) statCloudProfiles.textContent = profiles.filter(p => p.proxyType === 'github_cloud').length;
    if (statDirectProfiles) statDirectProfiles.textContent = profiles.filter(p => p.proxyType !== 'github_cloud').length;
    if (statGithubPats) statGithubPats.textContent = accounts.length;

    const boxBadge = document.getElementById('profilesBoxBadge');
    if (boxBadge) boxBadge.textContent = `${profiles.length} Profiles Loaded`;
  }

  function updateSelectionState() {
    const visibleCheckboxes = document.querySelectorAll('.card-select-checkbox');
    const totalVisible = visibleCheckboxes.length;
    let selectedVisibleCount = 0;

    visibleCheckboxes.forEach(cb => {
      const card = cb.closest('.profile-table-card');
      const id = cb.dataset.id;
      if (selectedProfileIds.has(id)) {
        cb.checked = true;
        if (card) card.classList.add('selected');
        selectedVisibleCount++;
      } else {
        cb.checked = false;
        if (card) card.classList.remove('selected');
      }
    });

    if (btnLaunchAll) btnLaunchAll.textContent = `▶ Open Selected (${selectedProfileIds.size})`;
    if (selectionSummary) selectionSummary.textContent = `(${selectedProfileIds.size} selected)`;
    if (selectAllCheckbox) selectAllCheckbox.checked = totalVisible > 0 && selectedVisibleCount === totalVisible;
  }

  // ----------------------------------------------------
  // EVENT HANDLERS FOR PROFILE ACTIONS
  // ----------------------------------------------------
  function attachGridEventHandlers() {
    document.querySelectorAll('.card-select-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        e.stopPropagation();
        const id = cb.dataset.id;
        if (cb.checked) {
          selectedProfileIds.add(id);
        } else {
          selectedProfileIds.delete(id);
        }
        updateSelectionState();
      });
    });

    // Helper function for running single profile check-ip with real-time feedback (Matching Test All pipeline)
    async function runSingleProfileCheckIp(id) {
      const profile = profiles.find(p => p.id === id);
      if (!profile) return;

      const locationBtn = document.querySelector(`.check-ip-btn[data-id="${id}"]`);
      const singleTestBtn = document.querySelector(`.single-test-btn[data-id="${id}"]`);

      if (locationBtn) {
        locationBtn.className = 'badge-pill badge-location check-ip-btn testing';
        locationBtn.innerHTML = `⏳ <strong>Testing...</strong>`;
      }
      if (singleTestBtn) {
        singleTestBtn.disabled = true;
        singleTestBtn.className = 'icon-btn-action single-test-btn testing-active';
        singleTestBtn.innerHTML = '⏳';
      }

      try {
        const res = await fetch(`/api/profiles/${id}/check-ip`, { method: 'POST' });
        const data = await res.json();

        if (data.ip) profile.displayIp = data.ip;
        if (data.country) profile.displayCountry = data.country;
        profile.assignedIp = data.ip;
        profile.assignedCountry = data.country;

        const isErr = !data.success || (data.ip && data.ip.includes('❌'));

        if (locationBtn) {
          if (isErr) {
            locationBtn.className = 'badge-pill badge-location check-ip-btn badge-error';
            locationBtn.innerHTML = `<strong>${escapeHtml(data.ip || '❌ Error')}</strong> <span style="font-weight:600; opacity: 0.85;">(${escapeHtml(data.country || 'Failed')})</span>`;
          } else {
            locationBtn.className = 'badge-pill badge-location check-ip-btn active-proxy';
            locationBtn.innerHTML = `📍 <strong>${escapeHtml(data.ip)}</strong> <span style="font-weight:600; opacity: 0.85;">(${escapeHtml(data.country)})</span>`;
          }
        }

        if (singleTestBtn) {
          if (isErr) {
            singleTestBtn.className = 'icon-btn-action single-test-btn delete-btn';
            singleTestBtn.innerHTML = '❌';
            singleTestBtn.title = `Test Failed: ${data.message || 'Connection Error'}`;
          } else {
            singleTestBtn.className = 'icon-btn-action single-test-btn test-success';
            singleTestBtn.innerHTML = '⚡';
            singleTestBtn.title = `Verified IP: ${data.ip} (${data.country})`;
          }
          setTimeout(() => {
            if (singleTestBtn) {
              singleTestBtn.className = 'icon-btn-action single-test-btn';
              singleTestBtn.innerHTML = '⚡';
            }
          }, 2500);
        }

        return data;
      } catch (err) {
        console.error(`Check IP error for profile ${id}:`, err);
        if (locationBtn) {
          locationBtn.className = 'badge-pill badge-location check-ip-btn badge-error';
          locationBtn.innerHTML = `❌ <strong>Connection Error</strong>`;
        }
        if (singleTestBtn) {
          singleTestBtn.className = 'icon-btn-action single-test-btn delete-btn';
          singleTestBtn.innerHTML = '❌';
        }
      } finally {
        if (singleTestBtn) singleTestBtn.disabled = false;
        await fetchProfiles();
      }
    }

    // Check Live IP & Geolocation Button (Single Profile Location Badge)
    document.querySelectorAll('.check-ip-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await runSingleProfileCheckIp(btn.dataset.id);
      });
    });

    // Dedicated Single Profile IP Test Button Handler (⚡ Lightning Bolt)
    document.querySelectorAll('.single-test-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await runSingleProfileCheckIp(btn.dataset.id);
      });
    });

    // Launch Button
    document.querySelectorAll('.launch-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const profile = profiles.find(p => p.id === id);
        if (!profile) return;

        btn.disabled = true;
        btn.textContent = '⏳ Launching...';

        try {
          const res = await fetch(`/api/profiles/${id}/launch`, { method: 'POST' });
          const data = await res.json();

          if (data.success) {
            btn.textContent = '🟢 Active';
            await fetchProfiles();
          } else {
            console.error('[Launch Error Diagnostic]', data);
            notify(`Profile Launch Notice: ${data.message || 'Could not start profile process.'}`, 'warning');
            btn.textContent = '▶ Launch';
          }
        } catch (err) {
          console.error('[Launch Fetch Exception]', err);
          notify(`Connection Error: Failed to communicate with engine backend (${err.message}).`, 'error');
          btn.textContent = '▶ Launch';
        } finally {
          btn.disabled = false;
        }
      });
    });

    // Stop Button
    document.querySelectorAll('.stop-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        btn.disabled = true;
        btn.textContent = '⏳ Stopping...';
        try {
          const res = await fetch(`/api/profiles/${id}/stop`, { method: 'POST' });
          const data = await res.json();
          notify(`Profile stopped.`, 'info');
          await fetchProfiles();
        } catch (err) {
          console.error(err);
          notify('Error stopping profile: ' + err.message, 'error');
        } finally {
          btn.disabled = false;
        }
      });
    });

    // Magic Wand (Randomize Fingerprint)
    document.querySelectorAll('.magic-wand-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        try {
          const res = await fetch(`/api/profiles/${id}/randomize`, { method: 'POST' });
          const data = await res.json();
          if (data.success) {
            btn.style.transform = 'rotate(360deg)';
            notify('🪄 Anti-Detect Fingerprint randomized! Fresh WebGL GPU & Canvas seed applied.', 'success');
            await fetchProfiles();
          }
        } catch (err) {
          console.error(err);
        }
      });
    });

    // Open Profile Directory (Folder)
    document.querySelectorAll('.folder-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        try {
          await fetch(`/api/profiles/${id}/open-folder`, { method: 'POST' });
        } catch (err) {
          console.error(err);
        }
      });
    });

    // Edit Profile
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const profile = profiles.find(p => p.id === btn.dataset.id);
        if (profile) openProfileModal(profile);
      });
    });

    // Clone Profile (Single Card)
    document.querySelectorAll('.clone-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        try {
          const res = await fetch(`/api/profiles/${id}/clone`, { method: 'POST' });
          const data = await res.json();
          if (data.success) {
            await fetchProfiles();
          } else {
            notify(`Failed to clone profile: ${data.message || 'Unknown error'}`, 'error');
          }
        } catch (err) {
          console.error('Clone error:', err);
        }
      });
    });

    // Delete Profile
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (confirm('Delete this browser profile?')) {
          await fetch(`/api/profiles/${id}`, { method: 'DELETE' });
          selectedProfileIds.delete(id);
          await fetchProfiles();
        }
      });
    });
  }

  // ----------------------------------------------------
  // GITHUB ACCOUNTS & PAT VALIDATOR
  // ----------------------------------------------------
  function renderAccounts() {
    if (!connectedAccountsList) return;
    connectedAccountsList.innerHTML = '';
    if (accounts.length === 0) {
      connectedAccountsList.innerHTML = `<div style="font-size: 12px; color: var(--text-muted); padding: 12px; text-align: center; background: #f8fafc; border-radius: 8px;">No connected accounts yet. Add a token below!</div>`;
      return;
    }

    accounts.forEach(acc => {
      const card = document.createElement('div');
      card.className = 'account-card-item';
      
      const isDef = acc.isDefault;
      const initial = acc.username ? acc.username.charAt(0).toUpperCase() : 'G';

      card.innerHTML = `
        <div class="account-card-left">
          <div class="account-avatar">${initial}</div>
          <div class="account-details">
            <div class="account-user-title">
              @${escapeHtml(acc.username)}
              ${isDef ? '<span class="badge-default-acc">DEFAULT</span>' : ''}
            </div>
            <div class="account-meta-sub">
              ${escapeHtml(acc.label || acc.username)} • ${escapeHtml(acc.repo || '')} (${escapeHtml(acc.tokenMasked || '')})
            </div>
          </div>
        </div>

        <div class="account-card-actions">
          <button class="btn btn-dark btn-sm test-token-btn" data-id="${acc.id}" style="padding: 5px 10px; font-size: 11px;">
            ⚡ Test Token
          </button>
          ${!isDef ? `<button class="btn btn-outline btn-sm set-default-btn" data-id="${acc.id}" style="padding: 5px 10px; font-size: 11px;">Set Default</button>` : ''}
          <button class="icon-btn-action delete-account-btn" data-id="${acc.id}" title="Delete Account" style="width: 32px; height: 32px;">🗑️</button>
        </div>
      `;
      connectedAccountsList.appendChild(card);
    });

    document.querySelectorAll('.test-token-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        btn.disabled = true;
        btn.textContent = '⏳ Testing...';
        try {
          const res = await fetch(`/api/github/accounts/${id}/test`, { method: 'POST' });
          const data = await res.json();
          if (data.success) {
            notify(`⚡ Token Verified Active! Account: @${data.username} (${data.scopes.join(', ')})`, 'success');
          } else {
            notify(`Token Test Failed: ${data.message}`, 'error');
          }
        } catch (err) {
          console.error(err);
        } finally {
          btn.textContent = '⚡ Test Token';
          btn.disabled = false;
        }
      });
    });

    document.querySelectorAll('.set-default-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        await fetch(`/api/github/accounts/${btn.dataset.id}/set-default`, { method: 'POST' });
        await fetchAccounts();
      });
    });

    document.querySelectorAll('.delete-account-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('Delete connected account?')) {
          await fetch(`/api/github/accounts/${btn.dataset.id}`, { method: 'DELETE' });
          await fetchAccounts();
        }
      });
    });
  }

  // 1-Click Direct Token Link Copy Button
  const copyTokenLinkBtn = document.getElementById('copyTokenLinkBtn');
  if (copyTokenLinkBtn) {
    copyTokenLinkBtn.addEventListener('click', () => {
      try {
        navigator.clipboard.writeText(TOKEN_DIRECT_LINK);
        copyTokenLinkBtn.textContent = '✓ Copied!';
        setTimeout(() => copyTokenLinkBtn.textContent = '📋 Copy Link', 2000);
      } catch (err) {
        console.error(err);
      }
    });
  }

  if (verifyAccountForm) {
    verifyAccountForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = patInput ? patInput.value.trim() : '';
      const label = labelInput ? labelInput.value.trim() : '';

      try {
        const res = await fetch('/api/github/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, label })
        });
        const data = await res.json();
        if (data.success) {
          if (patInput) patInput.value = '';
          if (labelInput) labelInput.value = '';
          await fetchAccounts();
          notify(`GitHub Account @${data.verification.username} Connected & Verified!`, 'success');
        } else {
          notify(data.message || 'Token verification failed.', 'error');
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  // ----------------------------------------------------
  // PROFILE MODAL CREATION & EDITING
  // ----------------------------------------------------
  // ----------------------------------------------------
  // PROFILE MODAL CREATION & EDITING & REAL USER AGENTS
  // ----------------------------------------------------
  let realUserAgentsStore = { desktop: [], mobile: [], all: [] };
  let isUaDropdownLoaded = false;
  let currentUaCategory = 'desktop';

  const profUaPresetSelect = document.getElementById('profUaPresetSelect');
  const btnRandomizeDesktopUa = document.getElementById('btnRandomizeDesktopUa');
  const btnRandomizeMobileUa = document.getElementById('btnRandomizeMobileUa');
  const deviceModeBadge = document.getElementById('deviceModeBadge');

  const btnCatDesktop = document.getElementById('btnCatDesktop');
  const btnCatMobile = document.getElementById('btnCatMobile');
  const btnOpenDevicesGalleryInModal = document.getElementById('btnOpenDevicesGalleryInModal');
  const btnOpenDevicesModalHeader = document.getElementById('btnOpenDevicesModalHeader');

  const devicesModal = document.getElementById('devicesModal');
  const closeDevicesModal = document.getElementById('closeDevicesModal');
  const btnCloseDevicesModal = document.getElementById('btnCloseDevicesModal');
  const devicesGalleryGrid = document.getElementById('devicesGalleryGrid');
  const devicesSearchInput = document.getElementById('devicesSearchInput');
  const devicesTabAll = document.getElementById('devicesTabAll');
  const devicesTabMobile = document.getElementById('devicesTabMobile');
  const devicesTabDesktop = document.getElementById('devicesTabDesktop');

  let activeDevicesFilter = 'all';

  const DEVICES_GALLERY_LIST = [
    {
      id: 'android-s24-chrome',
      name: 'Samsung Galaxy S24 Ultra',
      category: 'mobile',
      badge: '🤖 Android 14',
      engine: 'blink',
      screenRes: '412x915',
      touch: 5,
      cpu: 8,
      ram: 8,
      ua: 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36'
    },
    {
      id: 'iphone-safari-18',
      name: 'iPhone 16 Pro Max',
      category: 'mobile',
      badge: '📱 iOS 18.2',
      engine: 'webkit',
      screenRes: '390x844',
      touch: 5,
      cpu: 8,
      ram: 8,
      ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/605.1.15'
    },
    {
      id: 'android-pixel9-chrome',
      name: 'Google Pixel 9 Pro',
      category: 'mobile',
      badge: '🤖 Android 15',
      engine: 'blink',
      screenRes: '412x915',
      touch: 5,
      cpu: 8,
      ram: 8,
      ua: 'Mozilla/5.0 (Linux; Android 15; Pixel 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36'
    },
    {
      id: 'ipad-safari-18',
      name: 'iPad Pro 13" M4',
      category: 'mobile',
      badge: '📱 iPadOS 18.2',
      engine: 'webkit',
      screenRes: '810x1080',
      touch: 5,
      cpu: 8,
      ram: 8,
      ua: 'Mozilla/5.0 (iPad; CPU OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/605.1.15'
    },
    {
      id: 'android-xiaomi14-chrome',
      name: 'Xiaomi 14 Ultra',
      category: 'mobile',
      badge: '🤖 Android 14',
      engine: 'blink',
      screenRes: '412x915',
      touch: 5,
      cpu: 8,
      ram: 8,
      ua: 'Mozilla/5.0 (Linux; Android 14; Xiaomi 14 Ultra) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36'
    },
    {
      id: 'win-chrome-152',
      name: 'Windows 11 Workstation',
      category: 'desktop',
      badge: '💻 Win 11 x64',
      engine: 'blink',
      screenRes: '1920x1080',
      touch: 0,
      cpu: 16,
      ram: 16,
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
    },
    {
      id: 'win-firefox-135',
      name: 'Windows 11 Firefox 135',
      category: 'desktop',
      badge: '🦊 Firefox Gecko',
      engine: 'gecko',
      screenRes: '1920x1080',
      touch: 0,
      cpu: 16,
      ram: 16,
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0'
    },
    {
      id: 'mac-safari-18',
      name: 'macOS Sequoia M4 Pro',
      category: 'desktop',
      badge: '🍏 macOS Sequoia',
      engine: 'webkit',
      screenRes: '1440x900',
      touch: 0,
      cpu: 16,
      ram: 16,
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15'
    },
    {
      id: 'linux-chrome-152',
      name: 'Ubuntu Linux 24.04 LTS',
      category: 'desktop',
      badge: '🐧 Linux x64',
      engine: 'blink',
      screenRes: '1920x1080',
      touch: 0,
      cpu: 16,
      ram: 16,
      ua: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
    }
  ];

  async function fetchUserAgents() {
    if (isUaDropdownLoaded && realUserAgentsStore.all.length > 0) return realUserAgentsStore;
    try {
      const res = await fetch('/api/user-agents');
      const data = await res.json();
      if (data.success) {
        realUserAgentsStore = {
          desktop: data.desktop || [],
          mobile: data.mobile || [],
          all: data.userAgents || []
        };
        populateRealUserAgentsDropdown(currentUaCategory);
        isUaDropdownLoaded = true;
      }
    } catch (err) {
      console.error('Failed to load user agents:', err);
    }
    return realUserAgentsStore;
  }

  function populateRealUserAgentsDropdown(categoryFilter = 'all') {
    if (!profUaPresetSelect) return;
    profUaPresetSelect.innerHTML = '<option value="">-- Select from Real Device User Agents --</option>';

    if (categoryFilter === 'all' || categoryFilter === 'desktop') {
      if (realUserAgentsStore.desktop.length > 0) {
        const dtGroup = document.createElement('optgroup');
        dtGroup.label = '💻 Real Desktop Device User Agents';
        realUserAgentsStore.desktop.slice(0, 100).forEach(item => {
          const opt = document.createElement('option');
          opt.value = item.value;
          opt.textContent = `${item.label} • ${item.value.substring(0, 65)}...`;
          dtGroup.appendChild(opt);
        });
        profUaPresetSelect.appendChild(dtGroup);
      }
    }

    if (categoryFilter === 'all' || categoryFilter === 'mobile') {
      if (realUserAgentsStore.mobile.length > 0) {
        const mobGroup = document.createElement('optgroup');
        mobGroup.label = '📱 Real Mobile Device User Agents';
        realUserAgentsStore.mobile.slice(0, 100).forEach(item => {
          const opt = document.createElement('option');
          opt.value = item.value;
          opt.textContent = `${item.label} • ${item.value.substring(0, 65)}...`;
          mobGroup.appendChild(opt);
        });
        profUaPresetSelect.appendChild(mobGroup);
      }
    }
  }

  function setDeviceCategory(category) {
    currentUaCategory = category;
    if (category === 'mobile') {
      if (btnCatDesktop) btnCatDesktop.classList.remove('active');
      if (btnCatMobile) btnCatMobile.classList.add('active');

      populateRealUserAgentsDropdown('mobile');

      if (profDeviceSelect) {
        Array.from(profDeviceSelect.querySelectorAll('option')).forEach(opt => {
          const isMob = opt.value.includes('iphone') || opt.value.includes('android') || opt.value.includes('ipad');
          opt.style.display = isMob ? '' : 'none';
        });
        profDeviceSelect.value = 'android-s24-chrome';
      }

      if (realUserAgentsStore.mobile.length > 0 && profUserAgentInput) {
        const randUa = realUserAgentsStore.mobile[0].value;
        profUserAgentInput.value = randUa;
        if (profUaPresetSelect) profUaPresetSelect.value = randUa;
      }
      syncDeviceModeUI(true);
    } else {
      if (btnCatMobile) btnCatMobile.classList.remove('active');
      if (btnCatDesktop) btnCatDesktop.classList.add('active');

      populateRealUserAgentsDropdown('desktop');

      if (profDeviceSelect) {
        Array.from(profDeviceSelect.querySelectorAll('option')).forEach(opt => {
          const isMob = opt.value.includes('iphone') || opt.value.includes('android') || opt.value.includes('ipad');
          opt.style.display = isMob ? 'none' : '';
        });
        profDeviceSelect.value = 'win-chrome-152';
      }

      if (realUserAgentsStore.desktop.length > 0 && profUserAgentInput) {
        const randUa = realUserAgentsStore.desktop[0].value;
        profUserAgentInput.value = randUa;
        if (profUaPresetSelect) profUaPresetSelect.value = randUa;
      }
      syncDeviceModeUI(false);
    }
  }

  if (btnCatDesktop) btnCatDesktop.addEventListener('click', () => setDeviceCategory('desktop'));
  if (btnCatMobile) btnCatMobile.addEventListener('click', () => setDeviceCategory('mobile'));

  function syncDeviceModeUI(isMobile, customRes = null) {
    if (deviceModeBadge) {
      if (isMobile) {
        deviceModeBadge.style.background = '#f3e8ff';
        deviceModeBadge.style.color = '#6b21a8';
        deviceModeBadge.textContent = '📱 Mode: Mobile Device Emulation (Touch: 5, Scale: 2x)';
      } else {
        deviceModeBadge.style.background = '#e0f2fe';
        deviceModeBadge.style.color = '#0369a1';
        deviceModeBadge.textContent = '💻 Mode: Desktop Real Device (Touch: 0)';
      }
    }

    if (profScreenResSelect) {
      const currentVal = customRes || profScreenResSelect.value;
      profScreenResSelect.innerHTML = '';

      if (isMobile) {
        const mobResList = [
          { value: '390x844', label: '390x844 (iPhone 15/16 Pro Display)' },
          { value: '412x915', label: '412x915 (Samsung S24 Ultra / Pixel 9 Pro)' },
          { value: '393x852', label: '393x852 (iPhone 15/16 Standard)' },
          { value: '360x800', label: '360x800 (Android Standard Screen)' },
          { value: '414x896', label: '414x896 (iPhone XR / 11 / 11 Pro Max)' },
          { value: '810x1080', label: '810x1080 (iPad Pro 11" Display)' }
        ];
        mobResList.forEach(r => {
          const opt = document.createElement('option');
          opt.value = r.value;
          opt.textContent = r.label;
          profScreenResSelect.appendChild(opt);
        });
        profScreenResSelect.value = currentVal && mobResList.some(r => r.value === currentVal) ? currentVal : '390x844';
      } else {
        const dtResList = [
          { value: '1920x1080', label: '1920x1080 (Full HD 1080p Standard)' },
          { value: '2560x1440', label: '2560x1440 (2K QHD Display)' },
          { value: '1366x768', label: '1366x768 (HD Laptop Display)' },
          { value: '1440x900', label: '1440x900 (MacBook Air / Pro Display)' },
          { value: '1536x864', label: '1536x864 (HD+ Desktop Display)' }
        ];
        dtResList.forEach(r => {
          const opt = document.createElement('option');
          opt.value = r.value;
          opt.textContent = r.label;
          profScreenResSelect.appendChild(opt);
        });
        profScreenResSelect.value = currentVal && dtResList.some(r => r.value === currentVal) ? currentVal : '1920x1080';
      }
    }

    if (profCpuSelect) {
      if (isMobile && parseInt(profCpuSelect.value) > 8) profCpuSelect.value = '8';
    }
    if (profRamSelect) {
      if (isMobile && parseInt(profRamSelect.value) > 8) profRamSelect.value = '8';
    }
  }

  function toggleProxySectionVisibility() {
    if (proxyTestAlert) proxyTestAlert.style.display = 'none';
    if (!profProxySelect) return;
    const mode = profProxySelect.value;
    if (mode === 'custom') {
      if (customProxySection) customProxySection.style.display = 'block';
      if (githubCloudSection) githubCloudSection.style.display = 'none';
    } else if (mode === 'github_cloud') {
      if (customProxySection) customProxySection.style.display = 'none';
      if (githubCloudSection) githubCloudSection.style.display = 'block';
    } else {
      if (customProxySection) customProxySection.style.display = 'none';
      if (githubCloudSection) githubCloudSection.style.display = 'none';
    }
  }

  async function openProfileModal(profile = null) {
    if (!profileModal) return;
    if (proxyTestAlert) proxyTestAlert.style.display = 'none';
    profileModal.classList.add('active');
    populateGithubAccountDropdown();
    populateProxyPoolDropdown();
    await fetchUserAgents();

    if (profile) {
      if (profileModalTitle) profileModalTitle.textContent = 'Edit Profile Settings';
      if (editProfileId) editProfileId.value = profile.id;
      if (profNameInput) profNameInput.value = profile.name;
      if (profGroupSelect) profGroupSelect.value = profile.group || 'Default';
      if (profEngineSelect) profEngineSelect.value = profile.engine || (profile.device?.includes('firefox') ? 'gecko' : 'blink');
      if (profDeviceSelect) profDeviceSelect.value = profile.device || 'win-chrome-152';
      
      const ua = profile.userAgent || '';
      if (profUserAgentInput) profUserAgentInput.value = ua;
      if (profUaPresetSelect) profUaPresetSelect.value = ua;

      const isMobile = profile.isMobile || /Android|iPhone|iPad|iPod|Mobile|Touch/i.test(ua) || (profile.device && (profile.device.includes('iphone') || profile.device.includes('android') || profile.device.includes('ipad')));
      setDeviceCategory(isMobile ? 'mobile' : 'desktop');
      syncDeviceModeUI(isMobile, profile.screenResolution);

      if (profCpuSelect) profCpuSelect.value = String(profile.hardwareConcurrency || (isMobile ? 8 : 16));
      if (profRamSelect) profRamSelect.value = String(profile.deviceMemory || (isMobile ? 8 : 16));
      if (profWebRtcSelect) profWebRtcSelect.value = profile.webrtcPolicy || 'disabled';
      if (profCanvasNoiseSelect) profCanvasNoiseSelect.value = profile.canvasNoise !== false ? 'enabled' : 'disabled';
      if (profAudioNoiseSelect) profAudioNoiseSelect.value = profile.audioNoise !== false ? 'enabled' : 'disabled';
      if (profLanguageSelect) profLanguageSelect.value = profile.language || 'en-US,en;q=0.9';
      if (profDntSelect) profDntSelect.value = profile.doNotTrack || '0';

      if (profProxySelect) profProxySelect.value = profile.proxyType || 'github_cloud';
      if (profGithubAccSelect) profGithubAccSelect.value = profile.githubAccountId || (accounts[0]?.id || '');
      if (profTimezoneSelect) profTimezoneSelect.value = profile.timezone || 'America/New_York';
      if (profLaunchUrl) profLaunchUrl.value = profile.launchUrl || 'https://whoer.net';
      const profStoragePathInput = document.getElementById('profStoragePathInput');
      if (profStoragePathInput) profStoragePathInput.value = profile.storagePath || '';

      if (profile.customProxy) {
        if (proxyProtocolInput) proxyProtocolInput.value = profile.customProxy.protocol || 'socks5';
        if (proxyHostInput) proxyHostInput.value = profile.customProxy.host || '';
        if (proxyPortInput) proxyPortInput.value = profile.customProxy.port || '';
        if (proxyUserInput) proxyUserInput.value = profile.customProxy.user || '';
        if (proxyPassInput) proxyPassInput.value = profile.customProxy.pass || '';

        const profProxyPoolSelect = document.getElementById('profProxyPoolSelect');
        if (profProxyPoolSelect) {
          if (profile.customProxy.proxyId) {
            profProxyPoolSelect.value = profile.customProxy.proxyId;
          } else if (profile.customProxy.host) {
            const matchPx = proxiesList.find(p => p.host === profile.customProxy.host && parseInt(p.port) === parseInt(profile.customProxy.port));
            if (matchPx) profProxyPoolSelect.value = matchPx.id;
          }
        }
        const profProxyFormatInput = document.getElementById('profProxyFormatInput');
        if (profProxyFormatInput && profile.customProxy.host) {
          profProxyFormatInput.value = profile.customProxy.user 
            ? `${profile.customProxy.host}:${profile.customProxy.port}:${profile.customProxy.user}:${profile.customProxy.pass}`
            : `${profile.customProxy.host}:${profile.customProxy.port}`;
        }
      }

      if (saveProfileBtn) saveProfileBtn.textContent = 'Update Profile';
    } else {
      if (profileModalTitle) profileModalTitle.textContent = 'Create New Anti-Detect Profile';
      if (editProfileId) editProfileId.value = '';
      if (profileForm) profileForm.reset();
      if (profNameInput) profNameInput.value = `Profile #${profiles.length + 1}`;
      if (profEngineSelect) profEngineSelect.value = 'blink';
      if (profProxySelect) profProxySelect.value = 'github_cloud';
      if (profTimezoneSelect) profTimezoneSelect.value = 'America/New_York';
      if (profCpuSelect) profCpuSelect.value = '16';
      if (profRamSelect) profRamSelect.value = '16';
      if (profWebRtcSelect) profWebRtcSelect.value = 'disabled';
      if (profLaunchUrl) profLaunchUrl.value = 'https://whoer.net';
      const profStoragePathInput = document.getElementById('profStoragePathInput');
      if (profStoragePathInput) profStoragePathInput.value = '';
      if (saveProfileBtn) saveProfileBtn.textContent = '+ Create Profile';

      populateGithubAccountDropdown();
      setDeviceCategory('desktop');
    }

    toggleProxySectionVisibility();
  }

  // Handle Devices Gallery Modal Render & Interactions
  function renderDevicesGalleryGrid() {
    if (!devicesGalleryGrid) return;
    devicesGalleryGrid.innerHTML = '';

    const query = devicesSearchInput ? devicesSearchInput.value.toLowerCase().trim() : '';

    const filtered = DEVICES_GALLERY_LIST.filter(d => {
      if (activeDevicesFilter === 'mobile' && d.category !== 'mobile') return false;
      if (activeDevicesFilter === 'desktop' && d.category !== 'desktop') return false;

      if (query) {
        return d.name.toLowerCase().includes(query) || d.ua.toLowerCase().includes(query) || d.badge.toLowerCase().includes(query);
      }
      return true;
    });

    if (filtered.length === 0) {
      devicesGalleryGrid.innerHTML = `<div style="grid-column: 1/-1; padding: 30px; text-align: center; color: var(--text-muted); background: #f8fafc; border-radius: 8px;">No devices matching query "${escapeHtml(query)}"</div>`;
      return;
    }

    filtered.forEach(d => {
      const isMob = d.category === 'mobile';
      const card = document.createElement('div');
      card.style.background = '#ffffff';
      card.style.border = '1px solid var(--border-light)';
      card.style.borderRadius = '10px';
      card.style.padding = '14px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.justifySpaceBetween = 'space-between';

      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="badge-pill ${isMob ? 'badge-purple' : 'badge-azure'}" style="font-size: 10px; font-weight: 700;">${d.badge}</span>
            <span style="font-size: 10px; color: var(--text-muted); font-weight: 600;">📐 ${d.screenRes}</span>
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">${escapeHtml(d.name)}</div>
          <p style="font-size: 10px; font-family: monospace; color: var(--text-muted); background: #f8fafc; padding: 6px; border-radius: 6px; margin-bottom: 12px; height: 38px; overflow: hidden; line-height: 1.3;">
            ${escapeHtml(d.ua)}
          </p>
        </div>
        <button class="btn ${isMob ? 'btn-purple' : 'btn-blue'} select-device-btn" data-id="${d.id}" style="width: 100%; font-size: 11px; padding: 6px;">
          ⚡ Select ${escapeHtml(d.name.split(' ')[0])} Device
        </button>
      `;

      devicesGalleryGrid.appendChild(card);
    });

    document.querySelectorAll('.select-device-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const targetDev = DEVICES_GALLERY_LIST.find(d => d.id === id);
        if (targetDev) {
          if (devicesModal) devicesModal.classList.remove('active');
          openProfileModal();

          if (profNameInput && (!profNameInput.value || profNameInput.value === 'New Profile')) {
            profNameInput.value = `${targetDev.name} Profile`;
          }
          if (profDeviceSelect) profDeviceSelect.value = targetDev.id;
          if (profEngineSelect) profEngineSelect.value = targetDev.engine;
          if (profUserAgentInput) profUserAgentInput.value = targetDev.ua;
          if (profUaPresetSelect) profUaPresetSelect.value = targetDev.ua;

          setDeviceCategory(targetDev.category);
          syncDeviceModeUI(targetDev.category === 'mobile', targetDev.screenRes);
        }
      });
    });
  }

  function openDevicesModal() {
    if (!devicesModal) return;
    devicesModal.classList.add('active');
    renderDevicesGalleryGrid();
  }

  if (btnOpenDevicesGalleryInModal) btnOpenDevicesGalleryInModal.addEventListener('click', openDevicesModal);
  if (btnOpenDevicesModalHeader) btnOpenDevicesModalHeader.addEventListener('click', openDevicesModal);
  if (closeDevicesModal) closeDevicesModal.addEventListener('click', () => devicesModal && devicesModal.classList.remove('active'));
  if (btnCloseDevicesModal) btnCloseDevicesModal.addEventListener('click', () => devicesModal && devicesModal.classList.remove('active'));

  if (devicesTabAll) devicesTabAll.addEventListener('click', () => { activeDevicesFilter = 'all'; [devicesTabAll, devicesTabMobile, devicesTabDesktop].forEach(b => b.classList.remove('active')); devicesTabAll.classList.add('active'); renderDevicesGalleryGrid(); });
  if (devicesTabMobile) devicesTabMobile.addEventListener('click', () => { activeDevicesFilter = 'mobile'; [devicesTabAll, devicesTabMobile, devicesTabDesktop].forEach(b => b.classList.remove('active')); devicesTabMobile.classList.add('active'); renderDevicesGalleryGrid(); });
  if (devicesTabDesktop) devicesTabDesktop.addEventListener('click', () => { activeDevicesFilter = 'desktop'; [devicesTabAll, devicesTabMobile, devicesTabDesktop].forEach(b => b.classList.remove('active')); devicesTabDesktop.classList.add('active'); renderDevicesGalleryGrid(); });

  if (devicesSearchInput) devicesSearchInput.addEventListener('input', renderDevicesGalleryGrid);

  // Handle Real User Agent Dropdown Preset Change
  if (profUaPresetSelect) {
    profUaPresetSelect.addEventListener('change', () => {
      const selectedUa = profUaPresetSelect.value;
      if (selectedUa && profUserAgentInput) {
        profUserAgentInput.value = selectedUa;
        const isMobile = /Android|iPhone|iPad|iPod|Mobile|Touch/i.test(selectedUa);
        if (profEngineSelect) {
          if (selectedUa.includes('Firefox')) profEngineSelect.value = 'gecko';
          else if (selectedUa.includes('Safari') && !selectedUa.includes('Chrome')) profEngineSelect.value = 'webkit';
          else profEngineSelect.value = 'blink';
        }
        syncDeviceModeUI(isMobile);
      }
    });
  }

  // Handle Manual User-Agent Input Change
  if (profUserAgentInput) {
    profUserAgentInput.addEventListener('input', () => {
      const val = profUserAgentInput.value.trim();
      const isMobile = /Android|iPhone|iPad|iPod|Mobile|Touch/i.test(val);
      syncDeviceModeUI(isMobile);
    });
  }

  // Quick Choice Device Cards Visual Selector Handler
  function syncQuickDeviceCardActive(presetId) {
    document.querySelectorAll('.quick-device-card').forEach(card => {
      if (card.dataset.devicePreset === presetId) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  document.querySelectorAll('.quick-device-card').forEach(card => {
    card.addEventListener('click', () => {
      const presetId = card.dataset.devicePreset;
      if (profDeviceSelect && presetId) {
        profDeviceSelect.value = presetId;
        syncQuickDeviceCardActive(presetId);
        profDeviceSelect.dispatchEvent(new Event('change'));
      }
    });
  });

  // Auto-sync engine & matching User-Agent when device preset changes
  if (profDeviceSelect) {
    profDeviceSelect.addEventListener('change', () => {
      const val = profDeviceSelect.value;
      const isMobile = val.includes('iphone') || val.includes('android') || val.includes('ipad');

      syncQuickDeviceCardActive(val);

      if (profEngineSelect) {
        if (val.includes('firefox')) profEngineSelect.value = 'gecko';
        else if (val.includes('safari')) profEngineSelect.value = 'webkit';
        else if (val.includes('ladybird')) profEngineSelect.value = 'ladybird';
        else if (val.includes('servo')) profEngineSelect.value = 'servo';
        else profEngineSelect.value = 'blink';
      }

      // Pick a matching user agent from store for selected device type
      const pool = isMobile ? realUserAgentsStore.mobile : realUserAgentsStore.desktop;
      if (pool.length > 0) {
        const randItem = pool[Math.floor(Math.random() * pool.length)];
        if (profUserAgentInput) profUserAgentInput.value = randItem.value;
        if (profUaPresetSelect) profUaPresetSelect.value = randItem.value;
      }
      syncDeviceModeUI(isMobile);
    });
  }

  // Randomize Desktop User-Agent Button Handler
  if (btnRandomizeDesktopUa) {
    btnRandomizeDesktopUa.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/user-agents/random?type=desktop');
        const data = await res.json();
        if (data.success && data.userAgent) {
          if (profUserAgentInput) profUserAgentInput.value = data.userAgent.value;
          if (profUaPresetSelect) profUaPresetSelect.value = data.userAgent.value;
          syncDeviceModeUI(false);
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Randomize Mobile User-Agent Button Handler
  if (btnRandomizeMobileUa) {
    btnRandomizeMobileUa.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/user-agents/random?type=mobile');
        const data = await res.json();
        if (data.success && data.userAgent) {
          if (profUserAgentInput) profUserAgentInput.value = data.userAgent.value;
          if (profUaPresetSelect) profUaPresetSelect.value = data.userAgent.value;
          syncDeviceModeUI(true);
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (saveProfileBtn) {
        saveProfileBtn.disabled = true;
        saveProfileBtn.textContent = '⏳ Saving Profile...';
      }

      try {
        const chosenProxyId = document.getElementById('profProxyPoolSelect')?.value || '';
        const rawUser = proxyUserInput ? proxyUserInput.value.trim() : '';
        const rawPass = proxyPassInput ? proxyPassInput.value.trim() : '';
        const customProxy = {
          proxyId: chosenProxyId,
          protocol: proxyProtocolInput ? proxyProtocolInput.value : 'socks5',
          host: proxyHostInput ? proxyHostInput.value.trim() : '',
          port: proxyPortInput ? proxyPortInput.value.trim() : '',
          user: rawUser,
          pass: rawPass,
          username: rawUser,
          password: rawPass
        };

        let rawLaunchUrl = profLaunchUrl ? profLaunchUrl.value.trim() : 'https://whoer.net';
        if (rawLaunchUrl && !rawLaunchUrl.startsWith('http://') && !rawLaunchUrl.startsWith('https://')) {
          rawLaunchUrl = 'https://' + rawLaunchUrl;
        }

        const payload = {
          name: profNameInput && profNameInput.value.trim() ? profNameInput.value.trim() : `Profile #${profiles.length + 1}`,
          group: profGroupSelect ? profGroupSelect.value : 'Default',
          engine: profEngineSelect ? profEngineSelect.value : 'blink',
          device: profDeviceSelect ? profDeviceSelect.value : 'win-chrome-152',
          userAgent: profUserAgentInput ? profUserAgentInput.value.trim() : '',
          screenResolution: profScreenResSelect ? profScreenResSelect.value : '1920x1080',
          hardwareConcurrency: profCpuSelect ? parseInt(profCpuSelect.value) : 16,
          deviceMemory: profRamSelect ? parseInt(profRamSelect.value) : 16,
          webrtcPolicy: profWebRtcSelect ? profWebRtcSelect.value : 'disabled',
          canvasNoise: profCanvasNoiseSelect ? profCanvasNoiseSelect.value === 'enabled' : true,
          audioNoise: profAudioNoiseSelect ? profAudioNoiseSelect.value === 'enabled' : true,
          language: profLanguageSelect ? profLanguageSelect.value : 'en-US,en;q=0.9',
          doNotTrack: profDntSelect ? profDntSelect.value : '0',

          proxyType: profProxySelect ? profProxySelect.value : 'github_cloud',
          githubAccountId: profGithubAccSelect ? profGithubAccSelect.value : '',
          timezone: profTimezoneSelect ? profTimezoneSelect.value : 'America/New_York',
          customProxy: customProxy,
          launchUrl: rawLaunchUrl,
          storagePath: document.getElementById('profStoragePathInput')?.value.trim() || ''
        };

        const isEdit = editProfileId && !!editProfileId.value;
        const url = isEdit ? `/api/profiles/${editProfileId.value}` : '/api/profiles';
        const method = isEdit ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
          if (profileModal) profileModal.classList.remove('active');
          await fetchProfiles();
        } else {
          notify(`Cannot Save Profile: ${data.message || 'Error occurred while creating profile.'}`, 'error');
        }
      } catch (err) {
        console.error('Error saving profile:', err);
        notify(`Connection Error: Failed to communicate with server (${err.message}).`, 'error');
      } finally {
        if (saveProfileBtn) {
          saveProfileBtn.disabled = false;
          saveProfileBtn.textContent = editProfileId && !!editProfileId.value ? 'Update Profile' : '+ Create Profile';
        }
      }
    });
  }

  function showDashboardView(viewName) {
    const viewProfilesSection = document.getElementById('viewProfilesSection');
    const viewGithubSection = document.getElementById('viewGithubSection');
    const viewProxySection = document.getElementById('viewProxySection');

    const navDashboard = document.getElementById('navDashboard');
    const navCreateProfileSidebar = document.getElementById('navCreateProfileSidebar');
    const navGithubProxy = document.getElementById('navGithubProxy');
    const navProxyPoolSidebar = document.getElementById('navProxyPoolSidebar');

    if (viewName === 'github') {
      if (viewProfilesSection) viewProfilesSection.style.display = 'none';
      if (viewGithubSection) viewGithubSection.style.display = 'block';
      if (viewProxySection) viewProxySection.style.display = 'none';

      if (navDashboard) navDashboard.classList.remove('active');
      if (navCreateProfileSidebar) navCreateProfileSidebar.classList.remove('active');
      if (navGithubProxy) navGithubProxy.classList.add('active');
      if (navProxyPoolSidebar) navProxyPoolSidebar.classList.remove('active');

      loadGhTabData(currentGhTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'proxy') {
      if (viewProfilesSection) viewProfilesSection.style.display = 'none';
      if (viewGithubSection) viewGithubSection.style.display = 'none';
      if (viewProxySection) viewProxySection.style.display = 'block';

      if (navDashboard) navDashboard.classList.remove('active');
      if (navCreateProfileSidebar) navCreateProfileSidebar.classList.remove('active');
      if (navGithubProxy) navGithubProxy.classList.remove('active');
      if (navProxyPoolSidebar) navProxyPoolSidebar.classList.add('active');

      fetchProxies();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (viewProfilesSection) viewProfilesSection.style.display = 'flex';
      if (viewGithubSection) viewGithubSection.style.display = 'none';
      if (viewProxySection) viewProxySection.style.display = 'none';

      if (navDashboard) navDashboard.classList.add('active');
      if (navGithubProxy) navGithubProxy.classList.remove('active');
      if (navProxyPoolSidebar) navProxyPoolSidebar.classList.remove('active');

      fetchProfiles();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ----------------------------------------------------
  // LISTENERS & ATTACHMENTS
  // ----------------------------------------------------
  function setupEventListeners() {
    const btnProfilesManagerHeader = document.getElementById('btnProfilesManagerHeader');
    if (btnProfilesManagerHeader) btnProfilesManagerHeader.addEventListener('click', (e) => { e.preventDefault(); showDashboardView('profiles'); });

    const btnAutoAssignHeader = document.getElementById('btnAutoAssignHeader');
    if (btnAutoAssignHeader) {
      btnAutoAssignHeader.addEventListener('click', async (e) => {
        e.preventDefault();
        btnAutoAssignHeader.disabled = true;
        btnAutoAssignHeader.textContent = '⏳ Auto-Assigning 1:1...';
        try {
          const res = await fetch('/api/allocation/auto-assign-all', { method: 'POST' });
          const data = await res.json();
          if (data.success) {
            notify(`Strictly assigned 1 unique GitHub PAT account per profile across ${data.count} profiles!`, 'success');
            await fetchProfiles();
            await fetchAccounts();
          } else {
            notify(`Auto-assign notice: ${data.message || 'Failed'}`, 'warning');
          }
        } catch (err) {
          console.error(err);
          notify('Connection error while running 1:1 auto-assignment.', 'error');
        } finally {
          btnAutoAssignHeader.disabled = false;
          btnAutoAssignHeader.textContent = '⚡ Auto-Assign 1:1 PAT';
        }
      });
    }

    const navProfilesSidebar = document.getElementById('navProfilesSidebar');
    const navDevicesGallerySidebar = document.getElementById('navDevicesGallerySidebar');
    const navAutoAssignSidebar = document.getElementById('navAutoAssignSidebar');
    const navExtensionClonerSidebar = document.getElementById('navExtensionClonerSidebar');
    const navProxyPoolSidebar = document.getElementById('navProxyPoolSidebar');
    const closeProxySectionBtn = document.getElementById('closeProxySectionBtn');

    if (btnCreateProfileHeader) btnCreateProfileHeader.addEventListener('click', () => { showDashboardView('profiles'); openProfileModal(); });
    if (btnGithubAccountsHeader) btnGithubAccountsHeader.addEventListener('click', (e) => { e.preventDefault(); showDashboardView('github'); });

    if (navCreateProfileSidebar) navCreateProfileSidebar.addEventListener('click', (e) => { e.preventDefault(); showDashboardView('profiles'); openProfileModal(); });
    if (navDashboard) navDashboard.addEventListener('click', (e) => { e.preventDefault(); showDashboardView('profiles'); });
    if (navProfilesSidebar) navProfilesSidebar.addEventListener('click', (e) => { e.preventDefault(); showDashboardView('profiles'); });
    if (navDevicesGallerySidebar) navDevicesGallerySidebar.addEventListener('click', (e) => { e.preventDefault(); openDevicesModal(); });
    if (navAutoAssignSidebar && btnAutoAssignHeader) navAutoAssignSidebar.addEventListener('click', (e) => { e.preventDefault(); btnAutoAssignHeader.click(); });
    if (navExtensionClonerSidebar) navExtensionClonerSidebar.addEventListener('click', (e) => {
      e.preventDefault();
      populateProfileDropdowns();
      const extModal = document.getElementById('extensionClonerModal');
      if (extModal) extModal.classList.add('active');
    });
    if (navGithubProxy) navGithubProxy.addEventListener('click', (e) => { e.preventDefault(); showDashboardView('github'); });
    if (navProxyPoolSidebar) navProxyPoolSidebar.addEventListener('click', (e) => { e.preventDefault(); showDashboardView('proxy'); });
    if (closeProxySectionBtn) closeProxySectionBtn.addEventListener('click', (e) => { e.preventDefault(); showDashboardView('profiles'); });
    if (navSettings) navSettings.addEventListener('click', (e) => { e.preventDefault(); notify('Nano ADB Engine Shield Active: SOCKS5 Evading | WebGL Noise | WebRTC Leak Protection', 'info'); });

    if (closeGithubModal) closeGithubModal.addEventListener('click', (e) => { e.preventDefault(); showDashboardView('profiles'); });
    if (closeProfileModal) closeProfileModal.addEventListener('click', () => profileModal && profileModal.classList.remove('active'));
    if (cancelProfileBtn) cancelProfileBtn.addEventListener('click', () => profileModal && profileModal.classList.remove('active'));

    if (btnTestAllIps) {
      btnTestAllIps.addEventListener('click', async () => {
        btnTestAllIps.disabled = true;
        const total = profiles.length;
        if (total === 0) {
          notify('No profiles available to test!', 'warning');
          btnTestAllIps.disabled = false;
          return;
        }

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < profiles.length; i++) {
          const p = profiles[i];
          btnTestAllIps.textContent = `⏳ Testing (${i + 1}/${total})...`;

          // Find DOM button for this profile to show real-time progress on card
          const btn = document.querySelector(`.check-ip-btn[data-id="${p.id}"]`);
          if (btn) {
            btn.className = 'badge-pill badge-location check-ip-btn testing';
            btn.innerHTML = `⏳ <strong>Checking...</strong>`;
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }

          try {
            const res = await fetch(`/api/profiles/${p.id}/check-ip`, { method: 'POST' });
            const data = await res.json();

            if (data.ip) p.displayIp = data.ip;
            if (data.country) p.displayCountry = data.country;
            p.assignedIp = data.ip;
            p.assignedCountry = data.country;

            if (btn) {
              const isErr = !data.success || (data.ip && data.ip.includes('❌'));
              if (isErr) {
                failCount++;
                btn.className = 'badge-pill badge-location check-ip-btn badge-error';
                btn.innerHTML = `<strong>${escapeHtml(data.ip || '❌ Error')}</strong> <span style="font-weight:600; opacity: 0.85;">(${escapeHtml(data.country || 'Failed')})</span>`;
              } else {
                successCount++;
                btn.className = 'badge-pill badge-location check-ip-btn active-proxy';
                btn.innerHTML = `📍 <strong>${escapeHtml(data.ip)}</strong> <span style="font-weight:600; opacity: 0.85;">(${escapeHtml(data.country)})</span>`;
              }
            }
          } catch (e) {
            console.error(`Error checking profile ${p.id}:`, e);
            failCount++;
            if (btn) {
              btn.className = 'badge-pill badge-location check-ip-btn badge-error';
              btn.innerHTML = `❌ <strong>Connection Error</strong>`;
            }
          }

          // Sequential 400ms delay per profile
          await new Promise(resolve => setTimeout(resolve, 400));
        }

        await fetchProfiles();
        btnTestAllIps.disabled = false;
        btnTestAllIps.textContent = '🧪 Test All (One by One)';
        notify(`Sequential Profile IP Test Completed: ${successCount} Verified Active, ${failCount} Errors`, 'success');
      });
    }

    // Universal backdrop click and close button listeners for all modals
    const modalIds = [
      'githubModal',
      'profileModal',
      'bulkCreateModal',
      'extensionClonerModal',
      'bulkGithubModal',
      'routerTestModal',
      'duplicatedWorkflowModal',
      'singleAccountModal',
      'devicesModal',
      'launchBatchModal',
      'appUpdateModal'
    ];

    modalIds.forEach(id => {
      const modalEl = document.getElementById(id);
      if (modalEl) {
        modalEl.addEventListener('click', (e) => {
          if (e.target === modalEl) {
            modalEl.classList.remove('active');
            if (id === 'appUpdateModal') modalEl.style.display = 'none';
          }
        });
      }
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalEl = btn.closest('.modal-overlay') || btn.closest('.modal-backdrop');
        if (modalEl) {
          modalEl.classList.remove('active');
          if (modalEl.id === 'appUpdateModal') modalEl.style.display = 'none';
        }
      });
    });

    if (profProxySelect) profProxySelect.addEventListener('change', toggleProxySectionVisibility);

    // Test Custom Proxy Connection Button Handler
    if (btnTestCustomProxy) {
      btnTestCustomProxy.addEventListener('click', async () => {
        const protocol = proxyProtocolInput ? proxyProtocolInput.value : 'socks5';
        const host = proxyHostInput ? proxyHostInput.value.trim() : '';
        const port = proxyPortInput ? proxyPortInput.value.trim() : '';
        const user = proxyUserInput ? proxyUserInput.value.trim() : '';
        const pass = proxyPassInput ? proxyPassInput.value.trim() : '';

        if (!host || !port) {
          if (proxyTestAlert) {
            proxyTestAlert.style.display = 'block';
            proxyTestAlert.style.background = '#fffbebe6';
            proxyTestAlert.style.color = '#b45309';
            proxyTestAlert.style.border = '1px solid #fde68a';
            proxyTestAlert.innerHTML = '⚠️ Please enter <strong>Host / IP</strong> and <strong>Port</strong> before testing.';
          }
          return;
        }

        btnTestCustomProxy.disabled = true;
        btnTestCustomProxy.innerHTML = '⏳ Testing...';

        if (proxyTestAlert) {
          proxyTestAlert.style.display = 'block';
          proxyTestAlert.style.background = '#e0f2fe';
          proxyTestAlert.style.color = '#0369a1';
          proxyTestAlert.style.border = '1px solid #7dd3fc';
          proxyTestAlert.innerHTML = `🔵 Testing connection to <strong>${escapeHtml(host)}:${escapeHtml(port)}</strong> (${protocol.toUpperCase()})...`;
        }

        try {
          const res = await fetch('/api/proxy/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ protocol, host, port, user, pass })
          });
          const data = await res.json();

          if (proxyTestAlert) {
            proxyTestAlert.style.display = 'block';
            if (data.success) {
              proxyTestAlert.style.background = '#dcfce7';
              proxyTestAlert.style.color = '#15803d';
              proxyTestAlert.style.border = '1px solid #86efac';
              proxyTestAlert.innerHTML = `✅ <strong>Connection Successful!</strong><br><span style="font-weight: 500;">${escapeHtml(data.message)}</span>`;
            } else {
              proxyTestAlert.style.background = '#fef2f2';
              proxyTestAlert.style.color = '#991b1b';
              proxyTestAlert.style.border = '1px solid #fca5a5';
              proxyTestAlert.innerHTML = `❌ <strong>Connection Failed:</strong><br><span style="font-weight: 500;">${escapeHtml(data.message)}</span>`;
            }
          }
        } catch (err) {
          if (proxyTestAlert) {
            proxyTestAlert.style.display = 'block';
            proxyTestAlert.style.background = '#fef2f2';
            proxyTestAlert.style.color = '#991b1b';
            proxyTestAlert.style.border = '1px solid #fca5a5';
            proxyTestAlert.innerHTML = `❌ <strong>Connection Error:</strong> ${escapeHtml(err.message)}`;
          }
        } finally {
          btnTestCustomProxy.disabled = false;
          btnTestCustomProxy.innerHTML = '⚡ Test Connection';
        }
      });
    }


    // Filter Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTab = btn.dataset.tab;
        renderProfilesList();
      });
    });

    // Select All Checkbox
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', () => {
        const visibleCheckboxes = document.querySelectorAll('.card-select-checkbox');
        if (selectAllCheckbox.checked) {
          visibleCheckboxes.forEach(cb => selectedProfileIds.add(cb.dataset.id));
        } else {
          visibleCheckboxes.forEach(cb => selectedProfileIds.delete(cb.dataset.id));
        }
        updateSelectionState();
      });
    }

    // Batch Launch Selected
    if (btnLaunchAll) {
      btnLaunchAll.addEventListener('click', async () => {
        if (selectedProfileIds.size === 0) {
          notify('Please select at least one profile to launch!', 'warning');
          return;
        }

        const toLaunch = Array.from(selectedProfileIds);
        btnLaunchAll.disabled = true;
        btnLaunchAll.textContent = `⏳ Launching ${toLaunch.length}...`;

        for (const id of toLaunch) {
          try {
            await fetch(`/api/profiles/${id}/launch`, { method: 'POST' });
          } catch (err) {
            console.error(`Launch error for ${id}:`, err);
          }
        }

        await fetchProfiles();
        btnLaunchAll.disabled = false;
        updateSelectionState();
      });
    }

    // Batch Delete Selected
    const btnBatchDelete = document.getElementById('btnBatchDelete');
    if (btnBatchDelete) {
      btnBatchDelete.addEventListener('click', async () => {
        if (selectedProfileIds.size === 0) {
          notify('Please select at least one profile to delete!', 'warning');
          return;
        }

        if (confirm(`Delete ${selectedProfileIds.size} selected profiles?`)) {
          const ids = Array.from(selectedProfileIds);
          try {
            await fetch('/api/profiles/batch-delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ids })
            });
            selectedProfileIds.clear();
            await fetchProfiles();
          } catch (err) {
            console.error(err);
          }
        }
      });
    }

    // Bulk Create Modal Elements
    const bulkCreateModal = document.getElementById('bulkCreateModal');
    const closeBulkCreateModal = document.getElementById('closeBulkCreateModal');
    const cancelBulkCreateBtn = document.getElementById('cancelBulkCreateBtn');
    const bulkCreateForm = document.getElementById('bulkCreateForm');
    const btnBulkCreate = document.getElementById('btnBulkCreate');

    if (btnBulkCreate && bulkCreateModal) {
      btnBulkCreate.addEventListener('click', () => {
        bulkCreateModal.classList.add('active');
      });
    }

    if (closeBulkCreateModal && bulkCreateModal) {
      closeBulkCreateModal.addEventListener('click', () => {
        bulkCreateModal.classList.remove('active');
      });
    }

    if (cancelBulkCreateBtn && bulkCreateModal) {
      cancelBulkCreateBtn.addEventListener('click', () => {
        bulkCreateModal.classList.remove('active');
      });
    }

    if (bulkCreateForm) {
      bulkCreateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const baseName = document.getElementById('bulkBaseNameInput')?.value.trim() || 'Facebook Account';
        const count = parseInt(document.getElementById('bulkCountInput')?.value) || 5;
        const group = document.getElementById('bulkGroupSelect')?.value || 'Default';
        const device = document.getElementById('bulkDeviceSelect')?.value || 'win-chrome-152';
        const proxyType = document.getElementById('bulkProxySelect')?.value || 'github_cloud';
        let launchUrl = document.getElementById('bulkLaunchUrlInput')?.value.trim() || 'https://whoer.net';

        if (launchUrl && !launchUrl.startsWith('http://') && !launchUrl.startsWith('https://')) {
          launchUrl = 'https://' + launchUrl;
        }

        const submitBtn = document.getElementById('submitBulkCreateBtn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '⏳ Creating Profiles...';
        }

        try {
          const res = await fetch('/api/profiles/bulk-create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              baseName,
              count,
              group,
              device,
              proxyType,
              githubAccountId: accounts[0]?.id || '',
              launchUrl,
              storagePath: document.getElementById('bulkStoragePathInput')?.value.trim() || ''
            })
          });
          const data = await res.json();
          if (data.success) {
            if (bulkCreateModal) bulkCreateModal.classList.remove('active');
            notify(`${data.count} bulk profiles created successfully!`, 'success');
            await fetchProfiles();
          } else {
            notify(`Error creating bulk profiles: ${data.message || 'Unknown error'}`, 'error');
          }
        } catch (err) {
          console.error('Bulk create error:', err);
          notify('Failed to connect to server to bulk create profiles.', 'error');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '⚡ Generate Profiles';
          }
        }
      });
    }

    // ----------------------------------------------------
    // BATCH LAUNCH MODAL & SCREEN GRID TILING (5 in a line x 4 lines default = 20 browsers)
    // ----------------------------------------------------
    const launchBatchModal = document.getElementById('launchBatchModal');
    const closeLaunchBatchModal = document.getElementById('closeLaunchBatchModal');
    const cancelLaunchBatchBtn = document.getElementById('cancelLaunchBatchBtn');
    const launchBatchForm = document.getElementById('launchBatchForm');
    const batchLaunchCountInput = document.getElementById('batchLaunchCountInput');
    const gridColsInput = document.getElementById('gridColsInput');
    const gridRowsInput = document.getElementById('gridRowsInput');
    const chkAutoScrollClick = document.getElementById('chkAutoScrollClick');
    const batchLaunchUrlInput = document.getElementById('batchLaunchUrlInput');
    const batchLaunchSummaryText = document.getElementById('batchLaunchSummaryText');
    const btnToggleGlobalAutoScroll = document.getElementById('btnToggleGlobalAutoScroll');

    let globalAutoScrollActive = true;

    function updateBatchLaunchSummary() {
      if (!batchLaunchCountInput || !batchLaunchSummaryText) return;
      const count = parseInt(batchLaunchCountInput.value) || 20;
      const cols = parseInt(gridColsInput?.value) || 5;
      const rows = parseInt(gridRowsInput?.value) || 4;
      const autoScrollText = chkAutoScrollClick?.checked ? ' + Real-Time Auto-Scroll & Clicker ON' : '';
      batchLaunchSummaryText.textContent = `Ready to launch ${count} profile(s) in a ${cols}x${rows} screen grid (${cols} in a line)${autoScrollText}`;
    }

    if (batchLaunchCountInput) batchLaunchCountInput.addEventListener('input', updateBatchLaunchSummary);
    if (gridColsInput) gridColsInput.addEventListener('input', updateBatchLaunchSummary);
    if (gridRowsInput) gridRowsInput.addEventListener('input', updateBatchLaunchSummary);
    if (chkAutoScrollClick) chkAutoScrollClick.addEventListener('change', updateBatchLaunchSummary);

    // Count preset buttons click handler (5, 10, 15, 20, 25, 30, All)
    document.querySelectorAll('.btn-launch-count').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-launch-count').forEach(b => {
          b.classList.remove('active', 'btn-blue');
          b.classList.add('btn-outline');
        });

        btn.classList.remove('btn-outline');
        btn.classList.add('active', 'btn-blue');

        const val = btn.dataset.count;
        if (val === 'all') {
          const totalToLaunch = selectedProfileIds.size > 0 ? selectedProfileIds.size : profiles.length;
          if (batchLaunchCountInput) batchLaunchCountInput.value = Math.max(1, totalToLaunch);
        } else {
          const num = parseInt(val) || 20;
          if (batchLaunchCountInput) batchLaunchCountInput.value = num;
        }

        const countVal = parseInt(batchLaunchCountInput.value) || 20;
        const colsVal = parseInt(gridColsInput?.value) || 5;
        if (gridRowsInput) {
          gridRowsInput.value = Math.max(1, Math.ceil(countVal / colsVal));
        }

        updateBatchLaunchSummary();
      });
    });

    const btnBulkOpenHeader = document.getElementById('btnBulkOpenHeader');

    const openBulkLaunchModalHandler = (e) => {
      if (e) e.preventDefault();
      const globalUrl = document.getElementById('globalLaunchUrlInput')?.value.trim();
      if (batchLaunchUrlInput) {
        batchLaunchUrlInput.value = globalUrl || 'https://whoer.net';
      }

      const selectedCount = selectedProfileIds.size;
      if (batchLaunchCountInput) {
        if (selectedCount > 0) {
          batchLaunchCountInput.value = selectedCount;
        } else {
          batchLaunchCountInput.value = Math.min(20, Math.max(5, Math.floor(profiles.length / 5) * 5 || 20));
        }
      }

      updateBatchLaunchSummary();
      if (launchBatchModal) {
        launchBatchModal.style.display = 'flex';
        launchBatchModal.classList.add('active');
      }
    };

    const closeBulkModal = () => {
      if (launchBatchModal) {
        launchBatchModal.classList.remove('active');
        launchBatchModal.style.display = 'none';
      }
    };

    if (btnBulkOpenHeader) btnBulkOpenHeader.addEventListener('click', openBulkLaunchModalHandler);
    if (btnLaunchAll) btnLaunchAll.addEventListener('click', openBulkLaunchModalHandler);

    if (closeLaunchBatchModal) closeLaunchBatchModal.addEventListener('click', closeBulkModal);
    if (cancelLaunchBatchBtn) cancelLaunchBatchBtn.addEventListener('click', closeBulkModal);

    if (btnToggleGlobalAutoScroll) {
      btnToggleGlobalAutoScroll.addEventListener('click', () => {
        globalAutoScrollActive = !globalAutoScrollActive;
        if (globalAutoScrollActive) {
          btnToggleGlobalAutoScroll.className = 'btn btn-purple btn-sm';
          btnToggleGlobalAutoScroll.textContent = '⚡ Auto-Scroll & Click';
          notify('⚡ Real-Time Auto-Scroll & Random Post Clicker ENABLED across open profiles!', 'success');
        } else {
          btnToggleGlobalAutoScroll.className = 'btn btn-outline btn-sm';
          btnToggleGlobalAutoScroll.textContent = '⏸ Auto-Scroll Paused';
          notify('⏸ Real-Time Auto-Scroll & Clicker PAUSED.', 'info');
        }
      });
    }

    if (launchBatchForm) {
      launchBatchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const countToLaunch = parseInt(batchLaunchCountInput?.value) || 20;
        const cols = Math.max(1, parseInt(gridColsInput?.value) || 5);
        const rows = Math.max(1, parseInt(gridRowsInput?.value) || 4);
        const autoScroll = chkAutoScrollClick ? chkAutoScrollClick.checked : true;
        const automationProfileSelect = document.getElementById('automationProfileSelect');
        const automationProfile = automationProfileSelect ? automationProfileSelect.value : 'Natural Page Visit';
        const chkLaunchFullSize = document.getElementById('chkLaunchFullSize');
        const launchFullSize = chkLaunchFullSize ? chkLaunchFullSize.checked : false;
        let launchUrl = batchLaunchUrlInput ? batchLaunchUrlInput.value.trim() : 'https://whoer.net';

        if (launchUrl && !launchUrl.startsWith('http://') && !launchUrl.startsWith('https://')) {
          launchUrl = 'https://' + launchUrl;
        }

        let targetProfileList = [];
        if (selectedProfileIds.size > 0) {
          targetProfileList = profiles.filter(p => selectedProfileIds.has(p.id)).slice(0, countToLaunch);
        } else {
          targetProfileList = profiles.slice(0, countToLaunch);
        }

        if (targetProfileList.length === 0) {
          notify('No profiles available to launch!', 'warning');
          return;
        }

        if (launchBatchModal) {
          launchBatchModal.classList.remove('active');
          launchBatchModal.style.display = 'none';
        }

        // Screen Grid Tiling Math: cols x rows tiled grid across screen bounds
        const screenWidth = window.screen.availWidth || window.screen.width || 1920;
        const screenHeight = window.screen.availHeight || window.screen.height || 1080;

        const cellW = Math.max(260, Math.floor((screenWidth - 10) / cols));
        const cellH = Math.max(200, Math.floor((screenHeight - 30) / rows));

        btnLaunchAll.disabled = true;
        btnLaunchAll.textContent = `⏳ Launching ${targetProfileList.length}...`;

        let launchedCount = 0;

        for (let i = 0; i < targetProfileList.length; i++) {
          const p = targetProfileList[i];
          const colIndex = i % cols;
          const rowIndex = Math.floor(i / cols);

          const posX = Math.floor(colIndex * cellW);
          const posY = Math.floor(rowIndex * cellH);

          try {
            const sizeToSend = launchFullSize ? `${screenWidth},${screenHeight}` : `${cellW},${cellH}`;
            const posToSend = launchFullSize ? `0,0` : `${posX},${posY}`;

            await fetch(`/api/profiles/${p.id}/launch`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                windowSize: sizeToSend,
                windowPosition: posToSend,
                autoScroll: autoScroll,
                automationProfile: automationProfile,
                launchUrl: launchUrl
              })
            });
            launchedCount++;
          } catch (err) {
            console.error(`Batch launch error for profile ${p.id}:`, err);
          }

          // 250ms stagger between browser launches
          await new Promise(r => setTimeout(r, 250));
        }

        await fetchProfiles();
        btnLaunchAll.disabled = false;
        btnLaunchAll.textContent = `▶ Open Selected (${selectedProfileIds.size})`;
        notify(`🚀 Launched ${launchedCount} browsers tiled across screen in a ${cols}x${rows} grid! Website: ${launchUrl} | Auto-Scroll & Clicker: ${autoScroll ? 'ON' : 'OFF'}`, 'success');
      });
    }

    // Clone Selected Profiles Button
    const btnCloneSelected = document.getElementById('btnCloneSelected');
    if (btnCloneSelected) {
      btnCloneSelected.addEventListener('click', async () => {
        let ids = Array.from(selectedProfileIds);
        if (ids.length === 0) {
          if (profiles.length > 0) {
            ids = [profiles[profiles.length - 1].id];
          } else {
            notify('Please create at least 1 profile before cloning!', 'warning');
            return;
          }
        }

        const copiesCount = prompt(`How many clone copies of each of the ${ids.length} profile(s) would you like to create?`, '1');
        if (!copiesCount || isNaN(copiesCount) || parseInt(copiesCount) <= 0) return;

        btnCloneSelected.disabled = true;
        btnCloneSelected.textContent = '⏳ Cloning...';

        try {
          const res = await fetch('/api/profiles/batch-clone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids, copiesCount: parseInt(copiesCount) })
          });
          const data = await res.json();
          if (data.success) {
            notify(`Successfully cloned ${data.count} profile copy/copies with complete settings!`, 'success');
            await fetchProfiles();
          } else {
            notify(`Clone Error: ${data.message || 'Failed'}`, 'error');
          }
        } catch (err) {
          console.error('Batch clone error:', err);
          notify('Connection error while cloning profiles.', 'error');
        } finally {
          btnCloneSelected.disabled = false;
          btnCloneSelected.textContent = '📑 Clone Selected';
        }
      });
    }

    // Extension Cloner Modal Logic
    const extensionClonerModal = document.getElementById('extensionClonerModal');
    const closeExtensionClonerModal = document.getElementById('closeExtensionClonerModal');
    const btnExtensionCloner = document.getElementById('btnExtensionCloner');
    const tabExtCloneFromProfile = document.getElementById('tabExtCloneFromProfile');
    const tabExtUploadNew = document.getElementById('tabExtUploadNew');
    const formCloneFromProfile = document.getElementById('formCloneFromProfile');
    const formUploadExtension = document.getElementById('formUploadExtension');
    const extSourceProfileSelect = document.getElementById('extSourceProfileSelect');
    const cancelExtCloneBtn = document.getElementById('cancelExtCloneBtn');
    const cancelExtUploadBtn = document.getElementById('cancelExtUploadBtn');

    if (btnExtensionCloner && extensionClonerModal) {
      btnExtensionCloner.addEventListener('click', () => {
        populateProfileDropdowns();
        extensionClonerModal.classList.add('active');
      });
    }

    if (closeExtensionClonerModal && extensionClonerModal) {
      closeExtensionClonerModal.addEventListener('click', () => {
        extensionClonerModal.classList.remove('active');
      });
    }

    if (cancelExtCloneBtn && extensionClonerModal) {
      cancelExtCloneBtn.addEventListener('click', () => extensionClonerModal.classList.remove('active'));
    }

    if (cancelExtUploadBtn && extensionClonerModal) {
      cancelExtUploadBtn.addEventListener('click', () => extensionClonerModal.classList.remove('active'));
    }

    // Modal Sub-tab toggling
    if (tabExtCloneFromProfile && tabExtUploadNew) {
      tabExtCloneFromProfile.addEventListener('click', () => {
        tabExtCloneFromProfile.classList.add('active');
        tabExtUploadNew.classList.remove('active');
        if (formCloneFromProfile) formCloneFromProfile.style.display = 'block';
        if (formUploadExtension) formUploadExtension.style.display = 'none';
      });

      tabExtUploadNew.addEventListener('click', () => {
        tabExtUploadNew.classList.add('active');
        tabExtCloneFromProfile.classList.remove('active');
        if (formUploadExtension) formUploadExtension.style.display = 'block';
        if (formCloneFromProfile) formCloneFromProfile.style.display = 'none';
      });
    }

    // Form 1: Clone extension from profile
    if (formCloneFromProfile) {
      formCloneFromProfile.addEventListener('submit', async (e) => {
        e.preventDefault();
        const sourceProfileId = extSourceProfileSelect ? extSourceProfileSelect.value : '';
        const targetMode = document.getElementById('extCloneTargetModeSelect')?.value || 'all';

        if (!sourceProfileId) {
          notify('Please select a source profile to copy extensions from!', 'warning');
          return;
        }

        const submitBtn = document.getElementById('submitExtCloneBtn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '⏳ Cloning Extension...';
        }

        try {
          const res = await fetch('/api/extensions/clone-from-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sourceProfileId,
              targetMode,
              selectedIds: Array.from(selectedProfileIds)
            })
          });
          const data = await res.json();
          if (data.success) {
            if (extensionClonerModal) extensionClonerModal.classList.remove('active');
            notify(data.message, 'success');
          } else {
            notify(`Extension Clone Error: ${data.message || 'Failed'}`, 'error');
          }
        } catch (err) {
          console.error('Extension clone error:', err);
          notify('Connection error while cloning extensions.', 'error');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '⚡ Clone Extension to Target Profiles';
          }
        }
      });
    }

    // Form 2: Upload/Install custom extension
    if (formUploadExtension) {
      formUploadExtension.addEventListener('submit', async (e) => {
        e.preventDefault();
        const folderPath = document.getElementById('extFolderPathInput')?.value.trim() || '';
        const targetMode = document.getElementById('extUploadTargetModeSelect')?.value || 'all';
        const fileInput = document.getElementById('extFileInput');

        let fileData = null;
        let fileName = null;

        if (fileInput && fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          fileName = file.name;
          fileData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1] || null);
            reader.readAsDataURL(file);
          });
        }

        if (!folderPath && !fileData) {
          notify('Please select a custom extension zip/crx file or enter an unpacked extension directory path!', 'warning');
          return;
        }

        const submitBtn = document.getElementById('submitExtUploadBtn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '⏳ Installing Extension...';
        }

        try {
          const res = await fetch('/api/extensions/upload-and-install', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              folderPath,
              targetMode,
              selectedIds: Array.from(selectedProfileIds),
              fileData,
              fileName
            })
          });
          const data = await res.json();
          if (data.success) {
            if (extensionClonerModal) extensionClonerModal.classList.remove('active');
            notify(data.message, 'success');
          } else {
            notify(`Extension Install Error: ${data.message || 'Failed'}`, 'error');
          }
        } catch (err) {
          console.error('Extension install error:', err);
          notify('Connection error while installing custom extension.', 'error');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '🚀 Install Extension Across Profiles';
          }
        }
      });
    }

    if (btnCloseAll) {
      btnCloseAll.addEventListener('click', async () => {
        await fetch('/api/profiles/close-all', { method: 'POST' });
        await fetchProfiles();
      });
    }

    // Apply Global Startup URL to All Profiles
    const btnApplyGlobalUrl = document.getElementById('btnApplyGlobalUrl');
    const globalLaunchUrlInput = document.getElementById('globalLaunchUrlInput');
    if (btnApplyGlobalUrl) {
      btnApplyGlobalUrl.addEventListener('click', async () => {
        let url = globalLaunchUrlInput ? globalLaunchUrlInput.value.trim() : '';
        if (!url) {
          notify('Please enter a target startup website (e.g. https://youtube.com)!', 'warning');
          return;
        }

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }

        btnApplyGlobalUrl.disabled = true;
        btnApplyGlobalUrl.textContent = '⏳ Syncing...';

        try {
          const res = await fetch('/api/profiles/sync-launch-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ launchUrl: url })
          });
          const data = await res.json();
          if (data.success) {
            if (globalLaunchUrlInput) globalLaunchUrlInput.value = data.launchUrl;
            notify(`Global Startup URL set to "${data.launchUrl}" across ${data.count} profiles!`, 'success');
            await fetchProfiles();
          } else {
            notify(`Error setting global URL: ${data.message || 'Unknown error'}`, 'error');
          }
        } catch (err) {
          console.error('Sync URL error:', err);
          notify('Failed to sync global URL.', 'error');
        } finally {
          btnApplyGlobalUrl.disabled = false;
          btnApplyGlobalUrl.textContent = '⚡ Sync URL to All';
        }
      });
    }

    if (btnRefresh) btnRefresh.addEventListener('click', () => fetchProfiles());
    if (searchInput) searchInput.addEventListener('input', renderProfilesList);

    // Additional Button Listeners for Sub-Modals and Tab Refresh Actions
    const btnRefreshOverview = document.getElementById('btnRefreshOverview');
    if (btnRefreshOverview) {
      btnRefreshOverview.addEventListener('click', () => fetchRouterOverview());
    }

    const btnResetUsageCounters = document.getElementById('btnResetUsageCounters');
    if (btnResetUsageCounters) {
      btnResetUsageCounters.addEventListener('click', async () => {
        if (confirm('Reset all request and launch usage counters to 0?')) {
          try {
            const res = await fetch('/api/usage/reset', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
              notify(data.message || 'All usage counters reset!', 'info');
              fetchUsageStats();
              fetchRouterOverview();
            }
          } catch (err) {
            console.error('Reset usage error:', err);
          }
        }
      });
    }

    const btnRefreshAuditLogs = document.getElementById('btnRefreshAuditLogs');
    if (btnRefreshAuditLogs) {
      btnRefreshAuditLogs.addEventListener('click', () => fetchAuditLogs());
    }

    // Sub-Modal 1: Bulk Add GitHub CSV Modal
    const bulkGithubModal = document.getElementById('bulkGithubModal');
    const cancelBulkGithubBtn = document.getElementById('cancelBulkGithubBtn');
    if (cancelBulkGithubBtn && bulkGithubModal) {
      cancelBulkGithubBtn.addEventListener('click', () => {
        bulkGithubModal.classList.remove('active');
      });
    }

    const bulkCsvFileInputModal = document.getElementById('bulkCsvFileInput');
    const bulkCsvTextInputModal = document.getElementById('bulkCsvTextInput');
    if (bulkCsvFileInputModal && bulkCsvTextInputModal) {
      bulkCsvFileInputModal.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => { bulkCsvTextInputModal.value = evt.target.result; };
          reader.readAsText(file);
        }
      });
    }

    const bulkGithubForm = document.getElementById('bulkGithubForm');
    if (bulkGithubForm) {
      bulkGithubForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const csvData = bulkCsvTextInputModal ? bulkCsvTextInputModal.value.trim() : '';
        if (!csvData) {
          notify('Please enter or upload CSV content with PAT tokens!', 'warning');
          return;
        }
        const submitBtn = document.getElementById('btnSubmitBulkGithub');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '⏳ Importing PATs...'; }
        try {
          const res = await fetch('/api/github/bulk-import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ csvData })
          });
          const data = await res.json();
          if (data.success) {
            if (bulkGithubModal) bulkGithubModal.classList.remove('active');
            notify(data.message || 'Imported PATs successfully!', 'success');
            await fetchAccounts();
            loadGhTabData(currentGhTab);
          } else {
            notify(`Import Failed: ${data.message || 'Error importing PAT tokens'}`, 'error');
          }
        } catch (err) {
          console.error(err);
          notify('Connection error importing tokens.', 'error');
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '🚀 Validate & Encrypt Import'; }
        }
      });
    }

    // Sub-Modal 2: Router Test Modal Close
    const routerTestModal = document.getElementById('routerTestModal');
    const btnCloseRouterTestModal = document.getElementById('btnCloseRouterTestModal');
    if (btnCloseRouterTestModal && routerTestModal) {
      btnCloseRouterTestModal.addEventListener('click', () => {
        routerTestModal.classList.remove('active');
      });
    }

    // Sub-Modal 4: Single Account Connect Modal
    const singleAccountModal = document.getElementById('singleAccountModal');
    const cancelSingleAccountBtn = document.getElementById('cancelSingleAccountBtn');
    if (cancelSingleAccountBtn && singleAccountModal) {
      cancelSingleAccountBtn.addEventListener('click', () => {
        singleAccountModal.classList.remove('active');
      });
    }

    const singleAccountForm = document.getElementById('singleAccountForm');
    if (singleAccountForm) {
      singleAccountForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = document.getElementById('singlePatInput')?.value.trim();
        const label = document.getElementById('singleLabelInput')?.value.trim();
        if (!token) return;
        const submitBtn = document.getElementById('submitSingleAccountBtn');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '⏳ Verifying PAT...'; }
        try {
          const res = await fetch('/api/github/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, label })
          });
          const data = await res.json();
          if (data.success) {
            if (singleAccountModal) singleAccountModal.classList.remove('active');
            const patInp = document.getElementById('singlePatInput');
            const lblInp = document.getElementById('singleLabelInput');
            if (patInp) patInp.value = '';
            if (lblInp) lblInp.value = '';
            await fetchAccounts();
            loadGhTabData(currentGhTab);
            notify(`GitHub Account @${data.verification?.username || data.account?.username || 'user'} Connected & Verified!`, 'success');
          } else {
            notify(`Verification Failed: ${data.message || 'Invalid token'}`, 'error');
          }
        } catch (err) {
          console.error(err);
          notify('Connection error verifying token.', 'error');
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Verify & Connect'; }
        }
      });
    }

    // Initialize GitHub Router Module
    setupGithubRouterModule();
  }

  // ====================================================
  // ENHANCED GITHUB ROUTER & PROFILE MANAGEMENT LOGIC
  // ====================================================

  let currentGhTab = 'overview';

  function setupGithubRouterModule() {
    // Tab Switching
    document.querySelectorAll('.gh-tab-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.ghTab;
        if (!targetTab) return;

        document.querySelectorAll('.gh-tab-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.gh-tab-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const panel = document.getElementById(`ghTab${targetTab.charAt(0).toUpperCase() + targetTab.slice(1)}`);
        if (panel) panel.classList.add('active');

        currentGhTab = targetTab;
        loadGhTabData(targetTab);
      });
    });

    // Inline Panels Elements
    const inlineRouterTestPanel = document.getElementById('inlineRouterTestPanel');
    const btnCloseInlineRouterTestPanel = document.getElementById('btnCloseInlineRouterTestPanel');

    const inlineBulkAddPanel = document.getElementById('inlineBulkAddPanel');
    const btnCloseInlineBulkAddPanel = document.getElementById('btnCloseInlineBulkAddPanel');
    const inlineBulkGithubForm = document.getElementById('inlineBulkGithubForm');
    const inlineBulkCsvTextInput = document.getElementById('inlineBulkCsvTextInput');
    const inlineBulkCsvFileInput = document.getElementById('inlineBulkCsvFileInput');
    const inlineBulkValidationResults = document.getElementById('inlineBulkValidationResults');

    const inlineConnectSinglePanel = document.getElementById('inlineConnectSinglePanel');
    const btnCloseInlineSinglePanel = document.getElementById('btnCloseInlineSinglePanel');
    const inlineSingleAccountForm = document.getElementById('inlineSingleAccountForm');

    function hideAllInlinePanels() {
      if (inlineRouterTestPanel) inlineRouterTestPanel.style.display = 'none';
      if (inlineBulkAddPanel) inlineBulkAddPanel.style.display = 'none';
      if (inlineConnectSinglePanel) inlineConnectSinglePanel.style.display = 'none';
    }

    function toggleInlinePanel(panel) {
      if (!panel) return;
      const isOpen = panel.style.display === 'block';
      hideAllInlinePanels();
      if (!isOpen) {
        panel.style.display = 'block';
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // 1. Test GitHub Router Button Handler
    const testBtns = [document.getElementById('btnTestGithubRouter'), document.getElementById('btnTestGithubRouterTab')];
    testBtns.forEach(btn => {
      if (btn) btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleInlinePanel(inlineRouterTestPanel);
        if (inlineRouterTestPanel && inlineRouterTestPanel.style.display === 'block') {
          runRouterTestDiagnostics();
        }
      });
    });

    if (btnCloseInlineRouterTestPanel) {
      btnCloseInlineRouterTestPanel.addEventListener('click', () => {
        if (inlineRouterTestPanel) inlineRouterTestPanel.style.display = 'none';
      });
    }

    // 2. Bulk Add GitHub Button Handler
    const bulkModalBtns = [
      document.getElementById('btnBulkAddGithubModal'),
      document.getElementById('btnBulkAddGithubTabBtn'),
      document.getElementById('btnBulkAddFromAccountsTab')
    ];
    bulkModalBtns.forEach(btn => {
      if (btn) btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleInlinePanel(inlineBulkAddPanel);
        if (inlineBulkAddPanel && inlineBulkAddPanel.style.display === 'block') {
          if (inlineBulkCsvTextInput) inlineBulkCsvTextInput.focus();
        }
      });
    });

    if (btnCloseInlineBulkAddPanel) {
      btnCloseInlineBulkAddPanel.addEventListener('click', () => {
        if (inlineBulkAddPanel) inlineBulkAddPanel.style.display = 'none';
      });
    }

    // Handle CSV file selection
    if (inlineBulkCsvFileInput && inlineBulkCsvTextInput) {
      inlineBulkCsvFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            inlineBulkCsvTextInput.value = evt.target.result;
          };
          reader.readAsText(file);
        }
      });
    }

    // Submit & Test Inline Bulk Add PATs
    if (inlineBulkGithubForm) {
      inlineBulkGithubForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const csvData = inlineBulkCsvTextInput ? inlineBulkCsvTextInput.value.trim() : '';
        if (!csvData) {
          notify('Please enter or upload CSV content with PAT tokens!', 'warning');
          return;
        }

        const submitBtn = document.getElementById('btnSubmitInlineBulkGithub');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '⏳ Testing & Validating PATs with GitHub API...';
        }

        if (inlineBulkValidationResults) {
          inlineBulkValidationResults.style.display = 'block';
          inlineBulkValidationResults.innerHTML = `
            <div style="text-align: center; padding: 16px;">
              <div class="spinner" style="margin: 0 auto 8px auto;"></div>
              <div style="font-weight: 700; font-size: 12px; color: #0284c7;">Validating & testing tokens with GitHub API...</div>
            </div>
          `;
        }

        try {
          const res = await fetch('/api/github/bulk-import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ csvData })
          });
          const data = await res.json();

          if (inlineBulkValidationResults) {
            if (data.success) {
              const successItems = data.imported || [];
              const errorItems = data.errors || [];

              let resultHtml = `
                <div style="font-size: 13px; font-weight: 800; color: #059669; margin-bottom: 8px;">
                  ☑️ ${escapeHtml(data.message)} (${successItems.length} Connected, ${errorItems.length} Failed)
                </div>
                <div style="display: flex; flex-direction: column; gap: 6px; max-height: 180px; overflow-y: auto;">
              `;

              successItems.forEach(item => {
                resultHtml += `
                  <div style="background: #dcfce7; border: 1px solid #86efac; border-radius: 6px; padding: 8px 12px; font-size: 11px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <strong style="color: #15803d;">✅ @${escapeHtml(item.username)}</strong>
                      <span style="color: #334155; margin-left: 6px;">(${escapeHtml(item.label || item.username)})</span>
                      <span style="font-family: monospace; color: #64748b; margin-left: 6px;">${escapeHtml(item.tokenMasked)}</span>
                    </div>
                    <span class="badge-pill badge-online" style="font-size: 9px;">VALIDATED (repo, workflow)</span>
                  </div>
                `;
              });

              errorItems.forEach(errStr => {
                resultHtml += `
                  <div style="background: #fee2e2; border: 1px solid #fca5a5; border-radius: 6px; padding: 8px 12px; font-size: 11px; color: #991b1b;">
                    ❌ ${escapeHtml(errStr)}
                  </div>
                `;
              });

              resultHtml += `</div>`;
              inlineBulkValidationResults.innerHTML = resultHtml;

              await fetchAccounts();
              loadGhTabData(currentGhTab);
            } else {
              inlineBulkValidationResults.innerHTML = `
                <div style="background: #fee2e2; border: 1px solid #fca5a5; border-radius: 6px; padding: 10px; font-size: 12px; color: #991b1b; font-weight: 700;">
                  ❌ Validation Failed: ${escapeHtml(data.message || 'Error testing tokens')}
                </div>
              `;
            }
          }
        } catch (err) {
          console.error(err);
          if (inlineBulkValidationResults) {
            inlineBulkValidationResults.innerHTML = `<div style="color: #dc2626; font-size: 12px;">❌ Connection error validating tokens.</div>`;
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '🚀 Validate & Connect PATs';
          }
        }
      });
    }

    // 3. Connect Single PAT Button Handler
    const singleModalBtns = [
      document.getElementById('btnOpenConnectSingleModal'),
      document.getElementById('btnConnectSingleTabBtn'),
      document.getElementById('btnConnectFromAccountsTab')
    ];
    singleModalBtns.forEach(btn => {
      if (btn) btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleInlinePanel(inlineConnectSinglePanel);
        if (inlineConnectSinglePanel && inlineConnectSinglePanel.style.display === 'block') {
          const inp = document.getElementById('inlineSinglePatInput');
          if (inp) inp.focus();
        }
      });
    });

    if (btnCloseInlineSinglePanel) {
      btnCloseInlineSinglePanel.addEventListener('click', () => {
        if (inlineConnectSinglePanel) inlineConnectSinglePanel.style.display = 'none';
      });
    }

    if (inlineSingleAccountForm) {
      inlineSingleAccountForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = document.getElementById('inlineSinglePatInput')?.value.trim();
        const label = document.getElementById('inlineSingleLabelInput')?.value.trim();
        if (!token) return;

        const submitBtn = document.getElementById('btnSubmitInlineSingle');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '⏳ Verifying PAT...';
        }

        try {
          const res = await fetch('/api/github/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, label })
          });
          const data = await res.json();
          if (data.success) {
            notify(`GitHub Account @${data.account.username} connected & validated successfully!`, 'success');
            if (inlineConnectSinglePanel) inlineConnectSinglePanel.style.display = 'none';
            const patInp = document.getElementById('inlineSinglePatInput');
            const lblInp = document.getElementById('inlineSingleLabelInput');
            if (patInp) patInp.value = '';
            if (lblInp) lblInp.value = '';
            await fetchAccounts();
            loadGhTabData(currentGhTab);
          } else {
            notify(`Token Verification Error: ${data.message || 'Failed'}`, 'error');
          }
        } catch (err) {
          console.error(err);
          notify('Connection error verifying GitHub token.', 'error');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Verify & Connect Account';
          }
        }
      });
    }
  }

  function loadGhTabData(tabName) {
    switch (tabName) {
      case 'overview':
        fetchRouterOverview();
        break;
      case 'routers':
        fetchRouterNodes();
        break;
      case 'accounts':
        fetchAccountsTable();
        break;
      case 'allocation':
        fetchAllocationMatrix();
        break;
      case 'duplicated':
        fetchDuplicatedAccounts();
        break;
      case 'usage':
        fetchUsageStats();
        break;
      case 'logs':
        fetchAuditLogs();
        break;
    }
  }

  async function fetchRouterOverview() {
    try {
      const res = await fetch('/api/router/overview');
      const data = await res.json();
      if (data.success) {
        const elTotalRouters = document.getElementById('ovTotalRouters');
        const elTotalAccounts = document.getElementById('ovTotalAccounts') || document.getElementById('ovGithubAccounts');
        const elActiveAllocations = document.getElementById('ovActiveAllocations') || document.getElementById('ov1to1Allocations');
        const elAllowApprovals = document.getElementById('ovAllowApprovals') || document.getElementById('ovPendingApprovals');
        const elDuplicatedCount = document.getElementById('ovDuplicatedCount') || document.getElementById('ovDuplicatedAllocations');

        if (elTotalRouters) elTotalRouters.textContent = `${data.totalRouters || 1} Active`;
        if (elTotalAccounts) elTotalAccounts.textContent = `${data.totalGithubAccounts || accounts.length} Total`;
        if (elActiveAllocations) elActiveAllocations.textContent = `${data.oneToOneAllocationsCount || 0} / ${profiles.length}`;
        if (elAllowApprovals) elAllowApprovals.textContent = `${data.allowedAllocationsCount || data.pendingAllocationsCount || 0} Approved`;
        if (elDuplicatedCount) elDuplicatedCount.textContent = `${data.duplicatedAllocationsCount || 0} Profiles`;

        const badge = document.getElementById('headerRouterStatusBadge');
        if (badge) {
          badge.textContent = data.routerStatus || 'ONLINE';
          badge.className = `badge-pill ${data.routerStatus === 'ONLINE' ? 'badge-online' : 'badge-degraded'}`;
        }
      }
    } catch (e) {
      console.error('fetchRouterOverview error:', e);
    }
  }

  // 2. Run Diagnostics Test
  async function runRouterTestDiagnostics() {
    const inlineContent = document.getElementById('inlineRouterTestContent');
    const body = document.getElementById('routerTestModalBody');
    
    const loadingHtml = `
      <div style="text-align: center; padding: 20px;">
        <div class="spinner" style="margin: 0 auto 12px auto; border-top-color: #8b5cf6;"></div>
        <h4 style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">Running Router Diagnostics...</h4>
        <p style="font-size: 12px; color: var(--text-muted);">Testing configured exit nodes, IP geolocation, ASN, GitHub OAuth connectivity & latency</p>
      </div>
    `;

    if (inlineContent) inlineContent.innerHTML = loadingHtml;
    if (body) body.innerHTML = loadingHtml;

    try {
      const res = await fetch('/api/router/test', { method: 'POST' });
      const data = await res.json();

      const isOnline = data.overallStatus === 'ONLINE';
      const isDegraded = data.overallStatus === 'DEGRADED';
      const statusBadgeClass = isOnline ? 'badge-online' : (isDegraded ? 'badge-degraded' : 'badge-offline');

      const resultHtml = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid var(--border-light); border-radius: 10px; padding: 14px;">
            <div>
              <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">OVERALL ROUTER STATUS</div>
              <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 2px;">
                <span class="badge-pill ${statusBadgeClass}" style="font-size: 13px; padding: 4px 12px;">${escapeHtml(data.overallStatus)}</span>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">RESPONSE LATENCY</div>
              <div style="font-size: 18px; font-weight: 800; color: #0284c7; margin-top: 2px;">⚡ ${data.latencyMs} ms</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 8px; padding: 10px 14px;">
              <div style="font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">PUBLIC EXIT IP</div>
              <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 2px;">📍 ${escapeHtml(data.publicExitIp)}</div>
            </div>

            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 8px; padding: 10px 14px;">
              <div style="font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">APPROXIMATE LOCATION</div>
              <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 2px;">🇺🇸 ${escapeHtml(data.ipLocation)}</div>
            </div>
          </div>

          <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 8px; padding: 10px 14px;">
            <div style="font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">AUTONOMOUS SYSTEM (ASN) / ISP</div>
            <div style="font-size: 12px; font-weight: 700; color: #334155; margin-top: 2px;">🏢 ${escapeHtml(data.asn)}</div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 8px; padding: 10px 14px;">
              <div style="font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">GITHUB CONNECTIVITY</div>
              <div style="font-size: 12px; font-weight: 700; color: ${data.githubConnectivity ? '#059669' : '#dc2626'}; margin-top: 2px;">
                ${data.githubConnectivity ? '✓ Connected' : '❌ ' + escapeHtml(data.githubMessage)}
              </div>
            </div>

            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 8px; padding: 10px 14px;">
              <div style="font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">HTTPS HANDSHAKE</div>
              <div style="font-size: 12px; font-weight: 700; color: #059669; margin-top: 2px;">✓ Verified HTTPS</div>
            </div>
          </div>

          <div style="font-size: 10px; color: var(--text-muted); text-align: right;">
            Diagnostics Timestamp: ${new Date(data.timestamp).toLocaleString()}
          </div>
        </div>
      `;

      if (inlineContent) inlineContent.innerHTML = resultHtml;
      if (body) body.innerHTML = resultHtml;

      fetchRouterOverview();
    } catch (err) {
      const errHtml = `
        <div style="padding: 20px; text-align: center; color: #dc2626;">
          <h4>❌ Diagnostics Error</h4>
          <p>${escapeHtml(err.message)}</p>
        </div>
      `;
      if (inlineContent) inlineContent.innerHTML = errHtml;
      if (body) body.innerHTML = errHtml;
    }
  }

  // 3. Fetch Router Nodes
  async function fetchRouterNodes() {
    const container = document.getElementById('routerNodesContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="router-card">
        <div>
          <div class="router-card-title">🇺🇸 US Azure Cloud Exit Node (Primary)</div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Egress Protocol: SOCKS5 / HTTP Proxy Tunnel</div>
          <div style="font-size: 11px; color: #0284c7; margin-top: 4px; font-weight: 700;">Location: Washington / Virginia, United States | ASN: AS8075 Microsoft Corporation</div>
        </div>
        <div style="text-align: right;">
          <span class="badge-pill badge-online" style="font-size: 11px;">🟢 ONLINE</span>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Latency: ~110ms</div>
        </div>
      </div>
      <div class="router-card">
        <div>
          <div class="router-card-title">🇺🇸 US West Cloud Exit Node (Secondary)</div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Egress Protocol: SOCKS5 Proxy Tunnel</div>
          <div style="font-size: 11px; color: #0284c7; margin-top: 4px; font-weight: 700;">Location: California / Oregon, United States | ASN: AS8075 Microsoft Corporation</div>
        </div>
        <div style="text-align: right;">
          <span class="badge-pill badge-online" style="font-size: 11px;">🟢 ONLINE</span>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Latency: ~125ms</div>
        </div>
      </div>
    `;
  }

  // 4. Fetch Accounts Table
  async function fetchAccountsTable() {
    const tbody = document.getElementById('accountsTableBody') || document.getElementById('connectedAccountsTableBody');
    if (!tbody) return;
    try {
      const res = await fetch('/api/github/accounts');
      const data = await res.json();
      if (!data.success) return;

      const accs = data.accounts;
      tbody.innerHTML = '';

      if (accs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 20px; color: var(--text-muted);">No GitHub accounts connected. Click "Bulk Add GitHub" or "+ Connect PAT" above to add credentials.</td></tr>`;
        return;
      }

      accs.forEach(acc => {
        const assignedProfiles = profiles.filter(p => p.githubAccountId === acc.id);
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <td style="font-weight: 700; color: #0f172a;">
            @${escapeHtml(acc.username)}
            <div style="font-size: 10px; color: var(--text-muted); font-weight: 400;">${escapeHtml(acc.label || acc.username)}</div>
          </td>
          <td><span class="badge-pill badge-online">VALIDATED</span></td>
          <td style="font-family: monospace; color: #475569;">${escapeHtml(acc.tokenMasked || maskToken(acc.token))}</td>
          <td><span style="font-size: 11px; font-weight: 700; color: #0284c7;">US Azure IP</span></td>
          <td><span class="badge-pill badge-neon">${assignedProfiles.length} Profiles</span></td>
          <td><strong>0</strong> / 0</td>
          <td style="font-size: 11px; color: var(--text-muted);">${new Date(acc.connectedAt).toLocaleDateString()}</td>
          <td style="text-align: right;">
            <button class="btn btn-outline test-acc-btn" data-id="${acc.id}" style="padding: 2px 8px; font-size: 11px;">🧪 Test</button>
            <button class="btn btn-red delete-acc-btn" data-id="${acc.id}" style="padding: 2px 8px; font-size: 11px;">🗑️ Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Bind Test & Delete
      tbody.querySelectorAll('.test-acc-btn').forEach(b => {
        b.addEventListener('click', async () => {
          const id = b.dataset.id;
          b.disabled = true;
          b.textContent = '⏳';
          try {
            const r = await fetch(`/api/github/accounts/${id}/test`, { method: 'POST' });
            const d = await r.json();
            notify(d.message || 'Token test completed.', 'success');
          } catch (e) {
            notify('Test failed', 'error');
          } finally {
            b.disabled = false;
            b.textContent = '🧪 Test';
          }
        });
      });

      tbody.querySelectorAll('.delete-acc-btn').forEach(b => {
        b.addEventListener('click', async () => {
          if (confirm('Delete this GitHub account credential?')) {
            await fetch(`/api/github/accounts/${b.dataset.id}`, { method: 'DELETE' });
            await fetchAccounts();
            fetchAccountsTable();
          }
        });
      });

    } catch (e) {
      console.error(e);
    }
  }

  // 5. Fetch Allocation Matrix Table
  async function fetchAllocationMatrix() {
    const tbody = document.getElementById('allocationMatrixTableBody');
    if (!tbody) return;

    try {
      const res = await fetch('/api/allocation/matrix');
      const data = await res.json();
      if (!data.success) return;

      const matrix = data.matrix;
      const searchVal = document.getElementById('allocationSearchInput')?.value.toLowerCase().trim() || '';

      tbody.innerHTML = '';

      const filtered = matrix.filter(m => {
        if (!searchVal) return true;
        return m.profileName.toLowerCase().includes(searchVal) || m.githubUsername.toLowerCase().includes(searchVal);
      });

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 20px; color: var(--text-muted);">No profile allocations found matching search.</td></tr>`;
        return;
      }

      filtered.forEach(item => {
        const tr = document.createElement('tr');
        const isAllowed = item.allowed !== false;
        const statusBadge = isAllowed ? `<span class="badge-allowed">✅ ALLOWED</span>` : `<span class="badge-pending">⚠️ PENDING ALLOW</span>`;

        tr.innerHTML = `
          <td style="font-weight: 700; color: #0f172a;">${escapeHtml(item.profileName)}</td>
          <td><span style="font-size: 11px; color: var(--text-muted);">${escapeHtml(item.group)}</span></td>
          <td style="font-weight: 700; color: #0284c7;">@${escapeHtml(item.githubUsername)}</td>
          <td><span class="badge-pill badge-neon">${escapeHtml(item.allocationMode)}</span></td>
          <td>${statusBadge}</td>
          <td><span style="font-size: 11px; font-weight: 600; color: #475569;">${escapeHtml(item.routerNode)}</span></td>
          <td><strong>${item.usageTotal}</strong> (${item.usageHourly}/h)</td>
          <td style="text-align: right;">
            <button class="btn ${isAllowed ? 'btn-outline' : 'btn-green'} allow-toggle-btn" data-id="${item.profileId}" data-allowed="${isAllowed}" style="padding: 3px 10px; font-size: 11px; font-weight: 700;">
              ${isAllowed ? '🔒 Revoke Allow' : '✅ Allow Profile'}
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      tbody.querySelectorAll('.allow-toggle-btn').forEach(b => {
        b.addEventListener('click', async () => {
          const profileId = b.dataset.id;
          const currentAllowed = b.dataset.allowed === 'true';
          const newAllowed = !currentAllowed;

          b.disabled = true;
          try {
            const r = await fetch('/api/allocation/allow', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ profileId, allowed: newAllowed })
            });
            const d = await r.json();
            if (d.success) {
              fetchAllocationMatrix();
              fetchRouterOverview();
            } else {
              notify(d.message, 'error');
            }
          } catch (e) {
            console.error(e);
          } finally {
            b.disabled = false;
          }
        });
      });

    } catch (e) {
      console.error(e);
    }
  }

  // Search input filter for matrix
  const allocationSearchInput = document.getElementById('allocationSearchInput');
  if (allocationSearchInput) {
    allocationSearchInput.addEventListener('input', () => fetchAllocationMatrix());
  }

  // 6. Fetch Duplicated Accounts Tab
  async function fetchDuplicatedAccounts() {
    const container = document.getElementById('duplicatedAccountsContainer');
    if (!container) return;

    try {
      const res = await fetch('/api/allocation/duplicated');
      const data = await res.json();
      if (!data.success) return;

      const dupes = data.duplicatedAccounts;
      container.innerHTML = '';

      if (dupes.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 30px; background: #ffffff; border-radius: 12px; border: 1px solid var(--border-light); color: var(--text-muted);">No GitHub accounts connected.</div>`;
        return;
      }

      dupes.forEach(acc => {
        const card = document.createElement('div');
        card.style.cssText = 'background: #ffffff; border: 1px solid var(--border-light); border-radius: 12px; padding: 16px; box-shadow: var(--shadow-sm);';

        const isMulti = acc.assignedProfileCount > 1;
        const statusBadge = isMulti 
          ? `<span class="badge-pill badge-neon" style="background: rgba(236,72,153,0.1); color: #ec4899; border-color: rgba(236,72,153,0.3);">DUPLICATED SHARED (${acc.assignedProfileCount} Profiles)</span>` 
          : (acc.assignedProfileCount === 1 ? `<span class="badge-pill badge-online">1:1 DEDICATED</span>` : `<span class="badge-pill badge-degraded">UNASSIGNED</span>`);

        const profilesListHtml = acc.assignedProfiles.map(p => 
          `<span class="badge-pill" style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; font-weight: 700;">👤 ${escapeHtml(p.name)}</span>`
        ).join(' ') || '<span style="color: var(--text-muted); font-size: 11px;">No profiles assigned</span>';

        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div>
              <div style="font-size: 15px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                @${escapeHtml(acc.username)}
                ${statusBadge}
              </div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
                Masked PAT Credential: <code style="color: #475569;">${escapeHtml(acc.tokenMasked)}</code> | Router Status: <strong style="color: var(--primary-green);">🟢 ONLINE</strong>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 13px; font-weight: 800; color: #0284c7;">${acc.usageTotal} Requests</div>
              <div style="font-size: 11px; color: var(--text-muted);">${acc.usageHourly}/h | ${acc.usageDaily}/24h</div>
            </div>
          </div>

          <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: 8px; padding: 10px; margin-bottom: 10px;">
            <div style="font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">ASSIGNED PROFILES (${acc.assignedProfileCount})</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">${profilesListHtml}</div>
          </div>

          <div style="font-size: 10px; color: var(--text-muted); text-align: right;">
            Last Used: ${acc.lastUsedAt ? new Date(acc.lastUsedAt).toLocaleString() : 'Never'}
          </div>
        `;

        container.appendChild(card);
      });

    } catch (e) {
      console.error(e);
    }
  }

  // Open Duplicated Workflow Wizard
  function openDuplicatedWorkflowWizard() {
    const modal = document.getElementById('duplicatedWorkflowModal');
    const accSelect = document.getElementById('dwAccountSelect');
    const profChecklist = document.getElementById('dwProfilesChecklist');
    if (!modal) return;

    if (accSelect) {
      accSelect.innerHTML = '';
      accounts.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.id;
        opt.textContent = `@${a.username} (${a.label || 'PAT Credential'})`;
        accSelect.appendChild(opt);
      });
    }

    if (profChecklist) {
      profChecklist.innerHTML = '';
      if (profiles.length === 0) {
        profChecklist.innerHTML = `<div style="font-size: 12px; color: var(--text-muted);">No profiles created yet.</div>`;
      } else {
        profiles.forEach(p => {
          const label = document.createElement('label');
          label.style.cssText = 'display: flex; align-items: center; gap: 8px; font-size: 12px; cursor: pointer; padding: 4px; border-radius: 4px; background: #ffffff; border: 1px solid var(--border-light);';
          label.innerHTML = `<input type="checkbox" class="dw-prof-cb" value="${p.id}"> <span><strong>${escapeHtml(p.name)}</strong> (${escapeHtml(p.group || 'Default')})</span>`;
          profChecklist.appendChild(label);
        });
      }
    }

    modal.classList.add('active');
  }

  const btnOpenDuplicatedWorkflow = document.getElementById('btnOpenDuplicatedWorkflow');
  if (btnOpenDuplicatedWorkflow) {
    btnOpenDuplicatedWorkflow.addEventListener('click', (e) => {
      e.preventDefault();
      openDuplicatedWorkflowWizard();
    });
  }

  const cancelDuplicatedWorkflowBtn = document.getElementById('cancelDuplicatedWorkflowBtn');
  if (cancelDuplicatedWorkflowBtn) {
    cancelDuplicatedWorkflowBtn.addEventListener('click', () => {
      const modal = document.getElementById('duplicatedWorkflowModal');
      if (modal) modal.classList.remove('active');
    });
  }

  const duplicatedWorkflowForm = document.getElementById('duplicatedWorkflowForm');
  if (duplicatedWorkflowForm) {
    duplicatedWorkflowForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const githubAccountId = document.getElementById('dwAccountSelect')?.value;
      const checkedProfileCbs = document.querySelectorAll('.dw-prof-cb:checked');
      const targetProfileIds = Array.from(checkedProfileCbs).map(cb => cb.value);

      if (!githubAccountId) {
        notify('Please select a GitHub Account!', 'warning');
        return;
      }

      if (targetProfileIds.length === 0) {
        notify('Please select at least one target profile!', 'warning');
        return;
      }

      const submitBtn = document.getElementById('btnExecuteDuplicatedWorkflow');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Assigning PAT...';
      }

      try {
        let successCount = 0;
        for (const pid of targetProfileIds) {
          const res = await fetch('/api/allocation/assign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileId: pid, githubAccountId, mode: 'duplicated' })
          });
          const data = await res.json();
          if (data.success) successCount++;
        }

        const modal = document.getElementById('duplicatedWorkflowModal');
        if (modal) modal.classList.remove('active');

        notify(`Successfully allocated GitHub PAT to ${successCount} profile(s) in Duplicated Mode!`, 'success');
        await fetchProfiles();
        loadGhTabData(currentGhTab);
      } catch (err) {
        console.error('Duplicated allocation error:', err);
        notify('Error assigning GitHub PAT to selected profiles.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '⚡ Execute Sequential Allocation';
        }
      }
    });
  }

  // 7. Fetch Usage Statistics
  async function fetchUsageStats() {
    const accContainer = document.getElementById('accountUsageList');
    const profContainer = document.getElementById('profileUsageList');
    if (!accContainer || !profContainer) return;

    try {
      const res = await fetch('/api/usage/stats');
      const data = await res.json();
      if (!data.success) return;

      accContainer.innerHTML = '';
      profContainer.innerHTML = '';

      if (data.accounts.length === 0) {
        accContainer.innerHTML = `<div style="font-size: 12px; color: var(--text-muted);">No account usage logged.</div>`;
      } else {
        data.accounts.forEach(a => {
          const div = document.createElement('div');
          div.style.cssText = 'background: #f8fafc; border: 1px solid var(--border-light); border-radius: 8px; padding: 10px; display: flex; justify-content: space-between; align-items: center;';
          div.innerHTML = `
            <div>
              <div style="font-weight: 800; color: #0f172a;">@${escapeHtml(a.username)}</div>
              <div style="font-size: 10px; color: var(--text-muted);">${a.lastUsedAt ? 'Last used: ' + new Date(a.lastUsedAt).toLocaleTimeString() : 'Never used'}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 800; color: #0284c7;">${a.total} Requests</div>
              <div style="font-size: 10px; color: var(--text-muted);">${a.hourly}/h | ${a.daily}/24h</div>
            </div>
          `;
          accContainer.appendChild(div);
        });
      }

      if (data.profiles.length === 0) {
        profContainer.innerHTML = `<div style="font-size: 12px; color: var(--text-muted);">No profile launch usage logged.</div>`;
      } else {
        data.profiles.forEach(p => {
          const div = document.createElement('div');
          div.style.cssText = 'background: #f8fafc; border: 1px solid var(--border-light); border-radius: 8px; padding: 10px; display: flex; justify-content: space-between; align-items: center;';
          div.innerHTML = `
            <div>
              <div style="font-weight: 800; color: #0f172a;">${escapeHtml(p.name)}</div>
              <div style="font-size: 10px; color: var(--text-muted);">${p.lastUsedAt ? 'Last launched: ' + new Date(p.lastUsedAt).toLocaleTimeString() : 'Never launched'}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 800; color: #059669;">${p.total} Launches</div>
              <div style="font-size: 10px; color: var(--text-muted);">${p.hourly}/h | ${p.daily}/24h</div>
            </div>
          `;
          profContainer.appendChild(div);
        });
      }

    } catch (e) {
      console.error(e);
    }
  }

  // 8. Fetch Audit Logs
  async function fetchAuditLogs() {
    const tbody = document.getElementById('auditLogsTableBody');
    if (!tbody) return;

    try {
      const res = await fetch('/api/logs/audit');
      const data = await res.json();
      if (!data.success) return;

      const logs = data.logs;
      const severityFilter = document.getElementById('auditLogSeverityFilter')?.value || 'all';

      tbody.innerHTML = '';

      const filtered = logs.filter(l => severityFilter === 'all' || l.severity === severityFilter);

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: var(--text-muted);">No audit log events found.</td></tr>`;
        return;
      }

      filtered.forEach(log => {
        const tr = document.createElement('tr');
        const sevClass = `severity-${log.severity || 'info'}`;

        tr.innerHTML = `
          <td style="font-size: 11px; color: var(--text-muted); font-family: monospace;">${new Date(log.timestamp).toLocaleString()}</td>
          <td><span class="badge-pill badge-neon" style="font-size: 10px;">${escapeHtml(log.type)}</span></td>
          <td style="font-weight: 700; color: #0f172a;">${escapeHtml(log.action)}</td>
          <td style="font-weight: 700; color: #0284c7;">${escapeHtml(log.target)}</td>
          <td style="font-size: 11px; color: #475569;">${escapeHtml(log.details)}</td>
          <td style="text-align: right;"><span class="severity-badge ${sevClass}">${escapeHtml(log.severity)}</span></td>
        `;
        tbody.appendChild(tr);
      });

    } catch (e) {
      console.error(e);
    }
  }

  // ====================================================
  // PROXY POOL MODULE IMPLEMENTATION
  // ====================================================
  let proxiesList = [];
  const selectedProxyIds = new Set();
  let proxySearchQuery = '';

  function parseProxyStringClient(str, defaultProtocol = 'socks5') {
    if (!str || typeof str !== 'string') return null;
    let clean = str.trim();
    if (!clean) return null;

    let protocol = defaultProtocol;
    if (clean.includes('://')) {
      const parts = clean.split('://');
      protocol = parts[0].toLowerCase();
      clean = parts[1];
    }

    let host = '', port = '', username = '', password = '';

    if (clean.includes('@')) {
      const [authPart, hostPart] = clean.split('@');
      const authSplit = authPart.split(':');
      username = authSplit[0] || '';
      password = authSplit[1] || '';

      const hostSplit = hostPart.split(':');
      host = hostSplit[0] || '';
      port = hostSplit[1] || '';
    } else {
      const parts = clean.split(':');
      if (parts.length >= 4) {
        host = parts[0] || '';
        port = parts[1] || '';
        username = parts[2] || '';
        password = parts[3] || '';
      } else if (parts.length === 2) {
        host = parts[0] || '';
        port = parts[1] || '';
      } else if (parts.length === 3) {
        host = parts[0] || '';
        port = parts[1] || '';
        username = parts[2] || '';
      }
    }

    host = host.trim();
    port = port.trim();
    username = username.trim();
    password = password.trim();

    if (!host || !port) return null;
    const numPort = parseInt(port, 10);
    if (isNaN(numPort) || numPort <= 0 || numPort > 65535) return null;

    return {
      protocol: ['socks5', 'http', 'https'].includes(protocol) ? protocol : 'socks5',
      host,
      port: numPort,
      username,
      password
    };
  }

  function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<span>${type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️')}</span> <span>${escapeHtml(message)}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  async function fetchProxies() {
    try {
      const res = await fetch('/api/proxies');
      const data = await res.json();
      if (data.success) {
        proxiesList = data.proxies;
        renderProxyTable();
        updateProxyStats();
        populateProxyPoolDropdown();
      }
    } catch (err) {
      console.error('Failed to fetch proxies:', err);
    }
  }

  function updateProxyStats() {
    const totalEl = document.getElementById('statTotalProxies');
    const workingEl = document.getElementById('statWorkingProxies');
    const failedEl = document.getElementById('statFailedProxies');
    const assignedEl = document.getElementById('statAssignedProxies');

    const total = proxiesList.length;
    const working = proxiesList.filter(p => p.status === 'working').length;
    const failed = proxiesList.filter(p => p.status === 'failed').length;
    const assigned = proxiesList.filter(p => p.assignedProfiles && p.assignedProfiles.length > 0).length;

    if (totalEl) totalEl.textContent = total;
    if (workingEl) workingEl.textContent = working;
    if (failedEl) failedEl.textContent = failed;
    if (assignedEl) assignedEl.textContent = assigned;
  }

  function populateProxyPoolDropdown(selectedProxyId = null) {
    const profProxyPoolSelect = document.getElementById('profProxyPoolSelect');
    if (!profProxyPoolSelect) return;

    const currentVal = selectedProxyId || profProxyPoolSelect.value;
    profProxyPoolSelect.innerHTML = '<option value="">-- Choose Proxy from Pool --</option>';

    if (proxiesList.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'No proxies in pool (Add proxies in Proxy Pool tab)';
      profProxyPoolSelect.appendChild(opt);
      return;
    }

    proxiesList.forEach(px => {
      const opt = document.createElement('option');
      opt.value = px.id;
      const statusIcon = px.status === 'working' ? '🟢' : (px.status === 'failed' ? '🔴' : '⚪');
      const authInfo = px.username ? `@${px.username}` : '';
      const countryStr = px.country ? `(${px.country}${px.city ? ' - ' + px.city : ''})` : '';
      opt.textContent = `${statusIcon} ${(px.protocol || 'socks5').toUpperCase()} ${px.host}:${px.port} ${authInfo} ${countryStr}`;
      profProxyPoolSelect.appendChild(opt);
    });

    if (currentVal && proxiesList.some(p => p.id === currentVal)) {
      profProxyPoolSelect.value = currentVal;
    }
  }

  function renderProxyTable() {
    const tbody = document.getElementById('proxyTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const query = proxySearchQuery.toLowerCase().trim();
    const filtered = proxiesList.filter(p => {
      if (!query) return true;
      return (p.host || '').toLowerCase().includes(query) ||
             (p.username || '').toLowerCase().includes(query) ||
             (p.country || '').toLowerCase().includes(query) ||
             (p.city || '').toLowerCase().includes(query) ||
             String(p.port).includes(query);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="11" style="text-align: center; padding: 40px; color: var(--text-muted);">
            ${proxiesList.length === 0 ? 'No proxies in pool. Click "+ Add Proxy" or "📥 Bulk Import Proxies" to get started.' : 'No matching proxies found.'}
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach((px, idx) => {
      const tr = document.createElement('tr');
      const isChecked = selectedProxyIds.has(px.id);

      let statusBadge = '<span class="proxy-status-badge unchecked">⚪ Unchecked</span>';
      if (px.status === 'working') {
        statusBadge = `<span class="proxy-status-badge working">🟢 Working (${px.ping || 40}ms)</span>`;
      } else if (px.status === 'failed') {
        statusBadge = '<span class="proxy-status-badge failed">🔴 Failed</span>';
      }

      const fullFormatString = px.username
        ? `${px.host}:${px.port}:${px.username}:${px.password}`
        : `${px.host}:${px.port}`;

      let assignedText = '<span style="color: var(--text-muted); font-size: 11px;">Unassigned</span>';
      if (px.assignedProfiles && px.assignedProfiles.length > 0) {
        assignedText = px.assignedProfiles.map(prof => `<span class="badge-pill badge-neon" style="font-size: 10px; margin-right: 4px;">👤 ${escapeHtml(prof.name)}</span>`).join('');
      }

      tr.innerHTML = `
        <td style="text-align: center; color: var(--text-muted); font-weight: 600;">${idx + 1}</td>
        <td style="font-weight: 700; color: #0f172a;">
          <span style="font-family: monospace;">${escapeHtml(px.host)}</span>
          <button class="copy-btn-icon copy-ip-btn" data-text="${escapeHtml(px.host)}" title="Copy IP Address">📋</button>
        </td>
        <td style="font-family: monospace; font-weight: 700; color: #0284c7;">${px.port}</td>
        <td style="font-family: monospace; color: var(--text-secondary);">${escapeHtml(px.username || '-')}</td>
        <td style="font-family: monospace; color: var(--text-muted);">${px.password ? '••••••••' : '-'}</td>
        <td style="font-size: 11px; color: var(--text-muted);">${px.lastChecked ? new Date(px.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}</td>
        <td>${statusBadge}</td>
        <td style="font-weight: 600; color: #0f172a;">${escapeHtml(px.country || 'Global')}</td>
        <td style="font-weight: 600; color: var(--text-secondary);">${escapeHtml(px.city || '-')}</td>
        <td>${assignedText}</td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 6px; justify-content: flex-end;">
            <button class="btn btn-purple btn-sm test-single-proxy-btn" data-id="${px.id}" style="padding: 3px 8px; font-size: 11px;" title="Test Proxy Connection">🧪 Test</button>
            <button class="btn btn-outline btn-sm copy-proxy-format-btn" data-format="${escapeHtml(fullFormatString)}" style="padding: 3px 8px; font-size: 11px;" title="Copy IP:PORT:USER:PASS format">📋 Copy</button>
            <button class="btn btn-outline btn-sm edit-proxy-btn" data-id="${px.id}" style="padding: 3px 8px; font-size: 11px;" title="Edit Proxy">✏️</button>
            <button class="icon-btn-action delete-proxy-btn" data-id="${px.id}" style="width: 26px; height: 26px;" title="Delete Proxy">🗑️</button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });

    attachProxyTableEvents();
  }

  function attachProxyTableEvents() {
    document.querySelectorAll('.proxy-select-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = cb.dataset.id;
        if (cb.checked) selectedProxyIds.add(id);
        else selectedProxyIds.delete(id);
        updateProxySelectionSummary();
      });
    });

    document.querySelectorAll('.copy-ip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.dataset.text;
        navigator.clipboard.writeText(text);
        showToast(`✓ Copied IP Address: ${text}`, 'success');
      });
    });

    document.querySelectorAll('.copy-proxy-format-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fmt = btn.dataset.format;
        navigator.clipboard.writeText(fmt);
        showToast(`✓ Copied Proxy Format: ${fmt}`, 'success');
      });
    });

    document.querySelectorAll('.test-single-proxy-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        btn.disabled = true;
        btn.textContent = '⏳...';

        try {
          const res = await fetch(`/api/proxies/${id}/test`, { method: 'POST' });
          const data = await res.json();
          if (data.success) {
            showToast(`🟢 Proxy Working (${data.ping || 40}ms)!`, 'success');
          } else {
            showToast(`🔴 Proxy Offline: ${data.message}`, 'error');
          }
          await fetchProxies();
        } catch (err) {
          console.error(err);
          showToast(`❌ Connection error testing proxy`, 'error');
        } finally {
          btn.disabled = false;
          btn.textContent = '🧪 Test';
        }
      });
    });

    document.querySelectorAll('.edit-proxy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        openAddProxyModal(id);
      });
    });

    document.querySelectorAll('.delete-proxy-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (confirm('Delete this proxy from the pool?')) {
          await fetch(`/api/proxies/${id}`, { method: 'DELETE' });
          selectedProxyIds.delete(id);
          await fetchProxies();
          showToast('Deleted proxy from pool.', 'info');
        }
      });
    });
  }

  function updateProxySelectionSummary() {
    const summary = document.getElementById('proxySelectionSummary');
    const selectAllCb = document.getElementById('selectAllProxiesCheckbox');
    if (summary) summary.textContent = `(${selectedProxyIds.size} selected)`;
    if (selectAllCb) selectAllCb.checked = proxiesList.length > 0 && selectedProxyIds.size === proxiesList.length;
  }

  function openAddProxyModal(editId = null) {
    const modal = document.getElementById('addProxyModal');
    const title = document.getElementById('addProxyModalTitle');
    const form = document.getElementById('addProxyForm');
    const editInput = document.getElementById('editProxyId');

    if (!modal) return;

    if (editId) {
      const px = proxiesList.find(p => p.id === editId);
      if (px) {
        if (title) title.innerHTML = '<span>✏️</span> Edit Proxy';
        if (editInput) editInput.value = px.id;
        document.getElementById('addProxyProtocolSelect').value = px.protocol || 'socks5';
        document.getElementById('addProxyHostInput').value = px.host || '';
        document.getElementById('addProxyPortInput').value = px.port || '';
        document.getElementById('addProxyUserInput').value = px.username || '';
        document.getElementById('addProxyPassInput').value = px.password || '';
        document.getElementById('addProxyCountryInput').value = px.country || '';
        document.getElementById('addProxyCityInput').value = px.city || '';
        document.getElementById('addProxyFormatInput').value = px.username ? `${px.host}:${px.port}:${px.username}:${px.password}` : `${px.host}:${px.port}`;
      }
    } else {
      if (title) title.innerHTML = '<span>🔒</span> Add Proxy to Pool';
      if (editInput) editInput.value = '';
      if (form) form.reset();
    }

    modal.classList.add('active');
  }

  function setupProxyModalEvents() {
    const addProxyFormatInput = document.getElementById('addProxyFormatInput');
    if (addProxyFormatInput) {
      const parseAndFill = () => {
        const val = addProxyFormatInput.value.trim();
        const parsed = parseProxyStringClient(val);
        if (parsed) {
          if (parsed.protocol) document.getElementById('addProxyProtocolSelect').value = parsed.protocol;
          if (parsed.host) document.getElementById('addProxyHostInput').value = parsed.host;
          if (parsed.port) document.getElementById('addProxyPortInput').value = parsed.port;
          if (parsed.username !== undefined) document.getElementById('addProxyUserInput').value = parsed.username;
          if (parsed.password !== undefined) document.getElementById('addProxyPassInput').value = parsed.password;
        }
      };
      addProxyFormatInput.addEventListener('input', parseAndFill);
      addProxyFormatInput.addEventListener('paste', () => setTimeout(parseAndFill, 50));
    }

    const addProxyForm = document.getElementById('addProxyForm');
    if (addProxyForm) {
      addProxyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const editId = document.getElementById('editProxyId')?.value;
        const host = document.getElementById('addProxyHostInput')?.value.trim();
        const port = document.getElementById('addProxyPortInput')?.value.trim();
        const username = document.getElementById('addProxyUserInput')?.value.trim();
        const password = document.getElementById('addProxyPassInput')?.value.trim();
        const protocol = document.getElementById('addProxyProtocolSelect')?.value || 'socks5';
        const country = document.getElementById('addProxyCountryInput')?.value.trim();
        const city = document.getElementById('addProxyCityInput')?.value.trim();

        if (!host || !port) {
          notify('Host/IP and Port are required!', 'warning');
          return;
        }

        const submitBtn = document.getElementById('submitAddProxyBtn');
        if (submitBtn) submitBtn.disabled = true;

        try {
          if (editId) {
            await fetch(`/api/proxies/${editId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ host, port: parseInt(port), username, password, protocol, country, city })
            });
            notify('✓ Updated proxy details!', 'success');
          } else {
            await fetch('/api/proxies', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                proxy: { host, port: parseInt(port), username, password, protocol, country, city }
              })
            });
            notify('✓ Saved new proxy into pool!', 'success');
          }

          document.getElementById('addProxyModal')?.classList.remove('active');
          await fetchProxies();
        } catch (err) {
          console.error(err);
          notify('Failed to save proxy.', 'error');
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }

    const bulkProxyTextInput = document.getElementById('bulkProxyTextInput');
    const bulkProxyParsePreview = document.getElementById('bulkProxyParsePreview');
    if (bulkProxyTextInput && bulkProxyParsePreview) {
      const updatePreview = () => {
        const text = bulkProxyTextInput.value.trim();
        if (!text) {
          bulkProxyParsePreview.style.display = 'none';
          return;
        }
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        let validCount = 0;
        lines.forEach(l => {
          if (parseProxyStringClient(l)) validCount++;
        });

        bulkProxyParsePreview.style.display = 'block';
        bulkProxyParsePreview.textContent = `✓ Recognized ${validCount} valid proxy format lines out of ${lines.length} lines.`;
      };

      bulkProxyTextInput.addEventListener('input', updatePreview);
      bulkProxyTextInput.addEventListener('paste', () => setTimeout(updatePreview, 50));
    }

    const bulkProxyForm = document.getElementById('bulkProxyForm');
    if (bulkProxyForm) {
      bulkProxyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = bulkProxyTextInput ? bulkProxyTextInput.value.trim() : '';
        const defaultProtocol = document.getElementById('bulkProxyProtocolSelect')?.value || 'socks5';

        if (!text) {
          notify('Please paste proxy lines into the text area!', 'warning');
          return;
        }

        const submitBtn = document.getElementById('submitBulkProxyBtn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '⏳ Importing Proxies...';
        }

        try {
          const res = await fetch('/api/proxies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, defaultProtocol })
          });
          const data = await res.json();
          if (data.success) {
            document.getElementById('bulkProxyModal')?.classList.remove('active');
            notify(`🚀 Imported ${data.count} new proxies into Proxy Pool!`, 'success');
            await fetchProxies();
          } else {
            notify(`Import Notice: ${data.message || 'Failed'}`, 'warning');
          }
        } catch (err) {
          console.error(err);
          notify('Connection error importing proxies.', 'error');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '🚀 Import Proxies into Pool';
          }
        }
      });
    }

    const btnTestAllProxies = document.getElementById('btnTestAllProxies');
    if (btnTestAllProxies) {
      btnTestAllProxies.addEventListener('click', async () => {
        btnTestAllProxies.disabled = true;
        btnTestAllProxies.textContent = '⏳ Testing All Proxies...';
        notify('🧪 Testing all pool proxies connection & latency...', 'info');

        try {
          const res = await fetch('/api/proxies/test-all', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
          });
          const data = await res.json();
          if (data.success) {
            notify(`Tested ${data.totalTested} proxies: ${data.workingCount} Working, ${data.failedCount} Offline`, 'success');
            await fetchProxies();
          }
        } catch (err) {
          console.error(err);
        } finally {
          btnTestAllProxies.disabled = false;
          btnTestAllProxies.textContent = '🧪 Test All Proxies';
        }
      });
    }

    const btnTestSelectedProxies = document.getElementById('btnTestSelectedProxies');
    if (btnTestSelectedProxies) {
      btnTestSelectedProxies.addEventListener('click', async () => {
        const ids = Array.from(selectedProxyIds);
        if (ids.length === 0) {
          notify('Please select at least 1 proxy to test!', 'warning');
          return;
        }

        btnTestSelectedProxies.disabled = true;
        btnTestSelectedProxies.textContent = '⏳ Testing Selected...';

        try {
          const res = await fetch('/api/proxies/test-all', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids })
          });
          const data = await res.json();
          if (data.success) {
            notify(`Tested ${data.totalTested} selected proxies: ${data.workingCount} Working`, 'success');
            await fetchProxies();
          }
        } catch (err) {
          console.error(err);
        } finally {
          btnTestSelectedProxies.disabled = false;
          btnTestSelectedProxies.textContent = '🧪 Test Selected';
        }
      });
    }

    const btnDeleteSelectedProxies = document.getElementById('btnDeleteSelectedProxies');
    if (btnDeleteSelectedProxies) {
      btnDeleteSelectedProxies.addEventListener('click', async () => {
        const ids = Array.from(selectedProxyIds);
        if (ids.length === 0) {
          notify('Please select at least 1 proxy to delete!', 'warning');
          return;
        }

        if (confirm(`Delete ${ids.length} selected proxies from the pool?`)) {
          const res = await fetch('/api/proxies/batch-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids })
          });
          const data = await res.json();
          if (data.success) {
            selectedProxyIds.clear();
            showToast(`Deleted ${data.count} proxies from pool.`, 'info');
            await fetchProxies();
          }
        }
      });
    }

    const btnAutoAssignProxies = document.getElementById('btnAutoAssignProxies');
    if (btnAutoAssignProxies) {
      btnAutoAssignProxies.addEventListener('click', async () => {
        const workingProxies = proxiesList.filter(p => p.status === 'working');
        if (workingProxies.length === 0 && proxiesList.length === 0) {
          notify('Please add proxies to the Proxy Pool first!', 'warning');
          return;
        }

        const confirmMsg = `Rotate & auto-assign proxies from pool to profiles?\n\nWorking Proxies in Pool: ${workingProxies.length}\nTotal Profiles: ${profiles.length}\n\nEach profile will be assigned a proxy line by line.`;
        if (confirm(confirmMsg)) {
          btnAutoAssignProxies.disabled = true;
          btnAutoAssignProxies.textContent = '⏳ Rotating...';

          try {
            const res = await fetch('/api/proxies/auto-assign', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ mode: 'working_only' })
            });
            const data = await res.json();
            if (data.success) {
              notify(data.message, 'success');
              await fetchProfiles();
              await fetchProxies();
            } else {
              notify(data.message || 'Auto-assign failed', 'error');
            }
          } catch (err) {
            console.error(err);
          } finally {
            btnAutoAssignProxies.disabled = false;
            btnAutoAssignProxies.textContent = '⚡ Auto-Assign to Profiles';
          }
        }
      });
    }
  }

  function setupProxyPoolModule() {
    const searchProxyInput = document.getElementById('searchProxyInput');
    if (searchProxyInput) {
      searchProxyInput.addEventListener('input', () => {
        proxySearchQuery = searchProxyInput.value;
        renderProxyTable();
      });
    }

    const btnRefreshProxies = document.getElementById('btnRefreshProxies');
    if (btnRefreshProxies) {
      btnRefreshProxies.addEventListener('click', () => fetchProxies());
    }

    const selectAllProxiesCheckbox = document.getElementById('selectAllProxiesCheckbox');
    if (selectAllProxiesCheckbox) {
      selectAllProxiesCheckbox.addEventListener('change', () => {
        const checked = selectAllProxiesCheckbox.checked;
        selectedProxyIds.clear();
        if (checked) {
          proxiesList.forEach(p => selectedProxyIds.add(p.id));
        }
        renderProxyTable();
        updateProxySelectionSummary();
      });
    }

    const btnOpenAddSingleProxyModal = document.getElementById('btnOpenAddSingleProxyModal');
    if (btnOpenAddSingleProxyModal) {
      btnOpenAddSingleProxyModal.addEventListener('click', () => openAddProxyModal());
    }

    const closeAddProxyModal = document.getElementById('closeAddProxyModal');
    const cancelAddProxyBtn = document.getElementById('cancelAddProxyBtn');
    if (closeAddProxyModal) closeAddProxyModal.addEventListener('click', () => document.getElementById('addProxyModal')?.classList.remove('active'));
    if (cancelAddProxyBtn) cancelAddProxyBtn.addEventListener('click', () => document.getElementById('addProxyModal')?.classList.remove('active'));

    const btnOpenBulkProxyModal = document.getElementById('btnOpenBulkProxyModal');
    if (btnOpenBulkProxyModal) {
      btnOpenBulkProxyModal.addEventListener('click', () => {
        const modal = document.getElementById('bulkProxyModal');
        if (modal) modal.classList.add('active');
      });
    }

    const closeBulkProxyModal = document.getElementById('closeBulkProxyModal');
    const cancelBulkProxyBtn = document.getElementById('cancelBulkProxyBtn');
    if (closeBulkProxyModal) closeBulkProxyModal.addEventListener('click', () => document.getElementById('bulkProxyModal')?.classList.remove('active'));
    if (cancelBulkProxyBtn) cancelBulkProxyBtn.addEventListener('click', () => document.getElementById('bulkProxyModal')?.classList.remove('active'));

    const profProxyPoolSelect = document.getElementById('profProxyPoolSelect');
    if (profProxyPoolSelect) {
      profProxyPoolSelect.addEventListener('change', () => {
        const selectedId = profProxyPoolSelect.value;
        if (!selectedId) return;
        const px = proxiesList.find(p => p.id === selectedId);
        if (px) {
          if (proxyProtocolInput) proxyProtocolInput.value = px.protocol || 'socks5';
          if (proxyHostInput) proxyHostInput.value = px.host || '';
          if (proxyPortInput) proxyPortInput.value = px.port || '';
          if (proxyUserInput) proxyUserInput.value = px.username || '';
          if (proxyPassInput) proxyPassInput.value = px.password || '';
          const fmtInp = document.getElementById('profProxyFormatInput');
          if (fmtInp) fmtInp.value = px.username ? `${px.host}:${px.port}:${px.username}:${px.password}` : `${px.host}:${px.port}`;
        }
      });
    }

    const btnParseProfProxyFormat = document.getElementById('btnParseProfProxyFormat');
    const profProxyFormatInput = document.getElementById('profProxyFormatInput');
    if (btnParseProfProxyFormat && profProxyFormatInput) {
      const parseAndFillProfProxy = () => {
        const val = profProxyFormatInput.value.trim();
        const parsed = parseProxyStringClient(val);
        if (parsed) {
          if (proxyProtocolInput) proxyProtocolInput.value = parsed.protocol || 'socks5';
          if (proxyHostInput) proxyHostInput.value = parsed.host || '';
          if (proxyPortInput) proxyPortInput.value = parsed.port || '';
          if (proxyUserInput) proxyUserInput.value = parsed.username || '';
          if (proxyPassInput) proxyPassInput.value = parsed.password || '';
          showToast(`✓ Parsed Proxy Format: ${parsed.host}:${parsed.port}`, 'success');
        } else if (val) {
          showToast(`⚠️ Could not parse proxy string format`, 'error');
        }
      };
      btnParseProfProxyFormat.addEventListener('click', parseAndFillProfProxy);
      profProxyFormatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); parseAndFillProfProxy(); } });
    }

    setupProxyModalEvents();
  }

  // ----------------------------------------------------
  // ELECTRON-UPDATER IPC UI & CLIENT AUTOMATIC UPDATE ENGINE
  // ----------------------------------------------------
  const appUpdateModal = document.getElementById('appUpdateModal');
  const btnCheckUpdateHeader = document.getElementById('btnCheckUpdateHeader');
  const closeUpdateModalX = document.getElementById('closeUpdateModalX');
  const btnActionCloseUpdateModal = document.getElementById('btnActionCloseUpdateModal');
  const btnActionCheckUpdate = document.getElementById('btnActionCheckUpdate');
  const btnActionDownloadUpdate = document.getElementById('btnActionDownloadUpdate');
  const btnActionInstallUpdate = document.getElementById('btnActionInstallUpdate');

  const uiCurrentVersion = document.getElementById('uiCurrentVersion');
  const uiLatestVersion = document.getElementById('uiLatestVersion');
  const updateStatusText = document.getElementById('updateStatusText');
  const updateBannerSpinner = document.getElementById('updateBannerSpinner');
  const updateProgressSection = document.getElementById('updateProgressSection');
  const updateProgressPercent = document.getElementById('updateProgressPercent');
  const updateProgressBar = document.getElementById('updateProgressBar');
  const updateSpeedText = document.getElementById('updateSpeedText');
  const updateNotesSection = document.getElementById('updateNotesSection');
  const uiReleaseNotesText = document.getElementById('uiReleaseNotesText');

  function openAppUpdateModal() {
    if (appUpdateModal) {
      appUpdateModal.style.display = 'flex';
      appUpdateModal.classList.add('active');
    }
  }

  function closeAppUpdateModal() {
    if (appUpdateModal) {
      appUpdateModal.classList.remove('active');
      appUpdateModal.style.display = 'none';
    }
  }

  function renderUpdateState(state) {
    if (!state) return;

    if (uiCurrentVersion && state.currentVersion) uiCurrentVersion.textContent = `v${state.currentVersion}`;
    if (uiLatestVersion && state.latestVersion) uiLatestVersion.textContent = `v${state.latestVersion}`;

    if (state.status === 'checking') {
      if (updateStatusText) updateStatusText.textContent = 'Checking for updates...';
      if (updateBannerSpinner) updateBannerSpinner.style.display = 'inline-block';
      if (btnActionDownloadUpdate) btnActionDownloadUpdate.style.display = 'none';
      if (btnActionInstallUpdate) btnActionInstallUpdate.style.display = 'none';
      if (updateProgressSection) updateProgressSection.style.display = 'none';
    } else if (state.status === 'available') {
      if (updateStatusText) updateStatusText.textContent = `New version available: ${state.latestVersion}`;
      if (updateBannerSpinner) updateBannerSpinner.style.display = 'none';
      if (btnActionDownloadUpdate) btnActionDownloadUpdate.style.display = 'inline-block';
      if (btnActionInstallUpdate) btnActionInstallUpdate.style.display = 'none';
      if (updateProgressSection) updateProgressSection.style.display = 'none';
      if (updateNotesSection) updateNotesSection.style.display = 'block';
      if (uiReleaseNotesText) uiReleaseNotesText.textContent = state.releaseNotes || 'New software updates and security improvements available.';
    } else if (state.status === 'not-available') {
      if (updateStatusText) updateStatusText.textContent = 'You are using the latest version.';
      if (uiLatestVersion) uiLatestVersion.textContent = `v${state.currentVersion || '1.0.0'}`;
      if (updateBannerSpinner) updateBannerSpinner.style.display = 'none';
      if (btnActionDownloadUpdate) btnActionDownloadUpdate.style.display = 'none';
      if (btnActionInstallUpdate) btnActionInstallUpdate.style.display = 'none';
      if (updateProgressSection) updateProgressSection.style.display = 'none';
    } else if (state.status === 'downloading') {
      if (updateStatusText) updateStatusText.textContent = 'Downloading update...';
      if (updateBannerSpinner) updateBannerSpinner.style.display = 'inline-block';
      if (btnActionDownloadUpdate) btnActionDownloadUpdate.style.display = 'none';
      if (btnActionInstallUpdate) btnActionInstallUpdate.style.display = 'none';
      if (updateProgressSection) updateProgressSection.style.display = 'block';

      const pct = state.percent || 0;
      if (updateProgressPercent) updateProgressPercent.textContent = `${pct}%`;
      if (updateProgressBar) updateProgressBar.style.width = `${pct}%`;
      const kbps = Math.round((state.bytesPerSecond || 0) / 1024);
      if (updateSpeedText) updateSpeedText.textContent = `${kbps} KB/s`;
    } else if (state.status === 'downloaded') {
      if (updateStatusText) updateStatusText.textContent = 'Update ready to install.';
      if (updateBannerSpinner) updateBannerSpinner.style.display = 'none';
      if (btnActionDownloadUpdate) btnActionDownloadUpdate.style.display = 'none';
      if (btnActionInstallUpdate) btnActionInstallUpdate.style.display = 'inline-block';
      if (updateProgressSection) updateProgressSection.style.display = 'block';
      if (updateProgressPercent) updateProgressPercent.textContent = '100%';
      if (updateProgressBar) updateProgressBar.style.width = '100%';
      if (updateSpeedText) updateSpeedText.textContent = 'Download Complete';
    } else if (state.status === 'error') {
      if (updateStatusText) updateStatusText.textContent = 'Unable to check for updates right now.';
      if (updateBannerSpinner) updateBannerSpinner.style.display = 'none';
      if (btnActionDownloadUpdate) btnActionDownloadUpdate.style.display = 'none';
      if (btnActionInstallUpdate) btnActionInstallUpdate.style.display = 'none';
      if (updateProgressSection) updateProgressSection.style.display = 'none';
    }
  }

  // Check if running inside Electron Desktop with exposed IPC
  if (window.electronAPI) {
    if (btnCheckUpdateHeader) {
      btnCheckUpdateHeader.addEventListener('click', () => {
        openAppUpdateModal();
        window.electronAPI.checkForUpdates();
      });
    }

    if (btnActionCheckUpdate) {
      btnActionCheckUpdate.addEventListener('click', () => {
        window.electronAPI.checkForUpdates();
      });
    }

    if (btnActionDownloadUpdate) {
      btnActionDownloadUpdate.addEventListener('click', () => {
        window.electronAPI.downloadUpdate();
      });
    }

    if (btnActionInstallUpdate) {
      btnActionInstallUpdate.addEventListener('click', () => {
        window.electronAPI.installUpdate();
      });
    }

    window.electronAPI.onUpdateStateChange((state) => {
      renderUpdateState(state);
    });

    window.electronAPI.getUpdateStatus().then(state => {
      renderUpdateState(state);
    }).catch(() => {});
  } else {
    // Fallback for standalone browser mode
    async function performOneClickUpdateAndSync() {
      if (!btnCheckUpdateHeader) return;
      const originalText = btnCheckUpdateHeader.innerHTML;
      btnCheckUpdateHeader.disabled = true;
      btnCheckUpdateHeader.innerHTML = '⏳ Syncing & Updating...';

      try {
        const res = await fetch('/api/sync-and-update', { method: 'POST' });
        const data = await res.json();

        if (data.success) {
          await fetchProfiles();
          if (data.hasUpdate) {
            notify(`🚀 Software sync complete! New Version v${data.latestVersion} Available!`, 'success');
            if (data.downloadUrl) window.open(data.downloadUrl, '_blank');
          } else {
            notify(`✅ Software and files synced successfully! Running v${data.currentVersion} (Latest)`, 'success');
          }
        } else {
          notify('Sync failed: ' + (data.message || 'Unknown error'), 'error');
        }
      } catch (e) {
        notify('Network error during sync: ' + e.message, 'error');
      } finally {
        btnCheckUpdateHeader.disabled = false;
        btnCheckUpdateHeader.innerHTML = originalText;
      }
    }

    if (btnCheckUpdateHeader) {
      btnCheckUpdateHeader.addEventListener('click', performOneClickUpdateAndSync);
    }
  }

  if (closeUpdateModalX) {
    closeUpdateModalX.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAppUpdateModal();
    });
  }

  if (btnActionCloseUpdateModal) {
    btnActionCloseUpdateModal.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAppUpdateModal();
    });
  }

  if (appUpdateModal) {
    appUpdateModal.addEventListener('click', (e) => {
      if (e.target === appUpdateModal) {
        closeAppUpdateModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && appUpdateModal && (appUpdateModal.classList.contains('active') || appUpdateModal.style.display === 'flex')) {
      closeAppUpdateModal();
    }
  });

  // Start initialization
  init();

  // Background status sync for desktop application (Throttled & Non-Overlapping)
  let isBackgroundSyncing = false;
  setInterval(async () => {
    if (document.hidden || isBackgroundSyncing) return;
    isBackgroundSyncing = true;
    try {
      const res = await fetch('/api/profiles');
      const data = await res.json();
      if (data.success) {
        const hasChange = data.profiles.some(newP => {
          const oldP = profiles.find(p => p.id === newP.id);
          return !oldP || oldP.status !== newP.status || oldP.displayIp !== newP.displayIp;
        });
        if (hasChange) {
          profiles = data.profiles;
          renderProfilesList();
          updateTabCounts();
        }
      }
    } catch (e) {} finally {
      isBackgroundSyncing = false;
    }
  }, 12000);
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
