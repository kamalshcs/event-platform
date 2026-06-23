# Event Management Platform

A modern, full-stack React application for discovering events, managing bookings, and creating new events. This project demonstrates advanced state management, data fetching, and routing patterns.

## 🚀 Features

* **Events Discovery:** Browse a grid of events fetched dynamically from the server.
* **Event Details:** Dedicated pages for each event with streaming data and available ticket tiers.
* **Booking Flow:** A comprehensive 3-step booking wizard managed by `useReducer` with optimistic UI updates.
* **Event Creation:** A multi-step form wizard utilizing Redux Toolkit to capture event details, save drafts locally, and publish to the backend.
* **Global Theming:** Light/Dark mode toggle powered by the Context API and persisted via `localStorage`.
* **Mock Authentication:** Simulated user sessions and personalized profile features.

## 🛠️ Tech Stack & State Management Strategy

This project implements a highly intentional state management architecture:

* **Framework:** React 18 & Vite
* **Routing:** React Router DOM (utilizing `createBrowserRouter` for loaders and actions)
* **Server State (Data Fetching/Caching):** TanStack Query (React Query)
* **Complex Form State:** Redux Toolkit (Create Event Wizard)
* **Local UI State:** `useState` & `useReducer` (Booking Flow)
* **Global UI State:** React Context API (Theme & Auth)
* **Mock Backend:** `json-server`

## 📦 Setup & Installation Instructions

To run this project locally, you will need to start both the React development server and the mock JSON database.

### 1. Install Dependencies
Ensure you have Node.js installed, then run the following in the project root:
```bash
npm install