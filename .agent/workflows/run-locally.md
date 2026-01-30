---
description: how to run the Datalens project locally
---

This workflow will guide you through setting up and running both the backend and frontend of the Datalens project.

### 1. Backend Setup (FastAPI)
Navigate to the backend directory, set up a virtual environment, and install dependencies.

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Ensure you have the necessary `.env` files.
- **Backend**: `/backend/.env` (use `.env.example` as a template)
- **Frontend**: `/frontend/.env.local` (use `.env.example` as a template)

### 3. Start the Backend Server
Run the following command in the `backend` directory (with the virtual environment activated):

```bash
python main.py
```
The backend will be available at `http://localhost:8000`.

### 4. Frontend Setup (Next.js)
In a new terminal, navigate to the frontend directory and install dependencies.

```bash
cd frontend
npm install
```

### 5. Start the Frontend Server
Run the following command in the `frontend` directory:

```bash
npm run dev
```
The frontend will be available at `http://localhost:3000`.

### 6. Access the Application
Open your browser and navigate to `http://localhost:3000`.
