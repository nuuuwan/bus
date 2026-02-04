# Bus (Simulator API)

This repository implements a discrete-event simulator for a commuter bus system. It provides a RESTful interface to manage urban transit entities and visualize real-time bus movement across a geographical coordinate system.

## Core Entities & Architecture

The system is built on a graph-based model where **Halts** act as nodes and **Routes** define the edges and traversal logic.

### /route/::routeNum

A collection of ordered waypoints and halts.

* **Properties:** `distance_km`, `estimated_travel_time`, `halt_sequence`.
* **Logic:** For the moment, we assume `routeNum` follows a fixed bidirectional path between a specific `start_halt` and `end_halt`.

### /halt/::name

A fixed geographical point where buses pick up and drop off passengers.

* **Uniqueness:** Each halt name is a unique primary key.
* **Attributes:** `latLng`, `shelter_type`, `current_passenger_count`.

### /bus/::busID

An active vehicle instance within the simulation.

* **State:** `current_route`, `next_halt`, `occupancy`, `status` (In-transit, Stopped, or Delayed).

### /map/::latLng

A utility endpoint to query the simulation state at specific coordinates, returning the nearest halts or active buses within a defined radius.

### Future Objects

* **Depots:** Starting/Ending points for buses where maintenance and refueling occur.
* **People:** Individual agents with "Home" and "Work" locations, driving the demand for specific routes.

---

## Development Plan

### Stage 1: Static Geospatial Foundation

The initial implementation focuses on the "Atlas." We render the skeleton of the city.

* Define hardcoded JSON structures for routes and halts.
* Render static SVG/Canvas maps showing bus lines and markers for halts.
* **Goal:** Ensure the coordinate system correctly maps to the UI.

### Stage 2: Temporal Dynamics (The "Tick" System)

Introduce a simulation clock to move buses along the routes.

* Implement a `update()` loop that calculates bus positions based on constant speed.
* Buses now "teleport" or glide between halts based on the system time.
* Basic API polling to fetch the current `latLng` of all active `busIDs`.

### Stage 3: Reactive Intelligence & Logic

Move away from "ghost" buses and introduce real-world constraints.

* **Traffic Modeling:** Variable travel times based on time-of-day multipliers.
* **Halt Logic:** Buses must stop for a defined duration at each halt.
* **Capacity Limits:** Buses have a maximum occupancy; they can skip halts if full.

### Stage 4: Passenger Agent Simulation

The final stage introduces autonomous "People" agents to create a closed-loop economy.

* **Demand Generation:** People spawn at halts based on a Poisson distribution.
* **Pathfinding:** Agents choose routes based on the shortest path to their destination.
* **Analytics:** Track metrics like "Average Wait Time" and "Route Efficiency" to optimize the bus schedule.
