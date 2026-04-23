import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../data/products';
import { brands } from '../data/products';

interface AdminPanelProps {
  onProductsChange: (products: Product[]) => void;
}

let nextId = 1000;

const DEFAULT_CATEGORIES = [
  { id: 'bags', name: 'Borse' },
  { id: 'wallets', name: 'Portafogli' },
  { id: 'bracelets', name: 'Bracciali' },
  { id: 'backpacks', name: 'Zaini' },
  { id: 'accessories', name: 'Accessori' },
];

export default function AdminPanel({ onProductsChange }: AdminPanelProps) {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeSection, setActiveSection] = useState<'products' | 'categories'>('products');
  const [productTab, setProductTab] = useState<'list' | 'form'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  const [customCategories, setCustomCategories] = useState<{ id: string; name: string }[]>(() => {
    try { const s = localStorage.getItem('muse-categories'); return s ? JSON.parse(s) : DEFAULT_CATEGORIES; }
    catch { return DEFAULT_CATEGORIES; }
  });
  const [catForm, setCatForm] = useState({ id: '', name: '' });
  const [catEditIndex, setCatEditIndex] = useState<number | null>(null);

  const [imgPreview, setImgPreview] = useState<string>('');
  const [imgFileName, setImgFileName] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const correctPassword = 'muse2026';

  useEffect(() => {
    localStorage.setItem('muse-categories', JSON.stringify(customCategories));
  }, [customCategories]);


  useEffect(() => {
    const saved = localStorage.getItem('muse-products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Product[];
        setProducts(parsed);
        onProductsChange(parsed);
      } catch { /* ignore */ }
    } else {
      import('../data/products').then((m) => {
        setProducts(m.products);
        onProductsChange(m.products);
      });
    }
  }, [onProductsChange]);

  useEffect(() => {
    if (products.length) {
      localStorage.setItem('muse-products', JSON.stringify(products));
    }
  }, [products]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) setAuthenticated(true);
    else alert('Password errata!');
  };

  const resetForm = useCallback(() => {
    setEditingProduct(null);
    setImgPreview('');
    setImgFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgPreview(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const product: Product = {
      id: editingProduct ? editingProduct.id : nextId++,
      name: String(fd.get('name') || ''),
      brand: String(fd.get('brand') || ''),
      category: String(fd.get('category') || 'bags'),
      price: Number(fd.get('price') || 0),
      originalPrice: fd.get('originalPrice') ? Number(fd.get('originalPrice')) : undefined,
      image: imgPreview || String(fd.get('image') || '/images/model-bag.jpg'),
      description: String(fd.get('description') || ''),
      badge: String(fd.get('badge') || '') || undefined,
      isNew: fd.get('isNew') === 'on',
    };

    setProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      const updated = exists
        ? prev.map((p) => (p.id === product.id ? product : p))
        : [...prev, product];
      setTimeout(() => onProductsChange(updated), 0);
      return updated;
    });
    resetForm();
    setProductTab('list');
  };

  const handleDelete = (id: number) => {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return;
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      onProductsChange(updated);
      return updated;
    });
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setImgPreview(product.image);
    setProductTab('form');
  };

  const startNew = () => {
    resetForm();
    setEditingProduct(null);
    setProductTab('form');
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelCategory = (index: number) => {
    const cat = customCategories[index];
    const used = products.some((p) => p.category === cat.id);
    if (used) return alert(`La categoria "${cat.name}" è usata da alcuni prodotti. Cambiala prima.`);
    if (!confirm(`Eliminare la categoria "${cat.name}"?`)) return;
    setCustomCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveCategory = () => {
    if (!catForm.id.trim() || !catForm.name.trim()) return alert('ID e Nome sono obbligatori');
    if (catEditIndex !== null) {
      setCustomCategories((prev) => {
        const next = [...prev];
        next[catEditIndex] = { id: catForm.id.trim(), name: catForm.name.trim() };
        return next;
      });
    } else {
      setCustomCategories((prev) => [...prev, { id: catForm.id.trim(), name: catForm.name.trim() }]);
    }
    setCatForm({ id: '', name: '' });
    setCatEditIndex(null);
  };

  const handleEditCategory = (index: number) => {
    const c = customCategories[index];
    setCatForm({ id: c.id, name: c.name });
    setCatEditIndex(index);
  };

  if (!authenticated) {
    return (
      <div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='w-full max-w-sm bg-[#111] border border-gucci-700/20 rounded-lg p-6'
        >
          <h2 className='text-white text-xl tracking-[0.1em] uppercase mb-6 text-center font-light'>
            Admin Access
          </h2>
          <form onSubmit={handleLogin} className='space-y-4'>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              className='w-full px-4 py-3 bg-[#0a0a0a] border border-gucci-700/20 rounded text-gray-300 text-sm placeholder-gray-600 focus:outline-none focus:border-gucci-600/50 transition-colors'
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              className='w-full px-6 py-3 bg-gradient-to-r from-gucci-700 to-gucci-600 text-white text-xs tracking-[0.1em] uppercase rounded hover:from-gucci-600 hover:to-gucci-500 transition-all duration-300 shadow-lg shadow-gucci-900/30'
            >
              Accedi
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#0a0a0a] text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl tracking-[0.1em] uppercase font-light'>Pannello Admin</h1>
          <div className='flex gap-3'>
            <button
              onClick={() => { setActiveSection('products'); setProductTab('list'); }}
              className={`px-4 py-2 text-xs tracking-[0.1em] uppercase rounded transition-all ${activeSection === 'products' ? 'bg-gucci-600 text-white' : 'border border-gucci-700/20 text-gray-400 hover:border-gucci-600/50'}`}
            >
              Prodotti
            </button>
            <button
              onClick={() => setActiveSection('categories')}
              className={`px-4 py-2 text-xs tracking-[0.1em] uppercase rounded transition-all ${activeSection === 'categories' ? 'bg-gucci-600 text-white' : 'border border-gucci-700/20 text-gray-400 hover:border-gucci-600/50'}`}
            >
              Categorie
            </button>
          </div>
        </div>

        <AnimatePresence mode='wait'>
          {activeSection === 'products' && (
            <motion.div key='products' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {productTab === 'list' && (
                <>
                  <div className='flex items-center justify-between mb-6'>
                    <input
                      type='text'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder='Cerca prodotti...'
                      className='px-4 py-2 bg-[#111] border border-gucci-700/20 rounded text-gray-300 text-xs placeholder-gray-600 focus:outline-none focus:border-gucci-600/50'
                    />
                    <button
                      onClick={startNew}
                      className='px-4 py-2 bg-gradient-to-r from-gucci-700 to-gucci-600 text-white text-xs tracking-[0.1em] uppercase rounded hover:from-gucci-600 hover:to-gucci-500 transition-all duration-300'
                    >
                      + Nuovo Prodotto
                    </button>
                  </div>
                  <div className='space-y-3'>
                    <div className='grid grid-cols-[60px_1fr_100px_100px_80px_80px_80px_60px_40px] gap-3 text-[10px] tracking-[0.1em] uppercase text-gray-500 border-b border-gucci-700/20 pb-3 px-3 items-center'>
                      <div>Img</div>
                      <div>Nome</div>
                      <div>Brand</div>
                      <div>Categoria</div>
                      <div>Prezzo</div>
                      <div>Sconto</div>
                      <div>Badge</div>
                      <div>Nuovo</div>
                      <div />
                    </div>
                    {filtered.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='grid grid-cols-[60px_1fr_100px_100px_80px_80px_80px_60px_40px] gap-3 items-center bg-[#111] border border-gucci-700/10 rounded px-3 py-2 hover:border-gucci-600/30 transition-colors'
                      >
                        <div className='w-12 h-12 rounded overflow-hidden bg-[#0a0a0a] flex items-center justify-center'>
                          <img
                            src={product.image}
                            alt={product.name}
                            className='w-full h-full object-cover'
                            loading='lazy'
                          />
                        </div>
                        <div className='text-sm text-gray-200 truncate'>{product.name}</div>
                        <div className='text-xs text-gray-400'>{product.brand}</div>
                        <div className='text-xs text-gray-400'>{product.category}</div>
                        <div className='text-xs text-gucci-400'>€{product.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</div>
                        <div className='text-xs text-gucci-400'>
                          {product.originalPrice ? `€${product.originalPrice}` : '-'}
                        </div>
                        <div className='text-xs text-gucci-400'>{product.badge || '-'}</div>
                        <div className='text-xs'>{product.isNew ? 'Sì' : 'No'}</div>
                        <div className='flex gap-2'>
                          <button onClick={() => startEdit(product)} className='text-gucci-400 hover:text-white transition-colors text-xs'>
                            Modifica
                          </button>
                          <button onClick={() => handleDelete(product.id)} className='text-red-400 hover:text-red-300 transition-colors text-xs'>
                            Elimina
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    {filtered.length === 0 && (
                      <div className='text-center text-gray-500 py-12 text-sm'>Nessun prodotto trovato</div>
                    )}
                  </div>
                </>
              )}

              {productTab === 'form' && (
                <motion.div
                  key='form'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className='max-w-3xl'
                >
                  <button
                    onClick={() => { resetForm(); setProductTab('list'); }}
                    className='mb-4 px-4 py-2 border border-gucci-700/20 text-gray-400 text-xs tracking-[0.1em] uppercase rounded hover:border-gucci-600/50 transition-all'
                  >
                    ← Torna alla lista
                  </button>
                  <form onSubmit={handleSave} className='bg-[#111] border border-gucci-700/20 rounded-lg p-6 space-y-6'>
                    <h3 className='text-sm tracking-[0.1em] uppercase text-gucci-400 mb-4'>
                      {editingProduct ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
                    </h3>
                    <input type='hidden' name='id' value={editingProduct?.id || ''} />

                    <div className='flex gap-6'>
                      <div className='flex-shrink-0'>
                        <label className='block text-[10px] tracking-[0.1em] uppercase text-gray-500 mb-2'>Immagine</label>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className='w-40 h-40 rounded border border-gucci-700/20 bg-[#0a0a0a] flex items-center justify-center cursor-pointer hover:border-gucci-600/50 transition-colors overflow-hidden relative'
                        >
                          {imgPreview ? (
                            <img src={imgPreview} alt='Preview' className='w-full h-full object-cover' />
                          ) : (
                            <span className='text-gray-600 text-xs text-center px-2'>Clicca per caricare</span>
                          )}
                          <input
                            ref={fileInputRef}
                            type='file'
                            accept='image/*'
                            onChange={handleImageUpload}
                            className='hidden'
                          />
                        </div>
                        {imgFileName && (
                          <p className='text-[10px] text-gray-500 mt-2 truncate max-w-[160px]'>{imgFileName}</p>
                        )}
                        {(imgPreview || editingProduct?.image) && (
                          <button
                            type='button'
                            onClick={() => { setImgPreview(''); setImgFileName(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                            className='text-[10px] text-red-400 mt-1 underline'
                          >
                            Rimuovi immagine
                          </button>
                        )}
                      </div>

                      <div className='flex-1 space-y-4'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                          <div>
                            <label className='block text-[10px] tracking-[0.1em] uppercase text-gray-500 mb-1'>Nome</label>
                            <input
                              name='name'
                              defaultValue={editingProduct?.name || ''}
                              required
                              className='w-full px-3 py-2 bg-[#0a0a0a] border border-gucci-700/20 rounded text-gray-300 text-sm focus:outline-none focus:border-gucci-600/50'
                            />
                          </div>
                          <div>
                            <label className='block text-[10px] tracking-[0.1em] uppercase text-gray-500 mb-1'>Brand</label>
                            <select
                              name='brand'
                              defaultValue={editingProduct?.brand || 'Gucci'}
                              className='w-full px-3 py-2 bg-[#0a0a0a] border border-gucci-700/20 rounded text-gray-300 text-sm focus:outline-none focus:border-gucci-600/50'
                            >
                              {brands.map((b) => (
                                <option key={b} value={b}>{b}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className='block text-[10px] tracking-[0.1em] uppercase text-gray-500 mb-1'>Categoria</label>
                            <select
                              name='category'
                              defaultValue={editingProduct?.category || 'bags'}
                              className='w-full px-3 py-2 bg-[#0a0a0a] border border-gucci-700/20 rounded text-gray-300 text-sm focus:outline-none focus:border-gucci-600/50'
                            >
                              {customCategories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className='block text-[10px] tracking-[0.1em] uppercase text-gray-500 mb-1'>Prezzo (€)</label>
                            <input
                              name='price'
                              type='number'
                              defaultValue={editingProduct?.price || ''}
                              required
                              className='w-full px-3 py-2 bg-[#0a0a0a] border border-gucci-700/20 rounded text-gray-300 text-sm focus:outline-none focus:border-gucci-600/50'
                            />
                          </div>
                          <div>
                            <label className='block text-[10px] tracking-[0.1em] uppercase text-gray-500 mb-1'>Prezzo Originale (€)</label>
                            <input
                              name='originalPrice'
                              type='number'
                              defaultValue={editingProduct?.originalPrice || ''}
                              className='w-full px-3 py-2 bg-[#0a0a0a] border border-gucci-700/20 rounded text-gray-300 text-sm focus:outline-none focus:border-gucci-600/50'
                            />
                          </div>
                          <div>
                            <label className='block text-[10px] tracking-[0.1em] uppercase text-gray-500 mb-1'>Badge</label>
                            <input
                              name='badge'
                              defaultValue={editingProduct?.badge || ''}
                              placeholder='Es: Best Seller'
                              className='w-full px-3 py-2 bg-[#0a0a0a] border border-gucci-700/20 rounded text-gray-300 text-sm focus:outline-none focus:border-gucci-600/50'
                            />
                          </div>
                          <div className='flex items-end'>
                            <label className='flex items-center gap-3 cursor-pointer'>
                              <input
                                name='isNew'
                                type='checkbox'
                                defaultChecked={editingProduct?.isNew || false}
                                className='w-4 h-4 accent-gucci-600'
                              />
                              <span className='text-xs text-gray-400'>Nuovo Arrivo</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className='block text-[10px] tracking-[0.1em] uppercase text-gray-500 mb-1'>Descrizione</label>
                          <textarea
                            name='description'
                            defaultValue={editingProduct?.description || ''}
                            rows={3}
                            className='w-full px-3 py-2 bg-[#0a0a0a] border border-gucci-700/20 rounded text-gray-300 text-sm focus:outline-none focus:border-gucci-600/50'
                          />
                        </div>

                        {/* Fallback hidden image input for formData */}
                        <input type='hidden' name='image' value={imgPreview || editingProduct?.image || ''} />

                        <div className='flex gap-4 pt-2'>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type='submit'
                            className='px-6 py-3 bg-gradient-to-r from-gucci-700 to-gucci-600 text-white text-xs tracking-[0.1em] uppercase rounded hover:from-gucci-600 hover:to-gucci-500 transition-all duration-300 shadow-lg shadow-gucci-900/30'
                          >
                            {editingProduct ? 'Salva Modifiche' : 'Crea Prodotto'}
                          </motion.button>
                          <button
                            type='button'
                            onClick={() => { resetForm(); setProductTab('list'); }}
                            className='px-6 py-3 border border-gucci-700/20 text-gray-400 text-xs tracking-[0.1em] uppercase rounded hover:border-gucci-600/50 transition-all duration-300'
                          >
                            Annulla
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeSection === 'categories' && (
            <motion.div key='categories' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <div className='lg:col-span-2'>
                  <h3 className='text-sm tracking-[0.1em] uppercase text-gucci-400 mb-4'>Categorie</h3>
                  <div className='space-y-2'>
                    {customCategories.map((cat, index) => {
                      const usedCount = products.filter((p) => p.category === cat.id).length;
                      return (
                        <div
                          key={cat.id}
                          className='flex items-center justify-between bg-[#111] border border-gucci-700/10 rounded px-4 py-3 hover:border-gucci-600/30 transition-colors'
                        >
                          <div>
                            <div className='text-sm text-gray-200'>{cat.name}</div>
                            <div className='text-[10px] text-gray-500'>ID: {cat.id} • {usedCount} prodotti</div>
                          </div>
                          <div className='flex gap-3'>
                            <button onClick={() => handleEditCategory(index)} className='text-gucci-400 hover:text-white text-xs'>Modifica</button>
                            <button onClick={() => handleDelCategory(index)} className='text-red-400 hover:text-red-300 text-xs'>Elimina</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className='bg-[#111] border border-gucci-700/20 rounded-lg p-6'>
                  <h3 className='text-sm tracking-[0.1em] uppercase text-gucci-400 mb-4'>
                    {catEditIndex !== null ? 'Modifica Categoria' : 'Nuova Categoria'}
                  </h3>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-[10px] tracking-[0.1em] uppercase text-gray-500 mb-1'>ID (slug)</label>
                      <input
                        value={catForm.id}
                        onChange={(e) => setCatForm((prev) => ({ ...prev, id: e.target.value }))}
                        placeholder='es. bags, wallets'
                        className='w-full px-3 py-2 bg-[#0a0a0a] border border-gucci-700/20 rounded text-gray-300 text-sm focus:outline-none focus:border-gucci-600/50'
                      />
                    </div>
                    <div>
                      <label className='block text-[10px] tracking-[0.1em] uppercase text-gray-500 mb-1'>Nome</label>
                      <input
                        value={catForm.name}
                        onChange={(e) => setCatForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder='es. Borse'
                        className='w-full px-3 py-2 bg-[#0a0a0a] border border-gucci-700/20 rounded text-gray-300 text-sm focus:outline-none focus:border-gucci-600/50'
                      />
                    </div>
                    <button
                      onClick={handleSaveCategory}
                      className='w-full px-4 py-2 bg-gradient-to-r from-gucci-700 to-gucci-600 text-white text-xs tracking-[0.1em] uppercase rounded hover:from-gucci-600 hover:to-gucci-500 transition-all'
                    >
                      {catEditIndex !== null ? 'Salva Modifiche' : 'Crea Categoria'}
                    </button>
                    {catEditIndex !== null && (
                      <button
                        onClick={() => { setCatForm({ id: '', name: '' }); setCatEditIndex(null); }}
                        className='w-full px-4 py-2 border border-gucci-700/20 text-gray-400 text-xs tracking-[0.1em] uppercase rounded hover:border-gucci-600/50 transition-all'
                      >
                        Annulla
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
