/* =====================================================================
   ARMETALES · Datos de ejemplo  ·  window.ARM
   Generado con semilla fija (mulberry32). Las fechas son relativas a hoy.
   Convenciones: bodegaId === sedeId (cada sede/bodega es un nodo de inventario).
   ===================================================================== */
/* Reloj del demo: la operación siempre se muestra en plena jornada (2:10 p. m. de hoy al cargar
   la página y avanzando en tiempo real), sin importar a qué hora se abra el demo. */
(function () {
  var Real = window.Date, base = new Real(); base.setHours(14, 10, 0, 0);
  var offset = base.getTime() - Real.now();
  function DemoDate(a, b, c, d, e, f, g) {
    var n = arguments.length, v;
    if (!(this instanceof DemoDate)) return new Real(Real.now() + offset).toString();
    v = n === 0 ? new Real(Real.now() + offset) : n === 1 ? new Real(a) : new Real(a, b, c || 1, d || 0, e || 0, f || 0, g || 0);
    Object.setPrototypeOf(v, DemoDate.prototype); return v;
  }
  DemoDate.prototype = Object.create(Real.prototype); DemoDate.prototype.constructor = DemoDate;
  Object.setPrototypeOf(DemoDate, Real);
  DemoDate.now = function () { return Real.now() + offset; };
  DemoDate.parse = Real.parse; DemoDate.UTC = Real.UTC;
  window.Date = DemoDate;
})();

