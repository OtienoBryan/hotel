// src/@types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    tableNo?: number; // Add the tableNo property as optional
  }
}