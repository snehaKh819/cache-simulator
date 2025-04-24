# 🔄 CacheSim: Smart Caching Simulator with Optimized Hashing

**A full-stack cache simulator that demonstrates an advanced hybrid collision resolution algorithm using multi-dimensional hash tables.**

> Built using **C++** for the core engine and **Django (Python)** for the backend API, with optional React frontend support.

---

## 📌 Project Overview

Caching is a critical mechanism in computing systems that speeds up data access by storing frequently used items. This project simulates how a cache behaves under real-world data loads using a **custom-designed hash table with optimized collision resolution techniques**.

It blends:
- 🚀 **Systems-level algorithm design** (C++)
- 🌐 **Web-based interaction & visualization** (Django API + UI)
- 📊 **Performance metrics** to measure cache efficiency

---

## 🔧 Technologies Used

| Layer      | Tech                      | Description                             |
|------------|---------------------------|-----------------------------------------|
| Core Engine | `C++`                    | Implements hybrid hash table & cache logic |
| Backend    | `Django` (Python)         | API layer to communicate with C++ engine |
| Integration | `subprocess` or `pybind11` | Python → C++ interaction                |
| Frontend (optional) | `React / HTML + JS`     | User interface for simulation inputs & visualization |
| Database (optional) | `SQLite`         | To log simulation stats                 |

---

## 🧠 Core Features

- 🔁 **Simulate data requests**: Input key streams like `[10, 20, 30, 10]`
- 🧠 **Custom Hybrid Hash Table**:
  - Multi-dimensional array storage
  - Combines NOF strategy with chaining and probing
  - Dynamic resizing based on load factor
- 📈 **Metrics Display**:
  - Hits vs Misses
  - Collision count
  - Load factor and memory usage
- 🌐 RESTful API support
- 🖥️ (Optional) Frontend for visualization and interaction

---

## 📂 Project Structure

```bash
CacheSim/
├── cpp_engine/            # C++ cache simulator engine
│   ├── hash_table.cpp
│   └── main.cpp           # CLI wrapper for engine
├── django_backend/
│   ├── cache_api/         # Django app for API routes
│   ├── manage.py
│   └── views.py           # Calls C++ engine via subprocess
├── frontend/ (optional)   # React/HTML frontend for simulation
│   └── ...
├── db.sqlite3 (optional)  # Logs simulation sessions
└── README.md
