# InsightForge AI
MIT License
## Autonomous Data Intelligence Platform

InsightForge AI is an automated analytics platform that transforms raw datasets into actionable business intelligence.

Users can upload structured datasets (CSV, Excel, JSON, SQL exports), and the platform automatically analyzes the data to generate:

• KPI summaries  
• Interactive dashboards  
• Chart recommendations  
• Anomaly detection  
• Dataset explanations  
• AI-generated insights  

The system automatically understands the structure of any dataset and builds meaningful analytics without manual configuration.

---

# Project Vision

Modern organizations collect large volumes of data but spend significant time preparing and analyzing it.

InsightForge AI aims to solve this problem by creating an **autonomous data intelligence engine** capable of:

• Understanding dataset structure  
• Detecting important metrics and categories  
• Generating visual dashboards automatically  
• Highlighting anomalies and patterns  

The platform functions as a lightweight automated version of tools such as:

• Tableau  
• Power BI  
• Looker  
• ThoughtSpot  

---

# System Architecture

InsightForge follows a modular analytics pipeline.

Dataset Upload  
↓  
Data Ingestion Engine  
↓  
Header Detection & Schema Normalization  
↓  
Column Profiling Engine  
↓  
Semantic Role Detection  
↓  
Dataset Classification  
↓  
Analytics Planning Engine  
↓  
Statistical Analysis Engine  
↓  
Auto Chart Intelligence Engine  
↓  
KPI Generation  
↓  
Anomaly Detection Engine  
↓  
Interactive Dashboard Builder  

Each stage operates independently, making the system scalable and extensible.

---

# Core Features

## Universal Dataset Upload

The platform accepts multiple dataset formats.

Supported formats

• CSV  
• Excel (.xlsx / .xls)  
• JSON  
• SQL exports  

The ingestion engine automatically handles:

• Report-style Excel files  
• Title rows  
• Merged headers  
• Column normalization  
• Missing values  

---

## Data Profiling Engine

Each column is analyzed to extract metadata.

The system calculates:

• Data type  
• Missing value percentage  
• Unique values  
• Numeric confidence  
• Datetime confidence  
• Sample values  

Example

Column: No. of Policies  
Type: Numeric  
Unique values: 187  
Numeric confidence: 0.98  

This metadata becomes the foundation for semantic analysis.

---

## Semantic Column Detection

InsightForge determines the role of each column automatically.

Detected roles include

• Metric  
• Category  
• Entity  
• Identifier  
• Date  

Example

Zone Name → Category  
Division Name → Category  
Agent Cd → Identifier  
No. of Policies → Metric  
FPI → Metric  

This allows the system to understand how the dataset should be analyzed.

---

## Dataset Classification

The platform automatically determines the dataset type.

Examples

• Transaction dataset  
• Master record table  
• Time series dataset  
• Event log  
• Generic tabular dataset  

This classification guides the analytics planner.

---

## Analytics Planning Engine

Based on detected column roles, the system builds an analysis plan.

Example

metric_columns  
- No. of Policies  
- FPI  

category_columns  
- Zone Name  
- Division Name  
- Agent Cd  

recommended_analyses  
- Descriptive statistics  
- Category comparison  
- Anomaly detection  
- Dashboard generation  

---

## Statistical Analysis Engine

InsightForge automatically computes descriptive statistics for metrics.

Example output

Metric: No. of Policies  

count: 5194  
mean: 23.1  
median: 18  
min: 0  
max: 210  

These statistics feed into dashboards and insights.

---

## Auto Chart Intelligence Engine

The system automatically selects the best chart types based on dataset structure.

Supported charts

• Line charts  
• Area charts  
• Bar charts  
• Horizontal bar charts  
• Pie charts  
• Donut charts  
• Scatter plots  
• Summary charts  

Example chart mapping

Date + Metric → Line Chart  
Category + Metric → Bar Chart  
Small Category Set → Pie Chart  
Metric + Metric → Scatter Plot  

---

## Interactive Dashboard

InsightForge automatically generates dashboards containing:

• KPI cards  
• Dynamic charts  
• Filter controls  
• Anomaly summaries  
• Dataset explanations  

The layout adapts automatically depending on the dataset structure.

---

## Anomaly Detection Engine

InsightForge detects unusual patterns in numeric metrics.

Current statistical methods

• Interquartile Range (IQR)  
• Z-Score  

Example anomaly output

Metric: Premium  

Anomaly Count: 12  

Date: 2021-08-15  
Value: 540000  
Severity: High  

---

## Dataset Explanation Engine

The system automatically explains the dataset.

Example output

Dataset Type: Insurance Agent Performance  

Rows: 5194  
Columns: 8  

Key Metrics  
• No. of Policies  
• FPI  

Key Dimensions  
• Zone Name  
• Division Name  
• Agent Code  

Insights  

• West Zone generates the highest policy volume  
• Agents with higher FPI tend to sell more policies  

---

# Technology Stack

## Backend

Python  
FastAPI  
Pandas  
NumPy  

Core modules

• Data ingestion  
• Profiling engine  
• Semantic detection  
• Analytics engine  
• Visualization engine  

---

## Frontend

Next.js  
React  
Recharts  

Features

• Interactive dashboards  
• Dynamic filters  
• Auto chart rendering  
• Responsive UI  

---

# Project Structure

insightforge-ai

backend  
│  
├ ingestion  
├ profiling  
├ semantics  
├ analytics  
├ visualization  
├ services  

frontend  
│  
├ components  
├ pages  

docs  

requirements.txt  
README.md  
LICENSE  

---

# Example Workflow

1 Upload dataset  

2 System detects header rows and cleans schema  

3 Columns are profiled  

4 Semantic roles are assigned  

5 Analytics plan is generated  

6 Statistics and insights are computed  

7 Charts are recommended automatically  

8 Dashboard is generated  

---

# Future Improvements

Planned capabilities include

• Forecasting models  
• Machine learning anomaly detection  
• Natural language data queries  
• Predictive analytics  
• Automated reporting  

---

# Author

Madhur Gattani  

MS Information Systems  
Seidenberg School of Computer Science  
Pace University  

---

# License

This project is licensed under the MIT License.
