# nxtri-db frontend

Universal Javascript applikasjon for consuming nxtri-db

## Install

```bash
npm i
```

Add an `.env` file in the root of the project with enviroment variables for the database:

```
DB_HOST=server
DB_USER=username
DB_NAME=dbname
DB_PASSWORD=passowrd
```

## Development-guide

This application uses the following technologies:

* React
* React-router - routing in the application, see the main routing definition in src/routes.js
* Redux - state-management
* Express.js - server-side rendering (SSR) of the javascript-app on intial loading, serving resources and backend-api (see src/server.js and api/api.js)
* Styled-components - css-in-js solution for adding styles to the react-components. In the inital ssr-render (in production) styles from the displayed components are gathered and inlined in a style-tag in the html-document (see src/helpers/Html.js)
* Redux-connect - this ensure that data needed for the rendered route are loaded before the inital ssr-render. (See @asyncConnect in src/containers/Results/index.js, its redux-reducer src/redux/modules/results.js and its backend-service in api/routes/results.js)

## Run development server

```bash
npm run dev
```

Open browser in [localhost:3000](http://localhost:3000) to see the website. While running in dev changes made in the application should hot-reload thanks to webpack-dev-server

## Run production enviroment

```bash
npm run build // This command will bundle the client-side parts in static/dist folder
npm run start
```

Service should be up at localhost:8080

