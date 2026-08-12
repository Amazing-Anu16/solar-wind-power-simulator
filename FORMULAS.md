# Mathematical Formulas - HRES Backend

This document details all mathematical formulas and models used in the backend calculation engine.

---

## 📋 Table of Contents

1. [Photovoltaic (PV) System Model](#1-photovoltaic-pv-system-model)
2. [Wind Turbine System Model](#2-wind-turbine-system-model)
3. [DC-DC Converter Model](#3-dc-dc-converter-model)
4. [Inverter Model](#4-inverter-model)
5. [Power Quality Metrics](#5-power-quality-metrics)
6. [System Performance Metrics](#6-system-performance-metrics)
7. [Daily Profile Generators](#7-daily-profile-generators)

---

## 1. Photovoltaic (PV) System Model

### 1.1 PV Power Output Formula

**Single-Diode Model with Temperature Correction:**

$$P_{pv} = C_{pv} \times f_{pv} \times \left(\frac{G_t}{G_{stc}}\right) \times \left[1 + \alpha_p \times (T_c - T_{stc})\right]$$

Where:
- $P_{pv}$ = PV power output (kW)
- $C_{pv}$ = PV array capacity (kW) = 6.25 kW
- $f_{pv}$ = Derating factor = 0.85 (accounts for losses)
- $G_t$ = Actual solar irradiance (W/m²)
- $G_{stc}$ = Standard Test Condition irradiance = 1000 W/m²
- $\alpha_p$ = Temperature coefficient = -0.004 (−0.4%/°C)
- $T_c$ = Cell temperature (°C)
- $T_{stc}$ = Standard Test Condition temperature = 25°C

**Components:**

**Irradiance Factor:**
$$\text{Irradiance Factor} = \frac{G_t}{G_{stc}}$$

**Temperature Factor:**
$$\text{Temperature Factor} = 1 + \alpha_p \times (T_c - T_{stc})$$

### 1.2 PV Efficiency

$$\eta_{pv} = \eta_{base} \times \text{Temperature Factor} \times \text{Irradiance Factor}$$

Where:
- $\eta_{pv}$ = PV system efficiency (%)
- $\eta_{base}$ = Base efficiency at STC = 18%

### 1.3 MPPT (Maximum Power Point Tracking)

**Perturb & Observe (P&O) Algorithm:**

$$P_{mppt} = P_{pv} \times \eta_{mppt} \times (1 + \Delta_{osc})$$

Where:
- $P_{mppt}$ = Power after MPPT (kW)
- $\eta_{mppt}$ = MPPT efficiency = 0.98 (98%)
- $\Delta_{osc}$ = Small oscillation around MPP = $0.005 \times \sin(\frac{t}{1000})$

**MPPT tracks the maximum power point with 97-99% efficiency**

---

## 2. Wind Turbine System Model

### 2.1 Wind Power Formula

**Fundamental Wind Power Equation:**

$$P_w = \frac{1}{2} \times \rho \times A \times C_p \times V^3$$

Where:
- $P_w$ = Wind power output (kW)
- $\rho$ = Air density = 1.225 kg/m³ (at sea level, 15°C)
- $A$ = Rotor swept area (m²)
- $C_p$ = Power coefficient (dimensionless)
- $V$ = Wind speed (m/s)

### 2.2 Rotor Swept Area

$$A = \pi \times \left(\frac{D}{2}\right)^2$$

Where:
- $D$ = Rotor diameter = 5.64 m
- $A$ = 24.97 m²

### 2.3 Power Coefficient (Cp)

**Betz Limit:** Maximum theoretical $C_p = 0.593$ (59.3%)

**Practical Implementation:**

For $V_{cut-in} \leq V \leq V_{rated}$:
$$C_p = C_{p,max} \times \left(\frac{V - V_{cut-in}}{V_{rated} - V_{cut-in}}\right)^{0.3}$$

For $V_{rated} < V \leq V_{cut-out}$:
$$C_p = C_{p,max} \times \left(\frac{V_{cut-out} - V}{V_{cut-out} - V_{rated}}\right)$$

Where:
- $C_{p,max}$ = Maximum power coefficient = 0.45
- $V_{cut-in}$ = Cut-in wind speed = 3 m/s
- $V_{rated}$ = Rated wind speed = 12 m/s
- $V_{cut-out}$ = Cut-out wind speed = 15 m/s

**Operating Conditions:**
- If $V < V_{cut-in}$: $P_w = 0$ (turbine not operational)
- If $V > V_{cut-out}$: $P_w = 0$ (turbine shutdown for protection)

### 2.4 PMSG (Permanent Magnet Synchronous Generator) Conversion

**Total Conversion Chain:**

$$P_{out} = P_w \times \eta_{gen} \times \eta_{rect} \times \eta_{boost}$$

Where:
- $\eta_{gen}$ = Generator efficiency = 0.93 (93%)
- $\eta_{rect}$ = Rectifier efficiency = 0.95 (95%)
- $\eta_{boost}$ = Boost converter efficiency = 0.96 (96%)

**Combined PMSG System Efficiency:**
$$\eta_{PMSG} = 0.93 \times 0.95 \times 0.96 = 0.848 \text{ (84.8%)}$$

### 2.5 Wind Turbine Efficiency

$$\eta_w = \frac{P_{out}}{P_{max,Betz}} \times 100\%$$

Where:
$$P_{max,Betz} = \frac{1}{2} \times \rho \times A \times 0.593 \times V^3$$

---

## 3. DC-DC Converter Model

### 3.1 DC Bus Voltage Regulation

**Boost Converter Fundamental:**
$$V_{out} = \frac{V_{in}}{1 - D}$$

Where:
- $V_{out}$ = Output voltage (V)
- $V_{in}$ = Input voltage (V)
- $D$ = Duty cycle (0 to 1)

### 3.2 Dynamic DC Bus Voltage

$$V_{dc} = V_{target} + \Delta V_{droop} + \Delta V_{ripple}$$

**Voltage Droop/Rise Calculation:**

If $(P_{total} - P_{load}) < 0$ (deficit):
$$\Delta V_{droop} = -\frac{|P_{total} - P_{load}|}{P_{load} + 0.1} \times 15 \text{ V}$$

If $(P_{total} - P_{load}) > 0$ (surplus):
$$\Delta V_{rise} = \min\left(\frac{P_{total} - P_{load}}{P_{total} + 0.1}, 0.1\right) \times 10 \text{ V}$$

**Switching Ripple:**
$$\Delta V_{ripple} = 0.5 \times \sin(2\pi f_{sw} t)$$

Where:
- $V_{target}$ = Target DC voltage = 400 V
- $f_{sw}$ = Switching frequency = 20 kHz
- $P_{total}$ = Total generation (kW)
- $P_{load}$ = Load demand (kW)

**Voltage Limits:**
$$385 \text{ V} \leq V_{dc} \leq 415 \text{ V}$$

### 3.3 DC Bus Stability

$$\text{Stability} = \frac{|V_{dc} - V_{target}|}{V_{target}} \times 100\%$$

**Target:** Stability < 2.5% (±10V from 400V)

---

## 4. Inverter Model

### 4.1 SPWM (Sinusoidal Pulse Width Modulation) Inverter

**AC Voltage Output:**

$$V_{ac,rms} = \frac{m_a \times V_{dc}}{2\sqrt{2}} \times \eta_{inv} \times \eta_{filter}$$

Where:
- $V_{ac,rms}$ = AC output voltage (V RMS)
- $m_a$ = Modulation index = 0.9 (90%)
- $V_{dc}$ = DC bus voltage (V)
- $\eta_{inv}$ = Inverter efficiency = 0.95 (95%)
- $\eta_{filter}$ = LC filter efficiency = 0.98 (98%)

**For $V_{dc} = 400$ V:**
$$V_{ac,rms} = \frac{0.9 \times 400}{2\sqrt{2}} \times 0.95 \times 0.98 \approx 230 \text{ V}$$

### 4.2 AC Frequency

$$f_{ac} = f_{target} + \Delta f_{noise}$$

Where:
- $f_{target}$ = Target frequency = 50 Hz
- $\Delta f_{noise}$ = Random variation ≈ ±0.05 Hz

**Grid Standard:** $49.9 \text{ Hz} \leq f_{ac} \leq 50.1 \text{ Hz}$

---

## 5. Power Quality Metrics

### 5.1 Total Harmonic Distortion (THD)

**Multi-Factor THD Model:**

$$\text{THD} = \text{THD}_{base} + \text{THD}_{load} + \text{THD}_{voltage} + \text{THD}_{noise}$$

**Components:**

1. **Base THD** (SPWM + LC Filter):
   $$\text{THD}_{base} = 3.0\%$$

2. **Load-Dependent THD:**
   $$\text{THD}_{load} = \left(\frac{P_{load}}{10}\right) \times 1.5\%$$

3. **Voltage Stability THD:**
   $$\text{THD}_{voltage} = \left(\frac{|V_{dc} - 400|}{400}\right) \times 10\%$$

4. **Power Quality Factor:**
   $$\text{THD}_{total} = \text{THD} \times \left(1 - \min\left(\frac{P_{total}}{P_{load}}, 1.2\right) \times 0.1\right)$$

5. **Random Noise:**
   $$\text{THD}_{noise} = \text{uniform}(-0.25\%, +0.25\%)$$

**IEEE 519 Standard:** THD < 5% for voltage

**Typical Range:** $1.5\% \leq \text{THD} \leq 8\%$

### 5.2 Power Factor

$$\text{PF} = 0.95 + \left(\min\left(\frac{P_{load}}{P_{total}}, 1\right)\right) \times 0.03$$

**Range:** $0.85 \leq \text{PF} \leq 1.0$

**Target:** PF > 0.95

---

## 6. System Performance Metrics

### 6.1 Total Power Generation

$$P_{total} = P_{pv,mppt} + P_{wind,pmsg}$$

### 6.2 Energy Shortfall

$$P_{shortfall} = \max(0, P_{load} - P_{total})$$

### 6.3 System Availability

$$\text{Availability} = \min\left(100, \frac{P_{total}}{P_{load}} \times 100\right) \%$$

### 6.4 Overall System Efficiency

$$\eta_{system} = \frac{P_{total}}{P_{pv,capacity} + P_{wind,capacity}} \times 100\%$$

Where:
- $P_{pv,capacity}$ = 6.25 kW (PV array rated capacity)
- $P_{wind,capacity}$ = 5 kW (wind turbine rated capacity)

### 6.5 Daily Energy Metrics

**Total Energy Generated (24 hours):**
$$E_{generated} = \sum_{h=0}^{23} P_{total,h} \times 1 \text{ hour}$$

**Total Energy Demand (24 hours):**
$$E_{demand} = \sum_{h=0}^{23} P_{load,h} \times 1 \text{ hour}$$

**Average Daily Availability:**
$$\text{Avg Availability} = \frac{1}{24} \sum_{h=0}^{23} \text{Availability}_h$$

---

## 7. Daily Profile Generators

### 7.1 Solar Irradiance Profile

**Gaussian Bell Curve with Atmospheric Effects:**

For $5 \leq h < 19$ (sunrise to sunset):

$$G(h) = G_{base} \times e^{-\frac{(h_{sunrise} - h_{peak})^2}{2\sigma^2}} \times f_{atm}(h) \times f_{cloud}(h)$$

Where:
- $h$ = Hour of day (0-23)
- $h_{sunrise} = h - 5$ (hours from sunrise)
- $h_{peak} = 7$ (peak at noon = 5 + 7 = 12)
- $\sigma = 2.5$ (standard deviation)
- $G_{base}$ = User's base irradiance (W/m²)

**Atmospheric Factor:**
$$f_{atm}(h) = \begin{cases}
0.5 + 0.5 \times \frac{h-5}{2} & \text{if } 5 \leq h \leq 7 \text{ (morning haze)}\\
1.0 - 0.3 \times \frac{h-17}{2} & \text{if } 17 \leq h < 19 \text{ (evening)}\\
1.0 & \text{otherwise}
\end{cases}$$

**Cloud Variation:**
$$f_{cloud}(h) = 1 + 0.08\sin(2.3h) + 0.05\cos(3.7h) + 0.04\sin(5.1h)$$

**Cloud Dips:**
- At $h = 10$: multiply by 0.7
- At $h = 14$: multiply by 0.7

For $h < 5$ or $h \geq 19$: $G(h) = 0$

### 7.2 Wind Speed Profile

**Complementary Diurnal Pattern:**

$$V(h) = V_{base} + V_{diurnal}(h) + V_{breeze}(h) + V_{turbulence}(h) + V_{special}(h)$$

**Components:**

1. **Diurnal Cycle:**
   $$V_{diurnal}(h) = 2.5 \times \cos\left(\frac{(h-2)\pi}{12}\right)$$
   (Peak at 2 AM = +2.5 m/s, minimum at 2 PM = -2.5 m/s)

2. **Afternoon Sea Breeze ($15 \leq h \leq 18$):**
   $$V_{breeze}(h) = 1.5 \times \sin\left(\frac{(h-15)\pi}{3}\right)$$

3. **Early Morning Calm ($5 \leq h \leq 8$):**
   $$V_{calm}(h) = -1.8 \times \sin\left(\frac{(h-5)\pi}{3}\right)$$

4. **Turbulence:**
   $$V_{turbulence}(h) = 0.8\sin(1.3h) + 0.6\cos(2.1h) + 0.4\sin(3.7h)$$

5. **Special Conditions:**
   - Calm periods ($h = 7$ or $h = 13$): multiply by 0.75
   - Gusty periods ($h = 20$ or $h = 3$): multiply by 1.25

**Constraints:**
$$2.5 \text{ m/s} \leq V(h) \leq 14.5 \text{ m/s}$$

### 7.3 Load Demand Profile

**Residential Load Pattern:**

$$P_{load}(h) = P_{base} \times f_{load}(h)$$

**Load Factor by Hour:**

$$f_{load}(h) = \begin{cases}
0.25 + 0.05 \times \text{random} & \text{if } 0 \leq h < 5 \text{ (night)}\\
0.3 + 0.4\sin\left(\frac{(h-5)\pi}{6}\right) & \text{if } 5 \leq h < 8 \text{ (morning rise)}\\
0.7 + 0.15\sin((h-8)\pi) & \text{if } 8 \leq h < 10 \text{ (morning peak)}\\
0.45 + 0.1\sin\left(\frac{(h-10)\pi}{3}\right) & \text{if } 10 \leq h < 16 \text{ (midday)}\\
0.55 + 0.35 \times \frac{h-16}{2} & \text{if } 16 \leq h < 18 \text{ (evening rise)}\\
0.9 + 0.1\sin\left(\frac{(h-18)\pi}{4}\right) & \text{if } 18 \leq h < 22 \text{ (evening peak)}\\
0.7 - 0.4 \times \frac{h-22}{2} & \text{if } 22 \leq h < 24 \text{ (wind down)}
\end{cases}$$

**Random Variation:**
$$f_{variation}(h) = 0.03 \times (\sin(7.3h) + \cos(5.7h))$$

**Final Load:**
$$P_{load}(h) = P_{base} \times (f_{load}(h) + f_{variation}(h))$$

**Constraints:**
$$0.3 \text{ kW} \leq P_{load}(h) \leq P_{base} \times 1.2$$

### 7.4 Temperature Profile

**Diurnal Temperature Variation:**

$$T(h) = T_{avg} + \frac{\Delta T_{daily}}{2} \times \cos\left(\frac{(h-6)\pi}{12}\right) + T_{micro}(h)$$

Where:
- $T_{avg}$ = User's average temperature (°C)
- $\Delta T_{daily}$ = Daily temperature range = 12°C
- Minimum at $h = 6$ AM
- Maximum at $h = 15$ (3 PM)

**Micro-variations:**
$$T_{micro}(h) = 0.5\sin(2.7h) + 0.3\cos(4.1h)$$

---

## 📊 Summary of Key Constants

| Parameter | Symbol | Value | Unit |
|-----------|--------|-------|------|
| **PV System** |
| Module Power | $P_{module}$ | 250 | W |
| Total Modules | $N_{modules}$ | 25 | - |
| PV Capacity | $C_{pv}$ | 6.25 | kW |
| STC Irradiance | $G_{stc}$ | 1000 | W/m² |
| STC Temperature | $T_{stc}$ | 25 | °C |
| Temp Coefficient | $\alpha_p$ | -0.004 | /°C |
| Derating Factor | $f_{pv}$ | 0.85 | - |
| MPPT Efficiency | $\eta_{mppt}$ | 0.98 | - |
| **Wind System** |
| Rated Power | $P_{rated}$ | 5 | kW |
| Rotor Diameter | $D$ | 5.64 | m |
| Swept Area | $A$ | 24.97 | m² |
| Air Density | $\rho$ | 1.225 | kg/m³ |
| Cut-in Speed | $V_{cut-in}$ | 3 | m/s |
| Rated Speed | $V_{rated}$ | 12 | m/s |
| Cut-out Speed | $V_{cut-out}$ | 15 | m/s |
| Max $C_p$ | $C_{p,max}$ | 0.45 | - |
| Generator Efficiency | $\eta_{gen}$ | 0.93 | - |
| Rectifier Efficiency | $\eta_{rect}$ | 0.95 | - |
| Boost Converter Eff | $\eta_{boost}$ | 0.96 | - |
| **DC Bus** |
| Target Voltage | $V_{target}$ | 400 | V |
| Voltage Range | - | 385-415 | V |
| Capacitance | $C$ | 2200 | µF |
| Switching Freq | $f_{sw}$ | 20 | kHz |
| **Inverter** |
| Target AC Voltage | $V_{ac}$ | 230 | V |
| AC Frequency | $f_{ac}$ | 50 | Hz |
| Modulation Index | $m_a$ | 0.9 | - |
| Inverter Efficiency | $\eta_{inv}$ | 0.95 | - |
| Filter Efficiency | $\eta_{filter}$ | 0.98 | - |
| **Power Quality** |
| THD Limit | - | < 5 | % |
| Power Factor Target | PF | > 0.95 | - |

---

## 🔬 References & Standards

1. **IEEE 519-2014**: IEEE Recommended Practice for Harmonic Control
2. **IEC 61727**: Photovoltaic (PV) systems - Characteristics of the utility interface
3. **Betz's Law**: Maximum theoretical wind turbine efficiency (59.3%)
4. **Single-Diode PV Model**: Standard photovoltaic cell modeling approach
5. **SPWM Technique**: Sinusoidal Pulse Width Modulation for inverters

---

**Document Version:** 1.0  
**Last Updated:** November 12, 2025  
**Created by:** GitHub Copilot  
**Project:** DC-Coupled Solar-Wind Hybrid Renewable Energy System (HRES)
