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
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { $api } from "@/lib/api/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendar, IconPlus } from "@tabler/icons-react";
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

export type CreateForecastFormSchema = z.infer<typeof formSchema>;

export function CreateForecast() {
  const [open, setOpen] = React.useState(false);

  const form = useForm<CreateForecastFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      temperatureC: "",
      summary: "",
    },
  });

  const createForecast = $api.useMutation("post", "/api/weather-forecasts", {
    meta: {
      invalidatesQuery: $api.queryOptions("get", "/api/weather-forecasts").queryKey,
    },
    onSuccess() {
      setOpen(!open);
      form.reset();
    },
  });

  function onSubmit(values: CreateForecastFormSchema) {
    createForecast.mutate({
      body: {
        temperatureC: parseInt(values.temperatureC),
        date: formatISO(values.date, { representation: "date" }),
        summary: values.summary,
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <IconPlus /> Add forecast
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add forecast</DialogTitle>
          <DialogDescription>Add a new weather forecast to your list.</DialogDescription>
        </DialogHeader>
        <form id="create-forecast" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="date"
              render={({ field, fieldState }) => (
                <Field className="flex flex-col">
                  <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger id={field.name} render={<Button variant="outline" />}>
                      {field.value ?
                        format(field.value, "P", { locale: fr })
                      : <span>Pick a date</span>}
                      <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
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
        </form>
        <DialogFooter>
          <DialogClose>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="create-forecast" disabled={createForecast.isPending}>
            {createForecast.isPending ? "Submitting..." : "Submit"}
            {createForecast.isPending && <Spinner />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
