import { Button } from "#src/components/ui/button.tsx";
import { Field, FieldError, FieldGroup, FieldLabel } from "#src/components/ui/field.tsx";
import { Input } from "#src/components/ui/input.tsx";
import { Spinner } from "#src/components/ui/spinner.tsx";
import { loginMutation } from "#src/lib/api/@tanstack/react-query.gen.ts";
import * as AuthCard from "#src/modules/auth/components/auth-card.tsx";
import { m } from "#src/paraglide/messages.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
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
});

export type LoginFormSchema = z.infer<typeof formSchema>;

export function LoginView() {
  const navigate = useNavigate();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = useMutation({
    ...loginMutation(),
    onError(error) {
      toast.error(m.common_error_occurred());
      form.setError("root", { message: error.detail ?? m.common_error_occurred() });
    },
    async onSuccess() {
      toast.success(m.auth_connected());
      await navigate({ to: "/app/dashboard" });
    },
  });

  function onSubmit(values: LoginFormSchema) {
    login.mutate({
      body: values,
      query: {
        useCookies: true,
      },
    });
  }

  return (
    <AuthCard.Root>
      <AuthCard.Content>
        <AuthCard.Header>
          <AuthCard.Title>{m.auth_welcome()}</AuthCard.Title>
          <AuthCard.Description>{m.auth_login_to_continue()}</AuthCard.Description>
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
                    autoComplete="current-password"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {form.formState.errors?.root && <FieldError errors={[form.formState.errors.root]} />}
            <Button type="submit" disabled={login.isPending}>
              {login.isPending ? m.auth_logging_in() : m.auth_login()}
              {login.isPending && <Spinner />}
            </Button>
            <Button variant="link" nativeButton={false} render={<Link to="/forgot-password" />}>
              {m.auth_forgot_password_link()}
            </Button>
          </FieldGroup>
        </form>
      </AuthCard.Content>
      <AuthCard.Footer>
        <Link to="/register">{m.auth_create_account()}</Link>
      </AuthCard.Footer>
    </AuthCard.Root>
  );
}
