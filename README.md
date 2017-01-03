# ioserver

***

## Quick Start
1. Install NodeJs( https://nodejs.org/download/ )
2. Open CMD and go to current project directory and run the following commands
3. npm install -g bower grunt-cli
4. npm install
5. grunt
6. SET NODE_ENV=production (development for dev environment) for linux machine.
7. Server will be running on port specified in /config/appConstants.js
8. npm install forever -g (to run the server on the production environment)
9. forever start app.js

## Overview

The `/` project directory contains all code used in the application along with all tests of such code.
```
/
  |- config/
  |- controllers/
  |- env/
  |- models/
  |- public/
  |- middlewares/
  |- routes/
  |- vendor/
  |- views/
  |- .gitignore
  |- .jshintrc
  |- .jshintignore
  |- gruntfile.js
  |- app.js
  |- package.json
  |- README.md
  |- .rebooted

```

##API references
- Registering a session:
```
URL: /user/register-session
METHOD: POST
HEADERS: 
    appConstants.authHeaders.token: publicKey
REQUEST: {
    encryptedData: "encryptedData"
    data: {
        userId: "a@b.com"
    }
}
```
- Ending a session:
```
URL: /user/end-session
METHOD: POST
HEADERS: 
    appConstants.authHeaders.token: publicKey
REQUEST: {
    encryptedData: "encryptedData"
    data: {
        action: "END_SINGLE",
        sessionToken: "sessionToken"
    }
}

or 

REQUEST: {
    encryptedData: "encryptedData"
    data: {
        action: "END_ALL_BY_USER",
        sessionToken: "sessionToken"
    }
}

or 

REQUEST: {
    encryptedData: "encryptedData"
    data: {
        action: "END_ALL"
    }
}
```
- Publish a message:
```
URL: /publish
METHOD: POST
HEADERS: 
    appConstants.authHeaders.token: publicKey
REQUEST: {
    encryptedData: "encryptedData"
    data: {
        action: "PUBLISH_SINGLE",
        sessionToken: "sessionToken",
        message: "jsonstringifiedmessage"
    }
}
or 
REQUEST: {
    encryptedData: "encryptedData"
    data: {
        action: "PUBLISH_ALL_BY_USER",
        sessionToken: "sessionToken",
        message: "jsonstringifiedmessage"
    }
}
or 
REQUEST: {
    encryptedData: "encryptedData"
    data: {
        action: "PUBLISH_ALL",
        message: "jsonstringifiedmessage"
    }
}
```

##Help Links
1. http://blog.ragingflame.co.za/2015/4/1/how-i-build-nodejs-applications
2. https://github.com/ChrisWren/grunt-nodemon
3. http://techblog.troyweb.com/index.php/2014/05/using-grunt-to-auto-restart-node-js-with-file-watchers/
4. https://www.npmjs.com/package/forever