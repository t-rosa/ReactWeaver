import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { $api } from "@/lib/api/client";
import { AuthCard } from "@/modules/auth/components/auth-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
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
});

export type LoginFormSchema = z.infer<typeof formSchema>;

export function LoginView() {
  const navigate = useNavigate();

  const login = $api.useMutation("post", "/api/auth/login", {
    meta: {
      successMessage: "Connected",
      errorMessage: "An error has occurred",
      invalidatesQuery: ["get", "manage/info"],
    },
    async onSuccess() {
      await navigate({ to: "/forecasts" });
    },
  });

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormSchema) {
    login.mutate({
      body: values,
      params: {
        query: {
          useCookies: true,
        },
      },
    });
  }

  return (
    <AuthCard>
      <AuthCard.Content>
        <AuthCard.Header>
          <AuthCard.Title>Welcome!</AuthCard.Title>
          <AuthCard.Description>Log in to continue.</AuthCard.Description>
        </AuthCard.Header>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field>
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
                <Field>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...field}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <Button type="submit" disabled={login.isPending}>
                {login.isPending ? "Logging in..." : "Log in"}
                {login.isPending && <Spinner />}
              </Button>
              <Button
                variant="link"
                nativeButton={false}
                render={<Link to="/forgot-password">Forgot your password?</Link>}
              />
            </Field>
          </FieldGroup>
        </form>
      </AuthCard.Content>
      <AuthCard.Footer>
        <Link to="/register">Create account</Link>
      </AuthCard.Footer>
    </AuthCard>
  );
}
