import { useState, useEffect, useRef } from "react";

// ── SUPABASE ──────────────────────────────────────────────────────────────────
const SUPA_URL = "https://wfgcffmgzqvxmtybdvse.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZ2NmZm1nenF2eG10eWJkdnNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyOTU2ODksImV4cCI6MjA5MDg3MTY4OX0.WHjwEhIlNRg7fiKo_atNhPp17sugrE_ipok8uYs_EbY";

async function db(table, method="GET", body=null, query="") {
  const url = `${SUPA_URL}/rest/v1/${table}${query}`;
  const headers = {
    "Content-Type": "application/json",
    "apikey": SUPA_KEY,
    "Authorization": `Bearer ${SUPA_KEY}`,
  };
  if (method === "POST") headers["Prefer"] = "return=representation";
  if (method === "PATCH") headers["Prefer"] = "return=representation";
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : null });
  if (!res.ok) { const e = await res.text(); throw new Error(e); }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── DESIGN SYSTEM ────────────────────────────────────────────────────────────
// Aesthetic: Luxury nautical instruments. Deep slate surfaces, warm brass
// accents, editorial typography (Cormorant + DM Mono), razor-thin lines.
// ─────────────────────────────────────────────────────────────────────────────

const T = {
  bg:       "#F7F6F3",
  surface:  "#FFFFFF",
  surfaceUp:"#F2F3F5",
  rim:      "#E4E6EC",
  rimHi:    "rgba(11,31,58,0.07)",
  ink:      "#0D1B2A",
  inkMid:   "#3D5068",
  inkDim:   "#8A9BB5",
  brass:    "#B08D57",
  brassLt:  "#C9A96E",
  brassDim: "rgba(176,141,87,0.10)",
  ok:       "#2A7A52",
  warn:     "#B06A18",
  danger:   "#A83428",
  info:     "#1B4F8A",
  line:     "rgba(11,31,58,0.06)",
  lineHi:   "rgba(11,31,58,0.11)",
  // Sidebar
  sidebarBg:   "#0D1B2A",
  sidebarSurf: "#162940",
  sidebarLine: "rgba(255,255,255,0.07)",
  sidebarInk:  "rgba(255,255,255,0.92)",
  sidebarDim:  "rgba(255,255,255,0.40)",
};

const NAV = [
  { id:"dashboard",     svg:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label:"Panel"       },
  { id:"ficha",         svg:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", label:"Barco"       },
  { id:"bitacora",      svg:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label:"Bitácora"    },
  { id:"mantenimiento", svg:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", label:"Mant."       },
  { id:"combustible",   svg:"M4 14s0-4 5-4 5 4 5 4 M9 10V5a2 2 0 114 0v5 M8 21h8 M12 17v4", label:"Combustible" },
  { id:"seguridad",     svg:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label:"Seguridad"   },
  { id:"puertos",       svg:"M13 2L3 14h9l-1 8 10-12h-9l1-8z", label:"Puertos"     },
  { id:"inventario",    svg:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2 M9 12h6 M9 16h4", label:"Inventario"  },
  { id:"documentos",    svg:"M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z M12 3v6h6", label:"Docs"        },
  { id:"tripulacion",   svg:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75", label:"Tripulación"  },
  { id:"ia",            svg:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", label:"IA"           },
  { id:"clima",         svg:"M12 3v1 M12 20v1 M4.22 4.22l.7.7 M18.36 18.36l.7.7 M1 12h1 M21 12h1 M4.22 19.78l.7-.7 M18.36 5.64l.7-.7 M12 6a6 6 0 100 12 6 6 0 000-12z", label:"Clima"        },
  { id:"calculadora",   svg:"M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z M8 7h2 M14 7h2 M8 11h2 M14 11h2 M8 15h2 M14 15h4", label:"Ruta"         },
  { id:"fondeo",        svg:"M12 2a3 3 0 100 6 3 3 0 000-6z M12 8v14 M5 11s2 2 7 2 7-2 7-2", label:"Fondeo"       },
];

const BOAT = {
  nombre:"Leonidas", matricula:"7ª PM-1-231-25", bandera:"España",
  eslora:"16.21 m", manga:"4.54 m", calado:"--", año:"2007",
  reforma:"Electrónica y confort (reciente)", astillero:"Sunseeker Portofino 53",
  nib:"500496", casco:"GB-XSK03858B707", homologacion:"CE-258-06",
  motores:"2× MAN D28 MCR", cv:"2× 588 kW (≈ 800 CV c/u)", horas:774,
  zona:"Restringida 12 mn · hasta obtención L.E.B.",
  base:"Puerto de Caleta de Vélez",
  electronica:"Garmin chartplotter · AIS · Piloto automático · Sistema de sonido",
  propietario:"Florido Álvarez, Carmen",
  permiso:"15/12/2030",
  seguro:"Pendiente añadir", seguroVence:"--",
  itv:"Cert. Navegabilidad · 04/12/2025", itvVence:"Según certificado vigente",
};
const BITACORA = [];
const MANTENIMIENTO = [
  { id:1, tipo:"Cambio aceite · Motor Estribor", estado:"ok", fUlt:"Pendiente", fProx:"--", hInt:250, hAct:774, hUlt:600, notas:"MAN D2848 LE423 · aceite recomendado", coste:0 },
  { id:2, tipo:"Cambio aceite · Motor Babor",    estado:"ok", fUlt:"Pendiente", fProx:"--", hInt:250, hAct:774, hUlt:600, notas:"MAN D2848 LE423 · aceite recomendado", coste:0 },
  { id:3, tipo:"Filtros combustible (×2)",       estado:"ok", fUlt:"Pendiente", fProx:"--", hInt:500, hAct:774, hUlt:500, notas:"Revisar cada 500h o anualmente", coste:0 },
  { id:4, tipo:"Impelentes bomba agua (×2)",     estado:"ok", fUlt:"Pendiente", fProx:"--", hInt:300, hAct:774, hUlt:600, notas:"Anual obligatorio -- crítico en MAN", coste:0 },
  { id:5, tipo:"Ánodos / cátodos zinc",          estado:"ok", fUlt:"Pendiente", fProx:"--", hInt:null, notas:"Varada anual -- hélices y bocinas", coste:0 },
  { id:6, tipo:"Revisión ITV náutica",           estado:"ok", fUlt:"Pendiente", fProx:"--", hInt:null, notas:"Pendiente añadir fecha", coste:0 },
];
const AVERIAS = [];
const COMBUSTIBLE = [];
const SEGURIDAD = [
  { id:1, eq:"Bengalas · 6 uds", cad:"01 Ago 2025", estado:"ok", ub:"Compartimento popa" },
  { id:2, eq:"Extintor CO₂ 2kg", cad:"01 Ene 2026", estado:"ok", ub:"Cabina" },
  { id:3, eq:"Balsa salvavidas 6p", cad:"15 Jun 2025", estado:"warn", ub:"Coffin popa" },
  { id:4, eq:"Botiquín náutico", cad:"01 May 2025", estado:"warn", ub:"Camarote proa" },
  { id:5, eq:"EPIRB 406 MHz", cad:"01 Mar 2027", estado:"ok", ub:"Bañera" },
  { id:6, eq:"Arneses · 4 uds", cad:null, estado:"ok", ub:"Armario proa" },
  { id:7, eq:"Chalecos · 8 uds", cad:null, estado:"ok", ub:"Bodega proa" },
];
const PUERTOS = [
  { id:1, nombre:"Pto. Deportivo Marbella", tipo:"Base", amarre:"B-22", precio:380, tel:"+34 952 772 000", val:4.5, notas:"Base habitual. Ducha, wifi y agua incluidos." },
  { id:2, nombre:"Puerto de Estepona", tipo:"Visitado", precio:45, tel:"+34 952 799 064", val:4.0, notas:"Bien protegido, buen precio." },
  { id:3, nombre:"Puerto de Gibraltar", tipo:"Visitado", precio:90, tel:"+350 200 78071", val:3.5, notas:"Trámites de entrada. Gasoil muy barato." },
];
const INVENTARIO = [
  { id:1, cat:"Motor", art:"Filtro aceite Volvo 3840525", qty:2, min:1, estado:"ok" },
  { id:2, cat:"Motor", art:"Impelente bomba agua", qty:0, min:1, estado:"danger" },
  { id:3, cat:"Motor", art:"Aceite Castrol 15W-40 · 5L", qty:5, min:3, estado:"ok" },
  { id:4, cat:"Electricidad", art:"Fusibles varios (kit)", qty:1, min:1, estado:"ok" },
  { id:5, cat:"Electricidad", art:"Bombillas nav. LED", qty:4, min:2, estado:"ok" },
  { id:6, cat:"Limpieza", art:"Teak cleaner · L", qty:0, min:1, estado:"warn" },
  { id:7, cat:"Seguridad", art:"Bengalas sustitución", qty:0, min:6, estado:"danger" },
];
const PATRONES = [
  { id:1, nombre:"Salvador Álvarez Escobar", rol:"Patrón", tit:"Patrón de Yate", tel:"--", av:"VA", salidas:0, millas:0, hue:T.info },
  { id:2, nombre:"Guillermo J. Hurtado de Mendoza", rol:"Patrón", tit:"PER", tel:"--", av:"GU", salidas:0, millas:0, hue:T.brass },
];

// ── PRIMITIVES ────────────────────────────────────────────────────────────────
function Icon({ d, size=18, color=T.inkDim, sw=1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {d.split(" M").map((seg,i) => <path key={i} d={i===0?seg:"M"+seg} />)}
    </svg>
  );
}

function Signal({ estado }) {
  const cfg = {
    ok:       { c:T.ok,     l:"OK"        },
    warn:     { c:T.warn,   l:"Atención"  },
    danger:   { c:T.danger, l:"Vencido"   },
    info:     { c:T.info,   l:"Info"      },
    pendiente:{ c:T.warn,   l:"Pendiente" },
    reparado: { c:T.ok,     l:"OK"        },
    bajo:     { c:T.warn,   l:"Stock bajo"},
  };
  const s = cfg[estado] || { c:T.inkDim, l:estado };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5,
      background:s.c+"15", border:`0.5px solid ${s.c}35`, color:s.c,
      borderRadius:6, padding:"3px 8px", fontSize:10, fontWeight:500,
      whiteSpace:"nowrap" }}>
      <span style={{ width:5, height:5, borderRadius:"50%",
        background:s.c, display:"inline-block" }}/>
      {s.l}
    </span>
  );
}

function Card({ children, style={}, pad="16px 18px" }) {
  return (
    <div style={{ background:T.surface, border:`0.5px solid ${T.rim}`,
      borderRadius:12, padding:pad, ...style }}>
      {children}
    </div>
  );
}

function Hdr({ title, action }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between",
      alignItems:"center", marginBottom:20 }}>
      <div style={{ fontSize:22, fontWeight:500, color:T.ink,
        letterSpacing:-0.3, lineHeight:1 }}>{title}</div>
      {action}
    </div>
  );
}

function Divider() {
  return <div style={{ height:"0.5px", background:T.rim, margin:"0 -1px" }}/>;
}

function Row({ label, value, accent }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between",
      alignItems:"center", padding:"11px 0" }}>
      <span style={{ color:T.inkDim, fontSize:13 }}>{label}</span>
      <span style={{ color:accent||T.ink, fontSize:13, fontWeight:500,
        textAlign:"right", maxWidth:"60%" }}>{value}</span>
    </div>
  );
}

function FInput({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <div style={{ marginBottom:12 }}>
      {label && <div style={{ fontSize:11, color:T.inkDim, marginBottom:5,
        fontWeight:500 }}>{label}</div>}
      <input type={type} value={value} onChange={onChange}
        placeholder={placeholder}
        style={{ width:"100%", background:T.surfaceUp, border:`0.5px solid ${T.rim}`,
          borderRadius:10, padding:"11px 13px", color:T.ink, fontSize:14,
          fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}/>
    </div>
  );
}

function FSelect({ label, value, onChange, options=[] }) {
  return (
    <div style={{ marginBottom:12 }}>
      {label && <div style={{ fontSize:11, color:T.inkDim, marginBottom:5,
        fontWeight:500 }}>{label}</div>}
      <select value={value} onChange={onChange}
        style={{ width:"100%", background:T.surfaceUp, border:`0.5px solid ${T.rim}`,
          borderRadius:10, padding:"11px 13px", color:T.ink, fontSize:14,
          fontFamily:"inherit", outline:"none", appearance:"none", boxSizing:"border-box" }}>
        {options.map(o=><option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function FTextarea({ label, value, onChange, placeholder="", rows=3 }) {
  return (
    <div style={{ marginBottom:12 }}>
      {label && <div style={{ fontSize:11, color:T.inkDim, marginBottom:5,
        fontWeight:500 }}>{label}</div>}
      <textarea value={value} onChange={onChange} rows={rows}
        placeholder={placeholder}
        style={{ width:"100%", background:T.surfaceUp, border:`0.5px solid ${T.rim}`,
          borderRadius:10, padding:"11px 13px", color:T.ink, fontSize:14,
          fontFamily:"inherit", outline:"none", resize:"vertical",
          boxSizing:"border-box" }}/>
    </div>
  );
}

function PatronSelect({ value, onChange }) {
  return (
    <FSelect label="Patrón" value={value} onChange={onChange}
      options={["Guille","Varo"]}/>
  );
}

function Btn({ children, onClick, variant="primary", sm }) {
  const base = {
    border:"none", borderRadius:10, cursor:"pointer",
    fontSize:sm?12:13, fontWeight:500, fontFamily:"inherit",
    padding:sm?"8px 14px":"12px 20px",
    transition:"opacity 0.15s",
  };
  const styles = {
    primary: { background:T.ink, color:"#fff" },
    ghost:   { background:"transparent", color:T.inkMid,
               border:`0.5px solid ${T.rim}` },
    danger:  { background:"transparent", color:T.danger,
               border:`0.5px solid ${T.danger}50` },
  };
  return (
    <button onClick={onClick}
      style={{...base,...(styles[variant]||styles.primary)}}>
      {children}
    </button>
  );
}

function Chip({ children, color }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center",
      padding:"3px 9px", borderRadius:20, fontSize:10, fontWeight:500,
      background:(color||T.warn)+"14", color:color||T.warn }}>
      {children}
    </span>
  );
}

function StatusDot({ estado }) {
  const c = estado==="ok"?T.ok:estado==="danger"?T.danger:T.warn;
  return (
    <div style={{ width:8, height:8, borderRadius:"50%",
      background:c, flexShrink:0 }}/>
  );
}

// ── APP LOGO — Brújula brandbook Ship Log ─────────────────────────────────────
function AppLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Fondo redondeado */}
      <rect width="100" height="100" rx="22" fill="#0B1F3A"/>
      {/* Círculo exterior */}
      <circle cx="50" cy="50" r="34" stroke="white" strokeWidth="2.5" fill="none"/>
      {/* Marcas N/S/E/O */}
      <line x1="50" y1="14" x2="50" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="50" y1="80" x2="50" y2="86" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="14" y1="50" x2="20" y2="50" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="80" y1="50" x2="86" y2="50" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Aguja Norte — dorada */}
      <polygon points="50,20 44,52 50,48 56,52" fill="#B08D57"/>
      {/* Aguja Sur — blanca */}
      <polygon points="50,80 44,48 50,52 56,48" fill="rgba(255,255,255,0.5)"/>
      {/* Punto central */}
      <circle cx="50" cy="50" r="4" fill="#B08D57"/>
    </svg>
  );
}


// Mini weather widget for dashboard
function DashboardWeather({ setScreen }) {
  const [wx, setWx] = useState(null);
  useEffect(() => {
    async function load() {
      try {
        const [mr, wr] = await Promise.all([
          fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${CALETA.lat}&longitude=${CALETA.lon}&current=wave_height&timezone=Europe%2FMadrid`),
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${CALETA.lat}&longitude=${CALETA.lon}&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=kn&timezone=Europe%2FMadrid`)
        ]);
        const [md, wd] = await Promise.all([mr.json(), wr.json()]);
        const wind = Math.round(wd.current.wind_speed_10m);
        const wave = md.current.wave_height;
        const dir  = degToCompass(wd.current.wind_direction_10m);
        setWx({ wind, wave, dir, sem: semaforo(wind, wave||0) });
      } catch(e) { /* silent fail */ }
    }
    load();
  }, []);

  if (!wx) return null;
  const sc = wx.sem.level==="ok"?T.ok:wx.sem.level==="warn"?T.warn:T.danger;
  return (
    <div onClick={()=>setScreen("clima")} style={{
      background: sc+"15", border:`1px solid ${sc}40`,
      borderRadius:10, padding:"13px 18px", marginBottom:16,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      cursor:"pointer", boxShadow:`0 1px 4px ${sc}20` }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:9, height:9, borderRadius:"50%", background:sc,
          boxShadow:`0 0 8px ${sc}`, flexShrink:0 }}/>
        <div>
          <div style={{ color:sc, fontSize:12.5, fontWeight:600 }}>{wx.sem.label}</div>
          <div style={{ color:T.inkDim, fontSize:10, marginTop:2,
            fontFamily:"'DM Mono',monospace" }}>
            {wx.wind}kn del {wx.dir} · Ola {wx.wave?.toFixed(1)??"--"}m · {wx.lugar||"Caleta de Vélez"}
          </div>
        </div>
      </div>
      <span style={{ color:T.inkDim, fontSize:14 }}>›</span>
    </div>
  );
}


