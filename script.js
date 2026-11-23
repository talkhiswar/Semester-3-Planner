/* ===== DATA JADWAL KULIAH ===== */
var jadwal=[
{matkul:"Matematika Diskrit (A1)",dosen:"Rasiban, M.Kom",hari:"Senin",tanggal:"2026-10-05",mulai:"10:30",selesai:"13:00"},

{matkul:"Pemrograman Berorientasi Objek (A1)",dosen:"Veri Arinal, M.Kom",hari:"Selasa",tanggal:"2026-09-29",mulai:"08:00",selesai:"10:30"},
{matkul:"Kewarganegaraan (A1)",dosen:"Sri Lestari, S.Pd, M.M",hari:"Selasa",tanggal:"2026-10-06",mulai:"10:30",selesai:"12:10"},
{matkul:"Bahasa Jepang (A1)",dosen:"Dr. H Agus Yulistiyono, S.E., M.M",hari:"Selasa",tanggal:"2026-10-06",mulai:"13:30",selesai:"16:00"},

{matkul:"Organisasi dan Arsitektur Komputer (A1)",dosen:"Ivan Muhammad Reza, S.Kom., M.Kom",hari:"Rabu",tanggal:"2026-10-07",mulai:"09:00",selesai:"10:30"},
{matkul:"Jaringan Komputer (A1)",dosen:"Yuma Akbar, S.Kom., M.Kom",hari:"Rabu",tanggal:"2026-10-07",mulai:"10:30",selesai:"13:00"},

{matkul:"Kecerdasan Buatan (A1)",dosen:"Ivan Muhammad Reza, S.Kom., M.Kom",hari:"Kamis",tanggal:"2026-10-08",mulai:"08:00",selesai:"10:30"},

{matkul:"Komputasi Paralel dan Terdistribusi (A1)",dosen:"Veri Arinal, M.Kom",hari:"Jumat",tanggal:"2026-10-09",mulai:"13:00",selesai:"15:30"}
];

/* ===== KONSTANTA ===== */
var PALET={
ai:["#8b5cf6","#22d3ee","#14b8a6","#f472b6","#38bdf8","#a78bfa","#2dd4bf","#fb7185"],
emas:["#8b5a2b","#a06a12","#a0522d","#7a5c1e","#b5651d","#8a6d1f","#9c4a1a","#6b4423"]
};

var IKON={
ai:{bg:"#0a0f1e",a:"#22d3ee",b:"#8b5cf6"},
emas:{bg:"#3b2410",a:"#e0b252",b:"#c08a2e"}
};

var LABEL={ai:"AI mode",emas:"Gold mode"};
var NAMA_HARI=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
var NAMA_BULAN=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
var urutanHari={Senin:1,Selasa:2,Rabu:3,Kamis:4,Jumat:5};
var kurangGerak=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== PERSIAPAN DATA ===== */
// Simpan urutan asli untuk warna kartu
jadwal.forEach(function(j,i){
j.idx=i;
});

// Urutkan: hari (Senin-Jumat), lalu jam mulai
jadwal.sort(function(a,b){
return (urutanHari[a.hari]||99)-(urutanHari[b.hari]||99)||
a.mulai.localeCompare(b.mulai);
});

/* ===== ELEMEN & STATE ===== */
var root=document.documentElement;
var elTimeline=document.getElementById("timeline");
var elCari=document.getElementById("cari");
var elChips=document.getElementById("chips");
var elInfo=document.getElementById("info");
var elKosong=document.getElementById("kosong");
var elTema=document.getElementById("tema");
var elLabel=document.getElementById("labelTema");
var hariAktif="";
var temaAktif="ai";

/* ===== FUNGSI BANTU ===== */
function menitDari(jam){
var p=jam.split(":");
return +p[0]*60 + +p[1];
}

function formatDurasi(m){
var j=Math.floor(m/60),s=m%60;
return (j?j+" jam":"")+(s?(j?" ":"")+s+" menit":"")||"0 menit";
}

// "2026-09-29" -> "29 September 2026"
function formatTanggal(iso){
var p=iso.split("-");
return (+p[2])+" "+NAMA_BULAN[+p[1]-1]+" "+p[0];
}

function buat(tag,kelas,teks){
var e=document.createElement(tag);
if(kelas)e.className=kelas;
if(teks!==undefined)e.textContent=teks;
return e;
}

