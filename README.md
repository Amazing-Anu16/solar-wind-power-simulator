# Solar-Wind Hybrid Power

A professional web-based simulation tool for DC-coupled Solar-Wind Hybrid Energy Systems based on the project documentation from D. Y. Patil Institute of Technology.

## ⚡ Latest Updates (v2.0)

### ✅ **All Hardcoded Values Eliminated**
- Dynamic temperature variation (was fixed at 25°C)
- All profiles now use **your input parameters** as baseline
- Fully configurable simulation

### ✅ **Enhanced Realistic Simulations**
- Accurate solar patterns (sunrise, clouds, sunset)
- Complementary wind generation (strong at night)
- Residential load profiles (morning & evening peaks)
- Temperature effects on PV efficiency

### ✅ **Professional Visualizations**
- **7 comprehensive charts** (up from 5)
- Dynamic Y-axis scaling for perfect data visibility
- Custom tooltips with precise values
- Reference lines for targets and limits
- Publication-quality graphs

---

## 🌟 Features

### Real-Time Simulation
- **Interactive Parameter Control**: Adjust solar irradiance, temperature, wind speed, and load demand with live sliders
- **Instant Results**: See power generation, DC bus voltage, and system metrics update in real-time
- **Power Quality Monitoring**: Track THD, power factor, and IEEE 519 compliance

### 24-Hour Simulation
- **Complete Day Analysis**: Realistic daily profiles for solar irradiance, wind speed, and load patterns
- **Energy Balance**: Calculate total generation vs. demand over 24 hours
- **Performance Metrics**: Average availability, peak power, and system efficiency
- **User-Based Variations**: Simulations adapt to your parameter settings

### Advanced Visualizations
- **Power Generation vs Load**: Stacked areas with load comparison
- **DC Bus Voltage Regulation**: Stability monitoring with tolerance bands
- **AC Output Quality**: Dual-axis chart (voltage + frequency)
- **Environmental Conditions**: Solar-wind complementarity visualization
- **Temperature Variation**: Diurnal cycle affecting PV efficiency
- **System Performance**: THD, efficiency, availability, power factor
- **Energy Shortfall Analysis**: Identifies battery/grid backup needs

### System Specifications
- **PV Array**: 6.25 kW (25 modules × 250W, 5S5P configuration)
- **Wind Turbine**: 5 kW PMSG-based, direct drive
- **DC Bus**: 400V target with ±2.1% stability
- **AC Output**: 230V, 50Hz with SPWM control
- **Power Quality**: THD < 5%, Power Factor > 0.95

## 🚀 Quick Start

### Fastest Way to Run

**Windows Users**: Simply double-click **`start.bat`** in the project folder!

### Alternative Method

```cmd
npm run install:all
npm run dev
```

Then open your browser to **http://localhost:5173**

## 🚢 Vercel Deployment

This repository is structured for two separate Vercel projects:
- `frontend/` for the React app
- `backend/` for the Express API

### Deployment flow

1. Create one Vercel project for `frontend/`.
2. Create a second Vercel project for `backend/`.
3. Set the frontend project root directory to `frontend` and the backend project root directory to `backend`.
4. Deploy both projects.
5. Put the backend deployment URL into the frontend project's `VITE_API_BASE_URL` environment variable.
6. Put the frontend deployment URL into the backend project's `CLIENT_ORIGIN` environment variable.

### Required environment variables

Frontend project:

| Name | Required | Example | Why |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | `https://your-backend.vercel.app/api` | Tells the frontend where the deployed API lives. |

Backend project:

| Name | Required | Example | Why |
| --- | --- | --- | --- |
| `CLIENT_ORIGIN` | Yes | `https://your-frontend.vercel.app` | Restricts CORS to the deployed frontend. You can separate multiple origins with commas. |
| `PORT` | No | `3001` | Only used for local development. Vercel ignores it. |

### Local development

