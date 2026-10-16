# NovaRetail Internal IT Support Handbook

Company: NovaRetail | Owner: IT Operations | Internal use only.

## VPN Access and Remote Work

Employees working outside the office must use the company VPN before accessing internal systems such as the intranet, ERP, inventory platform, and file servers.

Installation: download the NovaSecure VPN client from the internal Software Portal (Start Menu > NovaRetail > Software Portal). Sign in with your company email and password, complete the MFA prompt, and select the closest corporate gateway: `vpn-sp.novaretail.corp`, `vpn-mx.novaretail.corp`, or `vpn-lis.novaretail.corp`.

Troubleshooting, in order:
1. Confirm you have working internet access by opening any public website.
2. Restart the NovaSecure VPN client from the system tray (right-click > Restart).
3. Try a different corporate gateway, for example switch from `vpn-sp` to `vpn-mx`.
4. Make sure your computer clock is set to automatic time sync; certificate validation fails when the clock is off by more than 5 minutes.
5. If the error is `AUTH-401`, your password may be expired — reset it first (see Password Reset Policy).
6. If the error is `GW-503`, the gateway is down; try another gateway and check the IT status page.

Never disable endpoint security, the firewall, or the Always-On policy to make the VPN work. These actions are blocked by policy and are reported to Security. If the problem remains after the steps above, open an IT ticket (P2 if you are blocked from working) with a screenshot of the error and the gateway name you tried.

Split tunneling is not allowed. All remote traffic to company systems must go through the VPN. Personal browsing does not need to go through the VPN.

## Password Reset Policy

Company passwords must be at least 14 characters and must not be reused from the last 10 passwords.

Self-service reset: go to `id.novaretail.corp`, choose "Forgot password", answer the security questions or approve the push on the authenticator app, and set a new password. The new password takes up to 10 minutes to sync to email, VPN, and the ERP.

Account lock: after 5 failed login attempts the account is locked for 15 minutes. Locked accounts unlock automatically; do not wait if you need access immediately — call the Service Desk for an immediate unlock (extension 4357, "HELP").

If self-service recovery fails (for example, you lost your phone and cannot approve the MFA push), contact the IT Service Desk. Identity verification is required: the Service Desk will ask for your employee ID, manager name, and a video call with a photo ID. Temporary access is issued as a one-time code valid for 24 hours.

Employees must never share passwords or MFA codes with support personnel. IT staff will never ask for your password. Report anyone who does.

Password age: passwords expire every 365 days. You will receive reminders at 30, 7, and 1 day before expiry.

## Multi-Factor Authentication

MFA is mandatory for email, VPN, cloud administration, and all other protected company systems.

Approved methods, in order of preference:
1. NovaAuthenticator app (push notification) — available on iOS and Android from the company app store.
2. Registered hardware security key (YubiKey 5 NFC) — issued by the Service Desk for IT staff and executives.
3. SMS one-time code — only enabled as a recovery method for specific users; request activation through your manager.

To enroll a new device: open `id.novaretail.corp` > Security > Add MFA device. You must enroll at least two methods (for example, app + hardware key) so you are never locked out if you lose your phone.

To replace a lost phone: report it immediately to the Service Desk (extension 4357). The old device registration is revoked within 15 minutes and a temporary code is issued while you re-enroll.

Phishing-resistant MFA (hardware key only) is required for accounts with cloud administration rights (Azure AD, AWS root, ERP admin).

## Software Installation

Employees should install business software only from the company Software Portal. The portal includes Microsoft 365 apps, Adobe Acrobat, Slack, Zoom, 7-Zip, Visual Studio Code, Python 3.12, Node.js LTS, and the NovaRetail POS Simulator.

Requests for software not listed in the portal require manager approval and IT security review. Process: submit a Software Request ticket (category: Software > New Application) with the business justification. Review takes up to 3 business days. Approved applications are added to the portal.

Administrator access is not granted simply to install unapproved applications. Local admin rights are temporary, time-boxed to 8 hours, and logged. Standing admin rights are only granted to the IT Operations and Security teams.

Blocked categories that will not be approved: peer-to-peer torrent clients, unlicensed software, personal VPN clients, and any tool that can disable endpoint security.

## Laptop Standards and Equipment

Standard employee laptop: Lenovo ThinkPad T14 (Windows 11 Enterprise, 32 GB RAM). Developer laptop: MacBook Pro 14" (macOS, 36 GB RAM) on request with manager approval.

