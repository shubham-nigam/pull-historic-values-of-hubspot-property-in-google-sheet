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

# How it works
