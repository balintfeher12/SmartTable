import { useState } from "react";
import "../styles/etlap.css";

const menu = {
  "Előételek": [
    { nev: "Bruschetta Trio", leiras: "Házi pesto, paradicsom, olívabogyó krémes sajt feltéttel", ar: 2800 },
    { nev: "Francia hagymaleves", leiras: "Karamellizált hagyma, gruyère sajt, pirított kenyérrel", ar: 3200 },
    { nev: "Burrata saláta", leiras: "Friss burrata, koktélparadicsom, bazsalikomos olaj", ar: 3900 },
    { nev: "Libamáj krém", leiras: "Sütőtökös lekvárral, briós pirítóssal", ar: 4200 },
  ],
  "Főételek": [
    { nev: "Ribeye steak", leiras: "300g érlelt marhahús, vajas burgonyapürével, szezonális zöldségekkel", ar: 8900 },
    { nev: "Sült lazac", leiras: "Citromos kapros mártással, spárgával, basmati rizzsel", ar: 7200 },
    { nev: "Kacsamell", leiras: "Narancsos-mézes mázzal, édesburgonyával, rukkolával", ar: 7800 },
    { nev: "Gombás risotto", leiras: "Porcini és shiitake gomba, parmezán, fekete szarvasgomba olaj", ar: 5900 },
    { nev: "Báránycsülök", leiras: "Rozmaringos vörösboros mártásban, polentával sütve", ar: 8400 },
    { nev: "Csirkemell Wellington", leiras: "Gombás duxelles-szel, leveles tésztában sütve", ar: 6800 },
  ],
  "Desszertek": [
    { nev: "Crème brûlée", leiras: "Vaníliás karamell, friss erdei gyümölcsökkel", ar: 2600 },
    { nev: "Étcsokoládé fondant", leiras: "Folyós csokis szívvel, vaníliafagylalttal", ar: 2900 },
    { nev: "Tiramisu", leiras: "Házi mascarpone krém, erős eszpresszó, kakaópor", ar: 2800 },
    { nev: "Sárgabarack panna cotta", lerias: "Lime zselével, pisztáciás morzsával", ar: 2400 },
  ],
  "Italok": [
    { nev: "Házi limonádé", leiras: "Friss citrom, menta, gyömbér – 3 ízben", ar: 1200 },
    { nev: "Prémium koktélok", leiras: "Bartenderünk napi ajánlata, kérje a személyzettől", ar: 2400 },
    { nev: "Borválogatás (1 dl)", leiras: "Fehér, vörös és rozé – sommelier ajánlással", ar: 1600 },
    { nev: "San Pellegrino", leiras: "0.75l prémium ásványvíz", ar: 900 },
  ],
};

const ikonok = {
  "Előételek": "🥗",
  "Főételek": "🍽",
  "Desszertek": "🍮",
  "Italok": "🍷",
};

export default function Etlap() {
  const [aktiv, setAktiv] = useState("Előételek");

  return (
    <div className="etlap-page">
      <div className="etlap-hero">
        <div className="etlap-hero-overlay" />
        <div className="etlap-hero-content">
          <p className="etlap-subtitle">Éttermi kínálatunk</p>
          <h1 className="etlap-title">Étlapunk</h1>
          <p className="etlap-desc">
            Séfünk minden fogást friss, helyi alapanyagokból készít.<br />
            Foglaljon asztalt és élvezze a SmartTable élményt.
          </p>
        </div>
      </div>

      <div className="etlap-body">
        <div className="etlap-tabs">
          {Object.keys(menu).map(kat => (
            <button
              key={kat}
              className={`etlap-tab ${aktiv === kat ? "aktiv" : ""}`}
              onClick={() => setAktiv(kat)}
            >
              <span className="tab-ikon">{ikonok[kat]}</span>
              {kat}
            </button>
          ))}
        </div>

        <div className="etlap-grid">
          {menu[aktiv].map((etel, i) => (
            <div className="etlap-card" key={i} style={{ animationDelay: `${i * 60}ms` }}>
              <div className="card-top">
                <h3 className="etel-nev">{etel.nev}</h3>
                <span className="etel-ar">{etel.ar.toLocaleString("hu-HU")} Ft</span>
              </div>
              <p className="etel-leiras">{etel.leiras}</p>
            </div>
          ))}
        </div>

        <div className="etlap-cta">
          <p>Megkóstolná kínálatunkat?</p>
          <a href="/foglalas" className="etlap-cta-btn">Asztalt foglalok →</a>
        </div>
      </div>
    </div>
  );
}// kategória tabok
// animáció
// foglalás cta
// etlap arak