Peripherals available from the Service Desk with manager approval: second monitor (27"), docking station (USB-C), wireless keyboard/mouse set, noise-cancelling headset, and adjustable laptop stand.

Laptop refresh cycle: 4 years. The Service Desk contacts you 60 days before your refresh date. Data migration to the new device is free and scheduled through the IT portal; bring the old laptop to the appointment.

Loaner laptops are available for up to 5 business days. Request a loaner with a P3 ticket. Loaners are imaged with a standard profile and wiped on return.

## Lost or Stolen Laptop or Phone

Immediately report a lost or stolen company laptop, phone, or security key to the IT Service Desk (extension 4357, 24/7 line) and your manager.

Provide: the device asset tag (printed on a sticker on the bottom of the laptop), the serial number if available, the last known location, and the approximate time you noticed the loss.

What happens next:
1. IT initiates remote lock within 15 minutes of the report.
2. IT initiates remote wipe within 1 hour for devices that are online; wipe runs when the device next connects.
3. Security is notified automatically for laptops with customer data.
4. Your accounts remain active; only device certificates are revoked. If the device had cached credentials, the Service Desk forces a password reset.

Do not attempt to remotely recover the device yourself. Do not confront a suspected thief. File a police report and send the report number to Security.

Replacement device: a standard loaner is issued immediately; the permanent replacement follows the normal equipment request process with manager approval.

## Email and Microsoft 365

Company email is hosted on Microsoft 365. Web access: `outlook.office.com` or `mail.novaretail.corp`. Mobile access: Outlook app, configured with the NovaAuthenticator for MFA.

Mailbox quota: 100 GB per user. When you reach 90%, you receive a warning; archive older mail via Outlook > Folder > Clean Up. Shared mailboxes: 50 GB.

Distribution lists: request a new distribution list or membership change via the Service Desk portal (category: Email > Distribution List). Membership changes are applied within 1 business day.

External email is tagged with `[EXTERNAL]` in the subject. Do not click links or open attachments in external emails without verifying the sender through a second channel.

Rules that forward company email to personal addresses are blocked by DLP policy and generate a Security alert.

## Wi-Fi and Network in Offices

Corporate Wi-Fi network: `NovaCorp` (WPA3-Enterprise, certificate-based). Guest network: `NovaGuest` (password published on posters in meeting rooms, changes quarterly).

Conference rooms: every meeting room has a room PC, a wireless presentation button (NovaCast), and a VoIP phone. To present: plug the NovaCast button into your laptop via USB-C, then press the button once. Wi-Fi Direct fallback: connect to `NovaCast-Setup` network and open `http://192.168.88.1`.

Factory and warehouse floors use wired terminals only; Wi-Fi is not available on the floor. Report any access point with a red status LED to the Service Desk.

## Meeting Room and VoIP Phone Issues

If a VoIP phone does not dial: check the ethernet cable, then reboot the phone by unplugging the power for 10 seconds. If the display stays blank, the phone is dead — report the room number and phone model (Poly CCX 400 or 500) to the Service Desk.

Conference room PC will not display: press Ctrl+P on the room PC to switch output, or reboot the PC via the physical power button (hold 5 seconds). If the projector shows "No signal", check that the room PC is selected as the source on the projector remote.

## Printers

Follow-me printing: send print jobs to the `NovaPrint` queue, then release them at any multi-function printer with your badge. Jobs are held for 4 hours.

Printer locations: 2nd floor next to the coffee point, 3rd floor in the west corridor, and logistics office on the ground floor.

If a printer jams: open the front panel, pull the paper path gently in the direction of the arrows, remove torn pieces, and close the panel. Do not remove the fuser. Report persistent jams (same printer, 3+ times in a week) with a P4 ticket including the printer asset tag.

## Onboarding and Offboarding

New hire onboarding: IT receives the ticket from HR 5 business days before the start date. The new hire gets: laptop configured and imaged, accounts created (email, VPN, ERP read-only, Slack), badge with network access, and a 30-minute onboarding call on day 1. Manager chooses extra ERP roles.

Offboarding: HR submits the termination ticket with the last working day. IT disables all accounts at 18:00 on the last working day, performs remote wipe of mobile devices within 1 hour, recovers equipment (laptop, badge, security key) by the end of the next business day, and preserves the mailbox for 90 days for legal hold if requested.

## Security Policies Summary

- Full-disk encryption (BitLocker / FileVault) is enabled on all laptops. The recovery key is escrowed automatically; do not print it.
- Endpoint protection: CrowdStrike Falcon. Do not uninstall or pause it — contact IT if it interferes with legitimate work.
- USB mass storage is blocked on standard laptops. Use of USB storage requires an approved exception ticket from Security.
- Customer data (POS transaction logs, customer emails) must never be copied to personal devices or personal cloud storage.
- Report phishing: use the Report button in Outlook, or forward the message to `phishing@novaretail.corp`. Security responds within 4 hours during business hours.

## Service Desk Contacts and Hours

- Portal: `servicedesk.novaretail.corp` (24/7 for ticket submission)
- Phone extension: 4357 ("HELP") — business hours 08:00–18:00 local time
- Emergency after-hours line: +351 210 000 4357 — P1 incidents only (company-wide outage, security incident, lost stolen device)
- Walk-in: Building A, ground floor, room 0.12 — business hours

Ticket response SLA (business hours):
- P1: 15 minutes, resolution target 4 hours
- P2: 1 hour, resolution target 8 hours
- P3: 4 hours, resolution target 2 business days
- P4: 1 business day, resolution target 5 business days
