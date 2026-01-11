import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { $api } from "@/lib/api/client";
import { AuthCard } from "@/modules/auth/components/auth-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z
  .object({
    email: z.email({
      error: "Invalid email address",
    }),
    password: z
      .string({
        error: "Invalid password",
      })
      .min(6, "Password must be at least 6 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one digit.")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character."),
    confirmPassword: z
      .string({
        error: "Invalid password",
      })
      .min(6, "Password must be at least 6 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one digit.")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterFormSchema = z.infer<typeof formSchema>;

export function RegisterView() {
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const register = $api.useMutation("post", "/api/auth/register", {
    meta: {
      errorMessage: "An error has occurred",
    },
    onError(error) {
      form.setError("root", { message: error.detail ?? "An error has occurred" });
    },
  });

  function onSubmit(values: RegisterFormSchema) {
    register.mutate({
      body: {
        email: values.email,
        password: values.password,
      },
    });
  }

  if (register.isSuccess) {
    return (
      <AuthCard>
        <AuthCard.Content>
          <AuthCard.Header>
            <AuthCard.Title>Create an account.</AuthCard.Title>
            <AuthCard.Description>Sign up to access the application.</AuthCard.Description>
          </AuthCard.Header>
          <p>Your account has been created successfully!</p>
          <p>A confirmation email has been sent. Please validate it before logging in.</p>
        </AuthCard.Content>
        <AuthCard.Footer>
          <Link to="/login">Log in</Link>
        </AuthCard.Footer>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthCard.Content>
        <AuthCard.Header>
          <AuthCard.Title>Create an account.</AuthCard.Title>
          <AuthCard.Description>Sign up to access the application.</AuthCard.Description>
        </AuthCard.Header>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="username"
                    {...field}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...field}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
                  <Input
                    id={field.name}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...field}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {form.formState.errors?.root && <FieldError errors={[form.formState.errors.root]} />}
            <Button type="submit" disabled={register.isPending}>
              {register.isPending ? "Creating..." : "Create account"}
              {register.isPending && <Spinner />}
            </Button>
          </FieldGroup>
        </form>
      </AuthCard.Content>
      <AuthCard.Footer>
        <Link to="/login">Log in</Link>
      </AuthCard.Footer>
    </AuthCard>
  );
}
