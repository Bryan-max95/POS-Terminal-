"use client";

import { useState } from 'react';
import { useInventoryStore } from '@/store/useInventoryStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, ArrowUpDown, X } from 'lucide-react';

export default function InventoryPage() {
  const { products, addProduct } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    sku: '',
    barcode: '',
    name: '',
    price: 0,
    cost: 0,
    stock: 0,
    category: '',
    tax: 0.15
  });

  const filtered = products.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.sku) {
      alert('SKU and Name are required');
      return;
    }
    
    addProduct({
      ...newProduct,
      id: Math.random().toString(36).substring(7),
    });
    
    setShowAddModal(false);
    setNewProduct({
      sku: '', barcode: '', name: '', price: 0, cost: 0, stock: 0, category: '', tax: 0.15
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col flex-wrap sm:flex-row sm:items-end justify-between border-b border-[#141414] pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight uppercase">INVENTORY MANAGEMENT</h2>
          <p className="text-[10px] font-mono opacity-50 uppercase mt-1">Manage network stock levels & items.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-[10px] uppercase font-bold px-4 hover:bg-[#E4E3E0] rounded-md border-[#141414]">
            <Filter className="h-3 w-3 mr-1" /> FILTERS
          </Button>
          <Button className="text-[10px] uppercase font-bold px-4 bg-[#141414] text-white hover:bg-[#333] rounded-md" onClick={() => setShowAddModal(true)}>
             <Plus className="h-3 w-3 mr-1" /> NEW ITEM
          </Button>
        </div>
      </div>

      <div className="bg-white border border-[#141414] overflow-hidden flex flex-col rounded-md shadow-sm">
        <div className="p-2 border-b border-[#141414] flex items-center justify-between gap-4 bg-[#F8F9FA]">
          <div className="relative w-[300px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 text-lg">🔍</span>
            <Input 
              placeholder="SEARCH SKU / NAME..." 
              className="pl-9 text-xs font-mono uppercase bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#E4E3E0] border-b-2 border-[#141414] text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-4 py-2 border-r border-[#141414]">SKU</th>
                <th className="px-4 py-2 border-r border-[#141414]">Product Item</th>
                <th className="px-4 py-2 border-r border-[#141414]">Category</th>
                <th className="px-4 py-2 border-r border-[#141414] text-right">Cost</th>
                <th className="px-4 py-2 border-r border-[#141414] text-right">Price</th>
                <th className="px-4 py-2 border-r border-[#141414]">
                  <div className="flex items-center gap-1">Stock <ArrowUpDown className="h-3 w-3 opacity-50" /></div>
                </th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-mono">
              {filtered.map((item, idx) => (
                <tr key={item.id} className={`border-b border-[#141414] hover:bg-[#141414] hover:text-white transition-colors group ${idx % 2 === 1 ? 'bg-[#F8F9FA]' : 'bg-white'}`}>
                  <td className="px-4 py-2 border-r border-[#141414] opacity-70 group-hover:opacity-100 group-hover:border-[#333] transition-colors">{item.sku}</td>
                  <td className="px-4 py-2 border-r border-[#141414] font-bold uppercase tracking-tight group-hover:border-[#333] transition-colors">{item.name}</td>
                  <td className="px-4 py-2 border-r border-[#141414] text-[9px] uppercase group-hover:border-[#333] transition-colors">{item.category}</td>
                  <td className="px-4 py-2 border-r border-[#141414] text-right group-hover:border-[#333] transition-colors">L {item.cost.toFixed(2)}</td>
                  <td className="px-4 py-2 border-r border-[#141414] text-right font-bold group-hover:border-[#333] transition-colors">L {item.price.toFixed(2)}</td>
                  <td className="px-4 py-2 border-r border-[#141414] group-hover:border-[#333] transition-colors">
                    <span className={`inline-flex items-center px-1.5 py-0.5 border rounded-sm ${
                      item.stock === 0 ? 'bg-[#FF6B6B] text-white border-[#FF6B6B]' :
                      item.stock < 10 ? 'bg-orange-500 text-white border-orange-500' :
                      'bg-[#2ECC71] text-[#141414] border-[#141414]'
                    }`}>
                      {item.stock} UDS
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button className="underline underline-offset-2 hover:opacity-70 uppercase text-[9px] font-bold">EDIT</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-xs opacity-50 uppercase font-bold">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Create Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white border border-[#141414] rounded-md shadow-2xl flex flex-col w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center p-3 border-b border-[#141414] bg-[#F8F9FA]">
              <h2 className="text-[11px] font-bold uppercase tracking-widest">ADD NEW ITEM</h2>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-slate-200 p-1 rounded-sm"><X className="h-4 w-4" /></button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Item Name</label>
                  <Input 
                    value={newProduct.name} 
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                    placeholder="E.g. Manzana Verde"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">SKU</label>
                  <Input 
                    value={newProduct.sku} 
                    onChange={e => setNewProduct({...newProduct, sku: e.target.value})} 
                    placeholder="SKU-001"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Cost (L)</label>
                  <Input 
                    type="number"
                    value={newProduct.cost} 
                    onChange={e => setNewProduct({...newProduct, cost: parseFloat(e.target.value) || 0})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Price (L)</label>
                  <Input 
                    type="number"
                    value={newProduct.price} 
                    onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Initial Stock</label>
                  <Input 
                    type="number"
                    value={newProduct.stock} 
                    onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Category</label>
                  <Input 
                    value={newProduct.category} 
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})} 
                    placeholder="Frutas"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Barcode</label>
                  <Input 
                    value={newProduct.barcode} 
                    onChange={e => setNewProduct({...newProduct, barcode: e.target.value})} 
                    placeholder="1234567890"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-3 border-t border-[#141414] bg-[#F8F9FA] flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>CANCEL</Button>
              <Button onClick={handleSaveProduct} className="bg-[#141414] text-white hover:bg-[#333]">SAVE ITEM</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
