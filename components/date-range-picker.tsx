'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Patient, Report } from '@/constants/data';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

interface CalendarDateRangePickerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  patients?: Patient[];
  reports?: Report[];
}

export function CalendarDateRangePicker({
  className,
  patients,
  reports
}: CalendarDateRangePickerProps) {
  // to get today's date
  const today = startOfDay(new Date());

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: today,
    to: today
  });

  console.log('date', date);
  console.log('patients in date component', patients);

  React.useEffect(() => {
    if (patients && date?.from && date?.to) {
      const fromDate = startOfDay(new Date(date.from));
      const toDate = endOfDay(new Date(date.to));

      const filteredPatients = patients.filter((patient) => {
        // Remove timezone and convert to Date object
        const createdAtDate = new Date(patient.created_at.split('T')[0]);

        return isWithinInterval(createdAtDate, {
          start: fromDate,
          end: toDate
        });
      });

      console.log('filtered patients', filteredPatients);
    }
  }, [date, patients]);

  return (
    <>
      <div className={cn('grid gap-2', className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'w-[300px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} -{' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
