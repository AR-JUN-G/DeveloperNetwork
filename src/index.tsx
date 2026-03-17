import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './App';
import { BrowserRouter } from "react-router";
import { store } from "./Store/store";
import { Provider } from 'react-redux';

let container = document.getElementById("app")!;
let root = createRoot(container)
root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
