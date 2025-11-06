import React from 'react'
export default function SummaryCard({ label, value, className }){
return (
<div className="inline-flex items-center gap-3 p-3 rounded-lg border">
<div className={`p-2 rounded-full ${className}`}></div>
<div>
<div className="text-xs text-gray-500">{label}</div>
<div className="text-lg font-semibold">{value}</div>
</div>
</div>
)
}