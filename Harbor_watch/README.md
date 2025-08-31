

# Harbor Watch

Harbor Watch is an innovative real-time coastal threat monitoring and alert system built during a hackathon.  
It leverages **React, Node.js, geospatial visualization, and AI/ML-based analysis** to provide authorities and communities with early warnings about coastal risks such as **erosion, flooding, cyclones, and tidal surges**

---

## 🚀 Features

- **Interactive Map Dashboard**  
  Displays Gujarat’s coastline with precise **city markers** and threat zones.

- **Threat Level Classification**  
  Each location is marked with status:  
  - ✅ Safe  
  - 👁 Watch  
  - ⚠ Warning  
  - 🔴 Critical  

- **AI-based Predictions (Future Scope)**  
  Integration of ML models to predict shoreline change and identify potential vulnerable zones.

- **Customizable Alerts**  
  Authorities can configure and push warnings for specific coastal towns.

- **Grid-Aligned Map Layout**  
  Map visualization remains properly aligned within the dashboard grid for clarity.

- **Modular Frontend (React + Tailwind + shadcn/ui)**  
  - Card-based UI for threat summaries.  
  - Badges for quick status recognition.  
  - Lucide icons for visual clarity.  

- **Extensible Backend (Planned)**  
  - APIs for integrating government databases, weather APIs, and IoT sensors.  
  - Support for real-time data ingestion.

---

## Technologies Used

- **Frontend**: React + Tailwind CSS + shadcn/ui + Recharts  
- **Icons & UI**: lucide-react, custom components  
- **Map Visualization**: Custom image grid + coordinate-based city plotting  
- **Backend (Planned)**: Node.js / Express  
- **Database (Planned)**: PostgreSQL / MongoDB  
- **Chatbot API**: GROQ (uses LLAMA 3.0)  
- **Deployment**: Vercel 

---

## Getting Started


## Project Structure

```
harbor-watch/
├── public/                # Static assets
├── src/
│   ├── components/        # UI and feature components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page-level components
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── package.json           # Project metadata and scripts
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── README.md              # Project documentation
```

---

## Usage and Use cases

You can use Harbor Watch as a foundation for your own coastal monitoring or environmental data applications. The modular structure allows you to extend or replace components as needed for your use case.

-**Government Agencies**: Real-time monitoring of erosion and floods.
-**Disaster Management Teams**: Quick deployment of resources during critical alerts.
-**Researchers**: Study climate impacts on Gujarat’s coastline.
-**Communities**: Awareness and preparedness for natural disasters.

---


## 🔮 Future Enhancements

- **IoT Sensor Integration**: Deploy real-time monitoring using buoys, tide meters, and coastal sensors.  
- **Satellite & AI Analysis**: Use satellite imagery with AI/ML models for shoreline prediction and erosion tracking.  
- **Mobile Application**: Deliver alerts and updates directly to citizens via a user-friendly mobile app.  
- **Cloud Deployment**: Host on scalable cloud infrastructure for high availability and real-time processing.  


