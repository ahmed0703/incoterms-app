/*
  Incoterms® 2020 Interactive Application
  Developed by Ahmed Amjad

  Copyright © 2026 Ahmed Amjad
  All rights reserved.

  Original concept, UX design, application logic,
  information architecture and implementation by Ahmed Amjad.
*/

import { useMemo, useState } from "react";

const BRAND = {
  seller: "#1d4ed8",
  buyer: "#16a34a",
  risk: "#ea580c",
  cost: "#475569",
};

const LANGS = { no: "Norsk", en: "English" };

const UI = {
  no: {
    title: "Incoterms® 2020",
    subtitle: "Velg transportmåte, Incoterm og se kostnad, risiko, forsikring og klarering.",
    transportMode: "Transportmåte",
    allModes: "🌍 Alle Incoterms",
    road: "🚚 Bil / lastebil",
    rail: "🚆 Tog / jernbane",
    air: "✈️ Fly",
    sea: "🚢 Skip / sjøtransport",
    seaHint: "Viser kun sjøspesifikke Incoterms: FAS, FOB, CFR og CIF.",
    compareOn: "Sammenligning: På",
    compareOff: "Sammenligning: Av",
    pickTerm: "Velg Incoterm",
    compareWith: "Sammenlign med",
    cost: "Kostnad",
    risk: "Risiko",
    insurance: "Forsikring",
    customs: "Klarering",
    seller: "Selger",
    buyer: "Kjøper",
    legendSeller: "Selger",
    legendBuyer: "Kjøper",
    legendRisk: "Risikoovergang",
    legendCost: "Kostnadsovergang",
    insuranceBy: "Tegnes av",
    insuranceFor: "Forsikringen gjelder",
    shouldBeInsuredBy: "Bør forsikres av",
    noMandatoryInsurance: "Ingen obligatorisk forsikring etter Incoterms.",
    exportClearance: "Eksportklarering",
    importClearance: "Importklarering",
    claimsSimTitle: "Claims-simulator: «Skade skjer her»",
    sellerRisk: "Selgers risiko",
    buyerRisk: "Kjøpers risiko",
    claimsHint: "Flytt slideren og se om skaden rammer før eller etter risikoovergangen.",
    fcaVariantLabel: "FCA-variant",
    fcaSellerPremises: "Selgers lokaler (lastet)",
    fcaOtherPlace: "Annet sted (ikke avlastet)",
    stageTitle: "Transportløp",
    glossaryTitle: "Ordliste",
    showGlossary: "Vis ordliste",
    hideGlossary: "Skjul ordliste",
    riskTransfer: "Risikoovergang",
    sellerObligation: "Selgers ansvar",
    buyerObligation: "Kjøpers ansvar",
    insuranceNote: "Forsikringsnotat",
  },
  en: {
    title: "Incoterms® 2020",
    subtitle: "Select transport mode, Incoterm and view cost, risk, insurance and clearance.",
    transportMode: "Transport mode",
    allModes: "🌍 All Incoterms",
    road: "🚚 Road / truck",
    rail: "🚆 Rail",
    air: "✈️ Air",
    sea: "🚢 Ship / sea transport",
    seaHint: "Shows only sea-specific Incoterms: FAS, FOB, CFR and CIF.",
    compareOn: "Compare: On",
    compareOff: "Compare: Off",
    pickTerm: "Select Incoterm",
    compareWith: "Compare with",
    cost: "Cost",
    risk: "Risk",
    insurance: "Insurance",
    customs: "Clearance",
    seller: "Seller",
    buyer: "Buyer",
    legendSeller: "Seller",
    legendBuyer: "Buyer",
    legendRisk: "Risk transfer",
    legendCost: "Cost transfer",
    insuranceBy: "Arranged by",
    insuranceFor: "Insured interest",
    shouldBeInsuredBy: "Should be insured by",
    noMandatoryInsurance: "No mandatory insurance under Incoterms.",
    exportClearance: "Export clearance",
    importClearance: "Import clearance",
    claimsSimTitle: "Claims simulator: “Damage happens here”",
    sellerRisk: "Seller’s risk",
    buyerRisk: "Buyer’s risk",
    claimsHint: "Move the slider and see whether damage occurs before or after the risk transfer point.",
    fcaVariantLabel: "FCA variant",
    fcaSellerPremises: "Seller’s premises (loaded)",
    fcaOtherPlace: "Other place (not unloaded)",
    stageTitle: "Transport journey",
    glossaryTitle: "Glossary",
    showGlossary: "Show glossary",
    hideGlossary: "Hide glossary",
    riskTransfer: "Risk transfer",
    sellerObligation: "Seller’s obligation",
    buyerObligation: "Buyer’s obligation",
    insuranceNote: "Insurance note",
  },
};

