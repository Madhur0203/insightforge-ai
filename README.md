# InsightForge AI
### Autonomous Data Intelligence Platform

![Python](https://img.shields.io/badge/Python-3.10-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![NextJS](https://img.shields.io/badge/Next.js-Frontend-black)
![React](https://img.shields.io/badge/React-UI-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Project-Active-success)

InsightForge AI is an **Autonomous Data Intelligence Platform** that transforms raw datasets into meaningful business insights automatically.

Users can upload structured datasets (CSV, Excel, JSON, SQL exports), and the system automatically performs:

- Data profiling
- Semantic column detection
- Dataset classification
- Statistical analysis
- Chart intelligence
- Dashboard generation
- Anomaly detection
- Dataset explanation

The platform acts as an **AI-powered automated analytics engine** similar to tools like Tableau or Power BI, but capable of **automatically understanding datasets without manual configuration**.

---

# Platform Architecture

```text
                +------------------------+
                |     Dataset Upload     |
                | CSV / Excel / JSON     |
                +-----------+------------+
                            |
                            v
                +------------------------+
                |    Data Ingestion      |
                | Header Detection       |
                | Schema Normalization   |
                +-----------+------------+
                            |
                            v
                +------------------------+
                |     Data Profiling     |
                | Column Statistics      |
                | Missing Values         |
                | Data Types             |
                +-----------+------------+
                            |
                            v
                +------------------------+
                | Semantic Column Engine |
                | Metric Detection       |
                | Category Detection     |
                | Date Detection         |
                +-----------+------------+
                            |
                            v
                +------------------------+
                | Dataset Classification |
                | Transaction / Master   |
                | Time-Series Detection  |
                +-----------+------------+
                            |
                            v
                +------------------------+
                | Analytics Planner      |
                | Select Analysis Types  |
                +-----------+------------+
                            |
                            v
                +------------------------+
                | Analysis Engine        |
                | Descriptive Stats      |
                | KPI Generation         |
                | Chart Intelligence     |
                | Anomaly Detection      |
                +-----------+------------+
                            |
                            v
                +------------------------+
                | Dashboard Builder      |
                | Charts + Filters       |
                | KPI Cards              |
                +------------------------+
```

---

# Analytics Pipeline

```text
Dataset
  ↓
Profiling
  ↓
Semantic Detection
  ↓
Dataset Classification
  ↓
Analytics Planning
  ↓
Statistics Engine
  ↓
Chart Intelligence
  ↓
Anomaly Detection
  ↓
Interactive Dashboard
```

---

# Key Features

## Universal Dataset Support

Supported formats:

- CSV
- Excel (.xlsx / .xls)
- JSON
- SQL exports

Handles:

- report-style Excel files
- multi-row headers
- messy column names
- missing values

---

## Automatic Data Profiling

Each column is analyzed to determine:

- data type
- null percentage
- unique values
- numeric confidence
- datetime confidence

Example

```
Column: Premium
Type: Numeric
Missing Values: 0.02%
Unique Values: 1450
```

---

## Semantic Column Detection

The system determines column roles automatically.

Roles detected:

- Metric
- Category
- Entity
- Identifier
- Date

Example

```
Zone Name → Category
Division Name → Category
Agent Code → Identifier
No. of Policies → Metric
FPI → Metric
```

---

## Auto Chart Intelligence

The system automatically selects the best visualization.

| Data Pattern | Chart |
|---|---|
| Date + Metric | Line Chart |
| Category + Metric | Bar Chart |
| Small Category Set | Pie Chart |
| Metric + Metric | Scatter Plot |

Supported charts:

- Line charts
- Bar charts
- Area charts
- Pie charts
- Scatter plots
- Distribution charts

---

## Interactive Dashboard

Generated dashboard includes:

- KPI cards
- Interactive charts
- Dataset filters
- Anomaly summary
- Dataset explanation

---

## Anomaly Detection

Current statistical methods:

- IQR (Interquartile Range)
- Z-score

Example anomaly:

```
Metric: Premium
Date: 2019-07-02
Value: 600000
Severity: High
```

---

# Screenshots

Add screenshots after deploying your frontend.

Example:

```
docs/screenshots/dashboard.png
docs/screenshots/upload.png
docs/screenshots/anomalies.png
```

Example display:

![Dashboard](docs/screenshots/dashboard.png)

---

# Technology Stack

## Backend

Python  
FastAPI  
Pandas  
NumPy  

Core modules:

- ingestion engine
- profiling engine
- semantic analysis
- analytics engine
- visualization planner

---

## Frontend

Next.js  
React  
Recharts  

Features:

- responsive UI
- dynamic dashboards
- filter interactions
- chart rendering

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Madhur0203/insightforge-ai.git
cd insightforge-ai
```

---

## Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Server runs on:

```
http://localhost:8000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

# Project Structure

```
insightforge-ai

backend
│
├ ingestion
├ profiling
├ semantics
├ analytics
├ visualization
├ services
│
└ app

frontend
│
├ components
├ pages
└ styles

docs
│
└ screenshots

README.md
LICENSE
requirements.txt
```

---

# Example Workflow

1 Upload dataset  
2 System detects header rows  
3 Columns are profiled  
4 Semantic roles assigned  
5 Analytics plan generated  
6 Statistics computed  
7 Charts generated  
8 Dashboard rendered  

---

# Future Roadmap

Planned capabilities:

- ML-based anomaly detection
- forecasting models
- natural language data queries
- automated reporting
- decision intelligence engine

---

# Author

**Madhur Gattani**

MS Information Systems  
Seidenberg School of Computer Science  
Pace University

---

# License

This project is licensed under the **MIT License**.
