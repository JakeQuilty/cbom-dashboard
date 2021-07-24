# cybersec-bill-of-materials

# Setup

Start
`docker-compose up`


## Dev

Need to use `--build` to rebuild app with changes
`docker-compose up --build`

Run Backend Unit Tests
`npm test`

Start frontend
`npm start`

Start backend `npm run dev`

### Environment

Dev env with db, without having to restart server after every change

1. `docker-compose up` in `test/db/`
2. Set local environment variables for db
3. `npm run dev` in `server/`

### Logs

Can be changed in config

*Warning:* Silly mode will output _everything_... So say RIP to your terminal history 