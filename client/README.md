# Memegenerator Client

To run the client:

1. Run the server
2. Navigate from a console into the "OMM_Project"-folder
3. Use `cd client` to navigate into the client package
4. Use `npm install` to install all necessary dependencies to execute the client
5. Use `npm start` to start the client

The sites are accessible under `http://localhost:8888`. Usually the console opens this page
automatically.

In the following you will find out what the pages of the client are all about.

### Login

On this page you usually start. There you give your credentials (email and password) and login to
your account. If you don't have one yet there is a button to sign up at the top right corner of the
page. If you click on submit and your credentials are valid you get to the overview page.

### Overview

On this page you can see all the created and posted memes. You can also up- and down-vote memes if
you like or dislike them. Therefore, click on the buttons in the left and right bottom corner of a
meme. If you click on the on a meme you get onto the single view page of a meme. There are also
buttons to log out, there you get back to the login page. If you click on the account button you get
to your profile page. Then there is a button to go to the API documentation page, two buttons to go
to some statistics, once for template usages and once for up and down votes. Also, there is a button
to get to the editor to create your own memes.

### Single

On this page you see a single meme in full size. There you can comment on the texts.

//TODO: erweitern, wenn fertig

### Editor

In this editor you can create your memes. You can place text boxes anywhere, set the font sizes and
colors. If you are finished click either on "save draft" or on "upload". Save draft lets you edit
the meme later, but it is not seen at the overview page. If you click on "upload" the meme can be
seen on the overview page, but you can not edit it anymore. Here you can also upload templates 
via an url or from your file system. If you are a good painter that is also possible.

//TODO: erweitern, wenn fertig und getestet

### Profile Page

On this page you see your username, full name and email. Below you can see in two columns your
history. On the left are your created drafts, which you can click on and edit further (everybody can
have 20 drafts in storage to edit later) and on the right you see your last comments. When you click
on the boxes you get to the single view of this meme. Then you can get back by the button at the
other horizontal side of your username.

### Template Graph

Here you can see statistics for the usage of templates. Every meme has its own memeId, which
identifies it. This goes for templates as well. For each id of a template, there is one graph in the
statistic. You can get back by the button at the other horizontal side of your username.

### Single Graph

Here you can see statistics for the up and down votes of memes. Each meme is again specified by 
its memeId and has a bar for the down votes in light purple. The bar for the up votes is in 
light green over the bar for the down votes. This gives an impression for how favored a meme is 
or how bad one is. As in the template graph you can get back to the overview page.

### API Documentation

On this page there is just documented, which calls for the API are possible. Just read a bit and 
make yourself familiar with it. The back to overview button is at the usual position.

//TODO: Alles vergessene hinzufügen

#

#

#

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section
about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.

### `npm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.

### `npm eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time.
This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel,
ESLint, etc) right into your project so you have full control over them. All of the commands
except `eject` will still work, but they will point to the copied scripts so you can tweak them. At
this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle
deployments, and you shouldn’t feel obligated to use this feature. However we understand that this
tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in
the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
.

To learn React, check out the [React documentation](https://reactjs.org/).
