# 🛡️ SOC Analyst Simulator — Incident Response & Triage Console

An interactive, browser-based Security Operations Center (SOC) triage simulator that trains aspiring cybersecurity professionals on real-world log analysis, alert triage, and incident escalation workflows.

🎮 **[Play the Live Simulator Here](https://mckenzielewis348-wq.github.io/soc-analyst-simulator/)**

---

## 🚀 Key Features

* **Real-World Log Triage**: Practice inspecting JSON/Syslog data streams including Windows Event Logs (EventID 4688), PowerShell commands, SSH authentication logs, and AWS CloudTrail events.
* **Multi-Domain Incident Scenarios**: Covers key security disciplines:
  * 🖥️ **Endpoint & Network Security**: Obfuscated PowerShell execution, brute-force SSH detection.
  * 🎣 **Phishing & Email Security**: Header analysis, SPF/DKIM verification, lookalike domains, macro malware.
  * 🦠 **Malware & Ransomware**: Suspicious binary behavior, file encryption patterns, C2 outbound beaconing.
  * ☁️ **Cloud Security**: AWS IAM access key leaks, public S3 bucket exposure, Entra ID AitM session hijacking.
  * 🚨 **APT Boss Scenario**: Full web server webshell exploitation and multi-gigabyte database exfiltration.
* **Analyst Performance Engine**: Real-time tracking of closed tickets, accuracy percentage, and dynamic rank promotion (from *Tier 1 Trainee* to *Principal SOC Lead*).

---

## 🛠️ Tech Stack

* **Frontend**: HTML5, CSS3 (Modern Flexbox/Grid Layouts, Dark Mode Terminal Palette)
* **Application Logic**: Vanilla JavaScript (ES6+, DOM Manipulation, Dynamic Log Rendering)
* **Hosting & CI/CD**: GitHub Pages

---

## 🕹️ How to Play

1. **Inspect Alerts**: Select an incoming security alert from the left panel queue.
2. **Analyze Raw Logs**: Review IP addresses, timestamps, usernames, process commands, and headers in the SIEM log viewer.
3. **Make a Triage Decision**:
   * **Dismiss (False Positive)**: For benign standard operations or authorized activity.
   * **Remediate (Low/Medium Risk)**: For contained threats requiring quick automated blocks or ACL adjustments.
   * **Escalate Incident (High Risk)**: For active exploitation, malware execution, or credential leaks.
4. **Review Feedback**: Learn *why* a triage choice was correct or incorrect based on industry standards.

---

## 📂 Project Structure

```text
soc-analyst-simulator/
│
├── index.html     # Dashboard layout, metric counters, and triage panels
├── style.css      # SOC dark-mode UI styling and responsive grids
└── app.js         # SIEM alert database, evaluation engine, and rank tracker
