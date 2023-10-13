const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'})

const doc = {
    info: {
      version: '0.2.0',            // by default: '1.0.0'
      title: 'Expenses REST API',              // by default: 'REST API'
      description: 'REST API for Managing Expenses'         // by default: ''
    },
    servers: [
      {
        url: 'http://localhost:8000/',              // by default: 'http://localhost:3000'
        description: 'Development Server'       // by default: ''
      },
    //   { url: 'https://cse-341-chima.onrender.com/',
    //     description: 'Production Server' 
    //     },
    ],
    tags: [                   // by default: empty Array
      {
        name: '',             // Tag name
        description: ''       // Tag description
      },
      // { ... }
    ],
    components: {}            // by default: empty object
  };
  
  const outputFile = './swagger.json';
  const routes = ['./routes/index.js'];
  
  /* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
  root file where the route starts, such as index.js, app.js, routes.js, etc ... */
  
  swaggerAutogen(outputFile, routes, doc);