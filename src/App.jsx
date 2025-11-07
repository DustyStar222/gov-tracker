import React, { useState, useEffect, useMemo } from 'react';
import AdminPanel from './components/AdminPanel';
import DetailModal from './components/DetailModal';
import SummaryCard from './components/SummaryCard';
import PromiseCard from './components/PromiseCard';
import { supabase } from './supabaseClient';
import { STATUS_OPTIONS, STATUS_COLORS } from './constants';

const ADMIN_PASSWORD = 'govtrack2025';

export default function App() {
  const [promises, setPromises] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loginMode, setLoginMode] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from('promises')
        .select('*')
        .order('id', { ascending: true });
      if (error) console.error('Error fetching promises:', error);
      else setPromises(data);
    }
    loadData();
  }, []);

  const categories = useMemo(() => ['All', ...new Set(promises.map(p => p.category))], [promises]);

  const counts = useMemo(() => {
    const c = { 'Kept': 0, 'In Progress': 0, 'Broken': 0, 'Not Started': 0 };
    promises.forEach(p => { if (c[p.status] !== undefined) c[p.status] += 1; });
    return c;
  }, [promises]);

  const filtered = useMemo(() => {
    return promises.filter(p => {
      if (filterCategory !== 'All' && p.category !== filterCategory) return false;
      if (!search.trim()) return true;
      const s = search.toLowerCase();
      return p.text.toLowerCase().includes(s)
        || p.category.toLowerCase().includes(s)
        || (p.source && p.source.toLowerCase().includes(s));
    });
  }, [promises, search, filterCategory]);

  async function savePromise(data) {
    if (data.id) {
      const { error } = await supabase.from('promises')
        .update({
          text: data.text,
          category: data.category,
          source: data.source,
          status: data.status,
          last_updated: data.lastUpdated,
          updates: data.updates
        })
        .eq('id', data.id);
      if (error) console.error('Update error:', error);
      else setPromises(prev => prev.map(p => p.id === data.id ? data : p));
    } else {
      const { data: newRows, error } = await supabase.from('promises')
        .insert([{
          text: data.text,
          category: data.category,
          source: data.source,
          status: data.status,
          last_updated: data.lastUpdated,
          updates: data.updates
        }])
        .select();
      if (error) console.error('Insert error:', error);
      else setPromises(prev => [...prev, newRows[0]]);
    }
    setEditItem(null);
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('promises').delete().eq('id', id);
    if (error) console.error('Delete error:', error);
    else setPromises(prev => prev.filter(p => p.id !== id));
  }

  function handleLogin(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAdminMode(true);
      setLoginMode(false);
      setPassword('');
      setLoginError('');
    } else {
      setLoginError('Incorrect password.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full shadow">
              <svg
                className="w-8 h-8 text-emerald-500 dark:text-emerald-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l3 3 5-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                Newfoundland & Labrador Platform Tracking
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1 font-medium">
                Keeping NL Governments Accountable
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-3 text-sm font-medium">
            {!adminMode && !loginMode && (
              <button
                onClick={() => setLoginMode(true)}
                className="px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-200 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900 transition"
              >
                Admin Login
              </button>
            )}
            {adminMode && (
              <button
                onClick={() => setAdminMode(false)}
                className="px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-200 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition"
              >
                Exit Admin
              </button>
            )}
          </nav>
        </div>
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-400"></div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {!adminMode && !loginMode && (
          <>
            {/* SUMMARY + SEARCH */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="md:col-span-3 bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-medium mb-2">Campaign Promise Tracker</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {STATUS_OPTIONS.map(st => (
                    <SummaryCard key={st} label={st} value={counts[st]} className={STATUS_COLORS[st]} />
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full p-2 border rounded mb-3"
                />
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {categories.map(c => (<option key={c}>{c}</option>))}
                </select>
              </div>
            </section>

            {/* PROMISES LIST + PROGRESS CHARTS */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                {filtered.map(p => (
                  <PromiseCard key={p.id} p={p} onClick={() => setSelected(p)} />
                ))}
              </div>

              {/* Progress Charts */}
              <aside className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  {/* Progress by Status */}
                  <h4 className="text-sm font-medium mb-4">Progress by Status</h4>
                  <div className="space-y-3 mb-8">
                    {STATUS_OPTIONS.map(status => (
                      <div key={status}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-gray-700">{status}</span>
                          <span className="text-gray-500">{counts[status] || 0}</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded overflow-hidden">
                          <div
                            className={`${STATUS_COLORS[status]} h-3 transition-all duration-300`}
                            style={{ width: `${(counts[status] / (promises.length || 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress by Category */}
                  <h4 className="text-sm font-medium mb-4">Progress by Category</h4>
                  {(() => {
                    const grouped = promises.reduce((acc, p) => {
                      if (!acc[p.category]) acc[p.category] = { 'Kept': 0, 'In Progress': 0, 'Broken': 0, 'Not Started': 0 };
                      acc[p.category][p.status]++;
                      return acc;
                    }, {});

                    return Object.entries(grouped).map(([category, statuses]) => {
                      const total = Object.values(statuses).reduce((a, b) => a + b, 0);
                      return (
                        <div key={category} className="mb-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-700">{category}</span>
                            <span className="text-gray-500">{total} total</span>
                          </div>
                          <div className="flex w-full h-3 rounded overflow-hidden">
                            {STATUS_OPTIONS.map(status => {
                              const width = (statuses[status] / total) * 100 || 0;
                              return (
                                <div
                                  key={status}
                                  className={`${STATUS_COLORS[status]} transition-all duration-300`}
                                  style={{ width: `${width}%` }}
                                  title={`${status}: ${statuses[status]}`}
                                ></div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    });
                  })()}

                  {promises.length === 0 && (
                    <p className="text-sm text-gray-500">No data yet — add some promises to see progress visualizations.</p>
                  )}
                </div>
              </aside>
            </section>
          </>
        )}

        {loginMode && (
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full p-2 border rounded"
              />
              {loginError && <div className="text-red-600 text-sm">{loginError}</div>}
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded">Login</button>
                <button type="button" onClick={() => { setLoginMode(false); setPassword(''); }} className="text-sm underline">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {adminMode && (
          <AdminPanel
            promises={promises}
            onEdit={setEditItem}
            onDelete={handleDelete}
            onSave={savePromise}
            editItem={editItem}
            onCancel={() => setEditItem(null)}
          />
        )}
      </main>

      {selected && <DetailModal selected={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
