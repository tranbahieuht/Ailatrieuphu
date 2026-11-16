export function Emblem({ compact = false }: { compact?: boolean }) {
  return <div className={`emblem ${compact ? 'emblem-compact' : ''}`} aria-label="Ai là triệu phú">
    <div className="emblem-orbit orbit-one" /><div className="emblem-orbit orbit-two" />
    <svg className="emblem-art" viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <linearGradient id={compact ? 'gold-small' : 'gold'} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff1b2"/><stop offset=".45" stopColor="#c28b36"/><stop offset=".7" stopColor="#f4db8b"/><stop offset="1" stopColor="#916025"/></linearGradient>
      </defs>
      <circle cx="200" cy="200" r="170" fill="#07152d" stroke={`url(#${compact ? 'gold-small' : 'gold'})`} strokeWidth="2"/>
      <circle cx="200" cy="200" r="155" fill="none" stroke="#d9b869" strokeWidth=".6"/>
      <circle cx="200" cy="200" r="145" fill="none" stroke="#497ab5" strokeWidth="1" strokeDasharray="2 6"/>
      {Array.from({length: 48}, (_, i) => <g key={i} transform={`rotate(${i * 7.5} 200 200)`}><path d="M200 37 L197 47 L200 52 L203 47 Z" fill={i % 4 === 0 ? '#ecd08e' : '#8b753e'}/></g>)}
      <path d="M72 183 Q87 113 149 95 M328 183 Q313 113 251 95 M72 217 Q87 287 149 305 M328 217 Q313 287 251 305" fill="none" stroke="#d9bb72" strokeWidth="2"/>
      {[0,1,2,3,4].map(i => <g key={i} transform={`rotate(${i * 12 - 24} 200 200)`}><path d="M97 148 Q72 127 88 111 Q108 125 97 148 M303 148 Q328 127 312 111 Q292 125 303 148" fill="#ac8b49" opacity=".65"/></g>)}
      <path d="M147 108 H185 L200 93 L215 108 H253 M147 292 H185 L200 307 L215 292 H253" stroke="#e4c984" fill="none"/>
      <path d="M179 122 L200 113 L221 122 M179 278 L200 287 L221 278" stroke="#5689bf" fill="none"/>
    </svg>
    <div className="emblem-type"><span>AI LÀ</span><strong>TRIỆU PHÚ</strong><i /><small>CHINH PHỤC TRI THỨC</small></div>
  </div>;
}
