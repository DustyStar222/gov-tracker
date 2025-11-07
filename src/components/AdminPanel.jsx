import React, { useState, useEffect } from 'react';

export default function AdminPanel({ promises, onEdit, onDelete, onSave, editItem, onCancel }) {
  const [form, setForm] = useState({
    text: '',
    category: '',
    source: '',
    status: 'Not Started',
    lastUpdated: '',
    updates: ''
  });

  // Update form when editItem changes
  useEffect(() => {
    if (editItem) {
      setForm({
        text: editItem.text || '',
        category: editItem.category || '',
        source: editItem.source || '',
        status: editItem.status || 'Not Started',
        lastUpdated: editItem.last_updated || '',
        updates: editItem.updates || ''
      });
    } else {
      setForm({
        text: '',
        category: '',
        source: '',
        status: 'Not Started',
        lastUpdated: '',
        updates: ''
      });
    }
  }, [editItem]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const dataToSave = editItem ? { ...editItem, ...form } : form;
    onSave(dataToSave);
  };

  return (
    <div className="space-y-6">
      {/* PROMISE LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {promises.length > 0 ? (
          promises.map(p => (
            <div key={p.id} className="bg-white rounded-lg p-4 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{p.text}</h3>
                <p className="text-sm text-gray-500">{p.category}</p>
                <p className="text-sm text-gray-500">{p.source}</p>
                <p className="text-sm mt-1">
                  Status: <span className="font-semibold">{p.status}</span>
                </p>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => onEdit(p)}
                  className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No promises found.</p>
        )}
      </div>

      {/* ALWAYS SHOW ADD / EDIT PROMISE FORM */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">{editItem ? 'Edit Promise' : 'Add Promise'}</h2>
        <div className="space-y-3">
          <textarea
            value={form.text}
            onChange={e => handleChange('text', e.target.value)}
            placeholder="Promise text"
            className="w-full p-2 border rounded resize-none"
            rows={3}
          />
          <input
            value={form.category}
            onChange={e => handleChange('category', e.target.value)}
            placeholder="Category"
            className="w-full p-2 border rounded"
          />
          <input
            value={form.source}
            onChange={e => handleChange('source', e.target.value)}
            placeholder="Source/Link"
            className="w-full p-2 border rounded"
          />
          <textarea
            value={form.updates}
            onChange={e => handleChange('updates', e.target.value)}
            placeholder="Updates / Notes"
            className="w-full p-2 border rounded resize-none"
            rows={2}
          />
          <select
            value={form.status}
            onChange={e => handleChange('status', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option>Kept</option>
            <option>In Progress</option>
            <option>Broken</option>
            <option>Not Started</option>
          </select>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            >
              Save
            </button>
            {editItem && (
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
