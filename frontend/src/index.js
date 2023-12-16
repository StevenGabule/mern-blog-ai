import React from "react";
import ReactDOM from "react-dom/client";
import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from './AuthContext/AuthContext';

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();
const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);
const options = {
  mode: 'payment',
  currency: 'usd',
  amount: 1099
}

root.render(
  <React.StrictMode>
    <QueryClientProvider queryClient={queryClient}>
      <AuthProvider>
        <Elements options={options} stripe={stripePromise}>
          <App />
        </Elements>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
