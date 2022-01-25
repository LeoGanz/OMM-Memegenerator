import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Overview} from "./pages/overview";
import {MemeDetails} from "./pages/meme-details";
import {Login} from "./pages/login";

ReactDOM.render(
    <BrowserRouter>
        <App>
        <Routes>
            <Route path="/" element={<Overview clickPicture={() => {
                console.log("Hallo")
            }}/>}/>
            <Route path="details" element={<MemeDetails/> }/>
            <Route path="login" element={<Login/> }/>
        </Routes>
        </App>
    </BrowserRouter>,
    document.getElementById('root')
);
