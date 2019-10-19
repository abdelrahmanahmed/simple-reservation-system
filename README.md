This app if for reservation services. I used the followig components for:
-   **Authentication** microservice to authentcation incoming reuqests and check authorization.
-   **User Database** which is mariaDB and it is used for storing user data
-   **Reservation** microservice is used to reserve rooms based on user bonus
-   **Rooms Database** which is mariaDB and it is used for storing room data and reservation status
-   **Nginx** as an API Gatway
-   **rabbitMQ** as a messging system to send notification from reservation microservice to **reservationStatus** queue.


# Prerequests
- npm `5.6.0`
- node `8.10.0`
- docker `18.06.1-ce`
- docker-compose `1.22.0`

# How To run This Project
-  For the first time :
    -   This will create microservices database and will install all the packages for all microservices and then it will run all the containers using `docker-compose up` command
    ```
    sh build.sh
    ```
    - If this not your first time to run the project use `docker-compose up` command

# Assumptions
-  This project will run on linux environment

# How It Works
First of all you need to add to your headers **apiSecret** with its value **5V3TRE9-W3K4P99-HYCTGX9-VRBFVAL** . The following examples are how to use reservation API endpoints.

- GET `http://localhost/reservation/api/available-rooms` is returning all available-rooms
- POST `http://localhost/reservation/api/reserve-room` will reserve room there is any available rooms. You must add this payload in your body request:
```
{
	
	"room_id":1,
	"user_id":2
}
```
This will reserve **room_id (1)** for **user_id (2)**

 If he/she has enough bonus points, the status of this room <-> user relation
changes to "RESERVED" and bonus points are subtracted.
 If he/she does not have enough bonus points, the status changes to
“PENDING_APPROVAL”


# Testing
- Every microserice has it owns unit tests
- to run unit tests for `reservation`, go to `reservation` folder and run
```
npm test
```
- to run unit tests for `authentication`, go to `authentication` folder and run
```
npm test
```

# Container Integration
- I used Jenkins to setup CI

# Enhancements
- [ ] error Handling
- [ ] more eslint rules
- [ ] Add environment variables
