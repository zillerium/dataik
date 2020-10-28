mutation {
  createPt(input: {
    ownerId:2,
    latitude: -40, 
    longitude: 50, 
    createdAt: "2020-09-12T20:12:40.385Z"
  }) {
    id
    latitude
longitude
createdAt
  }
}

{
 
  getPt (id: "3d55775c82d0ba57a03d") {
    ownerId
    longitude
    latitude
    createdAt
  }
 
}

http://[ip]:4000/graphql
