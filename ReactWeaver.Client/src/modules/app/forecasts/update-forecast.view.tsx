import { Button } from "#src/components/ui/button.tsx";
import { Calendar } from "#src/components/ui/calendar.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#src/components/ui/dialog.tsx";
import { Field, FieldError, FieldGroup, FieldLabel } from "#src/components/ui/field.tsx";
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputField,
  NumberInputGroup,
  NumberInputIncrement,
} from "#src/components/ui/number-input.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "#src/components/ui/popover.tsx";
import { Spinner } from "#src/components/ui/spinner.tsx";
import { Textarea } from "#src/components/ui/textarea.tsx";
import {
  getWeatherForecastsQueryKey,
  updateWeatherForecastMutation,
} from "#src/lib/api/@tanstack/react-query.gen.ts";
import type { UpdateWeatherForecastRequest, WeatherForecastResponse } from "#src/lib/api/index.ts";
import { zUpdateWeatherForecastRequest } from "#src/lib/api/zod.gen.ts";
import { getDateFnsLocale } from "#src/lib/i18n.ts";
import { m } from "#src/paraglide/messages.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { format, formatISO, parseISO } from "date-fns";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface UpdateForecastProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  forecast: WeatherForecastResponse;
}

export function UpdateForecast(props: UpdateForecastProps) {
  const form = useForm<UpdateWeatherForecastRequest>({
    resolver: zodResolver(zUpdateWeatherForecastRequest),
    defaultValues: {
      date: new Date(props.forecast.date).toISOString(),
      temperatureC: props.forecast.temperatureC as number,
      summary: props.forecast.summary ?? "",
    },
  });

  const updateForecast = useMutation({
    ...updateWeatherForecastMutation(),
    onError(error) {
      toast.error(m.common_error_occurred());
      form.setError("root", { message: error.detail ?? m.common_error_occurred() });
    },
    onSuccess() {
      props.setOpen(false);
    },
    meta: {
      invalidatesQuery: getWeatherForecastsQueryKey(),
    },
  });

  function onSubmit(values: UpdateWeatherForecastRequest) {
    updateForecast.mutate({
      path: {
        id: props.forecast.id,
      },
      body: {
        temperatureC: values.temperatureC,
        date: values.date,
        summary: values.summary,
      },
    });
  }

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent render={<form onSubmit={form.handleSubmit(onSubmit)} />}>
        <DialogHeader>
          <DialogTitle>{m.forecasts_edit()}</DialogTitle>
          <DialogDescription>{m.forecasts_edit_description()}</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Controller
            control={form.control}
            name="date"
            render={({ field, fieldState }) => (
              <Field orientation="vertical">
                <FieldLabel htmlFor={field.name}>{m.common_date()}</FieldLabel>
                <Popover>
                  <PopoverTrigger id={field.name} render={<Button variant="outline" />}>
                    {field.value ? (
                      format(field.value, "P", { locale: getDateFnsLocale() })
                    ) : (
                      <span>{m.placeholder_pick_date()}</span>
                    )}
                    <CalendarIcon className="ml-auto size-4 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <Calendar
                      mode="single"
                      selected={parseISO(field.value)}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(formatISO(date, { representation: "date" }));
                        }
                      }}
                      disabled={(date) =>
                        date > new globalThis.Date() || date < new globalThis.Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="temperatureC"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{m.common_temperature()}</FieldLabel>
                <NumberInput
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  value={Number(field.value)}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <NumberInputGroup>
                    <NumberInputDecrement />
                    <NumberInputField placeholder={m.placeholder_temperature()} />
                    <NumberInputIncrement />
                  </NumberInputGroup>
                </NumberInput>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="summary"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{m.common_summary()}</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder={m.placeholder_summary()}
                  value={String(field.value)}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {form.formState.errors?.root && <FieldError errors={[form.formState.errors.root]} />}
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>{m.common_cancel()}</DialogClose>
          <Button type="submit" disabled={updateForecast.isPending}>
            {updateForecast.isPending ? m.common_updating() : m.common_update()}
            {updateForecast.isPending && <Spinner />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
