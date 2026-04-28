"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, TrendingUp, Package, Users } from "lucide-react";

const salesData = [
  { name: 'Lun', obj: 4000, act: 2400 },
  { name: 'Mar', obj: 3000, act: 1398 },
  { name: 'Mié', obj: 2000, act: 9800 },
  { name: 'Jue', obj: 2780, act: 3908 },
  { name: 'Vie', obj: 1890, act: 4800 },
  { name: 'Sáb', obj: 2390, act: 3800 },
  { name: 'Dom', obj: 3490, act: 4300 },
];

const topProducts = [
  { name: 'Basic Tee', ventas: 400 },
  { name: 'Denim Pants', ventas: 300 },
  { name: 'Casual Shoes', ventas: 200 },
  { name: 'Leather Jacket', ventas: 150 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#141414] pb-4">
        <h2 className="text-xl font-bold tracking-tight uppercase">ANALYTICS OVERVIEW</h2>
        <p className="text-[10px] font-mono opacity-50 uppercase mt-1">Real-time metrics and sales summary.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Sales Today</CardTitle>
            <DollarSign className="h-4 w-4 opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono mt-2">$4,523.18</div>
            <p className="text-[10px] font-mono text-[#2ECC71] flex items-center mt-1 uppercase">
              <TrendingUp className="h-3 w-3 mr-1" />
              +20.1% vs prev day
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono mt-2">+2350</div>
            <p className="text-[10px] font-mono opacity-50 mt-1 uppercase">
              +180 vs prev day
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Items Sold</CardTitle>
            <Package className="h-4 w-4 opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono mt-2">12,234</div>
            <p className="text-[10px] font-mono opacity-50 mt-1 uppercase">
              +19% this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Active Clients</CardTitle>
            <Users className="h-4 w-4 opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono mt-2">+573</div>
            <p className="text-[10px] font-mono opacity-50 mt-1 uppercase">
              +201 new this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle>Sales Trend Weekly</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 pt-4 flex-1">
            <div className="h-[300px] w-full font-mono text-[9px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#141414" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 0, border: '1px solid #141414', backgroundColor: '#fff', fontSize: '10px', textTransform: 'uppercase' }}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E3E0" />
                  <Area type="monotone" dataKey="act" stroke="#141414" strokeWidth={2} fillOpacity={1} fill="url(#colorAct)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Highest volume by unit sales
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex-1">
            <div className="h-[300px] w-full font-mono text-[9px] uppercase">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E4E3E0" />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={80} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 0, border: '1px solid #141414', backgroundColor: '#fff', fontSize: '10px' }}
                  />
                  <Bar dataKey="ventas" fill="#141414" radius={0} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
