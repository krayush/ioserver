# ioserver

***

## Quick Start
1. Install NodeJs( https://nodejs.org/download/ )
2. Open CMD and go to current project directory and run the following commands
3. npm install -g bower grunt-cli socket.io-client
4. npm install
5. grunt
6. It will open a new tab in your browser with http://localhost:5858
7. SET NODE_ENV=production (for linux machine) 
8. For development environment: SET NODE_ENV=development 
9. Use the alternatives for windows platform
10. Server will be running on port no. 3002 (Development port)
11. To run the server on the production environment use 
    npm install forever -g
& then
    forever start app.js
For help check
https://www.npmjs.com/package/forever

## Overview

The `/` project directory contains all code used in the application along with all tests of such code.
```
/
  |- api/
  |- bin/
  |- collections/
  |- config/
  |- controllers/
  |- env/
  |- lib/
  |- models/
  |- public/
  |- routes/
  |- test/
  |- views/
  |- .gitignore
  |- .jshintrc
  |- gruntfile.js
  |- app.js
  |- package.json
  |- README.md

```

##Help Links
1. http://blog.ragingflame.co.za/2015/4/1/how-i-build-nodejs-applications
2. https://github.com/ChrisWren/grunt-nodemon
3. http://techblog.troyweb.com/index.php/2014/05/using-grunt-to-auto-restart-node-js-with-file-watchers/