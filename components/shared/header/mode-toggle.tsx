'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuLabel, 
  DropdownMenuSeparator,
  DropdownMenuItem, 
  DropdownMenuContent 
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Sun, Moon, SunMoon } from 'lucide-react';

const ModeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return ( 
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='focus-visible:ring-0 focus-visible:ring-offset-0'>
          { theme === 'system' ? (<SunMoon/>) : theme === 'dark' ? (<Moon/>) : (<Sun/>) }
        </Button>
      </DropdownMenuTrigger>  
      <DropdownMenuContent>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator/>

        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu> 
  );
}

export default ModeToggle;
