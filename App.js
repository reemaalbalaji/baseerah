import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { supabase } from "./supabase";

const COLAB_URL = "https://reema6676-baseerah-api.hf.space";
const LOGO_URL = "https://i.imgur.com/Yu5kyn2.png";

const CITY_IMAGES = {
  riyadh: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=1200&q=90",
  jeddah: "https://i.imgur.com/YQj7CZm.png",
  alula:  "https://iresizer.devops.arabiaweather.com/resize?url=https://adminassets.devops.arabiaweather.com/sites/default/files/field/image/133-213007-city-ola-tourism-ksa-8.jpeg&size=850x530&force_webp=1",
  abha:   "https://i.imgur.com/5YVXV0D.png",
};

const G = {
  green:  "#7c3aed",
  greenD: "#4c1d95",
  greenL: "#ede9fe",
  greenM: "#c4b5fd",
  greenS: "#f5f3ff",
  white:  "#ffffff",
  offW:   "#faf9ff",
  text:   "#4c1d95",
  sub:    "#5b21b6",
  border: "#ddd6fe",
  pos:    "#16a34a",
  neg:    "#dc2626",
  neu:    "#6b7280",
  posL:   "#dcfce7",
  negL:   "#fee2e2",
  neuL:   "#f3f4f6",
};

const SENT = {
  positive:{ ar:"إيجابي", en:"Positive", emoji:"😊", color:G.pos, light:G.posL },
  negative:{ ar:"سلبي",   en:"Negative", emoji:"😞", color:G.neg, light:G.negL },
  neutral: { ar:"محايد",  en:"Neutral",  emoji:"😐", color:G.neu, light:G.neuL },
};

const DEFAULT_CITIES = [
  { id:"riyadh", ar:"الرياض", en:"Riyadh", img:CITY_IMAGES.riyadh },
  { id:"jeddah", ar:"جدة",    en:"Jeddah", img:CITY_IMAGES.jeddah },
  { id:"alula",  ar:"العُلا", en:"AlUla",  img:CITY_IMAGES.alula  },
  { id:"abha",   ar:"أبها",   en:"Abha",   img:CITY_IMAGES.abha   },
];

const DEFAULT_PLACES = {
  riyadh:[
    {id:"p1",ar:"الدرعية",       en:"Diriyah",         plusCode:"8G3P+QR",comments:[]},
    {id:"p2",ar:"برج المملكة",   en:"Kingdom Tower",   plusCode:"7F2M+VW",comments:[]},
    {id:"p3",ar:"المتحف الوطني", en:"National Museum", plusCode:"6H4J+XC",comments:[]},
  ],
  jeddah:[
    {id:"p4",ar:"البلد التاريخي",en:"Al-Balad",        plusCode:"9R2P+QG",comments:[]},
    {id:"p5",ar:"كورنيش جدة",   en:"Jeddah Corniche", plusCode:"8M5V+WF",comments:[]},
  ],
  alula:[
    {id:"p6",ar:"الحِجر", en:"Hegra",  plusCode:"4C7X+MQ",comments:[]},
    {id:"p7",ar:"العين",  en:"Al-Ayn", plusCode:"3J9R+PV",comments:[]},
  ],
  abha:[
    {id:"p8",ar:"قرية رجال ألمع",en:"Rijal Almaa",plusCode:"2V6H+CF",comments:[]},
    {id:"p9",ar:"منتزه عسير",   en:"Aseer Park", plusCode:"5W3G+JM",comments:[]},
  ],
};

// ── useMediaQuery hook ──
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function StatusDot({apiOk, lang}){
  const t=(ar,en)=>lang==="ar"?ar:en;
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,
      color:apiOk==="ok"?G.green:apiOk==="demo"?"#d97706":G.neg}}>
      <span style={{width:7,height:7,borderRadius:"50%",display:"inline-block",
        background:apiOk==="ok"?G.green:apiOk==="demo"?"#d97706":G.neg,
        boxShadow:"0 0 6px currentColor"}}/>
      {apiOk==="ok"?t("النموذج متصل","Model Connected"):
       apiOk==="demo"?t("وضع تجريبي","Demo Mode"):t("غير متصل","Offline")}
    </span>
  );
}

function Header({onBack, title, lang, setLang, apiOk}){
  const isMobile = useIsMobile();
  return(
    <div style={{background:G.white,borderBottom:`2px solid ${G.border}`,
      padding:isMobile?"0 16px":"0 36px",height:60,display:"flex",alignItems:"center",
      justifyContent:"space-between",position:"sticky",top:0,zIndex:100,
      boxShadow:"0 2px 16px rgba(124,58,237,0.08)"}}>
      <div style={{display:"flex",alignItems:"center",gap:isMobile?8:14}}>
        {onBack&&(
          <button onClick={onBack} style={{background:G.greenL,border:"none",
            borderRadius:8,width:34,height:34,cursor:"pointer",color:G.green,
            fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",
            fontWeight:800}}>
            {lang==="ar"?"→":"←"}
          </button>
        )}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <img src={LOGO_URL} alt="logo"
            style={{width:36,height:36,borderRadius:8,objectFit:"cover",
              boxShadow:`0 2px 8px ${G.greenM}60`}}/>
          <div>
            <div style={{fontSize:isMobile?13:15,alignItems:"center",fontWeight:800,color:G.text,lineHeight:1.2}}>
          {title&&!isMobile&&<span style={{color:G.sub,fontSize:13,fontWeight:700}}>{title}</span>}
            </div>
            {!isMobile && <StatusDot apiOk={apiOk} lang={lang}/>}
          </div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
       
        <button onClick={()=>setLang(l=>l==="ar"?"en":"ar")} style={{
          background:G.greenL,border:`1px solid ${G.border}`,color:G.green,
          padding:"5px 12px",borderRadius:20,cursor:"pointer",fontSize:11,fontWeight:700}}>
          {lang==="ar"?"EN":"عر"}
        </button>
      </div>
    </div>
  );
}

