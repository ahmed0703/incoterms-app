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
 seller: "#1e40af",
 buyer: "#16a34a",
 risk: "#ea580c",
 cost: "#475569",
};

const LANGS = { no: "Norsk", en: "English" };

const UI = {
 no: {
 title: "Incoterms® 2020",
 subtitle: "Velg transportmåte, Incoterm og se kostnad, risiko, forsikring og tollklarering.",
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
 customs: "Tollklarering",
 seller: "Selger",
 buyer: "Kjøper",
 legendSeller: "Selger",
 legendBuyer: "Kjøper",
 legendRisk: "Risikoovergang",
 legendCost: "Kostnadsovergang",
 insuranceBy: "Tegnes av",
 insuranceFor: "Forsikringen gjelder",
 shouldBeInsuredBy: "Bør forsikres av",
 noMandatoryInsurance: "Ingen obligatorisk forsikring ifølge Incoterms.",
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
 subtitle: "Select transport mode, Incoterm and view cost, risk, insurance and customs clearance.",
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
 customs: "Customs clearance",
 seller: "Seller",
 buyer: "Buyer",
 legendSeller: "Seller",
 legendBuyer: "Buyer",
 legendRisk: "Risk transfer",
 legendCost: "Cost transfer",
 insuranceBy: "Arranged by",
 insuranceFor: "Insured interest",
 shouldBeInsuredBy: "Should be insured by",
 noMandatoryInsurance: "No mandatory insurance according to Incoterms.",
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
 { key: "import", label: "Ankomsthavn", icon: "port" },
 { key: "on", label: "Videre transport", icon: "truck" },
 { key: "delivered", label: "Ankomststed", icon: "mapPin" },
 { key: "unloaded", label: "Losset", icon: "check" },
 ],
 en: [
 { key: "factory", label: "Seller’s place", icon: "factory" },
 { key: "pre", label: "Pre-carriage", icon: "truck" },
 { key: "export", label: "Port of departure", icon: "anchor" },
 { key: "import", label: "Port of arrival", icon: "port" },
 { key: "on", label: "On-carriage", icon: "truck" },
 { key: "delivered", label: "Destination", icon: "mapPin" },
 { key: "unloaded", label: "Unloaded", icon: "check" },
 ],
};

const DP = {
 SELLER_PLACE: 0,
 FIRST_CARRIER: 1,
 DEPARTURE_PORT: 2,
 ARRIVAL_PORT: 3,
 ON_CARRIAGE: 4,
 DESTINATION: 5,
 UNLOADED: 6,
};

const TERMS = [
 { code: "EXW", name: "Ex Works", displayName: "EXW (Ex Works – Named Place)", risk: DP.SELLER_PLACE, cost: DP.SELLER_PLACE, exportBy: "buyer", importBy: "buyer", insuranceRecommended: "buyer" },
 { code: "FCA", name: "Free Carrier", displayName: "FCA (Free Carrier – Named Place)", risk: DP.SELLER_PLACE, cost: DP.SELLER_PLACE, exportBy: "seller", importBy: "buyer", insuranceRecommended: "buyer" },
 { code: "CPT", name: "Carriage Paid To", displayName: "CPT (Carriage Paid To – Named Place of Destination)", risk: DP.FIRST_CARRIER, cost: DP.DESTINATION, exportBy: "seller", importBy: "buyer", insuranceRecommended: "buyer" },
 { code: "CIP", name: "Carriage and Insurance Paid To", displayName: "CIP (Carriage and Insurance Paid To – Named Place of Destination)", risk: DP.FIRST_CARRIER, cost: DP.DESTINATION, exportBy: "seller", importBy: "buyer", insuranceBy: "seller", insuranceFor: "buyer", insuranceRecommended: "seller" },
 { code: "DAP", name: "Delivered At Place", displayName: "DAP (Delivered At Place – Named Place of Destination)", risk: DP.DESTINATION, cost: DP.DESTINATION, exportBy: "seller", importBy: "buyer", insuranceRecommended: "seller" },
 { code: "DPU", name: "Delivered at Place Unloaded", displayName: "DPU (Delivered at Place Unloaded – Named Place of Destination)", risk: DP.UNLOADED, cost: DP.UNLOADED, exportBy: "seller", importBy: "buyer", insuranceRecommended: "seller" },
 { code: "DDP", name: "Delivered Duty Paid", displayName: "DDP (Delivered Duty Paid – Named Place of Destination)", risk: DP.DESTINATION, cost: DP.DESTINATION, exportBy: "seller", importBy: "seller", insuranceRecommended: "seller" },
 { code: "FAS", name: "Free Alongside Ship", displayName: "FAS (Free Alongside Ship – Named Port of Shipment)", risk: DP.DEPARTURE_PORT, cost: DP.DEPARTURE_PORT, exportBy: "seller", importBy: "buyer", insuranceRecommended: "buyer", seaOnly: true },
 { code: "FOB", name: "Free On Board", displayName: "FOB (Free On Board – Named Port of Shipment)", risk: DP.DEPARTURE_PORT, cost: DP.DEPARTURE_PORT, exportBy: "seller", importBy: "buyer", insuranceRecommended: "buyer", seaOnly: true },
 { code: "CFR", name: "Cost and Freight", displayName: "CFR (Cost and Freight – Named Port of Destination)", risk: DP.DEPARTURE_PORT, cost: DP.ARRIVAL_PORT, exportBy: "seller", importBy: "buyer", insuranceRecommended: "buyer", seaOnly: true },
 { code: "CIF", name: "Cost, Insurance and Freight", displayName: "CIF (Cost, Insurance and Freight – Named Port of Destination)", risk: DP.DEPARTURE_PORT, cost: DP.ARRIVAL_PORT, exportBy: "seller", importBy: "buyer", insuranceBy: "seller", insuranceFor: "buyer", insuranceRecommended: "seller", seaOnly: true },
];

