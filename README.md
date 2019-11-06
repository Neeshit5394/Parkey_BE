
## Execution

### `mongod`
Starts the mongo server.

### `npm start`

Runs the app .<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Collections

### users:
Field: Data Type
{
  name: String,
  email: String,
  phnumber: Integer,
  password: String
}

### listings:
Field: Data Type
{
  location: String,
  details: String,
  availability: String,
  price: Integer,
  image: tbd,
  owner: userid
}

### rentings:
Field: Data Type
{
  location: String,
  details: String,
  duration: Integer,
  owner: userid
}

## Routes

### Users:

1. "users/", GET => Get all the users in the users collection.
2. "users/", POST => Add a new user to the users collection.
3. "users/:id", GET => Get user with a particular id.
4. "users/:id", PUT => Update the user with a particular id.
5. "users/:id", PATCH => Update only specific fields of the user with a particular id.
6. "users/:id", DELETE => Delete the user with a particular id.

### Listings:

1. "listings/", GET => Get all the listings in the listings collection.
2. "listings/:id", GET => Get listing with a particular id.
3. "listings/:id", POST => Add a new listing to the listings collection for a user with userID as :id.
4. "listings/:id/:listingId", PATCH => Update only specific fields of the listing associated with a user with id as :id and listing id as :listingId.
5. "listings/:listingId", DELETE => Delete listing with a particular id.

### Rentings:

1. "rentings/", GET => Get all the rentings in the rentings collection.
2. "rentings/:id", GET => Get renting with a particular id.
3. "rentings/:id", POST => Add a new rernting to the rentings collection for a user with userID as :id.
4. "rentings/:rentingId", DELETE => Delete renting with a particular id.
