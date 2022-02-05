import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Overview} from "./pages/overview";
import {MemeDetails} from "./pages/meme-details";
import {Login} from "./pages/login";
import {SignUp} from "./pages/sign-up";
import {Editor} from "./pages/editor";
import {APIDoc} from "./pages/api-doc";

ReactDOM.render(
    <BrowserRouter>
        <App>
            <Routes>
                <Route path="/" element={<Overview/>}/>
                <Route path="details" element={<MemeDetails/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="sign-up" element={<SignUp/>}/>
                <Route path="editor" element={<Editor/>}/>
                <Route path="api-doc" element={<APIDoc/>}/>
            </Routes>
        </App>
    </BrowserRouter>,
    document.getElementById('root')
);
