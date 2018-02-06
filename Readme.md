# Quickstart

## 1. Prerequisites

### Tomcat

Make sure you have Tomcat installed and running.

https://tomcat.apache.org/download-90.cgi

### ArangoDB

You need ArangoDB running, too.

https://www.arangodb.com/download-major/

### NPM

You'll also need NPM.

See here for installing NPM: https://docs.npmjs.com/cli/install

### Angular client

Easy install for the Angular client:

`npm i -g @angular/cli`

You might need to run this command as `sudo`.

## 2. Build the server

Go to the ArangoDB web interface at http://localhost:8529 and login with the username/password
that you setup when installing ArangoDB.

Next, click on "Users" on the side navigation and create a new user with:

    Username: slime
    Password: slime

This is the user the game server uses to save game data in the db.

Next, in the root cloned directory, run the following command:

`./gradlew :server:war`

Deploy the generated WAR file from `server/build/libs/server.war` to Tomcat (i.e. in the "WAR file to deploy" section of the Tomcat manager.)

Tomcat manager is located at: http://localhost:8080/manager/html/

## 3. Run the client

    cd web
    npm i
    ng serve -p 4444

## Play the game

Point your web browser to http://localhost:4444

## Notes

Edits to the source will be refresh the game automatically.
