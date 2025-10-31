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

```javascript
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
```

- **`PROPERTIES`** → List of properties whose history you want to pull.  
- **`SEARCH_PROPERTIES`** → Properties used to find relevant contacts.  
- **`HUBSPOT_ACCESS_TOKEN`** → HubSpot private app token (replace with your own).

---

## 🧠 How It Works

### 🪄 1. Adds Custom Menu in Google Sheets

When the sheet opens, a new menu called **“HubSpot Data”** appears with the option:

```
HubSpot Data → Pull Property History by Email
```

Running this option starts the entire workflow.

---

### 🔍 2. Searches Contacts in HubSpot

**Function:** `searchContactsWithProperties()`

- Calls the HubSpot **Search API** (`/crm/v3/objects/contacts/search`).
- Finds all contacts that have **at least one of the specified properties**.
- Fetches results in pages of 200 until all matching contacts are retrieved.

---

### 🧩 3. Reads Property History (Batch API)

**Function:** `batchReadContactsWithHistoryByEmail()`

- Uses HubSpot **Batch Read API** (`/crm/v3/objects/contacts/batch/read`).
- Reads contacts by their **email** (`idProperty: 'email'`).
- Pulls both the **current values** and **historical values** of each requested property.

---

### 📊 4. Writes Data to Google Sheets

**Function:** `writeHistoryToSheet()`

- Each property’s data is stored in a **separate sheet/tab**.
- Columns include:
  - Email
  - Value 1, Timestamp 1
  - Value 2, Timestamp 2
  - (and so on for each change in history)
- The script dynamically adjusts the number of columns based on the longest history.

---

## 📁 Output Example

Each sheet (e.g., `status_of_acca_sitting`) will look like this:

| Email | Value 1 | Timestamp 1 | Value 2 | Timestamp 2 |
|--------|----------|-------------|----------|-------------|
| john.doe@example.com | Applied | 2024-01-10 12:45:00 | Approved | 2024-02-15 09:30:00 |

---

## ⚡ Menu and Logging

- Adds a **custom menu** on open.
- Uses `Logger.log()` extensively to show batch progress, API calls, and errors.

---

## 🧱 File Structure

```
📁 HubSpot-Property-History/
├── Code.gs
└── README.md
```

---

## 🚀 Usage Steps

1. Open your **Google Sheet**.
2. Go to **Extensions → Apps Script**.
3. Paste the full code into a new file named `Code.gs`.
4. Replace the `HUBSPOT_ACCESS_TOKEN` with your HubSpot private app token.
5. Save and refresh the sheet.
6. Use menu → **HubSpot Data → Pull Property History by Email**.

---

## 🧩 Tech Stack

- **Google Apps Script (JavaScript)**
- **HubSpot CRM API v3**
- **Google Sheets API**

---

## 🛠️ Author

Developed by **Shubham Nigam** reach out to  over linkedin for any help - https://www.linkedin.com/in/shubham-snigam/

---

## 🪪 License

This script is licensed under the **MIT License**.  
Feel free to use and modify it for your own workflow.
****
