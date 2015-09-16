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
    
Once LMS is running and listening on *lms-port* just play with the API REST methods.

##API REST methods

Sent and received messages are JSON objects. Per each method the message to sent is specified next (if a message is required). The received messages always has the following structure when:

**Succes**

    JSON    {
                "message": { the incoming message could be a string, bool, array or another object, depending on the method }
            }

**Error**

    JSON    {
                "error": "the error message"
            }


####Connect
Checks if an existing instance of LMS is running and sets the lms-port and lms-host to work with.

    POST http://localhost:8080/api/connect
    JSON    {
                "port":lms-port,
                "host":"lms-host"
            }

####Disconnect

Reset the LMS instance running and sets lms-port and lms-host to null in order to connect again to the same or another LMS instance.

    GET http://localhost:8080/api/disconnect

####State
Gets the state object of the current LMS instance connected to (the configured filters and paths).

    GET http://localhost:8080/api/state

####Create a filter
Creates a filter (current types are: receiver, transmitter, demuxer, dasher, audioDecoder, audioEncoder, videoDecoder, videoResampler, videoEncoder, audioMixer, videoMixer)

    POST http://localhost:8080/api/createFilter
    JSON    {
                "id": filterID,
                "type": "type"
            }

####Configure an existing filter
Configures an existing filter (each filter has its own actions defined, check the LiveMediaStreamer wiki to know them)

    PUT http://localhost:8080/api/filter/:filterID
    JSON    [
                {
                    "action":"the action",
                        "params":{
                            "param1":param1,
                            "param2":"param2",
                            "param3":"param3",
                            "param4":true
                    }
                },
                {
                    "action":"another action",
                        "params":{
                            "param1":param1,
                            "param2":"param2",
                            "param3":"param3",
                            "param4":true
                    }
                },
                ...
            ]

####Create a path of filters
Create a path of filters. A path can be a master path or an slave one, as shown:

**Master path**

    POST http://localhost:8080/api/createPath
    JSON    { 
                'id' : pathId, 
                'orgFilterId' : orgFilterId, 
                'dstFilterId' : dstFilterId, 
                'orgWriterId' : orgWriterId, 
                'dstReaderId' : dstReaderId, 
                'midFiltersIds' : [filterID1, filterID2,...] 
            }
                

