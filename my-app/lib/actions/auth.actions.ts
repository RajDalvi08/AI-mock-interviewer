"use server"

import { db, auth } from "@/firebase/admin"
import { cookies } from "next/headers"

const ONE_WEEK = 60 * 60 * 24 * 7

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
    const userRecord = await db.collection("users").doc(uid).get()

    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in instead",
      }
    }

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
      message: "Failed to create an account",
    }
  }
}

// ================= SIGN IN =================
export async function signIn(params: SignInParams) {
  const { email, idToken } = params

  try {
    const userRecord = await auth.getUserByEmail(email)

    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account instead.",
      }
    }

    await setSessionCookie(idToken)
    return { success: true }
  } catch (e) {
    console.error(e)
    return {
      success: false,
      message: "Failed to log into account",
    }
  }
}

// ================= SESSION COOKIE =================
async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies()

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  })

  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
}

// ================= CURRENT USER =================
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")?.value

  if (!sessionCookie) return null

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)

    const userDoc = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get()

    if (!userDoc.exists) return null

    return {
      id: userDoc.id,
      ...(userDoc.data() as Omit<User, "id">),
    }
  } catch (e) {
    console.error("getCurrentUser error:", e)
    return null
  }
}

// ================= AUTH CHECK =================
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return Boolean(user)
}
