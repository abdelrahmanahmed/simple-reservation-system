[![CircleCI](https://circleci.com/gh/abdelrahmanahmed/reservation/tree/master.svg?style=svg)](https://circleci.com/gh/abdelrahmanahmed/reservation/tree/master)

# Reserviation Microservice

# Installation
```
npm install
```

# Create Reservation Table with data
```
npm run build
```

# Assumptions
-   TODO

# How It Works
- GET `/api/available-rooms` is returning all available-rooms
- POST `/api/reserve-room` will reserve room there is any available rooms
    - If he/she has enough bonus points, the status of this room <-> user relation
changes to "RESERVED" and bonus points are subtracted.
    - If he/she does not have enough bonus points, the status changes to
“PENDING_APPROVAL”


# Testing
- to run unit tests
```
npm test
```


# Enhancements
- [ ] error Handling
- [ ] more eslint rules