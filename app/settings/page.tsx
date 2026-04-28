"use client";

import { useSettingsStore } from '@/store/useSettingsStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from 'react';

export default function SettingsPage() {
  const { company, updateCompany } = useSettingsStore();

  const [formData, setFormData] = useState({
    name: company.name,
    rtn: company.rtn,
    cai: company.cai,
    correlativoInfo: company.correlativoInfo,
    address: company.address,
    email: company.email,
    phone: company.phone,
    ticketFooter: company.ticketFooter,
    exchangeRate: company.exchangeRate,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'exchangeRate' ? parseFloat(value) || 0 : value });
  };

  const handleSave = () => {
    updateCompany(formData);
    alert('Configuración guardada exitosamente.');
  };

  const currentDate = new Date().toLocaleString('es-HN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-[#141414] pb-4">
        <h2 className="text-xl font-bold tracking-tight uppercase">SYSTEM CONFIG</h2>
        <p className="text-[10px] font-mono opacity-50 uppercase mt-1">Configuración y Datos de Facturación (CAI, RTN).</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
           <CardHeader>
             <CardTitle>Datos de la Empresa / Facturación</CardTitle>
             <CardDescription>Información legal que aparecerá en el ticket generado.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4 pt-4 flex-1">
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest">Nombre del Negocio</label>
                 <Input name="name" value={formData.name} onChange={handleChange} />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest">Tasa de Cambio (L x $1)</label>
                 <Input name="exchangeRate" type="number" step="0.01" value={formData.exchangeRate} onChange={handleChange} />
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest">RTN</label>
                 <Input name="rtn" value={formData.rtn} onChange={handleChange} />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest">Teléfono</label>
                 <Input name="phone" value={formData.phone} onChange={handleChange} />
               </div>
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest">CAI</label>
               <Input name="cai" value={formData.cai} onChange={handleChange} />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest">Rango Correlativo</label>
               <Input name="correlativoInfo" value={formData.correlativoInfo} onChange={handleChange} />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest">Dirección</label>
               <Input name="address" value={formData.address} onChange={handleChange} />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest">Correo / Web</label>
               <Input name="email" value={formData.email} onChange={handleChange} />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest">Pie de Ticket</label>
               <Input name="ticketFooter" value={formData.ticketFooter} onChange={handleChange} />
             </div>
             <Button onClick={handleSave} className="w-full mt-4">Guardar Cambios</Button>
           </CardContent>
         </Card>

         <Card className="flex flex-col bg-[#F8F7F4] border-dashed border-2">
           <CardHeader>
             <CardTitle>Vista Previa de Factura</CardTitle>
             <CardDescription>Visualiza cómo se imprimirá la factura.</CardDescription>
           </CardHeader>
           <CardContent className="pt-4 flex-1 flex items-center justify-center bg-[#E4E3E0] p-4 rounded-b-md">
             {/* Receipt Preview */}
             <div className="bg-white w-[300px] p-4 text-[#141414] font-mono text-[10px] uppercase shadow-lg border border-[#141414]" style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}>
               <div className="text-center font-bold text-sm mb-2">{formData.name || 'SUPERMERCADO'}</div>
               <div className="text-center opacity-80 leading-tight">
                 {formData.address}<br />
                 RTN: {formData.rtn}<br />
                 TEL: {formData.phone}<br />
                 {formData.email}
               </div>

               <div className="my-3 border-b border-dashed border-[#141414] opacity-50"></div>
               
               <div className="leading-tight mb-3">
                 <div className="font-bold">CAI:</div>
                 <div className="break-all">{formData.cai}</div>
                 <div className="mt-1">
                   <b>RANGO:</b> {formData.correlativoInfo}
                 </div>
               </div>

               <div className="my-3 border-b border-dashed border-[#141414] opacity-50"></div>

               <div className="flex justify-between mb-1">
                  <span>FACTURA: 000-001-01-00000001</span>
               </div>
               <div className="flex justify-between mb-3 opacity-80">
                  <span>FECHA: {currentDate.split(',')[0]}</span>
                  <span>{currentDate.split(',')[1]}</span>
               </div>

               <div className="flex justify-between font-bold border-b border-[#141414] pb-1 mb-1">
                 <span>CANT X ARTÍCULO</span>
                 <span>TOTAL</span>
               </div>
               <div className="flex justify-between mb-1 opacity-80">
                 <span>1 X EJEMPLO PROD</span>
                 <span>L 150.00</span>
               </div>
               <div className="flex justify-between mb-2 opacity-80">
                 <span>2 X OTRO PROD</span>
                 <span>L 300.00</span>
               </div>
               <div className="border-t border-[#141414] pt-1 mt-1 font-bold">
                 <div className="flex justify-between">
                   <span>SUBTOTAL:</span>
                   <span>L 450.00</span>
                 </div>
                 <div className="flex justify-between">
                   <span>15% ISV:</span>
                   <span>L 67.50</span>
                 </div>
                 <div className="flex justify-between text-xs mt-1">
                   <span>TOTAL:</span>
                   <span>L 517.50</span>
                 </div>
               </div>
               
               <div className="my-3 border-b border-dashed border-[#141414] opacity-50"></div>
               
               <div className="text-center opacity-80 leading-tight">
                 {formData.ticketFooter}
               </div>
             </div>
           </CardContent>
         </Card>
      </div>
    </div>
  );
}
