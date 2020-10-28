var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const https = require('https');
const fs = require('fs');
var app = express();

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  input PtInput {
    ownerId: Int!
    longitude: Float!
    latitude: Float!
    createdAt: String!
  }

  type Pt {
    id: ID!
    ownerId: Int!
    longitude: Float!
    latitude: Float!
    createdAt: String!
  }

  type Query {
    getPt(id: ID!): Pt
  }

  type Mutation {
    createPt(input: PtInput): Pt
     
  }
`);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// If Pt had any complex fields, we'd put them on this object.
class Pt {
  constructor(id, {ownerId, longitude, latitude, createdAt}) {
    this.id = id;
    this.ownerId = ownerId;
    this.longitude = longitude;
    this.latitude = latitude;
    this.createdAt = createdAt;
  }
}

// Maps username to content
var fakeDatabase = {};

var root = {
  getPt: ({id}) => {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    return new Pt(id, fakeDatabase[id]);
  },
  createPt: ({input}) => {
    // Create a random id for our "database".
    var id = require('crypto').randomBytes(10).toString('hex');
    
    fakeDatabase[id] = input;
    return new Pt(id, input);
  },
}; 

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

const privateKey = fs.readFileSync('privkey.pem', 'utf8');
const certificate = fs.readFileSync('fullchain.pem', 'utf8');
const ca = fs.readFileSync('0000_csr-certbot.pem', 'utf8');

const credentials= {
  key: privateKey,
  cert: certificate
}

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(4000, () => {
    console.log('HTTP Server running on port 4000');
});

//app.listen(4000, () => {
  //console.log('Running a GraphQL API server at localhost:4000/graphql');
//});