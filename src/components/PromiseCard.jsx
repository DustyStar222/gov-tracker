import React from 'react'
const STATUS_COLORS = { 'Kept':'bg-green-100 text-green-800','In Progress':'bg-yellow-100 text-yellow-800','Broken':'bg-red-100 text-red-800','Not Started':'bg-gray-100 text-gray-800'}
export default function PromiseCard({ p, onClick }){
return (
<article onClick={onClick} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer">
<div className="flex justify-between items-start">
<div className="text-sm font-medium">{p.text}</div>
<div className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[p.status]||'bg-gray-100'}`}>{p.status}</div>
</div>
<div className="mt-2 text-xs text-gray-500">{p.category}</div>
</article>
)
}