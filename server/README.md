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


###API-creation

###API-retrieval

###Editor-create

###Editor-get
Under the route http://localhost:3000/editor?token=THE-TOKEN&metadata=somemeta the clients gets 
back a class.
In 
the class under `.wanted` there is one image which then can be edited and under `.templates` all 
possible templates are given back. The parameter `metadata` in the query specifies which 
template is wanted.

For this route the client has to be logged-in so he/she needs to pass an access token in the query, 
which was given after the log-in page. 