/* ===== IKON WEBSITE ===== */
function pasangIkon(t){
var c=IKON[t];
var svg="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>"+
"<rect width='64' height='64' rx='14' fill='"+c.bg+"'/>"+
"<rect x='10' y='14' width='44' height='40' rx='8' fill='none' stroke='"+c.a+"' stroke-width='3'/>"+
"<path d='M10 26H54' stroke='"+c.a+"' stroke-width='3'/>"+
"<path d='M22 10V18M42 10V18' stroke='"+c.b+"' stroke-width='4' stroke-linecap='round'/>"+
"<path d='M22 44L32 34L42 42' stroke='"+c.b+"' stroke-width='2.5' fill='none'/>"+
"<circle cx='22' cy='44' r='3.5' fill='"+c.a+"'/>"+
"<circle cx='32' cy='34' r='3.5' fill='"+c.a+"'/>"+
"<circle cx='42' cy='42' r='3.5' fill='"+c.a+"'/>"+
"</svg>";
document.getElementById("ikon").href="data:image/svg+xml,"+encodeURIComponent(svg);
}

/* ===== STATISTIK ===== */
function hitung(el,akhir){
if(kurangGerak){el.textContent=akhir;return;}
var mulai=null;
function langkah(t){
if(mulai===null)mulai=t;
var p=Math.min((t-mulai)/900,1);
el.textContent=Math.round(akhir*p);
if(p<1)requestAnimationFrame(langkah);
}
requestAnimationFrame(langkah);
}

(function isiStatistik(){
var unikHari={},total=0;
jadwal.forEach(function(j){
unikHari[j.hari]=true;
total+=menitDari(j.selesai)-menitDari(j.mulai);
});
hitung(document.getElementById("statMatkul"),jadwal.length);
hitung(document.getElementById("statHari"),Object.keys(unikHari).length);
document.getElementById("statDurasi").textContent=formatDurasi(total);
})();

/* ===== EFEK MENGETIK ===== */
(function ketik(){
var teks="Merencanakan semester dengan cerdas.";
var el=document.getElementById("ketik");
if(kurangGerak){el.textContent=teks;return;}
var i=0;
var timer=setInterval(function(){
el.textContent=teks.slice(0,++i);
if(i>=teks.length)clearInterval(timer);
},45);
})();

/* ===== FILTER HARI ===== */
(function buatChips(){
var daftar=[{nilai:"",label:"Semua"}];
["Senin","Selasa","Rabu","Kamis","Jumat"].forEach(function(h){
daftar.push({nilai:h,label:h});
});
daftar.forEach(function(c){
var b=buat("button","chip-btn"+(c.nilai===hariAktif?" aktif":""),c.label);
b.type="button";
b.addEventListener("click",function(){
hariAktif=c.nilai;
elChips.querySelectorAll(".chip-btn").forEach(function(x){
x.classList.remove("aktif");
});
b.classList.add("aktif");
tampilkan();
});
elChips.appendChild(b);
});
})();

/* ===== TAMPILKAN JADWAL ===== */
function tampilkan(){
var kata=elCari.value.trim().toLowerCase();
var hariIni=NAMA_HARI[new Date().getDay()];
var palet=PALET[temaAktif];

var hasil=jadwal.filter(function(j){
return (j.matkul.toLowerCase().includes(kata)||
j.dosen.toLowerCase().includes(kata))&&
(!hariAktif||j.hari===hariAktif);
});

elTimeline.innerHTML="";
var grup=[],peta={};

hasil.forEach(function(j){
if(!peta[j.hari]){
peta[j.hari]={hari:j.hari,item:[]};
grup.push(peta[j.hari]);
}
peta[j.hari].item.push(j);
});

var urut=0;

grup.forEach(function(g){
var kotak=buat("div","hari-grup");
var judul=buat("div","hari-judul");
var h2=buat("h2","",g.hari);

if(g.hari===hariIni){
h2.appendChild(buat("span","tag-hari-ini","Hari ini"));
}

judul.appendChild(h2);
judul.appendChild(buat("p","",g.item.length+" mata kuliah"));
kotak.appendChild(judul);

var daftar=buat("div","daftar-kartu");

g.item.forEach(function(j){
var kartu=buat("article","kartu");
kartu.style.setProperty("--accent",palet[j.idx%palet.length]);
kartu.style.setProperty("--i",urut++);

var waktu=buat("div","waktu");
waktu.appendChild(buat("strong","",j.mulai));
waktu.appendChild(buat("small","","sampai"));
waktu.appendChild(buat("strong","",j.selesai));

var isi=buat("div","isi");
isi.appendChild(buat("h3","",j.matkul));
isi.appendChild(buat("p","dosen",j.dosen));

var meta=buat("div","meta");
meta.appendChild(buat("span","",formatDurasi(
menitDari(j.selesai)-menitDari(j.mulai)
)));
meta.appendChild(buat("span","",j.hari+", "+formatTanggal(j.tanggal)));

isi.appendChild(meta);
kartu.appendChild(waktu);
kartu.appendChild(isi);
daftar.appendChild(kartu);
});

kotak.appendChild(daftar);
elTimeline.appendChild(kotak);
});

elInfo.textContent="Menampilkan "+hasil.length+" dari "+jadwal.length+" mata kuliah";
elKosong.hidden=hasil.length!==0;
}