const STAGES = {
  no: [
    { key: "factory", label: "Selgers sted", icon: "factory" },
    { key: "pre", label: "Fortransport", icon: "truck" },
    { key: "export", label: "Avgangshavn", icon: "anchor" },
    { key: "main", label: "Hovedtransport", icon: "ship" },
    { key: "import", label: "Ankomsthavn", icon: "port" },
    { key: "on", label: "Videre transport", icon: "truck" },
    { key: "delivered", label: "Ankomststed", icon: "mapPin" },
    { key: "unloaded", label: "Losset", icon: "check" },
  ],
  en: [
    { key: "factory", label: "Seller’s place", icon: "factory" },
    { key: "pre", label: "Pre-carriage", icon: "truck" },
    { key: "export", label: "Port of departure", icon: "anchor" },
    { key: "main", label: "Main carriage", icon: "ship" },
    { key: "import", label: "Port of arrival", icon: "port" },
    { key: "on", label: "On-carriage", icon: "truck" },
    { key: "delivered", label: "Destination", icon: "mapPin" },
    { key: "unloaded", label: "Unloaded", icon: "check" },
  ],
};

const DP = {
  FIRST_CARRIER: 1,
  DEPARTURE_PORT: 2,
};

const TERMS = [
  { code: "EXW", name: "Ex Works", risk: 0, cost: 0, exportBy: "buyer", importBy: "buyer", insuranceRecommended: "buyer" },
  { code: "FCA", name: "Free Carrier", risk: 1, cost: 1, exportBy: "seller", importBy: "buyer", insuranceRecommended: "buyer" },
  { code: "CPT", name: "Carriage Paid To", risk: 1, cost: 6, exportBy: "seller", importBy: "buyer", insuranceRecommended: "buyer" },
  { code: "CIP", name: "Carriage and Insurance Paid To", risk: 1, cost: 6, exportBy: "seller", importBy: "buyer", insuranceBy: "seller", insuranceFor: "buyer", insuranceRecommended: "seller" },
  { code: "DAP", name: "Delivered At Place", risk: 6, cost: 6, exportBy: "seller", importBy: "buyer", insuranceRecommended: "seller" },
  { code: "DPU", name: "Delivered at Place Unloaded", risk: 7, cost: 7, exportBy: "seller", importBy: "buyer", insuranceRecommended: "seller" },
  { code: "DDP", name: "Delivered Duty Paid", risk: 6, cost: 6, exportBy: "seller", importBy: "seller", insuranceRecommended: "seller" },
  { code: "FAS", name: "Free Alongside Ship", risk: 2, cost: 2, exportBy: "seller", importBy: "buyer", insuranceRecommended: "buyer", seaOnly: true },
  { code: "FOB", name: "Free On Board", risk: 3, cost: 3, exportBy: "seller", importBy: "buyer", insuranceRecommended: "buyer", seaOnly: true },
  { code: "CFR", name: "Cost and Freight", risk: 3, cost: 4, exportBy: "seller", importBy: "buyer", insuranceRecommended: "buyer", seaOnly: true },
  { code: "CIF", name: "Cost, Insurance and Freight", risk: 3, cost: 4, exportBy: "seller", importBy: "buyer", insuranceBy: "seller", insuranceFor: "buyer", insuranceRecommended: "seller", seaOnly: true },
];