function StatCards({s, lang}){
  const t=(ar,en)=>lang==="ar"?ar:en;
  const isMobile = useIsMobile();
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:isMobile?8:12,margin:"16px 0"}}>
      {[
        {label:t("الكل","Total"),          val:s.total,col:G.green, bg:G.greenL},
        {label:t("إيجابي 😊","Positive 😊"),val:s.pos,  col:G.pos,  bg:G.posL},
        {label:t("سلبي 😞","Negative 😞"),  val:s.neg,  col:G.neg,  bg:G.negL},
        {label:t("محايد 😐","Neutral 😐"),   val:s.neu,  col:G.neu,  bg:G.neuL},
      ].map((x,i)=>(
        <div key={i} style={{background:x.bg,borderRadius:12,padding:isMobile?"10px 6px":"16px 12px",
          textAlign:"center",border:`1px solid ${x.col}30`}}>
          <div style={{fontSize:isMobile?22:30,fontWeight:900,color:x.col}}>{x.val}</div>
          <div style={{fontSize:isMobile?9:10,color:x.col,fontWeight:700,marginTop:4}}>{x.label}</div>
        </div>
      ))}
    </div>
  );
}

function Modal({open, onClose, children}){
  if(!open)return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,
      background:"rgba(76,29,149,0.25)",backdropFilter:"blur(4px)",
      zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:G.white,borderRadius:20,
        padding:24,width:"100%",maxWidth:440,
        boxShadow:"0 20px 60px rgba(124,58,237,0.15)"}}>
        {children}
      </div>
    </div>
  );
}

function InputField({label, value, onChange, placeholder, note, rows}){
  return(
    <div style={{marginBottom:14}}>
      <label style={{fontSize:12,fontWeight:700,color:G.sub,display:"block",marginBottom:6}}>{label}</label>
      {rows?(
        <textarea value={value} onChange={e=>onChange(e.target.value)}
          placeholder={placeholder} rows={rows}
          style={{width:"100%",padding:"10px 12px",borderRadius:10,
            border:`1.5px solid ${G.border}`,background:G.greenS,color:G.text,
            fontSize:13,resize:"vertical",direction:"auto",boxSizing:"border-box",
            fontFamily:"Tahoma",outline:"none"}}/>
      ):(
        <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          style={{width:"100%",padding:"10px 12px",borderRadius:10,
            border:`1.5px solid ${G.border}`,background:G.greenS,color:G.text,
            fontSize:13,boxSizing:"border-box",fontFamily:"Tahoma",outline:"none"}}/>
      )}
      {note&&<div style={{fontSize:10,color:G.neu,marginTop:4}}>{note}</div>}
    </div>
  );
}

function PrimaryBtn({children, onClick, disabled}){
  return(
    <button onClick={onClick} disabled={disabled} style={{
      width:"100%",padding:"13px",
      background:disabled?G.greenL:`linear-gradient(135deg,${G.green},#a78bfa)`,
      color:disabled?G.sub:G.white,border:"none",borderRadius:12,
      fontWeight:800,fontSize:14,cursor:disabled?"not-allowed":"pointer",
      boxShadow:disabled?"none":"0 4px 14px rgba(124,58,237,0.3)",
      transition:"all 0.2s",fontFamily:"Tahoma"}}>
      {children}
    </button>
  );
}

function CommentInput({onSubmit, loading, lang}){
  const [text, setText] = useState("");
  const t=(ar,en)=>lang==="ar"?ar:en;
  return(
    <div>
      <label style={{fontSize:12,fontWeight:700,color:G.sub,display:"block",marginBottom:6}}>
        {t("التعليق (عربي أو إنجليزي)","Comment (Arabic or English)")}
      </label>
      <textarea value={text} onChange={e=>setText(e.target.value)}
        placeholder={t("مثال: المكان رائع جداً!","e.g. Amazing place!")}
        rows={3}
        style={{width:"100%",padding:"10px 12px",borderRadius:10,
          border:`1.5px solid ${G.border}`,background:G.greenS,color:G.text,
          fontSize:13,resize:"vertical",direction:"auto",boxSizing:"border-box",
          fontFamily:"Tahoma",outline:"none",marginBottom:10}}/>
      <button onClick={()=>{ if(text.trim()){ onSubmit(text); setText(""); } }}
        disabled={loading||!text.trim()}
        style={{width:"100%",padding:"13px",
          background:(loading||!text.trim())?G.greenL:`linear-gradient(135deg,${G.green},#a78bfa)`,
          color:(loading||!text.trim())?G.sub:G.white,
          border:"none",borderRadius:12,fontWeight:800,fontSize:14,
          cursor:(loading||!text.trim())?"not-allowed":"pointer",
          boxShadow:(loading||!text.trim())?"none":"0 4px 14px rgba(124,58,237,0.3)",
          transition:"all 0.2s",fontFamily:"Tahoma"}}>
        {loading?t("⏳ جارٍ التحليل...","⏳ Analyzing..."):t("🔍 تحليل الرأي","🔍 Analyze")}
      </button>
    </div>
  );
}

