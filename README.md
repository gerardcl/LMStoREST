# Middleware REST API for the LiveMediaStreamer framework

This middleware REST API translates HTTP JSON messages into TCP socket JSON messages with the aim to help developing cloud applications over the [liveMediaStreamer framework](https://github.com/ua-i2cat/liveMediaStreamer)

##Installation

Clone the git repository

    git clone https://github.com/ua-i2cat/LMStoREST

Install dependencies

    npm install
    
Run the middleware:

    npm start

Now, the API is running at http://localhost:8080/api

**NOTE**: If you want to define another listening port just setup your PORT environment variable.

##Usage

First of all, it is required to install nodejs and npm

    sudo apt-get install npm

Also, to install [liveMediaStreamer framework](https://github.com/ua-i2cat/liveMediaStreamer/wiki) and run the daemon

    ./livemediastreamer <lms-port>
    
Once LMS is running and listening on *lms-port* follow the API REST methods to configure and play with it.

##API REST methods

**Connect**
Checks if an existing instance of LMS is running and sets the lms-port and lms-host to work with.

    POST http://localhost:8080/api/connect
    JSON    {
                "port":lms-port,
                "host":"lms-host"
            }

**Disconnect**
Reset the LMS instance running and sets lms-port and lms-host to null in order to connect again to the same or another LMS instance.

    GET http://localhost:8080/api/disconnect

**State**
Gets the state object of the current LMS instance connected to (the configured filters and paths).

    GET http://localhost:8080/api/state
