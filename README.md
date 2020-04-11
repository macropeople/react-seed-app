# Overview

This seed app provides a wrapper for `sasjs`, a lightning fast adapter for talking to both SAS 9 and Viya.

## Backend Services
Creating services in Viya can be done entirely in SAS Studio in three easy steps:

### Step 1 - load macros and obtain app token. Admin Task.

NOTE - YOU WILL NEED TO BE AN ADMIN TO RUN THIS BIT! As you are creating a new app token.
If you don't have internet access, you'll need to go to that link and copy / paste / run the macros manually.

```
    filename mc url "https://raw.githubusercontent.com/macropeople/macrocore/master/mc_all.sas";
    %inc mc;
    %let client=new%sysfunc(ranuni(0),hex16.);
    %let secret=MySecret;
    %mv_getapptoken(client_id=&client,client_secret=&secret)
```

The log will contain a URL. Open this URL, click "open id" and paste the Authorization Code into the macro in step 2 below.

### Step 2 - obtain access token

The following code is used to obtain the access token:

```
    %mv_getrefreshtoken(client_id=&client,client_secret=&secret,code=wKDZYTEPK6)
    %mv_getaccesstoken(client_id=&client,client_secret=&secret)
```

### Step 3 - build some services!

Services can be created programmagically using the code below.

```
filename ft15f001 temp;
parmcards4;
    proc sql;
    create table areas as select distinct area from sashelp.springs;
    %webout(OPEN)
    %webout(OBJ,areas)
    %webout(CLOSE)
;;;;
%mv_createwebservice(path=/Public/myapp/common, name=appInit, code=ft15f001,replace=YES)
parmcards4;
    %webout(FETCH)
    proc sql;
    create table springs as select * from sashelp.springs
      where area in (select area from areas);
    %webout(OPEN)
    %webout(OBJ,springs)
    %webout(CLOSE)
;;;;
%mv_createwebservice(path=/Public/myapp/common, name=getData, code=ft15f001,replace=YES)
```

## Frontend Web

If you are running locally you will either need to whitelist `localhost` on the server, or enable CORS using one of the following commands:

| OS    | Browser | Launch Command|
|:---:|:---:|:--:|
| Mac   | Chrome  | `open -n -a Google\ Chrome --args --disable-web-security --user-data-dir=/tmp/chrome` |
| Linux | Chrome  | `google-chrome --disable-web-security --user-data-dir="/tmp/chrome"`|


## Seedapp info


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).



### Code Style

This project uses Prettier to format code.
Please install the 'Prettier - Code formatter' extension for VS Code.

Files you are editing will automatically be formatted on save.

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
