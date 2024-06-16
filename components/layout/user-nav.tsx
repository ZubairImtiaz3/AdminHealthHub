'use client';
import signOut from '@/actions/signOut';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

export function UserNav({ userProfile }: any) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await signOut();
      if (response?.error === null) {
        toast({
          variant: 'default',
          title: 'Successfully logged out.',
          description: 'Feel free to come back later.'
        });
        router.push('/');
      } else {
        toast({
          variant: 'default',
          title: response?.error,
          description: 'An unexpected error occurred during sign-out.'
        });
      }
    } catch (error) {
      console.error('An unexpected error occurred during sign-out:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={userProfile.user?.image ?? ''}
              alt={userProfile.user?.name ?? ''}
            />
            <AvatarFallback>
              {userProfile.first_name?.[0]}
              {userProfile.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userProfile.first_name} {userProfile.last_name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userProfile.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard/profile">
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/patients">
            <DropdownMenuItem>
              Patients
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/reports">
            <DropdownMenuItem>
              Reports
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
