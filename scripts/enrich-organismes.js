#!/usr/bin/env node
/* eslint-disable */
// Script d'enrichissement des organismes départementaux
// Ajoute 12 nouveaux champs à chaque département métropolitain
// NE TOUCHE PAS aux DOM-TOM (971+, 975, 977, 978, 986, 987, 988)

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'organismes.json');

// Mapping département -> région
const DEPT_TO_REGION = {
  // Île-de-France
  '75': 'Île-de-France', '77': 'Île-de-France', '78': 'Île-de-France',
  '91': 'Île-de-France', '92': 'Île-de-France', '93': 'Île-de-France',
  '94': 'Île-de-France', '95': 'Île-de-France',
  // Auvergne-Rhône-Alpes
  '01': 'Auvergne-Rhône-Alpes', '03': 'Auvergne-Rhône-Alpes',
  '07': 'Auvergne-Rhône-Alpes', '15': 'Auvergne-Rhône-Alpes',
  '26': 'Auvergne-Rhône-Alpes', '38': 'Auvergne-Rhône-Alpes',
  '42': 'Auvergne-Rhône-Alpes', '43': 'Auvergne-Rhône-Alpes',
  '63': 'Auvergne-Rhône-Alpes', '69': 'Auvergne-Rhône-Alpes',
  '73': 'Auvergne-Rhône-Alpes', '74': 'Auvergne-Rhône-Alpes',
  // PACA
  '04': "Provence-Alpes-Côte d'Azur", '05': "Provence-Alpes-Côte d'Azur",
  '06': "Provence-Alpes-Côte d'Azur", '13': "Provence-Alpes-Côte d'Azur",
  '83': "Provence-Alpes-Côte d'Azur", '84': "Provence-Alpes-Côte d'Azur",
  // Occitanie
  '09': 'Occitanie', '11': 'Occitanie', '12': 'Occitanie', '30': 'Occitanie',
  '31': 'Occitanie', '32': 'Occitanie', '34': 'Occitanie', '46': 'Occitanie',
  '48': 'Occitanie', '65': 'Occitanie', '66': 'Occitanie', '81': 'Occitanie',
  '82': 'Occitanie',
  // Nouvelle-Aquitaine
  '16': 'Nouvelle-Aquitaine', '17': 'Nouvelle-Aquitaine', '19': 'Nouvelle-Aquitaine',
  '23': 'Nouvelle-Aquitaine', '24': 'Nouvelle-Aquitaine', '33': 'Nouvelle-Aquitaine',
  '40': 'Nouvelle-Aquitaine', '47': 'Nouvelle-Aquitaine', '64': 'Nouvelle-Aquitaine',
  '79': 'Nouvelle-Aquitaine', '86': 'Nouvelle-Aquitaine', '87': 'Nouvelle-Aquitaine',
  // Pays de la Loire
  '44': 'Pays de la Loire', '49': 'Pays de la Loire', '53': 'Pays de la Loire',
  '72': 'Pays de la Loire', '85': 'Pays de la Loire',
  // Bretagne
  '22': 'Bretagne', '29': 'Bretagne', '35': 'Bretagne', '56': 'Bretagne',
  // Hauts-de-France
  '02': 'Hauts-de-France', '59': 'Hauts-de-France', '60': 'Hauts-de-France',
  '62': 'Hauts-de-France', '80': 'Hauts-de-France',
  // Grand Est
  '08': 'Grand Est', '10': 'Grand Est', '51': 'Grand Est', '52': 'Grand Est',
  '54': 'Grand Est', '55': 'Grand Est', '57': 'Grand Est', '67': 'Grand Est',
  '68': 'Grand Est', '88': 'Grand Est',
  // Bourgogne-Franche-Comté
  '21': 'Bourgogne-Franche-Comté', '25': 'Bourgogne-Franche-Comté',
  '39': 'Bourgogne-Franche-Comté', '58': 'Bourgogne-Franche-Comté',
  '70': 'Bourgogne-Franche-Comté', '71': 'Bourgogne-Franche-Comté',
  '89': 'Bourgogne-Franche-Comté', '90': 'Bourgogne-Franche-Comté',
  // Centre-Val de Loire
  '18': 'Centre-Val de Loire', '28': 'Centre-Val de Loire',
  '36': 'Centre-Val de Loire', '37': 'Centre-Val de Loire',
  '41': 'Centre-Val de Loire', '45': 'Centre-Val de Loire',
  // Normandie
  '14': 'Normandie', '27': 'Normandie', '50': 'Normandie',
  '61': 'Normandie', '76': 'Normandie',
  // Corse
  '2A': 'Corse', '2B': 'Corse',
};