function detectLang(text){
  return (text.match(/[\u0600-\u06FF]/g)||[]).length>text.length*0.3?"arabic":"english";
}

async function callModel(text){
  if(COLAB_URL==="YOUR_NGROK_URL_HERE"){
    await new Promise(r=>setTimeout(r,900));
    return{sentiment:["positive","negative","neutral"][Math.floor(Math.random()*3)],
           model:detectLang(text)==="arabic"?"MARBERT+SVM (تجريبي)":"RoBERTa (تجريبي)",
           language:detectLang(text)};
  }
  const res=await fetch(`${COLAB_URL}/predict`,{
    method:"POST",
    headers:{"Content-Type":"application/json","ngrok-skip-browser-warning":"true"},
    body:JSON.stringify({text}),
  });
  return await res.json();
}

function HeroSlideshow({cities, lang, onSelectCity}){
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef();
  const isMobile = useIsMobile();

  useEffect(()=>{
    timerRef.current = setInterval(()=>{
      setAnimating(true);
      setTimeout(()=>{ setCurrent(p=>(p+1)%cities.length); setAnimating(false); }, 600);
    }, 4000);
    return ()=>clearInterval(timerRef.current);
  },[cities.length]);

  const city = cities[current];

  return(
    <div style={{position:"relative",height:"100vh",overflow:"hidden",background:"#000"}}>
      <div style={{position:"absolute",inset:0,transition:"opacity 0.8s ease",opacity:animating?0:1}}>
        <img src={city.img} alt={city.ar}
          style={{width:"100%",height:"100%",objectFit:"cover",
            transition:"transform 4s ease",transform:animating?"scale(1.05)":"scale(1)"}}
          onError={e=>e.target.src=CITY_IMAGES.riyadh}/>
        <div style={{position:"absolute",inset:0,
          background:"linear-gradient(to bottom,rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.5) 60%,rgba(0,0,0,0.85) 100%)"}}/>
      </div>

      <div style={{position:"relative",zIndex:2,height:"100%",display:"flex",
        flexDirection:"column",alignItems:"center",justifyContent:"center",
        textAlign:"center",padding:isMobile?"40px 20px":"40px 32px"}}>

        <div style={{marginBottom:isMobile?16:24,animation:"fadeDown 0.8s ease"}}>
          <img src={LOGO_URL} alt="logo"
            style={{width:isMobile?80:100,height:isMobile?80:100,borderRadius:20,objectFit:"cover",
              boxShadow:"0 8px 32px rgba(0,0,0,0.3)",border:"3px solid rgba(255,255,255,0.3)"}}/>
        </div>

        <div style={{marginBottom:8,animation:"fadeUp 0.8s ease 0.2s both"}}>
          <div style={{fontSize:isMobile?11:13,letterSpacing:isMobile?1:2,color:"rgba(255,255,255,0.8)",
            fontWeight:700,textTransform:"uppercase",marginBottom:10}}>
            {lang==="ar"?"المملكة العربية السعودية":"Kingdom of Saudi Arabia"}
          </div>
          <h1 style={{fontSize:isMobile?36:56,fontWeight:900,color:"#ffffff",lineHeight:1.2,margin:0,
  fontFamily:"Georgia, serif",textShadow:"0 4px 20px rgba(0,0,0,0.3)",
  letterSpacing:2}}>
  {lang==="ar"?"بصيرة":"Baseerah"}
</h1>
          <div style={{fontSize:isMobile?14:20,color:"rgba(255,255,255,0.9)",fontWeight:700,marginTop:8,letterSpacing:1}}>
            {lang==="ar"?"تحليل آراء السياح بالذكاء الاصطناعي":"AI-Powered Tourism Sentiment Analysis"}
          </div>
          <div style={{fontSize:isMobile?13:16,color:"rgba(255,255,255,0.7)",marginTop:6,fontStyle:"italic"}}>
            {lang==="ar"?"رأيك يهمنا":"Your Voice Matters"}
          </div>
        </div>

        <div style={{margin:isMobile?"20px 0":"32px 0",transition:"opacity 0.4s",opacity:animating?0:1}}>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginBottom:6,letterSpacing:2}}>
            {lang==="ar"?"جارٍ عرض":"Now Showing"}
          </div>
          <div style={{fontSize:isMobile?28:42,fontWeight:900,color:"#fff",
            textShadow:"0 2px 12px rgba(0,0,0,0.4)"}}>
            {lang==="ar"?city.ar:city.en}
          </div>
        </div>

        <button onClick={()=>onSelectCity(city)}
          style={{background:"#fff",color:G.green,border:"none",
            padding:isMobile?"14px 32px":"16px 40px",borderRadius:50,
            fontSize:isMobile?14:16,fontWeight:800,cursor:"pointer",
            boxShadow:"0 8px 24px rgba(0,0,0,0.2)",transition:"all 0.2s",
            letterSpacing:1,animation:"fadeUp 0.8s ease 0.4s both"}}>
          {lang==="ar"?"🌿 استكشف الآن":"🌿 Explore Now"}
        </button>

        <div style={{display:"flex",gap:10,marginTop:24}}>
          {cities.map((_,i)=>(
            <div key={i} onClick={()=>setCurrent(i)}
              style={{width:i===current?24:8,height:8,borderRadius:4,cursor:"pointer",
                background:i===current?"#fff":"rgba(255,255,255,0.4)",transition:"all 0.3s"}}/>
          ))}
        </div>
      </div>

      <div style={{position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",
        zIndex:2,display:"flex",flexDirection:"column",alignItems:"center",gap:4,
        color:"rgba(255,255,255,0.6)",fontSize:10,letterSpacing:2}}>
        <div style={{animation:"bounce 2s infinite"}}>↓</div>
        {lang==="ar"?"اسحب لأسفل":"SCROLL DOWN"}
      </div>

      <style>{`
        @keyframes fadeDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:none}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
      `}</style>
    </div>
  );
}