const TERM_DETAILS = {
 EXW: {
 no: {
 riskTransfer: "Risiko går over når varen er stilt til kjøpers disposisjon på avtalt sted.",
 sellerObligation: "Selger stiller varen til disposisjon, ikke eksportklarert.",
 buyerObligation: "Kjøper bærer risiko og kostnader fra leveringstidspunktet.",
 insuranceNote: "Varen bør forsikres av kjøper.",
 },
 en: {
 riskTransfer: "Risk transfers when the goods are placed at the buyer’s disposal at the named place.",
 sellerObligation: "Seller places the goods at the buyer’s disposal, usually not cleared for export.",
 buyerObligation: "Buyer bears risk and costs from the time of delivery.",
 insuranceNote: "The goods should be insured by the buyer.",
 },
 },
 FCA: {
 sellerPremises: {
 no: {
 riskTransfer: "Risiko går over når varen er lastet på kjøpers transportmiddel ved selgers lokaler.",
 sellerObligation: "Selger leverer varen lastet på kjøpers transportmiddel og eksportklarerer varen.",
 buyerObligation: "Kjøper bærer risiko og videre kostnader fra levering ved selgers lokaler.",
 insuranceNote: "Varen bør forsikres av kjøper etter levering.",
 },
 en: {
 riskTransfer: "Risk transfers when the goods are loaded onto the buyer’s means of transport at the seller’s premises.",
 sellerObligation: "Seller delivers the goods loaded onto the buyer’s means of transport and clears them for export.",
 buyerObligation: "Buyer bears risk and onward costs from delivery at the seller’s premises.",
 insuranceNote: "The goods should be insured by the buyer after delivery.",
 },
 },
 otherPlace: {
 no: {
 riskTransfer: "Risiko går over når varen er stilt til transportørens disposisjon på avtalt sted, ikke losset fra transportmiddelet som fraktet varen dit.",
 sellerObligation: "Selger leverer varen til transportør på avtalt sted og eksportklarerer varen.",
 buyerObligation: "Kjøper bærer risiko og videre kostnader fra levering til transportør på avtalt sted.",
 insuranceNote: "Varen bør forsikres av kjøper etter levering.",
 },
 en: {
 riskTransfer: "Risk transfers when the goods are placed at the carrier’s disposal at the named place, not unloaded from the means of transport that brought them there.",
 sellerObligation: "Seller delivers the goods to the carrier at the named place and clears them for export.",
 buyerObligation: "Buyer bears risk and onward costs from delivery to the carrier at the named place.",
 insuranceNote: "The goods should be insured by the buyer after delivery.",
 },
 },
 },
 CPT: {
 no: {
 riskTransfer: "Risiko går over når varen er overlevert til første transportør.",
 sellerObligation: "Selger betaler transport til avtalt bestemmelsessted.",
 buyerObligation: "Kjøper bærer risiko fra overlevering til transportør.",
 insuranceNote: "Varen bør forsikres av kjøper.",
 },
 en: {
 riskTransfer: "Risk transfers when the goods are handed over to the first carrier.",
 sellerObligation: "Seller pays carriage to the named place of destination.",
 buyerObligation: "Buyer bears risk from delivery to the carrier.",
 insuranceNote: "The goods should be insured by the buyer.",
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
 buyerObligation: "Kjøper tar imot varen og håndterer lossing/import.",
 insuranceNote: "Varen bør forsikres av selger frem til ankomststed.",
 },
 en: {
 riskTransfer: "Risk transfers when the goods are placed at the buyer’s disposal on the arriving means of transport, ready for unloading.",
 sellerObligation: "Seller pays carriage to the named place of destination, not unloaded.",
 buyerObligation: "Buyer takes delivery and handles unloading/import.",
 insuranceNote: "The goods should be insured by the seller up to destination.",
 },
 },
 DPU: {
 no: {
 riskTransfer: "Risiko går over når varen er losset og stilt til kjøpers disposisjon på avtalt sted.",
 sellerObligation: "Selger betaler transport og lossing til avtalt sted.",
 buyerObligation: "Kjøper tar imot varen etter lossing.",
 insuranceNote: "Varen bør forsikres av selger frem til losset ankomststed.",
 },
 en: {
 riskTransfer: "Risk transfers when the goods are unloaded and placed at the buyer’s disposal at the named place.",
 sellerObligation: "Seller pays carriage and unloading to the named place.",
 buyerObligation: "Buyer takes delivery after unloading.",
 insuranceNote: "The goods should be insured by the seller up to unloaded destination.",
 },
 },
 DDP: {
 no: {
 riskTransfer: "Risiko går over når varen er levert på avtalt bestemmelsessted, ikke losset.",
 sellerObligation: "Selger betaler transport, eksportklarering og importklarering.",
 buyerObligation: "Kjøper tar imot varen på avtalt sted.",
 insuranceNote: "Varen bør forsikres av selger frem til ankomststed.",
 },
 en: {
 riskTransfer: "Risk transfers when the goods are delivered at the named place of destination, not unloaded.",
 sellerObligation: "Seller pays carriage, export clearance and import clearance.",
 buyerObligation: "Buyer takes delivery at the named place.",
 insuranceNote: "The goods should be insured by the seller up to destination.",
 },
 },
 FAS: {
 no: {
 riskTransfer: "Risiko går over når varen er plassert langs skipssiden i avtalt avgangshavn.",
 sellerObligation: "Selger leverer varen langs skipssiden og eksportklarerer varen.",
 buyerObligation: "Kjøper betaler hovedtransport og bærer risiko fra levering langs skipet.",
 insuranceNote: "Varen bør forsikres av kjøper etter levering.",
 },
 en: {
 riskTransfer: "Risk transfers when the goods are placed alongside the ship at the named port of shipment.",
 sellerObligation: "Seller delivers the goods alongside the vessel and clears them for export.",
 buyerObligation: "Buyer pays main carriage and bears risk from alongside delivery.",
 insuranceNote: "The goods should be insured by the buyer after delivery.",
 },
 },
 FOB: {
 no: {
 riskTransfer: "Risiko går over når varen er om bord på skipet i avtalt avgangshavn.",
 sellerObligation: "Selger leverer varen om bord og eksportklarerer varen.",
 buyerObligation: "Kjøper betaler sjøtransport og bærer risiko fra varen er om bord.",
 insuranceNote: "Varen bør forsikres av kjøper etter at varen er om bord.",
 },
 en: {
 riskTransfer: "Risk transfers when the goods are on board the vessel at the named port of shipment.",
 sellerObligation: "Seller delivers the goods on board and clears them for export.",
 buyerObligation: "Buyer pays sea carriage and bears risk once goods are on board.",
 insuranceNote: "The goods should be insured by the buyer once goods are on board.",
 },
 },
 CFR: {
 no: {
 riskTransfer: "Risiko går over når varen er om bord på skipet i avgangshavnen.",
 sellerObligation: "Selger betaler sjøtransport til avtalt ankomsthavn.",
 buyerObligation: "Kjøper bærer risiko fra varen er om bord i avgangshavnen.",
 insuranceNote: "Varen bør forsikres av kjøper.",
 },
 en: {
 riskTransfer: "Risk transfers when the goods are on board the vessel at the port of shipment.",
 sellerObligation: "Seller pays sea carriage to the named port of destination.",
 buyerObligation: "Buyer bears risk once goods are on board at the port of shipment.",
 insuranceNote: "The goods should be insured by the buyer.",
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
 const stageCount = DP.UNLOADED + 1;
 return Math.max(0, Math.min(100, ((stage + 0.5) / stageCount) * 100));
}

function partyName(party, t) {
 return party === "seller" ? t.seller : t.buyer;
}

function Button({ active, children, onClick }) {
 return <button className={`brand-button ${active ? "active" : ""}`} onClick={onClick}>{children}</button>;
}

function Legend({ color, text }) {
 return (<div className="legend-item">
 <span className="legend-dot" style={{ background: color }} />
 <span>{text}</span>
 </div>);
}

function Bar({ title, split, markerColor }) {
 return (<div className="bar-block">
 {title && <strong>{title}</strong>}
 <div className="bar-track">
 <div className="bar-fill">
 <div style={{ width: `${split}%`, background: BRAND.seller }} />
 <div style={{ width: `${100 - split}%`, background: BRAND.buyer }} />
 </div>
 <div className="risk-line" style={{ left: `${split}%`, background: markerColor }} />
 <div className="risk-triangle" style={{ left: `${split}%`, borderTopColor: markerColor }} />
 </div>
 </div>);
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
 factory: (<>
 <path d="M3 21h18" />
 <path d="M5 21V9.5l5 2.7V9.5l5 2.7V6h4v15" />
 <path d="M8 17h2" />
 <path d="M13 17h2" />
 <path d="M8 14h2" />
 <path d="M13 14h2" />
 </>),
 truck: (<>
 <path d="M3 7.5h11v8.5H3z" />
 <path d="M14 10h4l3 3.5V16h-7z" />
 <path d="M5.5 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
 <path d="M17.5 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
 <path d="M7.5 16h8" />
 </>),
 anchor: (<>
 <circle cx="12" cy="5" r="2" />
 <path d="M12 7v12" />
 <path d="M7 10h10" />
 <path d="M5 16c1.6 3.2 4 5 7 5s5.4-1.8 7-5" />
 <path d="M5 16l2.5-.8" />
 <path d="M19 16l-2.5-.8" />
 </>),
 ship: (<>
 <path d="M4 15.5h16l-2 4H6z" />
 <path d="M7 15.5l1.5-6h7l1.5 6" />
 <path d="M9.5 9.5V5h5v4.5" />
 <path d="M3 21c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" />
 </>),
 port: (<>
 <path d="M4 20h16" />
 <path d="M6 20V10h12v10" />
 <path d="M8 10l4-5 4 5" />
 <path d="M12 5v15" />
 <path d="M8.5 14h2" />
 <path d="M13.5 14h2" />
 <path d="M8.5 17h2" />
 <path d="M13.5 17h2" />
 </>),
 mapPin: (<>
 <path d="M12 21s7-5.1 7-11a7 7 0 0 0-14 0c0 5.9 7 11 7 11z" />
 <circle cx="12" cy="10" r="2.5" />
 </>),
 check: (<>
 <circle cx="12" cy="12" r="9" />
 <path d="M8 12.5l2.6 2.6L16.5 9" />
 </>),
 shield: (<>
 <path d="M12 3 5.5 5.6v5.7c0 4.1 2.7 7.8 6.5 9.1 3.8-1.3 6.5-5 6.5-9.1V5.6z" />
 <path d="M8.8 12.2 11 14.4l4.4-5" />
 </>),
 document: (<>
 <path d="M7 3h7l4 4v14H7z" />
 <path d="M14 3v5h5" />
 <path d="M9.5 12h5" />
 <path d="M9.5 15h5" />
 <path d="M9.5 18h3" />
 </>),
 warning: (<>
 <path d="M12 3.5 2.8 19.5h18.4z" />
 <path d="M12 9v4.2" />
 <path d="M12 17h.01" />
 </>),
 person: (<>
 <circle cx="12" cy="7" r="3.2" />
 <path d="M5.5 21c.8-4.2 3.1-6.2 6.5-6.2s5.7 2 6.5 6.2" />
 </>),
 rail: (<>
 <path d="M7 3h10a2 2 0 0 1 2 2v9a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V5a2 2 0 0 1 2-2z" />
 <path d="M7 8h10" />
 <path d="M8 21l2-3" />
 <path d="M16 18l2 3" />
 <circle cx="9" cy="14" r="1.2" />
 <circle cx="15" cy="14" r="1.2" />
 </>),
 plane: (<>
 <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 20.5 3s-3-.5-4.5 1L12.5 7.5 4.3 5.7a1 1 0 0 0-.9.3l-.7.7a1 1 0 0 0 .1 1.6L8 12l-2 3H3l-1 1 4 2 2 4 1-1v-3l3-2 3.7 5.2a1 1 0 0 0 1.6.1l.7-.7a1 1 0 0 0 .3-.9z" />
 </>),
 };

 return <svg {...common}>{icons[name]}</svg>;
}
function TransportIcons({ term }) {
 const icons = term.seaOnly ? ["ship"] : ["truck", "rail", "plane", "ship"];

 return (<>
 {icons.map((icon) => (<SvgIcon key={icon} name={icon} size={32} />))}
 </>);
}

function StageTimeline({ stages, riskStage, costStage }) {
 return (<div className="stage-wrapper">
 <div className="stage-track">
 <div className="stage-main-line" aria-hidden="true" />

 <div className="stage-grid">
 {stages.map((stage, index) => {
 const isRisk = index === riskStage;
 const isCost = index === costStage;
 const transferClass = isRisk && isCost
 ? "transfer-both"
 : isRisk
 ? "transfer-risk"
 : isCost
 ? "transfer-cost"
 : "";

 return (<div key={stage.key} className={`stage-card ${transferClass}`}>
 <div className="stage-number">{index + 1}</div>
 <div className="stage-icon">
 <SvgIcon name={stage.icon} />
 </div>
 <div className="stage-label">{stage.label}</div>
 </div>);
 })}
 </div>
 </div>
 </div>);
}

function InfoPanel({ term, t }) {
 const hasMandatoryInsurance = term.insuranceBy && term.insuranceFor;

 return (<div className="info-grid">
 <div className="info-box">
 <h3>{t.insurance}</h3>
 {hasMandatoryInsurance ? (<>
 <p>{t.insuranceBy}: <strong>{partyName(term.insuranceBy, t)}</strong></p>
 <p>{t.insuranceFor}: <strong>{partyName(term.insuranceFor, t)}</strong></p>
 </>) : (<>
 <p>{t.shouldBeInsuredBy}: <strong>{partyName(term.insuranceRecommended, t)}</strong></p>
 <p>{t.noMandatoryInsurance}</p>
 </>)}
 </div>

 <div className="info-box">
 <h3>{t.customs}</h3>
 <p>{t.exportClearance}: <strong>{partyName(term.exportBy, t)}</strong></p>
 <p>{t.importClearance}: <strong>{partyName(term.importBy, t)}</strong></p>
 </div>
 </div>);
}

function getTermDetails(term, lang) {
 if (term.code === "FCA") {
 const variant = term.fcaVariant === "otherPlace" ? "otherPlace" : "sellerPremises";
 return TERM_DETAILS.FCA?.[variant]?.[lang];
 }

 return TERM_DETAILS[term.code]?.[lang];
}

function TermDetails({ term, lang, t }) {
 const details = getTermDetails(term, lang);

 if (!details) return null;

 return (<div className="details-grid always-visible-details">
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
 </div>);
}


function ResponsibilityCards({ term, lang, t }) {
 const details = getTermDetails(term, lang);
 const hasMandatoryInsurance = term.insuranceBy && term.insuranceFor;

 if (!details) return null;

 return (<section className="responsibility-section" aria-label="Responsibility details">
 <div className="responsibility-top-grid">
 <article className="responsibility-card responsibility-card-green">
 <div className="responsibility-card-header">
 <span className="responsibility-icon"><SvgIcon name="shield" size={24} /></span>
 <h3>{t.insurance}</h3>
 </div>
 <div className="responsibility-card-body">
 {hasMandatoryInsurance ? (<>
 <p>{t.insuranceBy}: <strong>{partyName(term.insuranceBy, t)}</strong></p>
 <p>{t.insuranceFor}: <strong>{partyName(term.insuranceFor, t)}</strong></p>
 </>) : (<>
 <p>{t.shouldBeInsuredBy}: <strong>{partyName(term.insuranceRecommended, t)}</strong></p>
 <p>{t.noMandatoryInsurance}</p>
 </>)}
 </div>
 </article>

 <article className="responsibility-card responsibility-card-gray">
 <div className="responsibility-card-header">
 <span className="responsibility-icon"><SvgIcon name="document" size={24} /></span>
 <h3>{t.customs}</h3>
 </div>
 <div className="responsibility-card-body">
 <p>{t.exportClearance}: <strong>{partyName(term.exportBy, t)}</strong></p>
 <p>{t.importClearance}: <strong>{partyName(term.importBy, t)}</strong></p>
 </div>
 </article>

 <article className="responsibility-card responsibility-card-orange">
 <div className="responsibility-card-header">
 <span className="responsibility-icon"><SvgIcon name="warning" size={24} /></span>
 <h3>{t.riskTransfer}</h3>
 </div>
 <div className="responsibility-card-body">
 <p>{details.riskTransfer}</p>
 </div>
 </article>

 <article className="responsibility-card responsibility-card-green">
 <div className="responsibility-card-header">
 <span className="responsibility-icon"><SvgIcon name="shield" size={24} /></span>
 <h3>{t.insuranceNote}</h3>
 </div>
 <div className="responsibility-card-body">
 <p>{details.insuranceNote}</p>
 </div>
 </article>
 </div>

 <div className="responsibility-bottom-grid">
 <article className="responsibility-card responsibility-card-large responsibility-card-seller">
 <div className="responsibility-card-header">
 <span className="responsibility-icon"><SvgIcon name="person" size={24} /></span>
 <h3>{t.sellerObligation}</h3>
 </div>
 <div className="responsibility-card-body">
 <p>{details.sellerObligation}</p>
 </div>
 </article>

 <article className="responsibility-card responsibility-card-large responsibility-card-buyer">
 <div className="responsibility-card-header">
 <span className="responsibility-icon"><SvgIcon name="person" size={24} /></span>
 <h3>{t.buyerObligation}</h3>
 </div>
 <div className="responsibility-card-body">
 <p>{details.buyerObligation}</p>
 </div>
 </article>
 </div>
 </section>);
}

function Visual({ label, term, stages, t, lang }) {
 return (<section className="visual-card">
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

 <StageTimeline stages={stages} riskStage={term.risk} costStage={term.cost} />

 <Bar title="" split={pct(term.risk)} markerColor={BRAND.risk} />

 <div className="risk-label-bottom">
 <strong>{t.risk}</strong>
 </div>

 <ResponsibilityCards term={term} lang={lang} t={t} />
 </section>);
}

function Glossary({ lang }) {
 const items =
 lang === "no"
 ? [
 ["Kostnad", "Viser hvem som bærer transportkostnadene på ulike deler av transportløpet."],
 ["Risiko", "Viser hvem som bærer risikoen dersom varen blir skadet eller går tapt."],
 ["Risikoovergang", "Tidspunktet hvor risikoen for skade eller tap går fra selger til kjøper."],
 ["Kostnadsovergang", "Punktet hvor hovedansvaret for kostnader går fra selger til kjøper."],
 ["Forsikring", "Viser hvem som skal eller bør forsikre varen."],
 ["Bør forsikres av", "Parten som bør sørge for vareforsikring basert på hvem som bærer risikoen."],
 ["Tollklarering", "Toll- og dokumentansvar knyttet til eksport og import."],
 ["Eksportklarering", "Ansvar for å klargjøre varen for eksport ut av avsenderlandet."],
 ["Importklarering", "Ansvar for toll, avgifter og dokumenter ved innførsel i mottakerlandet."],
 ["Selgers risiko", "Skaden rammer før risikoen har gått over til kjøper."],
 ["Kjøpers risiko", "Skaden rammer etter at risikoen har gått over til kjøper."],
 ["Transportløp", "Den visuelle reisen fra selgers sted til lossing ved mottak."],
 ["Ankomststed", "Stedet varen skal leveres til i henhold til avtalen."],
 ]
 : [
 ["Cost", "Shows who carries the transport costs during different parts of the journey."],
 ["Risk", "Shows who carries the risk if the goods are damaged or lost."],
 ["Risk transfer", "The point where risk of loss or damage transfers from seller to buyer."],
 ["Cost transfer", "The point where the main cost responsibility transfers from seller to buyer."],
 ["Insurance", "Shows who must or should insure the goods."],
 ["Should be insured by", "The party who should arrange cargo insurance based on who carries the risk."],
 ["Customs clearance", "Customs and documentation responsibility related to export and import."],
 ["Export clearance", "Responsibility for preparing the goods for export from the country of dispatch."],
 ["Import clearance", "Responsibility for customs, duties and documents when importing the goods."],
 ["Seller’s risk", "Damage occurs before risk has transferred to the buyer."],
 ["Buyer’s risk", "Damage occurs after risk has transferred to the buyer."],
 ["Transport journey", "The visual journey from the seller’s place to unloading at destination."],
 ["Place of destination", "The place where the goods are to be delivered under the agreement."],
 ];

 return (<div className="glossary-grid">
 {items.map(([title, body]) => (<div className="info-box" key={title}>
 <h3>{title}</h3>
 <p>{body}</p>
 </div>))}
 </div>);
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
 risk: fcaVariant === "sellerPremises" ? DP.SELLER_PLACE : DP.DEPARTURE_PORT,
 cost: fcaVariant === "sellerPremises" ? DP.SELLER_PLACE : DP.DEPARTURE_PORT,
 fcaVariant,
 }
 : selectedTerm;

 const riskText = damageAt <= pct(resolvedSelectedTerm.risk) ? t.sellerRisk : t.buyerRisk;

 function changeTransportMode(mode) {
 const availableTerms = TRANSPORT_FILTERS[mode];
 setTransportMode(mode);
 setSelectedCode(availableTerms[0].code);
 setCompareCode(mode === "sea" ? "CIF" : "CIP");
 }

 return (<main className="app-shell">
 <header className="app-header">
 <div className="header-logo">
 <img src="/berkley-logo.png" alt="Berkley Nordic" className="berkley-logo" />
 </div>

 <div className="header-title">
 <h1>{t.title}</h1>
 </div>

 <div className="language-controls header-language">
 {Object.keys(LANGS).map((key) => (<Button key={key} active={lang === key} onClick={() => setLang(key)}>
 {LANGS[key]}
 </Button>))}
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
 {terms.map((term) => (<Button key={term.code} active={selectedCode === term.code} onClick={() => setSelectedCode(term.code)}>
 {term.code}
 </Button>))}
 </div>

 {selectedCode === "FCA" && (<div className="sub-section">
 <h3>{t.fcaVariantLabel}</h3>
 <div className="button-row">
 <Button active={fcaVariant === "sellerPremises"} onClick={() => setFcaVariant("sellerPremises")}>
 {t.fcaSellerPremises}
 </Button>
 <Button active={fcaVariant === "otherPlace"} onClick={() => setFcaVariant("otherPlace")}>
 {t.fcaOtherPlace}
 </Button>
 </div>
 </div>)}

 {compare && (<div className="sub-section">
 <h3>{t.compareWith}</h3>
 <div className="button-row">
 {terms.map((term) => (<Button key={term.code} active={compareCode === term.code} onClick={() => setCompareCode(term.code)}>
 {term.code}
 </Button>))}
 </div>
 </div>)}
 </section>

 {!compare ? (<Visual label={resolvedSelectedTerm.displayName} term={resolvedSelectedTerm} stages={stages} t={t} lang={lang} />) : (<div className="compare-grid">
 <Visual label={`A: ${resolvedSelectedTerm.code}`} term={resolvedSelectedTerm} stages={stages} t={t} lang={lang} />
 <Visual label={`B: ${compareTerm.code}`} term={compareTerm} stages={stages} t={t} lang={lang} />
 </div>)}

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
 </main>);
}