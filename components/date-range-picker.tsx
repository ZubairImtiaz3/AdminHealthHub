'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format, startOfDay, endOfDay } from 'date-fns';
import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function CalendarDateRangePicker({
  className
}: React.HTMLAttributes<HTMLDivElement>) {
  // to get today's date
  const today = startOfDay(new Date());

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: today,
    to: today
  });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (date?.from && date?.to) {
      const fromDate = format(startOfDay(date.from), 'yyyy-MM-dd');
      const toDate = format(endOfDay(date.to), 'yyyy-MM-dd');

      const updatedSearchParams = new URLSearchParams(searchParams.toString());
      updatedSearchParams.set('from', fromDate);
      updatedSearchParams.set('to', toDate);

      router.replace(`${pathname}?${updatedSearchParams.toString()}`);
    }
  }, [date, router, pathname, searchParams]);

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
