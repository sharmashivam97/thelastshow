import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import WriteBox from "./WriteBox";
import Empty from "./Empty";
import reportWebVitals from "./reportWebVitals";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <GoogleOAuthProvider clientId="41512924845-t14v5solro71mngkdej551hmvqmk00c9.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<Empty />} />
            <Route path="/notes" element={<Empty />} />
            <Route
              path="/notes/:noteId/edit"
              element={<WriteBox edit={true} />}
            />
            <Route path="/notes/:noteId" element={<WriteBox edit={false} />} />
            {/* any other path */}
            <Route path="*" element={<Empty />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </>
);


reportWebVitals();
