import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputField,
  NumberInputGroup,
  NumberInputIncrement,
} from "@/components/ui/number-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { $api } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@phosphor-icons/react";
import { format, formatISO } from "date-fns";
import { fr } from "date-fns/locale";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  date: z.date(),
  temperatureC: z.number().int(),
  summary: z.string(),
});

export type UpdateForecastFormSchema = z.infer<typeof formSchema>;

interface UpdateForecastProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  forecast: components["schemas"]["WeatherForecastResponse"];
}

export function UpdateForecast(props: UpdateForecastProps) {
  const form = useForm<UpdateForecastFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(props.forecast.date),
      temperatureC: props.forecast.temperatureC as number,
      summary: props.forecast.summary ?? "",
    },
  });

  const updateForecast = $api.useMutation("put", "/api/weather-forecasts/{id}", {
    meta: {
      invalidatesQuery: $api.queryOptions("get", "/api/weather-forecasts").queryKey,
      errorMessage: "An error has occurred",
    },
    onError(error) {
      form.setError("root", { message: error.detail ?? "An error has occurred" });
    },
    onSuccess() {
      props.setOpen(false);
    },
  });

  function onSubmit(values: UpdateForecastFormSchema) {
    updateForecast.mutate({
      params: {
        path: {
          id: props.forecast.id,
        },
      },
      body: {
        temperatureC: values.temperatureC,
        date: formatISO(values.date, { representation: "date" }),
        summary: values.summary,
      },
    });
  }

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent render={<form onSubmit={form.handleSubmit(onSubmit)} />}>
        <DialogHeader>
          <DialogTitle>Edit forecast</DialogTitle>
          <DialogDescription>Make changes to this forecast.</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Controller
            control={form.control}
            name="date"
            render={({ field, fieldState }) => (
              <Field orientation="vertical">
                <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                <Popover>
                  <PopoverTrigger id={field.name} render={<Button variant="outline" />}>
                    {field.value ?
                      format(field.value, "P", { locale: fr })
                    : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto size-4 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
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
                <FieldLabel htmlFor={field.name}>Temperature</FieldLabel>
                <NumberInput
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <NumberInputGroup>
                    <NumberInputDecrement />
                    <NumberInputField placeholder="20" />
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
                <FieldLabel htmlFor={field.name}>Summary</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Cool..."
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {form.formState.errors?.root && <FieldError errors={[form.formState.errors.root]} />}
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button type="submit" disabled={updateForecast.isPending}>
            {updateForecast.isPending ? "Updating..." : "Update"}
            {updateForecast.isPending && <Spinner />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