export default function App(){
  const [lang,setLang]=useState("ar");
  const [screen,setScreen]=useState("home");
  const [selectedCity,setSelectedCity]=useState(null);
  const [selectedPlace,setSelectedPlace]=useState(null);
  const [cities,setCities]=useState(DEFAULT_CITIES);
  const [places,setPlaces]=useState(DEFAULT_PLACES);
  const [dbReady,setDbReady]=useState(false); // eslint-disable-line no-unused-vars
  const [loading,setLoading]=useState(false);
  const [lastResult,setLastResult]=useState(null);
  const [showAddCity,setShowAddCity]=useState(false);
  const [showAddPlace,setShowAddPlace]=useState(false);
  const [newCity,setNewCity]=useState({ar:"",en:"",img:""});
  const [newPlace,setNewPlace]=useState({ar:"",en:"",plusCode:""});
  const [apiOk,setApiOk]=useState(COLAB_URL==="YOUR_NGROK_URL_HERE"?"demo":"checking");
  const isMobile = useIsMobile();

  useEffect(()=>{
    async function loadData(){
      try{
        const { data: citiesData, error: citiesError } = await supabase.from("cities").select("*");
        if(citiesError) throw citiesError;

        if(citiesData && citiesData.length>0){
          setCities(citiesData);
        } else {
          for(const city of DEFAULT_CITIES){
            await supabase.from("cities").upsert({id:city.id, ar:city.ar, en:city.en, img:city.img});
          }
        }

        const { data: placesData, error: placesError } = await supabase.from("places").select("*");
        if(placesError) throw placesError;

        if(placesData && placesData.length>0){
          const loadedPlaces = {};
          for(const placeRow of placesData){
            const cityId = placeRow.city_id;
            if(!loadedPlaces[cityId]) loadedPlaces[cityId]=[];
            const { data: commentsData } = await supabase
              .from("comments")
              .select("*")
              .eq("place_id", placeRow.id)
              .order("created_at",{ascending:false});
            loadedPlaces[cityId].push({
              id: placeRow.id,
              ar: placeRow.ar,
              en: placeRow.en,
              plusCode: placeRow.plus_code,
              comments: (commentsData||[]).map(c=>({
                id:c.id, text:c.text, sentiment:c.sentiment, model:c.model,
                lang:c.lang, time:c.time, createdAt:c.created_at
              }))
            });
          }
          setPlaces(loadedPlaces);
        } else {
          for(const [cityId,cityPlaces] of Object.entries(DEFAULT_PLACES)){
            for(const place of cityPlaces){
              await supabase.from("places").upsert({
                id:place.id, ar:place.ar, en:place.en,
                plus_code:place.plusCode, city_id:cityId
              });
            }
          }
          setPlaces(DEFAULT_PLACES);
        }
        setDbReady(true);
      } catch(e){ console.error("Supabase error:",e); setDbReady(true); }
    }
    loadData();
  },[]);

  useEffect(()=>{
    if(COLAB_URL==="YOUR_NGROK_URL_HERE")return;
    fetch(`${COLAB_URL}/health`,{headers:{"ngrok-skip-browser-warning":"true"}})
      .then(()=>setApiOk("ok")).catch(()=>setApiOk("error"));
  },[]);

  const t=(ar,en)=>lang==="ar"?ar:en;
  const dir=lang==="ar"?"rtl":"ltr";

  function stats(c=[]){
    return{total:c.length,
      pos:c.filter(x=>x.sentiment==="positive").length,
      neg:c.filter(x=>x.sentiment==="negative").length,
      neu:c.filter(x=>x.sentiment==="neutral").length};
  }

  function cityStats(){
    const all=(places[selectedCity?.id]||[]).flatMap(p=>p.comments);
    const s=stats(all);
    return{...s,byPlace:(places[selectedCity?.id]||[]).map(p=>({
      name:lang==="ar"?p.ar:p.en,
      إيجابي:p.comments.filter(c=>c.sentiment==="positive").length,
      سلبي:p.comments.filter(c=>c.sentiment==="negative").length,
      محايد:p.comments.filter(c=>c.sentiment==="neutral").length,
    })).filter(p=>p["إيجابي"]+p["سلبي"]+p["محايد"]>0)};
  }

  async function addCity(){
    if(!newCity.ar.trim())return;
    const city={id:"c"+Date.now(),ar:newCity.ar,en:newCity.en||newCity.ar,img:newCity.img||CITY_IMAGES.riyadh};
    await supabase.from("cities").insert({id:city.id, ar:city.ar, en:city.en, img:city.img});
    setCities(p=>[...p,city]);
    setPlaces(p=>({...p,[city.id]:[]}));
    setNewCity({ar:"",en:"",img:""});
    setShowAddCity(false);
  }

  async function addPlace(){
    if(!newPlace.ar.trim()||!selectedCity)return;
    const place={id:"p"+Date.now(),ar:newPlace.ar,en:newPlace.en||newPlace.ar,plusCode:newPlace.plusCode||"—",comments:[]};
    await supabase.from("places").insert({
      id:place.id, ar:place.ar, en:place.en,
      plus_code:place.plusCode, city_id:selectedCity.id
    });
    setPlaces(p=>({...p,[selectedCity.id]:[...(p[selectedCity.id]||[]),place]}));
    setNewPlace({ar:"",en:"",plusCode:""});
    setShowAddPlace(false);
  }

  async function submitComment(text){
    if(!text.trim()||loading)return;
    setLoading(true);setLastResult(null);
    try{
      const res=await callModel(text.trim());
      const entry={id:Date.now(),text:text.trim(),sentiment:res.sentiment,model:res.model,
        lang:res.language,time:new Date().toLocaleTimeString("ar-SA"),createdAt:Date.now()};
      await supabase.from("comments").insert({
        place_id:selectedPlace.id, text:entry.text, sentiment:entry.sentiment,
        model:entry.model, lang:entry.lang, time:entry.time, created_at:entry.createdAt
      });
      setPlaces(prev=>({...prev,[selectedCity.id]:prev[selectedCity.id].map(p=>
        p.id===selectedPlace.id?{...p,comments:[entry,...p.comments]}:p)}));
      setSelectedPlace(prev=>({...prev,comments:[entry,...(prev.comments||[])]}));
      setLastResult(entry);
    }catch(e){console.error(e);alert(t("خطأ في الاتصال","Connection error"));}
    setLoading(false);
  }

  const wrap={maxWidth:1100,margin:"0 auto",padding:isMobile?"16px":"28px 36px"};

  // ── الصفحة الرئيسية ──
  if(screen==="home") return(
    <div dir={dir} style={{fontFamily:"Tahoma,sans-serif"}}>
      <div style={{position:"fixed",top:16,left:lang==="ar"?16:"auto",right:lang==="en"?16:"auto",zIndex:100}}>
        <button onClick={()=>setLang(l=>l==="ar"?"en":"ar")} style={{
          background:"rgba(255,255,255,0.2)",backdropFilter:"blur(8px)",
          border:"1px solid rgba(255,255,255,0.4)",color:"#fff",
          padding:"7px 14px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:700}}>
          {lang==="ar"?"EN":"عر"}
        </button>
      </div>

      <HeroSlideshow cities={cities} lang={lang}
        onSelectCity={(city)=>{setSelectedCity(city);setScreen("places");}}/>

      <div style={{background:G.white,padding:isMobile?"32px 16px":"60px 36px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:isMobile?24:40}}>
            <div style={{fontSize:11,letterSpacing:2,color:G.green,fontWeight:700,
              textTransform:"uppercase",marginBottom:8}}>
              {t("وجهاتنا السياحية","Our Destinations")}
            </div>
            <h2 style={{fontSize:isMobile?24:36,fontWeight:900,color:G.text,margin:0}}>
              {t("اختر وجهتك","Choose Your Destination")}
            </h2>
          </div>

          <div style={{display:"grid",
            gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",
            gap:isMobile?12:20,marginBottom:16}}>
            {cities.map(city=>{
              const all=(places[city.id]||[]).flatMap(p=>p.comments);
              const s=stats(all);
              return(
                <div key={city.id} onClick={()=>{setSelectedCity(city);setScreen("places");}}
                  style={{borderRadius:16,overflow:"hidden",cursor:"pointer",
                    border:`2px solid ${G.border}`,transition:"all 0.3s",
                    boxShadow:"0 4px 16px rgba(124,58,237,0.08)"}}>
                  <div style={{height:isMobile?120:180,overflow:"hidden",position:"relative"}}>
                    <img src={city.img} alt={city.ar}
                      style={{width:"100%",height:"100%",objectFit:"cover"}}
                      onError={e=>e.target.src=CITY_IMAGES.riyadh}/>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,
                      background:"linear-gradient(to top,rgba(0,0,0,0.7),transparent)",
                      padding:"16px 12px 8px"}}>
                      <div style={{fontSize:isMobile?14:18,fontWeight:900,color:"#fff"}}>
                        {lang==="ar"?city.ar:city.en}
                      </div>
                    </div>
                  </div>
                  <div style={{background:G.white,padding:"10px 14px"}}>
                    <div style={{fontSize:11,color:G.sub,marginBottom:6}}>
                      {(places[city.id]||[]).length} {t("أماكن","places")} • {all.length} {t("رأي","opinions")}
                    </div>
                    {all.length>0?(
                      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {s.pos>0&&<span style={{fontSize:10,color:G.pos,background:G.posL,padding:"2px 6px",borderRadius:8,fontWeight:700}}>😊 {s.pos}</span>}
                        {s.neg>0&&<span style={{fontSize:10,color:G.neg,background:G.negL,padding:"2px 6px",borderRadius:8,fontWeight:700}}>😞 {s.neg}</span>}
                        {s.neu>0&&<span style={{fontSize:10,color:G.neu,background:G.neuL,padding:"2px 6px",borderRadius:8,fontWeight:700}}>😐 {s.neu}</span>}
                      </div>
                    ):(
                      <div style={{fontSize:11,color:"#d1d5db"}}>{t("لا توجد آراء بعد","No opinions yet")}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={()=>setShowAddCity(true)} style={{
            width:"100%",padding:"14px",background:"none",
            border:`2px dashed ${G.greenM}`,borderRadius:14,
            color:G.green,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"Tahoma"}}>
            ＋ {t("إضافة مدينة جديدة","Add New City")}
          </button>
        </div>
      </div>

      <Modal open={showAddCity} onClose={()=>setShowAddCity(false)}>
        <h3 style={{margin:"0 0 18px",color:G.text,fontSize:16,fontWeight:800}}>
          🏙️ {t("إضافة مدينة جديدة","Add New City")}
        </h3>
        <InputField label={t("اسم المدينة بالعربي *","City Name in Arabic *")}
          value={newCity.ar} onChange={v=>setNewCity(p=>({...p,ar:v}))} placeholder={t("مثال: تبوك","e.g. Tabuk")}/>
        <InputField label={t("اسم المدينة بالإنجليزي","City Name in English")}
          value={newCity.en} onChange={v=>setNewCity(p=>({...p,en:v}))} placeholder="e.g. Tabuk"/>
        <InputField label={t("رابط صورة (اختياري)","Image URL (optional)")}
          value={newCity.img} onChange={v=>setNewCity(p=>({...p,img:v}))} placeholder="https://..."
          note={t("اتركيه فارغاً لصورة افتراضية","Leave empty for default")}/>
        <div style={{display:"flex",gap:10,marginTop:8}}>
          <button onClick={()=>setShowAddCity(false)} style={{flex:1,padding:"11px",
            background:G.greenL,border:"none",borderRadius:10,color:G.sub,cursor:"pointer",fontWeight:700}}>
            {t("إلغاء","Cancel")}
          </button>
          <div style={{flex:2}}><PrimaryBtn onClick={addCity} disabled={!newCity.ar.trim()}>✅ {t("إضافة المدينة","Add City")}</PrimaryBtn></div>
        </div>
      </Modal>
    </div>
  );

  // ── شاشة الأماكن ──
  if(screen==="places"){
    const cityPlaces=places[selectedCity.id]||[];
    return(
      <div dir={dir} style={{minHeight:"100vh",background:G.offW,fontFamily:"Tahoma,sans-serif"}}>
        <Header onBack={()=>setScreen("home")} title={t(selectedCity.ar,selectedCity.en)} lang={lang} setLang={setLang} apiOk={apiOk}/>

        <div style={{height:isMobile?160:220,position:"relative",overflow:"hidden"}}>
          <img src={selectedCity.img||CITY_IMAGES.riyadh} alt={selectedCity.ar}
            style={{width:"100%",height:"100%",objectFit:"cover"}}
            onError={e=>e.target.src=CITY_IMAGES.riyadh}/>
          <div style={{position:"absolute",inset:0,
            background:"linear-gradient(to top,rgba(0,0,0,0.7),rgba(0,0,0,0.1))",
            display:"flex",alignItems:"flex-end",padding:isMobile?"16px":"24px 36px"}}>
            <div>
              <h2 style={{fontSize:isMobile?22:34,fontWeight:900,color:"#fff",margin:0}}>
                {t(selectedCity.ar,selectedCity.en)}
              </h2>
              <p style={{color:G.greenM,fontSize:12,margin:"4px 0 0"}}>
                {cityPlaces.length} {t("أماكن سياحية","tourist attractions")}
              </p>
            </div>
          </div>
        </div>

        <div style={wrap}>
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
            <button onClick={()=>setShowAddPlace(true)} style={{
              padding:"10px 18px",background:G.greenL,border:`1.5px solid ${G.border}`,
              borderRadius:12,color:G.green,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"Tahoma"}}>
              ＋ {t("إضافة مكان","Add Place")}
            </button>
            <button onClick={()=>setScreen("analytics")} style={{
              padding:"10px 18px",background:G.greenS,border:`1.5px solid ${G.greenM}`,
              borderRadius:12,color:G.greenD,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"Tahoma"}}>
              📊 {t("تحليل المدينة","City Analytics")}
            </button>
          </div>

          {cityPlaces.length===0?(
            <div style={{textAlign:"center",padding:60,color:G.sub}}>
              <div style={{fontSize:48}}>🗺️</div>
              <div style={{marginTop:12,fontSize:14}}>{t("لا توجد أماكن","No places yet!")}</div>
            </div>
          ):(
            <div style={{display:"grid",
              gridTemplateColumns:isMobile?"1fr":window.innerWidth<1024?"repeat(2,1fr)":"repeat(3,1fr)",
              gap:isMobile?10:16}}>
              {cityPlaces.map(place=>{
                const s=stats(place.comments);
                return(
                  <div key={place.id}
                    onClick={()=>{setSelectedPlace(place);setLastResult(null);setScreen("place");}}
                    style={{background:G.white,border:`1.5px solid ${G.border}`,
                      borderRadius:14,padding:"16px",cursor:"pointer",transition:"all 0.25s",
                      boxShadow:"0 2px 8px rgba(124,58,237,0.06)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:isMobile?14:16,fontWeight:800,color:G.text,marginBottom:4}}>
                          {lang==="ar"?place.ar:place.en}
                        </div>
                        <div style={{fontSize:10,color:G.sub}}>
                          📍 <code style={{background:G.greenL,padding:"1px 6px",borderRadius:5,color:G.green,fontSize:10}}>{place.plusCode}</code>
                        </div>
                      </div>
                      <div style={{background:G.greenL,borderRadius:10,padding:"6px 10px",textAlign:"center",minWidth:46}}>
                        <div style={{fontSize:20,fontWeight:900,color:G.green}}>{s.total}</div>
                        <div style={{fontSize:9,color:G.sub,fontWeight:700}}>{t("رأي","opinions")}</div>
                      </div>
                    </div>
                    {s.total>0&&(
                      <div style={{display:"flex",gap:4,marginTop:10,flexWrap:"wrap"}}>
                        {s.pos>0&&<span style={{fontSize:10,color:G.pos,background:G.posL,padding:"2px 8px",borderRadius:10,fontWeight:700}}>😊 {s.pos}</span>}
                        {s.neg>0&&<span style={{fontSize:10,color:G.neg,background:G.negL,padding:"2px 8px",borderRadius:10,fontWeight:700}}>😞 {s.neg}</span>}
                        {s.neu>0&&<span style={{fontSize:10,color:G.neu,background:G.neuL,padding:"2px 8px",borderRadius:10,fontWeight:700}}>😐 {s.neu}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Modal open={showAddPlace} onClose={()=>setShowAddPlace(false)}>
          <h3 style={{margin:"0 0 18px",color:G.text,fontSize:16,fontWeight:800}}>📍 {t("إضافة مكان جديد","Add New Place")}</h3>
          <InputField label={t("اسم المكان بالعربي *","Place Name in Arabic *")}
            value={newPlace.ar} onChange={v=>setNewPlace(p=>({...p,ar:v}))} placeholder={t("مثال: حديقة الملك عبدالله","e.g. King Abdullah Park")}/>
          <InputField label={t("اسم المكان بالإنجليزي","Place Name in English")}
            value={newPlace.en} onChange={v=>setNewPlace(p=>({...p,en:v}))} placeholder="e.g. King Abdullah Park"/>
          <InputField label="Plus Code 📍" value={newPlace.plusCode}
            onChange={v=>setNewPlace(p=>({...p,plusCode:v}))} placeholder="e.g. 8G3P+QR"
            note={t("افتحي Google Maps ← اضغطي على المكان ← انسخي Plus Code","Open Google Maps → tap location → copy Plus Code")}/>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <button onClick={()=>setShowAddPlace(false)} style={{flex:1,padding:"11px",background:G.greenL,border:"none",borderRadius:10,color:G.sub,cursor:"pointer",fontWeight:700}}>
              {t("إلغاء","Cancel")}
            </button>
            <div style={{flex:2}}><PrimaryBtn onClick={addPlace} disabled={!newPlace.ar.trim()}>✅ {t("إضافة المكان","Add Place")}</PrimaryBtn></div>
          </div>
        </Modal>
      </div>
    );
  }

  // ── شاشة المكان ──
  if(screen==="place"){
    const cur=places[selectedCity.id]?.find(p=>p.id===selectedPlace.id)||selectedPlace;
    const s=stats(cur.comments);
    const pie=[
      {name:t("إيجابي","Positive"),value:s.pos,color:G.pos},
      {name:t("سلبي","Negative"),value:s.neg,color:G.neg},
      {name:t("محايد","Neutral"),value:s.neu,color:G.neu},
    ].filter(d=>d.value>0);
    return(
      <div dir={dir} style={{minHeight:"100vh",background:G.offW,fontFamily:"Tahoma,sans-serif",color:G.text}}>
        <Header onBack={()=>setScreen("places")} title={lang==="ar"?cur.ar:cur.en} lang={lang} setLang={setLang} apiOk={apiOk}/>
        <div style={wrap}>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:isMobile?16:24,alignItems:"start"}}>
            <div>
              <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:16,padding:isMobile?14:20,marginBottom:16,boxShadow:"0 2px 10px rgba(124,58,237,0.07)"}}>
                <div style={{textAlign:"center",fontSize:11,color:G.sub,marginBottom:10}}>
                  📍 Plus Code: <code style={{background:G.greenL,padding:"2px 8px",borderRadius:6,color:G.green,fontSize:10}}>{cur.plusCode}</code>
                </div>
                <StatCards s={s} lang={lang}/>
              </div>
              <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:16,padding:isMobile?14:20,boxShadow:"0 2px 10px rgba(124,58,237,0.07)"}}>
                <div style={{fontSize:14,fontWeight:800,color:G.text,marginBottom:14}}>✍️ {t("شاركنا رأيك","Share Your Opinion")}</div>
                {lastResult&&(
                  <div style={{background:SENT[lastResult.sentiment].light,border:`1.5px solid ${SENT[lastResult.sentiment].color}50`,borderRadius:12,padding:12,marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:16,fontWeight:800,color:SENT[lastResult.sentiment].color}}>
                        {SENT[lastResult.sentiment].emoji} {t(SENT[lastResult.sentiment].ar,SENT[lastResult.sentiment].en)}
                      </span>
                      <span style={{fontSize:10,color:G.sub,background:G.greenL,padding:"3px 8px",borderRadius:8}}>🤖 {lastResult.model}</span>
                    </div>
                    <p style={{margin:"6px 0 0",fontSize:12,color:G.text}}>"{lastResult.text}"</p>
                  </div>
                )}
                <CommentInput onSubmit={submitComment} loading={loading} lang={lang}/>
              </div>
            </div>

            <div>
              {s.total>0&&(
                <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:16,padding:isMobile?14:20,marginBottom:16,boxShadow:"0 2px 10px rgba(124,58,237,0.07)"}}>
                  <div style={{fontSize:13,fontWeight:700,color:G.sub,marginBottom:10}}>{t("توزيع المشاعر","Sentiment Distribution")}</div>
                  <ResponsiveContainer width="100%" height={isMobile?180:200}>
                    <PieChart>
                      <Pie data={pie} cx="50%" cy="50%" outerRadius={isMobile?65:78} dataKey="value"
                        label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                        {pie.map((e,i)=><Cell key={i} fill={e.color}/>)}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius:10}}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              {cur.comments.length>0&&(
                <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:16,padding:isMobile?14:20,boxShadow:"0 2px 10px rgba(124,58,237,0.07)"}}>
                  <div style={{fontSize:13,fontWeight:700,color:G.sub,marginBottom:10}}>{t("التعليقات","Comments")} ({cur.comments.length})</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:360,overflowY:"auto"}}>
                    {cur.comments.map(c=>(
                      <div key={c.id} style={{background:G.greenS,borderRadius:10,padding:"10px 12px",
                        borderRight:lang==="ar"?`3px solid ${SENT[c.sentiment].color}`:"none",
                        borderLeft:lang==="en"?`3px solid ${SENT[c.sentiment].color}`:"none"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                          <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:700,
                            background:SENT[c.sentiment].light,color:SENT[c.sentiment].color}}>
                            {SENT[c.sentiment].emoji} {t(SENT[c.sentiment].ar,SENT[c.sentiment].en)}
                          </span>
                          <span style={{fontSize:10,color:G.sub}}>{c.time}</span>
                        </div>
                        <p style={{margin:0,fontSize:12,color:G.text}}>{c.text}</p>
                        <p style={{margin:"3px 0 0",fontSize:10,color:G.sub}}>🤖 {c.model}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── شاشة التحليل ──
  if(screen==="analytics"){
    const cs=cityStats();
    const pie=[
      {name:t("إيجابي","Positive"),value:cs.pos,color:G.pos},
      {name:t("سلبي","Negative"),value:cs.neg,color:G.neg},
      {name:t("محايد","Neutral"),value:cs.neu,color:G.neu},
    ].filter(d=>d.value>0);
    return(
      <div dir={dir} style={{minHeight:"100vh",background:G.offW,fontFamily:"Tahoma,sans-serif",color:G.text}}>
        <Header onBack={()=>setScreen("places")}
          title={`📊 ${t("تحليل","Analytics")} — ${t(selectedCity.ar,selectedCity.en)}`}
          lang={lang} setLang={setLang} apiOk={apiOk}/>
        <div style={wrap}>
          <StatCards s={cs} lang={lang}/>
          {cs.total===0?(
            <div style={{textAlign:"center",padding:60,color:G.sub}}>
              <div style={{fontSize:48}}>📭</div>
              <div style={{marginTop:12,fontSize:14}}>{t("لا توجد تعليقات بعد","No comments yet")}</div>
            </div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16}}>
              <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:16,padding:isMobile?14:20,boxShadow:"0 2px 10px rgba(124,58,237,0.07)"}}>
                <div style={{fontSize:13,fontWeight:700,color:G.sub,marginBottom:10}}>{t("توزيع المشاعر الكلي","Overall Sentiment")}</div>
                <ResponsiveContainer width="100%" height={isMobile?200:240}>
                  <PieChart>
                    <Pie data={pie} cx="50%" cy="50%" outerRadius={isMobile?70:90} dataKey="value"
                      label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                      {pie.map((e,i)=><Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius:10}}/>
                    <Legend/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {cs.byPlace.length>0&&(
                <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:16,padding:isMobile?14:20,boxShadow:"0 2px 10px rgba(124,58,237,0.07)"}}>
                  <div style={{fontSize:13,fontWeight:700,color:G.sub,marginBottom:10}}>{t("المشاعر حسب المكان","Sentiment by Place")}</div>
                  <ResponsiveContainer width="100%" height={isMobile?200:240}>
                    <BarChart data={cs.byPlace} barSize={isMobile?8:14}>
                      <XAxis dataKey="name" tick={{fill:G.sub,fontSize:isMobile?8:10}}/>
                      <YAxis tick={{fill:G.sub,fontSize:isMobile?8:10}} allowDecimals={false}/>
                      <Tooltip contentStyle={{borderRadius:10}}/>
                      <Legend/>
                      <Bar dataKey="إيجابي" fill={G.pos} radius={[4,4,0,0]}/>
                      <Bar dataKey="سلبي"   fill={G.neg} radius={[4,4,0,0]}/>
                      <Bar dataKey="محايد"  fill={G.neu} radius={[4,4,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