const TERM_DETAILS = {
  EXW: {
    no: {
      riskTransfer: "Risiko går over når varen er stilt til kjøpers disposisjon på avtalt sted.",
      sellerObligation: "Selger stiller varen til disposisjon, normalt ikke eksportklarert.",
      buyerObligation: "Kjøper bærer risiko og kostnader fra leveringstidspunktet.",
      insuranceNote: "Varen bør normalt forsikres av kjøper.",
    },
    en: {
      riskTransfer: "Risk transfers when the goods are placed at the buyer’s disposal at the named place.",
      sellerObligation: "Seller places the goods at the buyer’s disposal, usually not cleared for export.",
      buyerObligation: "Buyer bears risk and costs from the time of delivery.",
      insuranceNote: "The goods should normally be insured by the buyer.",
    },
  },
  FCA: {
    no: {
      riskTransfer: "Risiko går over når varen er overlevert til transportør på avtalt sted.",
      sellerObligation: "Selger leverer varen til transportør og eksportklarerer varen.",
      buyerObligation: "Kjøper bærer risiko og kostnader fra levering til transportør.",
      insuranceNote: "Varen bør normalt forsikres av kjøper etter levering.",
    },
    en: {
      riskTransfer: "Risk transfers when the goods are handed over to the carrier at the named place.",
      sellerObligation: "Seller delivers the goods to the carrier and clears them for export.",
      buyerObligation: "Buyer bears risk and costs from delivery to the carrier.",
      insuranceNote: "The goods should normally be insured by the buyer after delivery.",
    },
  },
  CPT: {
    no: {
      riskTransfer: "Risiko går over når varen er overlevert til første transportør.",
      sellerObligation: "Selger betaler transport til avtalt bestemmelsessted.",
      buyerObligation: "Kjøper bærer risiko fra overlevering til transportør.",
      insuranceNote: "Varen bør normalt forsikres av kjøper.",
    },
    en: {
      riskTransfer: "Risk transfers when the goods are handed over to the first carrier.",
      sellerObligation: "Seller pays carriage to the named place of destination.",
      buyerObligation: "Buyer bears risk from delivery to the carrier.",
      insuranceNote: "The goods should normally be insured by the buyer.",
    },
  },
  CIP: {
    no: {
      riskTransfer: "Risiko går over når varen er overlevert til første transportør.",
      sellerObligation: "Selger betaler transport og tegner forsikring til fordel for kjøper.",
      buyerObligation: "Kjøper bærer risiko fra overlevering til transportør.",
      insuranceNote: "Selger skal tegne forsikring for kjøpers interesse.",
    },
    en: {
      riskTransfer: "Risk transfers when the goods are handed over to the first carrier.",
      sellerObligation: "Seller pays carriage and arranges insurance for the buyer’s benefit.",
      buyerObligation: "Buyer bears risk from delivery to the carrier.",
      insuranceNote: "Seller must arrange insurance for the buyer’s interest.",
    },
  },
  DAP: {
    no: {
      riskTransfer: "Risiko går over når varen er stilt til kjøpers disposisjon på ankommende transportmiddel, klar for lossing.",
      sellerObligation: "Selger betaler transport til avtalt ankomststed, ikke losset.",
      buyerObligation: "Kjøper tar imot varen og håndterer normalt lossing/import.",
      insuranceNote: "Varen bør normalt forsikres av selger frem til ankomststed.",
    },
    en: {
      riskTransfer: "Risk transfers when the goods are placed at the buyer’s disposal on the arriving means of transport, ready for unloading.",
      sellerObligation: "Seller pays carriage to the named place of destination, not unloaded.",
      buyerObligation: "Buyer takes delivery and normally handles unloading/import.",
      insuranceNote: "The goods should normally be insured by the seller up to destination.",
    },
  },
  DPU: {
    no: {
      riskTransfer: "Risiko går over når varen er losset og stilt til kjøpers disposisjon på avtalt sted.",
      sellerObligation: "Selger betaler transport og lossing til avtalt sted.",
      buyerObligation: "Kjøper tar imot varen etter lossing.",
      insuranceNote: "Varen bør normalt forsikres av selger frem til losset ankomststed.",
    },
    en: {
      riskTransfer: "Risk transfers when the goods are unloaded and placed at the buyer’s disposal at the named place.",
      sellerObligation: "Seller pays carriage and unloading to the named place.",
      buyerObligation: "Buyer takes delivery after unloading.",
      insuranceNote: "The goods should normally be insured by the seller up to unloaded destination.",
    },
  },
  DDP: {
    no: {
      riskTransfer: "Risiko går over når varen er levert på avtalt bestemmelsessted, ikke losset.",
      sellerObligation: "Selger betaler transport, eksportklarering og importklarering.",
      buyerObligation: "Kjøper tar imot varen på avtalt sted.",
      insuranceNote: "Varen bør normalt forsikres av selger frem til ankomststed.",
    },
    en: {
      riskTransfer: "Risk transfers when the goods are delivered at the named place of destination, not unloaded.",
      sellerObligation: "Seller pays carriage, export clearance and import clearance.",
      buyerObligation: "Buyer takes delivery at the named place.",
      insuranceNote: "The goods should normally be insured by the seller up to destination.",
    },
  },
  FAS: {
    no: {
      riskTransfer: "Risiko går over når varen er plassert langs skipssiden i avtalt avgangshavn.",
      sellerObligation: "Selger leverer varen langs skipssiden og eksportklarerer varen.",
      buyerObligation: "Kjøper betaler hovedtransport og bærer risiko fra levering langs skipet.",
      insuranceNote: "Varen bør normalt forsikres av kjøper etter levering.",
    },
    en: {
      riskTransfer: "Risk transfers when the goods are placed alongside the ship at the named port of shipment.",
      sellerObligation: "Seller delivers the goods alongside the vessel and clears them for export.",
      buyerObligation: "Buyer pays main carriage and bears risk from alongside delivery.",
      insuranceNote: "The goods should normally be insured by the buyer after delivery.",
    },
  },
  FOB: {
    no: {
      riskTransfer: "Risiko går over når varen er om bord på skipet i avtalt avgangshavn.",
      sellerObligation: "Selger leverer varen om bord og eksportklarerer varen.",
      buyerObligation: "Kjøper betaler sjøtransport og bærer risiko fra varen er om bord.",
      insuranceNote: "Varen bør normalt forsikres av kjøper etter at varen er om bord.",
    },
    en: {
      riskTransfer: "Risk transfers when the goods are on board the vessel at the named port of shipment.",
      sellerObligation: "Seller delivers the goods on board and clears them for export.",
      buyerObligation: "Buyer pays sea carriage and bears risk once goods are on board.",
      insuranceNote: "The goods should normally be insured by the buyer once goods are on board.",
    },
  },
  CFR: {
    no: {
      riskTransfer: "Risiko går over når varen er om bord på skipet i avgangshavnen.",
      sellerObligation: "Selger betaler sjøtransport til avtalt ankomsthavn.",
      buyerObligation: "Kjøper bærer risiko fra varen er om bord i avgangshavnen.",
      insuranceNote: "Varen bør normalt forsikres av kjøper.",
    },
    en: {
      riskTransfer: "Risk transfers when the goods are on board the vessel at the port of shipment.",
      sellerObligation: "Seller pays sea carriage to the named port of destination.",
      buyerObligation: "Buyer bears risk once goods are on board at the port of shipment.",
      insuranceNote: "The goods should normally be insured by the buyer.",
    },
  },
  CIF: {
    no: {
      riskTransfer: "Risiko går over når varen er om bord på skipet i avgangshavnen.",
      sellerObligation: "Selger betaler sjøtransport og tegner forsikring til fordel for kjøper.",
      buyerObligation: "Kjøper bærer risiko fra varen er om bord i avgangshavnen.",
      insuranceNote: "Selger skal tegne forsikring for kjøpers interesse.",
    },
    en: {
      riskTransfer: "Risk transfers when the goods are on board the vessel at the port of shipment.",
      sellerObligation: "Seller pays sea carriage and arranges insurance for the buyer’s benefit.",
      buyerObligation: "Buyer bears risk once goods are on board at the port of shipment.",
      insuranceNote: "Seller must arrange insurance for the buyer’s interest.",
    },
  },
};

