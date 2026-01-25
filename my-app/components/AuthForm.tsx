"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z as Z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { auth } from "@/firebase/client"
import { signUp, signIn } from "@/lib/actions/auth.actions"

type FormType = "sign-in" | "sign-up"

const getAuthFormSchema = (type: FormType) =>
  Z.object({
    name:
      type === "sign-up"
        ? Z.string().min(3, "Name must be at least 3 characters")
        : Z.string().optional(),
    email: Z.string().email("Invalid email"),
    password: Z.string().min(6, "Password must be at least 6 characters"),
  })

interface FormValues {
  name?: string
  email: string
  password: string
}

const AuthForm = ({ type }: { type: FormType }) => {
  const isSignIn = type === "sign-in"
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(getAuthFormSchema(type)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      if (!isSignIn) {
        // 🔹 SIGN UP
        const { name, email, password } = values

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
        })

        if (!result?.success) {
          toast.error(result?.message || "Signup failed")
          return
        }

        toast.success("Account created successfully! Please sign in.")
        router.push("/sign-in")
      } else {
        // 🔹 SIGN IN
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        )

        const idToken = await userCredential.user.getIdToken()

        const result = await signIn({
          email: values.email,
          idToken,
        })

        if (!result?.success) {
          toast.error(result?.message || "Sign in failed")
          return
        }

        toast.success("Signed in successfully!")
        router.push("/")
      }
    } catch (error: any) {
      console.error(error)

      // ✅ Firebase-friendly errors
      switch (error.code) {
        case "auth/email-already-in-use":
          toast.error("Email already registered. Please sign in.")
          router.push("/sign-in")
          break

        case "auth/invalid-email":
          toast.error("Invalid email address.")
          break

        case "auth/weak-password":
          toast.error("Password must be at least 6 characters.")
          break

        case "auth/wrong-password":
          toast.error("Incorrect password.")
          break

        case "auth/user-not-found":
          toast.error("No account found. Please sign up.")
          break

        default:
          toast.error("Authentication failed. Please try again.")
      }
    }
  }

  return (
    <div className="card-boder lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>

        <h3>Practice job Interview with AI</h3>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6 mt-4"
        >
          {!isSignIn && (
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Name</FieldLabel>
                    <Input {...field} placeholder="Enter your name" />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          )}

          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input {...field} type="email" placeholder="Enter your email" />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter password"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button type="submit" className="w-full rounded-full font-bold">
            {isSignIn ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <p className="text-center">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold ml-1"
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm
