"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useUsersStore } from '@/store/useUsersStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageSearch } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);
  const { users } = useUsersStore();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      login(user.username, user.role, user.permissions);
      if (user.role === 'Cajero') {
        router.push('/pos');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError('INVALID CREDENTIALS');
    }
  };

  return (
    <div className="flex xl:h-screen min-h-[100dvh] w-full items-center justify-center bg-[#F8F9FA] text-[#141414] font-sans select-none">
      <Card className="w-full max-w-sm border border-[#141414] shadow-md mx-4 overflow-hidden rounded-md">
        <CardHeader className="space-y-1 text-center bg-[#141414] border-b-0">
          <div className="mx-auto flex items-center justify-center mb-2">
            <div className="font-bold text-lg tracking-tighter flex items-center gap-2 text-white">
              <div className="w-8 h-8 bg-white text-[#141414] flex items-center justify-center text-xs">BWP</div>
              RETAIL POS <span className="text-[10px] font-mono opacity-50 px-2 border border-white rounded-sm">ENT</span>
            </div>
          </div>
          <CardDescription className="text-white/70">
            SYSTEM AUTHENTICATION REQUIRED
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin} className="bg-white">
          <CardContent className="space-y-4 pt-6 pb-2">
            {error && <div className="text-[10px] font-mono font-bold text-[#FF6B6B] bg-[#FF6B6B]/10 p-2 border border-[#FF6B6B] uppercase">{error}</div>}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest" htmlFor="username">OPERATOR ID</label>
              <Input 
                id="username" 
                placeholder="admin" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="font-mono uppercase text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest" htmlFor="password">PASSCODE</label>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-mono text-sm tracking-widest"
              />
            </div>
          </CardContent>
          <CardFooter className="bg-white p-6 pt-2 border-t-0">
            <Button className="w-full h-12" type="submit" size="lg">AUTHORIZE SESSION</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