const TRANSPORT_FILTERS = {
  all: TERMS,
  road: TERMS.filter((t) => !t.seaOnly),
  rail: TERMS.filter((t) => !t.seaOnly),
  air: TERMS.filter((t) => !t.seaOnly),
  sea: TERMS.filter((t) => t.seaOnly),
};

function pct(stage) {
  return Math.max(0, Math.min(100, (stage / 7) * 100));
}

function partyName(party, t) {
  return party === "seller" ? t.seller : t.buyer;
}

function Button({ active, children, onClick }) {
  return <button className={`brand-button ${active ? "active" : ""}`} onClick={onClick}>{children}</button>;
}

function Legend({ color, text }) {
  return (
    <div className="legend-item">
      <span className="legend-dot" style={{ background: color }} />
      <span>{text}</span>
    </div>
  );
}

function Bar({ title, split, markerColor }) {
  return (
    <div className="bar-block">
      {title && <strong>{title}</strong>}
      <div className="bar-track">
        <div className="bar-fill">
          <div style={{ width: `${split}%`, background: BRAND.seller }} />
          <div style={{ width: `${100 - split}%`, background: BRAND.buyer }} />
        </div>
        <div className="risk-line" style={{ left: `${split}%`, background: markerColor }} />
        <div className="risk-triangle" style={{ left: `${split}%`, borderTopColor: markerColor }} />
      </div>
    </div>
  );
}

