import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

dayjs.extend(utc);
dayjs.extend(localizedFormat);

export const formatReleaseDate = (dateString: string, format = 'LL') => {
  const formattedDate = dateString
    ? dayjs.utc(dateString).local().format(format)
    : '';
  return formattedDate;
};
