# CrisisGuard

CrisisGuard is a browser-based disaster information and emergency reporting platform. It brings together disaster-related news, safety precautions, a live visualization map, emergency contacts, and a location-based problem reporting flow.

## Features

### 1. Disaster News
- Fetches disaster-related news articles using the **NewsAPI**.
- Searches for articles related to earthquakes, floods, wildfires, tsunamis, and cyclones.
- Displays publication time, article description, disaster category, and a link to the original article.
- Provides client-side search to filter the loaded articles.

### 2. Live Disaster Map
- Uses **CesiumJS** for the interactive 3D globe/map.
- Fetches the day's earthquake data from the **USGS Earthquake Hazards Program**.
- Fetches active-fire data from **NASA FIRMS** and displays wildfire locations.
- Includes predefined drought-region markers for demonstration.
- Includes an optional **OpenWeatherMap** overlay for rain and thunderstorm conditions at selected locations. A valid OpenWeatherMap API key must be added in `map.html` for this feature to work.
- Uses browser geolocation to move the map to the user's current location when the GPS button is pressed.

### 3. Disaster Reporting / Rescue Request
- The user enters a 10-digit mobile number on the rescue verification page.
- The current project uses a **client-side demo OTP flow**: a four-digit OTP is generated in the browser and displayed through an alert for verification.
- After successful OTP verification, the phone number is stored in browser `localStorage` and the user is taken to the disaster reporting page.
- The reporting page requests the user's browser location using the **Geolocation API**.
- The user's phone number, coordinates, problem description, and timestamp are stored in **Firebase Firestore** under the `disaster_reports` collection.
- The reporting page also displays the user's location using **Leaflet** and **OpenStreetMap** tiles.

### 4. Safety Precautions
- Provides precautionary guidance for different disaster types.
- Uses interactive sections/modals to display safety information.

### 5. Emergency Contacts
- Provides emergency contact numbers for multiple countries.
- Allows users to search for a country.
- Provides clickable phone links for supported devices.

## Technologies Used

- **HTML5, CSS3, JavaScript** — frontend and application logic
- **CesiumJS** — 3D disaster map visualization
- **Leaflet** — location/reporting map
- **OpenStreetMap** — map tiles used by Leaflet
- **Firebase Firestore** — disaster-report storage
- **NewsAPI** — disaster news
- **USGS Earthquake API** — earthquake data
- **NASA FIRMS** — active-fire data
- **OpenWeatherMap API** — optional weather overlay
- **Browser Geolocation API** — user's current location

## Application Flow

```text
Home Page
   │
   ├── News ───────────────► NewsAPI ─────────────► Disaster articles
   │
   ├── Precautions ────────► Safety information
   │
   ├── Map ─────────────────► CesiumJS
   │                            ├── USGS earthquake data
   │                            ├── NASA FIRMS fire data
   │                            ├── Optional OpenWeatherMap data
   │                            └── Browser geolocation
   │
   └── Rescue
         │
         ▼
      OTP Demo
         │
         ▼
   Problem Reporting
         │
         ├── Browser Geolocation
         ├── Leaflet + OpenStreetMap
         └── Firebase Firestore
                │
                ▼
        `disaster_reports`

Emergency Contacts
   └── Search + click-to-call
```

## Important Implementation Notes

### OTP Verification
The current OTP is a **demo implementation** performed entirely in the browser. It is not Firebase Phone Authentication and should not be treated as production-grade authentication.

For a production application, OTP delivery and verification should be handled by a trusted authentication/backend service rather than exposing the generated OTP in client-side JavaScript.

### Location Reporting
The application requests location permission through the browser. If permission is denied or location is unavailable, the report can still contain an unavailable location value rather than automatically identifying a rescue team.

The current version does **not** automatically:
- verify whether a user is inside a disaster-effect radius,
- identify the nearest rescue team, or
- dispatch a rescue team.

Those would require additional backend logic and authoritative disaster/rescue data.

### API Keys and Client-Side Configuration
Some external services require client-side configuration, including NewsAPI, Cesium, and optionally OpenWeatherMap. For a production deployment, API credentials should be managed carefully and protected where the service supports server-side credential handling.

## Running the Project

This is a static frontend project, so the HTML files can be served using a local web server.

For example, using VS Code Live Server:

1. Open the project folder in VS Code.
2. Start the project with Live Server.
3. Open `index.html`.
4. Allow browser location access when using the Map or Rescue/Report features.
5. Ensure Firebase/NewsAPI configuration is available for the corresponding features.
6. Add a valid OpenWeatherMap API key in `map.html` if the weather overlay is required.

## Main Pages

| File | Purpose |
|---|---|
| `index.html` | Home page and navigation |
| `news.html` | Disaster news and search |
| `map.html` | 3D disaster map |
| `measures.html` | Disaster precautions |
| `login.html` | Demo OTP verification |
| `problem.html` | Location-based disaster reporting |
| `emergency.html` | Emergency contacts |

## Project Limitations / Future Improvements

- Replace the client-side OTP demo with secure server-side/Firebase Phone Authentication.
- Move sensitive API configuration to an appropriate backend or secure configuration mechanism.
- Add backend validation and authorization for disaster reports.
- Add an authority/rescue-team dashboard to review reports.
- Implement disaster-radius validation using authoritative disaster datasets.
- Implement nearest-rescue-team identification and notification.
- Add report status tracking such as `Pending`, `Assigned`, `In Progress`, and `Resolved`.
- Add stronger input validation and rate limiting.
- Improve error handling and loading states for external APIs.
