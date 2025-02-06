# 3D Data Viewer with GIS Integration

This project is a web application that allows users to upload and visualize 3D point cloud data and GIS data from GeoJSON files. The application features an interactive 3D point cloud viewer and a GIS map viewer with filtering and customization options.

## Features

**File Upload & Details:**

*   Upload point cloud data (.xyz, .pcd) and GIS data (GeoJSON) with feedback on file details such as filename, size, number of points (for point cloud data), and bounding box dimensions (for point cloud data).

**3D Point Cloud Visualization:**

*   Render 3D point cloud data using Three.js.

**GIS Data Viewer:**

*   Visualize GIS data on an interactive Mapbox map.

**Filters & Controls:**

*   **3D Data:** Point size adjustment, color mapping by altitude with altitude range filtering, and background color filter.
*   **GIS Data:** Metadata display on marker click (coordinates, tags/descriptions), filtering by specific geometry type or property, customizable map style, and coloring for geometry types.

**Time-Series Animation:**

*   Replay GIS data points over time with customizable playback speed.

**Logs Viewer:**

*   A bottom panel displays a log of user actions and system feedback.

## Tech Stack

*   **Front-End Framework:** React.js
*   **UI Framework:** Tailwind CSS
*   **3D Rendering Library:** Three.js
*   **GIS Mapping Library:** Mapbox

## Deployed Project

[3D Data Viewer with GIS Integration](https://3d-data-viewer-with-gis-integration.netlify.app/)

## Setup Instructions

### Prerequisites

Before running the project, ensure you have the following installed:

*   Node.js
*   npm (Node Package Manager)

### Steps to Run the Project Locally

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/<username>/3D-Data-Viewer-with-GIS-Integration.git
    ```

2.  **Navigate to the project folder:**

    ```bash
    cd 3D-Data-Viewer-with-GIS-Integration
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Set up environment variables:**

    *   Create a `.env` file in the root directory and add the following variable:

        ```
        VITE_MAPBOX_ACCESS_TOKEN=<your_mapbox_token>
        ```

    *   Replace `<your_mapbox_token>` with your actual Mapbox API token.

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

    This will start the development server, and you can access the project in your browser at `http://localhost:5173`.