// CCI régionales (sites spécifiques connus)
const CCI_REGION_SITES = {
  'Île-de-France': 'https://www.cci-paris-idf.fr',
  'Auvergne-Rhône-Alpes': 'https://www.auvergne-rhone-alpes.cci.fr',
  "Provence-Alpes-Côte d'Azur": 'https://www.paca.cci.fr',
  'Occitanie': 'https://www.occitanie.cci.fr',
  'Nouvelle-Aquitaine': 'https://www.nouvelle-aquitaine.cci.fr',
  'Pays de la Loire': 'https://www.paysdelaloire.cci.fr',
  'Bretagne': 'https://www.bretagne.cci.fr',
  'Hauts-de-France': 'https://www.hautsdefrance.cci.fr',
  'Grand Est': 'https://www.grandest.cci.fr',
  'Bourgogne-Franche-Comté': 'https://www.bourgognefranchecomte.cci.fr',
  'Centre-Val de Loire': 'https://www.centre.cci.fr',
  'Normandie': 'https://www.normandie.cci.fr',
  'Corse': 'https://www.ccihc.fr',
};

// Sites Initiative régionaux/départementaux (génériques sur initiative-france)
const INITIATIVE_SITES = {
  'Île-de-France': 'https://www.initiative-iledefrance.fr',
};

// Départements à forte composante agricole (où Solidarité Paysans est pertinent)
const DEPTS_AGRICOLES = new Set([
  '01','02','03','07','08','10','11','12','15','16','17','18','19',
  '21','22','23','24','25','26','27','28','29','32','35','36','37',
  '38','39','40','41','43','44','45','46','47','49','50','51','52',
  '53','55','56','58','60','61','62','63','64','65','70','71','72',
  '76','77','79','80','81','82','85','86','87','88','89',
  '2A','2B'
]);

// Codes DOM-TOM à exclure
const DOM_TOM = new Set(['971','972','973','974','975','976','977','978','986','987','988']);

function makeArticle(nom) {
  // Préfixe correct pour "de" : "de la", "des", "du", "de l'", "de"
  const lower = nom.toLowerCase();
  // Pluriels et particularités (toujours "des")
  const pluriels = new Set([
    'alpes-maritimes','alpes-de-haute-provence','hautes-alpes','ardennes',
    'bouches-du-rhône',"côtes-d'armor",'deux-sèvres','hauts-de-seine',
    'landes','pyrénées-atlantiques','pyrénées-orientales','hautes-pyrénées',
    'vosges','yvelines',
  ]);
  if (pluriels.has(lower)) return `des ${nom}`;
  // Masculins fréquents (toujours "du")
  const masculinsConsonne = new Set([
    'ain','allier','calvados','cantal','cher','doubs','finistère','gard','gers',
    'jura','loir-et-cher','loiret','lot','lot-et-garonne','maine-et-loire','morbihan',
    'nord','pas-de-calais','puy-de-dôme','bas-rhin','haut-rhin','rhône','tarn',
    'tarn-et-garonne',"val-d'oise",'val-de-marne','var','vaucluse',
    'territoire de belfort',
  ]);
  if (masculinsConsonne.has(lower)) return `du ${nom}`;
  // Féminins fréquents (toujours "de la")
  const feminins = new Set([
    'aube','aude','charente','charente-maritime','corrèze','creuse','dordogne','drôme',
    'gironde','haute-garonne','haute-loire','haute-marne','haute-saône','haute-savoie',
    'haute-vienne','haute-corse','lozère','manche','marne','mayenne','meurthe-et-moselle',
    'meuse','moselle','nièvre','sarthe','savoie','seine-maritime','seine-et-marne',
    'seine-saint-denis','somme','vendée','vienne','réunion','martinique','guadeloupe',
    'guyane',"côte-d'or",
  ]);
  if (feminins.has(lower)) return `de la ${nom}`;
  // Voyelles initiales → "de l'"
  if (/^[aeiouéèêâîô]/i.test(nom)) return `de l'${nom}`;
  // Default
  return `de ${nom}`;
}

