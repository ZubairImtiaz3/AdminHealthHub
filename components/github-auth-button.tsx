'use client';
import { Button } from './ui/button';
import { Icons } from './icons';

export default function GoogleSignInButton() {
  return (
    <Button className="w-full" variant="outline" type="button">
      <Icons.gitHub className="mr-2 h-4 w-4" />
      Continue with Github
    </Button>
  );
}
