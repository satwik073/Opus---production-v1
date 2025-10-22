import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prisma from "./database-setup";
import {checkout, polar, portal } from "@polar-sh/better-auth";
import { polarClient } from "./polar"
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword:{
        enabled: true,
        autoSignIn: true,
    },
    plugins:[
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "16962a44-3ec0-4a66-93c2-8804001a4869",
                            slug: "opus-development-v1" // Custom slug for easy reference in Checkout URL, e.g. /checkout/opus-development-v1
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true
                }),
                portal()
            ],
        })
    ],
    secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-key-change-in-production",
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});