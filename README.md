🚀 MERN DevOps Project (Docker + Terraform + Monitoring)
📌 Overview

This project is a full-stack MERN application deployed using modern DevOps practices. It integrates containerization, infrastructure as code, monitoring, and automated testing into a single workflow.

The goal is to demonstrate a production-ready architecture with scalability, observability, and automation.

🧱 Tech Stack
💻 Application
MongoDB (Database)
Express.js (Backend framework)
React.js (Frontend)
Node.js (Runtime)
⚙️ DevOps & Infrastructure
Docker & Docker Compose (Containerization)
Terraform (Infrastructure as Code - AWS)
AWS EC2, S3, VPC (Deployment)
📊 Monitoring & Observability
Prometheus (Metrics collection)
Grafana (Visualization dashboards)
🧪 Testing & Automation
Selenium (End-to-end testing)
📁 Project Structure
project-root/
│
├── backend/                # Node + Express API
├── frontend/               # React application
├── docker/                 # Docker configs
├── terraform/              # Infrastructure setup (AWS)
├── monitoring/
│   ├── prometheus/         # Prometheus config
│   └── grafana/            # Grafana dashboards
├── tests/
│   └── selenium/           # Automated browser tests
├── docker-compose.yml
└── README.md
⚡ Features
🔹 Full MERN stack application
🔹 Dockerized services for easy deployment
🔹 Infrastructure provisioning using Terraform
🔹 Real-time monitoring with Prometheus & Grafana
🔹 Automated UI testing using Selenium
🔹 Scalable and production-ready architecture
🐳 Docker Setup
Build & Run Containers
docker-compose up --build
Services
Frontend → React app
Backend → Node API
Database → MongoDB
Monitoring → Prometheus + Grafana
☁️ Terraform Deployment (AWS)
Initialize Terraform
terraform init
Plan Infrastructure
terraform plan
Apply Changes
terraform apply
Infrastructure Includes
VPC & Networking
EC2 Instance (Backend)
S3 Bucket (Frontend hosting)
IAM Roles & Security Groups
📊 Monitoring Setup
Prometheus
Collects system & application metrics
Configured via prometheus.yml
Grafana
Dashboard visualization
Access dashboards via:
http://localhost:3000
🧪 Selenium Testing
Run Tests
cd tests/selenium
python test_app.py
Purpose
Automates browser testing
Validates user flows (login, navigation, etc.)
🔐 Environment Variables

Create a .env file in backend/frontend:

MONGO_URI=your_mongodb_connection
PORT=5000
🚀 Deployment Flow
Write application (MERN)
Containerize using Docker
Provision infrastructure via Terraform
Deploy backend on EC2
Host frontend on S3
Monitor using Prometheus + Grafana
Test using Selenium
📸 Screenshots (Optional)

Add your Grafana dashboards, app UI, and Terraform output here

🎯 Learning Outcomes
Infrastructure as Code (Terraform)
Containerization (Docker)
Monitoring & Observability
Full-stack deployment pipeline
Automated testing with Selenium
⚠️ Notes
Ensure AWS credentials are configured before Terraform
Do not expose sensitive keys in code
Restrict security group access in production
🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.

📄 License

This project is open-source and available under the MIT License.
