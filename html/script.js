function graphqlbtn() {
  let ownerId = document.getElementById("ownerId").value;
  let latitude = document.getElementById("latitude").value;
  let longitude = document.getElementById("longitude").value;
  let createdAt = "2020-09-12T20:12:40.385Z";

  var inputparams = {
    ownerId: ownerId,
    latitude: latitude,
    longitude: longitude,
    createdAt: createdAt,
  };

  const query = JSON.stringify({
    query: ` 
      mutation { 
        createPt(input: {
            ownerId: ownerId,
            latitude: latitude,
            longitude: longitude,
            createdAt: createdAt,
          }) {
          id
          ownerId
          latitude
          longitude
          createdAt
        }
      }
    `,
  });

  fetch("https://iosetpro.com:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: query,
  })
  .then((r) => r.json())
  .then((data) => console.log("data returned:", data));
}