- Frontend uses `frontend/.env.example` with `VITE_API_BASE_URL=http://localhost:3001/api`.
- Backend uses `backend/.env.example` with `CLIENT_ORIGIN=http://localhost:5173` and `PORT=3001`.
- Run `npm run dev` from the repo root to start both services together.

### Vercel config

- Frontend config: [frontend/vercel.json](frontend/vercel.json)
- Backend config: [backend/vercel.json](backend/vercel.json)



## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development
- **Tailwind CSS** for modern styling
- **shadcn/ui** for beautiful, accessible components
- **Recharts** for interactive data visualization
- **Axios** for API communication

### Backend
- **Node.js** with **Express** framework
- **TypeScript** for robust type checking
- **Mathematical Models**:
  - PV single-diode model with P&O MPPT algorithm
  - PMSG-based wind turbine with power coefficient curves
  - DC-DC boost converter for voltage regulation
  - SPWM inverter with LC filter for AC output
  - Power quality calculations (THD, power factor)

## 📊 Technical Implementation

The simulator implements the following models from the project documentation:

1. **Solar PV Model**: Single-diode model with temperature and irradiance effects
2. **MPPT Control**: Perturb & Observe algorithm (98% efficiency)
3. **Wind Turbine**: Power extraction with Cp coefficient and tip-speed ratio
4. **PMSG Generator**: Permanent magnet synchronous generator model
5. **DC Bus**: Voltage regulation with boost converter control
6. **Inverter**: SPWM-based three-phase inverter with LC filtering
7. **Power Quality**: THD calculation and IEEE 519 compliance

## 🎯 Use Cases

- **Educational**: Learn about hybrid renewable energy systems
- **Research**: Test different system configurations and parameters
- **Design**: Evaluate system performance before physical implementation
- **Analysis**: Understand complementary nature of solar and wind energy

## 📁 Project Structure

```
solar-wind-hybrid-power/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/   # UI components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── ParameterControls.tsx
│   │   │   ├── SystemMetrics.tsx
│   │   │   └── PowerVisualization.tsx
│   │   ├── lib/          # Utilities and API client
│   │   ├── types/        # TypeScript type definitions
│   │   └── App.tsx       # Main application
│   └── package.json
│
├── backend/           # Node.js backend server
│   ├── src/
│   │   ├── models/       # Calculation models
│   │   │   ├── pvModel.ts
│   │   │   ├── windModel.ts
│   │   │   ├── converterModel.ts
│   │   │   └── systemModel.ts
│   │   ├── utils/        # Simulation generators
│   │   ├── types/        # Type definitions
│   │   └── server.ts     # Express server
│   └── package.json
│
├── package.json       # Root configuration
└── README.md          # This file

## 👥 Team Members

**D. Y. Patil Institute of Technology - SIT Batch**

- **Anupriya Kundu (SIT06)** - PV System & MPPT Implementation
- **Namita Lal Deo (SIT07)** - Documentation & Research  
- **Phulesh Sirvi (SIT08)** - Wind Energy Subsystem
- **Aditya Tayade (SIT04)** - Integration & Control Design

## 📝 Project Background

This simulator is based on the final year project "DC-Coupled Solar-Wind Hybrid Renewable Energy System" which focused on:

- Designing high-accuracy simulation models for hybrid energy systems
- Implementing P&O MPPT for solar and PMSG control for wind
- Integrating renewable sources on a common 400V DC bus
- Developing SPWM-based inverter control for quality AC output
- Analyzing 24-hour system performance and reliability

**Key Achievement**: 92.7% power availability with only 4.4 kWh shortfall over 24 hours, demonstrating significant improvement over standalone solar (34.2%) or wind (58.5%) systems.

## 🎓 Academic Context

This web application serves as an interactive demonstration of the concepts and calculations detailed in the project documentation, making it easier to:
- Visualize system behavior under different conditions
- Understand the complementary nature of solar and wind energy
- Experiment with parameter changes in real-time
- Validate the benefits of hybrid renewable energy systems
