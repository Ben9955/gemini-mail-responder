# 📬 Email Reply Generator

This is a full-stack project that includes:

- 🧩 A **Chrome Extension** that integrates into Gmail to generate AI-based email replies.
- 🌐 A **Frontend Web App** for manually generating replies using a form.
- 🖥 A **Spring Boot Backend** that handles the email processing and AI generation logic.

---

## 📁 Project Structure

---

## ✨ Features

### ✅ Chrome Extension

- Detects when a Gmail compose window appears
- Adds a custom **AI Reply** button to the Gmail UI
- Sends the email content to your backend
- Inserts the AI-generated response into the Gmail reply box

### ✅ Web Frontend

- Simple form with:
  - Text area for original email
  - Select dropdown for tone
  - Submit button to generate reply
- Displays generated reply for easy copy-paste

### ✅ Spring Boot Backend

- Exposes a `/api/email/generate` endpoint
- Accepts email content and tone
- Returns AI-generated reply using any text generation API (e.g., OpenAI)
