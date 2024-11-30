import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./pages/layout";


import Login from "./pages/Login";
import Register from "./pages/register";
import NoPage from "../src/pages/NoPage";
import Home from './pages/home';

function App() {


    return (

        <div>

            <BrowserRouter>
                <Routes>
                    <Route index element={<Layout />} />

                    <Route path='home' element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
            </BrowserRouter>
        </div>

    );
}
export default App;