function Dashboard({ setScreen }) {
  const [stats, setStats] = useState({ horas:"--", millas:"--", ultimoRepo:"--" });
  const [ultimaBitacora, setUltimaBitacora] = useState(null);

  useEffect(()=>{
    async function cargarStats() {
      try {
        const [ultimaBit, ultimoRepo, todasBits] = await Promise.all([
          db("bitacora","GET",null,"?order=fecha.desc&limit=1"),
          db("combustible","GET",null,"?order=fecha.desc&limit=1"),
          db("bitacora","GET",null,"?select=millas,horas_motor_inicio,horas_motor_fin"),
        ]);

        // Millas totales -- suma de todas las entradas
        const totalMillas = todasBits.reduce((a,c) => a + (parseFloat(c.millas)||0), 0);

        // Horas motor -- base 774h + horas navegadas registradas en bitácora
        const HORAS_BASE = 774;
        const horasNavegadas = todasBits.reduce((a,c) => {
          const ini = parseFloat(c.horas_motor_inicio) || 0;
          const fin = parseFloat(c.horas_motor_fin) || 0;
          return a + (fin > ini ? fin - ini : 0);
        }, 0);
        const totalHoras = HORAS_BASE + horasNavegadas;

        if (ultimaBit.length) setUltimaBitacora(ultimaBit[0]);
        setStats({
          horas: totalHoras % 1 === 0 ? totalHoras : totalHoras.toFixed(1),
          millas: totalMillas.toFixed(0),
          ultimoRepo: ultimoRepo.length
            ? `${ultimoRepo[0].litros}L · ${ultimoRepo[0].fecha}`
            : "Sin datos",
        });
      } catch(e){ console.error("cargarStats:", e); }
    }
    cargarStats();
  },[]);

  const [combustibleAlert, setCombustibleAlert] = useState(null);
  const [mantAlert, setMantAlert] = useState(null);
  const [averiasAlert, setAveriasAlert] = useState([]);
  const [docsAlert, setDocsAlert] = useState([]);

  useEffect(()=>{
    async function checkMantenimiento() {
      try {
        const [tareas, bits] = await Promise.all([
          db("mantenimiento","GET",null,"?select=tipo,horas_intervalo,horas_ultima,intervalo_dias,fecha_ultima"),
          db("bitacora","GET",null,"?select=horas_motor_inicio,horas_motor_fin"),
        ]);
        const horasNav = bits.reduce((a,b)=>{
          const ini=parseFloat(b.horas_motor_inicio)||0, fin=parseFloat(b.horas_motor_fin)||0;
          return a+(fin>ini?fin-ini:0);
        },0);
        const hAct = 774 + horasNav;
        const hoy = new Date();
        let vencidas=0, proximas=0;
        tareas.forEach(t=>{
          let danger=false, warn=false;
          if (t.horas_intervalo && t.horas_ultima) {
            const r = t.horas_intervalo-(hAct-parseFloat(t.horas_ultima));
            if (r<=0) danger=true; else if (r<=t.horas_intervalo*0.2) warn=true;
          }
          if (t.intervalo_dias && t.fecha_ultima) {
            const fProx = new Date(new Date(t.fecha_ultima).getTime()+t.intervalo_dias*86400000);
            const d = Math.round((fProx-hoy)/86400000);
            if (d<=0) danger=true; else if (d<=30) warn=true;
          } else if (t.intervalo_dias && !t.fecha_ultima) { warn=true; }
          if (danger) vencidas++; else if (warn) proximas++;
        });
        if (vencidas>0) setMantAlert({nivel:"danger",texto:`${vencidas} mantenimiento${vencidas>1?"s":""} vencido${vencidas>1?"s":""}`});
        else if (proximas>0) setMantAlert({nivel:"warn",texto:`${proximas} mantenimiento${proximas>1?"s":""} proximo${proximas>1?"s":""}`});
        else setMantAlert(null);
      } catch(e){}
    }
    checkMantenimiento();

    async function checkAverias() {
      try {
        const a = await db("averias","GET",null,"?estado=in.(pendiente,en_taller)&order=fecha.desc");
        setAveriasAlert(a);
      } catch(e){}
    }
    checkAverias();

    async function checkDocs() {
      try {
        const docs = await db("documentos","GET",null,"?select=nombre,fecha_vencimiento&fecha_vencimiento=not.is.null");
        const hoy = new Date();
        const proximos = docs.filter(d => {
          if (!d.fecha_vencimiento) return false;
          const dias = Math.round((new Date(d.fecha_vencimiento) - hoy) / 86400000);
          return dias >= 0 && dias <= 30;
        });
        setDocsAlert(proximos);
      } catch(e){}
    }
    checkDocs();

    async function checkCombustible() {
      try {
        // Check latest bitacora entry for fuel level
        const bits = await db("bitacora","GET",null,"?order=fecha.desc&limit=1&select=combustible_cargado,fecha");
        if (bits.length && bits[0].combustible_cargado !== null) {
          const pct = parseFloat(bits[0].combustible_cargado);
          // Check if there's a repostaje AFTER the last bitacora entry
          const ultimaFecha = bits[0].fecha;
          const repostajes = await db("combustible","GET",null,`?order=fecha.desc&limit=1&fecha=gte.${ultimaFecha}`);
          // If there's a recent repostaje, assume tank is full - no alert
          if (repostajes.length > 0) {
            setCombustibleAlert(null);
          } else if (pct < 40) {
            setCombustibleAlert(pct);
          } else {
            setCombustibleAlert(null);
          }
        }
      } catch(e){}
    }
    checkCombustible();
  },[]);

  const alerts = [
    // Combustible
    combustibleAlert !== null ? { msg:`⛽ Combustible bajo · ${combustibleAlert}%`, sub:"Repostar antes de la proxima salida", c:T.danger, to:"combustible" } : null,
    // Mantenimiento dinamico
    mantAlert?.nivel==="danger" ? { msg:`🔧 ${mantAlert.texto}`, sub:"Accede a Mantenimiento para revisar", c:T.danger, to:"mantenimiento" } : null,
    mantAlert?.nivel==="warn"   ? { msg:`🔧 ${mantAlert.texto}`, sub:"Revision proxima recomendada", c:T.warn, to:"mantenimiento" } : null,
    // Averias pendientes
    ...averiasAlert.map(a => ({ msg:`⚠ Averia: ${a.descripcion}`, sub:`Registrada el ${a.fecha} · ${a.estado==="en_taller"?"En taller":"Pendiente"}`, c:T.danger, to:"mantenimiento" })),
    // Documentos proximos a vencer
    ...docsAlert.map(d => ({ msg:`📄 ${d.nombre} vence pronto`, sub:`Vencimiento: ${d.fecha_vencimiento}`, c:T.warn, to:"documentos" })),
  ].filter(Boolean);

  return (
    <div>
      <div style={{ marginBottom:28, paddingTop:4 }}>
        <div style={{ fontSize:9.5, color:T.brass, letterSpacing:3, textTransform:"uppercase",
          fontFamily:"'DM Mono',monospace", marginBottom:6 }}>Embarcación activa</div>
        <h1 style={{ margin:"0 0 5px", fontFamily:"'Cormorant Garamond',serif",
          fontSize:40, fontWeight:600, color:T.ink, lineHeight:1, letterSpacing:-0.5 }}>
          Leonidas
        </h1>
        <div style={{ color:T.inkDim, fontSize:11, fontFamily:"'DM Mono',monospace", letterSpacing:0.3 }}>
          Sunseeker Portofino 53 · 7ª PM-1-231-25 · Caleta de Vélez
        </div>
      </div>

      <DashboardWeather setScreen={setScreen}/>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:18 }}>
        {[
          { l:"Horas motor",      v:stats.horas+" h",        a:T.brassLt },
          { l:"Millas totales",   v:stats.millas+" mn",      a:stats.millas>0?T.ink:T.inkDim },
          { l:"Último repostaje", v:stats.ultimoRepo,        a:stats.ultimoRepo!=="Sin datos"?T.ink:T.inkDim },
          { l:"Alertas activas",  v:alerts.length+"",        a:T.warn },
        ].map((k,i) => (
          <Card key={i} pad="14px 16px">
            <div style={{ fontSize:9, color:T.inkDim, letterSpacing:1.5,
              textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginBottom:7 }}>{k.l}</div>
            <div style={{ fontSize:26, fontWeight:600, color:k.a,
              fontFamily:"'Cormorant Garamond',serif", lineHeight:1 }}>{k.v}</div>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom:14 }}>
        <div style={{ fontSize:9.5, color:T.inkDim, letterSpacing:2, textTransform:"uppercase",
          fontFamily:"'DM Mono',monospace", marginBottom:12 }}>Alertas</div>
        {alerts.map((a,i) => (
          <div key={i} onClick={a.to?()=>setScreen(a.to):undefined}
            style={{ cursor:a.to?"pointer":"default" }}>
            {i>0 && <Divider/>}
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0" }}>
              <div style={{ width:3, height:38, borderRadius:2, background:a.c, flexShrink:0 }}/>
              <div style={{flex:1}}>
                <div style={{ color:T.ink, fontSize:12.5, fontWeight:500 }}>{a.msg}</div>
                <div style={{ color:T.inkDim, fontSize:10, marginTop:2,
                  fontFamily:"'DM Mono',monospace" }}>{a.sub}</div>
              </div>
              {a.to && <span style={{color:T.inkDim,fontSize:18,fontWeight:300}}>›</span>}
            </div>
          </div>
        ))}
      </Card>

      <Card style={{ marginBottom:14 }}>
        <div style={{ fontSize:9.5, color:T.inkDim, letterSpacing:2, textTransform:"uppercase",
          fontFamily:"'DM Mono',monospace", marginBottom:10 }}>Última entrada · Bitácora</div>
        {ultimaBitacora ? (
          <div onClick={()=>setScreen("bitacora")}
            style={{ cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div style={{flex:1}}>
              <div style={{ color:T.ink, fontWeight:600, fontSize:17,
                fontFamily:"'Cormorant Garamond',serif" }}>{ultimaBitacora.salida} → {ultimaBitacora.llegada}</div>
              <div style={{ color:T.inkDim, fontSize:10, marginTop:3,
                fontFamily:"'DM Mono',monospace" }}>{ultimaBitacora.fecha} · {ultimaBitacora.patron}</div>
            </div>
            <span style={{color:T.inkDim, fontSize:22, fontWeight:300, alignSelf:"center"}}>›</span>
          </div>
        ) : (
          <div style={{ color:T.inkDim, fontSize:13, fontStyle:"italic" }}>
            Aún no hay entradas. Pulsa "+ Nueva" en Bitácora.
          </div>
        )}
      </Card>

      <div style={{ fontSize:9.5, color:T.inkDim, letterSpacing:2, textTransform:"uppercase",
        fontFamily:"'DM Mono',monospace", marginBottom:11 }}>Acceso rápido</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
        {[
          { label:"Bitácora",       id:"bitacora",      d:NAV[2].svg },
          { label:"Mantenimiento",  id:"mantenimiento", d:NAV[3].svg },
          { label:"Repostaje",      id:"combustible",   d:NAV[4].svg },
          { label:"Asistente IA",   id:"ia",            d:NAV[10].svg },
        ].map(a => (
          <button key={a.id} onClick={()=>setScreen(a.id)} style={{
            background:T.surfaceUp, border:`1px solid ${T.rimHi}`,
            borderRadius:10, padding:"15px 13px", cursor:"pointer",
            display:"flex", flexDirection:"column", alignItems:"flex-start", gap:10,
            textAlign:"left" }}>
            <Icon d={a.d} color={T.brass} size={19}/>
            <span style={{ color:T.inkMid, fontSize:12, lineHeight:1.4,
              fontFamily:"inherit" }}>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Ficha() {
  const specs = [
    ["Nombre",          BOAT.nombre],
    ["Matrícula",       BOAT.matricula],
    ["Bandera",         BOAT.bandera],
    ["Modelo",          BOAT.astillero],
    ["Año construcción",BOAT.año],
    ["Reforma",         BOAT.reforma],
    ["Eslora ISO",      BOAT.eslora],
    ["Manga",           BOAT.manga],
    ["Motores",         BOAT.motores],
    ["Potencia",        BOAT.cv],
    ["Horas motor",     BOAT.horas+" h"],
    ["Zona navegación", BOAT.zona],
    ["Base habitual",   BOAT.base],
    ["Electrónica",     BOAT.electronica],
    ["Propietario reg.",BOAT.propietario],
    ["Permiso nav. válido hasta", BOAT.permiso],
    ["N.I.B.",          BOAT.nib],
    ["Nº casco (CIN)",  BOAT.casco],
    ["Nº homologación", BOAT.homologacion],
  ];
  return (
    <div>
      <Hdr title="Ficha del Barco"/>
      <Card style={{ marginBottom:12 }} pad="0 18px">
        {specs.map(([k,v],i)=>(
          <div key={i}>{i>0&&<Divider/>}
            <Row label={k} value={v} accent={k==="Nombre"?T.brassLt:undefined}/>
          </div>
        ))}
      </Card>
      <div style={{ fontSize:9.5, color:T.inkDim, letterSpacing:2, textTransform:"uppercase",
        fontFamily:"'DM Mono',monospace", marginBottom:11 }}>Documentación vigente</div>
      {[
        { l:"Seguro",       v:BOAT.seguro, vence:BOAT.seguroVence, e:"warn" },
        { l:"ITV Náutica",  v:BOAT.itv,    vence:BOAT.itvVence,    e:"ok"   },
      ].map((d,i)=>(
        <Card key={i} style={{ marginBottom:9 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ color:T.ink, fontWeight:600, fontSize:14 }}>{d.l}</div>
              <div style={{ color:T.inkDim, fontSize:10, marginTop:3, fontFamily:"'DM Mono',monospace" }}>{d.v}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <Signal estado={d.e}/>
              <div style={{ color:T.inkDim, fontSize:9.5, marginTop:5,
                fontFamily:"'DM Mono',monospace" }}>Vence {d.vence}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function Bitacora() {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [open, setOpen]         = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [saving, setSaving]     = useState(false);

  // ── Filtros ──
  const [filtroPatron, setFiltroPatron]       = useState("Todos");
  const [filtroMes, setFiltroMes]             = useState("Todos");
  const [filtroTripulante, setFiltroTripulante] = useState("Todos");
  const [orden, setOrden]                     = useState("desc");
  const [showFiltros, setShowFiltros]         = useState(false);
  const [bitTrip, setBitTrip]                 = useState([]);
  const [tripulantes, setTripulantes]         = useState([]);

  const getFormInit = (entradas) => ({
    fecha: new Date().toISOString().split("T")[0],
    hora_salida: "", hora_llegada: "",
    patron: "Guille", salida: "Caleta de Vélez", llegada: "",
    horas_motor_inicio: entradas.length > 0 ? String(entradas[0].horas_motor_fin||entradas[0].horas_motor_inicio||"") : "",
    horas_motor_fin: "",
    combustible_pct: "100",
    condiciones: "", incidencias: "Sin novedad", notas: "",
    tripulacion_ids: [],
  });
  const FORM_INIT = getFormInit([]);
  const [form, setForm] = useState(FORM_INIT);
  const upd = f => e => setForm(v=>({...v,[f]:e.target.value}));
  const [tripulacionDisp, setTripulacionDisp] = useState([]);
  useEffect(()=>{
    db("tripulacion","GET",null,"?activo=eq.true&order=nombre.asc")
      .then(rows=>setTripulacionDisp(rows))
      .catch(()=>{});
  },[]);

  async function cargar() {
    try {
      setLoading(true);
      const [data, bt, trip] = await Promise.all([
        db("bitacora","GET",null,"?order=fecha.desc,id.desc"),
        db("bitacora_tripulacion","GET",null,"?select=bitacora_id,tripulante_id"),
        db("tripulacion","GET",null,"?activo=eq.true&select=id,alias,nombre"),
      ]);
      setEntradas(data);
      setBitTrip(bt);
      setTripulantes(trip);
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ cargar(); },[]);

  async function guardar() {
    if (!form.llegada) return;
    setSaving(true);
    try {
      const payload = {
        fecha: form.fecha,
        hora_salida: form.hora_salida||null,
        hora_llegada: form.hora_llegada||null,
        patron: form.patron,
        salida: form.salida, llegada: form.llegada,

        horas_motor_inicio: parseFloat(form.horas_motor_inicio)||null,
        horas_motor_fin: parseFloat(form.horas_motor_fin)||null,

        combustible_cargado: parseFloat(form.combustible_pct)||null,
        condiciones: form.condiciones,
        incidencias: form.incidencias||"Sin novedad",
        notas: form.notas||null,
      };
      let bitacoraId = editId;
      if (editId) {
        await db(`bitacora?id=eq.${editId}`,"PATCH",payload);
      } else {
        const res = await db("bitacora","POST",payload);
        bitacoraId = res[0]?.id;
      }
      // Guardar tripulacion vinculada
      if (bitacoraId && form.tripulacion_ids?.length > 0) {
        if (editId) await db(`bitacora_tripulacion?bitacora_id=eq.${bitacoraId}`,"DELETE");
        await Promise.all(form.tripulacion_ids.map(tid =>
          db("bitacora_tripulacion","POST",{ bitacora_id:bitacoraId, tripulante_id:tid })
        ));
      }
      setEditId(null);
      setShowForm(false);
      setForm(FORM_INIT);
      cargar();
    } catch(e){ alert("Error: "+e.message); }
    finally { setSaving(false); }
  }

  async function eliminar(id) {
    if (!window.confirm("¿Eliminar esta entrada de bitácora?")) return;
    try { await db(`bitacora?id=eq.${id}`,"DELETE"); cargar(); }
    catch(e){ alert("Error: "+e.message); }
  }

  function editar(e) {
    setForm({
      fecha: e.fecha||"",
      hora_salida: e.hora_salida||"",
      hora_llegada: e.hora_llegada||"",
      patron: e.patron||"Guille",
      salida: e.salida||"", llegada: e.llegada||"",
      millas: e.millas||"",
      horas_motor_inicio: e.horas_motor_inicio||"",
      horas_motor_fin: e.horas_motor_fin||"",
      tripulantes: e.tripulantes||"2",
      combustible_pct: e.combustible_cargado||"100",
      condiciones: e.condiciones||"",
      incidencias: e.incidencias||"Sin novedad",
      notas: e.notas||"",
    });
    setEditId(e.id);
    setOpen(null);
    setShowForm(true);
    setTimeout(()=>window.scrollTo(0,0),50);
  }

  // ── Filtrado ──
  const meses = ["Todos", ...new Set(entradas.map(e => e.fecha?.slice(0,7)).filter(Boolean))].sort().reverse();
  const patrones = ["Todos", ...new Set(entradas.map(e=>e.patron).filter(Boolean))];

  const entradasFiltradas = entradas
    .filter(e => {
      const okPatron = filtroPatron === "Todos" || e.patron === filtroPatron;
      const okMes    = filtroMes    === "Todos" || e.fecha?.startsWith(filtroMes);
      const okTrip   = filtroTripulante === "Todos" || (() => {
        // Match by alias OR nombre
        const trip = tripulantes.find(t =>
          (t.alias && t.alias === filtroTripulante) ||
          t.nombre === filtroTripulante ||
          `${t.nombre} ${t.apellidos||""}`.trim() === filtroTripulante
        );
        if (!trip) return false;
        return bitTrip.some(bt =>
          String(bt.bitacora_id) === String(e.id) &&
          String(bt.tripulante_id) === String(trip.id)
        );
      })();
      return okPatron && okMes && okTrip;
    })
    .sort((a,b) => {
      const da = new Date(a.fecha+( a.hora_salida ? "T"+a.hora_salida : ""));
      const db2 = new Date(b.fecha+(b.hora_salida ? "T"+b.hora_salida : ""));
      return orden === "desc" ? db2 - da : da - db2;
    });

  const sinNovedad = e => !e.incidencias || e.incidencias.trim() === "" || e.incidencias === "Sin novedad";

  return (
    <div>
      <Hdr title="Bitácora"
        action={
          <div style={{display:"flex",gap:7}}>
            <button onClick={()=>setShowFiltros(!showFiltros)} style={{
              display:"flex", alignItems:"center", gap:5,
              background:"transparent", border:`1px solid ${T.rimHi}`,
              borderRadius:7, padding:"7px 12px", cursor:"pointer",
              color: showFiltros||filtroPatron!=="Todos"||filtroMes!=="Todos"||filtroTripulante!=="Todos" ? T.brass : T.inkMid,
              fontSize:11, fontFamily:"inherit" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filtrar
            </button>
            <Btn sm onClick={()=>{ setShowForm(!showForm); setEditId(null); setForm(getFormInit(entradas)); }}>
              {showForm&&!editId?"Cancelar":"+ Nueva"}
            </Btn>
          </div>
        }/>

      {/* ── FILTROS ── */}
      {showFiltros && (
        <Card style={{marginBottom:14}} pad="14px 16px">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
                fontFamily:"'DM Mono',monospace",marginBottom:5}}>Patrón</div>
              <select value={filtroPatron} onChange={e=>setFiltroPatron(e.target.value)}
                style={{width:"100%",background:T.bg,border:`0.5px solid ${T.rim}`,
                  borderRadius:7,padding:"9px 12px",color:T.ink,fontSize:14,fontFamily:"inherit",outline:"none"}}>
                {patrones.map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
                fontFamily:"'DM Mono',monospace",marginBottom:5}}>Mes</div>
              <select value={filtroMes} onChange={e=>setFiltroMes(e.target.value)}
                style={{width:"100%",background:T.bg,border:`0.5px solid ${T.rim}`,
                  borderRadius:7,padding:"9px 12px",color:T.ink,fontSize:14,fontFamily:"inherit",outline:"none"}}>
                {meses.map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginTop:10}}>
            <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
              fontFamily:"'DM Mono',monospace",marginBottom:5}}>Tripulante</div>
            <select value={filtroTripulante} onChange={e=>setFiltroTripulante(e.target.value)}
              style={{width:"100%",background:T.bg,border:`0.5px solid ${T.rim}`,
                borderRadius:7,padding:"9px 12px",color:T.ink,fontSize:14,fontFamily:"inherit",outline:"none"}}>
              <option>Todos</option>
              {tripulantes.map(t=><option key={t.id}>{t.alias||t.nombre}</option>)}
            </select>
          </div>
          {/* Orden */}
          <div style={{marginTop:10}}>
            <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
              fontFamily:"'DM Mono',monospace",marginBottom:5}}>Orden</div>
            <div style={{display:"flex",gap:6}}>
              {[["desc","Más recientes primero"],["asc","Más antiguas primero"]].map(([val,lbl])=>(
                <button key={val} onClick={()=>setOrden(val)} style={{
                  flex:1,padding:"8px",borderRadius:6,border:`0.5px solid ${orden===val?T.brass:T.rim}`,
                  background:orden===val?T.brassDim:"transparent",
                  color:orden===val?T.brass:T.inkMid,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>
          {(filtroPatron!=="Todos"||filtroMes!=="Todos"||filtroTripulante!=="Todos") && (
            <button onClick={()=>{setFiltroPatron("Todos");setFiltroMes("Todos");setFiltroTripulante("Todos");}}
              style={{marginTop:10,background:"none",border:"none",color:T.brass,
                fontSize:12,cursor:"pointer",fontFamily:"inherit",padding:0}}>
              × Limpiar filtros
            </button>
          )}
        </Card>
      )}

      {/* ── FORMULARIO ── */}
      {showForm && (
        <Card style={{marginBottom:16}} pad="16px">
          <div style={{fontSize:11,color:T.brass,fontWeight:700,marginBottom:14,
            textTransform:"uppercase",letterSpacing:1,fontFamily:"'DM Mono',monospace"}}>
            {editId ? "Editar entrada" : "Nueva entrada"}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <FInput label="Fecha" type="date" value={form.fecha} onChange={upd("fecha")}/>
              <PatronSelect value={form.patron} onChange={upd("patron")}/>
              <FInput label="Puerto salida" value={form.salida} onChange={upd("salida")}/>
              <FInput label="Hora salida" type="time" value={form.hora_salida} onChange={upd("hora_salida")}/>
              <FInput label="Puerto llegada *" value={form.llegada} onChange={upd("llegada")}/>
              <FInput label="Hora llegada" type="time" value={form.hora_llegada} onChange={upd("hora_llegada")}/>

              <div style={{marginBottom:10}}>
                <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
                  fontFamily:"'DM Mono',monospace",marginBottom:5}}>Tripulación a bordo</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {tripulacionDisp.map(t=>{
                    const sel = form.tripulacion_ids?.includes(t.id);
                    return (
                      <button key={t.id} type="button"
                        onClick={()=>setForm(v=>({...v,
                          tripulacion_ids: sel
                            ? v.tripulacion_ids.filter(id=>id!==t.id)
                            : [...(v.tripulacion_ids||[]),t.id]
                        }))}
                        style={{padding:"5px 11px",borderRadius:20,fontSize:11,cursor:"pointer",
                          fontFamily:"inherit",border:`1px solid ${sel?T.brass:T.rim}`,
                          background:sel?T.brassDim:"transparent",
                          color:sel?T.brass:T.inkMid,fontWeight:sel?600:400}}>
                        {t.alias||t.nombre}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div>
              <FInput label="H. motor inicio" type="number" value={form.horas_motor_inicio} onChange={upd("horas_motor_inicio")}
                placeholder={entradas.length > 0 ? String(entradas[0].horas_motor_fin||entradas[0].horas_motor_inicio||"774") : "774"}/>
              <FInput label="H. motor fin" type="number" value={form.horas_motor_fin} onChange={upd("horas_motor_fin")}/>
              <FInput label="Condiciones" value={form.condiciones} onChange={upd("condiciones")} placeholder="NE 10kn, mar llana"/>
              {/* Combustible en % */}
              <div style={{marginBottom:10}}>
                <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
                  fontFamily:"'DM Mono',monospace",marginBottom:5}}>
                  Combustible aprox.
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <input type="range" min="0" max="100" step="10"
                    value={form.combustible_pct}
                    onChange={upd("combustible_pct")}
                    style={{flex:1,accentColor:T.brass}}/>
                  <span style={{fontSize:14,fontWeight:700,color:
                    parseInt(form.combustible_pct)<40?T.danger:T.ink,
                    fontFamily:"'Cormorant Garamond',serif",minWidth:36,textAlign:"right"}}>
                    {form.combustible_pct}%
                  </span>
                </div>
                {parseInt(form.combustible_pct) < 40 && (
                  <div style={{fontSize:10,color:T.danger,marginTop:4,
                    fontFamily:"'DM Mono',monospace"}}>
                    ⚠ Combustible bajo -- repostar antes de salir
                  </div>
                )}
              </div>
            </div>
          </div>
          <FTextarea label="Incidencias" value={form.incidencias} onChange={upd("incidencias")}
            placeholder="Sin novedad"/>
          <FTextarea label="Observaciones" value={form.notas} onChange={upd("notas")}
            placeholder="Notas, anécdotas, puntos de interés..."/>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <Btn onClick={guardar}>{saving?"Guardando...":editId?"Actualizar entrada":"Guardar entrada"}</Btn>
            <Btn variant="ghost" onClick={()=>{setShowForm(false);setEditId(null);setForm(FORM_INIT);}}>Cancelar</Btn>
          </div>
        </Card>
      )}

      {/* ── CONTADOR ── */}
      {entradasFiltradas.length > 0 && (
        <div style={{fontSize:10,color:T.inkDim,fontFamily:"'DM Mono',monospace",
          marginBottom:12,textAlign:"right"}}>
          {entradasFiltradas.length} entrada{entradasFiltradas.length!==1?"s":""}
          {(filtroPatron!=="Todos"||filtroMes!=="Todos"||filtroTripulante!=="Todos") ? " (filtradas)" : ""}
        </div>
      )}

      {/* ── LISTA ── */}
      {loading ? (
        <Card><div style={{color:T.inkDim,fontSize:13,textAlign:"center",padding:"20px 0"}}>Cargando...</div></Card>
      ) : entradasFiltradas.length === 0 ? (
        <Card>
          <div style={{color:T.inkDim,fontSize:13,fontStyle:"italic",textAlign:"center",padding:"12px 0"}}>
            {entradas.length === 0
              ? "Aún no hay entradas. Pulsa + Nueva para registrar la primera salida."
              : "No hay entradas con los filtros aplicados."}
          </div>
        </Card>
      ) : entradasFiltradas.map(e=>(
        <Card key={e.id} style={{marginBottom:9}}>
          {/* ── CABECERA ── */}
          <div onClick={()=>setOpen(open===e.id?null:e.id)} style={{cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:9.5,color:T.brass,letterSpacing:1.5,
                  fontFamily:"'DM Mono',monospace",marginBottom:4}}>{e.fecha} · {e.patron}</div>
                <div style={{color:T.ink,fontWeight:600,fontSize:17,
                  fontFamily:"'Cormorant Garamond',serif"}}>{e.salida} → {e.llegada}</div>
                <div style={{color:T.inkDim,fontSize:10,marginTop:3,
                  fontFamily:"'DM Mono',monospace"}}>
                  {e.hora_salida ? `${e.hora_salida} → ${e.hora_llegada||"?"}` : e.fecha}

                  {e.horas_motor_inicio && e.horas_motor_fin
                    ? ` · ${(parseFloat(e.horas_motor_fin)-parseFloat(e.horas_motor_inicio)).toFixed(1)}h motor` : ""}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
                {!sinNovedad(e) && (
                  <span style={{fontSize:9.5,color:T.warn,fontFamily:"'DM Mono',monospace",
                    letterSpacing:0.5}}>incidencia</span>
                )}
                <span style={{color:T.inkDim,fontSize:16,lineHeight:1}}>{open===e.id?"−":"+"}</span>
              </div>
            </div>
          </div>

          {/* ── DETALLE ── */}
          {open===e.id && (
            <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${T.line}`}}>
              {[
                ["Patrón",             e.patron||"--"],
                ["Salida",             e.hora_salida ? `${e.salida} · ${e.hora_salida}` : e.salida||"--"],
                ["Llegada",            e.hora_llegada ? `${e.llegada} · ${e.hora_llegada}` : e.llegada||"--"],

                ["Duración",           e.hora_salida && e.hora_llegada ? (() => {
                  const [sh,sm] = e.hora_salida.split(":").map(Number);
                  const [eh,em] = e.hora_llegada.split(":").map(Number);
                  const mins = (eh*60+em) - (sh*60+sm);
                  if (mins <= 0) return "--";
                  return `${Math.floor(mins/60)}h ${mins%60}min`;
                })() : "--"],
                ["H. motor",           e.horas_motor_inicio
                  ? `${e.horas_motor_inicio}h → ${e.horas_motor_fin||"?"}h (${e.horas_motor_fin&&e.horas_motor_inicio ? (parseFloat(e.horas_motor_fin)-parseFloat(e.horas_motor_inicio)).toFixed(1)+"h" : "--"})` : "--"],

                ["Combustible",        e.combustible_cargado!=null ? e.combustible_cargado+"%" : "--"],
                ["Tripulación", (() => {
                  const ids = bitTrip.filter(bt=>String(bt.bitacora_id)===String(e.id)).map(bt=>String(bt.tripulante_id));
                  if (!ids.length) return "--";
                  const nombres = ids.map(id=>{
                    const t = tripulantes.find(t=>String(t.id)===id);
                    return t ? (t.alias||t.nombre) : null;
                  }).filter(Boolean);
                  return nombres.length ? nombres.join(", ") : "--";
                })()],
                ["Condiciones",        e.condiciones||"--"],
                ["Incidencias",        e.incidencias||"Sin novedad"],
                e.notas ? ["Observaciones", e.notas] : null,
              ].filter(Boolean).map(([k,v])=>(
                <div key={k}><Divider/>
                  <Row label={k} value={v}
                    accent={k==="Incidencias"&&!sinNovedad(e)?T.inkMid:undefined}/>
                </div>
              ))}
              {/* ── ACCIONES ── */}
              <div style={{display:"flex",gap:8,marginTop:12,paddingTop:10,
                borderTop:`1px solid ${T.line}`}}>
                <button onClick={()=>editar(e)}
                  style={{flex:1,background:T.surfaceUp,border:`1px solid ${T.rimHi}`,
                    borderRadius:7,padding:"8px",color:T.inkMid,fontSize:12,
                    cursor:"pointer",fontFamily:"inherit"}}>✏️ Editar</button>
                <button onClick={()=>eliminar(e.id)}
                  style={{flex:1,background:"none",border:`1px solid ${T.danger}40`,
                    borderRadius:7,padding:"8px",color:T.danger,fontSize:12,
                    cursor:"pointer",fontFamily:"inherit"}}>✕ Eliminar</button>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
function Mantenimiento() {
  const [tab, setTab] = useState("tareas");
  const [tareas, setTareas] = useState([]);
  const [averias, setAverias] = useState([]);
  const [horasActuales, setHorasActuales] = useState(774);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [showAveriaForm, setShowAveriaForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formEdit, setFormEdit] = useState({ fecha_ultima:"", horas_ultima:"", coste:"", notas:"" });
  const [formAveria, setFormAveria] = useState({ fecha:new Date().toISOString().split("T")[0], descripcion:"", patron:"Guille", notas:"", coste:"0" });
  const updE = f => e => setFormEdit(v=>({...v,[f]:e.target.value}));
  const updA = f => e => setFormAveria(v=>({...v,[f]:e.target.value}));

  async function cargar() {
    try {
      setLoading(true);
      const [t, a, bits] = await Promise.all([
        db("mantenimiento","GET",null,"?order=tipo.asc"),
        db("averias","GET",null,"?order=fecha.desc"),
        db("bitacora","GET",null,"?select=horas_motor_inicio,horas_motor_fin"),
      ]);
      setTareas(t);
      setAverias(a);
      const horasNav = bits.reduce((acc,b)=>{
        const ini = parseFloat(b.horas_motor_inicio)||0;
        const fin = parseFloat(b.horas_motor_fin)||0;
        return acc + (fin > ini ? fin - ini : 0);
      }, 0);
      setHorasActuales(774 + horasNav);
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ cargar(); },[]);

  async function marcarRealizado(id) {
    if (!formEdit.fecha_ultima) return;
    setSaving(true);
    try {
      await db(`mantenimiento?id=eq.${id}`,"PATCH",{
        fecha_ultima: formEdit.fecha_ultima,
        horas_ultima: parseFloat(formEdit.horas_ultima)||horasActuales,
        coste: parseFloat(formEdit.coste)||0,
        notas: formEdit.notas||null,
        estado: "ok",
        updated_at: new Date().toISOString(),
      });
      setEditId(null);
      setFormEdit({ fecha_ultima:"", horas_ultima:"", coste:"", notas:"" });
      cargar();
    } catch(e){ alert("Error: "+e.message); }
    finally { setSaving(false); }
  }

  async function guardarAveria() {
    if (!formAveria.descripcion) return;
    setSaving(true);
    try {
      await db("averias","POST",{ ...formAveria, coste:parseFloat(formAveria.coste)||0, estado:"pendiente" });
      setShowAveriaForm(false);
      setFormAveria({ fecha:new Date().toISOString().split("T")[0], descripcion:"", patron:"Guille", notas:"", coste:"0" });
      cargar();
    } catch(e){ alert("Error: "+e.message); }
    finally { setSaving(false); }
  }

  async function cambiarEstadoAveria(id, estado) {
    try { await db(`averias?id=eq.${id}`,"PATCH",{ estado }); cargar(); } catch(e){}
  }

  // Calcular estado de cada tarea
  function calcEstado(t) {
    const hoy = new Date();
    const hInt = t.horas_intervalo;
    const dInt = t.intervalo_dias;
    const hUlt = parseFloat(t.horas_ultima)||0;
    const fUlt = t.fecha_ultima ? new Date(t.fecha_ultima) : null;

    let porHoras = null, porDias = null;

    // Por horas
    if (hInt && hUlt) {
      const hRestantes = hInt - (horasActuales - hUlt);
      const pct = Math.min(100, Math.round(((hInt - hRestantes) / hInt) * 100));
      if (hRestantes <= 0) porHoras = { nivel:"danger", texto:`Vencido ${Math.abs(Math.round(hRestantes))}h`, pct:100 };
      else if (hRestantes <= hInt * 0.2) porHoras = { nivel:"warn", texto:`${Math.round(hRestantes)}h restantes`, pct };
      else porHoras = { nivel:"ok", texto:`${Math.round(hRestantes)}h restantes`, pct };
    }

    // Por dias
    if (dInt && fUlt) {
      const fProx = new Date(fUlt.getTime() + dInt * 86400000);
      const diasRestantes = Math.round((fProx - hoy) / 86400000);
      const pct = Math.min(100, Math.round(((dInt - diasRestantes) / dInt) * 100));
      if (diasRestantes <= 0) porDias = { nivel:"danger", texto:`Vencido hace ${Math.abs(diasRestantes)}d`, pct:100 };
      else if (diasRestantes <= 30) porDias = { nivel:"warn", texto:`${diasRestantes} dias`, pct };
      else porDias = { nivel:"ok", texto:`${diasRestantes} dias`, pct };
    } else if (dInt && !fUlt) {
      porDias = { nivel:"warn", texto:"Sin fecha de revision", pct:50 };
    }

    // El peor de los dos gana
    const niveles = { danger:3, warn:2, ok:1, info:0 };
    if (porHoras && porDias) {
      return niveles[porHoras.nivel] >= niveles[porDias.nivel] ? porHoras : porDias;
    }
    return porHoras || porDias || { nivel:"info", texto:"Sin datos", pct:0 };
  }

  const CATEGORIAS = ["Motor","Sistema de refrigeracion","Combustible","Sistemas generales","Obligatorio legal"];

  const tareasPorCat = CATEGORIAS.map(cat => ({
    cat,
    items: tareas.filter(t => t.tipo?.startsWith(cat) ||
      (cat === "Motor" && (t.tipo?.includes("aceite") || t.tipo?.includes("Aceite") || t.tipo?.includes("correa") || t.tipo?.includes("Correa") || t.tipo?.includes("turbo") || t.tipo?.includes("valvula"))) ||
      (cat === "Sistema de refrigeracion" && (t.tipo?.includes("mpelente") || t.tipo?.includes("nodo") || t.tipo?.includes("efrigerante"))) ||
      (cat === "Combustible" && (t.tipo?.includes("iltro") || t.tipo?.includes("ombustible"))) ||
      (cat === "Obligatorio legal" && (t.tipo?.includes("ITV") || t.tipo?.includes("eguro") || t.tipo?.includes("alsa") || t.tipo?.includes("engala"))) ||
      (cat === "Sistemas generales" && !["Motor","Sistema de refrigeracion","Combustible","Obligatorio legal"].some(c =>
        c === "Motor" && (t.tipo?.includes("aceite") || t.tipo?.includes("Aceite") || t.tipo?.includes("correa") || t.tipo?.includes("Correa")) ||
        c === "Sistema de refrigeracion" && (t.tipo?.includes("mpelente") || t.tipo?.includes("nodo") || t.tipo?.includes("efrigerante")) ||
        c === "Combustible" && (t.tipo?.includes("iltro") || t.tipo?.includes("ombustible")) ||
        c === "Obligatorio legal" && (t.tipo?.includes("ITV") || t.tipo?.includes("eguro") || t.tipo?.includes("alsa") || t.tipo?.includes("engala"))
      ))
    )
  })).filter(c => c.items.length > 0);

  const alertas = tareas.filter(t => ["danger","warn"].includes(calcEstado(t).nivel));

  return (
    <div>
      <Hdr title="Mantenimiento"/>

      {/* Resumen alertas */}
      {alertas.length > 0 && (
        <div style={{background:T.danger+"10",border:`1px solid ${T.danger}28`,
          borderRadius:8,padding:"11px 15px",marginBottom:16}}>
          <div style={{color:T.danger,fontSize:12,fontWeight:600,marginBottom:4}}>
            {alertas.filter(t=>calcEstado(t).nivel==="danger").length} tareas vencidas ·{" "}
            {alertas.filter(t=>calcEstado(t).nivel==="warn").length} proximas
          </div>
          <div style={{color:T.inkDim,fontSize:10,fontFamily:"'DM Mono',monospace"}}>
            Horas motor actuales: {horasActuales.toFixed(1)}h
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{display:"flex",background:T.bg,borderRadius:7,padding:3,
        gap:3,marginBottom:18,border:`1px solid ${T.rimHi}`}}>
        {[["tareas","Tareas"],["averias","Averias"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{
            flex:1,padding:"8px",borderRadius:5,border:"none",cursor:"pointer",
            background:tab===id?T.surface:"transparent",
            color:tab===id?T.ink:T.inkDim,fontSize:11.5,fontWeight:tab===id?600:400,
            fontFamily:"inherit",boxShadow:tab===id?"0 1px 3px rgba(0,0,0,0.15)":"none"}}>
            {lbl}
            {id==="averias" && averias.filter(a=>a.estado==="pendiente").length > 0 && (
              <span style={{marginLeft:6,background:T.danger,color:"#fff",borderRadius:8,
                padding:"1px 5px",fontSize:9,fontWeight:700}}>
                {averias.filter(a=>a.estado==="pendiente").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ══ TAREAS ══ */}
      {tab==="tareas" && (
        loading ? <Card><div style={{color:T.inkDim,fontSize:13,textAlign:"center",padding:"20px 0"}}>Cargando...</div></Card>
        : tareasPorCat.map(({cat, items})=>(
          <div key={cat} style={{marginBottom:20}}>
            <div style={{fontSize:9.5,color:T.brass,letterSpacing:2,textTransform:"uppercase",
              fontFamily:"'DM Mono',monospace",marginBottom:10}}>{cat}</div>
            {items.map(t => {
              const est = calcEstado(t);
              const bc = est.nivel==="danger"?T.danger:est.nivel==="warn"?T.warn:T.ok;
              const isEditing = editId === t.id;
              return (
                <Card key={t.id} style={{marginBottom:8,borderLeft:`3px solid ${bc}`}}>
                  {isEditing ? (
                    <div>
                      <div style={{fontSize:11,color:T.brass,fontWeight:700,marginBottom:12,
                        textTransform:"uppercase",letterSpacing:1,fontFamily:"'DM Mono',monospace"}}>
                        Registrar revision
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                        <FInput label="Fecha realizacion *" type="date" value={formEdit.fecha_ultima} onChange={updE("fecha_ultima")}/>
                        <FInput label="Horas motor" type="number" value={formEdit.horas_ultima}
                          onChange={updE("horas_ultima")} placeholder={horasActuales.toFixed(0)}/>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                        <FInput label="Coste (EUR)" type="number" value={formEdit.coste} onChange={updE("coste")}/>
                        <FInput label="Notas" value={formEdit.notas} onChange={updE("notas")}/>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <Btn sm onClick={()=>marcarRealizado(t.id)}>{saving?"Guardando...":"Confirmar"}</Btn>
                        <Btn sm variant="ghost" onClick={()=>setEditId(null)}>Cancelar</Btn>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                        <div style={{flex:1}}>
                          <div style={{color:T.ink,fontWeight:600,fontSize:13.5}}>{t.tipo}</div>
                          <div style={{color:T.inkDim,fontSize:9.5,marginTop:3,
                            fontFamily:"'DM Mono',monospace"}}>
                            {t.fecha_ultima ? `Ultima revision: ${t.fecha_ultima}` : "Sin revisiones registradas"}
                            {t.horas_intervalo ? ` · Cada ${t.horas_intervalo}h` : ""}
                          </div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                          <span style={{color:bc,fontSize:10,fontWeight:600,
                            fontFamily:"'DM Mono',monospace"}}>{est.texto}</span>
                          <div style={{display:"flex",gap:5}}>
                            <button onClick={()=>{
                              setEditId(t.id);
                              setFormEdit({fecha_ultima:new Date().toISOString().split("T")[0],
                                horas_ultima:horasActuales.toFixed(0),coste:"",notas:""});
                            }} style={{background:T.brass,border:"none",borderRadius:5,
                              padding:"4px 10px",color:"#fff",fontSize:10,
                              cursor:"pointer",fontWeight:700}}>
                              OK
                            </button>
                            <button onClick={()=>{
                              setTab("averias");
                              setShowAveriaForm(true);
                              setFormAveria(f=>({...f,descripcion:`Revisar: ${t.tipo}`,
                                fecha:new Date().toISOString().split("T")[0]}));
                            }} style={{background:"none",border:`1px solid ${T.danger}40`,
                              borderRadius:5,padding:"4px 8px",color:T.danger,
                              fontSize:10,cursor:"pointer"}}>
                              Averia
                            </button>
                          </div>
                        </div>
                      </div>
                      {(t.horas_intervalo || t.intervalo_dias) && (
                        <div style={{marginTop:6}}>
                          <div style={{background:T.surfaceUp,borderRadius:3,height:4,overflow:"hidden"}}>
                            <div style={{height:"100%",
                              width:`${Math.min(100,est.pct)}%`,
                              background:bc,borderRadius:3,transition:"width 0.4s"}}/>
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                            <span style={{fontSize:9,color:T.inkDim,fontFamily:"'DM Mono',monospace"}}>
                              {t.horas_intervalo ? `Cada ${t.horas_intervalo}h` : ""}
                              {t.horas_intervalo && t.intervalo_dias ? " · " : ""}
                              {t.intervalo_dias ? `${t.intervalo_dias}d` : ""}
                            </span>
                            <span style={{fontSize:9,color:bc,fontFamily:"'DM Mono',monospace",fontWeight:600}}>
                              {est.texto}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ))
      )}

      {/* ══ AVERIAS ══ */}
      {tab==="averias" && (
        <div>
          <div style={{marginBottom:14}}>
            <Btn onClick={()=>setShowAveriaForm(!showAveriaForm)}>
              {showAveriaForm?"Cancelar":"+ Registrar averia"}
            </Btn>
          </div>

          {showAveriaForm && (
            <Card style={{marginBottom:14}} pad="16px">
              <div style={{fontSize:11,color:T.danger,fontWeight:700,marginBottom:12,
                textTransform:"uppercase",letterSpacing:1,fontFamily:"'DM Mono',monospace"}}>Nueva averia</div>
              <FInput label="Descripcion *" value={formAveria.descripcion} onChange={updA("descripcion")}/>
              <FInput label="Fecha" type="date" value={formAveria.fecha} onChange={updA("fecha")}/>
              <FInput label="Notas / diagnostico" value={formAveria.notas} onChange={updA("notas")}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <FInput label="Coste (EUR)" type="number" value={formAveria.coste} onChange={updA("coste")}/>
                <PatronSelect value={formAveria.patron} onChange={updA("patron")}/>
              </div>
              <Btn onClick={guardarAveria}>{saving?"Guardando...":"Registrar"}</Btn>
            </Card>
          )}

          {loading ? <Card><div style={{color:T.inkDim,fontSize:13,textAlign:"center",padding:"20px 0"}}>Cargando...</div></Card>
          : averias.length===0 ? <Card><div style={{color:T.inkDim,fontSize:13,fontStyle:"italic",textAlign:"center",padding:"12px 0"}}>Sin averias registradas.</div></Card>
          : averias.map(a=>{
            const colors = { pendiente:T.danger, en_taller:T.warn, resuelto:T.ok };
            const c = colors[a.estado]||T.inkDim;
            return (
              <Card key={a.id} style={{marginBottom:9,borderLeft:`3px solid ${c}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1,paddingRight:12}}>
                    <div style={{color:T.ink,fontWeight:600,fontSize:13.5}}>{a.descripcion}</div>
                    <div style={{color:T.inkDim,fontSize:10,marginTop:3,
                      fontFamily:"'DM Mono',monospace"}}>{a.fecha} · {a.patron}</div>
                    {a.notas&&<div style={{color:T.inkMid,fontSize:12,marginTop:6}}>{a.notas}</div>}
                    {a.coste>0&&<div style={{color:T.brassLt,fontSize:12,marginTop:4,
                      fontFamily:"'DM Mono',monospace"}}>{a.coste}EUR</div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                    <Signal estado={a.estado||"pendiente"}/>
                    <div style={{display:"flex",gap:4,marginTop:4}}>
                      {a.estado==="pendiente" && (
                        <button onClick={()=>cambiarEstadoAveria(a.id,"en_taller")}
                          style={{background:T.warn+"20",border:`1px solid ${T.warn}40`,
                            borderRadius:4,padding:"2px 6px",color:T.warn,fontSize:9,cursor:"pointer"}}>
                          En taller
                        </button>
                      )}
                      {a.estado!=="resuelto" && (
                        <button onClick={()=>cambiarEstadoAveria(a.id,"resuelto")}
                          style={{background:T.ok+"20",border:`1px solid ${T.ok}40`,
                            borderRadius:4,padding:"2px 6px",color:T.ok,fontSize:9,cursor:"pointer"}}>
                          Resuelto
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Combustible() {
  const [repostajes, setRepostajes] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [saving, setSaving]         = useState(false);

  const FORM_INIT = {
    fecha: new Date().toISOString().split("T")[0],
    litros: "", precio_litro: "", puerto: "Caleta de Vélez",
    patron: "Guille", horas_motor: "", nivel_tras_repostaje: "100",
  };
  const [form, setForm] = useState(FORM_INIT);
  const upd = f => e => setForm(v=>({...v,[f]:e.target.value}));
  const [tripulacionDisp, setTripulacionDisp] = useState([]);
  useEffect(()=>{
    db("tripulacion","GET",null,"?activo=eq.true&order=nombre.asc")
      .then(rows=>setTripulacionDisp(rows))
      .catch(()=>{});
  },[]);

  async function cargar() {
    try {
      setLoading(true);
      const d = await db("combustible","GET",null,"?order=fecha.desc");
      setRepostajes(d);
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ cargar(); },[]);

  async function guardar() {
    if (!form.litros) return;
    setSaving(true);
    try {
      const litros  = parseFloat(form.litros);
      const precio  = parseFloat(form.precio_litro)||0;
      const nivel   = parseFloat(form.nivel_tras_repostaje)||100;
      const payload = {
        fecha: form.fecha,
        litros,
        precio_litro: precio||null,
        importe: precio ? parseFloat((litros*precio).toFixed(2)) : null,
        puerto: form.puerto||null,
        patron: form.patron,
        horas_motor: parseFloat(form.horas_motor)||null,
        notas: `Nivel tras repostaje: ${nivel}%`,
      };
      if (editItem) {
        await db(`combustible?id=eq.${editItem}`,"PATCH",payload);
        setEditItem(null);
      } else {
        await db("combustible","POST",payload);
      }
      setShowForm(false);
      setForm(FORM_INIT);
      cargar();
    } catch(e){ alert("Error al guardar: "+e.message); }
    finally { setSaving(false); }
  }

  async function eliminar(id) {
    if (!window.confirm("Eliminar este repostaje?")) return;
    try { await db(`combustible?id=eq.${id}`,"DELETE"); cargar(); }
    catch(e){ alert("Error: "+e.message); }
  }

  function editar(r) {
    setForm({
      fecha: r.fecha||"", litros: r.litros||"",
      precio_litro: r.precio_litro||"", puerto: r.puerto||"Caleta de Vélez",
      patron: r.patron||"Guille", horas_motor: r.horas_motor||"",
      nivel_tras_repostaje: "100",
    });
    setEditItem(r.id);
    setShowForm(true);
  }

  const totalL = repostajes.reduce((a,c)=>a+(parseFloat(c.litros)||0),0);
  const totalE = repostajes.reduce((a,c)=>a+(parseFloat(c.importe)||0),0);

  const nivelActual = (() => {
    if (!repostajes.length) return null;
    const nota = repostajes[0].notas||"";
    const m = nota.match(/Nivel tras repostaje: (\d+)%/);
    return m ? parseInt(m[1]) : null;
  })();

  return (
    <div>
      <Hdr title="Combustible"
        action={<Btn sm onClick={()=>{ setShowForm(!showForm); setEditItem(null); setForm(FORM_INIT); }}>
          {showForm&&!editItem?"Cancelar":"+ Repostaje"}
        </Btn>}/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:16}}>
        <Card pad="13px 15px">
          <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
            fontFamily:"'DM Mono',monospace",marginBottom:5}}>Total litros</div>
          <div style={{fontSize:24,color:T.ink,fontWeight:600,
            fontFamily:"'Cormorant Garamond',serif"}}>{totalL.toFixed(0)} L</div>
        </Card>
        <Card pad="13px 15px">
          <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
            fontFamily:"'DM Mono',monospace",marginBottom:5}}>Gasto total</div>
          <div style={{fontSize:24,color:T.brassLt,fontWeight:600,
            fontFamily:"'Cormorant Garamond',serif"}}>{totalE.toFixed(0)} €</div>
        </Card>
      </div>

      {nivelActual !== null && (
        <Card style={{marginBottom:16}} pad="14px 18px">
          <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
            fontFamily:"'DM Mono',monospace",marginBottom:8}}>Nivel actual estimado</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{flex:1,background:T.surfaceUp,borderRadius:4,height:8,overflow:"hidden"}}>
              <div style={{
                height:"100%", width:`${nivelActual}%`,
                background: nivelActual < 40 ? T.danger : nivelActual < 60 ? T.warn : T.ok,
                borderRadius:4, transition:"width 0.4s"
              }}/>
            </div>
            <span style={{fontSize:18,fontWeight:700,minWidth:44,textAlign:"right",
              fontFamily:"'Cormorant Garamond',serif",
              color: nivelActual < 40 ? T.danger : nivelActual < 60 ? T.warn : T.ok}}>
              {nivelActual}%
            </span>
          </div>
          {nivelActual < 40 && (
            <div style={{color:T.danger,fontSize:11,marginTop:6,fontFamily:"'DM Mono',monospace"}}>
              Nivel bajo -- repostar antes de la proxima salida
            </div>
          )}
        </Card>
      )}

      {showForm && (
        <Card style={{marginBottom:14}} pad="16px">
          <div style={{fontSize:11,color:T.brass,fontWeight:700,marginBottom:12,
            textTransform:"uppercase",letterSpacing:1,fontFamily:"'DM Mono',monospace"}}>
            {editItem ? "Editar repostaje" : "Nuevo repostaje"}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div>
              <FInput label="Fecha" type="date" value={form.fecha} onChange={upd("fecha")}/>
              <FInput label="Litros *" type="number" value={form.litros} onChange={upd("litros")}/>
              <FInput label="Euro / Litro" type="number" value={form.precio_litro} onChange={upd("precio_litro")}/>
            </div>
            <div>
              <FInput label="Puerto" value={form.puerto} onChange={upd("puerto")}/>
              <FInput label="Horas motor" type="number" value={form.horas_motor} onChange={upd("horas_motor")}/>
              <FSelect label="Patron" value={form.patron} onChange={upd("patron")} options={["Guille","Varo"]}/>
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
              fontFamily:"'DM Mono',monospace",marginBottom:6}}>
              Nivel del deposito tras repostar
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <input type="range" min="0" max="100" step="10"
                value={form.nivel_tras_repostaje}
                onChange={upd("nivel_tras_repostaje")}
                style={{flex:1, accentColor:T.brass}}/>
              <span style={{fontSize:16,fontWeight:700,minWidth:44,textAlign:"right",
                fontFamily:"'Cormorant Garamond',serif",
                color: parseInt(form.nivel_tras_repostaje)<40 ? T.danger : T.ok}}>
                {form.nivel_tras_repostaje}%
              </span>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={guardar}>{saving?"Guardando...":editItem?"Actualizar":"Guardar"}</Btn>
            <Btn variant="ghost" onClick={()=>{setShowForm(false);setEditItem(null);setForm(FORM_INIT);}}>Cancelar</Btn>
          </div>
        </Card>
      )}

      {loading ? (
        <Card><div style={{color:T.inkDim,fontSize:13,textAlign:"center",padding:"20px 0"}}>Cargando...</div></Card>
      ) : repostajes.length===0 ? (
        <Card><div style={{color:T.inkDim,fontSize:13,fontStyle:"italic",textAlign:"center",padding:"12px 0"}}>
          Sin repostajes registrados.
        </div></Card>
      ) : repostajes.map(r=>(
        <Card key={r.id} style={{marginBottom:9}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{flex:1}}>
              <div style={{color:T.ink,fontWeight:600,fontSize:16,
                fontFamily:"'Cormorant Garamond',serif"}}>{r.puerto||"--"}</div>
              <div style={{color:T.inkDim,fontSize:10,marginTop:3,fontFamily:"'DM Mono',monospace"}}>
                {r.fecha} · {r.patron} · {r.litros}L
                {r.precio_litro ? ` · ${r.precio_litro}EUR/L` : ""}
              </div>
              {r.notas&&<div style={{color:T.inkDim,fontSize:10,marginTop:2,fontFamily:"'DM Mono',monospace"}}>{r.notas}</div>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {r.importe&&<div style={{fontSize:16,fontWeight:600,color:T.brassLt,
                fontFamily:"'Cormorant Garamond',serif"}}>{parseFloat(r.importe).toFixed(2)}EUR</div>}
              <button onClick={()=>editar(r)} style={{background:"none",border:`1px solid ${T.rimHi}`,
                borderRadius:5,padding:"3px 7px",color:T.inkDim,fontSize:11,cursor:"pointer"}}>edit</button>
              <button onClick={()=>eliminar(r.id)} style={{background:"none",border:`1px solid ${T.danger}40`,
                borderRadius:5,padding:"3px 7px",color:T.danger,fontSize:11,cursor:"pointer"}}>x</button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function Seguridad() {
  const [tab, setTab]     = useState("equipos");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const FORM_INIT = { equipo:"", caducidad:"", ubicacion:"", estado:"ok", notas:"" };
  const [form, setForm] = useState(FORM_INIT);
  const upd = f => e => setForm(v=>({...v,[f]:e.target.value}));

  async function cargar() {
    try {
      setLoading(true);
      const d = await db("seguridad","GET",null,"?order=estado.desc,caducidad.asc.nullslast,equipo.asc");
      setItems(d);
    } catch(e){} finally { setLoading(false); }
  }
  useEffect(()=>{ cargar(); },[]);

  async function guardar() {
    if (!form.equipo) return;
    setSaving(true);
    try {
      const payload = { ...form, caducidad: form.caducidad||null };
      if (editItem) { await db(`seguridad?id=eq.${editItem}`,"PATCH",payload); setEditItem(null); }
      else { await db("seguridad","POST",payload); }
      setShowForm(false); setForm(FORM_INIT); cargar();
    } catch(e){ alert("Error: "+e.message); } finally { setSaving(false); }
  }

  async function cambiarEstado(id, estado) {
    try { await db(`seguridad?id=eq.${id}`,"PATCH",{ estado }); cargar(); }
    catch(e){}
  }

  async function eliminar(id) {
    if (!window.confirm("¿Eliminar este equipo?")) return;
    try { await db(`seguridad?id=eq.${id}`,"DELETE"); cargar(); } catch(e){}
  }

  function editar(item) {
    setForm({ equipo:item.equipo||"", caducidad:item.caducidad||"",
      ubicacion:item.ubicacion||"", estado:item.estado||"ok", notas:item.notas||"" });
    setEditItem(item.id); setShowForm(true);
  }

  // Calcular estado por caducidad automáticamente
  function estadoReal(item) {
    if (item.estado === "danger") return "danger";
    if (!item.caducidad) return item.estado||"ok";
    const hoy = new Date();
    const cad = new Date(item.caducidad);
    const dias = Math.floor((cad - hoy) / (1000*60*60*24));
    if (dias < 0)  return "danger"; // caducado
    if (dias < 60) return "warn";   // caduca en menos de 60 días
    return item.estado||"ok";
  }

  function diasParaCaducar(caducidad) {
    if (!caducidad) return null;
    const dias = Math.floor((new Date(caducidad) - new Date()) / (1000*60*60*24));
    if (dias < 0) return "CADUCADO";
    if (dias === 0) return "Caduca hoy";
    if (dias < 60) return `${dias}d`;
    return null;
  }

  const ESTADOS = ["ok","warn","danger"];
  const ESTADO_LABEL = { ok:"OK", warn:"Revisar", danger:"Urgente" };
  const ESTADO_COLOR = { ok:T.ok, warn:T.warn, danger:T.danger };

  // Proximamente = caducan en 60 días o ya caducados
  const proximos = items.filter(i => estadoReal(i) !== "ok");
  const obligatorios = items.filter(i => !i.notas?.startsWith("Recomendado"));
  const recomendados = items.filter(i => i.notas?.startsWith("Recomendado"));

  const CONTACTOS = [
    { label:"Salvamento Marítimo",      tel:"900 202 202",     color:T.danger },
    { label:"Capitanía Marítima Málaga",tel:"+34 952 121 234", color:T.info   },
    { label:"Puerto Caleta de Vélez",   tel:"+34 952 551 418", color:T.info   },
    { label:"Guardia Civil Mar",        tel:"900 202 202",     color:T.warn   },
    { label:"Seguro náutico",           tel:"—",               color:T.inkMid },
    { label:"Taller náutico confianza", tel:"—",               color:T.inkMid },
  ];

  const TABS = [
    { id:"equipos",   label:"Equipos" },
    { id:"caducidades", label:`Alertas${proximos.length>0?" ("+proximos.length+")":""}` },
    { id:"contactos", label:"Contactos" },
  ];

  return (
    <div>
      <Hdr title="Seguridad"
        action={tab==="equipos" && <Btn sm onClick={()=>{ setShowForm(!showForm); setEditItem(null); setForm(FORM_INIT); }}>
          {showForm&&!editItem?"Cancelar":"+ Añadir"}
        </Btn>}/>

      {/* Tabs */}
      <div style={{display:"flex",background:T.bg,borderRadius:7,padding:3,gap:3,
        marginBottom:18,border:`1px solid ${T.rimHi}`}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1, padding:"8px 4px", borderRadius:5, border:"none", cursor:"pointer",
            background:tab===t.id?T.surface:"transparent",
            color:tab===t.id?T.ink:T.inkDim, fontSize:11.5,
            fontWeight:tab===t.id?600:400, fontFamily:"inherit",
            boxShadow:tab===t.id?"0 1px 3px rgba(0,0,0,0.12)":"none",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── TAB EQUIPOS ── */}
      {tab==="equipos" && (
        <div>
          {showForm && (
            <Card style={{marginBottom:14}} pad="16px">
              <div style={{fontSize:11,color:T.brass,fontWeight:700,marginBottom:12,
                textTransform:"uppercase",letterSpacing:1,fontFamily:"'DM Mono',monospace"}}>
                {editItem?"Editar equipo":"Nuevo equipo"}
              </div>
              <FInput label="Equipo *" value={form.equipo} onChange={upd("equipo")}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <FInput label="Caducidad" type="date" value={form.caducidad} onChange={upd("caducidad")}/>
                <FInput label="Ubicación" value={form.ubicacion} onChange={upd("ubicacion")}/>
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
                  fontFamily:"'DM Mono',monospace",marginBottom:5}}>Estado</div>
                <div style={{display:"flex",gap:6}}>
                  {ESTADOS.map(e=>(
                    <button key={e} onClick={()=>setForm(f=>({...f,estado:e}))} style={{
                      flex:1, padding:"8px", borderRadius:6, cursor:"pointer", fontSize:11,
                      fontFamily:"inherit", fontWeight:form.estado===e?700:400,
                      border:`1px solid ${form.estado===e?ESTADO_COLOR[e]:T.rimHi}`,
                      background:form.estado===e?ESTADO_COLOR[e]+"15":"transparent",
                      color:form.estado===e?ESTADO_COLOR[e]:T.inkDim,
                    }}>{ESTADO_LABEL[e]}</button>
                  ))}
                </div>
              </div>
              <FTextarea label="Notas (empieza por 'Recomendado' si no es obligatorio)" value={form.notas} onChange={upd("notas")}/>
              <div style={{display:"flex",gap:8}}>
                <Btn onClick={guardar}>{saving?"Guardando...":editItem?"Actualizar":"Guardar"}</Btn>
                <Btn variant="ghost" onClick={()=>{setShowForm(false);setEditItem(null);}}>Cancelar</Btn>
              </div>
            </Card>
          )}

          {loading ? <Card><div style={{color:T.inkDim,fontSize:13,textAlign:"center",padding:"20px 0"}}>Cargando...</div></Card> : (
            <div>
              {/* Obligatorios */}
              <div style={{fontSize:9.5,color:T.brass,letterSpacing:2,textTransform:"uppercase",
                fontFamily:"'DM Mono',monospace",marginBottom:9}}>Obligatorios · RD 339/2021</div>
              {obligatorios.map(item=>{
                const est = estadoReal(item);
                const dias = diasParaCaducar(item.caducidad);
                return (
                  <Card key={item.id} style={{marginBottom:7}} pad="12px 16px">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{flex:1,marginRight:8}}>
                        <div style={{color:T.ink,fontWeight:500,fontSize:13}}>{item.equipo}</div>
                        <div style={{color:T.inkDim,fontSize:9.5,marginTop:2,fontFamily:"'DM Mono',monospace"}}>
                          {item.ubicacion||"--"}
                          {item.caducidad ? ` · Vence ${item.caducidad}` : ""}
                          {dias ? <span style={{color:ESTADO_COLOR[est],fontWeight:700}}> · {dias}</span> : ""}
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                        <Signal estado={est}/>
                        <button onClick={()=>editar(item)} style={{background:"none",
                          border:`1px solid ${T.rimHi}`,borderRadius:5,padding:"3px 6px",
                          color:T.inkDim,fontSize:10,cursor:"pointer"}}>✏️</button>
                        <button onClick={()=>eliminar(item.id)} style={{background:"none",
                          border:`1px solid ${T.danger}40`,borderRadius:5,padding:"3px 6px",
                          color:T.danger,fontSize:10,cursor:"pointer"}}>✕</button>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {/* Recomendados */}
              {recomendados.length > 0 && (
                <div>
                  <div style={{fontSize:9.5,color:T.inkDim,letterSpacing:2,textTransform:"uppercase",
                    fontFamily:"'DM Mono',monospace",margin:"18px 0 9px"}}>Recomendados</div>
                  {recomendados.map(item=>{
                    const est = estadoReal(item);
                    return (
                      <Card key={item.id} style={{marginBottom:7}} pad="12px 16px">
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{flex:1,marginRight:8}}>
                            <div style={{color:T.ink,fontWeight:500,fontSize:13}}>{item.equipo}</div>
                            <div style={{color:T.inkDim,fontSize:9.5,marginTop:2,fontFamily:"'DM Mono',monospace"}}>
                              {item.ubicacion||"--"}
                              {item.caducidad ? ` · Vence ${item.caducidad}` : ""}
                            </div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <Signal estado={est}/>
                            <button onClick={()=>editar(item)} style={{background:"none",
                              border:`1px solid ${T.rimHi}`,borderRadius:5,padding:"3px 6px",
                              color:T.inkDim,fontSize:10,cursor:"pointer"}}>✏️</button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── TAB CADUCIDADES ── */}
      {tab==="caducidades" && (
        <div>
          {proximos.length === 0 ? (
            <Card>
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:28,marginBottom:8}}>✅</div>
                <div style={{color:T.ok,fontWeight:600,fontSize:14}}>Todo en orden</div>
                <div style={{color:T.inkDim,fontSize:12,marginTop:4}}>Ningún equipo caduca en los próximos 60 días</div>
              </div>
            </Card>
          ) : (
            proximos.sort((a,b)=>{
              const da = a.caducidad ? new Date(a.caducidad) : new Date("2099-01-01");
              const db2 = b.caducidad ? new Date(b.caducidad) : new Date("2099-01-01");
              return da - db2;
            }).map(item=>{
              const est = estadoReal(item);
              const dias = diasParaCaducar(item.caducidad);
              return (
                <Card key={item.id} style={{marginBottom:9,
                  borderLeft:`3px solid ${ESTADO_COLOR[est]}`}} pad="14px 16px">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <div style={{color:T.ink,fontWeight:600,fontSize:13}}>{item.equipo}</div>
                      <div style={{color:T.inkDim,fontSize:10,marginTop:3,fontFamily:"'DM Mono',monospace"}}>
                        {item.ubicacion||"--"} · Vence {item.caducidad||"sin fecha"}
                      </div>
                      {item.notas && <div style={{color:T.inkDim,fontSize:11,marginTop:5,lineHeight:1.4}}>{item.notas}</div>}
                    </div>
                    <div style={{textAlign:"right",flexShrink:0,marginLeft:10}}>
                      <div style={{color:ESTADO_COLOR[est],fontWeight:700,fontSize:12,
                        fontFamily:"'DM Mono',monospace"}}>{dias}</div>
                      <button onClick={()=>cambiarEstado(item.id,"ok")} style={{
                        marginTop:8,background:T.ok+"15",border:`1px solid ${T.ok}40`,
                        borderRadius:5,padding:"4px 10px",color:T.ok,fontSize:10,
                        cursor:"pointer",fontFamily:"inherit"}}>Renovado ✓</button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* ── TAB CONTACTOS ── */}
      {tab==="contactos" && (
        <div>
          <Card pad="0 18px" style={{marginBottom:18}}>
            {CONTACTOS.map((c,i)=>(
              <div key={c.label}>{i>0&&<Divider/>}
                <div style={{display:"flex",justifyContent:"space-between",
                  alignItems:"center",padding:"13px 0"}}>
                  <span style={{color:T.inkMid,fontSize:13}}>{c.label}</span>
                  <a href={`tel:${c.tel}`} style={{
                    color:c.color,fontSize:13,fontWeight:600,
                    fontFamily:"'DM Mono',monospace",textDecoration:"none"}}>
                    {c.tel}
                  </a>
                </div>
              </div>
            ))}
          </Card>
          <div style={{background:T.danger+"10",border:`1px solid ${T.danger}25`,
            borderRadius:8,padding:"14px 16px"}}>
            <div style={{color:T.danger,fontWeight:700,fontSize:13,marginBottom:6}}>
              🚨 En caso de emergencia
            </div>
            <div style={{color:T.inkMid,fontSize:12,lineHeight:1.6}}>
              1. Activa el DSC del VHF (canal 16) con Mayday<br/>
              2. Activa la EPIRB si hay riesgo de hundimiento<br/>
              3. Llama al 900 202 202 (Salvamento Marítimo)<br/>
              4. Lanza bengalas en grupos de 2 con intervalo
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function Puertos() {
  const [puertos, setPuertos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nombre:"", tipo:"Visitado", precio:"", telefono:"", valoracion:"4", notas:"", amarre:"" });

  const upd = f => e => setForm(v=>({...v,[f]:e.target.value}));

  async function cargar() {
    try { setLoading(true); const d = await db("puertos","GET",null,"?order=tipo.asc,nombre.asc"); setPuertos(d); }
    catch(e){} finally { setLoading(false); }
  }
  useEffect(()=>{ cargar(); },[]);

  async function guardar() {
    if (!form.nombre) return;
    setSaving(true);
    try {
      const payload = { ...form, precio:parseFloat(form.precio)||0, valoracion:parseFloat(form.valoracion)||4 };
      if (editItem) { await db(`puertos?id=eq.${editItem}`,"PATCH",payload); setEditItem(null); }
      else { await db("puertos","POST",payload); }
      setShowForm(false);
      setForm({ nombre:"", tipo:"Visitado", precio:"", telefono:"", valoracion:"4", notas:"", amarre:"" });
      cargar();
    } catch(e){ alert("Error: "+e.message); } finally { setSaving(false); }
  }

  async function eliminar(id) {
    if (!window.confirm("¿Eliminar este puerto?")) return;
    try { await db(`puertos?id=eq.${id}`,"DELETE"); cargar(); } catch(e){}
  }

  function editar(p) {
    setForm({ nombre:p.nombre||"", tipo:p.tipo||"Visitado", precio:p.precio||"", telefono:p.telefono||"", valoracion:p.valoracion||"4", notas:p.notas||"", amarre:p.amarre||"" });
    setEditItem(p.id); setShowForm(true);
  }

  return (
    <div>
      <Hdr title="Puertos y Amarres"
        action={<Btn sm onClick={()=>{ setShowForm(!showForm); setEditItem(null); }}>{showForm&&!editItem?"Cancelar":"+ Añadir"}</Btn>}/>

      {showForm && (
        <Card style={{marginBottom:14}} pad="16px">
          <div style={{fontSize:11,color:T.brass,fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:1,fontFamily:"'DM Mono',monospace"}}>{editItem?"Editar puerto":"Nuevo puerto"}</div>
          <FInput label="Nombre *" value={form.nombre} onChange={upd("nombre")}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div>
              <FInput label="Precio/noche (€)" type="number" value={form.precio} onChange={upd("precio")}/>
              <FInput label="Teléfono" value={form.telefono} onChange={upd("telefono")}/>
              <FInput label="Nº amarre" value={form.amarre} onChange={upd("amarre")}/>
            </div>
            <div>
              <FInput label="Valoración (1-5)" type="number" value={form.valoracion} onChange={upd("valoracion")}/>
              <FSelect label="Tipo" value={form.tipo} onChange={upd("tipo")} options={["Visitado","Base","Favorito"]}/>
            </div>
          </div>
          <FTextarea label="Notas" value={form.notas} onChange={upd("notas")}/>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={guardar}>{saving?"Guardando...":editItem?"Actualizar":"Guardar"}</Btn>
            <Btn variant="ghost" onClick={()=>{setShowForm(false);setEditItem(null);}}>Cancelar</Btn>
          </div>
        </Card>
      )}

      {loading ? <Card><div style={{color:T.inkDim,fontSize:13,textAlign:"center",padding:"20px 0"}}>Cargando...</div></Card>
      : puertos.map(p=>(
        <Card key={p.id} style={{marginBottom:11}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div style={{flex:1}}>
              <div style={{fontSize:9.5,color:p.tipo==="Base"?T.brass:T.info,letterSpacing:1.5,fontFamily:"'DM Mono',monospace",marginBottom:4}}>{p.tipo?.toUpperCase()}</div>
              <div style={{color:T.ink,fontWeight:600,fontSize:17,fontFamily:"'Cormorant Garamond',serif"}}>{p.nombre}</div>
              <div style={{color:T.inkDim,fontSize:10,marginTop:3,fontFamily:"'DM Mono',monospace"}}>{p.telefono||"--"}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{color:T.brassLt,fontSize:17,fontWeight:600,fontFamily:"'Cormorant Garamond',serif"}}>{p.precio||0}€<span style={{fontSize:10,color:T.inkDim}}>{p.tipo==="Base"?"/mes":"/noche"}</span></div>
              <div style={{color:T.inkDim,fontSize:10,marginTop:2,fontFamily:"'DM Mono',monospace"}}>★ {p.valoracion||"--"}</div>
            </div>
          </div>
          {p.amarre&&<div style={{display:"inline-flex",background:T.brassDim,border:`1px solid ${T.brass}35`,borderRadius:4,padding:"2px 8px",color:T.brassLt,fontSize:9.5,fontFamily:"'DM Mono',monospace",marginBottom:7}}>Amarre {p.amarre}</div>}
          {p.notas&&<div style={{color:T.inkDim,fontSize:12,lineHeight:1.4,marginBottom:8}}>{p.notas}</div>}
          <div style={{display:"flex",gap:7}}>
            <button onClick={()=>editar(p)} style={{background:"none",border:`1px solid ${T.rimHi}`,borderRadius:5,padding:"4px 10px",color:T.inkDim,fontSize:11,cursor:"pointer"}}>✏️ Editar</button>
            <button onClick={()=>eliminar(p.id)} style={{background:"none",border:`1px solid ${T.danger}40`,borderRadius:5,padding:"4px 10px",color:T.danger,fontSize:11,cursor:"pointer"}}>✕ Eliminar</button>
          </div>
        </Card>
      ))}
    </div>
  );
}
function Inventario() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ categoria:"Motor", articulo:"", cantidad:"1", minimo:"1", notas:"" });

  const CATS = ["Electricidad","Fontanería","Herramientas","Jarcia y cubierta","Limpieza","Motor","Navegación","Seguridad"];
  const upd = f => e => setForm(v=>({...v,[f]:e.target.value}));

  async function cargar() {
    try { setLoading(true); const d = await db("inventario","GET",null,"?order=categoria.asc,articulo.asc"); setItems(d); }
    catch(e){} finally { setLoading(false); }
  }
  useEffect(()=>{ cargar(); },[]);

  async function cambiarQty(id, qty) {
    const newQty = Math.max(0,qty);
    try {
      await db(`inventario?id=eq.${id}`,"PATCH",{ cantidad:newQty, estado:newQty===0?"danger":"ok" });
      setItems(prev=>prev.map(i=>i.id===id?{...i,cantidad:newQty,estado:newQty===0?"danger":"ok"}:i));
    } catch(e){}
  }

  async function guardar() {
    if (!form.articulo) return;
    setSaving(true);
    try {
      const qty = parseInt(form.cantidad)||0;
      const payload = { ...form, cantidad:qty, minimo:parseInt(form.minimo)||1, estado:qty===0?"danger":"ok" };
      if (editItem) { await db(`inventario?id=eq.${editItem}`,"PATCH",payload); setEditItem(null); }
      else { await db("inventario","POST",payload); }
      setShowForm(false);
      setForm({ categoria:"Motor", articulo:"", cantidad:"1", minimo:"1", notas:"" });
      cargar();
    } catch(e){ alert("Error: "+e.message); } finally { setSaving(false); }
  }

  async function eliminar(id) {
    if (!window.confirm("¿Eliminar este artículo?")) return;
    try { await db(`inventario?id=eq.${id}`,"DELETE"); cargar(); } catch(e){}
  }

  function editar(item) {
    setForm({ categoria:item.categoria||"Motor", articulo:item.articulo||"", cantidad:item.cantidad||"0", minimo:item.minimo||"1", notas:item.notas||"" });
    setEditItem(item.id); setShowForm(true);
  }

  const cats = [...new Set(items.map(i=>i.categoria))].sort();
  const issues = items.filter(i=>i.estado!=="ok").length;

  return (
    <div>
      <Hdr title="Inventario"
        action={<Btn sm onClick={()=>{ setShowForm(!showForm); setEditItem(null); }}>{showForm&&!editItem?"Cancelar":"+ Añadir"}</Btn>}/>

      {issues>0 && <div style={{background:T.warn+"10",border:`1px solid ${T.warn}28`,borderRadius:8,padding:"11px 15px",marginBottom:14}}>
        <div style={{color:T.warn,fontSize:12,fontWeight:600}}>{issues} artículos con stock bajo o agotado</div>
      </div>}

      {showForm && (
        <Card style={{marginBottom:14}} pad="16px">
          <div style={{fontSize:11,color:T.brass,fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:1,fontFamily:"'DM Mono',monospace"}}>{editItem?"Editar artículo":"Nuevo artículo"}</div>
          <FSelect label="Categoría" value={form.categoria} onChange={upd("categoria")} options={CATS}/>
          <FInput label="Artículo *" value={form.articulo} onChange={upd("articulo")}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <FInput label="Cantidad" type="number" value={form.cantidad} onChange={upd("cantidad")}/>
            <FInput label="Mínimo" type="number" value={form.minimo} onChange={upd("minimo")}/>
          </div>
          <FInput label="Notas" value={form.notas} onChange={upd("notas")}/>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={guardar}>{saving?"Guardando...":editItem?"Actualizar":"Guardar"}</Btn>
            <Btn variant="ghost" onClick={()=>{setShowForm(false);setEditItem(null);}}>Cancelar</Btn>
          </div>
        </Card>
      )}

      {loading ? <Card><div style={{color:T.inkDim,fontSize:13,textAlign:"center",padding:"20px 0"}}>Cargando...</div></Card>
      : cats.map(cat=>(
        <div key={cat} style={{marginBottom:18}}>
          <div style={{fontSize:9.5,color:T.brass,letterSpacing:2,textTransform:"uppercase",fontFamily:"'DM Mono',monospace",marginBottom:9}}>{cat}</div>
          {items.filter(i=>i.categoria===cat).map(item=>(
            <Card key={item.id} style={{marginBottom:6}} pad="11px 15px">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{flex:1,minWidth:0,marginRight:8}}>
                  <div style={{color:T.ink,fontSize:13,fontWeight:500}}>{item.articulo}</div>
                  <div style={{color:T.inkDim,fontSize:9.5,marginTop:2,fontFamily:"'DM Mono',monospace"}}>Mín: {item.minimo} ud.</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                  <button onClick={()=>cambiarQty(item.id,item.cantidad-1)}
                    style={{width:26,height:26,borderRadius:5,border:`1px solid ${T.rimHi}`,background:T.surfaceUp,color:T.ink,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                  <span style={{color:item.cantidad===0?T.danger:item.cantidad<=item.minimo?T.warn:T.ok,
                    fontSize:17,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",minWidth:22,textAlign:"center"}}>{item.cantidad}</span>
                  <button onClick={()=>cambiarQty(item.id,item.cantidad+1)}
                    style={{width:26,height:26,borderRadius:5,border:`1px solid ${T.rimHi}`,background:T.surfaceUp,color:T.ink,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  <button onClick={()=>editar(item)} style={{background:"none",border:`1px solid ${T.rimHi}`,borderRadius:5,padding:"3px 6px",color:T.inkDim,fontSize:10,cursor:"pointer",marginLeft:3}}>✏️</button>
                  <button onClick={()=>eliminar(item.id)} style={{background:"none",border:`1px solid ${T.danger}40`,borderRadius:5,padding:"3px 6px",color:T.danger,fontSize:10,cursor:"pointer"}}>✕</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}
function Documentos() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ nombre:"", tipo:"Oficial", fecha_emision:"", fecha_vencimiento:"", notas:"" });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef(null);

  const upd = f => e => setForm(v=>({...v,[f]:e.target.value}));

  async function cargar() {
    try { setLoading(true); const d = await db("documentos","GET",null,"?order=tipo.asc,nombre.asc"); setDocs(d); }
    catch(e){} finally { setLoading(false); }
  }
  useEffect(()=>{ cargar(); },[]);

  async function subir() {
    if (!form.nombre) return;
    setUploading(true);
    try {
      let url_archivo = null;
      if (selectedFile) {
        // Upload to Supabase Storage
        const ext = selectedFile.name.split('.').pop();
        const filename = `${Date.now()}-${form.nombre.replace(/\s+/g,'-')}.${ext}`;
        const uploadRes = await fetch(`${SUPA_URL}/storage/v1/object/documentos/${filename}`, {
          method:"POST",
          headers: { "apikey":SUPA_KEY, "Authorization":`Bearer ${SUPA_KEY}`, "Content-Type":selectedFile.type, "x-upsert":"true" },
          body: selectedFile
        });
        if (uploadRes.ok) {
          url_archivo = `${SUPA_URL}/storage/v1/object/public/documentos/${filename}`;
        }
      }
      await db("documentos","POST",{ ...form, url_archivo,
        fecha_emision:form.fecha_emision||null, fecha_vencimiento:form.fecha_vencimiento||null });
      setShowForm(false);
      setSelectedFile(null);
      setForm({ nombre:"", tipo:"Oficial", fecha_emision:"", fecha_vencimiento:"", notas:"" });
      cargar();
    } catch(e){ alert("Error: "+e.message); } finally { setUploading(false); }
  }

  async function eliminar(id) {
    if (!window.confirm("¿Eliminar este documento?")) return;
    try { await db(`documentos?id=eq.${id}`,"DELETE"); cargar(); } catch(e){}
  }

  const TIPOS = ["Oficial","Seguro","Inspección","Titulación","Mantenimiento","Otro"];

  return (
    <div>
      <Hdr title="Documentos"
        action={<Btn sm onClick={()=>setShowForm(!showForm)}>{showForm?"Cancelar":"+ Subir"}</Btn>}/>

      {showForm && (
        <Card style={{marginBottom:14}} pad="16px">
          <div style={{fontSize:11,color:T.brass,fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:1,fontFamily:"'DM Mono',monospace"}}>Nuevo documento</div>
          <FInput label="Nombre *" value={form.nombre} onChange={upd("nombre")}/>
          <FSelect label="Tipo" value={form.tipo} onChange={upd("tipo")} options={TIPOS}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <FInput label="Fecha emisión" type="date" value={form.fecha_emision} onChange={upd("fecha_emision")}/>
            <FInput label="Fecha vencimiento" type="date" value={form.fecha_vencimiento} onChange={upd("fecha_vencimiento")}/>
          </div>
          <FTextarea label="Notas" value={form.notas} onChange={upd("notas")}/>

          {/* File picker */}
          <div style={{marginBottom:12}}>
            <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"'DM Mono',monospace",marginBottom:6}}>Archivo (PDF, imagen)</div>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={e=>setSelectedFile(e.target.files[0]||null)}
              style={{display:"none"}}/>
            <button onClick={()=>fileRef.current?.click()} style={{
              width:"100%",background:T.surfaceUp,border:`1px dashed ${T.rimHi}`,
              borderRadius:7,padding:"12px",color:selectedFile?T.brass:T.inkDim,
              fontSize:13,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>
              {selectedFile ? `📎 ${selectedFile.name}` : "Toca para seleccionar archivo"}
            </button>
          </div>

          <div style={{display:"flex",gap:8}}>
            <Btn onClick={subir}>{uploading?"Subiendo...":"Guardar documento"}</Btn>
            <Btn variant="ghost" onClick={()=>{setShowForm(false);setSelectedFile(null);}}>Cancelar</Btn>
          </div>
        </Card>
      )}

      {loading ? <Card><div style={{color:T.inkDim,fontSize:13,textAlign:"center",padding:"20px 0"}}>Cargando...</div></Card>
      : docs.length===0 ? (
        <Card>
          <div style={{color:T.inkDim,fontSize:13,fontStyle:"italic",textAlign:"center",padding:"12px 0"}}>
            Sin documentos. Pulsa "+ Subir" para añadir.
          </div>
        </Card>
      ) : docs.map((d,i)=>(
        <Card key={d.id} style={{marginBottom:7}} pad="12px 16px">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{flex:1}}>
              <div style={{color:T.ink,fontWeight:500,fontSize:13}}>{d.nombre}</div>
              <div style={{color:T.inkDim,fontSize:9.5,marginTop:3,fontFamily:"'DM Mono',monospace"}}>
                {d.tipo}{d.fecha_emision?` · ${d.fecha_emision}`:""}{d.fecha_vencimiento?` · Vence: ${d.fecha_vencimiento}`:""}
              </div>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              {d.url_archivo && (
                <a href={d.url_archivo} target="_blank" rel="noopener noreferrer"
                  style={{background:T.brassDim,border:`1px solid ${T.brass}35`,borderRadius:5,
                    padding:"4px 10px",color:T.brass,fontSize:11,textDecoration:"none",fontWeight:600}}>Ver</a>
              )}
              <button onClick={()=>eliminar(d.id)} style={{background:"none",border:`1px solid ${T.danger}40`,borderRadius:5,padding:"4px 8px",color:T.danger,fontSize:11,cursor:"pointer"}}>✕</button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
// ── COMPARTIR DOCUMENTACIÓN ───────────────────────────────────────────────────
function CompartirDocsDrawer({ tripulantes, onClose }) {
  const [seleccionados, setSeleccionados] = useState([]);
  const [sharing, setSharing] = useState(false);
  const [status, setStatus] = useState(null); // null | 'downloading' | 'done' | 'error' | 'unsupported'

  function toggleTrip(id) {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  function selectAll() {
    setSeleccionados(tripulantes.map(t => t.id));
  }

  // Collect all docs from selected tripulantes
  function getDocsPendientes() {
    return tripulantes
      .filter(t => seleccionados.includes(t.id))
      .flatMap(t => (t.docs || []).map(d => ({ ...d, tripulante: t.alias || t.nombre })));
  }

  async function fetchFileAsBlob(url, nombre) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      // Try to infer extension from Content-Type or URL
      let ext = '';
      const ct = blob.type;
      if (ct.includes('pdf')) ext = '.pdf';
      else if (ct.includes('jpeg') || ct.includes('jpg')) ext = '.jpg';
      else if (ct.includes('png')) ext = '.png';
      else {
        const urlExt = url.split('.').pop().split('?')[0].toLowerCase();
        if (['pdf','jpg','jpeg','png','doc','docx'].includes(urlExt)) ext = '.'+urlExt;
        else ext = '.pdf';
      }
      const filename = `${nombre}${ext}`;
      return new File([blob], filename, { type: blob.type || 'application/pdf' });
    } catch(e) {
      console.error('fetch error', url, e);
      return null;
    }
  }

  async function compartir() {
    const docs = getDocsPendientes().filter(d => d.url_archivo);
    if (docs.length === 0) {
      setStatus('nodocs');
      return;
    }

    // Check Web Share API support
    if (!navigator.share) {
      setStatus('unsupported');
      return;
    }

    setSharing(true);
    setStatus('downloading');

    try {
      // Download all files as Blobs
      const files = (await Promise.all(
        docs.map(d => {
          const nombre = `${d.tripulante}_${d.nombre.replace(/\s+/g, '_')}`;
          return fetchFileAsBlob(d.url_archivo, nombre);
        })
      )).filter(Boolean);

      if (files.length === 0) {
        setStatus('error');
        setSharing(false);
        return;
      }

      setStatus(null);

      // Try sharing files directly
      // iOS Safari supports PDF files via share
      const canShareFiles = navigator.canShare && navigator.canShare({ files });

      if (canShareFiles) {
        await navigator.share({
          title: `Documentación tripulación · Leonidas`,
          text: `Documentos de: ${seleccionados
            .map(id => tripulantes.find(t => t.id === id))
            .filter(Boolean)
            .map(t => t.alias || t.nombre)
            .join(', ')}`,
          files,
        });
      } else {
        // Fallback: share URLs as text if files not supported
        const urls = docs.map(d =>
          `${d.tripulante} – ${d.nombre}: ${d.url_archivo}`
        ).join('\n');
        await navigator.share({
          title: `Documentación tripulación · Leonidas`,
          text: urls,
        });
      }
      setStatus('done');
    } catch(e) {
      if (e.name !== 'AbortError') {
        console.error(e);
        setStatus('error');
      }
    } finally {
      setSharing(false);
    }
  }

  const docs = getDocsPendientes();
  const docsConArchivo = docs.filter(d => d.url_archivo);
  const tripSelec = tripulantes.filter(t => seleccionados.includes(t.id));

  return (
    <div style={{ position:"fixed", inset:0, zIndex:400 }}>
      {/* overlay */}
      <div onClick={onClose}
        style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)" }}/>

      {/* sheet */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0,
        background:T.surface, borderRadius:"20px 20px 0 0",
        maxHeight:"88dvh", display:"flex", flexDirection:"column",
        animation:"slideUp 0.25s ease" }}>

        {/* handle */}
        <div style={{ padding:"12px 0 0", display:"flex",
          justifyContent:"center", flexShrink:0 }}>
          <div style={{ width:36, height:4, background:T.rim, borderRadius:2 }}/>
        </div>

        {/* header */}
        <div style={{ padding:"14px 20px 12px", display:"flex",
          alignItems:"center", justifyContent:"space-between", flexShrink:0,
          borderBottom:`0.5px solid ${T.rim}` }}>
          <div>
            <div style={{ fontSize:18, fontWeight:500, color:T.ink }}>
              Compartir documentación
            </div>
            <div style={{ fontSize:11, color:T.inkDim, marginTop:2 }}>
              Selecciona los tripulantes
            </div>
          </div>
          <button onClick={onClose}
            style={{ background:"none", border:"none", fontSize:22,
              color:T.inkDim, cursor:"pointer", padding:"2px 6px", lineHeight:1 }}>
            ×
          </button>
        </div>

        {/* tripulante list — scrollable */}
        <div style={{ flex:1, overflowY:"auto", padding:"12px 20px" }}>

          {/* select all */}
          <button onClick={selectAll}
            style={{ background:"none", border:"none", color:T.brass,
              fontSize:13, fontWeight:500, cursor:"pointer",
              padding:"0 0 12px", fontFamily:"inherit" }}>
            Seleccionar todos
          </button>

          {tripulantes.map(t => {
            const sel = seleccionados.includes(t.id);
            const docsT = (t.docs || []).filter(d => d.url_archivo);
            return (
              <div key={t.id}
                onClick={() => toggleTrip(t.id)}
                style={{ display:"flex", alignItems:"center", gap:14,
                  padding:"12px 0",
                  borderBottom:`0.5px solid ${T.rim}`,
                  cursor:"pointer" }}>

                {/* checkbox */}
                <div style={{ width:22, height:22, borderRadius:6, flexShrink:0,
                  background: sel ? T.ink : "transparent",
                  border: `1.5px solid ${sel ? T.ink : T.rim}`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {sel && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="#fff" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>

                {/* info */}
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:500, color:T.ink }}>
                    {t.nombre} {t.apellidos}
                  </div>
                  <div style={{ fontSize:11, color:T.inkDim, marginTop:2 }}>
                    {t.rol}
                    {docsT.length > 0
                      ? ` · ${docsT.length} doc${docsT.length > 1 ? 's' : ''} adjunto${docsT.length > 1 ? 's' : ''}`
                      : ' · Sin documentos adjuntos'}
                  </div>
                  {/* doc names preview */}
                  {sel && docsT.length > 0 && (
                    <div style={{ marginTop:6, display:"flex",
                      flexWrap:"wrap", gap:5 }}>
                      {docsT.map(d => (
                        <span key={d.id} style={{ fontSize:10,
                          background:T.brassDim, color:T.brassLt,
                          padding:"2px 8px", borderRadius:20 }}>
                          {d.nombre}
                        </span>
                      ))}
                    </div>
                  )}
                  {sel && docsT.length === 0 && (
                    <div style={{ marginTop:4, fontSize:10, color:T.warn }}>
                      No hay archivos subidos para este tripulante
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* summary + CTA */}
        <div style={{ padding:"14px 20px 40px", flexShrink:0,
          borderTop:`0.5px solid ${T.rim}` }}>

          {/* status messages */}
          {status === 'unsupported' && (
            <div style={{ fontSize:12, color:T.warn, marginBottom:10,
              padding:"10px 14px", background:T.warn+"10",
              borderRadius:10, lineHeight:1.5 }}>
              Tu navegador no soporta compartir archivos. Puedes abrir cada
              documento individualmente desde el perfil del tripulante.
            </div>
          )}
          {status === 'error' && (
            <div style={{ fontSize:12, color:T.danger, marginBottom:10,
              padding:"10px 14px", background:T.danger+"10",
              borderRadius:10 }}>
              Error al descargar algunos archivos. Comprueba la conexión.
            </div>
          )}
          {status === 'nodocs' && (
            <div style={{ fontSize:12, color:T.warn, marginBottom:10,
              padding:"10px 14px", background:T.warn+"10",
              borderRadius:10 }}>
              Los tripulantes seleccionados no tienen archivos subidos.
            </div>
          )}
          {status === 'done' && (
            <div style={{ fontSize:12, color:T.ok, marginBottom:10,
              padding:"10px 14px", background:T.ok+"10",
              borderRadius:10 }}>
              ¡Enviado correctamente!
            </div>
          )}
          {status === 'downloading' && (
            <div style={{ fontSize:12, color:T.inkDim, marginBottom:10,
              padding:"10px 14px", background:T.surfaceUp,
              borderRadius:10 }}>
              Preparando archivos…
            </div>
          )}

          {/* summary */}
          {seleccionados.length > 0 && docsConArchivo.length > 0 && (
            <div style={{ fontSize:12, color:T.inkDim, marginBottom:12 }}>
              {docsConArchivo.length} archivo{docsConArchivo.length > 1 ? 's' : ''} de{' '}
              {tripSelec.map(t => t.alias || t.nombre).join(', ')}
            </div>
          )}

          <button
            onClick={compartir}
            disabled={seleccionados.length === 0 || sharing}
            style={{ width:"100%", background: seleccionados.length > 0 ? T.ink : T.rim,
              color: seleccionados.length > 0 ? "#fff" : T.inkDim,
              border:"none", borderRadius:12, padding:"14px",
              fontSize:14, fontWeight:500, cursor: seleccionados.length > 0 ? "pointer" : "default",
              fontFamily:"inherit",
              display:"flex", alignItems:"center",
              justifyContent:"center", gap:8 }}>
            {sharing ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Preparando…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {seleccionados.length === 0
                  ? "Selecciona tripulantes"
                  : `Compartir ${docsConArchivo.length > 0 ? docsConArchivo.length + ' archivo' + (docsConArchivo.length > 1 ? 's' : '') : 'documentación'}`}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Tripulacion() {
  const [tripulantes, setTripulantes] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [openCard, setOpenCard]       = useState(null);
  const [showForm, setShowForm]       = useState(false);
  const [editId, setEditId]           = useState(null);
  const [showDocForm, setShowDocForm] = useState(null);
  const [saving, setSaving]           = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCompartir, setShowCompartir] = useState(false);

  const FORM_INIT = { nombre:"", apellidos:"", alias:"", rol:"Invitado", telefono:"", email:"", notas:"" };
  const DOC_INIT  = { nombre:"", tipo:"DNI", fecha_vencimiento:"" };
  const ROLES     = ["Patrón","Marinero","Armador","Invitado"];
  const DOC_TIPOS = ["DNI","Pasaporte","Titulación náutica","Certificado médico","Seguro médico","Otro"];

  const [form, setForm]       = useState(FORM_INIT);
  const [docForm, setDocForm] = useState(DOC_INIT);
  const upd  = f => e => setForm(v=>({...v,[f]:e.target.value}));
  const updD = f => e => setDocForm(v=>({...v,[f]:e.target.value}));

  async function cargar() {
    try {
      setLoading(true);
      const [trip, bits, bTrip, docs] = await Promise.all([
        db("tripulacion","GET",null,"?order=created_at.asc"),
        db("bitacora","GET",null,"?select=id,hora_salida,hora_llegada,patron"),
        db("bitacora_tripulacion","GET",null,"?select=bitacora_id,tripulante_id"),
        db("documentos","GET",null,"?tripulante_id=not.is.null&select=id,nombre,tipo,fecha_vencimiento,url_archivo,tripulante_id"),
      ]);

      // Calcular stats por tripulante
      const statsMap = {};
      bTrip.forEach(bt => {
        if (!statsMap[bt.tripulante_id]) statsMap[bt.tripulante_id] = { salidas:0, horas:0 };
        statsMap[bt.tripulante_id].salidas++;
        const bit = bits.find(b => b.id === bt.bitacora_id);
        if (bit?.hora_salida && bit?.hora_llegada) {
          const [sh,sm] = bit.hora_salida.split(":").map(Number);
          const [eh,em] = bit.hora_llegada.split(":").map(Number);
          const mins = (eh*60+em) - (sh*60+sm);
          if (mins > 0) statsMap[bt.tripulante_id].horas += mins/60;
        }
      });

      // Añadir salidas como patrón
      bits.forEach(b => {
        const t = trip.find(t => t.alias === b.patron || t.nombre === b.patron);
        if (t) {
          if (!statsMap[t.id]) statsMap[t.id] = { salidas:0, horas:0 };
          // Solo contar si no está ya en bitacora_tripulacion
          const yaContado = bTrip.some(bt => bt.bitacora_id===b.id && bt.tripulante_id===t.id);
          if (!yaContado) {
            statsMap[t.id].salidas++;
            if (b.hora_salida && b.hora_llegada) {
              const [sh,sm] = b.hora_salida.split(":").map(Number);
              const [eh,em] = b.hora_llegada.split(":").map(Number);
              const mins = (eh*60+em) - (sh*60+sm);
              if (mins > 0) statsMap[t.id].horas += mins/60;
            }
          }
        }
      });

      // Docs por tripulante
      const docsMap = {};
      docs.forEach(d => {
        if (!docsMap[d.tripulante_id]) docsMap[d.tripulante_id] = [];
        docsMap[d.tripulante_id].push(d);
      });

      setTripulantes(trip.map(t => ({
        ...t,
        stats: statsMap[t.id] || { salidas:0, horas:0 },
        docs:  docsMap[t.id]  || [],
      })));
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ cargar(); },[]);

  function avatarColor(rol) {
    const map = { "Patrón":T.info, "Armador":T.brass, "Marinero":T.ok, "Invitado":T.inkDim };
    return map[rol] || T.inkDim;
  }

  function initials(nombre, apellidos) {
    const parts = [nombre, apellidos].filter(Boolean).join(" ").split(" ");
    return parts.slice(0,2).map(w=>w[0]).join("").toUpperCase();
  }

  async function guardar() {
    if (!form.nombre) return;
    setSaving(true);
    try {
      const payload = { nombre:form.nombre, apellidos:form.apellidos, alias:form.alias,
        rol:form.rol, telefono:form.telefono, email:form.email, notas:form.notas };
      if (editId) {
        await db(`tripulacion?id=eq.${editId}`,"PATCH", payload);
        setEditId(null);
      } else {
        await db("tripulacion","POST", payload);
      }
      setShowForm(false);
      setForm(FORM_INIT);
      cargar();
    } catch(e){ alert("Error: "+e.message); }
    finally { setSaving(false); }
  }

  async function eliminar(id) {
    if (!window.confirm("¿Eliminar este tripulante?")) return;
    try { await db(`tripulacion?id=eq.${id}`,"DELETE"); cargar(); } catch(e){}
  }

  async function toggleActivo(id, activo) {
    try { await db(`tripulacion?id=eq.${id}`,"PATCH",{ activo:!activo }); cargar(); } catch(e){}
  }

  function editar(t) {
    setForm({ nombre:t.nombre||"", apellidos:t.apellidos||"", alias:t.alias||"",
      rol:t.rol||"Invitado", telefono:t.telefono||"", email:t.email||"", notas:t.notas||"" });
    setEditId(t.id);
    setShowForm(true);
    setOpenCard(null);
  }

  async function subirDoc(tripulanteId) {
    if (!docForm.nombre) return;
    setSaving(true);
    try {
      let url_archivo = null;
      if (selectedFile) {
        const ext = selectedFile.name.split(".").pop();
        const filename = `${Date.now()}-${docForm.nombre.replace(/\s+/g,"-")}.${ext}`;
        const res = await fetch(`${SUPA_URL}/storage/v1/object/documentos/${filename}`, {
          method:"POST",
          headers:{ "apikey":SUPA_KEY, "Authorization":`Bearer ${SUPA_KEY}`,
            "Content-Type":selectedFile.type, "x-upsert":"true" },
          body: selectedFile
        });
        if (res.ok) url_archivo = `${SUPA_URL}/storage/v1/object/public/documentos/${filename}`;
      }
      await db("documentos","POST",{
        nombre:docForm.nombre, tipo:docForm.tipo,
        fecha_vencimiento:docForm.fecha_vencimiento||null,
        url_archivo, tripulante_id:tripulanteId
      });
      setShowDocForm(null);
      setDocForm(DOC_INIT);
      setSelectedFile(null);
      cargar();
    } catch(e){ alert("Error: "+e.message); }
    finally { setSaving(false); }
  }

  async function eliminarDoc(id) {
    if (!window.confirm("¿Eliminar documento?")) return;
    try { await db(`documentos?id=eq.${id}`,"DELETE"); cargar(); } catch(e){}
  }

  const activos   = tripulantes.filter(t=>t.activo);
  const inactivos = tripulantes.filter(t=>!t.activo);

  return (
    <div>
      <Hdr title="Tripulación"
        action={
          <div style={{display:"flex",gap:7}}>
            <button onClick={()=>setShowCompartir(true)}
              style={{ background:"none", border:`0.5px solid ${T.rim}`,
                borderRadius:10, padding:"8px 12px", cursor:"pointer",
                display:"flex", alignItems:"center", gap:6,
                color:T.inkMid, fontSize:12, fontFamily:"inherit" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Compartir docs
            </button>
            <Btn sm onClick={()=>{ setShowForm(!showForm); setEditId(null); setForm(FORM_INIT); }}>
              {showForm&&!editId?"Cancelar":"+ Añadir"}
            </Btn>
          </div>
        }/>

      {showCompartir && (
        <CompartirDocsDrawer
          tripulantes={tripulantes.filter(t=>t.activo)}
          onClose={()=>setShowCompartir(false)}
        />
      )}

      {/* Formulario */}
      {showForm && (
        <Card style={{marginBottom:16}} pad="16px">
          <div style={{fontSize:11,color:T.brass,fontWeight:700,marginBottom:14,
            textTransform:"uppercase",letterSpacing:1,fontFamily:"'DM Mono',monospace"}}>
            {editId?"Editar tripulante":"Nuevo tripulante"}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <FInput label="Nombre *" value={form.nombre} onChange={upd("nombre")}/>
            <FInput label="Apellidos" value={form.apellidos} onChange={upd("apellidos")}/>
            <FInput label="Alias (en bitácora)" value={form.alias} onChange={upd("alias")} placeholder="ej. Guille"/>
            <FSelect label="Rol" value={form.rol} onChange={upd("rol")} options={ROLES}/>
            <FInput label="Teléfono" value={form.telefono} onChange={upd("telefono")}/>
            <FInput label="Email" value={form.email} onChange={upd("email")}/>
          </div>
          <FTextarea label="Notas" value={form.notas} onChange={upd("notas")} rows={2}/>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={guardar}>{saving?"Guardando...":editId?"Actualizar":"Guardar"}</Btn>
            <Btn variant="ghost" onClick={()=>{setShowForm(false);setEditId(null);setForm(FORM_INIT);}}>Cancelar</Btn>
          </div>
        </Card>
      )}

      {loading ? (
        <Card><div style={{color:T.inkDim,fontSize:13,textAlign:"center",padding:"20px 0"}}>Cargando...</div></Card>
      ) : (
        <>
          {activos.map(t => {
            const av    = initials(t.nombre, t.apellidos);
            const color = avatarColor(t.rol);
            const isOpen = openCard === t.id;
            return (
              <Card key={t.id} style={{marginBottom:10}}>
                {/* Cabecera */}
                <div style={{display:"flex",alignItems:"center",gap:13}}>
                  <div style={{width:46,height:46,borderRadius:10,background:color+"18",
                    border:`1px solid ${color}35`,display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:14,fontWeight:700,color,
                    flexShrink:0,fontFamily:"'DM Mono',monospace"}}>{av}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{color:T.ink,fontWeight:600,fontSize:17,
                      fontFamily:"'Cormorant Garamond',serif",lineHeight:1.2}}>
                      {t.nombre} {t.apellidos}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                      <span style={{background:color+"15",border:`1px solid ${color}30`,
                        borderRadius:4,padding:"1px 7px",fontSize:9.5,color,
                        fontFamily:"'DM Mono',monospace",fontWeight:600,textTransform:"uppercase",
                        letterSpacing:0.8}}>{t.rol}</span>
                      {t.alias && <span style={{color:T.inkDim,fontSize:10,
                        fontFamily:"'DM Mono',monospace"}}>alias: {t.alias}</span>}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <button onClick={()=>setOpenCard(isOpen?null:t.id)}
                      style={{background:"none",border:`0.5px solid ${T.rim}`,
                        borderRadius:6,padding:"5px 10px",color:T.inkDim,
                        fontSize:12,cursor:"pointer"}}>
                      {isOpen?"−":"+"}
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
                  {[
                    ["Salidas", t.stats.salidas],
                    ["Horas nav.", t.stats.horas > 0 ? t.stats.horas.toFixed(1)+"h" : "0h"],
                  ].map(([lbl,val])=>(
                    <div key={lbl} style={{background:T.bg,borderRadius:7,padding:"9px 12px"}}>
                      <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
                        fontFamily:"'DM Mono',monospace",marginBottom:4}}>{lbl}</div>
                      <div style={{fontSize:20,fontWeight:600,color,
                        fontFamily:"'Cormorant Garamond',serif"}}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Detalle expandible */}
                {isOpen && (
                  <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${T.line}`}}>
                    {/* Info */}
                    {(t.telefono||t.email||t.notas) && (
                      <div style={{marginBottom:14}}>
                        {t.telefono && <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}>
                          <span style={{color:T.inkDim,fontSize:12}}>Teléfono</span>
                          <span style={{color:T.ink,fontSize:12,fontWeight:500}}>{t.telefono}</span>
                        </div>}
                        {t.email && <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderTop:`1px solid ${T.line}`}}>
                          <span style={{color:T.inkDim,fontSize:12}}>Email</span>
                          <span style={{color:T.ink,fontSize:12,fontWeight:500}}>{t.email}</span>
                        </div>}
                        {t.notas && <div style={{padding:"6px 0",borderTop:`1px solid ${T.line}`}}>
                          <span style={{color:T.inkDim,fontSize:12}}>{t.notas}</span>
                        </div>}
                      </div>
                    )}

                    {/* Documentos */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div style={{fontSize:9.5,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
                        fontFamily:"'DM Mono',monospace"}}>Documentos</div>
                      <button onClick={()=>setShowDocForm(showDocForm===t.id?null:t.id)}
                        style={{background:"none",border:`0.5px solid ${T.rim}`,borderRadius:5,
                          padding:"3px 9px",color:T.brass,fontSize:11,cursor:"pointer",fontWeight:600}}>
                        + Añadir
                      </button>
                    </div>

                    {showDocForm===t.id && (
                      <div style={{background:T.bg,borderRadius:8,padding:"12px",marginBottom:12}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                          <FInput label="Nombre *" value={docForm.nombre} onChange={updD("nombre")}/>
                          <FSelect label="Tipo" value={docForm.tipo} onChange={updD("tipo")} options={DOC_TIPOS}/>
                        </div>
                        <FInput label="Fecha vencimiento" type="date" value={docForm.fecha_vencimiento} onChange={updD("fecha_vencimiento")}/>
                        <div style={{marginBottom:10}}>
                          <label style={{display:"block",width:"100%",background:T.surface,
                            border:`1px dashed ${T.rim}`,borderRadius:7,padding:"10px",
                            color:selectedFile?T.brass:T.inkDim,fontSize:12,cursor:"pointer",
                            fontFamily:"inherit",textAlign:"center",boxSizing:"border-box"}}>
                            {selectedFile?`📎 ${selectedFile.name}`:"Seleccionar archivo"}
                            <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                              onChange={e=>setSelectedFile(e.target.files[0]||null)}
                              style={{display:"none"}}/>
                          </label>
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <Btn sm onClick={()=>subirDoc(t.id)}>{saving?"Guardando...":"Guardar"}</Btn>
                          <Btn sm variant="ghost" onClick={()=>{setShowDocForm(null);setSelectedFile(null);}}>Cancelar</Btn>
                        </div>
                      </div>
                    )}

                    {t.docs.length===0 ? (
                      <div style={{color:T.inkDim,fontSize:12,fontStyle:"italic",marginBottom:12}}>Sin documentos añadidos.</div>
                    ) : t.docs.map(d=>(
                      <div key={d.id} style={{display:"flex",justifyContent:"space-between",
                        alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${T.line}`}}>
                        <div>
                          <div style={{color:T.ink,fontSize:13}}>{d.nombre}</div>
                          <div style={{color:T.inkDim,fontSize:9.5,fontFamily:"'DM Mono',monospace"}}>
                            {d.tipo}{d.fecha_vencimiento?` · Vence ${d.fecha_vencimiento}`:""}
                          </div>
                        </div>
                        <div style={{display:"flex",gap:6}}>
                          {d.url_archivo && (
                            <a href={d.url_archivo} target="_blank" rel="noopener noreferrer"
                              style={{background:T.brassDim,border:`1px solid ${T.brass}35`,
                                borderRadius:5,padding:"3px 8px",color:T.brass,
                                fontSize:11,textDecoration:"none",fontWeight:600}}>Ver</a>
                          )}
                          <button onClick={()=>eliminarDoc(d.id)} style={{background:"none",
                            border:`1px solid ${T.danger}40`,borderRadius:5,padding:"3px 7px",
                            color:T.danger,fontSize:11,cursor:"pointer"}}>✕</button>
                        </div>
                      </div>
                    ))}

                    {/* Acciones */}
                    <div style={{display:"flex",gap:8,marginTop:14}}>
                      <button onClick={()=>editar(t)} style={{flex:1,background:T.bg,
                        border:`0.5px solid ${T.rim}`,borderRadius:7,padding:"8px",
                        color:T.inkMid,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                        ✏️ Editar
                      </button>
                      <button onClick={()=>toggleActivo(t.id,t.activo)} style={{flex:1,background:"none",
                        border:`1px solid ${T.warn}40`,borderRadius:7,padding:"8px",
                        color:T.warn,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                        Dar de baja
                      </button>
                      <button onClick={()=>eliminar(t.id)} style={{background:"none",
                        border:`1px solid ${T.danger}40`,borderRadius:7,padding:"8px 12px",
                        color:T.danger,fontSize:12,cursor:"pointer"}}>✕</button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}

          {/* Inactivos */}
          {inactivos.length > 0 && (
            <div style={{marginTop:24}}>
              <div style={{fontSize:9.5,color:T.inkDim,letterSpacing:2,textTransform:"uppercase",
                fontFamily:"'DM Mono',monospace",marginBottom:10}}>Dados de baja</div>
              {inactivos.map(t=>(
                <Card key={t.id} style={{marginBottom:8,opacity:0.6}} pad="12px 16px">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{color:T.inkMid,fontSize:14}}>{t.nombre} {t.apellidos}</div>
                      <div style={{color:T.inkDim,fontSize:10,fontFamily:"'DM Mono',monospace"}}>{t.rol}</div>
                    </div>
                    <button onClick={()=>toggleActivo(t.id,t.activo)}
                      style={{background:"none",border:`0.5px solid ${T.rim}`,borderRadius:5,
                        padding:"4px 10px",color:T.ok,fontSize:11,cursor:"pointer"}}>
                      Reactivar
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── ASISTENTE IA ──────────────────────────────────────────────────────────────
const SYS = `Eres el asistente náutico de a bordo del "Leonidas", un Sunseeker Portofino 53 del año 2007. Matrícula: 7ª PM-1-231-25. Base habitual: Puerto de Caleta de Vélez (Málaga). Reformado en electrónica y confort.

DATOS TÉCNICOS:
- Motores: 2× MAN D28 MCR, 588 kW (≈800 CV) cada uno
- Horas motor actuales: 774 h
- Eslora: 16.15 m · Manga: 4.42 m · Calado: 1.25 m
- Zona habilitada: 2ª Categoría
- Electrónica: Garmin chartplotter, AIS, piloto automático, sistema de sonido

PATRONES:
- Salvador Álvarez Escobar "Varo" · Patrón de Yate
- Guillermo José Hurtado de Mendoza "Guille" · Armador · PER

Cuando te manden una imagen: analízala en detalle. Si es una pieza o componente del barco, identifícala, di qué es, su estado aparente y qué hacer. Si es una avería o problema visible, diagnostica y recomienda acción. Si es un producto (aceite, filtro, repuesto), confirma si es compatible con el Leonidas.

Responde en español. Sé específico y cita datos reales del barco cuando sea relevante. Texto plano sin asteriscos ni markdown.`;

function AsistenteIA() {
  const [msgs, setMsgs]     = useState([{role:"assistant", text:"Soy el asistente de a bordo del Leonidas. Puedo ayudarte con consultas técnicas y también analizar fotos de piezas, averías o productos. ¿En qué puedo ayudarte?", img:null}]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [imagen, setImagen] = useState(null); // { base64, mediaType, preview }
  const ref = useRef(null);

  const sugs = ["¿Qué mantenimiento urge más?","Dame checklist de salida","¿Cuándo toca cambiar el aceite?","Analiza esta pieza"];

  async function fileToBase64(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result.split(",")[1]);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  async function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    const preview = URL.createObjectURL(file);
    setImagen({ base64, mediaType: file.type, preview, name: file.name });
  }

  async function send() {
    if ((!input.trim() && !imagen) || loading) return;
    const text    = input.trim() || "Analiza esta imagen";
    const imgData = imagen;
    setInput("");
    setImagen(null);

    const userMsg = { role:"user", text, img: imgData?.preview || null };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setLoading(true);

    try {
      // Build message content
      const userContent = [];
      if (imgData) {
        userContent.push({
          type: "image",
          source: { type:"base64", media_type: imgData.mediaType, data: imgData.base64 }
        });
      }
      userContent.push({ type:"text", text });

      // Build messages array for API
      const apiMsgs = next.map((m, i) => {
        if (i === next.length - 1) {
          // Last message (current user msg) with possible image
          return { role: "user", content: userContent };
        }
        return { role: m.role, content: m.text };
      });

      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          system: SYS,
          messages: apiMsgs
        })
      });
      const d = await res.json();
      const reply = d?.content?.[0]?.text
        || d?.content?.find?.(b=>b.type==="text")?.text
        || (d?.error ? "Error API: "+d.error.message : null)
        || "Sin respuesta.";
      setMsgs(m=>[...m,{role:"assistant",text:reply,img:null}]);
    } catch(e) {
      setMsgs(m=>[...m,{role:"assistant",text:"Error: "+e.message,img:null}]);
    }
    setLoading(false);
  }

  useEffect(()=>{ ref.current?.scrollIntoView({behavior:"smooth"}); },[msgs,loading]);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 148px)" }}>
      <Hdr title="IA Náutica"/>

      {/* Chat */}
      <div style={{ flex:1, overflowY:"auto", marginBottom:11 }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex",
            justifyContent:m.role==="user"?"flex-end":"flex-start",
            marginBottom:11, gap:9 }}>
            {m.role==="assistant"&&(
              <div style={{ width:28,height:28,borderRadius:7,background:T.brassDim,
                border:`1px solid ${T.brass}40`,display:"flex",alignItems:"center",
                justifyContent:"center",color:T.brass,fontSize:13,flexShrink:0,marginTop:2}}>◈</div>
            )}
            <div style={{ maxWidth:"80%" }}>
              {m.img && (
                <div style={{ marginBottom:6 }}>
                  <img src={m.img} alt="adjunto"
                    style={{ maxWidth:"100%", maxHeight:180, borderRadius:8,
                      border:`1px solid ${T.rim}`, objectFit:"cover", display:"block" }}/>
                </div>
              )}
              <div style={{ padding:"11px 15px",
                borderRadius:m.role==="user"?"10px 3px 10px 10px":"3px 10px 10px 10px",
                background:m.role==="user"?T.brass:T.surface,
                border:m.role==="user"?"none":`0.5px solid ${T.rim}`,
                color:m.role==="user"?"#fff":T.inkMid,
                fontSize:13, lineHeight:1.6, whiteSpace:"pre-wrap",
                fontWeight:m.role==="user"?500:400 }}>{m.text}</div>
            </div>
          </div>
        ))}
        {loading&&(
          <div style={{ display:"flex",gap:9,alignItems:"flex-start",marginBottom:11 }}>
            <div style={{ width:28,height:28,borderRadius:7,background:T.brassDim,
              border:`1px solid ${T.brass}40`,display:"flex",alignItems:"center",
              justifyContent:"center",color:T.brass,fontSize:13,flexShrink:0}}>◈</div>
            <div style={{ background:T.surface,border:`0.5px solid ${T.rim}`,
              borderRadius:"3px 10px 10px 10px",padding:"13px 17px",display:"flex",gap:5}}>
              {[0,1,2].map(j=>(
                <div key={j} style={{ width:5,height:5,borderRadius:"50%",background:T.brass,
                  opacity:0.3,animation:"blink 1.2s infinite",animationDelay:`${j*0.2}s`}}/>
              ))}
            </div>
          </div>
        )}
        <div ref={ref}/>
      </div>

      {/* Sugerencias */}
      {msgs.length===1&&(
        <div style={{ marginBottom:11 }}>
          <div style={{ fontSize:9.5,color:T.inkDim,letterSpacing:1.5,
            textTransform:"uppercase",fontFamily:"'DM Mono',monospace",marginBottom:8}}>Sugerencias</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:6}}>
            {sugs.map((s,i)=>(
              <button key={i} onClick={()=>setInput(s)} style={{
                background:T.surfaceUp,border:`0.5px solid ${T.rim}`,
                borderRadius:20,padding:"6px 13px",color:T.inkMid,
                fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* Preview imagen adjunta */}
      {imagen && (
        <div style={{ marginBottom:8,display:"flex",alignItems:"center",gap:10,
          background:T.bg,borderRadius:8,padding:"8px 12px",
          border:`0.5px solid ${T.rim}`}}>
          <img src={imagen.preview} alt="preview"
            style={{ width:44,height:44,borderRadius:6,objectFit:"cover",
              border:`1px solid ${T.rim}`}}/>
          <div style={{ flex:1 }}>
            <div style={{ color:T.ink,fontSize:12,fontWeight:500 }}>{imagen.name}</div>
            <div style={{ color:T.inkDim,fontSize:10,fontFamily:"'DM Mono',monospace"}}>Lista para enviar</div>
          </div>
          <button onClick={()=>setImagen(null)} style={{ background:"none",border:"none",
            color:T.danger,fontSize:16,cursor:"pointer"}}>✕</button>
        </div>
      )}

      {/* Input */}
      <div style={{ display:"flex",gap:8,alignItems:"flex-end" }}>
        {/* Botón foto */}
        <label style={{ width:43,height:43,borderRadius:9,border:`0.5px solid ${T.rim}`,
          background:imagen?T.brassDim:T.surface,display:"flex",alignItems:"center",
          justifyContent:"center",cursor:"pointer",flexShrink:0,fontSize:18}}>
          📷
          <input type="file" accept="image/*" capture="environment"
            onChange={handleImageSelect} style={{display:"none"}}/>
        </label>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder={imagen?"Añade un comentario o envía la foto...":"Consulta sobre el barco..."}
          style={{ flex:1,background:T.surface,border:`0.5px solid ${T.rim}`,
            borderRadius:9,padding:"12px 15px",color:T.ink,fontSize:13,
            outline:"none",fontFamily:"inherit"}}/>
        <button onClick={send} disabled={loading||(!input.trim()&&!imagen)} style={{
          width:43,height:43,borderRadius:9,border:"none",
          background:(input.trim()||imagen)?T.brass:T.rim,
          color:(input.trim()||imagen)?"#fff":T.inkDim,
          fontSize:18,cursor:(input.trim()||imagen)?"pointer":"default",
          flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
          fontWeight:700}}>›</button>
      </div>
    </div>
  );
}


// ── CLIMA ─────────────────────────────────────────────────────────────────────
// Caleta de Vélez coords: 36.7333° N, -4.0833° W
const CALETA = { lat: 36.7333, lon: -4.0833 };

function semaforo(windKn, waveM) {
  if (windKn > 20 || waveM > 1.2) return { level:"danger", label:"No recomendable salir",    icon:"🔴", desc:`Viento ${windKn}kn · Ola ${waveM.toFixed(1)}m -- Condiciones adversas` };
  if (windKn > 8  || waveM > 0.5) return { level:"warn",   label:"Navegar con precaución",   icon:"🟡", desc:`Viento ${windKn}kn · Ola ${waveM.toFixed(1)}m -- Condiciones moderadas` };
  return                                  { level:"ok",     label:"Día perfecto para salir",   icon:"🟢", desc:`Viento ${windKn}kn · Ola ${waveM.toFixed(1)}m -- Condiciones excelentes` };
}

function degToCompass(deg) {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO"];
  return dirs[Math.round(deg / 22.5) % 16];
}

const LUGARES_GUARDADOS = [
  { nombre:"Caleta de Vélez (Base)", lat:36.7333, lon:-4.0833 },
  { nombre:"Puerto de Marbella",     lat:36.5114, lon:-4.8818 },
  { nombre:"Puerto de Estepona",     lat:36.3985, lon:-5.1470 },
  { nombre:"Puerto de Gibraltar",    lat:36.1408, lon:-5.3536 },
  { nombre:"Puerto de Málaga",       lat:36.7090, lon:-4.4200 },
  { nombre:"Puerto de Nerja",        lat:36.7490, lon:-3.8710 },
];

function Clima() {
  const [wx, setWx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [tab, setTab] = useState("ahora");

  // Location state
  const [modoUbic, setModoUbic] = useState("auto"); // "auto" | "manual"
  const [ubicActual, setUbicActual] = useState({ nombre:"Caleta de Vélez", lat:CALETA.lat, lon:CALETA.lon });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  async function fetchWxAt(lat, lon) {
    setLoading(true); setErr(null); setWx(null);
    try {
      const url  = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,wave_direction,wave_period&current=wave_height,wave_direction,wave_period&timezone=Europe%2FMadrid&forecast_days=3`;
      const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,temperature_2m&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m,temperature_2m&wind_speed_unit=kn&timezone=Europe%2FMadrid&forecast_days=3`;
      const [mRes, wRes] = await Promise.all([fetch(url), fetch(wUrl)]);
      const [mData, wData] = await Promise.all([mRes.json(), wRes.json()]);
      setWx({ marine: mData, wind: wData });
    } catch(e) { setErr("No se pudo cargar el tiempo. Verifica la conexión."); }
    finally { setLoading(false); }
  }

  function usarGPS() {
    if (!navigator.geolocation) { setErr("GPS no disponible"); return; }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(pos => {
      const loc = { nombre:"Mi posición actual", lat: pos.coords.latitude, lon: pos.coords.longitude };
      setUbicActual(loc);
      setModoUbic("auto");
      setGpsLoading(false);
      fetchWxAt(loc.lat, loc.lon);
    }, () => {
      setGpsLoading(false);
      setErr("No se pudo obtener tu posición GPS.");
    }, { enableHighAccuracy: true, timeout: 8000 });
  }

  function seleccionarLugar(lugar) {
    setUbicActual(lugar);
    setModoUbic("manual");
    setShowPicker(false);
    setBusqueda("");
    fetchWxAt(lugar.lat, lugar.lon);
  }

  useEffect(() => { fetchWxAt(ubicActual.lat, ubicActual.lon); }, []);

  const lugaresFiltrados = busqueda.length > 0
    ? LUGARES_GUARDADOS.filter(l => l.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    : LUGARES_GUARDADOS;

  const renderLocationBar = () => (
    <div style={{ marginBottom:16 }}>
      {/* Location display + toggle */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <div style={{ flex:1, background:T.surface, border:`1px solid ${T.rimHi}`,
          borderRadius:9, padding:"9px 14px", display:"flex", alignItems:"center",
          justifyContent:"space-between", cursor:"pointer" }}
          onClick={()=>setShowPicker(!showPicker)}>
          <div>
            <div style={{ fontSize:9, color:T.inkDim, letterSpacing:1.5, textTransform:"uppercase",
              fontFamily:"'DM Mono',monospace", marginBottom:2 }}>
              {modoUbic==="auto" ? "📍 Posición GPS" : "📌 Lugar seleccionado"}
            </div>
            <div style={{ color:T.ink, fontSize:13, fontWeight:600 }}>{ubicActual.nombre}</div>
          </div>
          <span style={{ color:T.inkDim, fontSize:12, fontFamily:"'DM Mono',monospace" }}>
            {showPicker ? "▲" : "▼"}
          </span>
        </div>
        <button onClick={usarGPS} disabled={gpsLoading} style={{
          width:42, height:42, borderRadius:9, border:`1px solid ${T.rimHi}`,
          background:modoUbic==="auto" ? T.brass : T.surface,
          color:modoUbic==="auto" ? "#fff" : T.inkDim,
          fontSize:16, cursor:"pointer", flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          {gpsLoading ? "…" : "◎"}
        </button>
      </div>

      {/* Location picker dropdown */}
      {showPicker && (
        <div style={{ background:T.surface, border:`1px solid ${T.rimHi}`,
          borderRadius:10, overflow:"hidden",
          boxShadow:"0 4px 20px rgba(0,0,0,0.12)" }}>
          <div style={{ padding:"10px 14px", borderBottom:`1px solid ${T.line}` }}>
            <input value={busqueda} onChange={e=>setBusqueda(e.target.value)}
              placeholder="Buscar puerto o lugar…"
              style={{ width:"100%", background:"transparent", border:"none",
                color:T.ink, fontSize:13, outline:"none", fontFamily:"inherit" }}/>
          </div>
          {lugaresFiltrados.map((l,i)=>(
            <button key={i} onClick={()=>seleccionarLugar(l)} style={{
              width:"100%", padding:"10px 14px", border:"none",
              borderBottom: i < lugaresFiltrados.length-1 ? `1px solid ${T.line}` : "none",
              background: ubicActual.nombre===l.nombre ? T.brassDim : "transparent",
              cursor:"pointer", textAlign:"left", display:"flex",
              alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ color:T.ink, fontSize:13 }}>{l.nombre}</span>
              {ubicActual.nombre===l.nombre && (
                <span style={{ color:T.brass, fontSize:11,
                  fontFamily:"'DM Mono',monospace" }}>✓</span>
              )}
            </button>
          ))}
          <button onClick={()=>{ setShowPicker(false); usarGPS(); }} style={{
            width:"100%", padding:"10px 14px", border:"none",
            borderTop:`1px solid ${T.line}`,
            background:"transparent", cursor:"pointer", textAlign:"left",
            display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:14 }}>◎</span>
            <span style={{ color:T.brass, fontSize:13, fontWeight:600 }}>
              Usar mi posición GPS ahora
            </span>
          </button>
        </div>
      )}
    </div>
  );

  if (loading) return (
    <div>
      <Hdr title="Clima"/>
      {renderLocationBar()}
      <Card style={{ textAlign:"center", padding:"40px 20px" }}>
        <div style={{ color:T.inkDim, fontSize:13 }}>Consultando datos en {ubicActual.nombre}…</div>
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:16 }}>
          {[0,1,2].map(j=><div key={j} style={{ width:6,height:6,borderRadius:"50%",background:T.brass,opacity:0.3,animation:"blink 1.2s infinite",animationDelay:`${j*0.2}s` }}/>)}
        </div>
      </Card>
    </div>
  );

  if (err) return (
    <div>
      <Hdr title="Clima"/>
      {renderLocationBar()}
      <Card><div style={{ color:T.warn, fontSize:13 }}>{err}</div></Card>
    </div>
  );

  const windKn   = Math.round(wx.wind.current.wind_speed_10m);
  const gustKn   = Math.round(wx.wind.current.wind_gusts_10m);
  const windDir  = wx.wind.current.wind_direction_10m;
  const tempC    = Math.round(wx.wind.current.temperature_2m);
  const waveM    = wx.marine.current.wave_height;
  const wavePer  = wx.marine.current.wave_period;
  const waveDir  = wx.marine.current.wave_direction;
  const sem      = semaforo(windKn, waveM);

  // Build hourly forecast for next 24h
  const now = new Date();
  const hours = wx.wind.hourly.time
    .map((t,i) => ({
      time: t,
      hour: new Date(t).getHours(),
      wind: Math.round(wx.wind.hourly.wind_speed_10m[i]),
      gust: Math.round(wx.wind.hourly.wind_gusts_10m[i]),
      wave: wx.marine.hourly.wave_height[i],
      temp: Math.round(wx.wind.hourly.temperature_2m[i]),
    }))
    .filter(h => new Date(h.time) >= now)
    .slice(0, 24);

  // 3-day summary
  const days = [];
  for (let d = 0; d < 3; d++) {
    const dayHours = wx.wind.hourly.time
      .map((t,i) => ({ t, wind: Math.round(wx.wind.hourly.wind_speed_10m[i]), wave: wx.marine.hourly.wave_height[i] }))
      .filter(h => {
        const hDate = new Date(h.t);
        const target = new Date(); target.setDate(target.getDate() + d);
        return hDate.toDateString() === target.toDateString();
      });
    if (!dayHours.length) continue;
    const maxWind = Math.max(...dayHours.map(h=>h.wind));
    const maxWave = Math.max(...dayHours.filter(h=>h.wave!=null).map(h=>h.wave));
    const label = d===0?"Hoy":d===1?"Mañana":new Date(dayHours[0].t).toLocaleDateString("es-ES",{weekday:"short"});
    days.push({ label, maxWind, maxWave, sem: semaforo(maxWind, maxWave||0) });
  }

  const semColor = sem.level==="ok"?T.ok:sem.level==="warn"?T.warn:T.danger;

  return (
    <div>
      <Hdr title="Clima"/>

      {renderLocationBar()}

      {/* Semáforo principal */}
      <div style={{ background: semColor+"18", border:`1px solid ${semColor}40`,
        borderRadius:12, padding:"18px 20px", marginBottom:16,
        display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ fontSize:36, lineHeight:1 }}>{sem.icon}</div>
        <div>
          <div style={{ color:semColor, fontWeight:700, fontSize:16,
            fontFamily:"'Cormorant Garamond',serif" }}>{sem.label}</div>
          <div style={{ color:T.inkDim, fontSize:11, marginTop:4,
            fontFamily:"'DM Mono',monospace" }}>{sem.desc}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", background:T.bg, borderRadius:7, padding:3,
        gap:3, marginBottom:16, border:`1px solid ${T.rimHi}` }}>
        {[["ahora","Ahora"],["horas","24h"],["dias","3 días"],["mapa","Mapa"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{
            flex:1, padding:"8px 4px", borderRadius:5, border:"none", cursor:"pointer",
            background:tab===id?T.surface:"transparent",
            color:tab===id?T.ink:T.inkDim, fontSize:11, fontWeight:tab===id?600:400,
            fontFamily:"inherit", boxShadow:tab===id?"0 1px 3px rgba(0,0,0,0.4)":"none" }}>
            {lbl}
          </button>
        ))}
      </div>

      {tab==="ahora" && (
        <Card pad="0 18px">
          {[
            ["Viento",       `${windKn} kn · ${degToCompass(windDir)}`, windKn>20?T.warn:T.ink],
            ["Rachas",       `${gustKn} kn`, gustKn>25?T.danger:gustKn>18?T.warn:T.ink],
            ["Dirección viento", degToCompass(windDir)+"  ("+windDir+"°)", T.ink],
            ["Altura de ola", `${waveM?.toFixed(1) ?? "--"} m`, waveM>1.5?T.danger:waveM>0.8?T.warn:T.ok],
            ["Período de ola",`${wavePer?.toFixed(0) ?? "--"} s`, T.ink],
            ["Dirección ola", degToCompass(waveDir), T.ink],
            ["Temperatura",  `${tempC} °C`, T.ink],
          ].map(([k,v,c],i)=>(
            <div key={k}>{i>0&&<Divider/>}<Row label={k} value={v} accent={c}/></div>
          ))}
        </Card>
      )}

      {tab==="horas" && (
        <div style={{ overflowX:"auto" }}>
          <div style={{ display:"flex", gap:8, paddingBottom:8, minWidth:"max-content" }}>
            {hours.map((h,i)=>{
              const s = semaforo(h.wind, h.wave||0);
              const sc = s.level==="ok"?T.ok:s.level==="warn"?T.warn:T.danger;
              return (
                <Card key={i} pad="12px 10px" style={{ minWidth:70, textAlign:"center", flexShrink:0 }}>
                  <div style={{ fontSize:9.5, color:T.inkDim, fontFamily:"'DM Mono',monospace",
                    marginBottom:6 }}>{String(h.hour).padStart(2,"0")}:00</div>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:sc,
                    margin:"0 auto 8px", boxShadow:`0 0 6px ${sc}60` }}/>
                  <div style={{ color:T.ink, fontSize:12, fontWeight:600,
                    fontFamily:"'DM Mono',monospace" }}>{h.wind}kn</div>
                  <div style={{ color:T.inkDim, fontSize:10, marginTop:3,
                    fontFamily:"'DM Mono',monospace" }}>{h.wave?.toFixed(1)??"--"}m</div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {tab==="dias" && days.map((d,i)=>{
        const sc = d.sem.level==="ok"?T.ok:d.sem.level==="warn"?T.warn:T.danger;
        return (
          <Card key={i} style={{ marginBottom:9 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:sc,
                  boxShadow:`0 0 6px ${sc}60` }}/>
                <div style={{ color:T.ink, fontSize:16, fontWeight:600,
                  fontFamily:"'Cormorant Garamond',serif" }}>{d.label}</div>
              </div>
              <Signal estado={d.sem.level}/>
            </div>
            <div style={{ display:"flex", gap:16, marginTop:10 }}>
              <div>
                <div style={{ fontSize:9, color:T.inkDim, fontFamily:"'DM Mono',monospace",
                  letterSpacing:1.5, textTransform:"uppercase", marginBottom:3 }}>Viento máx.</div>
                <div style={{ color:d.maxWind>20?T.warn:T.ink, fontWeight:600, fontSize:18,
                  fontFamily:"'Cormorant Garamond',serif" }}>{d.maxWind} kn</div>
              </div>
              <div>
                <div style={{ fontSize:9, color:T.inkDim, fontFamily:"'DM Mono',monospace",
                  letterSpacing:1.5, textTransform:"uppercase", marginBottom:3 }}>Ola máx.</div>
                <div style={{ color:d.maxWave>1.5?T.danger:d.maxWave>0.8?T.warn:T.ok,
                  fontWeight:600, fontSize:18, fontFamily:"'Cormorant Garamond',serif" }}>
                  {d.maxWave?.toFixed(1)??"--"} m</div>
              </div>
            </div>
          </Card>
        );
      })}

      {/* ── MAPA WINDY ── */}
      {tab==="mapa" && (
        <div>
          <div style={{fontSize:10,color:T.inkDim,fontFamily:"'DM Mono',monospace",
            marginBottom:12,lineHeight:1.5}}>
            Mapa meteorológico en tiempo real · Puedes mover, hacer zoom y cambiar capas
            (viento, olas, lluvia). Centrado en la Costa del Sol.
          </div>
          <div style={{borderRadius:12,overflow:"hidden",border:`1px solid ${T.rimHi}`,
            boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>
            <iframe
              src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=kt&zoom=8&overlay=wind&product=ecmwf&level=surface&lat=36.73&lon=-4.08&detailLat=36.73&detailLon=-4.08&marker=true&message=true"
              width="100%"
              height="450"
              frameBorder="0"
              title="Windy - Mapa meteorológico"
              style={{display:"block"}}
            />
          </div>
          <div style={{fontSize:9.5,color:T.inkDim,fontFamily:"'DM Mono',monospace",
            marginTop:8,textAlign:"center"}}>
            Powered by Windy.com · Datos ECMWF
          </div>
        </div>
      )}
    </div>
  );
}

// ── CALCULADORA DE RUTA ───────────────────────────────────────────────────────
function Calculadora() {
  const [modo, setModo] = useState("paseo"); // "paseo" | "ruta"

  // ── SHARED STATE ──
  const [velocidad, setVelocidad] = useState("12");
  const [horaSalida, setHoraSalida] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  });

  // ── RUTA STATE ──
  const [distancia, setDistancia] = useState("");

  // ── RESULTS ──
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  function getSunset() {
    const date = new Date();
    const lat = CALETA.lat * Math.PI / 180;
    const day = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const d = 23.45 * Math.PI / 180 * Math.sin(2 * Math.PI * (284 + day) / 365);
    const cosHA = -Math.tan(lat) * Math.tan(d);
    const ha = Math.acos(Math.max(-1, Math.min(1, cosHA)));
    const utc = 12 + (ha * 180 / Math.PI) / 15;
    const local = utc + (new Date().getTimezoneOffset() < -60 ? 2 : 1);
    const h = Math.floor(local), m = Math.floor((local - h) * 60);
    return { h, m, ms: new Date().setHours(h, m, 0, 0), str: `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}` };
  }

  function fmt(ms) {
    const d = new Date(ms);
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  }

  async function fetchHours() {
    const [mr, wr] = await Promise.all([
      fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${CALETA.lat}&longitude=${CALETA.lon}&hourly=wave_height&timezone=Europe%2FMadrid&forecast_days=2`),
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${CALETA.lat}&longitude=${CALETA.lon}&hourly=wind_speed_10m,wind_gusts_10m&wind_speed_unit=kn&timezone=Europe%2FMadrid&forecast_days=2`)
    ]);
    const [md, wd] = await Promise.all([mr.json(), wr.json()]);
    return wd.hourly.time.map((t,i) => ({
      time: t, ms: new Date(t).getTime(),
      wind: Math.round(wd.hourly.wind_speed_10m[i]),
      gust: Math.round(wd.hourly.wind_gusts_10m[i]),
      wave: md.hourly.wave_height[i] ?? 0,
    }));
  }

  async function calcularPaseo() {
    setLoading(true);
    const sunset = getSunset();
    const [sh, sm] = horaSalida.split(":").map(Number);
    const salidaMs = new Date().setHours(sh, sm, 0, 0);
    let hours = [];
    try { hours = await fetchHours(); } catch(e) {}

    // Filter hours from now until sunset + 30min
    const ventana = hours.filter(h => h.ms >= salidaMs && h.ms <= sunset.ms + 30*60000);

    // Score each hour: lower wind = better, closer to sunset = better
    // "Golden window" = wind < 15kn, as close to sunset as possible
    const scored = ventana.map(h => {
      const minutesFromSunset = (sunset.ms - h.ms) / 60000; // positive = before sunset
      const windScore = Math.max(0, 25 - h.wind); // higher = less wind
      const timeScore = minutesFromSunset >= 0 && minutesFromSunset <= 120
        ? (120 - minutesFromSunset) / 2  // reward proximity to sunset
        : minutesFromSunset < 0 ? -50 : 0;
      return { ...h, score: windScore + timeScore, minutesFromSunset };
    });

    // Find best continuous block of ≥1h near sunset with wind <20kn
    const goodHours = scored
      .filter(h => h.wind < 20 && h.minutesFromSunset >= -30)
      .sort((a,b) => b.score - a.score);

    // Golden window: best 2-3h block before sunset
    const goldenStart = ventana.filter(h => {
      const mfs = (sunset.ms - h.ms) / 60000;
      return mfs >= 30 && mfs <= 150 && h.wind < 20;
    }).sort((a,b) => a.ms - b.ms);

    // Worst hour during outing
    const worstWind = ventana.length ? Math.max(...ventana.map(h=>h.wind)) : null;
    const warningHours = ventana.filter(h => h.wind > 18 || h.wave > 1.2);

    // Optimal return: last good hour window
    let optReturn = null, optReturnEnd = null;
    if (goldenStart.length > 0) {
      optReturn = goldenStart[0].ms;
      optReturnEnd = Math.min(goldenStart[goldenStart.length-1].ms + 3600000, sunset.ms + 15*60000);
    } else if (goodHours.length > 0) {
      optReturn = goodHours[0].ms;
      optReturnEnd = optReturn + 3600000;
    } else {
      // No good window -- just recommend before sunset
      optReturn = sunset.ms - 90*60000;
      optReturnEnd = sunset.ms - 15*60000;
    }

    const windAtReturn = ventana.find(h => Math.abs(h.ms - optReturn) < 1800000);

    setResultado({
      modo: "paseo",
      sunset,
      salidaStr: fmt(salidaMs),
      optReturnStr: fmt(optReturn),
      optReturnEndStr: fmt(optReturnEnd),
      windAtReturn: windAtReturn?.wind ?? null,
      waveAtReturn: windAtReturn?.wave ?? null,
      worstWind,
      warningHours: warningHours.length,
      hasGolden: goldenStart.length > 0,
      noGoodWindow: goodHours.length === 0 && goldenStart.length === 0,
      totalHours: Math.round((optReturnEnd - salidaMs) / 3600000 * 10) / 10,
    });
    setLoading(false);
  }

  async function calcularRuta() {
    const dist = parseFloat(distancia);
    const vel = parseFloat(velocidad);
    if (!dist || !vel) return;
    setLoading(true);
    const sunset = getSunset();
    const [sh, sm] = horaSalida.split(":").map(Number);
    const salidaMs = new Date().setHours(sh, sm, 0, 0);
    const trayectoMs = (dist / vel) * 3600000;
    const llegadaDestinoMs = salidaMs + trayectoMs;
    const salidaVueltaMs = llegadaDestinoMs + 30*60000;
    const llegadaBaseMs = salidaVueltaMs + trayectoMs;
    const latestSafeMs = sunset.ms - trayectoMs - 45*60000;

    let hours = [], wxWarning = null;
    try {
      hours = await fetchHours();
      const returnSlot = hours.filter(h => h.ms >= salidaVueltaMs && h.ms <= llegadaBaseMs);
      const bad = returnSlot.filter(h => h.wind > 20 || h.wave > 1.2);
      if (bad.length) wxWarning = `Viento >20kn o olas >1.2m durante el regreso (${bad.length}h)`;
    } catch(e) {}

    const nightRisk = llegadaBaseMs > sunset.ms + 30*60000;
    const tightSunset = llegadaBaseMs > sunset.ms - 30*60000 && !nightRisk;

    setResultado({
      modo: "ruta", dist, vel,
      salidaStr: fmt(salidaMs),
      llegadaDestinoStr: fmt(llegadaDestinoMs),
      salidaVueltaStr: fmt(salidaVueltaMs),
      llegadaBaseStr: fmt(llegadaBaseMs),
      sunsetStr: sunset.str,
      latestSafeStr: fmt(latestSafeMs),
      tiempoMin: Math.round((dist / vel) * 60),
      nightRisk, tightSunset, wxWarning,
    });
    setLoading(false);
  }

  const r = resultado;

  return (
    <div>
      <Hdr title="Calculadora"/>

      {/* Mode toggle */}
      <div style={{ display:"flex", background:T.bg, borderRadius:7, padding:3,
        gap:3, marginBottom:18, border:`1px solid ${T.rimHi}` }}>
        {[["paseo","🌅  Paseo"],["ruta","🧭  Ruta"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>{ setModo(id); setResultado(null); }} style={{
            flex:1, padding:"10px 4px", borderRadius:5, border:"none", cursor:"pointer",
            background:modo===id?T.surface:"transparent",
            color:modo===id?T.ink:T.inkDim, fontSize:13, fontWeight:modo===id?700:400,
            fontFamily:"inherit", boxShadow:modo===id?"0 1px 3px rgba(0,0,0,0.4)":"none",
            letterSpacing:0.3 }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <Card style={{ marginBottom:14 }} pad="0 18px">
        {modo==="ruta" && (
          <div>
            <div style={{ padding:"12px 0" }}>
              <div style={{ fontSize:9.5, color:T.inkDim, letterSpacing:1.5, textTransform:"uppercase",
                fontFamily:"'DM Mono',monospace", marginBottom:8 }}>Distancia al destino (mn)</div>
              <input type="number" value={distancia} onChange={e=>setDistancia(e.target.value)}
                placeholder="ej. 18"
                style={{ background:T.surfaceUp, border:`1px solid ${T.rimHi}`, borderRadius:7,
                  padding:"10px 14px", color:T.ink, fontSize:16,
                  fontFamily:"'Cormorant Garamond',serif", outline:"none", width:"100%", fontWeight:600 }}/>
            </div>
            <Divider/>
          </div>
        )}
        <div style={{ padding:"12px 0" }}>
          <div style={{ fontSize:9.5, color:T.inkDim, letterSpacing:1.5, textTransform:"uppercase",
            fontFamily:"'DM Mono',monospace", marginBottom:8 }}>
            {modo==="paseo" ? "Hora de salida" : "Hora de salida prevista"}
          </div>
          <input type="time" value={horaSalida} onChange={e=>setHoraSalida(e.target.value)}
            style={{ background:T.surfaceUp, border:`1px solid ${T.rimHi}`, borderRadius:7,
              padding:"10px 14px", color:T.ink, fontSize:16,
              fontFamily:"'Cormorant Garamond',serif", outline:"none", width:"100%", fontWeight:600 }}/>
        </div>
        {modo==="ruta" && <><Divider/>
        <div style={{ padding:"12px 0" }}>
          <div style={{ fontSize:9.5, color:T.inkDim, letterSpacing:1.5, textTransform:"uppercase",
            fontFamily:"'DM Mono',monospace", marginBottom:8 }}>Velocidad de crucero (nudos)</div>
          <input type="number" value={velocidad} onChange={e=>setVelocidad(e.target.value)}
            placeholder="10-15"
            style={{ background:T.surfaceUp, border:`1px solid ${T.rimHi}`, borderRadius:7,
              padding:"10px 14px", color:T.ink, fontSize:16,
              fontFamily:"'Cormorant Garamond',serif", outline:"none", width:"100%", fontWeight:600 }}/>
        </div></>}
      </Card>

      <Btn onClick={modo==="paseo" ? calcularPaseo : calcularRuta}>
        {loading ? "Calculando…" : modo==="paseo" ? "Buscar ventana óptima" : "Calcular ruta"}
      </Btn>

      {/* ── PASEO RESULT ── */}
      {r && r.modo==="paseo" && (
        <div style={{ marginTop:20 }}>
          {/* Golden window banner */}
          {r.hasGolden ? (
            <div style={{ background:T.brass+"18", border:`1px solid ${T.brass}40`,
              borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
              <div style={{ fontSize:9.5, color:T.brass, letterSpacing:2, textTransform:"uppercase",
                fontFamily:"'DM Mono',monospace", marginBottom:8 }}>🌅 Ventana dorada</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28,
                fontWeight:600, color:T.brassLt, lineHeight:1 }}>
                {r.optReturnStr} - {r.optReturnEndStr}
              </div>
              <div style={{ color:T.inkDim, fontSize:11, marginTop:6, fontFamily:"'DM Mono',monospace" }}>
                {r.windAtReturn !== null ? `Viento estimado ${r.windAtReturn}kn` : ""}
                {r.waveAtReturn !== null ? ` · Ola ${r.waveAtReturn.toFixed(1)}m` : ""}
                {" · Puesta de sol "}{r.sunset.str}
              </div>
            </div>
          ) : r.noGoodWindow ? (
            <div style={{ background:T.danger+"15", border:`1px solid ${T.danger}30`,
              borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
              <div style={{ color:T.danger, fontSize:13, fontWeight:600 }}>
                ⚠ Hoy no hay ventana con buenas condiciones cerca del atardecer.
              </div>
              <div style={{ color:T.inkDim, fontSize:11, marginTop:4 }}>
                Regresa antes de las {r.optReturnStr} para evitar el peor viento.
              </div>
            </div>
          ) : (
            <div style={{ background:T.warn+"15", border:`1px solid ${T.warn}30`,
              borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
              <div style={{ color:T.warn, fontSize:13, fontWeight:600 }}>
                Ventana aceptable {r.optReturnStr} - {r.optReturnEndStr}
              </div>
              <div style={{ color:T.inkDim, fontSize:11, marginTop:4 }}>
                Condiciones moderadas, no ideales. Valora salir otro día.
              </div>
            </div>
          )}

          <Card pad="0 18px" style={{ marginBottom:14 }}>
            {[
              ["Salida desde base",      r.salidaStr,        T.info  ],
              ["Vuelta óptima",          r.optReturnStr,     T.brassLt],
              ["Hasta las",              r.optReturnEndStr,  T.brassLt],
              ["Puesta de sol",          r.sunset.str,       T.warn  ],
              ["Viento en vuelta",       r.windAtReturn ? r.windAtReturn+"kn" : "--", r.windAtReturn>18?T.warn:T.ok],
              ["Tiempo fuera aprox.",    r.totalHours+"h",   T.ink   ],
            ].map(([l,v,c],i)=>(
              <div key={i}>{i>0&&<Divider/>}
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", padding:"10px 0" }}>
                  <span style={{ color:T.inkDim, fontSize:12 }}>{l}</span>
                  <span style={{ color:c, fontSize:16, fontWeight:600,
                    fontFamily:"'Cormorant Garamond',serif" }}>{v}</span>
                </div>
              </div>
            ))}
          </Card>

          {r.warningHours > 0 && (
            <Card pad="13px 16px">
              <div style={{ color:T.warn, fontSize:12, fontWeight:600 }}>
                ⚠ {r.warningHours}h con viento >18kn o olas >1.2m durante el paseo.
                Consulta el módulo Clima para ver en qué tramos.
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ── RUTA RESULT ── */}
      {r && r.modo==="ruta" && (
        <div style={{ marginTop:20 }}>
          {(r.nightRisk || r.wxWarning) ? (
            <div style={{ background:T.danger+"15", border:`1px solid ${T.danger}30`,
              borderRadius:10, padding:"13px 16px", marginBottom:14 }}>
              {r.nightRisk && <div style={{ color:T.danger, fontSize:12, fontWeight:600,
                marginBottom:r.wxWarning?6:0 }}>
                ⚠ Llegada después del ocaso ({r.sunsetStr}). Salir antes.
              </div>}
              {r.wxWarning && <div style={{ color:T.warn, fontSize:12, fontWeight:600 }}>
                ⚠ {r.wxWarning}
              </div>}
            </div>
          ) : r.tightSunset ? (
            <div style={{ background:T.warn+"15", border:`1px solid ${T.warn}30`,
              borderRadius:10, padding:"13px 16px", marginBottom:14 }}>
              <div style={{ color:T.warn, fontSize:12, fontWeight:600 }}>
                Margen ajustado. Salir de vuelta antes de las {r.latestSafeStr}.
              </div>
            </div>
          ) : (
            <div style={{ background:T.ok+"15", border:`1px solid ${T.ok}30`,
              borderRadius:10, padding:"13px 16px", marginBottom:14 }}>
              <div style={{ color:T.ok, fontSize:12, fontWeight:600 }}>
                Ruta viable. Llegada antes del ocaso con margen.
              </div>
            </div>
          )}

          <Card pad="0 18px">
            {[
              { h:r.salidaStr,          l:`Salida de Caleta de Vélez`,            c:T.info    },
              { h:r.llegadaDestinoStr,  l:`Llegada al destino (${r.dist} mn)`,    c:T.ink     },
              { h:r.salidaVueltaStr,    l:"Salida de vuelta",                     c:T.brass   },
              { h:r.llegadaBaseStr,     l:"Llegada a base",                       c:r.nightRisk?T.danger:T.ok },
              { h:r.sunsetStr,          l:"Puesta de sol",                        c:T.warn    },
            ].map(({h,l,c},i)=>(
              <div key={i}>{i>0&&<Divider/>}
                <div style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 0" }}>
                  <div style={{ fontSize:16, fontWeight:700, color:c, minWidth:44,
                    fontFamily:"'DM Mono',monospace" }}>{h}</div>
                  <div style={{ color:T.inkMid, fontSize:12.5 }}>{l}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}


// ── FONDEO & GARREO ───────────────────────────────────────────────────────────
const FONDEOS_INIT = [
  { id:1, nombre:"Cala del Pino", lat:36.741, lon:-3.921, prof:6, cadena:42, fecha:"15 Mar 2025", valoracion:5, notas:"Arena limpia, bien protegido del E" },
  { id:2, nombre:"Ensenada de Maro", lat:36.734, lon:-3.832, prof:8, cadena:56, fecha:"02 Feb 2025", valoracion:4, notas:"Algo de corriente. Fondo mixto arena-roca" },
];

function distanciaMetros(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLon = (lon2-lon1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function cadenaSugerida(prof, viento="normal") {
  const ratio = viento === "fuerte" ? 7 : 5;
  return Math.ceil(prof * ratio);
}

function Fondeo() {
  const [tab, setTab] = useState("fondear");

  // ── GPS STATE ──
  const [pos, setPos]           = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [watching, setWatching] = useState(false);
  const watchRef                = useRef(null);

  // ── ANCHOR STATE ──
  const [ancla, setAncla]         = useState(null); // {lat, lon}
  const [alarmaActiva, setAlarma] = useState(false);
  const [alarmaDisparada, setAlarmaDisparada] = useState(false);
  const [cadena, setCadena]       = useState(30);   // metros filados
  const [sonando, setSonando]     = useState(false);
  const audioRef                  = useRef(null);

  // ── FONDEOS GUARDADOS ──
  const [fondeos, setFondeos]     = useState([]);
  const [loadingF, setLoadingF]   = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [formFondeo, setFormFondeo] = useState({
    nombre:"", profundidad:"", viento:"", direccion_viento:"N",
    resguardado_de:"", valoracion:"4", notas:""
  });
  const updF = f => e => setFormFondeo(v=>({...v,[f]:e.target.value}));

  // ── GPS WATCH ──
  useEffect(()=>{
    if (!navigator.geolocation) { setGpsError("GPS no disponible"); return; }
    setWatching(true);
    watchRef.current = navigator.geolocation.watchPosition(
      p => { setPos({ lat:p.coords.latitude, lon:p.coords.longitude, acc:p.coords.accuracy }); setGpsError(null); },
      e => setGpsError("Sin señal GPS"),
      { enableHighAccuracy:true, maximumAge:3000, timeout:10000 }
    );
    return () => { if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current); };
  },[]);

  // ── GARREO CHECK ──
  useEffect(()=>{
    if (!ancla || !pos || !alarmaActiva) return;
    const dist = distanciaMetros(ancla.lat, ancla.lon, pos.lat, pos.lon);
    const limite = cadena + 16; // cadena filada + eslora Leonidas
    if (dist > limite && !alarmaDisparada) {
      setAlarmaDisparada(true);
      setSonando(true);
      // Vibración del dispositivo
      if (navigator.vibrate) navigator.vibrate([500,200,500,200,500]);
    } else if (dist <= limite && alarmaDisparada) {
      setAlarmaDisparada(false);
      setSonando(false);
    }
  },[pos, ancla, alarmaActiva, cadena, alarmaDisparada]);

  // ── SONIDO ──
  useEffect(()=>{
    if (sonando) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      let stopped = false;
      const beep = () => {
        if (stopped) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = "square";
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.3);
        setTimeout(()=>{ if(!stopped) beep(); }, 800);
      };
      beep();
      audioRef.current = { stop:()=>{ stopped=true; ctx.close(); } };
    } else {
      if (audioRef.current) { audioRef.current.stop(); audioRef.current=null; }
    }
    return ()=>{ if(audioRef.current) { audioRef.current.stop(); audioRef.current=null; } };
  },[sonando]);

  // ── DISTANCIA Y RUMBO ──
  const distAncla = ancla && pos ? distanciaMetros(ancla.lat, ancla.lon, pos.lat, pos.lon) : null;

  function rumboAncla(ancla, pos) {
    if (!ancla || !pos) return null;
    const dLon = (ancla.lon - pos.lon) * Math.PI/180;
    const lat1 = pos.lat * Math.PI/180;
    const lat2 = ancla.lat * Math.PI/180;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    const brng = (Math.atan2(y,x)*180/Math.PI + 360) % 360;
    return Math.round(brng);
  }
  const rumbo = rumboAncla(ancla, pos);

  function echarAncla() {
    if (!pos) return;
    setAncla({ lat:pos.lat, lon:pos.lon });
    setAlarma(true);
    setAlarmaDisparada(false);
    setSonando(false);
  }

  function levantarAncla() {
    setAncla(null);
    setAlarma(false);
    setAlarmaDisparada(false);
    setSonando(false);
  }

  // ── CARGAR FONDEOS ──
  async function cargarFondeos() {
    try {
      setLoadingF(true);
      const d = await db("fondeos","GET",null,"?order=fecha.desc");
      setFondeos(d);
    } catch(e){} finally { setLoadingF(false); }
  }
  useEffect(()=>{ cargarFondeos(); },[]);

  async function guardarFondeo() {
    if (!pos) return;
    setSaving(true);
    try {
      await db("fondeos","POST",{
        nombre: formFondeo.nombre||`Fondeo ${new Date().toLocaleDateString("es")}`,
        fecha: new Date().toISOString().split("T")[0],
        lat: pos.lat, lon: pos.lon,
        profundidad: parseFloat(formFondeo.profundidad)||null,
        viento: formFondeo.viento||null,
        direccion_viento: formFondeo.direccion_viento||null,
        resguardado_de: formFondeo.resguardado_de||null,
        valoracion: parseInt(formFondeo.valoracion)||4,
        notas: formFondeo.notas||null,
        patron: "Guille",
      });
      setShowForm(false);
      setFormFondeo({ nombre:"", profundidad:"", viento:"", direccion_viento:"N", resguardado_de:"", valoracion:"4", notas:"" });
      cargarFondeos();
    } catch(e){ alert("Error: "+e.message); }
    finally { setSaving(false); }
  }

  async function eliminarFondeo(id) {
    if (!window.confirm("Eliminar este fondeo?")) return;
    try { await db(`fondeos?id=eq.${id}`,"DELETE"); cargarFondeos(); }
    catch(e){}
  }

  const DIRS = ["N","NE","E","SE","S","SO","O","NO"];
  const estrellas = n => "★".repeat(n) + "☆".repeat(5-n);

  return (
    <div>
      <Hdr title="Fondeo"/>

      {/* Tabs */}
      <div style={{display:"flex",background:T.bg,borderRadius:7,padding:3,
        gap:3,marginBottom:18,border:`1px solid ${T.rimHi}`}}>
        {[["fondear","Fondear"],["historico","Mis fondeos"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{
            flex:1,padding:"9px",borderRadius:5,border:"none",cursor:"pointer",
            background:tab===id?T.surface:"transparent",
            color:tab===id?T.ink:T.inkDim,fontSize:12,fontWeight:tab===id?600:400,
            fontFamily:"inherit",boxShadow:tab===id?"0 1px 3px rgba(0,0,0,0.15)":"none"}}>
            {lbl}
          </button>
        ))}
      </div>

      {/* ══ PESTAÑA FONDEAR ══ */}
      {tab==="fondear" && (
        <div>
          {/* GPS status */}
          {gpsError ? (
            <Card style={{marginBottom:14}}>
              <div style={{color:T.warn,fontSize:13,textAlign:"center"}}>
                {gpsError} -- activa el GPS del dispositivo
              </div>
            </Card>
          ) : !pos ? (
            <Card style={{marginBottom:14}}>
              <div style={{color:T.inkDim,fontSize:13,textAlign:"center",padding:"8px 0"}}>
                Obteniendo posicion GPS...
              </div>
            </Card>
          ) : null}

          {/* ALARMA DISPARADA */}
          {alarmaDisparada && (
            <div style={{background:T.danger,borderRadius:12,padding:"16px 20px",
              marginBottom:16,animation:"garreo-pulse 1s infinite",
              display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{color:"#fff",fontWeight:700,fontSize:16}}>GARREANDO</div>
                <div style={{color:"rgba(255,255,255,0.8)",fontSize:11,marginTop:3,
                  fontFamily:"'DM Mono',monospace"}}>
                  Distancia: {distAncla?.toFixed(0)}m -- Limite: {cadena+16}m
                </div>
              </div>
              <button onClick={()=>setSonando(false)} style={{background:"rgba(255,255,255,0.2)",
                border:"none",borderRadius:8,padding:"8px 12px",color:"#fff",
                fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
                Silenciar
              </button>
            </div>
          )}

          {/* ESTADO FONDEO */}
          {ancla ? (
            <Card style={{marginBottom:16,border:`2px solid ${alarmaDisparada?T.danger:T.ok}`}} pad="20px">
              <div style={{textAlign:"center",marginBottom:16}}>
                <div style={{fontSize:9.5,color:T.ok,letterSpacing:2,textTransform:"uppercase",
                  fontFamily:"'DM Mono',monospace",marginBottom:6}}>Ancla echada</div>

                {/* Flecha hacia el ancla */}
                <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
                  <div style={{
                    width:64,height:64,borderRadius:"50%",
                    background: alarmaDisparada?T.danger+"15":T.ok+"15",
                    border:`2px solid ${alarmaDisparada?T.danger:T.ok}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:28,
                    transform: rumbo!==null ? `rotate(${rumbo}deg)` : "none",
                    transition:"transform 0.5s"
                  }}>
                    ⚓
                  </div>
                </div>

                <div style={{fontSize:36,fontWeight:600,color:alarmaDisparada?T.danger:T.ok,
                  fontFamily:"'Cormorant Garamond',serif",lineHeight:1}}>
                  {distAncla !== null ? `${distAncla.toFixed(0)} m` : "--"}
                </div>
                <div style={{color:T.inkDim,fontSize:10,marginTop:4,
                  fontFamily:"'DM Mono',monospace"}}>
                  al ancla {rumbo!==null?`· rumbo ${rumbo}°`:""}
                </div>
              </div>

              {/* Barra de seguridad */}
              {distAncla !== null && (
                <div style={{marginBottom:16}}>
                  <div style={{background:T.surfaceUp,borderRadius:4,height:6,overflow:"hidden"}}>
                    <div style={{
                      height:"100%",
                      width:`${Math.min(100,(distAncla/(cadena+16))*100)}%`,
                      background: distAncla>cadena+16?T.danger:distAncla>cadena*0.8?T.warn:T.ok,
                      borderRadius:4,transition:"width 0.5s"
                    }}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                    <span style={{fontSize:9.5,color:T.inkDim,fontFamily:"'DM Mono',monospace"}}>0m</span>
                    <span style={{fontSize:9.5,color:T.inkDim,fontFamily:"'DM Mono',monospace"}}>
                      Limite: {cadena+16}m
                    </span>
                  </div>
                </div>
              )}

              <button onClick={levantarAncla} style={{
                width:"100%",background:T.danger+"15",border:`1px solid ${T.danger}40`,
                borderRadius:8,padding:"11px",color:T.danger,fontSize:13,fontWeight:600,
                cursor:"pointer",fontFamily:"inherit"}}>
                Levantar ancla
              </button>
            </Card>
          ) : (
            /* BOTON ECHAR ANCLA */
            <Card style={{marginBottom:16}} pad="24px 20px">
              <div style={{textAlign:"center",marginBottom:20}}>
                <div style={{fontSize:9.5,color:T.inkDim,letterSpacing:2,textTransform:"uppercase",
                  fontFamily:"'DM Mono',monospace",marginBottom:8}}>Sin fondeo activo</div>
                {pos && (
                  <div style={{color:T.inkDim,fontSize:10,fontFamily:"'DM Mono',monospace"}}>
                    {pos.lat.toFixed(5)}, {pos.lon.toFixed(5)} · acc {pos.acc?.toFixed(0)}m
                  </div>
                )}
              </div>
              <button onClick={echarAncla} disabled={!pos} style={{
                width:"100%",background:pos?T.brass:T.surfaceUp,
                border:"none",borderRadius:10,padding:"16px",
                color:pos?"#fff":T.inkDim,fontSize:16,fontWeight:700,
                cursor:pos?"pointer":"not-allowed",fontFamily:"inherit",
                boxShadow:pos?"0 4px 16px rgba(140,106,46,0.3)":"none",
                transition:"all 0.2s"}}>
                Echar ancla aqui
              </button>
            </Card>
          )}

          {/* CADENA */}
          <Card style={{marginBottom:16}} pad="14px 18px">
            <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
              fontFamily:"'DM Mono',monospace",marginBottom:8}}>Cadena filada</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <input type="range" min="10" max="100" step="5" value={cadena}
                onChange={e=>setCadena(parseInt(e.target.value))}
                style={{flex:1,accentColor:T.brass}}/>
              <span style={{fontSize:20,fontWeight:700,minWidth:52,textAlign:"right",
                fontFamily:"'Cormorant Garamond',serif",color:T.brassLt}}>
                {cadena} m
              </span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
              <span style={{fontSize:9.5,color:T.inkDim,fontFamily:"'DM Mono',monospace"}}>
                Relacion 5:1 -- prof {(cadena/5).toFixed(1)}m
              </span>
              <span style={{fontSize:9.5,color:T.inkDim,fontFamily:"'DM Mono',monospace"}}>
                Limite alarma: {cadena+16}m
              </span>
            </div>
          </Card>

          {/* GUARDAR FONDEO */}
          {pos && (
            <div>
              <Btn onClick={()=>setShowForm(!showForm)} variant="ghost">
                {showForm?"Cancelar":"+ Guardar este fondeo en el historico"}
              </Btn>
              {showForm && (
                <Card style={{marginTop:12}} pad="16px">
                  <div style={{fontSize:11,color:T.brass,fontWeight:700,marginBottom:12,
                    textTransform:"uppercase",letterSpacing:1,fontFamily:"'DM Mono',monospace"}}>
                    Datos del fondeo
                  </div>
                  <FInput label="Nombre del lugar" value={formFondeo.nombre}
                    onChange={updF("nombre")} placeholder="Cala del Pino, Ensenada..."/>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <FInput label="Profundidad (m)" type="number"
                      value={formFondeo.profundidad} onChange={updF("profundidad")}/>
                    <FInput label="Viento (kn)" value={formFondeo.viento}
                      onChange={updF("viento")} placeholder="12kn NE"/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <FSelect label="Direccion viento" value={formFondeo.direccion_viento}
                      onChange={updF("direccion_viento")} options={DIRS}/>
                    <FSelect label="Resguardado de" value={formFondeo.resguardado_de}
                      onChange={updF("resguardado_de")} options={["","N","NE","E","SE","S","SO","O","NO"]}/>
                  </div>
                  <FInput label="Valoracion (1-5)" type="number"
                    value={formFondeo.valoracion} onChange={updF("valoracion")}/>
                  <FTextarea label="Notas" value={formFondeo.notas} onChange={updF("notas")}
                    placeholder="Buen tenedero, arena limpia..."/>
                  <Btn onClick={guardarFondeo}>{saving?"Guardando...":"Guardar fondeo"}</Btn>
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══ PESTAÑA HISTORICO ══ */}
      {tab==="historico" && (
        <div>
          {loadingF ? (
            <Card><div style={{color:T.inkDim,fontSize:13,textAlign:"center",padding:"20px 0"}}>Cargando...</div></Card>
          ) : fondeos.length===0 ? (
            <Card>
              <div style={{color:T.inkDim,fontSize:13,fontStyle:"italic",textAlign:"center",padding:"12px 0"}}>
                Sin fondeos guardados. Fondea y guarda el punto desde la pestana anterior.
              </div>
            </Card>
          ) : fondeos.map(f=>{
            const distF = pos ? distanciaMetros(pos.lat, pos.lon, f.lat, f.lon) : null;
            return (
              <Card key={f.id} style={{marginBottom:11}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{flex:1}}>
                    <div style={{color:T.ink,fontWeight:600,fontSize:17,
                      fontFamily:"'Cormorant Garamond',serif"}}>{f.nombre||"Fondeo"}</div>
                    <div style={{color:T.inkDim,fontSize:9.5,marginTop:3,
                      fontFamily:"'DM Mono',monospace"}}>
                      {f.fecha}
                      {f.profundidad ? ` · ${f.profundidad}m prof.` : ""}
                      {f.viento ? ` · ${f.viento}` : ""}
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    {f.valoracion && (
                      <div style={{color:T.brassLt,fontSize:11}}>{estrellas(f.valoracion)}</div>
                    )}
                    {distF !== null && (
                      <div style={{color:T.inkDim,fontSize:9.5,marginTop:3,
                        fontFamily:"'DM Mono',monospace"}}>
                        {distF>1000 ? `${(distF/1000).toFixed(1)}km` : `${distF.toFixed(0)}m`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                  {f.resguardado_de && (
                    <span style={{background:T.ok+"15",border:`1px solid ${T.ok}30`,
                      borderRadius:4,padding:"2px 8px",fontSize:9.5,color:T.ok,
                      fontFamily:"'DM Mono',monospace"}}>
                      Prot. del {f.resguardado_de}
                    </span>
                  )}
                  {f.direccion_viento && (
                    <span style={{background:T.info+"15",border:`1px solid ${T.info}30`,
                      borderRadius:4,padding:"2px 8px",fontSize:9.5,color:T.info,
                      fontFamily:"'DM Mono',monospace"}}>
                      Viento {f.direccion_viento}
                    </span>
                  )}
                </div>

                {f.notas && (
                  <div style={{color:T.inkDim,fontSize:12,lineHeight:1.4,marginBottom:8}}>{f.notas}</div>
                )}

                <div style={{display:"flex",gap:7}}>
                  {f.lat && f.lon && (
                    <a href={`https://maps.google.com?q=${f.lat},${f.lon}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{flex:1,background:T.brassDim,border:`1px solid ${T.brass}35`,
                        borderRadius:7,padding:"7px",color:T.brass,fontSize:11,
                        textDecoration:"none",textAlign:"center",fontWeight:600}}>
                      Ver en mapa
                    </a>
                  )}
                  <button onClick={()=>eliminarFondeo(f.id)} style={{background:"none",
                    border:`1px solid ${T.danger}40`,borderRadius:7,padding:"7px 12px",
                    color:T.danger,fontSize:11,cursor:"pointer"}}>
                    Eliminar
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ── MOTOR HUB (fusión Mantenimiento + Combustible) ───────────────────────────
function MotorHub({ setScreen }) {
  return (
    <div>
      <div style={{ fontSize:22, fontWeight:500, color:T.ink,
        letterSpacing:-0.3, marginBottom:6 }}>Motor</div>
      <div style={{ fontSize:13, color:T.inkDim, marginBottom:24 }}>
        Mantenimiento · Combustible
      </div>
      <div style={{ background:T.surface, border:`0.5px solid ${T.rim}`,
        borderRadius:12, overflow:"hidden", marginBottom:20 }}>
        {[
          { id:"mantenimiento", label:"Mantenimiento",
            sub:"Tareas, averías y revisiones" },
          { id:"combustible",   label:"Combustible",
            sub:"Repostajes y nivel del depósito" },
        ].map((item, i) => (
          <div key={item.id} onClick={()=>setScreen(item.id)}
            style={{ display:"flex", alignItems:"center",
              justifyContent:"space-between",
              padding:"15px 18px",
              borderTop: i>0 ? `0.5px solid ${T.rim}` : "none",
              cursor:"pointer" }}>
            <div>
              <div style={{ fontSize:15, fontWeight:500, color:T.ink,
                marginBottom:2 }}>{item.label}</div>
              <div style={{ fontSize:12, color:T.inkDim }}>{item.sub}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={T.inkDim} strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── A BORDO HUB (fusión Inventario + Seguridad) ───────────────────────────────
function ABordoHub({ setScreen }) {
  return (
    <div>
      <div style={{ fontSize:22, fontWeight:500, color:T.ink,
        letterSpacing:-0.3, marginBottom:6 }}>A bordo</div>
      <div style={{ fontSize:13, color:T.inkDim, marginBottom:24 }}>
        Inventario · Seguridad · Habituallamiento
      </div>
      <div style={{ background:T.surface, border:`0.5px solid ${T.rim}`,
        borderRadius:12, overflow:"hidden", marginBottom:20 }}>
        {[
          { id:"inventario", label:"Inventario",
            sub:"Repuestos y material a bordo" },
          { id:"seguridad",  label:"Seguridad",
            sub:"Equipos obligatorios y caducidades" },
        ].map((item, i) => (
          <div key={item.id} onClick={()=>setScreen(item.id)}
            style={{ display:"flex", alignItems:"center",
              justifyContent:"space-between",
              padding:"15px 18px",
              borderTop: i>0 ? `0.5px solid ${T.rim}` : "none",
              cursor:"pointer" }}>
            <div>
              <div style={{ fontSize:15, fontWeight:500, color:T.ink,
                marginBottom:2 }}>{item.label}</div>
              <div style={{ fontSize:12, color:T.inkDim }}>{item.sub}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={T.inkDim} strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── EL BARCO HUB (Ficha + Documentos) ────────────────────────────────────────
function ElBarcoHub({ setScreen }) {
  return (
    <div>
      <div style={{ fontSize:22, fontWeight:500, color:T.ink,
        letterSpacing:-0.3, marginBottom:6 }}>El barco</div>
      <div style={{ fontSize:13, color:T.inkDim, marginBottom:24 }}>
        Leonidas · Sunseeker Portofino 53
      </div>
      <div style={{ background:T.surface, border:`0.5px solid ${T.rim}`,
        borderRadius:12, overflow:"hidden", marginBottom:20 }}>
        {[
          { id:"ficha",      label:"Ficha técnica",
            sub:"Datos, matrícula y especificaciones" },
          { id:"documentos", label:"Documentos",
            sub:"Certificados y archivos del barco" },
        ].map((item, i) => (
          <div key={item.id} onClick={()=>setScreen(item.id)}
            style={{ display:"flex", alignItems:"center",
              justifyContent:"space-between",
              padding:"15px 18px",
              borderTop: i>0 ? `0.5px solid ${T.rim}` : "none",
              cursor:"pointer" }}>
            <div>
              <div style={{ fontSize:15, fontWeight:500, color:T.ink,
                marginBottom:2 }}>{item.label}</div>
              <div style={{ fontSize:12, color:T.inkDim }}>{item.sub}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={T.inkDim} strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DRAWER NUEVA SALIDA ───────────────────────────────────────────────────────
function DrawerNuevaSalida({ onClose, onSaved, ultimasHoras }) {
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split("T")[0],
    hora_salida: "", hora_llegada: "",
    patron: "Guille", salida: "Caleta de Vélez", llegada: "",
    horas_motor_inicio: ultimasHoras || "",
    horas_motor_fin: "",
    combustible_pct: "80",
    condiciones: "", incidencias: "Sin novedad", notas: "",
    tripulacion_ids: [],
  });
  const [saving, setSaving] = useState(false);
  const [tripDisp, setTripDisp] = useState([]);
  const upd = f => e => setForm(v=>({...v,[f]:e.target.value}));

  useEffect(()=>{
    db("tripulacion","GET",null,"?activo=eq.true&order=nombre.asc")
      .then(r=>setTripDisp(r)).catch(()=>{});
  },[]);

  async function guardar() {
    if (!form.llegada) return;
    setSaving(true);
    try {
      const payload = {
        fecha: form.fecha,
        hora_salida: form.hora_salida||null,
        hora_llegada: form.hora_llegada||null,
        patron: form.patron,
        salida: form.salida, llegada: form.llegada,
        horas_motor_inicio: parseFloat(form.horas_motor_inicio)||null,
        horas_motor_fin: parseFloat(form.horas_motor_fin)||null,
        combustible_cargado: parseFloat(form.combustible_pct)||null,
        condiciones: form.condiciones,
        incidencias: form.incidencias||"Sin novedad",
        notas: form.notas||null,
      };
      const res = await db("bitacora","POST",payload);
      const bid = res[0]?.id;
      if (bid && form.tripulacion_ids?.length > 0) {
        await Promise.all(form.tripulacion_ids.map(tid =>
          db("bitacora_tripulacion","POST",{ bitacora_id:bid, tripulante_id:tid })
        ));
      }
      onSaved?.();
      onClose();
    } catch(e){ alert("Error: "+e.message); }
    finally { setSaving(false); }
  }

  return (
    <div style={{ position:"fixed", inset:0, zIndex:300 }}>
      {/* overlay */}
      <div onClick={onClose}
        style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.3)" }}/>

      {/* sheet */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0,
        background:T.surface, borderRadius:"20px 20px 0 0",
        maxHeight:"90dvh", overflowY:"auto",
        animation:"slideUp 0.25s ease" }}>

        {/* handle */}
        <div style={{ padding:"12px 0 6px", display:"flex",
          justifyContent:"center", flexShrink:0 }}>
          <div style={{ width:36, height:4, background:T.rim,
            borderRadius:2 }}/>
        </div>

        <div style={{ padding:"0 20px 40px" }}>
          <div style={{ display:"flex", alignItems:"center",
            justifyContent:"space-between", marginBottom:20 }}>
            <div style={{ fontSize:18, fontWeight:500, color:T.ink }}>
              Nueva salida
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none",
              fontSize:22, color:T.inkDim, cursor:"pointer",
              padding:"2px 6px", lineHeight:1 }}>×</button>
          </div>

          {/* Ruta */}
          <div style={{ background:T.surfaceUp, borderRadius:12,
            overflow:"hidden", marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12,
              padding:"11px 14px",
              borderBottom:`0.5px solid ${T.rim}` }}>
              <div style={{ width:8, height:8, borderRadius:"50%",
                background:T.ok, flexShrink:0 }}/>
              <div style={{ flex:1, fontSize:13, color:T.inkDim }}>
                {form.salida}
              </div>
              <input type="time" value={form.hora_salida}
                onChange={upd("hora_salida")}
                style={{ background:"none", border:"none", color:T.ink,
                  fontSize:13, fontFamily:"inherit", outline:"none",
                  width:56 }}/>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12,
              padding:"11px 14px" }}>
              <div style={{ width:8, height:8, borderRadius:2,
                background:T.danger, flexShrink:0 }}/>
              <input value={form.llegada} onChange={upd("llegada")}
                placeholder="Destino…"
                style={{ flex:1, background:"none", border:"none",
                  color:T.ink, fontSize:13, fontFamily:"inherit",
                  outline:"none" }}/>
              <input type="time" value={form.hora_llegada}
                onChange={upd("hora_llegada")}
                style={{ background:"none", border:"none", color:T.ink,
                  fontSize:13, fontFamily:"inherit", outline:"none",
                  width:56 }}/>
            </div>
          </div>

          {/* Patrón chips */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:500, color:T.inkDim,
              marginBottom:7 }}>Patrón</div>
            <div style={{ display:"flex", gap:6 }}>
              {["Guille","Varo"].map(p=>(
                <button key={p} onClick={()=>setForm(v=>({...v,patron:p}))}
                  style={{ padding:"7px 16px", borderRadius:20, fontSize:13,
                    cursor:"pointer", fontFamily:"inherit", fontWeight:500,
                    border:`0.5px solid ${form.patron===p?T.ink:T.rim}`,
                    background:form.patron===p?T.ink:"transparent",
                    color:form.patron===p?"#fff":T.inkMid }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Combustible */}
          <div style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:7 }}>
              <div style={{ fontSize:11, fontWeight:500, color:T.inkDim }}>
                Combustible
              </div>
              <div style={{ fontSize:14, fontWeight:500,
                color:parseInt(form.combustible_pct)<40?T.danger:T.brass }}>
                {form.combustible_pct}%
              </div>
            </div>
            <input type="range" min="0" max="100" step="10"
              value={form.combustible_pct} onChange={upd("combustible_pct")}
              style={{ width:"100%", accentColor:T.brass }}/>
          </div>

          {/* Horas motor */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
            gap:10, marginBottom:14 }}>
            <FInput label="H. motor inicio" type="number"
              value={form.horas_motor_inicio}
              onChange={upd("horas_motor_inicio")}/>
            <FInput label="H. motor fin" type="number"
              value={form.horas_motor_fin}
              onChange={upd("horas_motor_fin")}/>
          </div>

          {/* Tripulación */}
          {tripDisp.length > 0 && (
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:500, color:T.inkDim,
                marginBottom:7 }}>Tripulación a bordo</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {tripDisp.map(t=>{
                  const sel = form.tripulacion_ids?.includes(t.id);
                  return (
                    <button key={t.id}
                      onClick={()=>setForm(v=>({...v,
                        tripulacion_ids:sel
                          ? v.tripulacion_ids.filter(id=>id!==t.id)
                          : [...(v.tripulacion_ids||[]),t.id]
                      }))}
                      style={{ padding:"6px 13px", borderRadius:20,
                        fontSize:12, cursor:"pointer", fontFamily:"inherit",
                        border:`0.5px solid ${sel?T.ink:T.rim}`,
                        background:sel?T.ink:"transparent",
                        color:sel?"#fff":T.inkMid }}>
                      {t.alias||t.nombre}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <FTextarea label="Notas / condiciones"
            value={form.notas} onChange={upd("notas")}
            placeholder="NE 10kn, mar llana, sin novedad…"/>

          <button onClick={guardar} disabled={!form.llegada||saving}
            style={{ width:"100%", background:form.llegada?T.ink:T.rim,
              color:form.llegada?"#fff":T.inkDim, border:"none",
              borderRadius:12, padding:"14px", fontSize:14, fontWeight:500,
              cursor:form.llegada?"pointer":"default",
              fontFamily:"inherit" }}>
            {saving?"Guardando…":"Guardar entrada"}
          </button>
        </div>
      </div>
    </div>
  );
}


// ── SIDEBAR ───────────────────────────────────────────────────────────────────
const MENU = [
  {
    section: "Navegar",
    items: [
      { id:"dashboard",   label:"Hoy",         svg:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 5v5l4 2" },
      { id:"clima",       label:"Clima",        svg:"M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" },
      { id:"fondeo",      label:"Fondeo",       svg:"M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M12 8v14 M5 12H2a10 10 0 0 0 20 0h-3" },
    ]
  },
  {
    section: "A bordo",
    items: [
      { id:"bitacora",    label:"Bitácora",     svg:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" },
      { id:"tripulacion", label:"Tripulación",  svg:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" },
      { id:"puertos",     label:"Puertos",      svg:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" },
    ]
  },
  {
    section: "Mantenimiento",
    items: [
      { id:"motor",       label:"Motor",        svg:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" },
      { id:"abordo",      label:"A bordo",      svg:"M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" },
      { id:"elbarco",     label:"El barco",     svg:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6.29 6.29" },
    ]
  },
  {
    section: "Asistente",
    items: [
      { id:"ia",          label:"IA Náutica",   svg:"M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" },
    ]
  },
];

const SCREENS = {
  dashboard:    Dashboard,
  clima:        Clima,
  fondeo:       Fondeo,
  bitacora:     Bitacora,
  tripulacion:  Tripulacion,
  puertos:      Puertos,
  motor:        MotorHub,
  mantenimiento:Mantenimiento,
  combustible:  Combustible,
  abordo:       ABordoHub,
  inventario:   Inventario,
  seguridad:    Seguridad,
  elbarco:      ElBarcoHub,
  ficha:        Ficha,
  documentos:   Documentos,
  ia:           AsistenteIA,
};

function SidebarContent({ screen, onNav, onClose, showClose }) {
  return (
    <div style={{ height:"100%", background:T.sidebarBg,
      display:"flex", flexDirection:"column" }}>

      {/* Logo */}
      <div style={{ padding:"20px 18px 16px", flexShrink:0,
        borderBottom:`1px solid ${T.sidebarLine}`,
        display:"flex", alignItems:"center",
        justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <AppLogo size={28}/>
          <div>
            <div style={{ fontSize:16, fontWeight:600, color:"#fff",
              lineHeight:1, fontFamily:"'Cormorant Garamond',serif" }}>
              ShipLog
            </div>
            <div style={{ fontSize:9, color:T.sidebarDim,
              letterSpacing:2.5, textTransform:"uppercase",
              marginTop:3 }}>Leonidas</div>
          </div>
        </div>
        {showClose && (
          <button onClick={onClose}
            style={{ background:"none", border:"none", cursor:"pointer",
              color:T.sidebarInk, fontSize:18, lineHeight:1,
              padding:"2px 4px" }}>✕</button>
        )}
      </div>

      {/* Nav items */}
      <div style={{ flex:1, overflowY:"auto", padding:"8px 0 20px" }}>
        {MENU.map(group => (
          <div key={group.section} style={{ marginBottom:4 }}>
            <div style={{ fontSize:9, color:T.sidebarDim,
              letterSpacing:2.5, textTransform:"uppercase",
              padding:"12px 18px 5px" }}>
              {group.section}
            </div>
            {group.items.map(item => {
              const active = screen === item.id ||
                (item.id === "motor"   && ["mantenimiento","combustible"].includes(screen)) ||
                (item.id === "abordo"  && ["inventario","seguridad"].includes(screen)) ||
                (item.id === "elbarco" && ["ficha","documentos"].includes(screen));
              return (
                <button key={item.id} onClick={()=>onNav(item.id)}
                  style={{ width:"100%", display:"flex", alignItems:"center",
                    gap:11, padding:"10px 18px", border:"none",
                    cursor:"pointer", textAlign:"left",
                    fontFamily:"inherit",
                    background: active ? "rgba(176,141,87,0.14)" : "transparent",
                    borderLeft: active
                      ? `2px solid ${T.brass}`
                      : "2px solid transparent" }}>
                  <Icon d={item.svg}
                    color={active ? T.brassLt : T.sidebarInk}
                    size={15} sw={active ? 2 : 1.5}/>
                  <span style={{ fontSize:13,
                    color: active ? T.brassLt : "rgba(255,255,255,0.65)",
                    fontWeight: active ? 500 : 400 }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerKey, setDrawerKey] = useState(0);

  function navTo(id) { setScreen(id); setSideOpen(false); }

  function openDrawer() {
    setDrawerKey(k => k + 1);
    setShowDrawer(true);
  }

  const Screen = SCREENS[screen] || Dashboard;

  // FAB visible on most screens — not on detail screens that have own + button
  const showFAB = !["ficha","ia","fondeo","clima"].includes(screen);

  return (
    <div style={{ height:"100dvh", background:T.bg, color:T.ink,
      fontFamily:"'Crimson Pro',Georgia,serif",
      display:"flex", overflow:"hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Crimson+Pro:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box }
        ::-webkit-scrollbar { width: 0 }
        input::placeholder { color: ${T.inkDim} }
        select, textarea, button { font-family: inherit }
        @keyframes blink { 0%,100%{opacity:.2} 50%{opacity:1} }
        @keyframes garreo-pulse { from{box-shadow:0 0 0 0 rgba(168,52,40,0.5)} to{box-shadow:0 0 0 14px rgba(168,52,40,0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideIn { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        .app-sidebar { display:none }
        .app-hamburger { display:flex }
        @media(min-width:768px) {
          .app-sidebar { display:flex !important }
          .app-hamburger { display:none !important }
          .app-content { max-width: none; margin: 0 }
        }
        @media(min-width:1024px) {
          .app-inner { padding: 28px 36px 60px !important; max-width: 820px; margin: 0 auto; width: 100% }
        }
      `}</style>

      {/* SIDEBAR OVERLAY — mobile */}
      {sideOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex" }}>
          <div onClick={()=>setSideOpen(false)}
            style={{ position:"absolute", inset:0,
              background:"rgba(0,0,0,0.6)",
              animation:"fadeIn 0.2s ease" }}/>
          <div style={{ position:"relative", width:260, height:"100%",
            animation:"slideIn 0.22s ease", zIndex:1,
            boxShadow:"6px 0 32px rgba(0,0,0,0.45)" }}>
            <SidebarContent
              screen={screen}
              onNav={navTo}
              onClose={()=>setSideOpen(false)}
              showClose={true}/>
          </div>
        </div>
      )}

      {/* SIDEBAR FIXED — tablet/desktop */}
      <div className="app-sidebar"
        style={{ width:232, flexShrink:0, height:"100dvh" }}>
        <SidebarContent
          screen={screen}
          onNav={navTo}
          onClose={()=>{}}
          showClose={false}/>
      </div>

      {/* MAIN */}
      <div className="app-content"
        style={{ flex:1, display:"flex", flexDirection:"column",
          minWidth:0, position:"relative", overflow:"hidden" }}>

        {/* TOP HEADER — mobile only */}
        <div className="app-hamburger"
          style={{ position:"sticky", top:0, zIndex:100,
            background:T.surface, borderBottom:`0.5px solid ${T.rim}`,
            padding:"12px 18px",
            alignItems:"center", justifyContent:"space-between",
            flexShrink:0 }}>
          <button onClick={()=>setSideOpen(true)}
            style={{ background:"none", border:`0.5px solid ${T.rim}`,
              borderRadius:8, padding:"8px 10px", cursor:"pointer",
              display:"flex", flexDirection:"column", gap:4.5 }}>
            {[0,1,2].map(i=>(
              <div key={i} style={{ width:17, height:1.5,
                background:T.inkMid, borderRadius:1 }}/>
            ))}
          </button>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:15, fontWeight:500, color:T.ink,
              fontFamily:"'Cormorant Garamond',serif" }}>
              {MENU.flatMap(g=>g.items).find(i=>i.id===screen)?.label || "Hoy"}
            </div>
          </div>
          <div style={{ width:37 }}/>
        </div>

        {/* CONTENT */}
        <div className="app-inner"
          style={{ flex:1, overflowY:"auto", overflowX:"hidden",
            padding:"22px 18px 100px",
            WebkitOverflowScrolling:"touch" }}>
          <Screen setScreen={navTo}/>
        </div>

        {/* FAB */}
        {showFAB && (
          <button onClick={openDrawer}
            style={{ position:"absolute", bottom:24, right:20,
              width:50, height:50, borderRadius:15,
              background:T.ink, border:"none", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 4px 20px rgba(13,27,42,0.3)",
              zIndex:50 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        )}
      </div>

      {/* DRAWER nueva salida */}
      {showDrawer && (
        <DrawerNuevaSalida
          key={drawerKey}
          onClose={()=>setShowDrawer(false)}
          onSaved={()=>{ navTo("bitacora"); }}
          ultimasHoras={""}
        />
      )}
    </div>
  );
}
