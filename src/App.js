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
  bg:       "#F4F1EC",
  surface:  "#FDFAF6",
  surfaceUp:"#EEE9DF",
  rim:      "#DDD8CF",
  rimHi:    "rgba(0,0,0,0.07)",
  ink:      "#1A1A18",
  inkMid:   "#4A4A44",
  inkDim:   "#9A9488",
  brass:    "#8C6A2E",
  brassLt:  "#A07C38",
  brassDim: "rgba(140,106,46,0.12)",
  ok:       "#2A7A52",
  warn:     "#B06A18",
  danger:   "#A83428",
  info:     "#2660A0",
  line:     "rgba(0,0,0,0.07)",
  lineHi:   "rgba(0,0,0,0.12)",
};

const NAV = [
  { id:"dashboard",     svg:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label:"Panel"       },
  { id:"ficha",         svg:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", label:"Barco"       },
  { id:"bitacora",      svg:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label:"Bitácora"    },
  { id:"mantenimiento", svg:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", label:"Mant."       },
  { id:"combustible",   svg:"M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3", label:"Combustible" },
  { id:"seguridad",     svg:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label:"Seguridad"   },
  { id:"puertos",       svg:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", label:"Puertos"     },
  { id:"inventario",    svg:"M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", label:"Inventario"  },
  { id:"documentos",    svg:"M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z", label:"Docs"        },
  { id:"patrones",      svg:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", label:"Patrones"    },
  { id:"ia",            svg:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", label:"IA"           },
  { id:"clima",         svg:"M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", label:"Clima"        },
  { id:"calculadora",   svg:"M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z", label:"Ruta"         },
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
    ok:      { c:T.ok,     l:"OK"        },
    warn:    { c:T.warn,   l:"Atención"  },
    danger:  { c:T.danger, l:"Vencido"   },
    info:    { c:T.info,   l:"Info"      },
    pendiente:{ c:T.warn,  l:"Pendiente" },
    reparado:{ c:T.ok,     l:"OK"        },
    bajo:    { c:T.warn,   l:"Stock bajo"},
  };
  const s = cfg[estado] || { c:T.inkDim, l:estado };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5,
      background:s.c+"18", border:`1px solid ${s.c}40`, color:s.c,
      borderRadius:4, padding:"2px 8px", fontSize:9.5, fontWeight:600,
      letterSpacing:0.8, textTransform:"uppercase", fontFamily:"'DM Mono',monospace",
      whiteSpace:"nowrap" }}>
      <span style={{ width:4, height:4, borderRadius:"50%", background:s.c, display:"inline-block" }}/>
      {s.l}
    </span>
  );
}

function Card({ children, style={}, pad="16px 18px" }) {
  return (
    <div style={{ background:T.surface, border:`1px solid ${T.rimHi}`,
      borderRadius:10, padding:pad,
      boxShadow:"0 1px 4px rgba(0,0,0,0.5), inset 0 0.5px 0 rgba(255,255,255,0.05)",
      ...style }}>
      {children}
    </div>
  );
}

function Hdr({ eyebrow, title, action }) {
  return (
    <div style={{ marginBottom:22, display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
      <div>
        <div style={{ fontSize:9.5, color:T.brass, letterSpacing:2.5, textTransform:"uppercase",
          fontFamily:"'DM Mono',monospace", marginBottom:5 }}>{eyebrow}</div>
        <h2 style={{ margin:0, fontSize:26, color:T.ink,
          fontFamily:"'Cormorant Garamond',serif", fontWeight:600, lineHeight:1 }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function Divider() { return <div style={{ height:1, background:T.line, margin:"0 -1px" }}/>; }

function Row({ label, value, accent }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0" }}>
      <span style={{ color:T.inkDim, fontSize:12 }}>{label}</span>
      <span style={{ color:accent||T.ink, fontSize:12.5, fontWeight:500, textAlign:"right", maxWidth:"58%" }}>{value}</span>
    </div>
  );
}


// ── FORM PRIMITIVES (defined globally to prevent re-render/deselect bug) ─────
function FInput({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <div style={{ marginBottom:10 }}>
      {label && <div style={{ fontSize:9, color:T.inkDim, letterSpacing:1.5, textTransform:"uppercase",
        fontFamily:"'DM Mono',monospace", marginBottom:5 }}>{label}</div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width:"100%", background:T.surfaceUp, border:`1px solid ${T.rimHi}`,
          borderRadius:7, padding:"10px 12px", color:T.ink, fontSize:14,
          fontFamily:"inherit", outline:"none" }}/>
    </div>
  );
}

function FSelect({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom:10 }}>
      {label && <div style={{ fontSize:9, color:T.inkDim, letterSpacing:1.5, textTransform:"uppercase",
        fontFamily:"'DM Mono',monospace", marginBottom:5 }}>{label}</div>}
      <select value={value} onChange={onChange}
        style={{ width:"100%", background:T.surfaceUp, border:`1px solid ${T.rimHi}`,
          borderRadius:7, padding:"10px 12px", color:T.ink, fontSize:14,
          fontFamily:"inherit", outline:"none" }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function FTextarea({ label, value, onChange, rows=2 }) {
  return (
    <div style={{ marginBottom:10 }}>
      {label && <div style={{ fontSize:9, color:T.inkDim, letterSpacing:1.5, textTransform:"uppercase",
        fontFamily:"'DM Mono',monospace", marginBottom:5 }}>{label}</div>}
      <textarea value={value} onChange={onChange} rows={rows}
        style={{ width:"100%", background:T.surfaceUp, border:`1px solid ${T.rimHi}`,
          borderRadius:7, padding:"10px 12px", color:T.ink, fontSize:14,
          fontFamily:"inherit", outline:"none", resize:"none" }}/>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

function Btn({ children, onClick, variant="primary", sm }) {
  const base = { border:"none", borderRadius:7, cursor:"pointer",
    fontSize:sm?11:12.5, fontWeight:700, fontFamily:"inherit", letterSpacing:0.4,
    padding: sm?"7px 14px":"11px 18px" };
  const styles = {
    primary: { background:T.brass, color:"#0C0F14", boxShadow:`0 0 16px ${T.brass}28` },
    ghost:   { background:"transparent", color:T.inkMid, border:`1px solid ${T.rimHi}` },
  };
  return <button onClick={onClick} style={{...base,...styles[variant]}}>{children}</button>;
}

// ── SCREENS ───────────────────────────────────────────────────────────────────


// ── APP LOGO ──────────────────────────────────────────────────────────────────
function AppLogo({ size = 32 }) {
  return (
    <img
      src="https://wfgcffmgzqvxmtybdvse.supabase.co/storage/v1/object/public/assets/WhatsApp%20Image%202026-04-05%20at%2021.37.22.jpeg"
      alt="ShipLog"
      style={{ width:size, height:size, borderRadius:size*0.22,
        objectFit:"cover", flexShrink:0 }}
    />
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
      background: sc+"12", border:`1px solid ${sc}35`,
      borderRadius:10, padding:"12px 16px", marginBottom:16,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      cursor:"pointer" }}>
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

  useEffect(()=>{
    async function checkCombustible() {
      try {
        const bits = await db("bitacora","GET",null,"?order=fecha.desc&limit=1&select=combustible_cargado");
        if (bits.length && bits[0].combustible_cargado !== null) {
          const pct = parseFloat(bits[0].combustible_cargado);
          if (pct < 40) setCombustibleAlert(pct);
        }
      } catch(e){}
    }
    checkCombustible();
  },[]);

  const alerts = [
    combustibleAlert !== null ? { msg:`Combustible bajo · ${combustibleAlert}%`, sub:"Repostar antes de la próxima salida", c:T.danger, to:"bitacora" } : null,
    { msg:"Seguro de responsabilidad civil",       sub:"Verificar vigencia y añadir datos",    c:T.warn, to:"documentos" },
    { msg:"ITV · Cert. Navegabilidad 04/12/2025", sub:"Verificar próxima fecha de revisión",  c:T.info, to:"documentos" },
    { msg:"Historial de mantenimiento vacío",     sub:"Añadir fechas de últimas revisiones",  c:T.info, to:"mantenimiento" },
    { msg:"Aceite motores · revisar a 800h",      sub:"Actual 774h · intervalo 250h MAN",     c:T.info, to:"mantenimiento" },
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
          <Card key={i} pad="13px 15px">
            <div style={{ fontSize:9, color:T.inkDim, letterSpacing:1.5,
              textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginBottom:5 }}>{k.l}</div>
            <div style={{ fontSize:22, fontWeight:600, color:k.a,
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
              <div style={{ width:2.5, height:34, borderRadius:2, background:a.c, flexShrink:0 }}/>
              <div style={{flex:1}}>
                <div style={{ color:T.ink, fontSize:12.5, fontWeight:500 }}>{a.msg}</div>
                <div style={{ color:T.inkDim, fontSize:10, marginTop:2,
                  fontFamily:"'DM Mono',monospace" }}>{a.sub}</div>
              </div>
              {a.to && <span style={{color:T.inkDim,fontSize:16}}>›</span>}
            </div>
          </div>
        ))}
      </Card>

      <Card style={{ marginBottom:14 }}>
        <div style={{ fontSize:9.5, color:T.inkDim, letterSpacing:2, textTransform:"uppercase",
          fontFamily:"'DM Mono',monospace", marginBottom:10 }}>Última entrada · Bitácora</div>
        {ultimaBitacora ? (
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ color:T.ink, fontWeight:600, fontSize:17,
                fontFamily:"'Cormorant Garamond',serif" }}>{ultimaBitacora.salida} → {ultimaBitacora.llegada}</div>
              <div style={{ color:T.inkDim, fontSize:10, marginTop:3,
                fontFamily:"'DM Mono',monospace" }}>{ultimaBitacora.fecha} · {ultimaBitacora.patron} · {ultimaBitacora.millas} mn</div>
            </div>
            <Signal estado={ultimaBitacora.incidencias==="Sin novedad"?"ok":"warn"}/>
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
      <Hdr eyebrow="Datos técnicos" title="Ficha del Barco"/>
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
  const [filtroPatron, setFiltroPatron] = useState("Todos");
  const [filtroMes, setFiltroMes]       = useState("Todos");
  const [showFiltros, setShowFiltros]   = useState(false);

  const FORM_INIT = {
    fecha: new Date().toISOString().split("T")[0],
    patron: "Guille", salida: "Caleta de Vélez", llegada: "",
    millas: "", horas_motor_inicio: "", horas_motor_fin: "",
    tripulantes: "2", combustible_pct: "100",
    condiciones: "", incidencias: "Sin novedad", notas: "",
  };
  const [form, setForm] = useState(FORM_INIT);
  const upd = f => e => setForm(v=>({...v,[f]:e.target.value}));

  async function cargar() {
    try {
      setLoading(true);
      const data = await db("bitacora","GET",null,"?order=fecha.desc");
      setEntradas(data);
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ cargar(); },[]);

  async function guardar() {
    if (!form.llegada) return;
    setSaving(true);
    try {
      const payload = {
        fecha: form.fecha, patron: form.patron,
        salida: form.salida, llegada: form.llegada,
        millas: parseFloat(form.millas)||0,
        horas_motor_inicio: parseFloat(form.horas_motor_inicio)||null,
        horas_motor_fin: parseFloat(form.horas_motor_fin)||null,
        tripulantes: parseInt(form.tripulantes)||1,
        combustible_cargado: parseFloat(form.combustible_pct)||null,
        condiciones: form.condiciones,
        incidencias: form.incidencias||"Sin novedad",
        notas: form.notas||null,
      };
      if (editId) {
        await db(`bitacora?id=eq.${editId}`,"PATCH",payload);
        setEditId(null);
      } else {
        await db("bitacora","POST",payload);
      }
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
      fecha: e.fecha||"", patron: e.patron||"Guille",
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

  const entradasFiltradas = entradas.filter(e => {
    const okPatron = filtroPatron === "Todos" || e.patron === filtroPatron;
    const okMes    = filtroMes    === "Todos" || e.fecha?.startsWith(filtroMes);
    return okPatron && okMes;
  });

  const sinNovedad = e => !e.incidencias || e.incidencias.trim() === "" || e.incidencias === "Sin novedad";

  return (
    <div>
      <Hdr eyebrow="Registro de navegación" title="Bitácora"
        action={
          <div style={{display:"flex",gap:7}}>
            <button onClick={()=>setShowFiltros(!showFiltros)} style={{
              display:"flex", alignItems:"center", gap:5,
              background:"transparent", border:`1px solid ${T.rimHi}`,
              borderRadius:7, padding:"7px 12px", cursor:"pointer",
              color: showFiltros||filtroPatron!=="Todos"||filtroMes!=="Todos" ? T.brass : T.inkMid,
              fontSize:11, fontFamily:"inherit" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filtrar
            </button>
            <Btn sm onClick={()=>{ setShowForm(!showForm); setEditId(null); setForm(FORM_INIT); }}>
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
                style={{width:"100%",background:T.surfaceUp,border:`1px solid ${T.rimHi}`,
                  borderRadius:7,padding:"9px 12px",color:T.ink,fontSize:14,fontFamily:"inherit",outline:"none"}}>
                {patrones.map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
                fontFamily:"'DM Mono',monospace",marginBottom:5}}>Mes</div>
              <select value={filtroMes} onChange={e=>setFiltroMes(e.target.value)}
                style={{width:"100%",background:T.surfaceUp,border:`1px solid ${T.rimHi}`,
                  borderRadius:7,padding:"9px 12px",color:T.ink,fontSize:14,fontFamily:"inherit",outline:"none"}}>
                {meses.map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          {(filtroPatron!=="Todos"||filtroMes!=="Todos") && (
            <button onClick={()=>{setFiltroPatron("Todos");setFiltroMes("Todos");}}
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
              <FSelect label="Patrón" value={form.patron} onChange={upd("patron")} options={["Guille","Varo"]}/>
              <FInput label="Puerto salida" value={form.salida} onChange={upd("salida")}/>
              <FInput label="Puerto llegada *" value={form.llegada} onChange={upd("llegada")}/>
              <FInput label="Millas navegadas" type="number" value={form.millas} onChange={upd("millas")}/>
              <FInput label="Tripulantes" type="number" value={form.tripulantes} onChange={upd("tripulantes")}/>
            </div>
            <div>
              <FInput label="H. motor inicio" type="number" value={form.horas_motor_inicio} onChange={upd("horas_motor_inicio")}
                placeholder={entradas.length > 0 ? String(entradas[0].horas_motor_fin||"") : "774"}/>
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
                    ⚠ Combustible bajo — repostar antes de salir
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
          {(filtroPatron!=="Todos"||filtroMes!=="Todos") ? " (filtradas)" : ""}
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
                  {e.millas} mn
                  {e.horas_motor_inicio && e.horas_motor_fin
                    ? ` · ${(e.horas_motor_fin - e.horas_motor_inicio).toFixed(1)}h motor` : ""}
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
                ["Condiciones",        e.condiciones||"--"],
                ["Tripulantes",        e.tripulantes||"--"],
                ["Combustible",        e.combustible_cargado ? e.combustible_cargado+"%" : "--"],
                ["H. motor ini / fin", e.horas_motor_inicio
                  ? `${e.horas_motor_inicio}h → ${e.horas_motor_fin||"?"}h` : "--"],
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
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAveriaForm, setShowAveriaForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ tipo:"", fecha_ultima:"", horas_ultima:"", notas:"", coste:"" });
  const [averiaForm, setAveriaForm] = useState({ fecha:new Date().toISOString().split("T")[0], descripcion:"", patron:"Guille", notas:"", coste:"0" });

  async function cargar() {
    try {
      setLoading(true);
      const [t, a] = await Promise.all([
        db("mantenimiento","GET",null,"?order=tipo.asc"),
        db("averias","GET",null,"?order=fecha.desc"),
      ]);
      setTareas(t); setAverias(a);
    } catch(e){} finally { setLoading(false); }
  }
  useEffect(()=>{ cargar(); },[]);

  async function guardarAveria() {
    if (!averiaForm.descripcion) return;
    setSaving(true);
    try {
      await db("averias","POST",{ ...averiaForm, coste:parseFloat(averiaForm.coste)||0, estado:"pendiente" });
      setShowAveriaForm(false); cargar();
    } catch(e){ alert("Error: "+e.message); } finally { setSaving(false); }
  }

  async function actualizarTarea(id, datos) {
    try {
      await db(`mantenimiento?id=eq.${id}`,"PATCH",datos);
      setEditId(null); cargar();
    } catch(e){ alert("Error: "+e.message); }
  }



  return (
    <div>
      <Hdr eyebrow="Estado técnico" title="Mantenimiento"/>
      <div style={{display:"flex",background:T.bg,borderRadius:7,padding:3,gap:3,marginBottom:18,border:`1px solid ${T.rimHi}`}}>
        {[["tareas","Tareas periódicas"],["averias","Averías"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{
            flex:1,padding:"8px",borderRadius:5,border:"none",cursor:"pointer",
            background:tab===id?T.surface:"transparent",
            color:tab===id?T.ink:T.inkDim,fontSize:11.5,fontWeight:tab===id?600:400,
            fontFamily:"inherit",boxShadow:tab===id?"0 1px 3px rgba(0,0,0,0.15)":"none"}}>{lbl}</button>
        ))}
      </div>

      {tab==="tareas" && (
        loading ? <Card><div style={{color:T.inkDim,fontSize:13,textAlign:"center",padding:"20px 0"}}>Cargando...</div></Card>
        : tareas.map(t=>{
          const pct = t.horas_intervalo && t.horas_ultima
            ? Math.min(100,((774-t.horas_ultima)/t.horas_intervalo)*100) : null;
          const bc = t.estado==="danger"?T.danger:t.estado==="warn"?T.warn:T.ok;
          const isEditing = editId === t.id;
          return (
            <Card key={t.id} style={{marginBottom:9}}>
              {isEditing ? (
                <div>
                  <FInput value={form.fecha_ultima} onChange={e=>setForm(f=>({...f,fecha_ultima:e.target.value}))} label="Fecha última revisión" type="date"/>
                  <FInput value={form.horas_ultima} onChange={e=>setForm(f=>({...f,horas_ultima:e.target.value}))} label="Horas motor en revisión" type="number"/>
                  <FInput value={form.coste} onChange={e=>setForm(f=>({...f,coste:e.target.value}))} label="Coste (€)" type="number"/>
                  <FInput value={form.notas} onChange={e=>setForm(f=>({...f,notas:e.target.value}))} label="Notas"/>
                  <div style={{display:"flex",gap:8,marginTop:6}}>
                    <Btn sm onClick={()=>actualizarTarea(t.id,{fecha_ultima:form.fecha_ultima,horas_ultima:parseFloat(form.horas_ultima)||null,coste:parseFloat(form.coste)||0,notas:form.notas,estado:"ok"})}>Guardar</Btn>
                    <Btn sm variant="ghost" onClick={()=>setEditId(null)}>Cancelar</Btn>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:pct!==null?10:0}}>
                    <div style={{flex:1}}>
                      <div style={{color:T.ink,fontWeight:600,fontSize:13.5}}>{t.tipo}</div>
                      <div style={{color:T.inkDim,fontSize:10,marginTop:3,fontFamily:"'DM Mono',monospace"}}>
                        Últ: {t.fecha_ultima||"Pendiente"} · {t.notas||""}
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <Signal estado={t.estado}/>
                      <button onClick={()=>{setEditId(t.id);setForm({fecha_ultima:t.fecha_ultima||"",horas_ultima:t.horas_ultima||"",notas:t.notas||"",coste:t.coste||""});}}
                        style={{background:"none",border:`1px solid ${T.rimHi}`,borderRadius:5,
                          padding:"3px 8px",color:T.inkDim,fontSize:10,cursor:"pointer"}}>✏️</button>
                    </div>
                  </div>
                  {pct!==null&&(
                    <div>
                      <div style={{background:T.bg,borderRadius:2,height:2.5,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${pct}%`,background:bc,borderRadius:2}}/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                        <span style={{color:T.inkDim,fontSize:9.5,fontFamily:"'DM Mono',monospace"}}>{Math.round(pct)}% del intervalo</span>
                        <span style={{color:T.inkDim,fontSize:9.5,fontFamily:"'DM Mono',monospace"}}>{t.horas_intervalo}h intervalo</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })
      )}

      {tab==="averias" && (
        <div>
          <div style={{marginBottom:14}}>
            <Btn onClick={()=>setShowAveriaForm(!showAveriaForm)}>{showAveriaForm?"Cancelar":"+ Registrar avería"}</Btn>
          </div>
          {showAveriaForm && (
            <Card style={{marginBottom:14}} pad="16px">
              <div style={{fontSize:11,color:T.danger,fontWeight:700,marginBottom:12,
                textTransform:"uppercase",letterSpacing:1,fontFamily:"'DM Mono',monospace"}}>Nueva avería</div>
              <FInput value={averiaForm.fecha} onChange={e=>setAveriaForm(f=>({...f,fecha:e.target.value}))} label="Fecha" type="date"/>
              <FInput value={averiaForm.descripcion} onChange={e=>setAveriaForm(f=>({...f,descripcion:e.target.value}))} label="Descripción *"/>
              <FInput value={averiaForm.notas} onChange={e=>setAveriaForm(f=>({...f,notas:e.target.value}))} label="Notas / diagnóstico"/>
              <FInput value={averiaForm.coste} onChange={e=>setAveriaForm(f=>({...f,coste:e.target.value}))} label="Coste (€)" type="number"/>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
                  fontFamily:"'DM Mono',monospace",marginBottom:4}}>Patrón que reporta</div>
                <select value={averiaForm.patron} onChange={e=>setAveriaForm(f=>({...f,patron:e.target.value}))}
                  style={{width:"100%",background:T.surfaceUp,border:`1px solid ${T.rimHi}`,borderRadius:7,
                    padding:"9px 12px",color:T.ink,fontSize:14,fontFamily:"inherit",outline:"none"}}>
                  <option>Guille</option><option>Varo</option>
                </select>
              </div>
              <Btn onClick={guardarAveria}>{saving?"Guardando...":"Registrar avería"}</Btn>
            </Card>
          )}
          {loading ? <Card><div style={{color:T.inkDim,fontSize:13,textAlign:"center",padding:"20px 0"}}>Cargando...</div></Card>
          : averias.length===0 ? <Card><div style={{color:T.inkDim,fontSize:13,fontStyle:"italic",textAlign:"center",padding:"12px 0"}}>Sin averías registradas.</div></Card>
          : averias.map(a=>(
            <Card key={a.id} style={{marginBottom:9}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1,paddingRight:12}}>
                  <div style={{color:T.ink,fontWeight:600,fontSize:13.5}}>{a.descripcion}</div>
                  <div style={{color:T.inkDim,fontSize:10,marginTop:3,fontFamily:"'DM Mono',monospace"}}>{a.fecha} · {a.patron}</div>
                  {a.notas&&<div style={{color:T.inkMid,fontSize:12,marginTop:6}}>{a.notas}</div>}
                  {a.coste>0&&<div style={{color:T.brassLt,fontSize:13,fontWeight:600,marginTop:6,fontFamily:"'DM Mono',monospace"}}>{a.coste}€</div>}
                </div>
                <Signal estado={a.estado||"warn"}/>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
function Combustible() {
  const [repostajes, setRepostajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split("T")[0],
    litros:"", precio_litro:"", puerto:"Caleta de Vélez",
    patron:"Guille", horas_motor:"",
  });

  async function cargar() {
    try { setLoading(true); const data = await db("combustible","GET",null,"?order=fecha.desc"); setRepostajes(data); }
    catch(e){} finally { setLoading(false); }
  }
  useEffect(()=>{ cargar(); },[]);

  async function guardar() {
    if (!form.litros) return;
    setSaving(true);
    try {
      const litros = parseFloat(form.litros);
      const precio = parseFloat(form.precio_litro)||0;
      await db("combustible","POST",{ fecha:form.fecha, litros, precio_litro:precio,
        importe:parseFloat((litros*precio).toFixed(2)), puerto:form.puerto,
        patron:form.patron, horas_motor:parseFloat(form.horas_motor)||null });
      setShowForm(false); cargar();
    } catch(e){ alert("Error: "+e.message); } finally { setSaving(false); }
  }

  const totalL = repostajes.reduce((a,c)=>a+(c.litros||0),0);
  const totalE = repostajes.reduce((a,c)=>a+(c.importe||0),0);



  return (
    <div>
      <Hdr eyebrow="Repostajes y consumo" title="Combustible"
        action={<Btn sm onClick={()=>setShowForm(!showForm)}>{showForm?"Cancelar":"+ Repostaje"}</Btn>}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:16}}>
        <Card pad="13px 15px">
          <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
            fontFamily:"'DM Mono',monospace",marginBottom:5}}>Total litros</div>
          <div style={{fontSize:24,color:T.ink,fontWeight:600,fontFamily:"'Cormorant Garamond',serif"}}>{totalL.toFixed(0)} L</div>
        </Card>
        <Card pad="13px 15px">
          <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
            fontFamily:"'DM Mono',monospace",marginBottom:5}}>Gasto total</div>
          <div style={{fontSize:24,color:T.brassLt,fontWeight:600,fontFamily:"'Cormorant Garamond',serif"}}>{totalE.toFixed(0)} €</div>
        </Card>
      </div>
      {showForm && (
        <Card style={{marginBottom:14}} pad="16px">
          <div style={{fontSize:11,color:T.brass,fontWeight:700,marginBottom:12,
            textTransform:"uppercase",letterSpacing:1,fontFamily:"'DM Mono',monospace"}}>Nuevo repostaje</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div><FInput label="Fecha" type="date" value={form["fecha"]} onChange={upd("fecha")}/><FInput label="Litros *" type="number" value={form["litros"]} onChange={upd("litros")}/><FInput label="€ / Litro" type="number" value={form["precio_litro"]} onChange={upd("precio_litro")}/></div>
            <div>
              <FInput label="Puerto" value={form["puerto"]} onChange={upd("puerto")}/><FInput label="Horas motor" type="number" value={form["horas_motor"]} onChange={upd("horas_motor")}/>
              <div style={{marginBottom:9}}>
                <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
                  fontFamily:"'DM Mono',monospace",marginBottom:4}}>Patrón</div>
                <select value={form.patron} onChange={e=>setForm(f=>({...f,patron:e.target.value}))}
                  style={{width:"100%",background:T.surfaceUp,border:`1px solid ${T.rimHi}`,borderRadius:7,
                    padding:"9px 12px",color:T.ink,fontSize:14,fontFamily:"inherit",outline:"none"}}>
                  <option>Guille</option><option>Varo</option>
                </select>
              </div>
            </div>
          </div>
          <Btn onClick={guardar}>{saving?"Guardando...":"Guardar repostaje"}</Btn>
        </Card>
      )}
      {loading ? <Card><div style={{color:T.inkDim,fontSize:13,textAlign:"center",padding:"20px 0"}}>Cargando...</div></Card>
      : repostajes.length===0 ? <Card><div style={{color:T.inkDim,fontSize:13,fontStyle:"italic",textAlign:"center",padding:"12px 0"}}>Sin repostajes. Pulsa "+ Repostaje".</div></Card>
      : repostajes.map(r=>(
        <Card key={r.id} style={{marginBottom:9}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{color:T.ink,fontWeight:600,fontSize:16,fontFamily:"'Cormorant Garamond',serif"}}>{r.puerto||"--"}</div>
              <div style={{color:T.inkDim,fontSize:10,marginTop:3,fontFamily:"'DM Mono',monospace"}}>{r.fecha} · {r.patron} · {r.litros}L · {r.precio_litro}€/L</div>
            </div>
            <div style={{fontSize:18,fontWeight:600,color:T.brassLt,fontFamily:"'Cormorant Garamond',serif"}}>{(r.importe||0).toFixed(2)}€</div>
          </div>
        </Card>
      ))}
    </div>
  );
}
function Seguridad() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function cargar() {
    try {
      setLoading(true);
      const data = await db("seguridad","GET",null,"?order=estado.desc,equipo.asc");
      setItems(data);
    } catch(e){} finally { setLoading(false); }
  }
  useEffect(()=>{ cargar(); },[]);

  const vencidos = items.filter(i=>i.estado==="danger").length;
  const proximos = items.filter(i=>i.estado==="warn").length;

  return (
    <div>
      <Hdr eyebrow="Equipos y emergencias" title="Seguridad"/>
      {(vencidos>0||proximos>0) && (
        <div style={{background:T.danger+"10",border:`1px solid ${T.danger}28`,borderRadius:8,padding:"11px 15px",marginBottom:16}}>
          <div style={{color:T.danger,fontSize:12,fontWeight:600}}>
            {vencidos>0 && `${vencidos} equipo${vencidos>1?"s":""} vencido${vencidos>1?"s":""}. `}
            {proximos>0 && `${proximos} equipo${proximos>1?"s":""} vence pronto.`}
          </div>
        </div>
      )}
      {loading ? <Card><div style={{color:T.inkDim,fontSize:13,textAlign:"center",padding:"20px 0"}}>Cargando...</div></Card>
      : items.map(e=>(
        <Card key={e.id} style={{marginBottom:7}} pad="12px 16px">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{flex:1}}>
              <div style={{color:T.ink,fontWeight:500,fontSize:13}}>{e.equipo}</div>
              <div style={{color:T.inkDim,fontSize:9.5,marginTop:3,fontFamily:"'DM Mono',monospace"}}>
                {e.ubicacion}{e.caducidad?` · Vence ${e.caducidad}`:" · Sin caducidad"}
              </div>
            </div>
            <Signal estado={e.estado||"ok"}/>
          </div>
        </Card>
      ))}

      <div style={{fontSize:9.5,color:T.inkDim,letterSpacing:2,textTransform:"uppercase",
        fontFamily:"'DM Mono',monospace",margin:"22px 0 11px"}}>Contactos de emergencia</div>
      <Card pad="0 18px">
        {[
          ["Salvamento Marítimo","900 202 202",T.danger],
          ["Capitanía Marítima Málaga","+34 952 121 234",T.info],
          ["Puerto Caleta de Vélez","+34 952 551 418",T.info],
          ["Seguro náutico","+34 900 300 400",T.inkMid],
        ].map(([k,v,c],i)=>(
          <div key={k}>{i>0&&<Divider/>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0"}}>
              <span style={{color:T.inkMid,fontSize:12.5}}>{k}</span>
              <span style={{color:c,fontSize:12,fontWeight:600,fontFamily:"'DM Mono',monospace"}}>{v}</span>
            </div>
          </div>
        ))}
      </Card>
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
      <Hdr eyebrow="Historial de escalas" title="Puertos y Amarres"
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
      <Hdr eyebrow="Repuestos a bordo" title="Inventario"
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
      <Hdr eyebrow="Certificados y archivos" title="Documentos"
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
function Patrones() {
  const [patrones, setPatrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nombre:"", rol:"Patrón", tit:"PER", tel:"" });

  // Hardcoded for now -- will come from DB later
  const PATRONES_INIT = [
    { id:1, nombre:"Salvador Álvarez Escobar", rol:"Patrón", tit:"Patrón de Yate", tel:"--", av:"VA", salidas:0, millas:0, hue:T.info },
    { id:2, nombre:"Guillermo J. Hurtado de Mendoza", rol:"Patrón", tit:"PER", tel:"--", av:"GU", salidas:0, millas:0, hue:T.brass },
  ];
  const [extraPatrones, setExtraPatrones] = useState([]);

  const todos = [...PATRONES_INIT, ...extraPatrones];

  async function cargarStats() {
    try {
      setLoading(true);
      const bits = await db("bitacora","GET",null,"?select=patron,millas");
      const statsMap = {};
      bits.forEach(b => {
        const p = b.patron;
        if (!statsMap[p]) statsMap[p] = { salidas:0, millas:0 };
        statsMap[p].salidas++;
        statsMap[p].millas += parseFloat(b.millas)||0;
      });
      setPatrones(statsMap);
    } catch(e){} finally { setLoading(false); }
  }
  useEffect(()=>{ cargarStats(); },[]);

  return (
    <div>
      <Hdr eyebrow="Equipo de navegación" title="Patrones"
        action={<Btn sm onClick={()=>setShowForm(!showForm)}>{showForm?"Cancelar":"+ Añadir"}</Btn>}/>

      {showForm && (
        <Card style={{marginBottom:14}} pad="16px">
          <div style={{fontSize:11,color:T.brass,fontWeight:700,marginBottom:12,
            textTransform:"uppercase",letterSpacing:1,fontFamily:"'DM Mono',monospace"}}>Nuevo patrón</div>
          {["nombre","rol","tit","tel"].map(field=>(
            <div key={field} style={{marginBottom:9}}>
              <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
                fontFamily:"'DM Mono',monospace",marginBottom:4}}>
                {field==="nombre"?"Nombre completo":field==="rol"?"Rol":field==="tit"?"Titulación":"Teléfono"}
              </div>
              <input value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}
                style={{width:"100%",background:T.surfaceUp,border:`1px solid ${T.rimHi}`,borderRadius:7,
                  padding:"9px 12px",color:T.ink,fontSize:14,fontFamily:"inherit",outline:"none"}}/>
            </div>
          ))}
          <Btn onClick={()=>{
            if (!form.nombre) return;
            const initials = form.nombre.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
            setExtraPatrones(p=>[...p,{id:Date.now(),...form,av:initials,salidas:0,millas:0,hue:T.ok}]);
            setShowForm(false);
            setForm({ nombre:"", rol:"Patrón", tit:"PER", tel:"" });
          }}>Añadir patrón</Btn>
        </Card>
      )}

      {todos.map(p=>{
        const firstName = p.nombre.split(" ")[0];
        const stats = patrones[firstName] || patrones[p.nombre] || { salidas:p.salidas||0, millas:p.millas||0 };
        return (
          <Card key={p.id} style={{marginBottom:11}}>
            <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:13}}>
              <div style={{width:44,height:44,borderRadius:9,background:p.hue+"18",
                border:`1px solid ${p.hue}38`,display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:13,fontWeight:700,color:p.hue,
                flexShrink:0,fontFamily:"'DM Mono',monospace"}}>{p.av}</div>
              <div>
                <div style={{color:T.ink,fontWeight:600,fontSize:17,fontFamily:"'Cormorant Garamond',serif"}}>{p.nombre}</div>
                <div style={{color:T.inkDim,fontSize:9.5,marginTop:3,fontFamily:"'DM Mono',monospace"}}>{p.rol} · {p.tit} · {p.tel}</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
              {[["Salidas",stats.salidas],["Millas",stats.millas.toFixed(0)+" mn"]].map(([lbl,val])=>(
                <div key={lbl} style={{background:T.bg,borderRadius:7,padding:"9px 11px"}}>
                  <div style={{fontSize:9,color:T.inkDim,letterSpacing:1.5,textTransform:"uppercase",
                    fontFamily:"'DM Mono',monospace",marginBottom:4}}>{lbl}</div>
                  <div style={{fontSize:20,fontWeight:600,color:p.hue,fontFamily:"'Cormorant Garamond',serif"}}>{val}</div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
// ── ASISTENTE IA ──────────────────────────────────────────────────────────────
const SYS = `Eres el asistente náutico de a bordo del "Leonidas", un Sunseeker Portofino 53 del año 2007. Matrícula: 7ª PM-1-231-25. Base habitual: Puerto de Caleta de Vélez (Málaga). Reformado en electrónica y confort.

DATOS TÉCNICOS:
- Motores: 2× MAN D28 MCR, 588 kW (≈800 CV) cada uno
- Horas motor actuales: 774 h
- Eslora: 16.15 m · Manga: 4.42 m · Calado: 1.25 m
- Zona habilitada: 2ª Categoría (estimado)
- Electrónica reformada: Garmin chartplotter, AIS, piloto automático nuevo, sistema de sonido

NOTAS SOBRE EL SUNSEEKER PORTOFINO 53:
- Barco con planing hull de alta velocidad, diseño de crucero de lujo
- Los motores MAN D2848 requieren mantenimiento riguroso: cambio de aceite cada 250h o anual, filtros de combustible cada 500h, impelentes anualmente
- Sistema de refrigeración por agua de mar -- impelentes críticos
- Doble hélice -- revisar ánodos y bocinas regularmente
- Con 774h los motores están en rodaje medio -- buen momento para revisar correas, manguitos y juntas

PATRONES:
- Salvador Álvarez Escobar "Varo" · Patrón de Yate
- Guillermo José Hurtado de Mendoza Florido "Guille" · PER · propietario registrado (familia)

La app está en fase inicial. Seguro pendiente de añadir.

Responde en español. Sé específico, cita datos reales del barco. Texto plano sin asteriscos.`;

function AsistenteIA() {
  const [msgs, setMsgs] = useState([{
    role:"assistant",
    text:"Soy el asistente de a bordo del Leonidas. Conozco su historial técnico completo. ¿En qué puedo ayudarte?"
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const sugs = ["¿Qué mantenimiento urge más?","¿Qué puede ser el ruido en la caja de cambios?","Dame checklist de salida","¿Cuándo toca cambiar el aceite?"];

  async function send() {
    if (!input.trim()||loading) return;
    const text = input.trim(); setInput("");
    const next = [...msgs,{role:"user",text}];
    setMsgs(next); setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/claude",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:SYS, messages:next.map(m=>({role:m.role,content:m.text})) })
      });
      const d = await res.json();
      const reply = d?.content?.[0]?.text
        || d?.content?.find?.(b=>b.type==="text")?.text
        || (d?.error ? "Error API: "+d.error.message : null)
        || "Sin respuesta.";
      setMsgs(m=>[...m,{role:"assistant",text:reply}]);
    } catch(e) { setMsgs(m=>[...m,{role:"assistant",text:"Error: "+e.message}]); }
    setLoading(false);
  }

  useEffect(()=>{ ref.current?.scrollIntoView({behavior:"smooth"}); },[msgs,loading]);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 148px)" }}>
      <Hdr eyebrow="Asistente de a bordo" title="IA Náutica"/>
      <div style={{ flex:1, overflowY:"auto", marginBottom:11 }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex",
            justifyContent:m.role==="user"?"flex-end":"flex-start",
            marginBottom:11, gap:9 }}>
            {m.role==="assistant"&&(
              <div style={{ width:28, height:28, borderRadius:7, background:T.brassDim,
                border:`1px solid ${T.brass}40`, display:"flex", alignItems:"center",
                justifyContent:"center", color:T.brass, fontSize:13, flexShrink:0, marginTop:2 }}>◈</div>
            )}
            <div style={{ maxWidth:"80%", padding:"11px 15px",
              borderRadius:m.role==="user"?"10px 3px 10px 10px":"3px 10px 10px 10px",
              background:m.role==="user"?T.brass:T.surface,
              border:m.role==="user"?"none":`1px solid ${T.rimHi}`,
              color:m.role==="user"?"#0C0F14":T.inkMid,
              fontSize:13, lineHeight:1.6, whiteSpace:"pre-wrap",
              fontWeight:m.role==="user"?600:400 }}>{m.text}</div>
          </div>
        ))}
        {loading&&(
          <div style={{ display:"flex", gap:9, alignItems:"flex-start", marginBottom:11 }}>
            <div style={{ width:28, height:28, borderRadius:7, background:T.brassDim,
              border:`1px solid ${T.brass}40`, display:"flex", alignItems:"center",
              justifyContent:"center", color:T.brass, fontSize:13, flexShrink:0 }}>◈</div>
            <div style={{ background:T.surface, border:`1px solid ${T.rimHi}`,
              borderRadius:"3px 10px 10px 10px", padding:"13px 17px", display:"flex", gap:5 }}>
              {[0,1,2].map(j=>(
                <div key={j} style={{ width:5, height:5, borderRadius:"50%", background:T.brass,
                  opacity:0.3, animation:"blink 1.2s infinite", animationDelay:`${j*0.2}s` }}/>
              ))}
            </div>
          </div>
        )}
        <div ref={ref}/>
      </div>
      {msgs.length===1&&(
        <div style={{ marginBottom:11 }}>
          <div style={{ fontSize:9.5, color:T.inkDim, letterSpacing:1.5,
            textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginBottom:8 }}>Sugerencias</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {sugs.map((s,i)=>(
              <button key={i} onClick={()=>setInput(s)} style={{
                background:T.surfaceUp, border:`1px solid ${T.rimHi}`,
                borderRadius:20, padding:"6px 13px", color:T.inkMid,
                fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>{s}</button>
            ))}
          </div>
        </div>
      )}
      <div style={{ display:"flex", gap:9 }}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Consulta sobre el barco..."
          style={{ flex:1, background:T.surface, border:`1px solid ${T.rimHi}`,
            borderRadius:9, padding:"12px 15px", color:T.ink, fontSize:13,
            outline:"none", fontFamily:"inherit" }}/>
        <button onClick={send} disabled={loading||!input.trim()} style={{
          width:43, height:43, borderRadius:9, border:"none",
          background:input.trim()?T.brass:T.rimHi,
          color:input.trim()?"#0C0F14":T.inkDim,
          fontSize:18, cursor:input.trim()?"pointer":"default",
          flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
          fontWeight:700 }}>›</button>
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
      <Hdr eyebrow="Condiciones meteorológicas" title="Clima"/>
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
      <Hdr eyebrow="Condiciones meteorológicas" title="Clima"/>
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
      <Hdr eyebrow="Condiciones meteorológicas" title="Clima"/>

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
        {[["ahora","Ahora"],["horas","Próximas 24h"],["dias","3 días"]].map(([id,lbl])=>(
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
      <Hdr eyebrow="Planificación" title="Calculadora"/>

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
  const [tab, setTab] = useState("activo");
  const [fondeos, setFondeos] = useState(FONDEOS_INIT);

  // Garreo state
  const [fondeado, setFondeado]   = useState(false);
  const [anclaPos, setAnclaPos]   = useState(null);
  const [posActual, setPosActual] = useState(null);
  const [radio, setRadio]         = useState(50);
  const [profundidad, setProfundidad] = useState("");
  const [viento, setViento]       = useState("normal");
  const [garreando, setGarreando] = useState(false);
  const [distancia, setDistancia] = useState(null);
  const [watchId, setWatchId]     = useState(null);
  const [gpsError, setGpsError]   = useState(null);
  const [pulseAnim, setPulseAnim] = useState(false);

  // Start anchor watch
  function fondear() {
    if (!navigator.geolocation) { setGpsError("GPS no disponible en este dispositivo"); return; }
    navigator.geolocation.getCurrentPosition(pos => {
      const ancla = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      setAnclaPos(ancla);
      setFondeado(true);
      setGarreando(false);
      setDistancia(0);
      // Start watching position
      const id = navigator.geolocation.watchPosition(cur => {
        const curPos = { lat: cur.coords.latitude, lon: cur.coords.longitude };
        setPosActual(curPos);
        const d = distanciaMetros(ancla.lat, ancla.lon, curPos.lat, curPos.lon);
        setDistancia(Math.round(d));
        const garreo = d > radio;
        setGarreando(garreo);
        if (garreo) setPulseAnim(p => !p); // trigger visual pulse
      }, err => setGpsError("Error GPS: " + err.message), { enableHighAccuracy:true, maximumAge:5000 });
      setWatchId(id);
    }, err => setGpsError("No se pudo obtener posición: " + err.message), { enableHighAccuracy:true });
  }

  function levarAncla() {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    // Save to history
    if (anclaPos) {
      const prof = parseFloat(profundidad) || 0;
      setFondeos(prev => [{
        id: Date.now(), nombre:"Fondeo " + new Date().toLocaleDateString("es-ES"),
        lat: anclaPos.lat, lon: anclaPos.lon,
        prof, cadena: cadenaSugerida(prof, viento),
        fecha: new Date().toLocaleDateString("es-ES"),
        valoracion: null, notas:"",
      }, ...prev]);
    }
    setFondeado(false); setAnclaPos(null); setPosActual(null);
    setGarreando(false); setDistancia(null); setWatchId(null);
  }

  const prof = parseFloat(profundidad) || 0;
  const cadenaRec = prof > 0 ? cadenaSugerida(prof, viento) : null;
  const pct = distancia !== null ? Math.min(100, (distancia / radio) * 100) : 0;
  const barCol = pct > 90 ? T.danger : pct > 70 ? T.warn : T.ok;

  return (
    <div>
      <Hdr eyebrow="Fondeo y garreo" title="Fondeo"/>

      {/* Tabs */}
      <div style={{ display:"flex", background:T.bg, borderRadius:7, padding:3,
        gap:3, marginBottom:18, border:`1px solid ${T.rimHi}` }}>
        {[["activo","⚓ Activo"],["historico","Histórico"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{
            flex:1, padding:"9px", borderRadius:5, border:"none", cursor:"pointer",
            background:tab===id?T.surface:"transparent",
            color:tab===id?T.ink:T.inkDim, fontSize:12, fontWeight:tab===id?600:400,
            fontFamily:"inherit", boxShadow:tab===id?"0 1px 3px rgba(0,0,0,0.4)":"none" }}>
            {lbl}
          </button>
        ))}
      </div>

      {tab === "activo" && (
        <div>
          {/* Garreo alarm banner */}
          {garreando && (
            <div style={{ background:T.danger+"22", border:`2px solid ${T.danger}`,
              borderRadius:12, padding:"16px 18px", marginBottom:16,
              animation:"garreo-pulse 0.8s infinite alternate" }}>
              <div style={{ color:T.danger, fontSize:18, fontWeight:700,
                fontFamily:"'Cormorant Garamond',serif" }}>⚠ ALARMA DE GARREO</div>
              <div style={{ color:T.danger, fontSize:13, marginTop:4,
                fontFamily:"'DM Mono',monospace" }}>
                Desplazamiento: {distancia}m · Radio: {radio}m
              </div>
            </div>
          )}

          {/* Status circle */}
          {fondeado && (
            <Card style={{ marginBottom:16, textAlign:"center" }} pad="24px 20px">
              <div style={{ position:"relative", width:140, height:140, margin:"0 auto 16px" }}>
                {/* Outer ring */}
                <svg width="140" height="140" style={{ position:"absolute", top:0, left:0 }}>
                  <circle cx="70" cy="70" r="60" fill="none" stroke={T.rim} strokeWidth="6"/>
                  <circle cx="70" cy="70" r="60" fill="none"
                    stroke={barCol} strokeWidth="6"
                    strokeDasharray={`${2*Math.PI*60}`}
                    strokeDashoffset={`${2*Math.PI*60*(1-pct/100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                    style={{ transition:"stroke-dashoffset 0.5s, stroke 0.3s" }}/>
                </svg>
                {/* Center */}
                <div style={{ position:"absolute", top:"50%", left:"50%",
                  transform:"translate(-50%,-50%)", textAlign:"center" }}>
                  <div style={{ fontSize:28, fontWeight:700, color:barCol,
                    fontFamily:"'Cormorant Garamond',serif", lineHeight:1 }}>
                    {distancia ?? 0}m
                  </div>
                  <div style={{ fontSize:9.5, color:T.inkDim,
                    fontFamily:"'DM Mono',monospace", marginTop:3 }}>de {radio}m</div>
                </div>
              </div>
              <div style={{ color:garreando?T.danger:T.ok, fontSize:13, fontWeight:600 }}>
                {garreando ? "Garreando -- ¡comprueba el ancla!" : "Ancla firme"}
              </div>
              {anclaPos && (
                <div style={{ color:T.inkDim, fontSize:10, marginTop:6,
                  fontFamily:"'DM Mono',monospace" }}>
                  {anclaPos.lat.toFixed(5)}° N · {Math.abs(anclaPos.lon).toFixed(5)}° W
                </div>
              )}
            </Card>
          )}

          {/* Setup card */}
          <Card style={{ marginBottom:14 }} pad="0 18px">
            <div style={{ padding:"12px 0" }}>
              <div style={{ fontSize:9.5, color:T.inkDim, letterSpacing:1.5,
                textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginBottom:8 }}>
                Radio de seguridad (metros)
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {[30,50,75,100,150].map(v=>(
                  <button key={v} onClick={()=>setRadio(v)} style={{
                    flex:1, padding:"8px 0", borderRadius:6, border:"none",
                    background:radio===v?T.brass:T.surfaceUp,
                    color:radio===v?"#0C0F14":T.inkMid,
                    fontSize:11, fontWeight:radio===v?700:400,
                    cursor:"pointer", fontFamily:"'DM Mono',monospace" }}>{v}</button>
                ))}
              </div>
            </div>
            <Divider/>
            <div style={{ padding:"12px 0" }}>
              <div style={{ fontSize:9.5, color:T.inkDim, letterSpacing:1.5,
                textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginBottom:8 }}>
                Profundidad del agua (metros)
              </div>
              <input type="number" value={profundidad} onChange={e=>setProfundidad(e.target.value)}
                placeholder="ej. 8" disabled={fondeado}
                style={{ background:T.surfaceUp, border:`1px solid ${T.rimHi}`, borderRadius:7,
                  padding:"10px 14px", color:T.ink, fontSize:16,
                  fontFamily:"'Cormorant Garamond',serif", outline:"none", width:"100%",
                  fontWeight:600, opacity:fondeado?0.5:1 }}/>
            </div>
            {cadenaRec && (
              <>
                <Divider/>
                <div style={{ padding:"12px 0" }}>
                  <div style={{ fontSize:9.5, color:T.inkDim, letterSpacing:1.5,
                    textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginBottom:8 }}>
                    Viento actual
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    {[["normal","Normal (<15kn)"],["fuerte","Fuerte (>15kn)"]].map(([v,l])=>(
                      <button key={v} onClick={()=>setViento(v)} disabled={fondeado} style={{
                        flex:1, padding:"9px", borderRadius:6, border:"none",
                        background:viento===v?T.brass:T.surfaceUp,
                        color:viento===v?"#0C0F14":T.inkMid,
                        fontSize:11, fontWeight:viento===v?700:400,
                        cursor:"pointer", fontFamily:"inherit", opacity:fondeado?0.5:1 }}>{l}</button>
                    ))}
                  </div>
                  <div style={{ marginTop:12, background:T.brassDim, border:`1px solid ${T.brass}35`,
                    borderRadius:8, padding:"10px 14px", display:"flex",
                    justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ color:T.inkMid, fontSize:12 }}>Cadena recomendada</span>
                    <span style={{ color:T.brassLt, fontSize:20, fontWeight:700,
                      fontFamily:"'Cormorant Garamond',serif" }}>{cadenaRec} m</span>
                  </div>
                  <div style={{ color:T.inkDim, fontSize:10, marginTop:6,
                    fontFamily:"'DM Mono',monospace" }}>
                    Ratio {viento==="fuerte"?"7":"5"}:1 · Prof. {prof}m × {viento==="fuerte"?7:5}
                  </div>
                </div>
              </>
            )}
          </Card>

          {gpsError && (
            <div style={{ background:T.danger+"15", border:`1px solid ${T.danger}30`,
              borderRadius:8, padding:"10px 14px", marginBottom:14 }}>
              <div style={{ color:T.danger, fontSize:12 }}>{gpsError}</div>
            </div>
          )}

          {!fondeado ? (
            <Btn onClick={fondear}>⚓ Fondear aquí</Btn>
          ) : (
            <button onClick={levarAncla} style={{
              width:"100%", background:"transparent", border:`2px solid ${T.danger}`,
              borderRadius:8, padding:"12px", color:T.danger,
              fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
              letterSpacing:0.5 }}>
              Levar ancla y guardar fondeo
            </button>
          )}
        </div>
      )}

      {tab === "historico" && (
        <div>
          {fondeos.map((f,i)=>(
            <Card key={f.id} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"flex-start", marginBottom:8 }}>
                <div>
                  <div style={{ color:T.ink, fontWeight:600, fontSize:16,
                    fontFamily:"'Cormorant Garamond',serif" }}>{f.nombre}</div>
                  <div style={{ color:T.inkDim, fontSize:10, marginTop:3,
                    fontFamily:"'DM Mono',monospace" }}>{f.fecha}</div>
                </div>
                {f.valoracion && (
                  <div style={{ color:T.brassLt, fontSize:13,
                    fontFamily:"'DM Mono',monospace" }}>
                    {"★".repeat(f.valoracion)}{"☆".repeat(5-f.valoracion)}
                  </div>
                )}
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:f.notas?8:0 }}>
                {[
                  f.prof ? `Prof. ${f.prof}m` : null,
                  f.cadena ? `Cadena ${f.cadena}m` : null,
                  `${f.lat.toFixed(4)}° N`,
                  `${Math.abs(f.lon).toFixed(4)}° W`,
                ].filter(Boolean).map((tag,j)=>(
                  <span key={j} style={{ background:T.surfaceUp, border:`1px solid ${T.rimHi}`,
                    borderRadius:4, padding:"2px 8px", color:T.inkMid,
                    fontSize:10, fontFamily:"'DM Mono',monospace" }}>{tag}</span>
                ))}
              </div>
              {f.notas && <div style={{ color:T.inkDim, fontSize:12 }}>{f.notas}</div>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── SHELL ─────────────────────────────────────────────────────────────────────
const MENU = [
  { section:"Navegación", items:[
    { id:"dashboard",    label:"Panel general",   svg:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id:"clima",        label:"Clima",           svg:"M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
    { id:"calculadora",  label:"Calculadora",     svg:"M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
    { id:"fondeo",       label:"Fondeo",          svg:"M3 12h18M12 3v9m0 0L8 8m4 4l4-4M5 20h14" },
  ]},
  { section:"Barco", items:[
    { id:"bitacora",     label:"Bitácora",        svg:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { id:"puertos",      label:"Puertos",         svg:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
    { id:"patrones",     label:"Patrones",        svg:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { id:"ficha",        label:"Ficha técnica",   svg:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  ]},
  { section:"Gestión", items:[
    { id:"mantenimiento",label:"Mantenimiento",   svg:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { id:"combustible",  label:"Combustible",     svg:"M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" },
    { id:"inventario",   label:"Inventario",      svg:"M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { id:"seguridad",    label:"Seguridad",       svg:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { id:"documentos",   label:"Documentos",      svg:"M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
  ]},
  { section:"IA", items:[
    { id:"ia",           label:"Asistente IA",    svg:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  ]},
];

const SCREENS = {
  dashboard:Dashboard, ficha:Ficha, bitacora:Bitacora,
  mantenimiento:Mantenimiento, combustible:Combustible,
  seguridad:Seguridad, puertos:Puertos, inventario:Inventario,
  documentos:Documentos, patrones:Patrones, ia:AsistenteIA,
  clima:Clima, calculadora:Calculadora, fondeo:Fondeo
};

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(false);
  const Screen = SCREENS[screen] || Dashboard;

  function navTo(id) { setScreen(id); setSideOpen(false); }

  const currentLabel = MENU.flatMap(s=>s.items).find(i=>i.id===screen)?.label || "Panel";

  return (
    <div style={{ height:"100dvh", background:T.bg, color:T.ink,
      fontFamily:"'Crimson Pro',Georgia,serif",
      display:"flex", flexDirection:"row", overflow:"hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Crimson+Pro:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:0}
        input::placeholder{color:#9A9488}
        @keyframes blink{0%,100%{opacity:.2}50%{opacity:1}}
        @keyframes garreo-pulse{from{box-shadow:0 0 0 0 rgba(168,52,40,0.5)}to{box-shadow:0 0 0 14px rgba(168,52,40,0)}}
        @keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        button{font-family:inherit}
        input[type=time]::-webkit-calendar-picker-indicator{filter:invert(0) opacity(0.4)}
        select{font-family:inherit}
        textarea{font-family:inherit}

        /* ── RESPONSIVE BREAKPOINTS ── */
        .app-sidebar-desktop { display:none; }
        .app-content { flex:1; display:flex; flex-direction:column; min-width:0; max-width:600px; margin:0 auto; width:100%; }
        .app-header-hamburger { display:flex; }
        .app-header-title { display:flex; }

        @media (min-width: 768px) {
          .app-sidebar-desktop { display:flex !important; }
          .app-header-hamburger { display:none !important; }
          .app-content { max-width:none; margin:0; }
        }

        @media (min-width: 1024px) {
          .app-content-inner { padding:24px 32px 40px !important; max-width:800px; margin:0 auto; width:100%; }
        }
      `}</style>

      {/* ── SIDEBAR OVERLAY (móvil) ── */}
      {sideOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex" }}>
          <div onClick={()=>setSideOpen(false)} style={{ position:"absolute", inset:0,
            background:"rgba(0,0,0,0.65)", animation:"fadeIn 0.2s ease" }}/>
          <div style={{ position:"relative", width:272, height:"100%", background:T.surface,
            borderRight:`1px solid ${T.rimHi}`, overflowY:"auto",
            animation:"slideIn 0.25s ease", zIndex:1, display:"flex", flexDirection:"column",
            boxShadow:"4px 0 24px rgba(0,0,0,0.3)" }}>
            <SidebarContent navTo={navTo} screen={screen} onClose={()=>setSideOpen(false)} showClose={true}/>
          </div>
        </div>
      )}

      {/* ── SIDEBAR FIJO (tablet/desktop) ── */}
      <div className="app-sidebar-desktop" style={{ width:240, height:"100dvh", background:T.surface,
        borderRight:`1px solid ${T.line}`, flexDirection:"column", flexShrink:0, overflowY:"auto" }}>
        <SidebarContent navTo={navTo} screen={screen} onClose={()=>{}} showClose={false}/>
      </div>

      {/* ── MAIN AREA ── */}
      <div className="app-content" style={{ background:T.bg }}>

        {/* HEADER */}
        <div style={{ position:"sticky", top:0, zIndex:100, background:T.bg,
          borderBottom:`1px solid ${T.line}`, padding:"13px 18px",
          display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <button className="app-header-hamburger" onClick={()=>setSideOpen(true)}
            style={{ background:"none", border:"none", cursor:"pointer",
              flexDirection:"column", gap:4.5, padding:"4px 2px", borderRadius:4 }}>
            {[0,1,2].map(i=>(
              <div key={i} style={{ width:20, height:1.5, background:T.inkMid, borderRadius:1 }}/>
            ))}
          </button>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16,
              fontWeight:600, color:T.ink, lineHeight:1 }}>{currentLabel}</div>
            <div style={{ fontSize:8.5, color:T.inkDim, letterSpacing:2,
              textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginTop:2 }}>Leonidas</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:T.ok,
              boxShadow:`0 0 7px ${T.ok}` }}/>
            <span style={{ fontSize:9.5, color:T.inkDim, fontFamily:"'DM Mono',monospace" }}>Porto</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="app-content-inner" style={{ flex:1, overflowY:"auto", overflowX:"hidden",
          padding:"18px 16px 40px", WebkitOverflowScrolling:"touch", minHeight:0 }}>
          <Screen setScreen={navTo}/>
        </div>

      </div>
    </div>
  );
}

// ── SIDEBAR CONTENT (shared between overlay and fixed) ────────────────────────
function SidebarContent({ navTo, screen, onClose, showClose }) {
  return (
    <>
      {/* Header */}
      <div style={{ padding:"16px 18px 14px", borderBottom:`1px solid ${T.line}`,
        display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <AppLogo size={28}/>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16,
              fontWeight:600, color:T.ink, lineHeight:1 }}>ShipLog</div>
            <div style={{ fontSize:8, color:T.inkDim, letterSpacing:2.5,
              textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginTop:2 }}>Leonidas</div>
          </div>
        </div>
        {showClose && (
          <button onClick={onClose} style={{ background:"none", border:"none",
            cursor:"pointer", color:T.inkDim, fontSize:18, lineHeight:1, padding:"2px 4px" }}>✕</button>
        )}
      </div>

      {/* Menu */}
      <div style={{ flex:1, padding:"6px 0 12px", overflowY:"auto" }}>
        {MENU.map(section=>(
          <div key={section.section} style={{ marginBottom:2 }}>
            <div style={{ fontSize:7.5, color:T.inkDim+"99", letterSpacing:2.5,
              textTransform:"uppercase", fontFamily:"'DM Mono',monospace",
              padding:"10px 18px 4px" }}>{section.section}</div>
            {section.items.map(item=>{
              const active = screen === item.id;
              return (
                <button key={item.id} onClick={()=>navTo(item.id)} style={{
                  width:"100%", display:"flex", alignItems:"center", gap:10,
                  padding:"9px 18px", border:"none", cursor:"pointer", textAlign:"left",
                  background: active ? T.brass+"15" : "transparent",
                  borderLeft: active ? `2px solid ${T.brass}` : "2px solid transparent",
                  borderRight:"none", borderTop:"none", borderBottom:"none" }}>
                  <Icon d={item.svg} color={active?T.brass:T.inkDim} size={14} sw={active?2:1.5}/>
                  <span style={{ color:active?T.brassLt:T.inkMid, fontSize:13,
                    fontWeight:active?600:400, letterSpacing:0.1 }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding:"14px 18px", borderTop:`1px solid ${T.line}`, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:T.ok,
            boxShadow:`0 0 6px ${T.ok}` }}/>
          <span style={{ color:T.inkDim, fontSize:10,
            fontFamily:"'DM Mono',monospace" }}>En puerto · Caleta de Vélez</span>
        </div>
      </div>
    </>
  );
}
