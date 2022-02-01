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
letters before a URL is the type of request the server awaits for this form, e.g. "GET" for a 
get request.

### API-creation

### API-retrieval


### Editor-create


### Editor-get
Under the route GET http://localhost:3000/editor?token=THE-TOKEN&metadata=somemeta the clients gets 
back a class.
In 
the class under `.wanted` there is one image which then can be edited and under `.templates` all 
possible templates are given back. The parameter `metadata` in the query specifies which 
template is wanted.

For this route the client has to be logged-in so he/she needs to pass an access token in the query, 
which was given after the log-in page.


### Images-get
Under the route GET http://localhost:3000/images?token=THE-TOKEN the client gets back a list of 
images which were found for the parameters given in the JSON-Body. The body has to look like this:
```
{
"sortBy":"up asc",
"filterBy":"Tester",
"start":0,
"end":4
}
```

There are 4 possible parameters in the body:
1. `sortBy` (optional parameter): For sorting the images in an order
   
   (possibilities: "up asc", "up desc", "down asc" and "down desc")
2. `filterBy` (optional parameter): For usernames to filter after
3. `start` (essential parameter): An integer indexing the first image the clients wants to see
4. `end` (essential parameter): An integer indexing the last image the clients wants to see

### Images-post