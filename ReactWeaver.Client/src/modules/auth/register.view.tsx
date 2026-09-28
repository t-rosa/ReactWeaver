import { Button } from "#src/components/ui/button.tsx";
import { Field, FieldError, FieldGroup, FieldLabel } from "#src/components/ui/field.tsx";
import { Input } from "#src/components/ui/input.tsx";
import { Spinner } from "#src/components/ui/spinner.tsx";
import { registerMutation } from "#src/lib/api/@tanstack/react-query.gen.ts";
import * as AuthCard from "#src/modules/auth/components/auth-card.tsx";
import { m } from "#src/paraglide/messages.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z
  .object({
    email: z.email({
      error: () => m.validation_email_invalid(),
    }),
    password: z
      .string({
        error: () => m.validation_password_invalid(),
      })
      .min(6, { error: () => m.validation_password_min() })
      .regex(/[A-Z]/, { error: () => m.validation_password_uppercase() })
      .regex(/[a-z]/, { error: () => m.validation_password_lowercase() })
      .regex(/[0-9]/, { error: () => m.validation_password_digit() })
      .regex(/[^a-zA-Z0-9]/, { error: () => m.validation_password_special() }),
    confirmPassword: z
      .string({
        error: () => m.validation_password_invalid(),
      })
      .min(6, { error: () => m.validation_password_min() })
      .regex(/[A-Z]/, { error: () => m.validation_password_uppercase() })
      .regex(/[a-z]/, { error: () => m.validation_password_lowercase() })
      .regex(/[0-9]/, { error: () => m.validation_password_digit() })
      .regex(/[^a-zA-Z0-9]/, { error: () => m.validation_password_special() }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    error: () => m.validation_passwords_mismatch(),
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

  const register = useMutation({
    ...registerMutation(),
    onError(error) {
      form.setError("root", { message: error.detail ?? m.common_error_occurred() });
      toast.error(m.common_error_occurred());
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
      <AuthCard.Root>
        <AuthCard.Content>
          <AuthCard.Header>
            <AuthCard.Title>{m.auth_create_account_title()}</AuthCard.Title>
            <AuthCard.Description>{m.auth_signup_description()}</AuthCard.Description>
          </AuthCard.Header>
          <p>{m.auth_account_created()}</p>
          <p>{m.auth_confirmation_sent()}</p>
        </AuthCard.Content>
        <AuthCard.Footer>
          <Link to="/login">{m.auth_login()}</Link>
        </AuthCard.Footer>
      </AuthCard.Root>
    );
  }

  return (
    <AuthCard.Root>
      <AuthCard.Content>
        <AuthCard.Header>
          <AuthCard.Title>{m.auth_create_account_title()}</AuthCard.Title>
          <AuthCard.Description>{m.auth_signup_description()}</AuthCard.Description>
        </AuthCard.Header>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>{m.common_email()}</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    placeholder={m.placeholder_email()}
                    autoComplete="username"
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
                  <FieldLabel htmlFor={field.name}>{m.common_password()}</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder={m.placeholder_password()}
                    autoComplete="new-password"
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
                  <FieldLabel htmlFor={field.name}>{m.auth_confirm_password()}</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder={m.placeholder_password()}
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {form.formState.errors?.root && <FieldError errors={[form.formState.errors.root]} />}
            <Button type="submit" disabled={register.isPending}>
              {register.isPending ? m.auth_creating() : m.auth_create_account()}
              {register.isPending && <Spinner />}
            </Button>
          </FieldGroup>
        </form>
      </AuthCard.Content>
      <AuthCard.Footer>
        <Link to="/login">{m.auth_login()}</Link>
      </AuthCard.Footer>
    </AuthCard.Root>
  );
}
