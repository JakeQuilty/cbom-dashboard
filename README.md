# Cybersecurity Bill of Materials Dashboard

Scan multiple GitHub Organizations for dependency versions and view this information in a human-readable format

## Setup

1. Clone this repo
1. Start with `docker-compose up`
1. Hosted on `http://localhost:3000`

## Usage

### Add Organization

To add an organization, press the blue `+` button at the top right of the organizations page. Then put in the name of the GitHub Organization you would like to add. This is not case sensitive.

### Scan

To scan the organization for dependencies, click on the organization in the table of orgs. Then click the `Scan` button in the top right of this page.

*Scanning may take a while depending on the number of repos and dependencies*.

## Dev

### Run In Containers

While this option works for making one small change, I'd recommend using the Recommended Dev Environment bellow.

**Start Containers:**

`docker-compose up --build`

* Need to use `--build` to rebuild app with changes

### Recommended Dev Environment

Run everything locally.

This is great for doing a lot of changes, because you do not have to rebuild and restart everything after every change.

1. Start development database:
    1. `cd test/db/`
    1. `docker-compose up`

2. In a new terminal, set local environment variables for database:

    ```bash
    export DB_ADDRESS=localhost \
        DB_USERNAME=user \
        DB_PASSWORD=password123 \
        DB_NAME=cbom_dashboard
    ```

3. In the same terminal as `2.`, start backend:
    1. `cd server/`
    1. `npm run dev`

4. Change frontend proxy address:
    1. Open `app/package.json`
    1. Change `"proxy": "http://backend:3080"` to `"proxy": "http://localhost:3080"`

5. In a new terminal, start frontend:
    1. `cd app/`
    1. `npm start`

6. Available on `http:/localhost:3000`

**Make sure to change the proxie back before pushing**.

### Logs

Can be changed in config or with environment variable: `LOG_LEVEL`

*Warning:* Silly mode will output _everything_... So say RIP to your terminal history

### Tests

*Tests are currently very minimal*.

#### Backend

1. `cd server/`
1. `npm test`
