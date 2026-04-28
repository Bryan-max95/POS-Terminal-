"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const reportData = [
  { name: '08:00', ventas: 400 },
  { name: '10:00', ventas: 1200 },
  { name: '12:00', ventas: 3400 },
  { name: '14:00', ventas: 2800 },
  { name: '16:00', ventas: 3900 },
  { name: '18:00', ventas: 4800 },
  { name: '20:00', ventas: 1100 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#141414] pb-4">
        <h2 className="text-xl font-bold tracking-tight uppercase">ADVANCED ANALYTICS</h2>
        <p className="text-[10px] font-mono opacity-50 uppercase mt-1">Financial BI reports, register closeouts & statistics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <Card className="lg:col-span-2 flex flex-col">
           <CardHeader>
             <CardTitle>Cash Flow - Today</CardTitle>
             <CardDescription>Real-time hourly snapshot.</CardDescription>
           </CardHeader>
           <CardContent className="flex-1 pt-4">
             <div className="h-[300px] w-full text-[9px] font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid stroke="#141414" strokeDasharray="2 2" opacity={0.2} vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: 0, border: '1px solid #141414', backgroundColor: '#fff', fontSize: '10px' }}
                    />
                    <Line type="step" dataKey="ventas" stroke="#141414" strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 4, fill: '#141414' }} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
           </CardContent>
         </Card>

         <div className="space-y-6">
           <Card>
             <CardHeader>
               <CardTitle>Sales by Node</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 pt-4">
                <div>
                   <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                     <span className="opacity-70">Main (MTY)</span>
                     <span className="font-mono">65%</span>
                   </div>
                   <div className="w-full bg-[#E4E3E0] h-4 border border-[#141414]">
                     <div className="bg-[#141414] h-full" style={{ width: '65%' }}></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                     <span className="opacity-70">North Node</span>
                     <span className="font-mono">20%</span>
                   </div>
                   <div className="w-full bg-[#E4E3E0] h-4 border border-[#141414]">
                     <div className="bg-[#FF6B6B] h-full border-r border-[#141414]" style={{ width: '20%' }}></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                     <span className="opacity-70">South Node</span>
                     <span className="font-mono">15%</span>
                   </div>
                   <div className="w-full bg-[#E4E3E0] h-4 border border-[#141414]">
                     <div className="bg-[#2ECC71] h-full border-r border-[#141414]" style={{ width: '15%' }}></div>
                   </div>
                </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle>Data Export</CardTitle>
             </CardHeader>
             <CardContent className="flex flex-col gap-2 pt-4">
                <button className="text-[10px] uppercase font-bold tracking-widest text-left p-3 border border-[#141414] bg-white hover:bg-[#141414] hover:text-white transition-colors">Register Closeout (PDF)</button>
                <button className="text-[10px] uppercase font-bold tracking-widest text-left p-3 border border-[#141414] bg-white hover:bg-[#141414] hover:text-white transition-colors">Detailed Sales (CSV)</button>
                <button className="text-[10px] uppercase font-bold tracking-widest text-left p-3 border border-[#141414] bg-white hover:bg-[#141414] hover:text-white transition-colors">Inventory Kardex (XLS)</button>
             </CardContent>
           </Card>
         </div>
      </div>
    </div>
  );
}
