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
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { $api } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendar } from "@tabler/icons-react";
import { format, formatISO } from "date-fns";
import { fr } from "date-fns/locale";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  date: z.date(),
  temperatureC: z.string(),
  summary: z.string(),
});

export type UpdateForecastFormSchema = z.infer<typeof formSchema>;

interface UpdateForecastProps {
  forecast: components["schemas"]["WeatherForecastResponse"];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UpdateForecast(props: UpdateForecastProps) {
  const form = useForm<UpdateForecastFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(props.forecast.date),
      temperatureC: props.forecast.temperatureC.toString(),
      summary: props.forecast.summary ?? "",
    },
  });

  const updateForecast = $api.useMutation("put", "/api/weather-forecasts/{id}", {
    meta: {
      invalidatesQuery: $api.queryOptions("get", "/api/weather-forecasts").queryKey,
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
        temperatureC: parseInt(values.temperatureC.toString()),
        date: formatISO(values.date, { representation: "date" }),
        summary: values.summary,
      },
    });
  }

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <form id="update-forecast" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit forecast</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
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
                      <IconCalendar className="ml-auto size-4 opacity-50" />
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
                <Field>
                  <FieldLabel htmlFor={field.name}>Temperature</FieldLabel>
                  <Input {...field} id={field.name} type="number" placeholder="20" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="summary"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>More about you</FieldLabel>
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
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button type="submit" form="update-forecast">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
