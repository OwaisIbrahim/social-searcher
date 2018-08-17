# SOCIAL SEARCHER #

This API has 2 modes the consumer mode and the author mode

## How to run this project

1. Download/Clone the repository to your local machine
2. Open the terminal line to the file location and enter the following commands one by one to downlaod all dependencies
```
npm install
```
3. After successful download of dependecies you need to convert the typescript code into javascript by putting the following command
```
tsc -w
```
4. Now you need to run the server to work on social-search api, for that enter the following command
```
nodemon build/index.js
```
5. Open postman (you can easily find this in google extension) and switch to POST request
6. As the API has 2 modes (consumer and author). Please refer to next section to run in your desire mode

### Run in Consumer Mode
```
    1. To run the API in consumer Mode, enter the url http://localhost:4000/socialsearch
    2. Then copy the *Consumer Post Request* from Input_and_output_format.txt and paste it to POST request body
    3. Hit enter to send the request and wait for outcome
 ```
 
### Run in Author Mode
```
    1. To run the API in consumer Mode, enter the url http://localhost:4000/search
    2. Then copy the *Author Post Request* from Input_and_output_format.txt and paste it to POST request body
    3. Hit enter to send the request and wait for the outcome
 ```

### License and copyright

**© Owais Ibrahim**
**© Shahiq Qureshi**
**© Ibrahim Jawed**
**© Taha Asif**
