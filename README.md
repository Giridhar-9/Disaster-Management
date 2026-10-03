# CrisisGuard

CrisisGuard is a browser-based disaster information and emergency reporting platform. It brings together disaster-related news, safety precautions, a live disaster map, emergency contacts, and a location-based disaster reporting flow.

## Features

### 1. Disaster News

- Fetches disaster-related news articles using **NewsAPI**.
- Searches for articles related to earthquakes, floods, wildfires, tsunamis, and cyclones.
- Displays article information including publication time, description, disaster category, and a link to the original article.
- Provides client-side search to filter loaded articles.

### 2. Live Disaster Map

- Uses **Leaflet** for interactive map visualization.
- Uses **OpenStreetMap** tiles as the map layer.
- Fetches earthquake data from the **USGS Earthquake Hazards Program**.
- Displays earthquake locations and magnitudes on the map.
- Fetches current wildfire incident locations using a public **WFIGS/NIFC ArcGIS** data service.
- Displays wildfire locations on the map.
- Uses browser geolocation to display and navigate to the user's current location.

### 3. Google Authentication and Disaster Reporting

- Provides Google Sign-In using **Firebase Authentication**.
- Only authenticated users can access the disaster reporting page.
- Requests the user's location using the **Browser Geolocation API**.
- Displays the user's current location using **Leaflet** and **OpenStreetMap**.
- Allows users to describe a disaster-related problem.
- Stores the authenticated user's UID, name, email, coordinates, problem description, and timestamp in **Firebase Firestore**.
- Reports are stored in the `disaster_reports` collection.

### 4. Safety Precautions

- Provides precautionary guidance for different disaster types.
- Uses interactive sections and modals to display safety information.

### 5. Emergency Contacts

- Provides emergency contact numbers for multiple countries.
- Allows users to search for a country.
- Provides clickable phone links for supported devices.

## Technologies Used

- **HTML5, CSS3, JavaScript** — frontend and application logic
- **Leaflet** — interactive map visualization
- **OpenStreetMap** — map tiles
- **Firebase Authentication** — Google Sign-In
- **Firebase Firestore** — disaster-report storage
- **NewsAPI** — disaster news
- **USGS Earthquake API** — earthquake data
- **WFIGS/NIFC ArcGIS Service** — wildfire incident data
- **Browser Geolocation API** — user's current location
- **Git/GitHub** — version control and project management

## Application Flow

```text
                         CrisisGuard
                              │
                 ┌────────────┼────────────┐
                 │            │            │
                 ▼            ▼            ▼
              News       Precautions      Map
                 │            │            │
                 ▼            ▼            ▼
             NewsAPI     Safety Info   Leaflet
                                           │
                              ┌────────────┼────────────┐
                              │            │            │
                              ▼            ▼            ▼
                            USGS       WFIGS/NIFC   Geolocation
                         Earthquakes   Wildfires     API
                              │            │            │
                              └────────────┼────────────┘
                                           │
                                           ▼
                                      Map Display


                         Rescue / Report
                              │
                              ▼
                       Google Sign-In
                              │
                              ▼
                     Firebase Authentication
                              │
                              ▼
                       Problem Reporting
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
             Browser Location      Problem Details
                    │                   │
                    └─────────┬─────────┘
                              │
                              ▼
                       Firebase Firestore
                              │
                              ▼
                    `disaster_reports`


                    Emergency Contacts
                              │
                              ▼
                       Search Country
                              │
                              ▼
                         Click to Call
```

## Application Architecture

CrisisGuard follows a browser-based client-side architecture.

```text
User
 │
 ▼
Frontend
HTML + CSS + JavaScript
 │
 ├──────────────► NewsAPI
 │
 ├──────────────► USGS Earthquake API
 │
 ├──────────────► WFIGS/NIFC ArcGIS Service
 │
 ├──────────────► Browser Geolocation API
 │
 ├──────────────► OpenStreetMap
 │
 └──────────────► Firebase
                       │
                       ├── Authentication
                       │
                       └── Firestore
```

### Disaster Map Flow

```text
USGS Earthquake API ───────┐
                           │
WFIGS/NIFC Wildfire API ───┼──► Leaflet Map
                           │
Browser Geolocation ───────┘
```

### Disaster Reporting Flow

```text
User
 │
 ▼
Google Sign-In
 │
 ▼
Firebase Authentication
 │
 ▼
Authenticated User
 │
 ▼
Browser Geolocation
 │
 ▼
Problem Description
 │
 ▼
Firebase Firestore
 │
 ▼
disaster_reports
```

## Important Implementation Notes

### Google Authentication

The current version uses **Firebase Authentication with Google Sign-In**.

Users must authenticate with Google before accessing the disaster reporting page.

The authenticated user's:

- UID
- Display name
- Email address

are associated with each submitted report.

The application uses Firebase Authentication to determine whether the user is authorized to access the reporting page.

### Disaster Reporting

The reporting page allows an authenticated user to submit a disaster-related problem.

Each report contains:

```text
User ID
Name
Email
Latitude
Longitude
Location
Problem Description
Timestamp
```

Reports are stored in the Firestore collection:

