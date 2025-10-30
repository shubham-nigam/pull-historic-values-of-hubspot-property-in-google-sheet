# 🧩 HubSpot Property History Pull Script (Google Apps Script)

## 📘 Overview

This Google Apps Script connects Google Sheets with HubSpot to **fetch and log property history for contacts** based on their email addresses.  
It retrieves all past changes for selected HubSpot contact properties and writes them into separate tabs in a Google Sheet.

---

## 🎯 Objective

The goal of this script is to:
- Search HubSpot contacts that have certain properties set.
- Retrieve **historical changes** (not just current values) for specific contact properties.
- Store that data neatly into Google Sheets — one sheet per property — for easy review and analysis.

---

## ⚙️ Configuration

```js
const HUBSPOT_ACCESS_TOKEN = 'YOUR_HUBSPOT_PRIVATE_APP_TOKEN';

const PROPERTIES = [
  'Property_1',
  'Property_2',
  'Property_3',
  'Property_4',
];

const SEARCH_PROPERTIES = [
  'Property_3',
];



PROPERTIES → List of properties whose history you want to pull.

SEARCH_PROPERTIES → Properties used to find relevant contacts.

HUBSPOT_ACCESS_TOKEN → HubSpot private app token (replace with your own).

🧠 How It Works
1. Adds Custom Menu in Google Sheets

When the sheet opens, a new menu called “HubSpot Data” appears with the option:

HubSpot Data → Pull Property History by Email


Running this option starts the entire workflow.

2. Searches Contacts in HubSpot

Function: searchContactsWithProperties()

Calls the HubSpot Search API (/crm/v3/objects/contacts/search).

Finds all contacts that have at least one of the specified properties.

Fetches results in pages of 200 until all matching contacts are retrieved.

3. Reads Property History (Batch API)

Function: batchReadContactsWithHistoryByEmail()

Uses HubSpot Batch Read API (/crm/v3/objects/contacts/batch/read).

Reads contacts by their email (idProperty: 'email').

Requests:

The latest property values.

The entire history of each property listed in PROPERTIES.

4. Writes Results to Google Sheets

Function: writeHistoryToSheet()

Creates or clears a sheet for each property (e.g., acca_enrollment_year).

Appends rows for each contact showing their historical property values and timestamps.

Adjusts columns dynamically based on how many history entries exist.

Example output:

Email	Value 1	Timestamp 1	Value 2	Timestamp 2
test@example.com
	2023	10/02/2024 14:22	2024	15/05/2025 10:11
5. Batching & Logging

Function: pullPropertyHistoryByEmail()

Processes contacts in batches of 50 (HubSpot’s API limit).

Loops through each batch and property.

Logs all progress and errors using Logger.log() for transparency.

🧾 Script Flow Summary

User clicks:
HubSpot Data → Pull Property History by Email

Script executes:

Searches HubSpot contacts with defined properties.

Fetches their property change history.

Writes results into Google Sheets (1 sheet per property).

Output:
Google Sheets with contact email, all historical property values, and timestamps.

🧱 Tech Stack
Component	Description
Google Apps Script	Runs inside Google Sheets
HubSpot CRM API (v3)	Fetches contacts and property histories
Google Sheets	Stores and visualizes property history data
🧩 Key API Endpoints Used

Search contacts:
POST https://api.hubapi.com/crm/v3/objects/contacts/search

Batch read contacts with history:
POST https://api.hubapi.com/crm/v3/objects/contacts/batch/read

📦 Output Example

You’ll see new sheets like:

status_of_acca_sitting

submitted_for_acca

subject_registered_acca

acca_enrollment_year

Each sheet contains:

Email | Value 1 | Timestamp 1 | Value 2 | Timestamp 2 | ...

🧰 Logging & Debugging

You can check detailed logs in:

Extensions → Apps Script → View → Logs


Each step logs information such as:

Number of contacts found

API responses

Warnings for missing data

Errors in API calls

🧑‍💻 Author

Developed collaboratively using ChatGPT (GPT-5) to automate HubSpot data extraction for reporting and historical tracking.

📄 License

This script is free to use and modify for internal or educational purposes.
Ensure you keep your HubSpot private app token secure and do not publish it publicly.
