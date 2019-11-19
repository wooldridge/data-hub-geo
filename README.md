# data-hub-geo

Visualize geospatial information in MarkLogic Data Hub on an OpenLayers map.

<img src="https://raw.githubusercontent.com/wooldridge/data-hub-geo/master/images/screenshot.png" alt="Map" style="width: 600px;"/>

## Requirements

- Node.js v8.14.0+
- npm v6.4.1+
- MarkLogic Data Hub 5

## Setup

Install [MarkLogic Data Hub](https://github.com/marklogic/marklogic-data-hub) and run through the enrichment step of the [insurance example](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/insurance). This will ingest customer data into your Data Hub and enrich that data with latitude and longitude properties.

Install this project:

```
git clone https://github.com/wooldridge/data-hub-geo
cd data-hub-geo
npm install
```

In a text editor, open `config_sample.js` and edit the settings (e.g., username and password for your Data Hub). Save the file as `config.js`.

## Start the Application

From the project root in a terminal window:

`node server`

From the project root in a second terminal window:

`npm start`

## Open the Application in a Web Browser

http://localhost:1234
