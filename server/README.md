# Memegenerator Server

To run the server:

1. Install server from for example
   [mongoDB](https://www.mongodb.com/try/download/community)
2. Use `NET start` in the administrator shell
3. Use `mongod` in the administrator shell (the server is now running in the background)
4. Navigate from a console into the "OMM_Project"-folder
5. Use `cd server` to navigate into the server package
6. Use `npm install` to install all necessary dependencies to execute the server
7. Use `npm start` to start the server

The sites are accessible under `http://localhost:3000`.

For all necessary routes to the server there are templates for usage in the folder
`server\templates`. In this document we collect them in one documentation. The word in capital
letters before a URL is the type of request the server awaits for this form, e.g. "GET" for a get
request.

### API-creation

### API-retrieval

### Editor-create

### Editor-get

Under the route GET http://localhost:3000/editor?token=THE-TOKEN&memeId=someId&start=0&end=5 the 
clients gets back a class. In the class under `.wanted` there is one image which then can be 
edited and
under `.templates` all possible templates are given back. The parameter `memeId` in the query
specifies which template is wanted. The parameters `start` and `end`in the JSON-Query to 
determine which part of the possible templates he/she wants.

For this route the client has to be logged-in so he/she needs to pass an access token in the query,
which was given after the log-in page.

### Images-get

Under the route GET http://localhost:3000/images?token=THE-TOKEN&status=0&sortBy=up+asc&filterBy=Tester&start=0&end
=4 the client gets back a list of images which were found for the parameters given in the 
JSON-Query.


There are 4 possible parameters in the query:

1. `sortBy` (optional parameter): For sorting the images in an order

   (possibilities: "up asc", "up desc", "down asc" and "down desc")
2. `filterBy` (optional parameter): For usernames to filter after
3. `start` (essential parameter): An integer indexing the first image the clients wants to see
4. `end` (essential parameter): An integer indexing the last image the clients wants to see
5. `status` (essential parameter): The status of the memes which should be found

There is again a login required like under "Editor-get"

### Images-post

Under the route POST http://localhost:3000/images?token=THE-TOKEN the client can up- or down-vote a
meme or comment a meme. Therefore, he/she just needs to specify which images he wants to access by
giving the `memeId` in the JSON-Body and define `up` in the body to vote the meme up `down` to vote
the meme down or give as `comment` a String to comment that under the wanted meme. Only one of `up`
, `down`, `comment` should be defined in the body. An example JSON-body would look like this:

```
{
    "memeId": "someId",
    "comment":"this picture is great!"
}
```

Then the client has to be logged-in again.

### Login-get

Under the route GET http://localhost:3000/login the client can give his authorization information
and receive an access token for the session he is in.

The information is given in the header as a String with email and password separated by a
whitespace. For example:

```
nice.email@gmx.de 1328
```

No log-in or JSON-body is required previously.

### Profile-get

Under the route GET http://localhost:3000/profile?token=THE-TOKEN&start=0&end=10 a client gets his/her profile
page.

A log-in is again required with the access token. The JSON-Query needs to include a
`start`-number and an `end`-number to determine which memes of the profile history are displayed.

### Register-Post

Under the route POST http://localhost:3000/register clients can be registered. In the JSON-Body
there has to be a `username`, a `fullName`, a `password` and an `email`. For example:

```
{
    "username":"Tester",
    "fullName":"DerErste",
    "password":"insecure",
    "email":"mail@test.de"
}
```

There is no previous log-in required.

### Statistics-single

Under the route GET http://localhost:3000/single?token=THE-TOKEN a client gets a class back with
`.pictures` as an array of memeId for memes, `.up` as an array of numbers of up voters and
`.down` as an array of down voters. The data is mapped index-wise, so the image at position one in
the pictures has up the up voters of position one from up and down voters from position one of down.

There is no JSON-Body for this request needed, but it is only accessible for a logged-in client.

### SingleView-get

Under the route GET http://localhost:3000/single?token=THE-TOKEN&memeId=someId the clients gets a
single view of the picture identified in the query parameter `memeId`.

No JSON-Body needed but log-in.

### Statistics-template

Under the route GET http://localhost:3000/template?token=THE-TOKEN a client gets statistics for the
usage of every template. This is returned in a class with `.pictures` as a list of memeId of the
template memeId and with `.usages` as a list of usages for the templates. The data is again mapped
index-wise.

No JSON-Body needed but log-in.

### Verify-get

Under the route GET http://localhost:3000/verify?token=THE-TOKEN gives back if the given token can
be verified (true) or not (false). No log-in or JSON-Body needed.