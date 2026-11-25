# Know Your Countries 🌍

## Overview

**Know Your Countries** is a web application that allows users to explore and compare countries around the world. It retrieves country information from the REST Countries API and presents it in a simple, interactive interface.

Users can search for countries, filter them by region, sort them by population or area, and view detailed information about individual countries.
## Live Website

Visit the deployed application here: **[Know Your Countries – Live Website] http://35.177.55.18  **

The application is already deployed and accessible through the load balancer. Visitors can use it directly without installing anything or creating a local `config.js` file.

**Note:** The `config.js` file and API key are only required when setting up and running the application locally.
## Demo Video

[Watch the project demo](https://www.loom.com/share/e3c6c07591bf42b7a1c1c84e070d8c90)

## Deployment Evidence

[View deployment testing evidence](https://drive.google.com/file/d/1yq3OMa2vbnLdRyO9tJFTHQqCSehXwcYa/view?usp=sharing)

The evidence shows both web servers responding successfully and HAProxy distributing requests between them.

## Features

- **Country Search:** Search for countries by name.
- **Region Filtering:** Filter countries by region.
- **Sorting:** Arrange countries alphabetically, by population, or by area.
- **Country Details:** View additional information, including capital, region, continent, population, landlocked status, calling codes, and time zones.
- **Country Flags:** View each country's flag alongside its information.
- **Data Caching:** Uses browser LocalStorage to cache country data for 24 hours, reducing repeated API requests.
- **Error Handling:** Displays messages for API and network errors and provides a retry option.
- **Responsive Design:** Provides an interface for desktop and mobile devices.

## Technologies Used

- **HTML5** – Application structure.
- **CSS3** – Styling and responsive layout.
- **JavaScript** – Application functionality, API requests, filtering, sorting, and DOM manipulation.
- **REST Countries API** – Source of country information.
- **LocalStorage** – Browser-side data caching.
- **Nginx** – Web server used to serve the application.
- **HAProxy** – Load balancer used to distribute incoming requests between two web servers.

## API Integration

The application uses the [REST Countries API](https://restcountries.com/) to retrieve country information.

It requests selected country fields, including country names, flags, regions, population, area, capitals, continents, time zones, and calling codes.

The application also handles paginated responses to collect country records and uses LocalStorage to cache the retrieved data for 24 hours.

## How to Run the Application Locally

### Requirements

- A web browser.
- Git installed on your computer.
- Visual Studio Code or another code editor.
- A valid API key.

### Steps

**1. Clone the repository**

```bash
git clone https://github.com/humwamikaz-ops/web-infra_playing_with_apis.git
```

**2. Navigate into the project folder**

```bash
cd web-infra_playing_with_apis
```

**3. Configure the API key**

The API key is provided separately in the project submission comments.

Create a local file named `config.js` in the project root and add:

```javascript
const API_KEY = "YOUR_API_KEY";
```

Replace `YOUR_API_KEY` with the provided API key.

**Note:** The `config.js` file is not included in the repository. You must create it locally before running the application.

**4. Start the local development server**

Open the project folder in Visual Studio Code. If you have the Live Server extension installed, right-click `index.html` and select **Open with Live Server**.

**5. Open the application**

The application should open in your browser. You can now search for countries, filter by region, sort results, and view country details.

## Deployment Architecture

The application is deployed across two web servers behind an HAProxy load balancer.

**Infrastructure:**

- Load Balancer: `7421-lb-01`
- Web Server 1: `7421-web-01`
- Web Server 2: `7421-web-02`

HAProxy uses the **Round Robin** algorithm to distribute incoming HTTP requests between the two web servers.

Both web servers are configured as backend servers with health checks enabled.

### Load Balancer Testing

The load balancer was tested by:

1. Sending direct HTTP requests to both web servers.
2. Confirming that both servers returned `HTTP 200 OK`.
3. Sending ten consecutive requests through HAProxy.
4. Checking the custom `X-Served-By` response header to identify which backend handled each request.

The test confirmed that five requests were handled by `7421-web-01` and five by `7421-web-02`, demonstrating successful traffic distribution.

## Project Structure

```text
web-infra_playing_with_apis/
│
├── index.html
├── about.html
├── index.css
├── index.js
├── fire.gif
└── README.md
```

## Resources and Acknowledgements

- [REST Countries API](https://restcountries.com/) – Source of country information.
- [MDN Web Docs](https://developer.mozilla.org/) – Reference for HTML, CSS, and JavaScript.

Anthropic's Claude AI was used for guidance, debugging assistance, and direction to learning resources during development.