/* ===== ANIMASI JARINGAN (CANVAS) ===== */
var kanvas=document.getElementById("jaring");
var ctx=kanvas.getContext("2d");
var titik=[],lebar=0,tinggi=0;
var warnaNode="#22d3ee";
var frameAktif=false;

function ukur(){
var r=kanvas.parentElement.getBoundingClientRect();
var dpr=window.devicePixelRatio||1;
lebar=r.width;
tinggi=r.height;
kanvas.width=lebar*dpr;
kanvas.height=tinggi*dpr;
ctx.setTransform(dpr,0,0,dpr,0,0);

var n=Math.max(18,Math.min(52,Math.round(lebar/20)));
titik=[];

for(var i=0;i<n;i++){
titik.push({
x:Math.random()*lebar,
y:Math.random()*tinggi,
vx:(Math.random()-.5)*.35,
vy:(Math.random()-.5)*.35
});
}
}

function gambar(gerak){
ctx.clearRect(0,0,lebar,tinggi);
var a,b,d;

for(var i=0;i<titik.length;i++){
a=titik[i];
if(gerak){
a.x+=a.vx;
a.y+=a.vy;
if(a.x<0||a.x>lebar)a.vx*=-1;
if(a.y<0||a.y>tinggi)a.vy*=-1;
}
}

ctx.fillStyle=warnaNode;
ctx.strokeStyle=warnaNode;
ctx.lineWidth=1;

for(var i=0;i<titik.length;i++){
a=titik[i];
ctx.globalAlpha=.8;
ctx.beginPath();
ctx.arc(a.x,a.y,1.8,0,Math.PI*2);
ctx.fill();

for(var j=i+1;j<titik.length;j++){
b=titik[j];
d=Math.hypot(a.x-b.x,a.y-b.y);
if(d<120){
ctx.globalAlpha=(1-d/120)*.5;
ctx.beginPath();
ctx.moveTo(a.x,a.y);
ctx.lineTo(b.x,b.y);
ctx.stroke();
}
}
}
ctx.globalAlpha=1;
}

function putar(){
gambar(true);
if(!document.hidden){
requestAnimationFrame(putar);
}else{
frameAktif=false;
}
}

function mulaiJaring(){
ukur();
if(kurangGerak){
gambar(false);
}else if(!frameAktif){
frameAktif=true;
putar();
}
}

window.addEventListener("resize",function(){
ukur();
if(kurangGerak)gambar(false);
});

document.addEventListener("visibilitychange",function(){
if(!document.hidden&&!kurangGerak&&!frameAktif){
frameAktif=true;
putar();
}
});

/* ===== PENGATURAN TEMA ===== */
function aturTema(t){
temaAktif=t;
root.setAttribute("data-theme",t);
elLabel.textContent=LABEL[t];
elTema.textContent=t==="ai"?"Ganti ke Cokelat Emas":"Ganti ke Tema AI";

var gaya=getComputedStyle(root);
warnaNode=gaya.getPropertyValue("--node").trim()||"#22d3ee";

document.getElementById("metaTema").content=
gaya.getPropertyValue("--hero1").trim()||"#0f1a3a";

pasangIkon(t);

if(kurangGerak&&titik.length)gambar(false);
tampilkan();
}

var temaAwal="ai";
try{
var simpan=localStorage.getItem("temaPlanner");
if(simpan==="ai"||simpan==="emas")temaAwal=simpan;
}catch(e){}

elTema.addEventListener("click",function(){
var baru=temaAktif==="ai"?"emas":"ai";
aturTema(baru);
try{
localStorage.setItem("temaPlanner",baru);
}catch(e){}
});

/* ===== FOTO CADANGAN ===== */
document.getElementById("foto").addEventListener("error",function(){
this.hidden=true;
document.getElementById("fotoFallback").hidden=false;
});

/* ===== JALANKAN WEBSITE ===== */
elCari.addEventListener("input",tampilkan);
aturTema(temaAwal);
mulaiJaring();
