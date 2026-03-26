export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-8 h-8 flex items-center justify-center">
        {/* Background glow */}
        <div className="absolute inset-0 bg-cyan/20 rounded-xl blur-md"></div>
        {/* Main shape */}
        <div className="relative w-full h-full bg-gradient-to-br from-cyan to-blue-500 rounded-xl flex items-center justify-center shadow-cyan">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="w-5 h-5 text-white"
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>
      <span className="text-cyan font-bold text-lg tracking-wider whitespace-nowrap">随喜商城</span>
    </div>
  );
}
