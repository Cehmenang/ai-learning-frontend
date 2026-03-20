"use client"

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <GoogleOAuthProvider clientId="990323916939-b6do8sragr59ki2kqf1vomb4sfi1nvad.apps.googleusercontent.com">
            {children}
        </GoogleOAuthProvider>
    )
}