```text
disaster_reports
```

### Location Reporting

The application requests location permission through the browser.

When permission is granted:

- The user's latitude and longitude are obtained.
- The location is displayed on a Leaflet map.
- The location is stored with the disaster report.

If location access is denied or unavailable, the report can still contain an unavailable location value.

The current version does **not** automatically:

- verify whether a user is inside a disaster-effect radius,
- identify the nearest rescue team,
- dispatch a rescue team, or
- automatically assign a rescue team to a report.

These features would require additional backend logic and authoritative disaster/rescue data.

### Firestore Security

The disaster reporting system uses Firebase Authentication together with Firestore security rules.

Only authenticated users are permitted to read or write documents in the `disaster_reports` collection.

### API Configuration

The project uses several external services:

- NewsAPI
- USGS Earthquake API
- WFIGS/NIFC ArcGIS Service
- OpenStreetMap
- Firebase Authentication
- Firebase Firestore

Some services require configuration or API access depending on the deployment environment.

For production deployment, API credentials and external service access should be managed according to the security requirements of each service.

## Running the Project

The project can be run locally using a web server such as **VS Code Live Server**.

### Steps

1. Clone or download the project repository.
2. Open the project folder in VS Code.
3. Start the project using Live Server.
4. Open `index.html`.
5. Allow browser location access when using the Map or Disaster Reporting features.
6. Ensure Firebase Authentication and Firestore are configured for the project.
7. Ensure the required NewsAPI configuration is available for the News page.

### Firebase Requirements

The Firebase project should have:

- Firebase Authentication enabled.
- **Google Sign-In** enabled as an authentication provider.
- Firestore Database enabled.
- Appropriate Firestore security rules configured for authenticated users.

## Main Pages

| File | Purpose |
|---|---|
| `index.html` | Home page and navigation |
| `news.html` | Disaster news and search |
| `map.html` | Interactive disaster map |
| `measures.html` | Disaster precautions |
| `login.html` | Google authentication |
| `problem.html` | Location-based disaster reporting |
| `emergency.html` | Emergency contacts |

## Project Structure

```text
CrisisGuard/
│
├── Images/
│   └── Project images and assets
│
├── index.html
├── news.html
├── news.js
├── news.css
│
├── map.html
│
├── measures.html
├── measures.js
├── measuresStyle.css
│
├── login.html
├── script.js
│
├── problem.html
├── problem.js
│
├── emergency.html
│
├── demo.js
├── style.css
└── README.md
```

## External Services and APIs

### NewsAPI

Used to retrieve disaster-related news articles.

The News page searches for disaster-related topics such as:

```text
Earthquakes
Floods
Wildfires
Cyclones
Tsunamis
```

### USGS Earthquake Data

The application retrieves earthquake information from the USGS Earthquake Hazards Program and displays earthquake locations on the Leaflet map.

### WFIGS/NIFC Wildfire Data

The application retrieves current wildfire incident locations from a public WFIGS/NIFC ArcGIS service and displays the available wildfire locations on the map.

### OpenStreetMap

OpenStreetMap provides the map tiles used by Leaflet.

### Firebase Authentication

Firebase Authentication provides Google Sign-In for users accessing the disaster reporting functionality.

### Firebase Firestore

Firestore stores submitted disaster reports in the:

```text
disaster_reports
```

collection.

### Browser Geolocation API

The Browser Geolocation API is used to obtain the user's current geographic coordinates after permission is granted.

## Security Considerations

The current project is primarily a frontend-based student project.

For production deployment, additional security measures would be recommended, including:

- Stronger server-side validation.
- Backend API architecture for sensitive operations.
- Rate limiting.
- More restrictive Firestore security rules.
- Proper API key management.
- Input sanitization and validation.
- Monitoring and logging.
- Role-based access control for administrators and emergency authorities.

## Current Limitations

The current version does not include:

- Dedicated backend server for disaster reports.
- Administrator dashboard.
- Rescue-team assignment.
- Automatic rescue-team dispatch.
- Disaster-radius verification.
- Report status management.
- Real-time communication with emergency authorities.
- Advanced role-based authorization.
- Production-grade rate limiting.

## Future Improvements

Possible future improvements include:

- Add a dedicated backend for report management.
- Create an administrator/authority dashboard.
- Add report status tracking such as:
  - `Pending`
  - `Assigned`
  - `In Progress`
  - `Resolved`
- Implement nearest-rescue-team identification.
- Add emergency authority notifications.
- Implement disaster-radius validation using authoritative datasets.
- Add stronger input validation and rate limiting.
- Improve API error handling and loading states.
- Add real-time updates for disaster reports.
- Add role-based access for administrators and emergency personnel.
- Improve accessibility and mobile responsiveness.

## Project Objective

The primary objective of CrisisGuard is to provide a centralized web platform where users can:

1. Access current disaster-related information.
2. View disaster locations on an interactive map.
3. Read safety precautions.
4. Access emergency contact information.
5. Authenticate securely using Google.
6. Submit location-based disaster reports.

The project demonstrates the integration of frontend web technologies with external APIs, browser services, Firebase Authentication, and cloud-based Firestore storage.
