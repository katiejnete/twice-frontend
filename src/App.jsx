import React from "react";
import NavBar from "./components/NavBar";
import AppRoutes from "./AppRoutes";
import Providers from "./context/Providers";
import "./stylesheets/App.css"

const App = () => {
  return (
    <Providers>
      <NavBar />
      <main>
        <AppRoutes />
      </main>
    </Providers>
  );
};

export default App;