function buildEnrichments(code, dept) {
  const region = DEPT_TO_REGION[code];
  if (!region) {
    throw new Error(`Région inconnue pour le département ${code}`);
  }
  const chefLieu = dept.chefLieu;
  const nom = dept.nom;
  const article = makeArticle(nom);

  const enrichments = {
    ordreMedecins: {
      nom: `Conseil départemental de l'Ordre des médecins ${article}`,
      type: 'Ordre professionnel — entraide médicale',
      site: 'https://www.conseil-national.medecin.fr',
    },
    ordreAvocats: {
      nom: `Barreau de ${chefLieu}`,
      type: 'Ordre des avocats — commission entraide',
      adresse: chefLieu,
      site: 'https://www.cnb.avocat.fr',
    },
    chambreNotaires: {
      nom: `Chambre des notaires ${article}`,
      type: 'Ordre des notaires — entraide',
      adresse: chefLieu,
      site: 'https://www.notaires.fr',
    },
    ordrePharmaciens: {
      nom: `Conseil régional de l'Ordre des pharmaciens ${region}`,
      type: 'Ordre des pharmaciens',
      site: 'https://www.ordre.pharmacien.fr',
    },
    urpsMedecins: {
      nom: `URPS Médecins ${region}`,
      type: 'Union régionale des professionnels de santé',
      site: 'https://www.urps-ml.org',
    },
    urssafRegional: {
      nom: `URSSAF ${region}`,
      type: 'URSSAF régionale (recouvrement)',
      telephone: '3957',
      site: 'https://www.urssaf.fr',
    },
    bge: {
      nom: `BGE ${region}`,
      type: 'Accompagnement créateurs/repreneurs',
      site: 'https://www.bge.asso.fr',
    },
    initiativeFrance: {
      nom: `Initiative ${nom}`,
      type: "Prêts d'honneur sans intérêts",
      site: INITIATIVE_SITES[region] || 'https://www.initiative-france.fr',
    },
    franceActive: {
      nom: `France Active ${region}`,
      type: 'Garanties bancaires + prêts solidaires',
      site: 'https://www.franceactive.org',
    },
    mdph: {
      nom: `MDPH ${nom}`,
      type: 'Handicap et travail',
      adresse: chefLieu,
      site: 'https://www.mdph.fr',
    },
    maisonJustice: {
      nom: `Maison de Justice et du Droit de ${chefLieu}`,
      type: 'Accès au droit gratuit',
      adresse: chefLieu,
      site: 'https://www.justice.fr',
    },
  };

  if (DEPTS_AGRICOLES.has(code)) {
    enrichments.solidaritePaysans = {
      nom: `Solidarité Paysans ${region}`,
      type: 'Accompagnement agriculteurs en difficulté',
      telephone: '01 43 63 83 83',
      site: 'https://solidaritepaysans.org',
    };
  }

  return enrichments;
}

function enrichDept(code, dept) {
  const enrichments = buildEnrichments(code, dept);

  // Améliorer les champs existants : ajouter site CCI régional si disponible
  const region = DEPT_TO_REGION[code];
  const cciRegionSite = CCI_REGION_SITES[region];
  if (cciRegionSite && dept.cci) {
    dept.cci.site = cciRegionSite;
  }
  // CMA : utiliser site CMA France régional générique
  if (dept.cma) {
    dept.cma.site = 'https://www.cma-france.fr';
  }

  // Ajouter (ou écraser) les nouveaux champs pour garantir des valeurs cohérentes
  for (const [key, val] of Object.entries(enrichments)) {
    dept[key] = val;
  }

  return dept;
}

function main() {
  const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

  let count = 0;
  for (const code of Object.keys(data)) {
    if (DOM_TOM.has(code)) {
      // Ne pas toucher aux DOM-TOM
      continue;
    }
    if (!DEPT_TO_REGION[code]) {
      console.warn(`SKIP: pas de région pour ${code}`);
      continue;
    }
    enrichDept(code, data[code]);
    count++;
  }

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Enrichi ${count} départements métropolitains.`);
}

main();
