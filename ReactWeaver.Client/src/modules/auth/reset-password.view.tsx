import { Button } from "#src/components/ui/button.tsx";
import { Field, FieldError, FieldGroup, FieldLabel } from "#src/components/ui/field.tsx";
import { Input } from "#src/components/ui/input.tsx";
import { Spinner } from "#src/components/ui/spinner.tsx";
import { resetPasswordMutation } from "#src/lib/api/@tanstack/react-query.gen.ts";
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
    resetCode: z.string({
      error: () => m.validation_code_invalid(),
    }),
    newPassword: z
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
  .refine((values) => values.newPassword === values.confirmPassword, {
    error: () => m.validation_passwords_mismatch(),
    path: ["confirmPassword"],
  });

export type ResetPasswordFormSchema = z.infer<typeof formSchema>;

export function ResetPasswordView() {
  const form = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      resetCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetPassword = useMutation({
    ...resetPasswordMutation(),
    onError(error) {
      form.setError("root", { message: error.detail ?? m.common_error_occurred() });
      toast.error(m.common_error_occurred());
    },
  });

  function onSubmit(values: ResetPasswordFormSchema) {
    resetPassword.mutate({
      body: {
        email: values.email,
        newPassword: values.newPassword,
        resetCode: values.resetCode,
      },
    });
  }

  if (resetPassword.isSuccess) {
    return (
      <AuthCard.Root>
        <AuthCard.Content>
          <AuthCard.Header>
            <AuthCard.Title>{m.auth_reset_title()}</AuthCard.Title>
            <AuthCard.Description>{m.auth_reset_description()}</AuthCard.Description>
          </AuthCard.Header>
          <p>{m.auth_password_reset_success()}</p>
          <p>{m.auth_password_reset_login_hint()}</p>
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
          <AuthCard.Title>{m.auth_reset_title()}</AuthCard.Title>
          <AuthCard.Description>{m.auth_reset_description()}</AuthCard.Description>
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
              name="resetCode"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>{m.auth_reset_code()}</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder={m.placeholder_password()}
                    autoComplete="one-time-code"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>{m.auth_new_password()}</FieldLabel>
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
            <Button type="submit" disabled={resetPassword.isPending}>
              {resetPassword.isPending ? m.auth_resetting() : m.auth_reset_password_button()}
              {resetPassword.isPending && <Spinner />}
            </Button>
          </FieldGroup>
        </form>
      </AuthCard.Content>
      <AuthCard.Footer>
        <Link to="/login">Log in</Link>
      </AuthCard.Footer>
    </AuthCard.Root>
  );
}
