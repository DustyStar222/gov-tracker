import React, { useState, useEffect } from 'react';
import { STATUS_OPTIONS } from '../App'; // make sure STATUS_OPTIONS is exported from App.jsx

export default function AdminPanel({ promises, onEdit, onDelete, onSave, editItem, onCancel }) {
  const [form, setForm] = useState(editItem || { text: '', category: '', source: '', status: 'Not Started', lastUpdated: new Date().toISOString().slice(0,10), updates: [] });
  const [newUpdate, setNewUpdate] = useState('');

  useEffect(() => {
    if (editItem) setForm(editItem);
  }, [editItem]);

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
    setForm({ text: '', category: '', source: '', status: 'Not Started', lastUpdated: new Date().toISOString().slice(0,10), updates: [] });
    setNewUpdate('');
  }

  function addUpdate() {
    if(newUpdate.trim()) {
      setForm({
        ...form,
        updates: [...(form.updates || []), { date: new Date().toISOString().slice(0,10), note: newUpdate }],
      });
      setNewUpdate('');
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={form.text} onChange={e=>setForm({...form, text:e.target.value})} placeholder="Promise text" className="w-full p-2 border rounded" required />
          <input value={form.category} onChange={e=>setForm({...form, category:e.target.value})} placeholder="Category" className="w-full p-2 border rounded" required />
          <input value={form.source} onChange={e=>setForm({...form, source:e.target.value})} placeholder="Source" className="w-full p-2 border rounded" />

          <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} className="w-full p-2 border rounded">
            {STATUS_OPTIONS.map(s=>(<option key={s}>{s}</option>))}
          </select>

          {/* Add Updates */}
          <div className="space-y-2">
            <textarea
              value={newUpdate}
              onChange={e=>setNewUpdate(e.target.value)}
              placeholder="Add an update note..."
              className="w-full p-2 border rounded"
            />
            <button type="button" onClick={addUpdate} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
              Add Update
            </button>
          </div>

          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
            {editItem ? 'Save Changes' : 'Add Promise'}
          </button>
          {editItem && <button type="button" onClick={onCancel} className="ml-2 text-sm underline">Cancel Edit</button>}
        </form>

        {/* Existing Promises */}
        <div>
          <h3 className="text-sm font-medium mb-2">Existing Promises</h3>
          <ul className="space-y-2 max-h-[60vh] overflow-auto">
            {promises.map(p => (
              <li key={p.id} className="flex justify-between bg-gray-50 p-2 rounded">
                <div className="text-sm">{p.text}</div>
                <div className="space-x-2 text-xs">
                  <button onClick={()=>onEdit(p)} className="text-blue-600">Edit</button>
                  <button onClick={()=>onDelete(p.id)} className="text-red-600">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
