# EchoAid – Voice-first AI Platform for Social Welfare Access  
👥 Built by Team Hexecutioners | HackaTone Round 1 Submission  
🎯 Problem Statement #2 – Unlocking Access: The Digital Companion for Social Welfare

---

## 🔎 Overview

**EchoAid** is a voice-first, multilingual AI system designed to connect India's most marginalized populations—such as migrant workers, trans individuals, the homeless, and undocumented citizens—to critical government welfare schemes, emergency aid, and verified NGOs.

Accessible via simple phone calls or WhatsApp voice notes, EchoAid removes barriers of language, literacy, identity documents, and digital access. It is empathy-driven, privacy-conscious, and tailored for real-world conditions (even 2G networks and feature phones).

---

## 🌍 Core Features

| Feature                     | Description |
|----------------------------|-------------|
| 🗣️ **Voice Input**         | Accepts natural speech input like “I lost my job”, “I need food”, or “I need shelter”. |
| 🧠 **AI Intent Detection** | Maps spoken needs to matching welfare schemes or emergency services. |
| 🌐 **Multilingual Support**| Works across Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, and English. |
| 📍 **Location Mapping**    | Triangulates city or village to suggest local services or NGOs. |
| 🚨 **Emergency Assist**    | Connects to hotlines or local crisis partners instantly. |
| 🆔 **Flexible ID Options** | Supports users even without Aadhaar, using verbal consent or community validation. |
| 👨‍💻 **Admin Dashboard**   | Real-time view of active calls, rerouting logic, intent detection, and manual overrides. |
| 📊 **Analytics Panel**     | Live stats on user intents, locations, and language use. |

---

## 🖥️ MVP Architecture

- Frontend: React (Admin Dashboard)
- Backend: Python + FastAPI / Flask
- Voice Input: Simulated textbox or Twilio IVR (planned)
- NLP: OpenAI GPT-4 or Dialogflow CX for intent detection
- TTS: Bhashini / Google TTS (placeholder)
- Database: Firebase / Google Sheets / Airtable
- Hosting: Vercel / Render (MVP scope)
- Languages Supported: Hindi, English, Tamil, Telugu, Kannada, Marathi, Bengali

---

## 🚀 Getting Started (Local)

```bash
git clone https://github.com/nishanthcr7777/echoaidplatform.git
cd echoaidplatform
npm install
npm run dev

* Check out the [Hosting and Deployment](https://docs.convex.dev/production/) docs for how to deploy your app
* Read the [Best Practices](https://docs.convex.dev/understanding/best-practices/) guide for tips on how to improve you app further

## HTTP API

User-defined http routes are defined in the `convex/router.ts` file. We split these routes into a separate file from `convex/http.ts` to allow us to prevent the LLM from modifying the authentication routes.
