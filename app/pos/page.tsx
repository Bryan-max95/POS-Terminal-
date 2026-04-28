"use client";

import { useState } from 'react';
import { usePosStore, Product } from '@/store/usePosStore';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, User, X, Printer } from 'lucide-react';

export default function PosPage() {
  const { cart, globalDiscount, addToCart, removeFromCart, updateQuantity, clearCart } = usePosStore();
  const { products } = useInventoryStore();
  const { company } = useSettingsStore();
  const { addOrder } = useOrdersStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD'>('CASH');
  const [amountHNL, setAmountHNL] = useState('');
  const [amountUSD, setAmountUSD] = useState('');

  const [showReceipt, setShowReceipt] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.barcode.includes(searchTerm) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = cart.reduce((acc, item) => acc + (item.price * item.quantity * item.tax), 0);
  const total = subtotal + tax - globalDiscount;

  const totalGivenHNL = paymentMethod === 'CARD' 
    ? total 
    : (parseFloat(amountHNL) || 0) + ((parseFloat(amountUSD) || 0) * (company.exchangeRate || 26));
  const changeHNL = totalGivenHNL - total;

  const openPayment = (method: 'CASH' | 'CARD') => {
    if (cart.length === 0) return;
    setPaymentMethod(method);
    setAmountHNL('');
    setAmountUSD('');
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    if (totalGivenHNL < total - 0.01) return; // Allow small float differences
    
    const dateStr = new Date().toLocaleString('es-HN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    addOrder({
      id: Math.random().toString(36).substring(7),
      date: dateStr,
      subtotal,
      tax,
      total
    });

    // Save current cart state for receipt
    setCompletedOrder({
      cart: [...cart],
      subtotal,
      tax,
      total,
      paymentMethod,
      givenHNL: parseFloat(amountHNL) || 0,
      givenUSD: parseFloat(amountUSD) || 0,
      totalGivenHNL,
      changeHNL: changeHNL > 0 ? changeHNL : 0,
      exchangeRate: company.exchangeRate || 26,
      date: dateStr
    });
    
    setShowPaymentModal(false);
    setShowReceipt(true);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    clearCart();
    setCompletedOrder(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 min-h-[500px]">
      {/* Products Panel */}
      <div className="flex-1 flex flex-col bg-white border border-[#141414] overflow-hidden rounded-md shadow-sm">
        <div className="p-3 border-b border-[#141414] flex gap-2 bg-[#F8F9FA]">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 text-lg">🔍</span>
            <Input 
              placeholder="SEARCH SKU / BARCODE / NAME..." 
              className="pl-9 text-xs font-mono uppercase"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="text-[10px] uppercase font-bold px-4 hover:bg-white border-[#141414]">
            CATEGORIES
          </Button>
        </div>
        <div className="p-2 flex-1 overflow-y-auto bg-[#F4F4F5]">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {filteredProducts.map((product, i) => (
              <div 
                key={product.id} 
                onClick={() => addToCart(product)}
                className={`group relative flex flex-col justify-between border border-[#141414] p-3 cursor-pointer hover:bg-[#141414] hover:text-white transition-colors rounded-md ${i % 2 === 1 ? 'bg-[#F8F9FA]' : 'bg-white'}`}
              >
                <div className="text-[9px] font-mono opacity-50 group-hover:opacity-100">{product.sku}</div>
                <div className="text-[11px] font-bold leading-tight uppercase mt-1 mb-2">{product.name}</div>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="text-[12px] font-mono font-bold">${product.price.toFixed(2)}</div>
                  <div className="text-[9px] font-mono opacity-50">{product.stock} in stock</div>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center text-xs font-mono uppercase opacity-50 font-bold border-2 border-dashed border-[#141414] rounded-md m-2">
                NO ITEMS FOUND
              </div>
            )}
          </div>
        </div>
        
        {/* Keypad / Quick Actions */}
        <div className="h-16 lg:h-20 border-t border-[#141414] grid grid-cols-6 divide-x divide-[#141414] bg-[#F8F9FA]">
          <button className="flex flex-col items-center justify-center text-[10px] font-bold uppercase hover:bg-white transition-colors">Discount</button>
          <button className="flex flex-col items-center justify-center text-[10px] font-bold uppercase hover:bg-white transition-colors">Tax Exemp</button>
          <button className="flex flex-col items-center justify-center text-[10px] font-bold uppercase hover:bg-white transition-colors">Suspend</button>
          <button className="flex flex-col items-center justify-center text-[10px] font-bold uppercase hover:bg-white transition-colors">Recall</button>
          <button className="flex flex-col items-center justify-center text-[10px] font-bold uppercase hover:bg-white transition-colors">C. Refund</button>
          <button className="flex flex-col items-center justify-center text-[10px] font-bold uppercase bg-[#FF6B6B] text-white hover:bg-[#e05e5e] transition-colors" onClick={clearCart}>Clear All</button>
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-full lg:w-[35%] min-w-[320px] flex flex-col">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-[11px] font-bold uppercase tracking-widest italic font-serif">Current Order</h3>
          <span className="text-[10px] font-mono opacity-50">REF: #BWP-{Math.floor(Math.random() * 100000)}</span>
        </div>
        
        <div className="flex-1 border border-[#141414] bg-[#FDFDFD] flex flex-col rounded-md shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 border-b border-[#141414] text-[9px] font-bold uppercase p-2 opacity-50 bg-white">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-4 text-right">Amount</div>
          </div>

          <div className="flex-1 overflow-y-auto font-mono text-[11px] bg-white">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 p-4">
                <ShoppingCart className="h-8 w-8 mb-2" />
                <p className="text-[10px] font-bold uppercase">Cart is empty</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={item.cartId} className={`grid grid-cols-12 p-2 border-b border-[#E4E3E0] ${idx % 2 === 1 ? 'bg-[#F8F9FA]' : ''} group relative hover:bg-[#E4E3E0] transition-colors`}>
                  <div className="col-span-6 flex flex-col pr-1">
                     <span className="font-bold underline underline-offset-2 decoration-transparent group-hover:decoration-[#141414] leading-tight truncate">{item.name}</span>
                     <span className="text-[9px] opacity-60 mt-1">Code: {item.barcode}</span>
                  </div>
                  <div className="col-span-2 flex items-start justify-center pt-0.5">
                    <div className="flex items-center border border-[#141414] bg-white rounded-sm overflow-hidden">
                      <button className="px-1 hover:bg-[#D4D3D0] w-4 flex justify-center" onClick={(e) => { e.stopPropagation(); updateQuantity(item.cartId, Math.max(1, item.quantity - 1)); }}>-</button>
                      <span className="w-5 text-center text-[10px] font-bold border-x border-[#141414]">{item.quantity}</span>
                      <button className="px-1 hover:bg-[#D4D3D0] w-4 flex justify-center" onClick={(e) => { e.stopPropagation(); updateQuantity(item.cartId, item.quantity + 1); }}>+</button>
                    </div>
                  </div>
                  <div className="col-span-4 flex flex-col items-end pt-0.5 relative">
                     <span className="font-bold border-b border-transparent group-hover:border-[#FF6B6B] transition-colors cursor-pointer group/rm" title="Click to remove">
                       <span className="block group-hover/rm:hidden">${(item.price * item.quantity).toFixed(2)}</span>
                       <span className="hidden group-hover/rm:block text-[#FF6B6B] uppercase text-[9px]">Remove</span>
                     </span>
                     {/* Hidden button actually clicks */}
                     <button onClick={() => removeFromCart(item.cartId)} className="absolute inset-0 opacity-0 z-10 cursor-pointer">
                     </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-[#141414] text-white">
            <div className="flex justify-between text-[11px] font-mono opacity-70">
              <span>SUBTOTAL</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] font-mono opacity-70 mt-1">
              <span>TAX (16%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {globalDiscount > 0 && (
              <div className="flex justify-between text-[11px] font-mono text-[#2ECC71] mt-1">
                <span>DISCOUNT</span>
                <span>-${globalDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-end mt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest">TOTAL PAYABLE</span>
              <span className="text-3xl font-mono leading-none">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 h-32 lg:h-48 shrink-0">
          <button 
            className="border border-[#141414] bg-white flex flex-col items-center justify-center p-2 hover:bg-[#141414] hover:text-white transition-colors rounded-md shadow-sm disabled:opacity-50"
            onClick={() => openPayment('CASH')}
            disabled={cart.length === 0}
          >
            <span className="text-xl">💵</span>
            <span className="text-[10px] font-bold uppercase mt-1">Cash Payment</span>
          </button>
          <button 
            className="border border-[#141414] bg-white flex flex-col items-center justify-center p-2 hover:bg-[#141414] hover:text-white transition-colors rounded-md shadow-sm disabled:opacity-50"
            onClick={() => openPayment('CARD')}
            disabled={cart.length === 0}
          >
            <span className="text-xl">💳</span>
            <span className="text-[10px] font-bold uppercase mt-1">Card / Credit</span>
          </button>
          <button 
            className="col-span-2 border border-[#141414] bg-[#2ECC71] text-[#141414] font-bold uppercase py-4 flex items-center justify-center gap-2 hover:bg-[#27AE60] active:scale-[0.98] transition-all disabled:opacity-50 disabled:bg-[#E4E3E0] rounded-md shadow-sm"
            onClick={() => openPayment('CASH')}
            disabled={cart.length === 0}
          >
            <span className="text-lg">✓</span> COMPLETE TRANSACTION (F12)
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white border border-[#141414] rounded-md shadow-2xl flex flex-col w-full max-w-md animate-in fade-in zoom-in-95 overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b border-[#141414] bg-[#F8F9FA]">
              <h2 className="text-[11px] font-bold uppercase tracking-widest">PAYMENT DETAILS</h2>
              <button onClick={() => setShowPaymentModal(false)} className="hover:bg-slate-200 p-1 rounded-sm"><X className="h-4 w-4" /></button>
            </div>
            
            <div className="flex bg-[#F4F4F5] border-b border-[#141414]">
              <button 
                className={`flex-1 p-3 text-[10px] font-bold uppercase tracking-widest border-r border-[#141414] transition-colors ${paymentMethod === 'CASH' ? 'bg-white border-b-2 border-b-[#141414]' : 'opacity-60 hover:opacity-100'}`}
                onClick={() => setPaymentMethod('CASH')}
              >
                💵 Cash
              </button>
              <button 
                className={`flex-1 p-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${paymentMethod === 'CARD' ? 'bg-white border-b-2 border-b-[#141414]' : 'opacity-60 hover:opacity-100'}`}
                onClick={() => setPaymentMethod('CARD')}
              >
                💳 Card / POS
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-[#141414] text-white p-4 rounded-md flex justify-between items-center shadow-inner">
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Total to Pay</span>
                <span className="text-3xl font-mono leading-none">L {total.toFixed(2)}</span>
              </div>

              {paymentMethod === 'CASH' && (
                <div className="space-y-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest">Received (HNL)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 font-bold">L</span>
                        <Input 
                          type="number" 
                          step="0.01" 
                          className="pl-8 text-lg font-mono font-bold py-6"
                          value={amountHNL}
                          onChange={(e) => setAmountHNL(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest relative group cursor-help">
                        Received (USD)
                        <span className="absolute hidden group-hover:block bottom-full left-0 mb-1 bg-[#141414] text-white p-1 text-[8px] whitespace-nowrap rounded-sm">Rate: L{company.exchangeRate} / $1</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 font-bold">$</span>
                        <Input 
                          type="number" 
                          step="0.01" 
                          className="pl-8 text-lg font-mono font-bold py-6"
                          value={amountUSD}
                          onChange={(e) => setAmountUSD(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-dashed border-[#141414] pt-4 mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-bold uppercase opacity-70">Total Given (HNL)</span>
                      <span className="text-sm font-mono font-bold">L {totalGivenHNL.toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between items-end p-3 rounded-md ${changeHNL >= 0 ? 'bg-[#2ECC71]/20 border border-[#2ECC71]' : 'bg-[#FF6B6B]/20 border border-[#FF6B6B]'}`}>
                      <span className="text-[11px] font-bold uppercase">Change to return</span>
                      <span className="text-xl font-mono font-bold">L {changeHNL > 0 ? changeHNL.toFixed(2) : "0.00"}</span>
                    </div>
                    {changeHNL < 0 && (
                      <p className="text-[9px] text-[#FF6B6B] font-bold uppercase tracking-widest mt-2 text-right">Insufficient amount</p>
                    )}
                  </div>
                </div>
              )}
              
              {paymentMethod === 'CARD' && (
                <div className="space-y-4 mt-6 py-4 flex flex-col items-center justify-center border-2 border-dashed border-[#141414] p-6 rounded-md">
                   <CreditCard className="w-12 h-12 mb-4 opacity-50" />
                   <p className="text-xs font-bold uppercase text-center">Process the payment of <span className="font-mono bg-[#E4E3E0] px-1">L {total.toFixed(2)}</span><br/> in your Card Terminal.</p>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-[#141414] bg-[#F8F9FA] flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowPaymentModal(false)}>CANCEL</Button>
              <Button 
                onClick={handleConfirmPayment} 
                className="bg-[#141414] text-white hover:bg-[#333]"
                disabled={paymentMethod === 'CASH' && totalGivenHNL < total - 0.01}
              >
                CONFIRM PAYMENT
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          {/* Use standard print layout mapping */}
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body * { visibility: hidden; }
              #printable-receipt, #printable-receipt * { visibility: visible; }
              #printable-receipt { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; }
            }
          `}} />
          
          <div className="bg-white border border-[#141414] rounded-md shadow-2xl flex flex-col max-h-full max-w-sm w-full animate-in fade-in zoom-in-95 overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b border-[#141414] bg-[#F8F9FA]">
              <h2 className="text-[11px] font-bold uppercase tracking-widest">Transaction Successful</h2>
              <button onClick={handleCloseReceipt} className="hover:bg-slate-200 p-1 rounded-sm"><X className="h-4 w-4" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-[#F4F4F5] flex justify-center">
              {/* Actual Printable Area */}
              <div id="printable-receipt" className="bg-white w-[260px] p-4 text-[#141414] font-mono text-[10px] uppercase shadow-lg border border-[#141414]">
                 <div className="text-center font-bold text-sm mb-2">{company.name}</div>
                 <div className="text-center opacity-80 leading-tight">
                   {company.address}<br />
                   RTN: {company.rtn}<br />
                   TEL: {company.phone}<br />
                   {company.email}
                 </div>

                 <div className="my-3 border-b border-dashed border-[#141414] opacity-50"></div>
                 
                 <div className="leading-tight mb-3">
                   <div className="font-bold">CAI:</div>
                   <div className="break-all">{company.cai}</div>
                   <div className="mt-1">
                     <b>RANGO:</b> {company.correlativoInfo}
                   </div>
                 </div>

                 <div className="my-3 border-b border-dashed border-[#141414] opacity-50"></div>

                 <div className="flex justify-between mb-1">
                    <span>FACTURA: 000-001-01-00000001</span>
                 </div>
                 <div className="flex justify-between mb-3 opacity-80">
                    <span>FECHA: {completedOrder.date.split(',')[0]}</span>
                    <span>{completedOrder.date.split(',')[1]}</span>
                 </div>

                 <div className="flex justify-between font-bold border-b border-[#141414] pb-1 mb-1">
                   <span>CANT X ARTÍCULO</span>
                   <span>TOTAL</span>
                 </div>
                 
                 {completedOrder.cart.map((item: any) => (
                   <div key={item.cartId} className="flex justify-between mb-1 opacity-80 break-words">
                     <span className="w-2/3 pr-2">{item.quantity} X {item.name}</span>
                     <span>L {(item.price * item.quantity).toFixed(2)}</span>
                   </div>
                 ))}
                 
                 <div className="border-t border-[#141414] pt-1 mt-2 font-bold">
                   <div className="flex justify-between">
                     <span>SUBTOTAL:</span>
                     <span>L {completedOrder.subtotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>15% ISV:</span>
                     <span>L {completedOrder.tax.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-xs mt-1 bg-[#141414] text-white p-1">
                     <span>TOTAL:</span>
                     <span>L {completedOrder.total.toFixed(2)}</span>
                   </div>
                 </div>
                 
                 <div className="mt-2 text-[10px] opacity-80 space-y-0.5">
                   {completedOrder.paymentMethod === 'CASH' ? (
                     <>
                       {completedOrder.givenHNL > 0 && (
                         <div className="flex justify-between">
                           <span>EFECTIVO L:</span>
                           <span>L {completedOrder.givenHNL.toFixed(2)}</span>
                         </div>
                       )}
                       {completedOrder.givenUSD > 0 && (
                         <div className="flex justify-between">
                           <span>EFECTIVO $ (T/C {completedOrder.exchangeRate}):</span>
                           <span>$ {completedOrder.givenUSD.toFixed(2)}</span>
                         </div>
                       )}
                       <div className="flex justify-between font-bold">
                         <span>CAMBIO:</span>
                         <span>L {completedOrder.changeHNL.toFixed(2)}</span>
                       </div>
                     </>
                   ) : (
                     <div className="flex justify-between font-bold">
                       <span>TARJETA CRÉDITO/DÉBITO:</span>
                       <span>L {completedOrder.total.toFixed(2)}</span>
                     </div>
                   )}
                 </div>

                 <div className="my-3 border-b border-dashed border-[#141414] opacity-50"></div>
                 
                 <div className="text-center opacity-80 leading-tight">
                   {company.ticketFooter}
                 </div>
              </div>
            </div>

            <div className="p-3 border-t border-[#141414] bg-white flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleCloseReceipt}>NEW SALE</Button>
              <Button className="flex-1 gap-2" onClick={handlePrint}><Printer className="h-4 w-4" /> PRINT TICKET</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