(function () {
'use strict';

/* ---------- utilidades internas ---------- */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
var rnd = mulberry32(20261110);
function ri(a,b){return Math.floor(rnd()*(b-a+1))+a;}
function rf(a,b,d){var v=a+rnd()*(b-a);var p=Math.pow(10,d==null?2:d);return Math.round(v*p)/p;}
function pick(a){return a[Math.floor(rnd()*a.length)];}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(rnd()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function pad(n,l){n=String(n);while(n.length<l)n='0'+n;return n;}
function round(v,d){var p=Math.pow(10,d||0);return Math.round(v*p)/p;}
var HOY = new Date(); HOY.setHours(0,0,0,0);
function at(dd,h,m){var d=new Date(HOY);d.setDate(d.getDate()+dd);d.setHours(h||0,m||0,0,0);return d.toISOString();}
function ymd(dd){var d=new Date(HOY);d.setDate(d.getDate()+dd);return d.getFullYear()+'-'+pad(d.getMonth()+1,2)+'-'+pad(d.getDate(),2);}
var YYMM = String(HOY.getFullYear()).slice(2)+pad(HOY.getMonth()+1,2);
function hav(a,b){var R=6371,t=Math.PI/180,dl=(b[0]-a[0])*t,dn=(b[1]-a[1])*t;var x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a[0]*t)*Math.cos(b[0]*t)*Math.sin(dn/2)*Math.sin(dn/2);return 2*R*Math.asin(Math.sqrt(x));}

/* ---------- sedes / bodegas ---------- */
var sedes = [
 {id:'CEDI-URI',nombre:'CEDI La Uribe',tipo:'CEDI',ciudad:'Manizales',barrio:'La Uribe',direccion:'Km 4 vía Panamericana, sector La Uribe',lat:5.0285,lng:-75.5340,principal:true,corteHora:'15:00',consolidacionMin:90,capacidadM3:6400,posiciones:1840,responsable:'Héctor Mauricio Bernal',activa:true},
 {id:'CD-CHI',nombre:'Centro Chinchiná',tipo:'Centro de despacho',ciudad:'Chinchiná',barrio:'Zona Industrial',direccion:'Km 1 vía Chinchiná – Palestina',lat:4.9880,lng:-75.6090,principal:false,corteHora:'14:00',consolidacionMin:60,capacidadM3:2100,posiciones:560,responsable:'Wilson Parra Cifuentes',activa:true},
 {id:'CD-MZC',nombre:'Manizales Centro',tipo:'Centro de despacho',ciudad:'Manizales',barrio:'Centro',direccion:'Cra 20 # 28-35, Centro',lat:5.0689,lng:-75.5174,principal:false,corteHora:'15:30',consolidacionMin:60,capacidadM3:1400,posiciones:380,responsable:'Natalia Ospina Vélez',activa:true},
 {id:'CD-MQT',nombre:'Centro Mariquita',tipo:'Centro de despacho',ciudad:'Mariquita',barrio:'Zona Industrial',direccion:'Km 2 vía Mariquita – Honda',lat:5.2010,lng:-74.8790,principal:false,corteHora:'15:30',consolidacionMin:90,capacidadM3:2800,posiciones:700,responsable:'Jhon Fredy Caicedo',activa:true},
 {id:'CD-ANT',nombre:'Centro Antioquia',tipo:'Centro de despacho',ciudad:'Itagüí',barrio:'Calatrava',direccion:'Cra 50 # 36 Sur-120, Itagüí',lat:6.1717,lng:-75.6114,principal:false,corteHora:'14:30',consolidacionMin:75,capacidadM3:3000,posiciones:780,responsable:'Lina Marcela Ortega',activa:true},
 {id:'CD-CUN',nombre:'Centro Cundinamarca',tipo:'Centro de despacho',ciudad:'Funza',barrio:'Zona Industrial',direccion:'Km 2 vía Funza – Siberia',lat:4.7110,lng:-74.2085,principal:false,corteHora:'14:00',consolidacionMin:75,capacidadM3:2400,posiciones:620,responsable:'Germán Alberto Quiceno',activa:true}
];
var CEDI='CEDI-URI', FUNZA='CD-CHI';

/* ---------- productos SAP ---------- */
var restriccionesProducto = {
  LARGA:'Longitud > 6 m: requiere planchón o tractomula',
  NO_APILAR:'No apilar más de una estiba',
  HUMEDAD:'Proteger de la humedad (carpa obligatoria)',
  MONTACARGAS:'Cargue y descargue con montacargas o grúa',
  DOS_OPERARIOS:'Manipulación con dos operarios',
  ZUNCHAR:'Asegurar con zunchos o eslingas',
  SEPARAR:'No mezclar con lámina galvanizada'
};
/* [sku, descripción, familia, uBase, uEmpaque, factorEmp, pesoKg, L, A, H, restricciones] */
var P = [
 ['1000234','Varilla corrugada 3/8" x 6 m','Varilla','Barra','Atado x 50',50,3.35,6,0.0095,0.0095,['ZUNCHAR']],
 ['1000235','Varilla corrugada 1/2" x 6 m','Varilla','Barra','Atado x 30',30,5.97,6,0.0127,0.0127,['ZUNCHAR']],
 ['1000236','Varilla corrugada 5/8" x 6 m','Varilla','Barra','Atado x 20',20,9.33,6,0.0159,0.0159,['ZUNCHAR']],
 ['1000237','Varilla corrugada 3/4" x 6 m','Varilla','Barra','Atado x 15',15,13.4,6,0.0191,0.0191,['ZUNCHAR','DOS_OPERARIOS']],
 ['1000238','Varilla corrugada 1" x 6 m','Varilla','Barra','Atado x 8',8,23.9,6,0.0254,0.0254,['ZUNCHAR','MONTACARGAS']],
 ['1000240','Varilla lisa 1/4" x 6 m','Varilla','Barra','Atado x 100',100,1.49,6,0.0064,0.0064,['ZUNCHAR']],
 ['1000241','Varilla corrugada 1/2" x 12 m','Varilla','Barra','Atado x 20',20,11.9,12,0.0127,0.0127,['LARGA','ZUNCHAR','DOS_OPERARIOS']],
 ['1000242','Varilla corrugada 3/4" x 12 m','Varilla','Barra','Atado x 10',10,26.8,12,0.0191,0.0191,['LARGA','ZUNCHAR','MONTACARGAS']],
 ['1001100','Malla electrosoldada XX-084 2.35 x 6 m','Malla','Unidad','Paquete x 10',10,18.9,6,2.35,0.006,['NO_APILAR','DOS_OPERARIOS']],
 ['1001101','Malla electrosoldada XX-106 2.35 x 6 m','Malla','Unidad','Paquete x 10',10,24.6,6,2.35,0.006,['NO_APILAR','DOS_OPERARIOS']],
 ['1001102','Malla electrosoldada XX-159 2.35 x 6 m','Malla','Unidad','Paquete x 10',10,35.5,6,2.35,0.007,['NO_APILAR','DOS_OPERARIOS']],
 ['1001103','Malla electrosoldada XX-188 2.35 x 6 m','Malla','Unidad','Paquete x 10',10,41.2,6,2.35,0.008,['NO_APILAR','DOS_OPERARIOS']],
 ['1002200','Perfil C 100x50x2.0 mm x 6 m','Perfil','Unidad','Paquete x 20',20,14.3,6,0.1,0.05,['ZUNCHAR']],
 ['1002201','Perfil C 150x50x2.0 mm x 6 m','Perfil','Unidad','Paquete x 15',15,17.5,6,0.15,0.05,['ZUNCHAR']],
 ['1002202','Perfil C 200x50x3.0 mm x 6 m','Perfil','Unidad','Paquete x 10',10,31.0,6,0.2,0.05,['ZUNCHAR','DOS_OPERARIOS']],
 ['1002210','Ángulo 1 1/2" x 1/8" x 6 m','Perfil','Unidad','Atado x 20',20,6.6,6,0.038,0.038,['ZUNCHAR']],
 ['1002211','Ángulo 2" x 3/16" x 6 m','Perfil','Unidad','Atado x 12',12,13.6,6,0.051,0.051,['ZUNCHAR']],
 ['1002220','Platina 1" x 1/4" x 6 m','Perfil','Unidad','Atado x 25',25,6.0,6,0.0254,0.0064,['ZUNCHAR']],
 ['1002230','Viga IPE 160 x 12 m','Perfil','Unidad','Unidad',1,184,12,0.082,0.16,['LARGA','MONTACARGAS','ZUNCHAR']],
 ['1002231','Viga IPE 200 x 12 m','Perfil','Unidad','Unidad',1,269,12,0.1,0.2,['LARGA','MONTACARGAS','ZUNCHAR']],
 ['1003300','Tubo estructural cuadrado 50x50x2.0 x 6 m','Tubería','Unidad','Atado x 20',20,17.4,6,0.05,0.05,['ZUNCHAR']],
 ['1003301','Tubo estructural cuadrado 40x40x1.5 x 6 m','Tubería','Unidad','Atado x 30',30,10.6,6,0.04,0.04,['ZUNCHAR']],
 ['1003302','Tubo estructural rectangular 100x50x2.0 x 6 m','Tubería','Unidad','Atado x 12',12,26.2,6,0.1,0.05,['ZUNCHAR','DOS_OPERARIOS']],
 ['1003303','Tubo redondo 2" cal. 14 x 6 m','Tubería','Unidad','Atado x 20',20,14.8,6,0.0508,0.0508,['ZUNCHAR']],
 ['1003310','Tubo galvanizado 1" cal. 20 x 6 m','Tubería','Unidad','Atado x 40',40,6.9,6,0.0334,0.0334,['ZUNCHAR','SEPARAR']],
 ['1004400','Lámina HR 3 mm 1.22 x 2.44 m','Lámina','Unidad','Estiba x 15',15,70,2.44,1.22,0.003,['NO_APILAR','MONTACARGAS']],
 ['1004401','Lámina HR 1/4" (6.35 mm) 1.22 x 2.44 m','Lámina','Unidad','Estiba x 8',8,148,2.44,1.22,0.00635,['NO_APILAR','MONTACARGAS']],
 ['1004402','Lámina CR cal. 18 1.22 x 2.44 m','Lámina','Unidad','Estiba x 40',40,36,2.44,1.22,0.0012,['HUMEDAD','DOS_OPERARIOS']],
 ['1004403','Lámina galvanizada cal. 22 1.22 x 2.44 m','Lámina','Unidad','Estiba x 50',50,19.5,2.44,1.22,0.0008,['HUMEDAD','DOS_OPERARIOS']],
 ['1004404','Lámina antideslizante 3 mm 1.22 x 2.44 m','Lámina','Unidad','Estiba x 12',12,74,2.44,1.22,0.0045,['NO_APILAR','MONTACARGAS']],
 ['1005500','Teja zinc ondulada cal. 33 x 3.05 m','Teja','Unidad','Paquete x 50',50,5.8,3.05,0.84,0.02,['HUMEDAD','SEPARAR']],
 ['1005501','Teja zinc ondulada cal. 33 x 2.44 m','Teja','Unidad','Paquete x 50',50,4.6,2.44,0.84,0.02,['HUMEDAD','SEPARAR']],
 ['1005502','Teja trapezoidal cal. 28 x 3.05 m','Teja','Unidad','Paquete x 40',40,7.9,3.05,0.9,0.025,['HUMEDAD']],
 ['1006600','Alambre negro cal. 18 x 25 kg','Alambre','Rollo','Rollo',1,25,0.3,0.3,0.2,['HUMEDAD']],
 ['1006601','Alambre de amarre recocido cal. 16 x 25 kg','Alambre','Rollo','Rollo',1,25,0.3,0.3,0.22,['HUMEDAD']],
 ['1006602','Puntilla con cabeza 2 1/2" x 25 kg','Alambre','Caja','Caja',1,25,0.35,0.25,0.18,['HUMEDAD']],
 ['1006604','Electrodo E6013 1/8" x 20 kg','Alambre','Caja','Caja',1,20,0.36,0.14,0.1,['HUMEDAD']],
 ['1007700','Cemento gris x 50 kg','Cemento','Bolsa','Estiba x 40',40,50,0.6,0.4,0.12,['HUMEDAD','NO_APILAR']],
 ['1007701','Cemento blanco x 25 kg','Cemento','Bolsa','Estiba x 56',56,25,0.5,0.35,0.1,['HUMEDAD','NO_APILAR']],
 ['1007702','Mortero de pega x 25 kg','Cemento','Bolsa','Estiba x 56',56,25,0.5,0.35,0.1,['HUMEDAD','NO_APILAR']],
 ['1007703','Cal hidratada x 25 kg','Cemento','Bolsa','Estiba x 56',56,25,0.5,0.35,0.1,['HUMEDAD']],
 ['1007704','Estribo armado 15x15 cm Ø 1/4"','Varilla','Unidad','Paquete x 100',100,0.62,0.15,0.15,0.01,[]]
];
var QTY = {Varilla:[40,520],Malla:[10,90],Perfil:[16,160],'Tubería':[16,140],'Lámina':[5,40],Teja:[20,240],Alambre:[2,24],Cemento:[20,110]};
var productos = P.map(function (r) {
  var vol = r[7]*r[8]*r[9];
  return {skuSAP:r[0],descripcion:r[1],familia:r[2],unidadBase:r[3],unidadEmpaque:r[4],factorEmpaque:r[5],
    pesoKg:r[6],largoM:r[7],anchoM:r[8],altoM:r[9],volumenM3:round(vol,5),
    restricciones:r[10],restriccion:r[10].length?r[10].map(function(c){return restriccionesProducto[c];}).join(' · '):'Sin restricción',
    estado:'Activo',sincronizado:at(-ri(0,2),ri(1,5),ri(0,59)),stock:{}};
});
var prodById = {}; productos.forEach(function(p){prodById[p.skuSAP]=p;});

/* ---------- municipios ---------- */
var MUNI = {
 cen:{n:'Manizales',loc:'Centro',lat:5.0689,lng:-75.5174,zona:'Manizales',ruta:'R-04'},
 chp:{n:'Manizales',loc:'Chipre',lat:5.0752,lng:-75.5265,zona:'Manizales',ruta:'R-04'},
 ver:{n:'Manizales',loc:'Versalles',lat:5.0625,lng:-75.5020,zona:'Manizales',ruta:'R-04'},
 cab:{n:'Manizales',loc:'El Cable',lat:5.0563,lng:-75.4868,zona:'Manizales',ruta:'R-05'},
 mil:{n:'Manizales',loc:'Milán',lat:5.0497,lng:-75.4790,zona:'Manizales',ruta:'R-05'},
 sul:{n:'Manizales',loc:'La Sultana',lat:5.0640,lng:-75.4730,zona:'Manizales',ruta:'R-05'},
 ene:{n:'Manizales',loc:'La Enea',lat:5.0330,lng:-75.4640,zona:'Manizales',ruta:'R-05'},
 mal:{n:'Manizales',loc:'Maltería',lat:5.0420,lng:-75.4330,zona:'Manizales',ruta:'R-05'},
 vma:{n:'Villamaría',lat:5.0456,lng:-75.5154,zona:'Manizales',ruta:'R-05'},
 sro:{n:'Santa Rosa de Cabal',lat:4.8686,lng:-75.6214,zona:'Risaralda',ruta:'R-01'},
 dos:{n:'Dosquebradas',lat:4.8390,lng:-75.6670,zona:'Risaralda',ruta:'R-01'},
 per:{n:'Pereira',lat:4.8133,lng:-75.6961,zona:'Risaralda',ruta:'R-01'},
 lvi:{n:'La Virginia',lat:4.8990,lng:-75.8830,zona:'Risaralda',ruta:'R-01'},
 cgo:{n:'Cartago',lat:4.7464,lng:-75.9117,zona:'Risaralda',ruta:'R-01'},
 nei:{n:'Neira',lat:5.1664,lng:-75.5200,zona:'Norte',ruta:'R-02'},
 fil:{n:'Filadelfia',lat:5.2970,lng:-75.5620,zona:'Norte',ruta:'R-02'},
 ara:{n:'Aranzazu',lat:5.2710,lng:-75.4910,zona:'Norte',ruta:'R-02'},
 sal:{n:'Salamina',lat:5.4030,lng:-75.4870,zona:'Norte',ruta:'R-02'},
 lme:{n:'La Merced',lat:5.3960,lng:-75.5470,zona:'Norte',ruta:'R-02'},
 pac:{n:'Pácora',lat:5.5270,lng:-75.4590,zona:'Norte',ruta:'R-02'},
 agu:{n:'Aguadas',lat:5.6110,lng:-75.4560,zona:'Norte',ruta:'R-02'},
 chn:{n:'Chinchiná',lat:4.9825,lng:-75.6036,zona:'Sur',ruta:'R-03'},
 pal:{n:'Palestina',lat:5.0180,lng:-75.6225,zona:'Sur',ruta:'R-03'},
 ans:{n:'Anserma',lat:5.2380,lng:-75.7850,zona:'Occidente',ruta:'R-06'},
 rio:{n:'Riosucio',lat:5.4220,lng:-75.7030,zona:'Occidente',ruta:'R-06'},
 sup:{n:'Supía',lat:5.4470,lng:-75.6500,zona:'Occidente',ruta:'R-06'},
 cir:{n:'Circasia',lat:4.6190,lng:-75.6360,zona:'Quindío',ruta:'R-07'},
 mon:{n:'Montenegro',lat:4.5660,lng:-75.7510,zona:'Quindío',ruta:'R-07'},
 cal:{n:'Calarcá',lat:4.5290,lng:-75.6400,zona:'Quindío',ruta:'R-07'},
 arm:{n:'Armenia',lat:4.5339,lng:-75.6811,zona:'Quindío',ruta:'R-07'},
 ldo:{n:'La Dorada',lat:5.4530,lng:-74.6640,zona:'Magdalena',ruta:'R-08'}
};
var DEP = {'Santa Rosa de Cabal':'Risaralda',Dosquebradas:'Risaralda',Pereira:'Risaralda','La Virginia':'Risaralda',Cartago:'Valle del Cauca',Armenia:'Quindío',Circasia:'Quindío',Montenegro:'Quindío','Calarcá':'Quindío'};

/* ---------- clientes ---------- */
var CL = [
'Ferretería El Constructor Ltda.|F|chp|Chipre Viejo','Constructora Altos de Chipre S.A.S.|C|cen|San José','Depósito de Materiales Versalles|D|ver|Versalles',
'Metalmecánica Industrial de Caldas S.A.S.|I|chp|Campohermoso','Ferrecentro Versalles|F|ver|La Estrella','Construcciones Pórtico S.A.S.|C|cen|Los Agustinos','Ferretería La 23|F|cen|Centro',
'Ferretería La Mayorista de Milán|F|mil|Milán','Depósito Materiales La Sultana|D|sul|La Sultana','Constructora Horizonte La Enea S.A.S.|C|ene|La Enea',
'Ferretería Villamaría Hnos.|F|vma|Centro','Cerrajería y Estructuras Maltería|I|mal|Zona Industrial Maltería','Hierros y Aceros El Cable|D|cab|Palogrande',
'Distribuciones Santa Rosa Ferretería|F|sro|La Hermosa','Constructora Los Araucarios S.A.S.|C|sro|Centro',
'Depósito La Badea|D|dos|La Badea','Constructora Pinares de Pereira S.A.S.|C|per|Pinares','Ferretería La Virginia Centro|F|lvi|Centro',
'Aceros y Cubiertas Cartago|D|cgo|El Prado','Ferrocampo Dosquebradas|F|dos|Santa Mónica','Construcciones del Otún S.A.S.|C|per|Cuba','Ferretería La Esperanza Cartago|F|cgo|Santa Ana',
'Ferretería Aranzazu Express|F|ara|Centro','Constructora Salamina Colonial S.A.S.|C|sal|La Palma','Depósito Pácora Hierros|D|pac|Centro',
'Cubiertas y Techos Neira|D|nei|Pueblo Rico','Ferretería Filadelfia Rural|F|fil|Centro','Industrias Metálicas Aguadas S.A.S.|I|agu|Zona Industrial','Ferretería La Merced|F|lme|Centro',
'Depósito Chinchiná Constructor|D|chn|La Frontera','Ferretería El Cafetal|F|chn|Centro','Constructora Torres de Chinchiná S.A.S.|C|chn|Los Mangos',
'Hierros del Sur Chinchiná|D|chn|El Túnel','Ferretería Palestina Centro|F|pal|Centro','Cemento y Acero Arauca|D|pal|Arauca',
'Ferretería El Ingrumá|F|ans|Centro','Constructora Occidente Caldense S.A.S.|C|ans|San Pedro','Depósito Riosucio Materiales|D|rio|La Candelaria','Ferrometales Riosucio|F|rio|San Sebastián',
'Ferretería Quindío Real|F|arm|Centro','Constructora Cuyabra S.A.S.|C|arm|La Castellana','Aceros del Café Armenia|D|arm|Avenida Bolívar',
'Depósito Magdalena Medio|D|ldo|Las Ferias','Constructora Puerto Dorado S.A.S.|C|ldo|Conejo','Ferretería La Dorada Express|F|ldo|Centro'
];
var VIAS = ['Cra','Cl','Av. Cra','Diag','Tv'];
var VENT = [['07:00','12:00'],['08:00','17:00'],['07:00','16:00'],['13:00','17:00'],['06:00','11:00'],['07:30','15:30']];
var RESTR = ['Acceso máximo para turbo (calle estrecha)','Descargue con ayudante (sin montacargas)','Vía destapada en los últimos 600 m','Descargue restringido en horas pico (zona residencial)','Requiere montacargas del cliente','Ingreso con EPP y planilla de seguridad social','Portería exige cita previa'];
var NOM1 = ['Carlos','Martha','Luz','Jorge','Diana','Fabio','Rocío','Hernán','Yolanda','Iván','Sandra','Mauricio','Adriana','Gilberto','Patricia','Nelson'];
var APE = ['Rodríguez','Gómez','Martínez','López','Ramírez','Cárdenas','Guerrero','Acosta','Bernal','Quintero','Salamanca','Pineda','Castaño','Vega','Monroy','Pardo'];
function nitDV(n){var w=[3,7,13,17,19,23,29,37,41,43,47,53,59,67,71],s=0,d=String(n).split('').reverse();for(var i=0;i<d.length;i++)s+=d[i]*w[i];var r=s%11;return r>1?11-r:r;}
var TIPO = {F:'Ferretería',C:'Constructora',D:'Depósito de materiales',I:'Industria metalmecánica'};
var clientes = CL.map(function (s, i) {
  var a = s.split('|'), m = MUNI[a[2]];
  var nit = ri(800000000, 901999999), cp = ri(1,2);
  var lat = round(m.lat + rf(-0.012,0.012,4),5), lng = round(m.lng + rf(-0.012,0.012,4),5);
  var v = pick(VENT), q = rnd();
  var nm = pick(NOM1)+' '+pick(APE);
  var nr = ri(0,3) === 0 ? [pick(RESTR), pick(RESTR)].filter(function(x,k,arr){return arr.indexOf(x)===k;}) : (ri(0,2)===0?[pick(RESTR)]:[]);
  var nitTxt = String(nit).replace(/(\d{3})(\d{3})(\d{3})/,'$1.$2.$3')+'-'+nitDV(nit);
  var nm1 = a[0].replace(/ (Ltda\.|S\.A\.S\.)$/, '');
  return {
    clienteIdSAP:'CL'+pad(1004200+i*17+ri(0,9),7), nit:nitTxt, razonSocial:a[0], tipo:TIPO[a[1]], tipoCodigo:a[1],
    direccionEntrega:pick(VIAS)+' '+ri(5,120)+(ri(0,1)?' # ':' # ')+ri(2,90)+'-'+ri(1,99)+', '+a[3],
    municipio:m.n, localidad:m.loc||null, departamento:DEP[m.n]||'Caldas', barrio:a[3], zona:m.zona, rutaId:m.ruta, municipioKey:a[2],
    latitud:lat, longitud:lng, ventanaInicio:v[0], ventanaFin:v[1], restricciones:nr,
    contacto:{nombre:nm, cargo:pick(['Almacenista','Jefe de compras','Residente de obra','Gerente','Coordinador de bodega']), telefono:'3'+ri(0,2)+ri(0,9)+' '+ri(100,999)+' '+ri(1000,9999), correo:nm.split(' ')[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')+'@'+nm1.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'').slice(0,16)+'.com.co'},
    descargueMin:a[1]==='C'?ri(35,70):a[1]==='I'?ri(25,45):ri(15,40),
    frecuencia:pick(['Diaria','Semanal','Semanal','Quincenal','Bajo demanda']),
    calidadDireccion:q<0.72?'Verificada':q<0.9?'Aproximada':'Por validar',
    estado:'Activo', sincronizado:at(-ri(0,3),ri(1,5),ri(0,59)), vendedor:null, cupoCreditoCOP:ri(20,400)*1000000
  };
});
var cliById = {}; clientes.forEach(function(c){cliById[c.clienteIdSAP]=c;});

/* ---------- conductores y vehículos ---------- */
var CD = ['Pedro Antonio Gómez','Jhon Jairo Cardona','Luis Fernando Moreno','Wilmer Alexander Castro','José Ariel Rincón','Édgar Mauricio Suárez','Carlos Andrés Peña','Néstor Raúl Villamil','Freddy Hernán Ortiz','Óscar Iván Barreto','Milton César Parra','Alirio Bautista Cruz','Duván Esteban Rojas','Jorge Eliécer Talero'];
var conductores = CD.map(function (n, i) {
  return {conductorId:'CND-'+pad(i+1,3), nombre:n, cedula:(ri(0,1)?'75.':'16.')+ri(100,999)+'.'+ri(100,999), telefono:'3'+ri(0,2)+ri(0,9)+' '+ri(100,999)+' '+ri(1000,9999),
    licencia:i<2?'C3':pick(['C2','C2','C3']), licenciaVence:ymd(ri(40,700)), sedeId:CEDI, usuarioId:i===0?'USR-006':null, estado:'Disponible', vehiculoId:null,
    experienciaAnios:ri(3,22), calificacion:rf(4.2,4.95,1), entregasMes:ri(38,140)};
});
/* [placa, tipo, marca, modelo, año, kg, m3, L, A, H, ejes, carrocería, estibas, ayudante, cobertura] */
var VH = [
 ['WNK 482','Camioneta','Kia','K2500 Frontier',2022,1300,6.0,2.4,1.6,1.6,2,'Estacas',2,false,['R-03','R-04','R-05']],
 ['SXU 317','Camioneta','JAC','Hunter T6',2023,1100,5.5,2.3,1.5,1.6,2,'Estacas',2,false,['R-03','R-04','R-05']],
 ['TJB 905','Turbo','Chevrolet','NKR Turbo',2021,4000,17,4.2,2.0,2.0,2,'Estacas',6,false,['R-01','R-02','R-03','R-04','R-05']],
 ['UFR 264','Turbo','Hino','300 816',2022,4300,18,4.4,2.1,2.0,2,'Furgón',6,false,['R-01','R-02','R-03','R-04','R-05']],
 ['NPY 618','Turbo','Foton','Aumark BJ1049',2020,3800,16,4.0,2.0,2.0,2,'Estacas',6,false,['R-01','R-02','R-03','R-04','R-05']],
 ['VCD 730','Sencillo','Chevrolet','FRR 11 Ton',2021,7800,31,6.2,2.3,2.2,2,'Estacas',10,true,['R-01','R-02','R-03','R-04','R-05','R-06','R-07']],
 ['SZE 094','Sencillo','Hino','FC9J',2022,8200,32,6.4,2.3,2.2,2,'Furgón',10,true,['R-01','R-02','R-03','R-04','R-05','R-06','R-07']],
 ['WDM 551','Sencillo','International','4300 DT',2019,7500,30,6.0,2.3,2.2,2,'Estacas',10,true,['R-01','R-02','R-03','R-04','R-05','R-06','R-07']],
 ['SNQ 963','Sencillo','Mercedes-Benz','Atego 1721',2020,8000,31,6.2,2.3,2.2,2,'Planchón',10,true,['R-01','R-02','R-03','R-04','R-05','R-06','R-07']],
 ['TMP 826','Dobletroque','Chevrolet','FVZ 34P',2021,16500,46,8.0,2.4,2.4,3,'Planchón',14,true,['R-01','R-02','R-03','R-06','R-07','R-08']],
 ['XJL 349','Dobletroque','Hino','FM8J',2022,17000,48,8.2,2.4,2.4,3,'Estacas',14,true,['R-01','R-02','R-03','R-06','R-07','R-08']],
 ['BRH 172','Dobletroque','Kenworth','T370 Doble',2020,16000,45,8.0,2.4,2.4,3,'Planchón',14,true,['R-01','R-02','R-03','R-06','R-07','R-08']],
 ['UGX 408','Tractomula','Kenworth','T800',2021,32000,79,12.2,2.5,2.6,5,'Planchón',24,true,['R-01','R-02','R-06','R-07','R-08']],
 ['KLM 520','Tractomula','Freightliner','Cascadia 126',2023,34000,82,12.8,2.5,2.6,5,'Furgón',24,true,['R-01','R-02','R-06','R-07','R-08']]
];
var vehiculos = VH.map(function (r, i) {
  var dig = parseInt(r[0].slice(-1),10), dias = ['lunes','martes','miércoles','jueves','viernes'], dg = [[1,2],[3,4],[5,6],[7,8],[9,0]];
  var d = HOY.getDay(), hoyIdx = d>=1&&d<=5?d-1:-1, restHoy = hoyIdx>=0 && dg[hoyIdx].indexOf(dig)>=0;
  var diaRest = 0; dg.forEach(function(p,k){if(p.indexOf(dig)>=0)diaRest=k;});
  return {placa:r[0], tipo:r[1], marca:r[2], modelo:r[3], anio:r[4], pesoMaxKg:r[5], volumenMaxM3:r[6], largoM:r[7], anchoM:r[8], altoM:r[9], ejes:r[10],
    carroceria:r[11], estibas:r[12], requiereAyudante:r[13], conductorId:conductores[i].conductorId, rutasCobertura:r[14], estado:'Disponible',
    restricciones:{
      picoPlacaCarga:{ciudad:'Manizales', diaRestriccion:dias[diaRest], horario:'06:00–09:00 y 16:00–19:00', aplicaHoy:restHoy},
      centro:r[5]>3500?'Sin ingreso al centro ampliado (> 3,5 t)':'Sin restricción de tonelaje en el centro',
      alturaMaxM:r[1]==='Tractomula'?4.4:4.1
    },
    compatibilidad:{largaMas6m:r[11]==='Planchón'||r[1]==='Tractomula', montacargas:r[11]!=='Furgón', protegeHumedad:r[11]==='Furgón'||r[11]==='Estacas',
      lamina:r[11]!=='Estacas'||r[5]>3000},
    soat:ymd(ri(30,330)), tecnomecanica:ymd(ri(30,330)), gps:true, ultimoMantenimiento:ymd(-ri(5,70)), kmOdometro:ri(48000,420000), sedeId:CEDI};
});
vehiculos.forEach(function (v) { conductores.find(function(c){return c.conductorId===v.conductorId;}).vehiculoId = v.placa; });
['SNQ 963','SXU 317'].forEach(function(pl){vehiculos.find(function(v){return v.placa===pl;}).estado='Mantenimiento';});
var vehByPlaca = {}; vehiculos.forEach(function(v){vehByPlaca[v.placa]=v;});

/* ---------- roles y usuarios ---------- */
var modulosPermiso = [
 ['panel','Panel de control'],['pedidos','Pedidos'],['reservas','Reservas'],['planeacion','Planeación logística'],['motorRutas','Motor de rutas'],['cargue','Optimización de cargue'],
 ['despachos','Despachos'],['seguimiento','Seguimiento de ruta'],['conductor','App de conductores'],['evidencias','Evidencias'],['novedades','Novedades y devoluciones'],
 ['bodegas','Bodegas WMS'],['preparacion','Preparación de pedidos'],['inventario','Inventario y conteos'],['reportes','Reportes e indicadores'],['auditoria','Auditoría'],
 ['clientes','Maestro de clientes'],['productos','Maestro de productos'],['vehiculos','Vehículos'],['rutas','Rutas'],['integraciones','Integraciones'],['usuarios','Usuarios y roles'],['notificaciones','Notificaciones']
].map(function(x){return {id:x[0],nombre:x[1]};});
function perm(o){var r={};modulosPermiso.forEach(function(m){r[m.id]=0;});Object.keys(o).forEach(function(k){r[k]=o[k];});return r;}
var ROLES = [
 ['Coordinador logístico','Coordina la operación diaria: pedidos, despachos y seguimiento.',{panel:1,pedidos:2,reservas:1,planeacion:2,motorRutas:1,cargue:2,despachos:2,seguimiento:2,evidencias:1,novedades:2,reportes:1,notificaciones:1,clientes:1,vehiculos:1,rutas:1}],
 ['Planificador logístico','Construye y ajusta el plan de transporte y las rutas.',{panel:1,pedidos:1,reservas:1,planeacion:3,motorRutas:2,cargue:2,despachos:1,seguimiento:1,reportes:1,clientes:1,productos:1,vehiculos:1,rutas:1}],
 ['Administrador de maestros','Mantiene clientes, productos, vehículos y rutas.',{panel:1,clientes:2,productos:2,vehiculos:2,rutas:2,integraciones:1,auditoria:1}],
 ['Jefe de logística','Responsable de la operación; aprueba excepciones de stock, ruta y despacho.',{panel:3,pedidos:3,reservas:3,planeacion:3,motorRutas:3,cargue:3,despachos:3,seguimiento:3,evidencias:3,novedades:3,bodegas:1,preparacion:1,inventario:1,reportes:3,auditoria:1,clientes:1,productos:1,vehiculos:2,rutas:2,integraciones:1,notificaciones:2}],
 ['Jefe de bodega','Dirige la bodega: preparación, ubicaciones e inventario.',{panel:1,pedidos:1,reservas:2,cargue:2,despachos:1,bodegas:3,preparacion:3,inventario:3,novedades:2,reportes:1,productos:1,notificaciones:1}],
 ['Conductor','Ejecuta la ruta y captura evidencias desde la app móvil.',{conductor:2,evidencias:2,novedades:1}],
 ['Asesor comercial','Consulta el estado de los pedidos de sus clientes.',{pedidos:1,reservas:1,seguimiento:1,evidencias:1,clientes:1,productos:1}],
 ['Arquitecto de integración','Define y monitorea las integraciones con SAP, Data Lake y Easy Sales.',{integraciones:3,auditoria:1,notificaciones:1,reportes:1}],
 ['Administrador de seguridad','Gestiona accesos, perfiles y bloqueos.',{usuarios:3,auditoria:2,notificaciones:1}],
 ['Analista logístico','Analiza indicadores y desempeño de la operación.',{panel:1,pedidos:1,planeacion:1,despachos:1,seguimiento:1,reportes:2,clientes:1,vehiculos:1,rutas:1}],
 ['Administrador','Administración general de la plataforma.',{panel:1,usuarios:2,integraciones:2,notificaciones:2,auditoria:1,clientes:1,productos:1,vehiculos:1,rutas:1}],
 ['Operario de bodega','Ejecuta tareas de preparación y cargue.',{preparacion:2,cargue:1,inventario:1,bodegas:1}],
 ['Analista de inventarios','Controla exactitud de inventario y conteos cíclicos.',{inventario:3,bodegas:1,reservas:1,productos:1,reportes:1,novedades:1}],
 ['Despachador','Programa, confirma y cierra los despachos.',{pedidos:1,cargue:1,despachos:2,seguimiento:2,evidencias:1,novedades:1,conductor:1}],
 ['Auditor','Consulta trazabilidad y auditoría de solo lectura.',{pedidos:1,reservas:1,despachos:1,evidencias:1,inventario:1,reportes:1,auditoria:2,integraciones:1,usuarios:1}],
 ['Ingeniero de datos','Monitorea cargas y calidad de datos del Data Lake.',{integraciones:2,clientes:1,productos:1,reportes:2,auditoria:1}]
];
var roles = ROLES.map(function (r, i) { return {rolId:'ROL-'+pad(i+1,2), nombre:r[0], descripcion:r[1], permisos:perm(r[2]), sistema:true}; });
var rolByNombre = {}; roles.forEach(function(r){rolByNombre[r.nombre]=r;});
var UR = [
 ['Laura Restrepo','Jefe de logística',CEDI],['Andrés Felipe Mejía','Coordinador logístico',CEDI],['Camila Andrea Torres','Planificador logístico',CEDI],
 ['Sandra Milena Ruiz','Administrador de maestros',CEDI],['Héctor Mauricio Bernal','Jefe de bodega',CEDI],['Pedro Antonio Gómez','Conductor',CEDI],
 ['Julián David Ospina','Asesor comercial',CEDI],['Ricardo Alonso Vargas','Arquitecto de integración',CEDI],['Marcela Cristina Duarte','Administrador de seguridad',CEDI],
 ['Daniela Fernanda Herrera','Analista logístico',CEDI],['Gustavo Adolfo Prieto','Administrador',CEDI],['Yeison Stiven Almonacid','Operario de bodega',CEDI],
 ['Paola Andrea Salcedo','Analista de inventarios',FUNZA],['Jaime Eduardo Lozano','Despachador',CEDI],['Mónica Patricia Reyes','Auditor',CEDI],['Esteban Camilo Nieto','Ingeniero de datos',CEDI]
];
function slug(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');}
var usuarios = UR.map(function (u, i) {
  var p = slug(u[0]).split(' ');
  return {usuarioId:'USR-'+pad(i+1,3), nombre:u[0], correo:p[0]+'.'+p[p.length>2?p.length-2:1]+'@armetales.com.co', rolId:rolByNombre[u[1]].rolId, rol:u[1], sedeId:u[2], bodegaId:u[2],
    estado:i===12?'Bloqueado':i===15?'Inactivo':'Activo', fechaModificacion:at(-ri(1,40),ri(7,17),ri(0,59)), ultimoAcceso:at(-ri(0,4),ri(6,18),ri(0,59)), telefono:'3'+ri(0,2)+ri(0,9)+' '+ri(100,999)+' '+ri(1000,9999)};
});
usuarios[0].correo = 'laura.restrepo@armetales.com.co';
roles.forEach(function(r){r.usuarios = usuarios.filter(function(u){return u.rolId===r.rolId;}).length;});
var operarios = [['Yeison Stiven Almonacid','USR-012'],['Brayan Steven Quintero',null],['Cristian Camilo Neira',null],['Alexander Pinzón Molina',null],['Wilson Parra Cifuentes',null],['Diego Armando Beltrán',null]]
  .map(function(o,i){return {operarioId:'OP-'+pad(i+1,3), nombre:o[0], usuarioId:o[1], bodegaId:i===4?FUNZA:CEDI, turno:i%2?'Tarde':'Mañana'};});

/* ---------- rutas ---------- */
var NOW = new Date(); NOW.setSeconds(0,0); NOW.setMinutes(Math.round(NOW.getMinutes()/5)*5);
function ahora(min){return new Date(NOW.getTime()+min*60000).toISOString();}
function curve(a,b,per,amp){var pts=[],dx=b[1]-a[1],dy=b[0]-a[0],ph=rnd()*6.28;for(var i=1;i<=per;i++){var t=i/(per+1),w=Math.sin(t*Math.PI*2+ph)*amp*Math.sin(t*Math.PI);pts.push([round(a[0]+dy*t-dx*w,5),round(a[1]+dx*t+dy*w,5)]);}return pts;}
var ORIG = [sedes[0].lat, sedes[0].lng];
function mpt(k){return [MUNI[k].lat, MUNI[k].lng];}
function mname(k){return MUNI[k].loc||MUNI[k].n;}
var PEAJ = {
 'R-01':{sro:[['Peaje Pavas',13400],['Peaje Tarapacá I',14100]],dos:[['Peaje Tarapacá II',14100]],cgo:[['Peaje Cerritos II',13800]]},
 'R-03':{chn:[['Peaje Pavas',13400]]},
 'R-06':{rio:[['Peaje Irra',14300]],sup:[['Peaje Supía',13900]]},
 'R-07':{cir:[['Peaje Pavas',13400],['Peaje Tarapacá I',14100],['Peaje Tarapacá II',14100],['Peaje Circasia',13600]]},
 'R-08':{ldo:[['Peaje Honda',14900]]}
};
var RT = [
 ['R-01','Risaralda – Pereira / Cartago','Risaralda',['sro','dos','per','lvi','cgo'],'Vigente'],
 ['R-02','Norte – Neira / Aguadas','Norte',['nei','fil','ara','sal','lme','pac','agu'],'Vigente'],
 ['R-03','Sur – Chinchiná / Palestina','Sur',['chn','pal'],'Vigente'],
 ['R-04','Manizales Centro','Manizales',['cen','chp','ver'],'Vigente'],
 ['R-05','Manizales Oriente – Villamaría','Manizales',['vma','cab','mil','sul','ene','mal'],'Vigente'],
 ['R-06','Occidente – Anserma / Riosucio','Occidente',['ans','rio','sup'],'Vigente'],
 ['R-07','Quindío – Armenia','Quindío',['cir','mon','arm','cal'],'Vigente'],
 ['R-08','Magdalena – La Dorada','Magdalena',['ldo'],'En revisión']
];
var rutas = RT.map(function (r) {
  var prev = ORIG, prevName = sedes[0].nombre, tramos = [], sec = [], trazado = [ORIG.slice()], km = 0, peaje = 0, min = 0;
  r[3].forEach(function (k, i) {
    var p = mpt(k), d = round(hav(prev,p)*1.45+rf(0.5,2.5,1),1);
    var pj = ((PEAJ[r[0]]||{})[k]||[]).map(function(x){return {nombre:x[0],valorCOP:x[1]};});
    var sp = r[2]==='Manizales'?22:36;
    tramos.push({orden:i+1,desde:prevName,hasta:mname(k),km:d,minutos:Math.round(d/sp*60),peajes:pj});
    sec.push({orden:i+1,municipioKey:k,nombre:mname(k),lat:p[0],lng:p[1]});
    km += d; min += Math.round(d/sp*60); pj.forEach(function(x){peaje+=x.valorCOP;});
    curve(prev,p,6,0.012).forEach(function(q){trazado.push(q);}); trazado.push(p.slice());
    prev = p; prevName = mname(k);
  });
  var cn = clientes.filter(function(c){return c.rutaId===r[0];}).length;
  return {rutaId:r[0], nombre:r[1], zona:r[2], origenId:CEDI, origen:sedes[0].nombre, municipios:sec.map(function(s){return s.nombre;}), secuencia:sec, tramos:tramos,
    kmIda:round(km,1), kmTotal:round(km*2,1), peajesCOP:peaje, duracionIdaMin:min, vigenciaDesde:ymd(-ri(120,400)), vigenciaHasta:ymd(ri(200,365)), estado:r[4], clientes:cn, trazado:trazado};
});
var rutaById = {}; rutas.forEach(function(r){rutaById[r.rutaId]=r;});

/* ---------- pedidos ---------- */
var ESTADOS_PEDIDO = ['Recibido','Stock validado','Bloqueado por stock','En firme','En preparación','Listo para despacho','Planificado','En ruta','Entregado','Entrega parcial','Fallido'];
var CADENA = ['Recibido','Stock validado','En firme','En preparación','Listo para despacho','Planificado','En ruta','Entregado'];
var ASESORES = ['Julián David Ospina','Luisa Fernanda Camargo','Mauricio Andrés Pinto','Natalia Carolina Báez','Sergio Iván Mahecha'];
var FAM_W = {Varilla:5,Malla:3,Perfil:3,'Tubería':3,'Lámina':2,Teja:2,Alambre:2,Cemento:3};
var FAM_MIN = {Varilla:20,Malla:4,Perfil:6,'Tubería':6,'Lámina':2,Teja:10,Alambre:1,Cemento:10};
var KG_OBJ = {F:[150,900],D:[300,1500],I:[300,1200],C:[600,2600]};
var pickPool = []; productos.forEach(function(p){for(var i=0;i<FAM_W[p.familia];i++)pickPool.push(p);});
var pedIds = {}, pedidos = [];
function newPedId(){var id;do{id='ES-'+ri(481200,489900);}while(pedIds[id]);pedIds[id]=1;return id;}
function mkLineas(cli, mult){
  var n = ri(1,4), tgt = rf(KG_OBJ[cli.tipoCodigo][0], KG_OBJ[cli.tipoCodigo][1], 0)*(mult||1), used = {}, ls = [], tw = 0, shares = [];
  for(var i=0;i<n;i++){shares.push(rf(0.4,1.4));tw+=shares[i];}
  for(var j=0;j<n;j++){
    var p, g=0; do{p=pick(pickPool);g++;}while(used[p.skuSAP]&&g<20); used[p.skuSAP]=1;
    var q = Math.max(p.pesoKg>100?1:FAM_MIN[p.familia], Math.round(shares[j]/tw*tgt/p.pesoKg));
    if(q>=20 && p.familia==='Varilla') q = Math.round(q/10)*10; else if(q>=10 && (p.familia==='Cemento'||p.familia==='Teja')) q = Math.round(q/5)*5;
    ls.push({sku:p.skuSAP, descripcion:p.descripcion, cantidad:q, unidad:p.unidadBase, pesoKg:round(q*p.pesoKg,1), volumenM3:round(q*p.volumenM3,3)});
  }
  return ls;
}
function mkPedido(cli, estado, opt){
  opt = opt||{};
  var ls = mkLineas(cli, opt.mult), id = newPedId();
  var creado = opt.creado!=null?opt.creado:-ri(1,4), ent = opt.entrega!=null?opt.entrega:0;
  var kg = round(ls.reduce(function(s,l){return s+l.pesoKg;},0),1), m3 = round(ls.reduce(function(s,l){return s+l.volumenM3;},0),2);
  var pr = opt.prioridad||(rnd()<0.14?'Alta':rnd()<0.6?'Media':'Baja');
  var ped = {pedidoId:id, pedidoIdOrigen:id, origen:'Easy Sales', clienteId:cli.clienteIdSAP, cliente:cli.razonSocial, rutaId:cli.rutaId, municipio:cli.municipio==='Manizales'?'Manizales · '+cli.localidad:cli.municipio,
    fecha:at(creado,ri(7,16),ri(0,59)), entregaSolicitada:ymd(ent), lineas:ls, estado:estado, prioridad:pr, asesor:pick(ASESORES), ordenCompra:'OC-'+ri(10000,99999),
    bodegaId:CEDI, pesoKg:kg, volumenM3:m3, valorCOP:Math.round(kg*rf(3300,4900,0)/1000)*1000, despachoId:null, observaciones:rnd()<0.18?pick(['Entregar con ayudante','Llamar 30 min antes de llegar','Obra en horario restringido','Factura electrónica adjunta al despacho','Cliente solicita remisión por duplicado']):'', modificado:rnd()<0.1};
  return ped;
}
function addPedidos(list){list.forEach(function(p){pedidos.push(p);});return list;}
function cliRuta(r){return clientes.filter(function(c){return c.rutaId===r;});}
function pickN(arr,n){return shuffle(arr).slice(0,Math.min(n,arr.length));}
/* secuenciación por vecino más cercano desde el CEDI */
function nn(list){var out=[],pos=ORIG,rest=list.slice();while(rest.length){var bi=0,bd=1e9;rest.forEach(function(p,i){var c=cliById[p.clienteId],d=hav(pos,[c.latitud,c.longitud]);if(d<bd){bd=d;bi=i;}});var n=rest.splice(bi,1)[0];out.push(n);var c2=cliById[n.clienteId];pos=[c2.latitud,c2.longitud];}return out;}
var TRIPS = {hoy:[], pasado:[], cargando:null, plan:[]};
/* despachos de hoy: patrón de estados por parada (E entregado, X parcial, F fallido, R pendiente) */
[['R-01','EEXRR',1],['R-02','EEERR',1],['R-04','EFRRRR',1],['R-03','ERRRR',1],['R-06','RRR',4]].forEach(function(t){
  var cl = pickN(cliRuta(t[0]), t[1].length);
  TRIPS.hoy.push({rutaId:t[0], patron:t[1], pedidos:nn(addPedidos(cl.map(function(c){return mkPedido(c,'En ruta',{creado:-ri(1,3),entrega:0,mult:t[2]});})))});
});
[['R-08','EEX',-2,4],['R-07','EEF',-1,3],['R-05','EEXE',-1,1]].forEach(function(t){
  var cl = pickN(cliRuta(t[0]), t[1].length);
  TRIPS.pasado.push({rutaId:t[0], patron:t[1], dd:t[2], pedidos:nn(addPedidos(cl.map(function(c){return mkPedido(c,'Entregado',{creado:t[2]-ri(2,3),entrega:t[2],mult:t[3]});})))});
});
TRIPS.cargando = {rutaId:'R-05', pedidos:nn(addPedidos(pickN(cliRuta('R-05'),5).map(function(c){return mkPedido(c,'Planificado',{creado:-ri(1,3),entrega:0});})))};
/* candidatos al plan del día (ordenados de menor a mayor flexibilidad de vehículo) */
var CAND_ESTADO = ['Listo para despacho','En preparación','En firme'];
[['R-04',3,1],['R-03',3,0.8],['R-05',2,0.45],['R-02',3,2.4],['R-07',3,4],['R-08',3,4.5]].forEach(function(t){
  var cl = pickN(cliRuta(t[0]),t[1]);
  var g = cl.map(function(c,i){return mkPedido(c,CAND_ESTADO[i%3],{creado:-ri(1,2),entrega:ri(0,1),mult:t[2]});});
  addPedidos(g); TRIPS.plan.push({rutaId:t[0], pedidos:g});
});
/* resto de la cartera */
var RESTO = [['Recibido',8],['Stock validado',5],['Bloqueado por stock',5]];
RESTO.forEach(function(x){for(var i=0;i<x[1];i++)addPedidos([mkPedido(pick(clientes),x[0],{creado:x[0]==='Recibido'?-ri(0,1):-ri(1,2),entrega:ri(1,5)})]);});
for(var i=0;i<3;i++)addPedidos([mkPedido(pick(clientes),'En firme',{creado:-ri(0,2),entrega:ri(1,3)})]);
pedidos.sort(function(a,b){return a.fecha<b.fecha?1:-1;});
var pedById = {}; pedidos.forEach(function(p){pedById[p.pedidoId]=p;});
function pesoVol(list){return {kg:round(list.reduce(function(s,p){return s+p.pesoKg;},0),1), m3:round(list.reduce(function(s,p){return s+p.volumenM3;},0),2)};}

/* ---------- despachos, paradas, trazados y posiciones ---------- */
var usedVeh = {};
function fit(kg, m3, ruta, soft){
  var c = vehiculos.filter(function(v){return v.estado!=='Mantenimiento'&&!usedVeh[v.placa]&&kg<=v.pesoMaxKg*0.97&&m3<=v.volumenMaxM3*0.97&&v.rutasCobertura.indexOf(ruta)>=0;})
    .sort(function(a,b){return a.pesoMaxKg-b.pesoMaxKg;});
  if(!c.length) return null;
  var v = soft&&c.length>1&&c[1].pesoMaxKg<c[0].pesoMaxKg*1.6&&rnd()<0.45?c[1]:c[0]; usedVeh[v.placa]=1; return v;
}
function speedFor(rid){var z=rutaById[rid].zona;return z==='Manizales'?22:36;}
function lerpPts(pts,f){var x=f*(pts.length-1),i=Math.min(pts.length-2,Math.floor(x)),t=x-i;return [round(pts[i][0]+(pts[i+1][0]-pts[i][0])*t,5),round(pts[i][1]+(pts[i+1][1]-pts[i][1])*t,5)];}
var despachos = [], paradas = [], polilineas = {}, posiciones = [], evidencias = [], novedades = [], dspNum = 10;
var NOVSEQ = 0;
var MOT_FALLIDA = ['Cliente ausente','Dirección errada','Obra cerrada o sin recibo autorizado','Sin autorización de recibo'];
var MOT_PARCIAL = ['Producto averiado en tránsito','Faltante en cargue','Rechazo por calidad','Cliente reduce cantidad'];
var RECEPTORES = ['Almacenista','Maestro de obra','Residente','Portero','Administrador'];
function iso(ms){return new Date(ms).toISOString();}
function buildTrip(trip, kind){
  var ped = trip.pedidos, pv = pesoVol(ped), did = 'DSP-'+YYMM+'-'+pad(++dspNum,3), spd = speedFor(trip.rutaId);
  var v = fit(pv.kg, pv.m3, trip.rutaId, false) || (function(){var c=vehiculos.filter(function(x){return x.estado!=='Mantenimiento'&&x.rutasCobertura.indexOf(trip.rutaId)>=0;}).sort(function(a,b){return b.pesoMaxKg-a.pesoMaxKg;})[0];usedVeh[c.placa]=1;return c;})();
  var legs = [], legPts = [], prev = ORIG, km = 0, pat = trip.patron||'', k = pat.replace(/R/g,'').length, nowMs = NOW.getTime();
  var desc = ped.map(function(p){return cliById[p.clienteId].descargueMin;}), poly = [ORIG.slice()];
  ped.forEach(function(p){var c=cliById[p.clienteId],q=[c.latitud,c.longitud],d=hav(prev,q)*1.35;legs.push({km:d,min:Math.max(8,Math.round(d/spd*60))});km+=d;
    var seg=[prev].concat(curve(prev,q,5,0.012),[q]);legPts.push(seg);seg.slice(1).forEach(function(x){poly.push(x);});prev=q;});
  km += hav(prev,ORIG)*1.35; curve(prev,ORIG,5,0.012).forEach(function(x){poly.push(x);}); poly.push(ORIG.slice());
  var arr = [], dep = [], salida;
  if(kind==='pasado'){salida = new Date(at(trip.dd,ri(6,8),ri(0,50))).getTime(); }
  else if(kind==='cargando'){salida = new Date(ahora(ri(45,80))).getTime();}
  if(kind==='hoy'){
    if(k>0){arr[k-1]=nowMs-(desc[k-1]+ri(8,30))*60000;dep[k-1]=arr[k-1]+desc[k-1]*60000;for(var i=k-2;i>=0;i--){arr[i]=arr[i+1]-(legs[i+1].min+desc[i])*60000;dep[i]=arr[i]+desc[i]*60000;}}
    var pd = k>0?dep[k-1]:null;
    arr[k] = pd!=null?pd+legs[k].min*60000:nowMs+ri(12,35)*60000;
    if(trip.enSitio) arr[k]=nowMs-6*60000; else if(arr[k]<=nowMs+5*60000) arr[k]=nowMs+ri(8,25)*60000;
    dep[k]=arr[k]+desc[k]*60000;
    for(var j=k+1;j<ped.length;j++){arr[j]=dep[j-1]+legs[j].min*60000;dep[j]=arr[j]+desc[j]*60000;}
    salida = (k>0?arr[0]-legs[0].min*60000:Math.min(arr[0]-legs[0].min*60000,nowMs-ri(25,45)*60000));
    if(k===0 && arr[0]-legs[0].min*60000>salida){ arr[0]=salida+legs[0].min*60000; dep[0]=arr[0]+desc[0]*60000; for(var j2=1;j2<ped.length;j2++){arr[j2]=dep[j2-1]+legs[j2].min*60000;dep[j2]=arr[j2]+desc[j2]*60000;} }
  } else {
    var t0 = salida; ped.forEach(function(p,i){arr[i]=t0+legs[i].min*60000;dep[i]=arr[i]+desc[i]*60000;t0=dep[i];});
  }
  var estadoDsp = kind==='hoy'?'En ruta':kind==='cargando'?'Cargando':'Cerrado';
  var ents = 0, posInfo = null;
  ped.forEach(function(p,i){
    var c = cliById[p.clienteId], ch = kind==='pasado'||kind==='hoy'?pat.charAt(i):'P', pid = 'PRD-'+did.slice(4)+'-'+(i+1), est, pest;
    if(ch==='E'){est='Entregada';pest='Entregado';} else if(ch==='X'){est='Parcial';pest='Entrega parcial';} else if(ch==='F'){est='Fallida';pest='Fallido';}
    else if(kind==='hoy'){ est = i===k?(trip.enSitio?'En sitio':'En camino'):'Pendiente'; pest='En ruta'; }
    else { est='Pendiente'; pest='Planificado'; }
    p.estado = pest; p.despachoId = did;
    var done = ch==='E'||ch==='X'||ch==='F';
    paradas.push({paradaId:pid, despachoId:did, rutaId:trip.rutaId, pedidoId:p.pedidoId, clienteId:c.clienteIdSAP, cliente:c.razonSocial, municipio:c.municipio==='Manizales'?c.localidad:c.municipio,
      secuencia:i+1, latitud:c.latitud, longitud:c.longitud, eta:iso(arr[i]), estado:est, horaEvento:done?iso(dep[i]):(est==='En sitio'?iso(arr[i]):null), descargueMin:desc[i],
      ventana:c.ventanaInicio+'–'+c.ventanaFin, observacion:''});
    var par = paradas[paradas.length-1];
    /* cantidades entregadas y novedades */
    p.lineas.forEach(function(l,li){l.cantidadEntregada = ch==='E'?l.cantidad:(ch==='F'?0:(ch==='X'?(li===0?Math.max(1,Math.floor(l.cantidad*rf(0.55,0.85))):l.cantidad):null));});
    if(done){ ents++; 
      var rec = pick(NOM1)+' '+pick(APE), nEv = ch==='F'?1:ri(2,3), base = dep[i];
      var tipos = ch==='F'?['Foto de novedad']:['Foto de entrega','Firma del receptor','Remisión firmada'].slice(0,nEv);
      tipos.forEach(function(t,ti){evidencias.push({evidenciaId:'EVD-'+pad(evidencias.length+1,5), pedidoId:p.pedidoId, paradaId:pid, despachoId:did, tipo:t, archivo:'evidencias/'+p.pedidoId+'-'+(ti+1)+(t==='Firma del receptor'?'.png':'.jpg'),
        firma:t==='Firma del receptor'?rec+' · '+pick(RECEPTORES):null, fechaHora:iso(base-(3-ti)*60000), latitud:round(c.latitud+rf(-0.0004,0.0004,5),5), longitud:round(c.longitud+rf(-0.0004,0.0004,5),5), autorId:v.conductorId,
        validacion:rnd()<0.9?'Validada':'Pendiente', precisionM:ri(4,18)});});
      if(ch==='X'||ch==='F'){
        var mot = ch==='F'?pick(MOT_FALLIDA):pick(MOT_PARCIAL), l0=p.lineas[0], dv = ch==='X'?l0.cantidad-l0.cantidadEntregada:null;
        par.observacion = mot;
        novedades.push({novedadId:'NOV-'+YYMM+'-'+pad(++NOVSEQ,3), tipo:ch==='F'?'Entrega fallida':'Entrega parcial', pedidoId:p.pedidoId, paradaId:pid, despachoId:did, clienteId:c.clienteIdSAP, motivo:mot,
          sku:ch==='X'?l0.sku:null, cantidadAfectada:ch==='X'?dv:null, unidad:ch==='X'?l0.unidad:null, estado:null, responsable:null, accion:null, fechaHora:iso(dep[i]), reportadoPor:v.conductorId,
          retorno:ch==='X'&&/averiado|calidad|Faltante/.test(mot)?{estado:rnd()<0.5?'Recibido en CEDI':'En tránsito a CEDI',bodegaId:CEDI}:null,
          reintento:ch==='F'?{programado:ymd(1),estado:'Programado'}:null, notaCreditoCOP:ch==='X'?Math.round(dv*l0.pesoKg/l0.cantidad*4100/1000)*1000:0, observaciones:'Registrado desde la app del conductor.'});
      }
    }
  });
  var kmPlan = round(km,1), nIdx = k;
  var dsp = {despachoId:did, fecha:ymd(kind==='pasado'?trip.dd:0), pedidoIds:ped.map(function(p){return p.pedidoId;}), rutaId:trip.rutaId, vehiculoId:v.placa, conductorId:v.conductorId,
    fechaSalida:kind==='cargando'?null:iso(salida), salidaPrevista:iso(salida), estado:estadoDsp, pesoKg:pv.kg, volumenM3:pv.m3, utilizacionPesoPct:Math.round(pv.kg/v.pesoMaxKg*100), utilizacionVolPct:Math.round(pv.m3/v.volumenMaxM3*100),
    paradas:ped.length, entregadas:ents, kmEstimados:kmPlan, creadoPor:'USR-014', sedeId:CEDI, fechaCierre:kind==='pasado'?iso(dep[ped.length-1]+ri(20,45)*60000):null,
    cargue:kind==='cargando'?{avancePct:ri(45,70),operarios:3,muelle:'M-0'+ri(1,4)}:null};
  despachos.push(dsp); polilineas[did] = poly;
  if(kind==='hoy'){
    v.estado='En ruta'; var cd = conductores.find(function(c){return c.conductorId===v.conductorId;}); cd.estado='En ruta';
    var pos, from = k>0?dep[k-1]:salida, f = Math.max(0.05,Math.min(0.95,(nowMs-from)/Math.max(1,arr[k]-from)));
    pos = trip.enSitio?[cliById[ped[k].clienteId].latitud,cliById[ped[k].clienteId].longitud]:lerpPts(legPts[k],f);
    posiciones.push({placa:v.placa, despachoId:did, rutaId:trip.rutaId, conductorId:v.conductorId, lat:pos[0], lng:pos[1], velocidadKmh:trip.enSitio?0:ri(26,64), rumbo:ri(0,359), ultimaSenal:ahora(-ri(0,3)), estado:trip.enSitio?'Descargando':'En ruta', proximaParadaId:paradas.filter(function(x){return x.despachoId===did&&x.secuencia===k+1;})[0].paradaId, bateriaPct:ri(35,98)});
  }
  if(kind==='cargando'){ v.estado='Cargando'; conductores.find(function(c){return c.conductorId===v.conductorId;}).estado='Cargando'; }
  trip.despachoId = did; trip.vehiculo = v;
  return dsp;
}
/* orden: pasados primero (numeración 011-013), luego hoy (014-018), luego cargando (019) */
var _usedBackup;
TRIPS.pasado.forEach(function(t){ var snap = JSON.parse(JSON.stringify(usedVeh)); buildTrip(t,'pasado'); usedVeh = snap; });
TRIPS.hoy[3].enSitio = true;
TRIPS.hoy.forEach(function(t){buildTrip(t,'hoy');});
buildTrip(TRIPS.cargando,'cargando');
vehiculos.forEach(function(v){ if(!posiciones.some(function(p){return p.placa===v.placa;})){
  var mt = v.estado==='Mantenimiento';
  posiciones.push({placa:v.placa, despachoId:null, rutaId:null, conductorId:v.conductorId, lat:mt?5.0470:round(ORIG[0]+rf(-0.0012,0.0012,5),5), lng:mt?-75.4400:round(ORIG[1]+rf(-0.0012,0.0012,5),5), velocidadKmh:0, rumbo:0, ultimaSenal:ahora(-ri(1,6)), estado:mt?'En taller':(v.estado==='Cargando'?'En muelle':'En patio'), proximaParadaId:null, bateriaPct:ri(40,99)});
}});
conductores.forEach(function(c){ if(c.estado==='Disponible'&&rnd()<0.12) c.estado='Descanso'; });
/* estados de novedad */
var EST_NOV = ['Abierta','En gestión','Resuelta','Cerrada'], RESP_NOV = ['Andrés Felipe Mejía','Jaime Eduardo Lozano','Laura Restrepo','Julián David Ospina'];
novedades.forEach(function(n,i){ var past = new Date(n.fechaHora)<HOY; n.estado = past?pick(['En gestión','Resuelta','Cerrada']):pick(['Abierta','Abierta','En gestión']); n.responsable=pick(RESP_NOV);
  n.accion = n.tipo==='Entrega fallida'?'Reprogramar entrega y contactar al cliente':(n.retorno?'Recibir mercancía en CEDI y emitir nota crédito':'Ajustar factura por cantidad entregada'); });
/* novedades adicionales (otros orígenes) */
var otrosPed = pedidos.filter(function(p){return ['Entregado'].indexOf(p.estado)>=0;});
[['Devolución total','Cliente rechaza por referencia equivocada'],['Producto averiado en cargue','Lámina con oxidación superficial'],['Restricción de acceso','Cierre vial en la Av. Kevin Ángel por obra'],['Falla de vehículo','Falla de embrague en la vía a Chinchiná'],['Pedido modificado en origen','Easy Sales cambió cantidad de línea 2'],['Entrega fallida','Cliente solicita aplazar por lluvia en obra'],['Devolución parcial','Sobrante de varilla 3/8" solicitado por la obra'],['Faltante en cargue','Se cargaron 18 de 20 láminas']].forEach(function(x,i){
  var p = pick(otrosPed), l = p.lineas[0], d = new Date(NOW.getTime()-ri(8,140)*3600000);
  novedades.push({novedadId:'NOV-'+YYMM+'-'+pad(++NOVSEQ,3), tipo:x[0], pedidoId:p.pedidoId, paradaId:null, despachoId:p.despachoId, clienteId:p.clienteId, motivo:x[1], sku:/Devolución|averiado|Faltante/.test(x[0])?l.sku:null,
    cantidadAfectada:/Devolución|averiado|Faltante/.test(x[0])?Math.max(1,Math.round(l.cantidad*0.15)):null, unidad:l.unidad, estado:pick(EST_NOV), responsable:pick(RESP_NOV), accion:'Seguimiento por el área responsable', fechaHora:iso(d.getTime()), reportadoPor:pick(['CND-002','CND-003','USR-014','USR-002']),
    retorno:/Devolución/.test(x[0])?{estado:pick(['Recibido en CEDI','En tránsito a CEDI','Pendiente de recogida']),bodegaId:CEDI}:null, reintento:null, notaCreditoCOP:/Devolución|averiado/.test(x[0])?ri(2,18)*100000:0, observaciones:'Registro manual desde la consola.'});
});
novedades.sort(function(a,b){return a.fechaHora<b.fechaHora?1:-1;});

/* ---------- reservas ---------- */
var reservas = [], rsvN = 0, SHORT = {};
var ACTIVAS = ['En firme','En preparación','Listo para despacho','Planificado'];
pedidos.slice().sort(function(a,b){return a.fecha<b.fecha?-1:1;}).forEach(function(p){
  if(p.estado==='Recibido') return;
  p.lineas.forEach(function(l,li){
    var s = p.estado==='Stock validado'?'Pendiente':p.estado==='Bloqueado por stock'?'Pendiente':ACTIVAS.indexOf(p.estado)>=0?'Activa':p.estado==='Fallido'?'Liberada':'Consumida';
    var r = {reservaId:'RSV-'+YYMM+'-'+pad(++rsvN,4), pedidoId:p.pedidoId, sku:l.sku, bodegaId:CEDI, cantidad:l.cantidad, unidad:l.unidad, estado:s, fechaCreacion:iso(new Date(p.fecha).getTime()+ri(5,70)*60000),
      usuarioId:rnd()<0.75?'Sistema':'USR-002', origen:'Automática', faltante:0, consumido:s==='Consumida'?(l.cantidadEntregada!=null?l.cantidadEntregada:l.cantidad):0, vence:s==='Activa'||s==='Pendiente'?iso(new Date(p.fecha).getTime()+72*3600000):null};
    if(r.usuarioId!=='Sistema') r.origen='Manual';
    if(p.estado==='Bloqueado por stock' && li===0){ r.estado='Sin stock'; SHORT[l.sku]=Math.max(0,Math.floor(l.cantidad*rf(0.15,0.6))); r.faltante=l.cantidad-SHORT[l.sku]; p.bloqueo={sku:l.sku,descripcion:l.descripcion,solicitado:l.cantidad,disponible:SHORT[l.sku],faltante:r.faltante}; }
    reservas.push(r);
  });
});
reservas.sort(function(a,b){return a.fechaCreacion<b.fechaCreacion?1:-1;});

/* ---------- stock por bodega ---------- */
var BASE = {Varilla:[900,6000],Malla:[180,900],Perfil:[150,1200],'Tubería':[150,1000],'Lámina':[60,420],Teja:[300,2500],Alambre:[80,420],Cemento:[600,3200]};
var ACT_RES = {}; reservas.forEach(function(r){ if(r.estado==='Activa') ACT_RES[r.sku]=(ACT_RES[r.sku]||0)+r.cantidad; });
productos.forEach(function(pr,pi){
  var b = BASE[pr.familia];
  sedes.forEach(function(s,si){
    if(si>4){ if(pi%3!==1){var q6=Math.round(b[0]*0.35*(1+(pi%4)*0.35)); pr.stock[s.id]={fisico:q6, reservado:0, disponible:q6, minimo:Math.round(b[0]*0.14), enTransito:pi%5===0?Math.round(b[0]*0.17):0};} return; }
    var esC = s.id===CEDI, esF = s.id===FUNZA, f = esC?1:esF?0.25:0.35;
    if(!esC && !esF && rnd()<0.4) return;
    var base = Math.round(ri(b[0],b[1])*f), res = esC?(ACT_RES[pr.skuSAP]||0):Math.round(base*rf(0,0.06,2));
    var disp = base;
    if(esC && SHORT[pr.skuSAP]!=null) disp = SHORT[pr.skuSAP];
    if(esC && (pi===6||pi===19||pi===33)) disp = Math.round(base*0.06);
    var fis = res + disp, min = Math.round(b[0]*f*0.4);
    pr.stock[s.id] = {fisico:fis, reservado:res, disponible:fis-res, minimo:min, enTransito:rnd()<0.3?Math.round(b[0]*f*0.5):0};
  });
});

/* ---------- ubicaciones WMS e inventario ---------- */
var ZCFG = {A:{nombre:'Largos y varilla',pas:3,niv:3,pos:4,cap:[10,18],fam:['Varilla']},B:{nombre:'Mallas y láminas',pas:2,niv:3,pos:4,cap:[8,14],fam:['Malla','Lámina']},
  C:{nombre:'Perfiles y tubería',pas:3,niv:3,pos:3,cap:[9,16],fam:['Perfil','Tubería']},D:{nombre:'Alambre y cubiertas',pas:2,niv:4,pos:3,cap:[6,12],fam:['Alambre','Teja']},E:{nombre:'Cemento y morteros',pas:2,niv:2,pos:5,cap:[8,14],fam:['Cemento']}};
function zonaDe(fam){var z='A';Object.keys(ZCFG).forEach(function(k){if(ZCFG[k].fam.indexOf(fam)>=0)z=k;});return z;}
var ubicaciones = [], ubById = {};
[CEDI,FUNZA].forEach(function(bod){
  Object.keys(ZCFG).forEach(function(z){ var c = ZCFG[z], np = bod===CEDI?c.pas:Math.max(1,Math.ceil(c.pas/2));
    for(var pa=1;pa<=np;pa++)for(var ni=1;ni<=c.niv;ni++)for(var po=1;po<=c.pos;po++){
      var id = z+'-'+pad(pa,2)+'-'+ni+'-'+pad(po,2);
      var u = {ubicacionId:id, bodegaId:bod, zona:z, zonaNombre:c.nombre, pasillo:pad(pa,2), rack:'R'+z+pad(pa,2), nivel:ni, posicion:pad(po,2), codigoQR:'QR-'+bod.split('-')[1]+'-'+id, capacidadM3:ri(c.cap[0],c.cap[1]), ocupacionM3:0, estado:'Disponible', tipo:ni===1?'Piso / estiba':'Rack', sku:null, ultimoConteo:null};
      ubicaciones.push(u); ubById[bod+'|'+id]=u;
    }});
});
var inventario = [];
productos.forEach(function(pr){
  [CEDI,FUNZA].forEach(function(bod){
    var st = pr.stock[bod]; if(!st||st.fisico<=0) return;
    var z = zonaDe(pr.familia), libres = shuffle(ubicaciones.filter(function(u){return u.bodegaId===bod&&u.zona===z&&!u.sku;}));
    var k = Math.min(libres.length, st.fisico>400?2:1+(rnd()<0.4?1:0)), rest = st.fisico, resRest = st.reservado;
    for(var i=0;i<k;i++){
      var q = i===k-1?rest:Math.round(rest*rf(0.4,0.65)), rs = Math.min(q, i===0?resRest:0); rest -= q; resRest -= rs;
      var u = libres[i]; u.sku = pr.skuSAP; u.ocupacionM3 = round(q*pr.volumenM3,2); u.estado='Ocupada';
      if(u.ocupacionM3>u.capacidadM3*0.95) u.capacidadM3 = Math.ceil(u.ocupacionM3*1.15);
      var cnt = rnd()<0.35?q+(rnd()<0.6?0:ri(-6,4)):null;
      u.ultimoConteo = cnt!=null?ymd(-ri(1,40)):null;
      inventario.push({bodegaId:bod, ubicacionId:u.ubicacionId, sku:pr.skuSAP, descripcion:pr.descripcion, stockFisico:q, stockReservado:rs, stockDisponible:q-rs, conteo:cnt, diferencia:cnt!=null?cnt-q:null, fechaConteo:u.ultimoConteo});
    }
  });
});
['A-02-3-01','B-01-2-02','C-02-1-03'].forEach(function(id,i){var u=ubById[CEDI+'|'+id]; if(u){u.estado=i===0?'Bloqueada':'En conteo';}});
/* conteos cíclicos */
var conteos = [], CN = 0, CAUSAS = ['Error de picking en preparación','Merma por manipulación','Diferencia de unidad de medida','Ubicación incorrecta','Pendiente de recibo no contabilizado','Sin causa identificada'];
var conFilas = inventario.filter(function(r){return r.bodegaId===CEDI;}); 
shuffle(conFilas).slice(0,12).forEach(function(r,i){
  var dif = i<5?0:ri(-9,6) || 2, est = i<3?'Programado':i<5?'En conteo':(i<9?'Con diferencia':(i<11?'Conciliado':'Ajustado'));
  var sist = r.stockFisico, cnt = est==='Programado'?null:sist+(est==='En conteo'?0:dif);
  conteos.push({conteoId:'CNT-'+YYMM+'-'+pad(++CN,3), bodegaId:r.bodegaId, ubicacionId:r.ubicacionId, sku:r.sku, descripcion:r.descripcion, stockSistema:sist, conteo:est==='En conteo'?null:cnt, diferencia:cnt==null||est==='En conteo'?null:cnt-sist,
    estado:est, fecha:ymd(est==='Programado'?ri(0,3):-ri(0,9)), operarioId:pick(operarios).operarioId, causaProbable:est==='Con diferencia'||est==='Ajustado'?pick(CAUSAS):null, tipo:pick(['Cíclico ABC','Cíclico por ubicación','Reconteo'])});
});

/* ---------- tareas de preparación ---------- */
var tareas = [], TN = 0;
function ubDe(sku){var r=inventario.filter(function(x){return x.bodegaId===CEDI&&x.sku===sku;})[0];return r?r.ubicacionId:'—';}
pedidos.filter(function(p){return ['En firme','En preparación','Listo para despacho','Planificado'].indexOf(p.estado)>=0;}).forEach(function(p){
  p.lineas.forEach(function(l,li){
    var est, tom;
    if(p.estado==='En firme'){est='Pendiente';tom=0;}
    else if(p.estado==='En preparación'){var x=(li+p.pedidoId.length)%3;est=x===0?'Completada':x===1?'En curso':'Pendiente';tom=est==='Completada'?l.cantidad:est==='En curso'?Math.floor(l.cantidad*rf(0.3,0.7)):0;}
    else {est='Certificada';tom=l.cantidad;}
    tareas.push({tareaId:'TP-'+pad(48200+(++TN),5), pedidoId:p.pedidoId, sku:l.sku, descripcion:l.descripcion, cantidadSolicitada:l.cantidad, cantidadTomada:tom, unidad:l.unidad, ubicacion:ubDe(l.sku), operarioId:est==='Pendiente'?null:pick(operarios.slice(0,4)).operarioId,
      estado:est, certificacion:est==='Certificada'?{certificado:true, por:'USR-005', fecha:iso(NOW.getTime()-ri(20,300)*60000)}:{certificado:false}, bodegaId:CEDI, prioridad:p.prioridad, muelle:'M-0'+((TN%4)+1)});
  });
});
/* historial de pedidos */
var USR_EST = {'Recibido':'Sistema','Stock validado':'Sistema','Bloqueado por stock':'Sistema','En firme':'USR-002','En preparación':'USR-005','Listo para despacho':'USR-005','Planificado':'USR-003','En ruta':'USR-014'};
pedidos.forEach(function(p){
  var chain; var i;
  if(p.estado==='Recibido') chain=['Recibido'];
  else if(p.estado==='Stock validado') chain=['Recibido','Stock validado'];
  else if(p.estado==='Bloqueado por stock') chain=['Recibido','Bloqueado por stock'];
  else { var ix = CADENA.indexOf(p.estado); if(p.estado==='Entrega parcial'||p.estado==='Fallido') chain=CADENA.slice(0,7).concat([p.estado]); else chain=CADENA.slice(0,ix+1); }
  var t0 = new Date(p.fecha).getTime(), end = NOW.getTime()-ri(5,25)*60000;
  var d = p.despachoId?despachos.filter(function(x){return x.despachoId===p.despachoId;})[0]:null;
  if(d && ['En ruta','Entregado','Entrega parcial','Fallido'].indexOf(p.estado)>=0){
    var pr = paradas.filter(function(x){return x.pedidoId===p.pedidoId;})[0];
    end = p.estado==='En ruta'?new Date(d.fechaSalida).getTime():new Date(pr.horaEvento).getTime();
  }
  if(end<=t0+chain.length*60000) end = t0+chain.length*600000;
  p.historial = chain.map(function(e,j){return {estado:e, fechaHora:iso(chain.length===1?t0:t0+(end-t0)*j/(chain.length-1)), usuarioId:USR_EST[e]||(p.estado==='Entregado'?'CND-001':'USR-014')};});
  if(p.estado==='En ruta'||p.estado==='Entregado'||p.estado==='Entrega parcial'||p.estado==='Fallido'){ p.historial[p.historial.length-1].usuarioId = d?d.conductorId:'USR-014'; }
});

/* ---------- plan del día ---------- */
var TARIFA = {Camioneta:1600,Turbo:2600,Sencillo:3400,Dobletroque:4600,Tractomula:6200};
var plan = {planId:'PLN-'+YYMM+'-'+pad(HOY.getDate(),2), fecha:ymd(0), estado:'Propuesta', generadoPor:'USR-003', generadoEn:ahora(-35), version:1, sedeId:CEDI,
  parametros:{corteHora:'15:00', consolidacionMin:90, ocupacionMinPct:70, ocupacionMaxPct:95, usarPicoPlaca:true, maxParadasPorViaje:8}, viajes:[], sinAsignar:[]};
TRIPS.plan.forEach(function(t,i){
  var sec = nn(t.pedidos), pv = pesoVol(t.pedidos), v = fit(pv.kg,pv.m3,t.rutaId,true);
  if(!v){ t.pedidos.forEach(function(p){plan.sinAsignar.push({pedidoId:p.pedidoId,rutaId:t.rutaId,motivo:'Sin vehículo disponible con capacidad suficiente'});}); return; }
  var km=0,prev=ORIG; sec.forEach(function(p){var c=cliById[p.clienteId],q=[c.latitud,c.longitud];km+=hav(prev,q)*1.35;prev=q;}); km+=hav(prev,ORIG)*1.35;
  var rt = rutaById[t.rutaId], peajes = rt.peajesCOP*2, salida = ahora(55+i*30), alertas = [];
  if(v.restricciones.picoPlacaCarga.aplicaHoy) alertas.push({nivel:'alerta',texto:'Pico y placa de carga hoy ('+v.restricciones.picoPlacaCarga.horario+'): ajustar la salida'});
  var np = t.pedidos.filter(function(p){return p.estado!=='Listo para despacho';}).length; if(np) alertas.push({nivel:'info',texto:np+' pedido'+(np>1?'s':'')+' sin cierre de preparación: salida condicionada'});
  if(v.requiereAyudante) alertas.push({nivel:'info',texto:'Requiere ayudante de cargue y descargue'});
  if(sec.some(function(p){return p.lineas.some(function(l){return prodById[l.sku].restricciones.indexOf('LARGA')>=0;});}) && !v.compatibilidad.largaMas6m) alertas.push({nivel:'peligro',texto:'Carga de longitud > 6 m incompatible con la carrocería'});
  plan.viajes.push({viajeId:'VJ-'+(plan.viajes.length+1), vehiculoId:v.placa, conductorId:v.conductorId, rutaId:t.rutaId, pedidoIds:sec.map(function(p){return p.pedidoId;}), paradas:sec.length, pesoKg:pv.kg, volumenM3:pv.m3,
    utilizacionPesoPct:Math.round(pv.kg/v.pesoMaxKg*100), utilizacionVolPct:Math.round(pv.m3/v.volumenMaxM3*100), salidaPrevista:salida, kmEstimados:round(km,1), peajesCOP:peajes,
    costoEstimadoCOP:Math.round((km*TARIFA[v.tipo]+peajes+(v.requiereAyudante?90000:0))/1000)*1000, alertas:alertas, estado:'Propuesto'});
});
plan.resumen = (function(){var vj=plan.viajes;return {viajes:vj.length, pedidos:vj.reduce(function(s,x){return s+x.pedidoIds.length;},0), pesoKg:round(vj.reduce(function(s,x){return s+x.pesoKg;},0),1), volumenM3:round(vj.reduce(function(s,x){return s+x.volumenM3;},0),1),
  utilizacionPromedioPct:vj.length?Math.round(vj.reduce(function(s,x){return s+x.utilizacionPesoPct;},0)/vj.length):0, kmTotal:round(vj.reduce(function(s,x){return s+x.kmEstimados;},0),1), costoTotalCOP:vj.reduce(function(s,x){return s+x.costoEstimadoCOP;},0), sinAsignar:plan.sinAsignar.length};})();

/* ---------- cargue (plano de camión) ---------- */
var cargue = [];
function cargueDe(refId, placa, peds, estadoFn){
  var v = vehByPlaca[placa], seq = peds.slice().reverse(), cum = 0;
  seq.forEach(function(p,i){ var ped = pedById[p]; var d0 = cum; cum += ped.volumenM3; var f0=d0/v.volumenMaxM3, f1=cum/v.volumenMaxM3, mid=(f0+f1)/2;
    cargue.push({cargueId:'CG-'+pad(cargue.length+1,4), despachoId:refId, vehiculoId:placa, pedidoId:p, pesoKg:ped.pesoKg, volumenM3:ped.volumenM3, ordenCargue:i+1, posicion:mid<0.33?'Frente':mid<0.66?'Centro':'Puerta', desdePct:round(Math.min(f0,1)*100,1), hastaPct:round(Math.min(f1,1)*100,1), paradaEntrega:peds.indexOf(p)+1, estado:estadoFn(i,seq.length)});});
}
despachos.filter(function(d){return d.estado!=='Cerrado';}).forEach(function(d){ cargueDe(d.despachoId,d.vehiculoId,d.pedidoIds,function(i,n){return d.estado==='En ruta'?'Cargado':(i<Math.ceil(n*0.6)?'Cargado':'Pendiente');}); });
plan.viajes.forEach(function(vj){ cargueDe(vj.viajeId,vj.vehiculoId,vj.pedidoIds,function(){return 'Pendiente';}); });

/* ---------- KPIs (30 días) ---------- */
var serie = [];
for (var di = 29; di >= 0; di--) {
  var dd = new Date(HOY); dd.setDate(dd.getDate()-di); var dow = dd.getDay(), fin = dow===0||dow===6;
  var n = fin?ri(4,10):ri(20,32), comp = round(Math.min(99.2, 95.2+Math.sin(di/4)*1.3+rf(-1.4,1.4)+(29-di)*0.02),1), att = round(Math.min(99, 93.4+Math.cos(di/3)*1.8+rf(-1.6,1.6)+(29-di)*0.05),1);
  var fal = fin?ri(0,1):ri(0,3), cargMin = Math.round(88-(29-di)*0.5+rf(-8,8,0)), nc = ri(0,3);
  serie.push({fecha:ymd(-di), despachados:n, completas:Math.round(n*comp/100), aTiempo:Math.round(n*att/100), completasPct:comp, aTiempoPct:att, otifPct:round(comp*att/100,1),
    kmPorEntrega:rf(14.2,19.6,1), kmPorTon:rf(5.4,8.9,1), utilizacionPesoPct:Math.round(rf(68,86,0)), utilizacionVolPct:Math.round(rf(50,70,0)), cargueMin:cargMin, descargueMin:Math.round(rf(29,43,0)), muertoMin:Math.round(rf(32,68,0)),
    fallidas:fal, fallidasPct:round(fal/n*100,1), notasCredito:nc, notasCreditoCOP:nc*ri(180,900)*1000, exactitudInvPct:rf(97.6,99.4,1)});
}
function avg(k,s){s=s||serie;return round(s.reduce(function(a,x){return a+x[k];},0)/s.length,1);}
function sum(k,s){s=s||serie;return s.reduce(function(a,x){return a+x[k];},0);}
var METAS = {otifPct:95,completasPct:97,aTiempoPct:96,kmPorEntrega:18,kmPorTon:7,utilizacionPesoPct:80,cargueMin:75,descargueMin:35,muertoMin:45,fallidasPct:3,exactitudInvPct:98.5};
var resumen = {}, mitad = serie.slice(0,15), mitad2 = serie.slice(15);
Object.keys(METAS).forEach(function(k){var a=avg(k,mitad2), b=avg(k,mitad); resumen[k]={valor:avg(k), meta:METAS[k], delta:round(a-b,1), serie:serie.map(function(x){return x[k];})};});
var CAUSAS_NC = [['Producto averiado en tránsito',0.27],['Faltante en cargue',0.19],['Error de facturación',0.17],['Rechazo por calidad',0.14],['Cliente ausente / rechazo de recibo',0.13],['Devolución comercial',0.10]];
var ncTotal = sum('notasCredito'), ncValor = sum('notasCreditoCOP');
var kpis = {periodoInicio:ymd(-29), periodoFin:ymd(0), sede:CEDI, serie:serie, metas:METAS, resumen:resumen,
  notasCreditoPorCausa:CAUSAS_NC.map(function(c){return {causa:c[0], n:Math.round(ncTotal*c[1]), valorCOP:Math.round(ncValor*c[1]/1000)*1000};}),
  definiciones:[
   {id:'otif',nombre:'OTIF (a tiempo y completo)',formula:'Entregas a tiempo y completas ÷ entregas programadas',numerador:Math.round(sum('despachados')*avg('otifPct')/100),denominador:sum('despachados'),unidad:'%',valor:avg('otifPct'),fuente:'Despachos + evidencias de entrega'},
   {id:'completas',nombre:'Entregas completas',formula:'Entregas con todas las líneas ÷ entregas realizadas',numerador:sum('completas'),denominador:sum('despachados'),unidad:'%',valor:avg('completasPct'),fuente:'Evidencias y novedades'},
   {id:'aTiempo',nombre:'Entregas a tiempo',formula:'Entregas dentro de la ventana horaria ÷ entregas realizadas',numerador:sum('aTiempo'),denominador:sum('despachados'),unidad:'%',valor:avg('aTiempoPct'),fuente:'ETA vs. hora de evento'},
   {id:'kmEntrega',nombre:'Kilómetros por entrega',formula:'Km recorridos ÷ entregas realizadas',numerador:Math.round(avg('kmPorEntrega')*sum('despachados')),denominador:sum('despachados'),unidad:'km',valor:avg('kmPorEntrega'),fuente:'GPS de vehículos'},
   {id:'kmTon',nombre:'Kilómetros por tonelada',formula:'Km recorridos ÷ toneladas entregadas',numerador:Math.round(avg('kmPorTon')*1480),denominador:1480,unidad:'km/t',valor:avg('kmPorTon'),fuente:'GPS + peso de despachos'},
   {id:'utilizacion',nombre:'Utilización de capacidad',formula:'Kg despachados ÷ capacidad nominal de los vehículos',numerador:Math.round(avg('utilizacionPesoPct')*3800),denominador:380000/100*100,unidad:'%',valor:avg('utilizacionPesoPct'),fuente:'Despachos + maestro de vehículos'},
   {id:'exactitud',nombre:'Exactitud de inventario',formula:'Ubicaciones sin diferencia ÷ ubicaciones contadas',numerador:Math.round(avg('exactitudInvPct')*12),denominador:1200/100,unidad:'%',valor:avg('exactitudInvPct'),fuente:'Conteos cíclicos'}
  ],
  porRuta:rutas.map(function(r){return {rutaId:r.rutaId, nombre:r.nombre, entregas:ri(90,420), otifPct:rf(88,97.5,1), kmPorEntrega:rf(6,31,1), utilizacionPct:ri(64,90), fallidasPct:rf(0.4,4.8,1), notasCredito:ri(0,9)};}),
  porVehiculo:vehiculos.map(function(v){return {placa:v.placa, tipo:v.tipo, viajes:ri(14,48), km:ri(1800,7600), utilizacionPct:ri(58,92), otifPct:rf(89,98,1), tiempoMuertoMin:ri(28,70)};})};

/* ---------- integraciones ---------- */
var conexiones = [
 {sistema:'SAP',nombre:'SAP ERP (on premises)',estado:'Operativa',ultimaSync:ahora(-8),frecuencia:'Cada 15 minutos',mecanismo:'Conector seguro (VPN) · BAPI/RFC',latenciaMs:420,colaPendiente:3,erroresHoy:2,version:'v2.4',entidades:['Materiales','Clientes','Existencias','Documentos de entrega'],proximaSync:ahora(7)},
 {sistema:'Data Lake',nombre:'Data Lake corporativo',estado:'Con alertas',ultimaSync:ahora(-52),frecuencia:'Cada hora',mecanismo:'API REST de lectura · carga incremental',latenciaMs:1180,colaPendiente:0,erroresHoy:5,version:'v3.1',entidades:['Clientes normalizados','Coordenadas','Atributos de producto'],proximaSync:ahora(8)},
 {sistema:'Easy Sales',nombre:'Easy Sales (pedidos)',estado:'Operativa',ultimaSync:ahora(-3),frecuencia:'En línea + conciliación cada 10 minutos',mecanismo:'Webhook de pedidos · API de consulta',latenciaMs:260,colaPendiente:1,erroresHoy:3,version:'v1.8',entidades:['Pedidos','Cambios de pedido'],proximaSync:ahora(6)}
];
var LOGT = {
 'SAP':[['Material',function(){return pick(productos).skuSAP;},['BAPI_MATERIAL_GET_DETAIL: material sin unidad de empaque (UMREZ) definida','Conversión KG→BAR sin factor de conversión en SAP','Material marcado para borrado en SAP (LVORM)']],
        ['Cliente',function(){return pick(clientes).clienteIdSAP;},['Cliente bloqueado por cartera en SAP (VBSK)','Timeout de RFC (30 s) en ZSD_CLIENTES_GET — reintento 2/5']],
        ['Existencias',function(){return pick(productos).skuSAP+'@'+CEDI;},['Bloqueo de registro en SAP (E_LOCK) — reintento 3/5']],
        ['Documento de entrega',function(){return '80'+ri(100000,999999);},['Entrega SAP sin pedido de venta asociado','Estado SAP no mapeado: '+pick(['C','D','E'])]]],
 'Data Lake':[['Cliente normalizado',function(){return pick(clientes).clienteIdSAP;},['Esquema v3: campo ventana_fin ausente','Dirección con calidad 0,42: requiere validación manual']],
        ['Coordenadas',function(){return pick(clientes).clienteIdSAP;},['Registro sin georreferencia (latitud/longitud nulas)','Coordenadas fuera del rango esperado para Caldas']],
        ['Atributos de producto',function(){return pick(productos).skuSAP;},['Peso por unidad inconsistente con SAP (desviación 12 %)','Dimensiones nulas en atributos de producto']]],
 'Easy Sales':[['Pedido',function(){return pick(pedidos).pedidoId;},['Cliente '+pick(clientes).clienteIdSAP+' sin correspondencia en el maestro','SKU 1009999 no existe en el catálogo SAP','Cambio de cantidad en origen (línea 2): conciliar con la reserva local']],
        ['Cambio de pedido',function(){return pick(pedidos).pedidoId;},['Pedido ya despachado: el cambio no se puede aplicar']]]
};
var logs = [];
for (var li = 0; li < 72; li++) {
  var sis = pick(['SAP','SAP','Data Lake','Easy Sales','Easy Sales']), t = pick(LOGT[sis]), r = rnd(), est = r<0.72?'Procesado':r<0.84?'Error':r<0.92?'Reintentando':r<0.97?'Duplicado ignorado':'Pendiente';
  var idx = t[1](), when = NOW.getTime()-ri(1,60*30)*60000;
  logs.push({logId:'LOG-'+pad(48200+li,6), sistemaOrigen:sis, entidad:t[0], idExterno:idx, fechaEvento:iso(when), payloadId:'PL-'+ri(0x100000,0xffffff).toString(16).toUpperCase(), version:sis==='SAP'?'v2.4':sis==='Data Lake'?'v3.1':'v1.8',
    estado:est, error:est==='Error'||est==='Reintentando'?pick(t[2]):(est==='Duplicado ignorado'?'Mensaje idempotente ya procesado ('+idx+')':null), correlacionId:'cor-'+ri(0x1000000,0xfffffff).toString(16), direccion:sis==='Easy Sales'||rnd()<0.8?'Entrada':'Salida', intentos:est==='Reintentando'?ri(2,4):(est==='Error'?5:1), duracionMs:ri(120,1900)});
}
logs.sort(function(a,b){return a.fechaEvento<b.fechaEvento?1:-1;});
var calidadDatos = {
  totalClientes:clientes.length, sinGeorreferencia:clientes.filter(function(c){return c.calidadDireccion==='Por validar';}).length, direccionAproximada:clientes.filter(function(c){return c.calidadDireccion==='Aproximada';}).length,
  productosSinDimensiones:2, productosPesoInconsistente:3, registrosRecibidos:ri(1800,2600), registrosRechazados:ri(14,40)
};

/* ---------- auditoría ---------- */
var AUD = [
 ['Inicio de sesión','Usuario','USR-'],['Cierre de sesión','Usuario','USR-'],['Acceso denegado','Usuario','USR-'],['Cambio de estado','Pedido','PED'],['Creación','Reserva','RSV'],['Liberación','Reserva','RSV'],
 ['Modificación','Cliente','CLI'],['Modificación','Vehículo','VEH'],['Aprobación','Despacho','DSP'],['Creación','Despacho','DSP'],['Modificación','Ruta','RUT'],['Cambio de permisos','Rol','ROL'],['Sincronización','Integración','INT'],['Exportación','Reporte','REP'],['Ajuste de inventario','Inventario','CNT']
];
var OBS = {'Inicio de sesión':'Acceso desde 190.24.x.x','Cierre de sesión':'Cierre manual','Acceso denegado':'Credenciales inválidas (intento 2 de 5)','Cambio de estado':'Cambio de estado automático por validación de stock','Creación':'Registro creado','Liberación':'Reserva liberada por entrega fallida',
  'Modificación':'Campo editado desde la consola','Aprobación':'Excepción aprobada por jefatura','Cambio de permisos':'Se otorgó permiso «gestionar» en un módulo','Sincronización':'Carga incremental completada','Exportación':'Exportación a hoja de cálculo','Ajuste de inventario':'Ajuste por conteo cíclico con diferencia'};
var auditoria = [];
for (var ai = 0; ai < 64; ai++) {
  var a = pick(AUD), u = pick(usuarios), refs = {Pedido:pick(pedidos).pedidoId,Reserva:'RSV-'+YYMM+'-'+pad(ri(1,rsvN),4),Cliente:pick(clientes).clienteIdSAP,'Vehículo':pick(vehiculos).placa,Despacho:pick(despachos).despachoId,Ruta:pick(rutas).rutaId,Rol:pick(roles).rolId,Usuario:u.usuarioId,'Integración':pick(logs).logId,Reporte:'REP-OTIF-'+ri(100,999),Inventario:pick(conteos).conteoId};
  var ent = refs[a[1]]; if (a[1]==='Inventario') ent = pick(conteos).conteoId;
  auditoria.push({registroId:'AUD-'+pad(96000+ai,6), entidadId:ent, entidad:a[1], tipo:a[0], estado:a[0]==='Acceso denegado'?'Rechazado':'Exitoso', fechaHora:iso(NOW.getTime()-ri(2,60*24*7)*60000), usuarioId:u.usuarioId, usuario:u.nombre,
    observaciones:OBS[a[0]], referenciaOrigen:pick(['Consola web','App conductor','Easy Sales','SAP','Proceso programado']), ip:'10.'+ri(10,40)+'.'+ri(0,200)+'.'+ri(2,250),
    antes:a[0]==='Modificación'?pick(['ventanaFin: 17:00','descargueMin: 30','restricciones: ninguna','estado: Activo']):null, despues:a[0]==='Modificación'?pick(['ventanaFin: 16:00','descargueMin: 45','restricciones: acceso máx. turbo','estado: Inactivo']):null});
}
auditoria.sort(function(a,b){return a.fechaHora<b.fechaHora?1:-1;});

/* ---------- notificaciones ---------- */
var bloq = pedidos.filter(function(p){return p.estado==='Bloqueado por stock';}), listos = pedidos.filter(function(p){return p.estado==='Listo para despacho';}), retr = paradas.filter(function(x){return x.estado==='En camino'||x.estado==='Pendiente';});
var errInt = logs.filter(function(l){return l.estado==='Error';})[0];
var notificaciones = [
 {notifId:'NTF-001',tipo:'Pedido bloqueado por stock',severidad:'peligro',titulo:'Pedido '+bloq[0].pedidoId+' bloqueado por stock',texto:'Faltan '+bloq[0].bloqueo.faltante+' '+bloq[0].lineas[0].unidad.toLowerCase()+'s de '+bloq[0].bloqueo.descripcion+'.',fechaHora:ahora(-12),leida:false,ref:{tipo:'pedido',id:bloq[0].pedidoId},destino:'pedidos.html'},
 {notifId:'NTF-002',tipo:'Retraso de entrega',severidad:'alerta',titulo:'Retraso probable en '+despachos[3].despachoId,texto:'La próxima parada supera la ventana del cliente por 18 minutos.',fechaHora:ahora(-25),leida:false,ref:{tipo:'despacho',id:despachos[3].despachoId},destino:'seguimiento.html'},
 {notifId:'NTF-003',tipo:'Error de integración',severidad:'peligro',titulo:'Error de integración con '+errInt.sistemaOrigen,texto:errInt.error,fechaHora:errInt.fechaEvento,leida:false,ref:{tipo:'log',id:errInt.logId},destino:'integraciones.html'},
 {notifId:'NTF-004',tipo:'Pedido listo para despacho',severidad:'exito',titulo:'Pedido '+listos[0].pedidoId+' listo para despacho',texto:'Preparación certificada por el Jefe de bodega.',fechaHora:ahora(-41),leida:false,ref:{tipo:'pedido',id:listos[0].pedidoId},destino:'pedidos.html'},
 {notifId:'NTF-005',tipo:'Vehículo no apto',severidad:'alerta',titulo:'Vehículo UFR 264 con pico y placa hoy',texto:'No debe circular en Manizales entre 16:00 y 19:00.',fechaHora:ahora(-70),leida:true,ref:{tipo:'vehiculo',id:'UFR 264'},destino:'vehiculos.html'},
 {notifId:'NTF-006',tipo:'Preparación sin cerrar',severidad:'alerta',titulo:'6 pedidos con preparación sin cerrar',texto:'El corte de las 15:00 se acerca. Revisa los pedidos en preparación.',fechaHora:ahora(-95),leida:true,ref:{tipo:'preparacion',id:null},destino:'preparacion.html'},
 {notifId:'NTF-007',tipo:'Entrega fallida',severidad:'peligro',titulo:'Entrega fallida en '+(novedades.filter(function(n){return n.tipo==='Entrega fallida';})[0]||{}).pedidoId,texto:'Motivo: '+(novedades.filter(function(n){return n.tipo==='Entrega fallida';})[0]||{}).motivo+'.',fechaHora:ahora(-130),leida:true,ref:{tipo:'novedad',id:null},destino:'novedades.html'},
 {notifId:'NTF-008',tipo:'Cierre de despacho',severidad:'exito',titulo:'Despacho '+despachos[0].despachoId+' cerrado',texto:'Todas las entregas fueron confirmadas con evidencia.',fechaHora:ahora(-60*20),leida:true,ref:{tipo:'despacho',id:despachos[0].despachoId},destino:'despachos.html'},
 {notifId:'NTF-009',tipo:'Conteo con diferencia',severidad:'info',titulo:'Conteo cíclico con diferencia en '+conteos[6].ubicacionId,texto:'Diferencia de '+conteos[6].diferencia+' unidades contra el sistema.',fechaHora:ahora(-60*26),leida:true,ref:{tipo:'conteo',id:conteos[6].conteoId},destino:'inventario.html'},
 {notifId:'NTF-010',tipo:'Calidad de datos',severidad:'info',titulo:calidadDatos.sinGeorreferencia+' clientes sin georreferencia',texto:'El Data Lake no entregó coordenadas válidas en la última carga.',fechaHora:ahora(-60*30),leida:true,ref:{tipo:'cliente',id:null},destino:'integraciones.html'}
];
var reglasNotificacion = [
 {reglaId:'RN-01',evento:'Pedido listo para despacho',huId:'ARM-HU-236',canales:['App','Correo'],destinatarios:['Despachador','Coordinador logístico'],activo:true,umbral:null},
 {reglaId:'RN-02',evento:'Vehículo no apto para la ruta',huId:'ARM-HU-237',canales:['App'],destinatarios:['Planificador logístico','Despachador'],activo:true,umbral:null},
 {reglaId:'RN-03',evento:'Preparación de pedidos sin cerrar',huId:'ARM-HU-238',canales:['App','Correo'],destinatarios:['Jefe de bodega'],activo:true,umbral:'60 min antes del corte'},
 {reglaId:'RN-04',evento:'Retraso de entrega',huId:'ARM-HU-239',canales:['App','SMS'],destinatarios:['Coordinador logístico','Asesor comercial'],activo:true,umbral:'> 15 min sobre la ventana'},
 {reglaId:'RN-05',evento:'Error de integración',huId:'ARM-HU-240',canales:['App','Correo'],destinatarios:['Arquitecto de integración','Ingeniero de datos'],activo:true,umbral:'3 fallos consecutivos'},
 {reglaId:'RN-06',evento:'Pedido bloqueado por stock',huId:'ARM-HU-241',canales:['App','Correo'],destinatarios:['Jefe de logística','Asesor comercial'],activo:true,umbral:null},
 {reglaId:'RN-07',evento:'Entrega fallida o parcial',huId:'ARM-HU-227',canales:['App','Correo'],destinatarios:['Coordinador logístico','Asesor comercial'],activo:true,umbral:null},
 {reglaId:'RN-08',evento:'Conteo con diferencia',huId:'ARM-HU-241',canales:['App'],destinatarios:['Analista de inventarios','Jefe de bodega'],activo:false,umbral:'Diferencia > 2 %'}
];
var motorRutas = {parametros:{algoritmo:'Vecino más cercano + mejora 2-opt', restricciones:['Ventana horaria del cliente','Capacidad en kg y m³','Pico y placa de carga','Longitud > 6 m','Máx. 8 paradas por viaje'], objetivo:'Minimizar km y respetar ventanas', proveedorMapas:'Por definir (ver pregunta 10)'},
  corridas:[0,1,2,3,4,5].map(function(i){var kmA=rf(260,520,0),sv=rf(6,17,1);return {corridaId:'MR-'+YYMM+'-'+pad(40-i,3), fecha:ahora(-60*(i*7+2)), planId:i===0?plan.planId:'PLN-'+YYMM+'-'+pad(Math.max(1,HOY.getDate()-i),2), viajes:ri(5,8), paradas:ri(24,46), kmSinOptimizar:kmA, kmOptimizado:round(kmA*(1-sv/100),0), ahorroPct:sv, tiempoCalculoSeg:rf(1.2,6.5,1), estado:i===0?'Propuesta vigente':'Aplicada', usuarioId:'USR-003'};})};

/* ---------- módulos y historias de usuario (generado desde outline.txt) ---------- */
var modulos = [ 
{"numero": 1, "nombre": "Seguridad y Acceso", "procedencia": "Propuesta transversal", "pantalla": "index.html", "hu": [ { "id": "ARM-HU-001", "titulo": "Iniciar sesión con credenciales individuales" }, { "id": "ARM-HU-002", "titulo": "Cerrar sesión y revocar token de autenticación" }, { "id": "ARM-HU-003", "titulo": "Recuperar contraseña mediante enlace temporal" }, { "id": "ARM-HU-004", "titulo": "Bloquear acceso por intentos fallidos" }, { "id": "ARM-HU-005", "titulo": "Controlar expiración por inactividad" }, { "id": "ARM-HU-006", "titulo": "Registrar intentos de acceso" }, { "id": "ARM-HU-007", "titulo": "Restringir sesiones de usuarios inactivos" } ], "cantidadHU": 7 }, 
{"numero": 2, "nombre": "Administración de Usuarios", "procedencia": "Propuesta transversal", "pantalla": "usuarios.html", "hu": [ { "id": "ARM-HU-008", "titulo": "Crear usuario con datos de identificación" }, { "id": "ARM-HU-009", "titulo": "Editar datos de usuario" }, { "id": "ARM-HU-010", "titulo": "Inactivar usuario sin borrar historial" }, { "id": "ARM-HU-011", "titulo": "Reactivar usuario autorizado" }, { "id": "ARM-HU-012", "titulo": "Asignar sede y bodega al usuario" }, { "id": "ARM-HU-013", "titulo": "Consultar y filtrar usuarios" }, { "id": "ARM-HU-014", "titulo": "Restablecer credenciales de usuario" } ], "cantidadHU": 7 }, 
{"numero": 3, "nombre": "Roles y Permisos", "procedencia": "Propuesta transversal", "pantalla": "usuarios.html", "hu": [ { "id": "ARM-HU-015", "titulo": "Crear perfil de acceso" }, { "id": "ARM-HU-016", "titulo": "Configurar permisos por módulo y acción" }, { "id": "ARM-HU-017", "titulo": "Asignar perfiles a usuarios" }, { "id": "ARM-HU-018", "titulo": "Revocar perfiles asignados" }, { "id": "ARM-HU-019", "titulo": "Restringir consulta por sede y bodega" }, { "id": "ARM-HU-020", "titulo": "Validar permisos en servicios API" }, { "id": "ARM-HU-021", "titulo": "Auditar modificaciones de permisos" } ], "cantidadHU": 7 }, 
{"numero": 4, "nombre": "Parametrización de Vehículos", "procedencia": "Fuente directa", "pantalla": "vehiculos.html", "hu": [ { "id": "ARM-HU-022", "titulo": "Registrar ficha técnica del vehículo" }, { "id": "ARM-HU-023", "titulo": "Editar capacidades de peso y volumen" }, { "id": "ARM-HU-024", "titulo": "Registrar dimensiones y ejes" }, { "id": "ARM-HU-025", "titulo": "Configurar carrocería y estibas" }, { "id": "ARM-HU-026", "titulo": "Asignar conductor a vehículo" }, { "id": "ARM-HU-027", "titulo": "Configurar cobertura geográfica" }, { "id": "ARM-HU-028", "titulo": "Registrar restricciones de circulación" }, { "id": "ARM-HU-029", "titulo": "Registrar compatibilidad con productos" }, { "id": "ARM-HU-030", "titulo": "Configurar requerimiento de ayudante" }, { "id": "ARM-HU-031", "titulo": "Consultar matriz vehículo restricción capacidad" } ], "cantidadHU": 10 }, 
{"numero": 5, "nombre": "Parametrización de Rutas", "procedencia": "Fuente directa", "pantalla": "rutas.html", "hu": [ { "id": "ARM-HU-032", "titulo": "Crear ruta poblacional" }, { "id": "ARM-HU-033", "titulo": "Asociar municipios a ruta" }, { "id": "ARM-HU-034", "titulo": "Definir secuencia de poblaciones" }, { "id": "ARM-HU-035", "titulo": "Registrar peajes por tramo" }, { "id": "ARM-HU-036", "titulo": "Registrar kilómetros por tramo" }, { "id": "ARM-HU-037", "titulo": "Configurar zonas de cobertura" }, { "id": "ARM-HU-038", "titulo": "Definir centro de distribución de salida" }, { "id": "ARM-HU-039", "titulo": "Editar e inactivar rutas parametrizadas" } ], "cantidadHU": 8 }, 
{"numero": 6, "nombre": "Maestro de Clientes", "procedencia": "Fuente directa", "pantalla": "clientes.html", "hu": [ { "id": "ARM-HU-040", "titulo": "Sincronizar cliente desde SAP y Data Lake" }, { "id": "ARM-HU-041", "titulo": "Completar datos logísticos faltantes" }, { "id": "ARM-HU-042", "titulo": "Registrar direcciones de entrega" }, { "id": "ARM-HU-043", "titulo": "Georreferenciar direcciones" }, { "id": "ARM-HU-044", "titulo": "Configurar zona barrio y municipio" }, { "id": "ARM-HU-045", "titulo": "Configurar ventanas horarias de atención" }, { "id": "ARM-HU-046", "titulo": "Registrar restricciones de acceso" }, { "id": "ARM-HU-047", "titulo": "Configurar frecuencia de entrega" }, { "id": "ARM-HU-048", "titulo": "Registrar tiempo promedio de descargue" }, { "id": "ARM-HU-049", "titulo": "Mantener contacto y observaciones" }, { "id": "ARM-HU-050", "titulo": "Consultar historial de entregas" }, { "id": "ARM-HU-051", "titulo": "Validar calidad de dirección antes de planear" } ], "cantidadHU": 12 }, 
{"numero": 7, "nombre": "Maestro de Productos", "procedencia": "Fuente directa", "pantalla": "productos.html", "hu": [ { "id": "ARM-HU-052", "titulo": "Importar SKU desde SAP y Data Lake" }, { "id": "ARM-HU-053", "titulo": "Consultar unidades de empaque" }, { "id": "ARM-HU-054", "titulo": "Registrar peso logístico por SKU" }, { "id": "ARM-HU-055", "titulo": "Registrar dimensiones y volumen" }, { "id": "ARM-HU-056", "titulo": "Configurar restricciones de manipulación" }, { "id": "ARM-HU-057", "titulo": "Definir compatibilidad de transporte" }, { "id": "ARM-HU-058", "titulo": "Controlar cambios de atributos logísticos" }, { "id": "ARM-HU-059", "titulo": "Consultar ficha logística del material" } ], "cantidadHU": 8 }, 
{"numero": 8, "nombre": "Gestión de Pedidos", "procedencia": "Fuente directa", "pantalla": "pedidos.html", "hu": [ { "id": "ARM-HU-060", "titulo": "Importar pedidos desde Easy Sales" }, { "id": "ARM-HU-061", "titulo": "Consultar pedidos pendientes de despacho" }, { "id": "ARM-HU-062", "titulo": "Buscar pedidos por cliente" }, { "id": "ARM-HU-063", "titulo": "Consultar detalle e ítems del pedido" }, { "id": "ARM-HU-064", "titulo": "Validar stock antes de confirmar pedido" }, { "id": "ARM-HU-065", "titulo": "Bloquear pedido con stock cero" }, { "id": "ARM-HU-066", "titulo": "Registrar prioridad comercial del pedido" }, { "id": "ARM-HU-067", "titulo": "Determinar pedido en firme" }, { "id": "ARM-HU-068", "titulo": "Notificar pedido listo a logística" }, { "id": "ARM-HU-069", "titulo": "Detectar actualización duplicada del pedido" } ], "cantidadHU": 10 }, 
{"numero": 9, "nombre": "Gestión de Reservas", "procedencia": "Fuente directa", "pantalla": "reservas.html", "hu": [ { "id": "ARM-HU-070", "titulo": "Consultar stock físico disponible" }, { "id": "ARM-HU-071", "titulo": "Calcular saldo disponible descontando reservas" }, { "id": "ARM-HU-072", "titulo": "Reservar unidades al confirmar pedido" }, { "id": "ARM-HU-073", "titulo": "Impedir reserva superior al disponible" }, { "id": "ARM-HU-074", "titulo": "Evitar doble reserva simultánea" }, { "id": "ARM-HU-075", "titulo": "Liberar reserva al cancelar pedido" }, { "id": "ARM-HU-076", "titulo": "Actualizar reserva al modificar cantidades" }, { "id": "ARM-HU-077", "titulo": "Consultar trazabilidad de reservas" }, { "id": "ARM-HU-078", "titulo": "Conciliar reservas con inventario" } ], "cantidadHU": 9 }, 
{"numero": 10, "nombre": "Planeación Logística", "procedencia": "Fuente directa", "pantalla": "planeacion.html", "hu": [ { "id": "ARM-HU-079", "titulo": "Visualizar tablero de pedidos del día" }, { "id": "ARM-HU-080", "titulo": "Filtrar pedidos por fecha de completitud" }, { "id": "ARM-HU-081", "titulo": "Consolidar peso y volumen pendientes" }, { "id": "ARM-HU-082", "titulo": "Consultar vehículos disponibles" }, { "id": "ARM-HU-083", "titulo": "Agrupar pedidos por zona" }, { "id": "ARM-HU-084", "titulo": "Seleccionar pedidos para ruta" }, { "id": "ARM-HU-085", "titulo": "Seleccionar vehículo para despacho" }, { "id": "ARM-HU-086", "titulo": "Seleccionar ruta poblacional" }, { "id": "ARM-HU-087", "titulo": "Establecer hora de corte de pedidos" }, { "id": "ARM-HU-088", "titulo": "Configurar ventana de consolidación" }, { "id": "ARM-HU-089", "titulo": "Generar propuesta de planificación diaria" }, { "id": "ARM-HU-090", "titulo": "Modificar manualmente la planeación" } ], "cantidadHU": 12 }, 
{"numero": 11, "nombre": "Motor de Rutas Lógicas", "procedencia": "Fuente directa", "pantalla": "motor-rutas.html", "hu": [ { "id": "ARM-HU-091", "titulo": "Georreferenciar paradas de entrega" }, { "id": "ARM-HU-092", "titulo": "Construir matriz de distancias" }, { "id": "ARM-HU-093", "titulo": "Estimar tiempos de recorrido" }, { "id": "ARM-HU-094", "titulo": "Respetar ventanas horarias de clientes" }, { "id": "ARM-HU-095", "titulo": "Excluir vehículos por capacidad" }, { "id": "ARM-HU-096", "titulo": "Excluir vehículos por restricciones" }, { "id": "ARM-HU-097", "titulo": "Ordenar entregas por prioridad" }, { "id": "ARM-HU-098", "titulo": "Optimizar secuencia de visitas" }, { "id": "ARM-HU-099", "titulo": "Minimizar kilómetros y tiempos muertos" }, { "id": "ARM-HU-100", "titulo": "Comparar alternativas de rutas" }, { "id": "ARM-HU-101", "titulo": "Reoptimizar rutas ante novedades" }, { "id": "ARM-HU-102", "titulo": "Guardar versión de ruta calculada" } ], "cantidadHU": 12 }, 
{"numero": 12, "nombre": "Optimización de Cargue", "procedencia": "Fuente directa", "pantalla": "cargue.html", "hu": [ { "id": "ARM-HU-103", "titulo": "Calcular peso total de carga" }, { "id": "ARM-HU-104", "titulo": "Calcular volumen total de carga" }, { "id": "ARM-HU-105", "titulo": "Verificar capacidad útil del vehículo" }, { "id": "ARM-HU-106", "titulo": "Calcular porcentaje de utilización" }, { "id": "ARM-HU-107", "titulo": "Generar secuencia inversa de cargue" }, { "id": "ARM-HU-108", "titulo": "Proponer distribución de pedidos por vehículo" }, { "id": "ARM-HU-109", "titulo": "Mostrar instrucciones de acomodación" }, { "id": "ARM-HU-110", "titulo": "Bloquear cargue incompatible" }, { "id": "ARM-HU-111", "titulo": "Registrar confirmación de cargue" }, { "id": "ARM-HU-112", "titulo": "Detectar pedido faltante al cierre de cargue" } ], "cantidadHU": 10 }, 
{"numero": 13, "nombre": "Gestión de Despachos", "procedencia": "Fuente directa", "pantalla": "despachos.html", "hu": [ { "id": "ARM-HU-113", "titulo": "Generar orden de despacho" }, { "id": "ARM-HU-114", "titulo": "Asociar ruta y vehículo a despacho" }, { "id": "ARM-HU-115", "titulo": "Validar pedidos habilitados para despacho" }, { "id": "ARM-HU-116", "titulo": "Registrar salida de vehículo" }, { "id": "ARM-HU-117", "titulo": "Consultar despacho por estado" }, { "id": "ARM-HU-118", "titulo": "Reprogramar despacho no ejecutado" }, { "id": "ARM-HU-119", "titulo": "Cerrar despacho con resultado" }, { "id": "ARM-HU-120", "titulo": "Evitar despacho duplicado" } ], "cantidadHU": 8 }, 
{"numero": 14, "nombre": "Seguimiento de Ruta", "procedencia": "Fuente directa", "pantalla": "seguimiento.html", "hu": [ { "id": "ARM-HU-121", "titulo": "Visualizar rutas en mapa" }, { "id": "ARM-HU-122", "titulo": "Consultar paradas y secuencia" }, { "id": "ARM-HU-123", "titulo": "Mostrar ETA por cliente" }, { "id": "ARM-HU-124", "titulo": "Registrar posición del vehículo" }, { "id": "ARM-HU-125", "titulo": "Identificar desviación de ruta" }, { "id": "ARM-HU-126", "titulo": "Consultar avance por parada" }, { "id": "ARM-HU-127", "titulo": "Alertar entregas fuera de ventana" }, { "id": "ARM-HU-128", "titulo": "Actualizar estado de entrega" }, { "id": "ARM-HU-129", "titulo": "Registrar reintentos de entrega" } ], "cantidadHU": 9 }, 
{"numero": 15, "nombre": "Aplicación de Conductores", "procedencia": "Fuente directa", "pantalla": "conductor.html", "hu": [ { "id": "ARM-HU-130", "titulo": "Consultar rutas asignadas" }, { "id": "ARM-HU-131", "titulo": "Consultar clientes y horarios" }, { "id": "ARM-HU-132", "titulo": "Ver instrucciones de entrega" }, { "id": "ARM-HU-133", "titulo": "Confirmar inicio de recorrido" }, { "id": "ARM-HU-134", "titulo": "Registrar llegada a cliente" }, { "id": "ARM-HU-135", "titulo": "Registrar inicio de descargue" }, { "id": "ARM-HU-136", "titulo": "Registrar final de descargue" }, { "id": "ARM-HU-137", "titulo": "Marcar entrega completa" }, { "id": "ARM-HU-138", "titulo": "Marcar entrega parcial" }, { "id": "ARM-HU-139", "titulo": "Registrar novedad en campo" }, { "id": "ARM-HU-140", "titulo": "Consultar ruta siguiente" } ], "cantidadHU": 11 }, 
{"numero": 16, "nombre": "Gestión de Evidencias", "procedencia": "Fuente directa", "pantalla": "evidencias.html", "hu": [ { "id": "ARM-HU-141", "titulo": "Adjuntar fotografía de entrega" }, { "id": "ARM-HU-142", "titulo": "Capturar firma del receptor" }, { "id": "ARM-HU-143", "titulo": "Registrar coordenadas de evidencia" }, { "id": "ARM-HU-144", "titulo": "Vincular evidencia a pedido y parada" }, { "id": "ARM-HU-145", "titulo": "Consultar evidencias por entrega" }, { "id": "ARM-HU-146", "titulo": "Validar evidencia obligatoria para cierre" }, { "id": "ARM-HU-147", "titulo": "Proteger evidencias de modificación" }, { "id": "ARM-HU-148", "titulo": "Consultar histórico de novedades" } ], "cantidadHU": 8 }, 
{"numero": 17, "nombre": "Reportes y indicadores clave de desempeño", "procedencia": "Fuente directa", "pantalla": "reportes.html", "hu": [ { "id": "ARM-HU-149", "titulo": "Calcular OTIF" }, { "id": "ARM-HU-150", "titulo": "Medir entregas completas" }, { "id": "ARM-HU-151", "titulo": "Medir entregas a tiempo" }, { "id": "ARM-HU-152", "titulo": "Calcular kilómetros por entrega" }, { "id": "ARM-HU-153", "titulo": "Calcular kilómetros por tonelada" }, { "id": "ARM-HU-154", "titulo": "Medir utilización de capacidad" }, { "id": "ARM-HU-155", "titulo": "Medir tiempo promedio de cargue" }, { "id": "ARM-HU-156", "titulo": "Medir tiempo de descargue" }, { "id": "ARM-HU-157", "titulo": "Medir tiempo muerto" }, { "id": "ARM-HU-158", "titulo": "Reportar entregas fallidas y reintentos" }, { "id": "ARM-HU-159", "titulo": "Reportar notas crédito por causa" }, { "id": "ARM-HU-160", "titulo": "Calcular exactitud del inventario" }, { "id": "ARM-HU-161", "titulo": "Exportar reportes filtrados" } ], "cantidadHU": 13 }, 
{"numero": 18, "nombre": "Panel de control logístico", "procedencia": "Fuente directa", "pantalla": "panel.html", "hu": [ { "id": "ARM-HU-162", "titulo": "Mostrar pedidos pendientes" }, { "id": "ARM-HU-163", "titulo": "Mostrar toneladas y metros cúbicos" }, { "id": "ARM-HU-164", "titulo": "Mostrar vehículos disponibles y requeridos" }, { "id": "ARM-HU-165", "titulo": "Mostrar utilización promedio" }, { "id": "ARM-HU-166", "titulo": "Mostrar mapa operativo por ruta" }, { "id": "ARM-HU-167", "titulo": "Filtrar indicadores por periodo" }, { "id": "ARM-HU-168", "titulo": "Consultar detalle desde tarjeta indicadores clave de desempeño" } ], "cantidadHU": 7 }, 
{"numero": 19, "nombre": "Integración SAP", "procedencia": "Fuente directa", "pantalla": "integraciones.html", "hu": [ { "id": "ARM-HU-169", "titulo": "Configurar conexión segura con SAP on premises" }, { "id": "ARM-HU-170", "titulo": "Consultar catálogo de materiales SAP" }, { "id": "ARM-HU-171", "titulo": "Consultar maestro de clientes SAP" }, { "id": "ARM-HU-172", "titulo": "Consultar existencias SAP" }, { "id": "ARM-HU-173", "titulo": "Conciliar identificadores de productos" }, { "id": "ARM-HU-174", "titulo": "Consultar estados de documentos SAP" }, { "id": "ARM-HU-175", "titulo": "Registrar bitácora de sincronización" }, { "id": "ARM-HU-176", "titulo": "Reintentar mensajes fallidos" }, { "id": "ARM-HU-177", "titulo": "Evitar duplicados de integración" } ], "cantidadHU": 9 }, 
{"numero": 20, "nombre": "Integración Data Lake", "procedencia": "Fuente directa", "pantalla": "integraciones.html", "hu": [ { "id": "ARM-HU-178", "titulo": "Consumir clientes normalizados del Data Lake" }, { "id": "ARM-HU-179", "titulo": "Consumir coordenadas normalizadas" }, { "id": "ARM-HU-180", "titulo": "Consumir atributos de productos" }, { "id": "ARM-HU-181", "titulo": "Validar integridad de registros recibidos" }, { "id": "ARM-HU-182", "titulo": "Detectar registros sin georreferencia" }, { "id": "ARM-HU-183", "titulo": "Registrar fecha y origen de sincronización" }, { "id": "ARM-HU-184", "titulo": "Gestionar errores de calidad de datos" } ], "cantidadHU": 7 }, 
{"numero": 21, "nombre": "Auditoría y Trazabilidad", "procedencia": "Fuente directa", "pantalla": "auditoria.html", "hu": [ { "id": "ARM-HU-185", "titulo": "Registrar altas y modificaciones" }, { "id": "ARM-HU-186", "titulo": "Registrar cambios de estado de pedidos" }, { "id": "ARM-HU-187", "titulo": "Auditar reservas y liberaciones" }, { "id": "ARM-HU-188", "titulo": "Auditar cambios manuales de ruta" }, { "id": "ARM-HU-189", "titulo": "Registrar operaciones de despacho" }, { "id": "ARM-HU-190", "titulo": "Consultar historial por entidad" }, { "id": "ARM-HU-191", "titulo": "Filtrar eventos por usuario y fecha" }, { "id": "ARM-HU-192", "titulo": "Restringir alteración de auditoría" } ], "cantidadHU": 8 }, 
{"numero": 22, "nombre": "Gestión de Bodegas WMS", "procedencia": "Fuente directa", "pantalla": "bodegas.html", "hu": [ { "id": "ARM-HU-193", "titulo": "Crear bodegas y áreas" }, { "id": "ARM-HU-194", "titulo": "Configurar layout de almacenamiento" }, { "id": "ARM-HU-195", "titulo": "Registrar capacidad volumétrica de posiciones" }, { "id": "ARM-HU-196", "titulo": "Crear ubicaciones codificadas" }, { "id": "ARM-HU-197", "titulo": "Generar etiquetas QR de ubicaciones" }, { "id": "ARM-HU-198", "titulo": "Asociar producto a ubicación" }, { "id": "ARM-HU-199", "titulo": "Consultar ubicación de SKU" }, { "id": "ARM-HU-200", "titulo": "Registrar movimientos entre ubicaciones" }, { "id": "ARM-HU-201", "titulo": "Bloquear ubicación no disponible" } ], "cantidadHU": 9 }, 
{"numero": 23, "nombre": "Recepción y Preparación de pedidos", "procedencia": "Fuente directa", "pantalla": "preparacion.html", "hu": [ { "id": "ARM-HU-202", "titulo": "Registrar recepción de mercancía" }, { "id": "ARM-HU-203", "titulo": "Validar material recibido contra referencia" }, { "id": "ARM-HU-204", "titulo": "Asignar ubicación a mercancía recibida" }, { "id": "ARM-HU-205", "titulo": "Generar tareas de preparación de pedidos por pedido" }, { "id": "ARM-HU-206", "titulo": "Agrupar preparación de pedidos por zona" }, { "id": "ARM-HU-207", "titulo": "Confirmar extracción de SKU" }, { "id": "ARM-HU-208", "titulo": "Detectar SKU equivocado en preparación de pedidos" }, { "id": "ARM-HU-209", "titulo": "Alertar tareas de preparación de pedidos abiertas" }, { "id": "ARM-HU-210", "titulo": "Certificar preparación de pedidos completo" }, { "id": "ARM-HU-211", "titulo": "Impedir facturación sin preparación de pedidos certificado" } ], "cantidadHU": 10 }, 
{"numero": 24, "nombre": "Inventario y Conteos Cíclicos", "procedencia": "Fuente directa", "pantalla": "inventario.html", "hu": [ { "id": "ARM-HU-212", "titulo": "Consultar stock físico por ubicación" }, { "id": "ARM-HU-213", "titulo": "Consultar diferencias físico versus sistema" }, { "id": "ARM-HU-214", "titulo": "Programar conteos cíclicos por SKU crítico" }, { "id": "ARM-HU-215", "titulo": "Registrar conteo físico" }, { "id": "ARM-HU-216", "titulo": "Identificar diferencias de inventario" }, { "id": "ARM-HU-217", "titulo": "Solicitar aprobación de ajuste" }, { "id": "ARM-HU-218", "titulo": "Registrar ajuste autorizado" }, { "id": "ARM-HU-219", "titulo": "Medir exactitud por SKU y bodega" }, { "id": "ARM-HU-220", "titulo": "Priorizar SKU con notas crédito" } ], "cantidadHU": 9 }, 
{"numero": 25, "nombre": "Gestión de Novedades y Devoluciones", "procedencia": "Fuente directa", "pantalla": "novedades.html", "hu": [ { "id": "ARM-HU-221", "titulo": "Registrar entrega fallida" }, { "id": "ARM-HU-222", "titulo": "Registrar entrega parcial" }, { "id": "ARM-HU-223", "titulo": "Clasificar motivo de devolución" }, { "id": "ARM-HU-224", "titulo": "Registrar mercancía retornada" }, { "id": "ARM-HU-225", "titulo": "Asociar retorno a pedido original" }, { "id": "ARM-HU-226", "titulo": "Gestionar reintento de entrega" }, { "id": "ARM-HU-227", "titulo": "Notificar incidencia a responsables" }, { "id": "ARM-HU-228", "titulo": "Consultar historial de novedades" } ], "cantidadHU": 8 }, 
{"numero": 26, "nombre": "Integración Easy Sales", "procedencia": "Fuente directa contextual", "pantalla": "integraciones.html", "hu": [ { "id": "ARM-HU-229", "titulo": "Recibir pedidos desde Easy Sales" }, { "id": "ARM-HU-230", "titulo": "Validar correspondencia de clientes" }, { "id": "ARM-HU-231", "titulo": "Validar SKU de pedidos importados" }, { "id": "ARM-HU-232", "titulo": "Evitar doble importación de pedidos" }, { "id": "ARM-HU-233", "titulo": "Registrar cambios de pedido de origen" }, { "id": "ARM-HU-234", "titulo": "Conciliar pedido con reserva local" }, { "id": "ARM-HU-235", "titulo": "Consultar errores de recepción de pedidos" } ], "cantidadHU": 7 }, 
{"numero": 27, "nombre": "Notificaciones Operativas", "procedencia": "Propuesta transversal", "pantalla": "notificaciones.html", "hu": [ { "id": "ARM-HU-236", "titulo": "Notificar pedido listo para despacho" }, { "id": "ARM-HU-237", "titulo": "Notificar vehículo no apto" }, { "id": "ARM-HU-238", "titulo": "Notificar preparación de pedidos sin cerrar" }, { "id": "ARM-HU-239", "titulo": "Notificar retraso de entrega" }, { "id": "ARM-HU-240", "titulo": "Notificar error de integración" }, { "id": "ARM-HU-241", "titulo": "Configurar destinatarios por evento" } ], "cantidadHU": 6 }
];

/* ---------- preguntas de definición pendientes ---------- */
var preguntas = [
 [1,'¿Cuál es el alcance exacto de la demo frente al sistema definitivo?','Define qué pantallas, reglas y datos se construyen primero y qué queda para fases posteriores.',[1,8,10,18],'Alcance y cronograma'],
 [2,'¿Qué campos son autoridad de SAP, del Data Lake y de Easy Sales, y cuál prevalece ante un conflicto?','Determina la fuente de verdad de clientes, productos, existencias y pedidos.',[6,7,19,20,26],'Integraciones y maestros'],
 [3,'¿Qué eventos permiten reservar, liberar y consumir stock?','Establece el ciclo de vida de la reserva y evita sobreventa o inventario inmovilizado.',[9,23,24],'Reservas'],
 [4,'¿Con qué frecuencia y mecanismo se sincroniza la información entre sistemas?','Elige entre cargas por lotes, webhooks o consultas programadas, y su tolerancia a retrasos.',[19,20,26],'Integraciones'],
 [5,'¿Cuáles son los estados y transiciones oficiales de pedido, preparación, cargue, despacho y entrega?','Fija la máquina de estados que gobierna todas las pantallas y los indicadores.',[8,12,13,14,23],'Procesos'],
 [6,'¿Qué roles aprueban las excepciones de stock, ruta y despacho?','Define los permisos de aprobación y los flujos de escalamiento.',[3,9,10,11,13],'Roles y permisos'],
 [7,'¿Cuál es el horario de corte y la ventana de consolidación por sede?','Determina hasta qué hora entra un pedido al plan del día siguiente o del mismo día.',[10,23],'Planeación'],
 [8,'¿Qué pesos, volúmenes, unidades de empaque y tolerancias se usan para planear la carga?','Afecta la ocupación del vehículo, el plano de cargue y las diferencias aceptables.',[7,12,24],'Maestro de productos'],
 [9,'¿Qué ciudades y restricciones de circulación se implementan primero?','Acota las reglas de pico y placa, tonelaje y horarios de descargue de la primera versión.',[4,5,11],'Restricciones'],
 [10,'¿Qué algoritmo y proveedor de mapas se usan, y cómo se mide el éxito de la ruta?','Condiciona costos, precisión de ETA y los criterios de aceptación del motor de rutas.',[11,14],'Motor de rutas'],
 [11,'¿Qué evidencia es obligatoria para una entrega completa, parcial o fallida?','Define fotos, firma, geolocalización y observaciones requeridas por cada resultado.',[15,16,25],'Evidencias'],
 [12,'¿Qué eventos se comunican a SAP y qué interfaz está disponible para hacerlo?','Establece qué se devuelve a SAP (entregas, devoluciones, ajustes) y por qué canal.',[13,19,25],'Integración SAP'],
 [13,'¿La integración con Easy Sales es en línea o solo de carga de pedidos?','Impacta la frescura de los pedidos, la conciliación de cambios y la arquitectura.',[8,26],'Integración Easy Sales'],
 [14,'¿Cuáles son las fórmulas y fuentes oficiales de cada indicador?','Garantiza que OTIF, km por entrega y utilización se calculen igual que en el negocio.',[17,18],'Indicadores'],
 [15,'¿Cuáles son los objetivos de desempeño, seguridad, retención y disponibilidad?','Fija los requisitos no funcionales: tiempos de respuesta, retención de evidencias y continuidad.',[1,2,3,21],'Requisitos no funcionales']
].map(function(q){return {n:q[0], pregunta:q[1], contexto:q[2], modulos:q[3], tema:q[4], estado:'Pendiente'};});

/* ---------- API de consulta ---------- */
var idx = {sedes:{},productos:prodById,clientes:cliById,vehiculos:vehByPlaca,conductores:{},usuarios:{},roles:{},rutas:rutaById,pedidos:pedById,despachos:{},paradas:{},ubicaciones:{}};
sedes.forEach(function(x){idx.sedes[x.id]=x;}); conductores.forEach(function(x){idx.conductores[x.conductorId]=x;}); usuarios.forEach(function(x){idx.usuarios[x.usuarioId]=x;}); roles.forEach(function(x){idx.roles[x.rolId]=x;});
despachos.forEach(function(x){idx.despachos[x.despachoId]=x;}); paradas.forEach(function(x){idx.paradas[x.paradaId]=x;});
var ESTADOS = {
  pedido:ESTADOS_PEDIDO, reserva:['Pendiente','Activa','Consumida','Liberada','Sin stock'], vehiculo:['Disponible','Cargando','En ruta','Mantenimiento','Inactivo'], despacho:['Cargando','En ruta','Cerrado'],
  parada:['Pendiente','En camino','En sitio','Entregada','Parcial','Fallida'], novedad:EST_NOV, tarea:['Pendiente','En curso','Completada','Certificada'], integracion:['Procesado','Pendiente','Reintentando','Error','Duplicado ignorado'],
  conteo:['Programado','En conteo','Con diferencia','Conciliado','Ajustado'], usuario:['Activo','Inactivo','Bloqueado'], prioridad:['Alta','Media','Baja']
};

window.ARM = {
  version:'demo-1', hoy:HOY, ahora:NOW, usuarioActual:usuarios[0], sedeActual:CEDI, ymd:ymd, at:at,
  sedes:sedes, productos:productos, restriccionesProducto:restriccionesProducto, clientes:clientes, vehiculos:vehiculos, conductores:conductores, usuarios:usuarios, roles:roles, modulosPermiso:modulosPermiso, operarios:operarios,
  rutas:rutas, pedidos:pedidos, reservas:reservas, plan:plan, despachos:despachos, paradas:paradas, polilineas:polilineas, posiciones:posiciones, evidencias:evidencias, novedades:novedades,
  tareas:tareas, ubicaciones:ubicaciones, inventario:inventario, conteos:conteos, cargue:cargue, motorRutas:motorRutas, kpis:kpis, conexiones:conexiones, logs:logs, calidadDatos:calidadDatos,
  auditoria:auditoria, notificaciones:notificaciones, reglasNotificacion:reglasNotificacion, motivos:{fallida:MOT_FALLIDA, parcial:MOT_PARCIAL, devolucion:['Producto averiado','Referencia equivocada','Rechazo por calidad','Sobrante de obra','Error de facturación','Cliente ausente']},
  estados:ESTADOS, modulos:modulos, preguntas:preguntas, idx:idx,
  get:function(col,id){return (idx[col]||{})[id]||null;}
};
})();

/* Coherencia de flota: un mismo vehículo no puede estar en ruta y en cargue a la vez.
   El despacho en ruta que compartía placa con el que está en cargue pasa a otro sencillo. */
(function () {
  var A = window.ARM; if (!A) return;
  var enCargue = A.despachos.filter(function (d) { return d.estado === 'Cargando'; })[0]; if (!enCargue) return;
  var dup = A.despachos.filter(function (d) { return d.estado === 'En ruta' && d.vehiculoId === enCargue.vehiculoId; })[0]; if (!dup) return;
  var viejo = dup.vehiculoId, usados = {};
  A.despachos.forEach(function (d) { if (d.estado !== 'Cerrado') usados[d.vehiculoId] = 1; });
  A.plan.viajes.forEach(function (v) { usados[v.vehiculoId] = 1; });
  var orig = A.idx.vehiculos[viejo];
  var nuevo = A.vehiculos.filter(function (v) { return !usados[v.placa] && v.tipo === orig.tipo; })[0]; if (!nuevo) return;
  dup.vehiculoId = nuevo.placa; dup.conductorId = nuevo.conductorId; nuevo.estado = 'En ruta';
  A.posiciones = A.posiciones.filter(function (p) { return p.placa !== nuevo.placa; });
  A.posiciones.forEach(function (p) { if (p.despachoId === dup.despachoId) { p.placa = nuevo.placa; p.conductorId = nuevo.conductorId; } });
  var base = A.sedes[0];
  A.posiciones.push({ placa: viejo, despachoId: null, rutaId: null, conductorId: orig.conductorId, lat: base.lat + 0.0006, lng: base.lng - 0.0005, velocidadKmh: 0, rumbo: 0, ultimaSenal: new Date(A.ahora).toISOString(), estado: 'En muelle', proximaParadaId: null, bateriaPct: 88 });
  (A.cargue || []).forEach(function (c) { if (c.despachoId === dup.despachoId) c.vehiculoId = nuevo.placa; });
  (A.evidencias || []).forEach(function (e) { if (e.despachoId === dup.despachoId && e.autorId === orig.conductorId) e.autorId = nuevo.conductorId; });
})();
