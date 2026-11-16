import { Phone, Users, Check } from 'lucide-react';
import type { Lifeline } from '@/lib/game';

export function LifelinePanel({ used, disabled, onUse }: { used:Lifeline[]; disabled:boolean; onUse:(kind:Lifeline)=>void }) {
  const items: {kind:Lifeline;title:string;icon:React.ReactNode;key:string}[] = [
    {kind:'fifty',title:'Loại 2 đáp án sai',icon:<b>50:50</b>,key:'1'},
    {kind:'audience',title:'Hỏi khán giả',icon:<Users size={24}/>,key:'2'},
    {kind:'expert',title:'Hỏi chuyên gia',icon:<Phone size={23}/>,key:'3'},
  ];
  return <section className="lifeline-panel"><div className="panel-heading"><h2>QUYỀN TRỢ GIÚP</h2><span>Mỗi quyền 1 lần</span></div>
    <div className="lifelines">{items.map(item=><button key={item.kind} className={used.includes(item.kind)?'lifeline-used':''} disabled={disabled||used.includes(item.kind)} onClick={()=>onUse(item.kind)} aria-label={`${item.title}${used.includes(item.kind)?' · Đã sử dụng':''}`} title={`${item.title} (phím ${item.key})`}>
      <span className="lifeline-icon">{item.icon}{used.includes(item.kind)&&<Check className="used-check" size={14}/>}</span><span>{item.kind==='fifty'?'50:50':item.kind==='audience'?'Khán giả':'Chuyên gia'}</span>
    </button>)}</div>
  </section>;
}
