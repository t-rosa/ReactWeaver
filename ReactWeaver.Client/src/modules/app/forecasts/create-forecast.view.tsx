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
  DialogTrigger,
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
import type { CreateWeatherForecastRequest } from "@/lib/api";
import {
  createWeatherForecastMutation,
  getWeatherForecastsQueryKey,
} from "@/lib/api/@tanstack/react-query.gen";
import { zCreateWeatherForecastRequest } from "@/lib/api/zod.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, PlusIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { format, formatISO, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateForecast() {
  const [open, setOpen] = React.useState(false);
  const maxDate = React.useMemo(() => new Date(), []);
  const minDate = React.useMemo(() => new Date("1900-01-01"), []);

  const form = useForm<CreateWeatherForecastRequest>({
    resolver: zodResolver(zCreateWeatherForecastRequest),
    defaultValues: {
      date: maxDate.toISOString(),
      temperatureC: 0,
      summary: "",
    },
  });

  const createForecast = useMutation({
    ...createWeatherForecastMutation(),
    onError(error) {
      toast.error("An error has occurred");
      form.setError("root", { message: error.detail ?? "An error has occurred" });
    },
    onSuccess() {
      setOpen(!open);
      form.reset();
    },
    meta: {
      invalidatesQuery: getWeatherForecastsQueryKey(),
    },
  });

  function onSubmit(values: CreateWeatherForecastRequest) {
    createForecast.mutate({
      body: {
        temperatureC: values.temperatureC,
        date: values.date,
        summary: values.summary,
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusIcon /> Add forecast
      </DialogTrigger>
      <DialogContent render={<form onSubmit={form.handleSubmit(onSubmit)} />}>
        <DialogHeader>
          <DialogTitle>Add forecast</DialogTitle>
          <DialogDescription>Add a new weather forecast to your list.</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Controller
            control={form.control}
            name="date"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                <Popover>
                  <PopoverTrigger id={field.name} render={<Button variant="outline" />}>
                    {field.value ? (
                      format(field.value, "P", { locale: fr })
                    ) : (
                      <span>Pick a date</span>
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
                      disabled={(date) => date > maxDate || date < minDate}
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
                  value={Number(field.value)}
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
                  value={String(field.value)}
                  placeholder="Cool..."
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {form.formState.errors?.root && <FieldError errors={[form.formState.errors.root]} />}
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
          <Button type="submit" disabled={createForecast.isPending}>
            {createForecast.isPending ? "Submitting..." : "Submit"}
            {createForecast.isPending && <Spinner />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
