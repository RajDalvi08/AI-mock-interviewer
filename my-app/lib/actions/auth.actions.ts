"use server"

import { db, auth } from "@/firebase/admin"
import { cookies } from "next/headers"

const ONE_WEEK = 60 * 60 * 24 * 7 // 7 days in seconds

// ================= TYPES =================
interface SignUpParams {
  uid: string
  name: string
  email: string
}

interface SignInParams {
  email: string
  idToken: string
}

export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

// ================= SIGN UP =================
export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params

  try {
    // Check if user exists
    const userRecord = await db.collection("users").doc(uid).get()

    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in instead",
      }
    }

    // Create new user
    await db.collection("users").doc(uid).set({
      name,
      email,
      createdAt: new Date(),
    })

    return {
      success: true,
      message: "Account created successfully. Please sign in",
    }
  } catch (e) {
    console.error("Error creating user", e)
    return {
      success: false,
      message: "Failed to create an account. Please try again.",
    }
  }
}

// ================= SIGN IN =================
export async function signIn(params: SignInParams) {
  const { email, idToken } = params

  try {
    // Verify if the user exists by email
    const userRecord = await auth.getUserByEmail(email)

    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account instead.",
      }
    }

    // Set session cookie
    await setSessionCookie(idToken)
    return { success: true }
  } catch (e) {
    console.error("Sign-in error:", e)
    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    }
  }
}

// ================= SESSION COOKIE =================
async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies()

  try {
    // Create session cookie with 1-week expiration
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: ONE_WEEK * 1000, // milliseconds
    })

    // Set session cookie in browser
    cookieStore.set("session", sessionCookie, {
      maxAge: ONE_WEEK,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set secure flag in production
      sameSite: "lax",
      path: "/",
    })
  } catch (e) {
    console.error("Error setting session cookie:", e)
    throw new Error("Failed to create session cookie.")
  }
}

// ================= CURRENT USER =================
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")?.value

  if (!sessionCookie) return null // No session cookie means no user is logged in

  try {
    // Verify session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)

    // Retrieve user data from Firestore
    const userDoc = await db.collection("users").doc(decodedClaims.uid).get()

    if (!userDoc.exists) return null

    return {
      id: userDoc.id,
      ...(userDoc.data() as Omit<User, "id">), // Mapping data to User interface
    }
  } catch (e) {
    console.error("getCurrentUser error:", e)
    return null // Invalid or expired session
  }
}

// ================= AUTH CHECK =================
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return Boolean(user) // Returns true if user is logged in, false if not
}
