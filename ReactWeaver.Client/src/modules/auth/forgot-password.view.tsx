import { Button } from "#src/components/ui/button.tsx";
import { Field, FieldError, FieldGroup, FieldLabel } from "#src/components/ui/field.tsx";
import { Input } from "#src/components/ui/input.tsx";
import { Spinner } from "#src/components/ui/spinner.tsx";
import { forgotPasswordMutation } from "#src/lib/api/@tanstack/react-query.gen.ts";
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
});

export type ForgotPasswordFormSchema = z.infer<typeof formSchema>;

export function ForgotPasswordView() {
  const navigate = useNavigate();

  const form = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPassword = useMutation({
    ...forgotPasswordMutation(),

    onError(error) {
      toast.error(m.common_error_occurred());
      form.setError("root", { message: error.detail ?? m.common_error_occurred() });
    },
    async onSuccess() {
      await navigate({ to: "/reset-password" });
    },
  });

  function onSubmit(values: ForgotPasswordFormSchema) {
    forgotPassword.mutate({
      body: values,
    });
  }

  return (
    <AuthCard.Root>
      <AuthCard.Content>
        <AuthCard.Header>
          <AuthCard.Title>{m.auth_forgot_title()}</AuthCard.Title>
          <AuthCard.Description>{m.auth_forgot_description()}</AuthCard.Description>
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
            {form.formState.errors?.root && <FieldError errors={[form.formState.errors.root]} />}
            <Button type="submit" disabled={forgotPassword.isPending}>
              {forgotPassword.isPending ? m.auth_sending() : m.auth_submit()}
              {forgotPassword.isPending && <Spinner />}
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
