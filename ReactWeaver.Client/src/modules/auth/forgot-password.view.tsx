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
});

export type ForgotPasswordFormSchema = z.infer<typeof formSchema>;

export function ForgotPasswordView() {
  const navigate = useNavigate();

  const forgotPassword = $api.useMutation("post", "/api/auth/forgotPassword", {
    async onSuccess() {
      await navigate({ to: "/reset-password" });
    },
  });

  const form = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: ForgotPasswordFormSchema) {
    forgotPassword.mutate({
      body: values,
    });
  }

  return (
    <AuthCard>
      <AuthCard.Content>
        <AuthCard.Header>
          <AuthCard.Title>Forgot password.</AuthCard.Title>
          <AuthCard.Description>Enter your email address.</AuthCard.Description>
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
            <Button type="submit" disabled={forgotPassword.isPending}>
              {forgotPassword.isPending ? "Sending..." : "Forgot password"}
              {forgotPassword.isPending && <Spinner />}
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
