"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#141414] pb-4">
        <h2 className="text-xl font-bold tracking-tight uppercase">CLIENT DIRECTORY</h2>
        <p className="text-[10px] font-mono opacity-50 uppercase mt-1">Manage network clients, credits, and purchase history.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
           <CardHeader>
             <CardTitle>Total Entities</CardTitle>
             <CardDescription>Registered across all branches</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="text-3xl font-mono">1,245</div>
           </CardContent>
        </Card>
        <Card>
           <CardHeader>
             <CardTitle>Active Credit</CardTitle>
             <CardDescription>Accounts receivable (A/R)</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="text-3xl font-mono text-orange-500">$12,450.00</div>
           </CardContent>
        </Card>
      </div>

       <div className="border border-[#141414] bg-[#E4E3E0]">
          <div className="p-12 text-center uppercase tracking-widest font-bold text-[10px] opacity-50">
             CLIENT MODULE UNDER CONSTRUCTION <br/>
             ADVANCED PAGINATION TABLE WILL BE DEPLOYED HERE.
          </div>
       </div>
    </div>
  );
}
