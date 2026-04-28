"use client";

import { useOrdersStore } from '@/store/useOrdersStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calculator, Download, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';

export default function AccountingPage() {
  const { orders } = useOrdersStore();
  const { company } = useSettingsStore();
  const [filterMonth, setFilterMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM
  
  // Try to parse the order date which is in format "DD/MM/YYYY, HH:MM:SS" conceptually
  // Since we used toLocaleString('es-HN'), it might look like "28/04/2026, 02:44:20 a. m."
  // For simplicity, let's just include all orders or let's try to match month if possible.
  // We'll calculate totals for all orders for now, or you could parse it.
  
  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
  const totalTax = orders.reduce((acc, order) => acc + order.tax, 0);
  const totalSubtotal = orders.reduce((acc, order) => acc + order.subtotal, 0);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('REPORTE CONTABLE DE IMPUESTOS (SAR)', 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Empresa: ${company.name}`, 14, 30);
    doc.text(`RTN: ${company.rtn}`, 14, 35);
    doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString('es-HN')}`, 14, 40);
    
    // Summary table
    autoTable(doc, {
      startY: 50,
      head: [['Concepto', 'Monto (HNL)']],
      body: [
        ['Ventas Totales (Subtotal)', `L ${totalSubtotal.toFixed(2)}`],
        ['Impuesto Cobrado (15%)', `L ${totalTax.toFixed(2)}`],
        ['Total Ingresado', `L ${totalSales.toFixed(2)}`],
      ],
      theme: 'grid',
      styles: { fontSize: 11 },
      headStyles: { fillColor: [20, 20, 20] }
    });

    // Detailed orders
    const finalY = (doc as any).lastAutoTable.finalY || 50;
    doc.text('Detalle de Transacciones:', 14, finalY + 10);
    
    const tableData = orders.map(o => [
      o.id,
      o.date,
      `L ${o.subtotal.toFixed(2)}`,
      `L ${o.tax.toFixed(2)}`,
      `L ${o.total.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: finalY + 15,
      head: [['ID Orden', 'Fecha', 'Subtotal', 'Impuesto (15%)', 'Total']],
      body: tableData,
      theme: 'striped',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [40, 40, 40] }
    });

    doc.save(`Reporte_SAR_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#141414] pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold tracking-tight uppercase">ACCOUNTING & TAXES</h2>
          <p className="text-[10px] font-mono opacity-50 uppercase mt-1">Tax reporting and accounting module for SAR declaration.</p>
        </div>
        <Button onClick={generatePDF} className="bg-[#141414] text-white hover:bg-[#333] text-[10px] font-bold uppercase tracking-widest px-4 h-10 rounded-md">
          <Download className="w-4 h-4 mr-2" /> DOWNLOAD PDF (SAR)
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#141414] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-[#E4E3E0]">Total Tax (ISV) to Pay</CardTitle>
             <Calculator className="h-4 w-4 opacity-50" />
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-mono mt-2 text-[#FFD166]">L {totalTax.toFixed(2)}</div>
             <p className="text-[10px] font-mono opacity-70 mt-1 uppercase text-[#E4E3E0]">Collected from {orders.length} transactions.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-[11px] font-bold uppercase tracking-widest">Base Sales (Subtotal)</CardTitle>
             <Calculator className="h-4 w-4 opacity-50" />
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-mono mt-2">L {totalSubtotal.toFixed(2)}</div>
             <p className="text-[10px] font-mono opacity-50 mt-1 uppercase">Excludes applied taxes.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-[11px] font-bold uppercase tracking-widest">Gross Revenue</CardTitle>
             <Calculator className="h-4 w-4 opacity-50" />
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-mono mt-2">L {totalSales.toFixed(2)}</div>
             <p className="text-[10px] font-mono opacity-50 mt-1 uppercase">Total amount processed globally.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions Log</CardTitle>
          <CardDescription>All processed orders generating tax.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-[#141414] rounded-md overflow-hidden bg-white">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#141414] text-white text-[10px] font-mono uppercase tracking-widest">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                  <th className="px-4 py-3 text-right text-[#FFD166]">Tax (15%)</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[10px] font-mono uppercase opacity-50 border-t border-[#E4E3E0]">
                      No transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="border-t border-[#E4E3E0] hover:bg-[#F8F9FA]">
                      <td className="px-4 py-3 font-mono text-[11px]">{o.id}</td>
                      <td className="px-4 py-3 text-[11px]">{o.date}</td>
                      <td className="px-4 py-3 text-right font-mono text-[11px]">L {o.subtotal.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[11px]">L {o.tax.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[11px]">L {o.total.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
