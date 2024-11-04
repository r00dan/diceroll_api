## Docker

1. Create network:

```sh
$ docker network create -d bridge diceroll-network
```

2. Run up command:

```sh
$ docker-compose --env-file ./.env up
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
