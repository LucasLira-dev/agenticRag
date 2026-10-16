# IT Service Desk Runbook

Operating procedures for the NovaRetail IT Service Desk. Use this runbook before escalating any ticket.

## Ticket Intake and Triage

Always capture: employee name and ID, department and location, device asset tag, exact error message or screenshot, when the problem started, whether the issue affects one user or many, and what the user already tried.

Ask "is this affecting only you, or your whole team/floor?" in the first two minutes. This single question separates an individual fix from a potential P1/P2 incident and prevents wasted effort.

If the employee cannot work at all and there is no workaround, tag the ticket P2 or higher and proceed with troubleshooting immediately instead of queuing it.

## Email Troubleshooting

Symptoms: cannot send or receive email, mail stuck in the Outbox, repeated credential prompts, or mailbox full warnings.

First, confirm whether the issue affects one user or many:
- Open the service status dashboard (`status.novaretail.corp`) and check Microsoft 365 service health.
- Ask colleagues in the same department whether they see the same problem.

Single user fix, in order:
1. Sign out and back in to Outlook (both desktop and web).
2. Verify the mailbox quota: Outlook > File > Info. Under 5 GB free, clear the Deleted Items and Archive.
3. Test the web client at `outlook.office.com`. If web works but the desktop app does not, repair the local profile (Control Panel > Mail > Show Profiles > create a new profile).
4. Check for a full OST cache: rename the local `.ost` file and let Outlook rebuild it.
5. Confirm the device clock is correct; skew breaks modern authentication.
6. Confirm the user did not just change their password: cached credentials may cause repeated prompts. Re-authenticate and approve the MFA push.

Widespread incident (many users): do not ask each user to reinstall software. Escalate the suspected service incident to the Microsoft 365 admin team with the service name, start time, number of affected users, and one representative screenshot. Post an update on the status dashboard.

## VPN Connectivity

If a remote user cannot connect to the VPN, check in this order: internet connectivity, correct gateway, expired password (`AUTH-401`), gateway outage (`GW-503`), and clock skew. Have the user try a second gateway before opening a ticket with the network team. Never instruct users to disable endpoint security or the firewall.

## Password and Account Lockouts

Locked account: after 5 failed attempts the account locks for 15 minutes. Verify identity (employee ID, manager name, video ID check), then unlock and reset from the identity console. Issue a one-time code valid for 24 hours if the user cannot approve MFA.

Expired password: passwords expire every 365 days. Direct the user to `id.novaretail.corp` for self-service reset; confirm the change syncs within 10 minutes.

## Laptop Performance

For a slow laptop, check in order: CPU and memory usage in Task Manager, free storage space (keep at least 15% free), startup applications, pending OS updates, and endpoint security scan status.

Remediation steps:
1. Close or disable unnecessary startup apps (Task Manager > Startup).
2. Run disk cleanup and clear the temp folders.
3. Install pending OS and driver updates, then reboot.
4. Run a full endpoint security scan; if it found and removed malware, verify performance after reboot.
5. If the disk is above 90% full, move user data to OneDrive and clear local copies.

Do not disable security agents as a troubleshooting shortcut.

Escalate to hardware when: diagnostics report a failing disk or battery, the laptop shuts down repeatedly after software remediation, or it overheats and throttles. Record the diagnostics result in the ticket.

## Wi-Fi and Network Issues

For a user who cannot reach `NovaCorp` Wi-Fi: forget and rejoin the network, confirm the device certificate is valid, and reboot. If authentication fails with a certificate error, re-enroll the device via `id.novaretail.corp` > Devices. Guest access uses `NovaGuest` with the current quarterly password.

Wired floor terminals: check cable and switch port. Report any access point with a red status LED to the network team with the AP label.

## Peripherals, Docking Stations and Monitors

If a docking station or monitor is not detected: reseat the USB-C cable, try another port, update the dock firmware from the Software Portal, and reboot. If the monitor shows no signal, confirm the correct input source and test with a second cable. Escalate if the dock fails on a second known-good laptop.

## Printer and Scanner Issues

Follow-me printing jobs are held for 4 hours on the `NovaPrint` queue. If a badge does not release a job, re-register the badge at the printer panel. For persistent jams on the same printer (3+ per week), open a P4 ticket with the printer asset tag and request a maintenance visit.

## Meeting Room and AV Support

Room PC will not display: check the input source on the projector, press Ctrl+P on the room PC, and reboot the room PC. NovaCast button not working: unplug and reinsert the USB-C button; fall back to `NovaCast-Setup` at `http://192.168.88.1`. Report dead VoIP phones with the room number and phone model.

## Account Provisioning and Access Changes

New hire: IT receives the onboarding ticket 5 business days before the start date; deliver accounts, imaged laptop, badge, and a day-1 onboarding call. Offboarding: disable all accounts at 18:00 on the last working day, wipe mobile devices within 1 hour, recover equipment the next business day, and preserve the mailbox for 90 days when legal hold is requested.

Access change requests (ERP roles, shared mailboxes, distribution lists) require manager approval and are applied within 1 business day.

## Security Incidents and Escalation

Escalate immediately to the Security team:
- Suspected phishing or business email compromise.
- Lost or stolen device containing company or customer data.
- Ransomware, or files renamed with unfamiliar extensions.
- Any request to share a password or MFA code.

On a suspected malware infection: disconnect the device from the network (do not power off, to preserve evidence), notify Security, and do not attempt to clean the machine yourself. Security decides on reimaging.

## Ticket Priority

- P1: company-wide outage or critical security incident. Response 15 minutes, resolution target 4 hours.
- P2: major team blocked with no workaround. Response 1 hour, resolution target 8 hours.
- P3: individual user blocked or degraded with a limited workaround. Response 4 hours, resolution target 2 business days.
- P4: standard request, information request, or low-impact issue. Response 1 business day, resolution target 5 business days.

Always state the chosen priority and the reason in the ticket, and update the user before closing when the resolution was not fully verified by them.