function SvgIcon({ name, size = 44 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    focusable: "false",
  };

  const icons = {
    factory: (
      <>
        <path d="M3 21h18" />
        <path d="M5 21V9.5l5 2.7V9.5l5 2.7V6h4v15" />
        <path d="M8 17h2" />
        <path d="M13 17h2" />
        <path d="M8 14h2" />
        <path d="M13 14h2" />
      </>
    ),
    truck: (
      <>
        <path d="M3 7.5h11v8.5H3z" />
        <path d="M14 10h4l3 3.5V16h-7z" />
        <path d="M5.5 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        <path d="M17.5 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        <path d="M7.5 16h8" />
      </>
    ),
    anchor: (
      <>
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v12" />
        <path d="M7 10h10" />
        <path d="M5 16c1.6 3.2 4 5 7 5s5.4-1.8 7-5" />
        <path d="M5 16l2.5-.8" />
        <path d="M19 16l-2.5-.8" />
      </>
    ),
    ship: (
      <>
        <path d="M4 15.5h16l-2 4H6z" />
        <path d="M7 15.5l1.5-6h7l1.5 6" />
        <path d="M9.5 9.5V5h5v4.5" />
        <path d="M3 21c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" />
      </>
    ),
    port: (
      <>
        <path d="M4 20h16" />
        <path d="M6 20V10h12v10" />
        <path d="M8 10l4-5 4 5" />
        <path d="M12 5v15" />
        <path d="M8.5 14h2" />
        <path d="M13.5 14h2" />
        <path d="M8.5 17h2" />
        <path d="M13.5 17h2" />
      </>
    ),
    mapPin: (
      <>
        <path d="M12 21s7-5.1 7-11a7 7 0 0 0-14 0c0 5.9 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l2.6 2.6L16.5 9" />
      </>
    ),
    rail: (
      <>
        <path d="M7 3h10a2 2 0 0 1 2 2v9a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V5a2 2 0 0 1 2-2z" />
        <path d="M7 8h10" />
        <path d="M8 21l2-3" />
        <path d="M16 18l2 3" />
        <circle cx="9" cy="14" r="1.2" />
        <circle cx="15" cy="14" r="1.2" />
      </>
    ),
    plane: (
      <>
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 20.5 3s-3-.5-4.5 1L12.5 7.5 4.3 5.7a1 1 0 0 0-.9.3l-.7.7a1 1 0 0 0 .1 1.6L8 12l-2 3H3l-1 1 4 2 2 4 1-1v-3l3-2 3.7 5.2a1 1 0 0 0 1.6.1l.7-.7a1 1 0 0 0 .3-.9z" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}
function TransportIcons({ term }) {
  const icons = term.seaOnly ? ["ship"] : ["truck", "rail", "plane"];

  return (
    <>
      {icons.map((icon) => (
        <SvgIcon key={icon} name={icon} size={32} />
      ))}
    </>
  );
}

function StageTimeline({ stages, activeStage }) {
  return (
    <div className="stage-wrapper">
      <div className="stage-track">
        <div className="stage-main-line" aria-hidden="true" />

        <div className="stage-grid">
          {stages.map((stage, index) => (
            <div key={stage.key} className={`stage-card ${index === activeStage ? "active" : ""}`}>
              <div className="stage-number">{index + 1}</div>
              <div className="stage-icon">
                <SvgIcon name={stage.icon} />
              </div>
              <div className="stage-label">{stage.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoPanel({ term, t }) {
  const hasMandatoryInsurance = term.insuranceBy && term.insuranceFor;

  return (
    <div className="info-grid">
      <div className="info-box">
        <h3>{t.insurance}</h3>
        {hasMandatoryInsurance ? (
          <>
            <p>{t.insuranceBy}: <strong>{partyName(term.insuranceBy, t)}</strong></p>
            <p>{t.insuranceFor}: <strong>{partyName(term.insuranceFor, t)}</strong></p>
          </>
        ) : (
          <>
            <p>{t.shouldBeInsuredBy}: <strong>{partyName(term.insuranceRecommended, t)}</strong></p>
            <p>{t.noMandatoryInsurance}</p>
          </>
        )}
      </div>

      <div className="info-box">
        <h3>{t.customs}</h3>
        <p>{t.exportClearance}: <strong>{partyName(term.exportBy, t)}</strong></p>
        <p>{t.importClearance}: <strong>{partyName(term.importBy, t)}</strong></p>
      </div>
    </div>
  );
}

function TermDetails({ term, lang, t }) {
  const details = TERM_DETAILS[term.code]?.[lang];

  if (!details) return null;

  return (
    <div className="details-grid always-visible-details">
      <div className="info-box">
        <h3>{t.riskTransfer}</h3>
        <p>{details.riskTransfer}</p>
      </div>

      <div className="info-box">
        <h3>{t.sellerObligation}</h3>
        <p>{details.sellerObligation}</p>
      </div>

      <div className="info-box">
        <h3>{t.buyerObligation}</h3>
        <p>{details.buyerObligation}</p>
      </div>

      <div className="info-box">
        <h3>{t.insuranceNote}</h3>
        <p>{details.insuranceNote}</p>
      </div>
    </div>
  );
}

function Visual({ label, term, stages, t, lang }) {
  return (
    <section className="visual-card">
      <h2>
        {label}
        <span className="transport-icons"><TransportIcons term={term} /></span>
      </h2>

      <div className="legend-row">
        <Legend color={BRAND.seller} text={t.legendSeller} />
        <Legend color={BRAND.buyer} text={t.legendBuyer} />
        <Legend color={BRAND.cost} text={t.legendCost} />
        <Legend color={BRAND.risk} text={t.legendRisk} />
      </div>

      <Bar title={t.cost} split={pct(term.cost)} markerColor={BRAND.cost} />

      <StageTimeline stages={stages} activeStage={term.risk} />

      <Bar title="" split={pct(term.risk)} markerColor={BRAND.risk} />

      <div className="risk-label-bottom">
        <strong>{t.risk}</strong>
      </div>

      <InfoPanel term={term} t={t} />

      <TermDetails term={term} lang={lang} t={t} />
    </section>
  );
}

function Glossary({ lang }) {
  const items =
    lang === "no"
      ? [
          ["Kostnad", "Viser hvem som normalt bærer transportkostnadene på ulike deler av transportløpet."],
          ["Risiko", "Viser hvem som bærer risikoen dersom varen blir skadet eller går tapt."],
          ["Risikoovergang", "Tidspunktet hvor risikoen for skade eller tap går fra selger til kjøper."],
          ["Kostnadsovergang", "Punktet hvor hovedansvaret for kostnader går fra selger til kjøper."],
          ["Forsikring", "Viser hvem som skal eller normalt bør forsikre varen."],
          ["Bør forsikres av", "Parten som normalt bør sørge for vareforsikring basert på hvem som bærer risikoen."],
          ["Klarering", "Toll- og dokumentansvar knyttet til eksport og import."],
          ["Eksportklarering", "Ansvar for å klargjøre varen for eksport ut av avsenderlandet."],
          ["Importklarering", "Ansvar for toll, avgifter og dokumenter ved innførsel i mottakerlandet."],
          ["Selgers risiko", "Skaden rammer før risikoen har gått over til kjøper."],
          ["Kjøpers risiko", "Skaden rammer etter at risikoen har gått over til kjøper."],
          ["Transportløp", "Den visuelle reisen fra selgers sted til lossing ved mottak."],
          ["Ankomststed", "Stedet varen skal leveres til i henhold til avtalen."],
        ]
      : [
          ["Cost", "Shows who normally carries the transport costs during different parts of the journey."],
          ["Risk", "Shows who carries the risk if the goods are damaged or lost."],
          ["Risk transfer", "The point where risk of loss or damage transfers from seller to buyer."],
          ["Cost transfer", "The point where the main cost responsibility transfers from seller to buyer."],
          ["Insurance", "Shows who must or normally should insure the goods."],
          ["Should be insured by", "The party who should normally arrange cargo insurance based on who carries the risk."],
          ["Clearance", "Customs and documentation responsibility related to export and import."],
          ["Export clearance", "Responsibility for preparing the goods for export from the country of dispatch."],
          ["Import clearance", "Responsibility for customs, duties and documents when importing the goods."],
          ["Seller’s risk", "Damage occurs before risk has transferred to the buyer."],
          ["Buyer’s risk", "Damage occurs after risk has transferred to the buyer."],
          ["Transport journey", "The visual journey from the seller’s place to unloading at destination."],
          ["Place of destination", "The place where the goods are to be delivered under the agreement."],
        ];

  return (
    <div className="glossary-grid">
      {items.map(([title, body]) => (
        <div className="info-box" key={title}>
          <h3>{title}</h3>
          <p>{body}</p>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("no");
  const [transportMode, setTransportMode] = useState("all");
  const [selectedCode, setSelectedCode] = useState("EXW");
  const [compare, setCompare] = useState(false);
  const [compareCode, setCompareCode] = useState("CIF");
  const [damageAt, setDamageAt] = useState(50);
  const [fcaVariant, setFcaVariant] = useState("sellerPremises");
  const [showGlossary, setShowGlossary] = useState(false);

  const t = UI[lang];
  const stages = STAGES[lang];

  const terms = useMemo(() => TRANSPORT_FILTERS[transportMode], [transportMode]);
  const selectedTerm = terms.find((x) => x.code === selectedCode) || terms[0];
  const compareTerm = terms.find((x) => x.code === compareCode) || terms[0];

  const resolvedSelectedTerm =
    selectedTerm.code === "FCA"
      ? {
          ...selectedTerm,
          risk: fcaVariant === "sellerPremises" ? DP.FIRST_CARRIER : DP.DEPARTURE_PORT,
          cost: fcaVariant === "sellerPremises" ? DP.FIRST_CARRIER : DP.DEPARTURE_PORT,
        }
      : selectedTerm;

  const riskText = damageAt <= pct(resolvedSelectedTerm.risk) ? t.sellerRisk : t.buyerRisk;

  function changeTransportMode(mode) {
    const availableTerms = TRANSPORT_FILTERS[mode];
    setTransportMode(mode);
    setSelectedCode(availableTerms[0].code);
    setCompareCode(mode === "sea" ? "CIF" : "CIP");
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="header-logo">
          <img src="/berkley-logo.png" alt="Berkley Nordic" className="berkley-logo" />
        </div>

        <div className="header-title">
          <h1>{t.title}</h1>
        </div>

        <div className="language-controls header-language">
          {Object.keys(LANGS).map((key) => (
            <Button key={key} active={lang === key} onClick={() => setLang(key)}>
              {LANGS[key]}
            </Button>
          ))}
        </div>
      </header>

      <div className="app-container">
        <p className="subtitle">{t.subtitle}</p>

        <div className="top-controls">
          <div className="primary-controls">
            <select
              className="transport-select"
              value={transportMode}
              onChange={(e) => changeTransportMode(e.target.value)}
              aria-label={t.transportMode}
            >
              <option value="all">{t.allModes}</option>
              <option value="road">{t.road}</option>
              <option value="rail">{t.rail}</option>
              <option value="air">{t.air}</option>
              <option value="sea">{t.sea}</option>
            </select>

            <Button active={compare} onClick={() => setCompare((v) => !v)}>
              {compare ? t.compareOn : t.compareOff}
            </Button>
          </div>
        </div>

        <section className="selector-card">
          {transportMode === "sea" && <p className="claims-hint">{t.seaHint}</p>}

          <h3>{t.pickTerm}</h3>

          <div className="button-row">
            {terms.map((term) => (
              <Button key={term.code} active={selectedCode === term.code} onClick={() => setSelectedCode(term.code)}>
                {term.code}
              </Button>
            ))}
          </div>

          {selectedCode === "FCA" && (
            <div className="sub-section">
              <h3>{t.fcaVariantLabel}</h3>
              <div className="button-row">
                <Button active={fcaVariant === "sellerPremises"} onClick={() => setFcaVariant("sellerPremises")}>
                  {t.fcaSellerPremises}
                </Button>
                <Button active={fcaVariant === "otherPlace"} onClick={() => setFcaVariant("otherPlace")}>
                  {t.fcaOtherPlace}
                </Button>
              </div>
            </div>
          )}

          {compare && (
            <div className="sub-section">
              <h3>{t.compareWith}</h3>
              <div className="button-row">
                {terms.map((term) => (
                  <Button key={term.code} active={compareCode === term.code} onClick={() => setCompareCode(term.code)}>
                    {term.code}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </section>

        {!compare ? (
          <Visual label={`${selectedCode} – ${resolvedSelectedTerm.name}`} term={resolvedSelectedTerm} stages={stages} t={t} lang={lang} />
        ) : (
          <div className="compare-grid">
            <Visual label={`A: ${selectedCode} – ${resolvedSelectedTerm.name}`} term={resolvedSelectedTerm} stages={stages} t={t} lang={lang} />
            <Visual label={`B: ${compareCode} – ${compareTerm.name}`} term={compareTerm} stages={stages} t={t} lang={lang} />
          </div>
        )}

        <section className={`claims-card ${riskText === t.sellerRisk ? "seller-claim" : "buyer-claim"}`}>
          <h2>{t.claimsSimTitle}</h2>
          <p className="risk-party">
            <strong>{riskText}</strong>
          </p>

          <input type="range" min="0" max="100" value={damageAt} onChange={(e) => setDamageAt(Number(e.target.value))} />

          <p className="claims-hint">{t.claimsHint}</p>
        </section>

        <section className="compact-glossary">
          <button className="brand-button" onClick={() => setShowGlossary((v) => !v)}>
            {showGlossary ? "▲ " + t.hideGlossary : "▼ " + t.showGlossary}
          </button>

          {showGlossary && <Glossary lang={lang} />}
        </section>
      </div>
    </main>
  );
}