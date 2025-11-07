import React from 'react';
import { STATUS_COLORS } from "../constants";

export default function DetailModal({ selected, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white max-w-3xl w-full rounded-lg shadow-lg overflow-auto max-h-[90vh]">
        <div className="flex justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">{selected.text}</h3>
          <button onClick={onClose} className="text-sm text-gray-500 hover:underline">
            Close
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[selected.status]}`}>
            {selected.status}
          </div>
          <p className="text-sm">Category: {selected.category}</p>
          <p className="text-sm text-gray-600">Source: {selected.source}</p>
          <p className="text-xs text-gray-500">Last updated: {selected.lastUpdated}</p>

          {/* Updates Section */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-2">Updates</h4>
            {selected.updates?.length > 0 ? (
              <ul className="space-y-2 max-h-40 overflow-auto border rounded p-2 bg-gray-50">
                {selected.updates.map((u, idx) => (
                  <li key={idx} className="text-xs">
                    <span className="font-medium">{u.date}:</span> {u.note}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-500">No updates yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
