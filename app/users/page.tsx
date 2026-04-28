"use client";

import { useState } from 'react';
import { useUsersStore } from '@/store/useUsersStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, User } from 'lucide-react';
import { Role } from '@/store/useAuthStore';

export default function UsersPage() {
  const { users, addUser, removeUser } = useUsersStore();
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState<{username: string, password: string, role: Role}>({
    username: '',
    password: '',
    role: 'Cajero'
  });

  const handleSave = () => {
    if (!newUser.username || !newUser.password) {
      alert("Please fill in all fields.");
      return;
    }
    addUser({
      id: Math.random().toString(36).substring(7),
      username: newUser.username,
      password: newUser.password,
      role: newUser.role,
      permissions: [newUser.role]
    });
    setShowModal(false);
    setNewUser({ username: '', password: '', role: 'Cajero' });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#141414] pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold tracking-tight uppercase">OPERATOR MANAGEMENT</h2>
          <p className="text-[10px] font-mono opacity-50 uppercase mt-1">Manage system operators and cashiers.</p>
        </div>
        <Button className="text-[10px] uppercase font-bold px-4 bg-[#141414] text-white hover:bg-[#333] rounded-md" onClick={() => setShowModal(true)}>
           <Plus className="h-3 w-3 mr-1" /> NEW OPERATOR
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <Card key={user.id} className="relative flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="w-12 h-12 bg-[#F4F4F5] border border-[#141414] rounded-full flex items-center justify-center">
                <User className="h-6 w-6 opacity-50" />
              </div>
              <div>
                <CardTitle className="uppercase tracking-widest">{user.username}</CardTitle>
                <div className="text-[10px] font-mono uppercase bg-[#141414] text-white inline-block px-1 mt-1">{user.role}</div>
              </div>
            </CardHeader>
            <CardContent className="pt-2 mt-auto">
              {user.username !== 'admin' && (
                <Button variant="outline" className="w-full text-[#FF6B6B] border-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white" onClick={() => removeUser(user.id)}>
                  REMOVE ACCESS
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white border border-[#141414] rounded-md shadow-2xl flex flex-col w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center p-3 border-b border-[#141414] bg-[#F8F9FA]">
              <h2 className="text-[11px] font-bold uppercase tracking-widest">ADD OPERATOR</h2>
              <button onClick={() => setShowModal(false)} className="hover:bg-slate-200 p-1 rounded-sm"><X className="h-4 w-4" /></button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Operator ID (Username)</label>
                <Input value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} placeholder="cajero2" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Passcode</label>
                <Input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="••••••" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Role</label>
                <select 
                  className="flex h-10 w-full border border-[#141414] bg-white px-3 py-2 text-xs font-mono rounded-md"
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value as Role})}
                >
                  <option value="Cajero">Cajero</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            
            <div className="p-3 border-t border-[#141414] bg-[#F8F9FA] flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowModal(false)}>CANCEL</Button>
              <Button onClick={handleSave} className="bg-[#141414] text-white hover:bg-[#333]">CREATE OPERATOR</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
