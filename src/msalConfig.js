"use client";
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID,
    authority: process.env.REACT_APP_AUTHORITY,
    redirectUri:process.env.REACT_APP_REDIRECT_URL,
    scopes: ["openid", "profile", "user.read"], // Add the required scopes here
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};
export const msalInstance = new PublicClientApplication(msalConfig);

async function initializeMsal() {
  await msalInstance.initialize();
}

initializeMsal();
