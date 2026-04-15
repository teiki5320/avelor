// Generates data/organismes.json from departements-base.json
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const base = JSON.parse(
  readFileSync(resolve(__dirname, '../data/departements-base.json'), 'utf8')
);

const out = {};
for (const [code, nom, chefLieu] of base) {
  out[code] = {
    code,
    nom,
    chefLieu,
    tribunal: {
      nom: `Tribunal de commerce de ${chefLieu}`,
      type: 'Tribunal de commerce',
      adresse: chefLieu,
      site: 'https://www.tribunal-de-commerce.fr',
    },
    cci: {
      nom: `CCI ${nom}`,
      type: 'Chambre de commerce et d\u2019industrie',
      adresse: chefLieu,
      site: 'https://www.cci.fr',
    },
    urssaf: {
      nom: `URSSAF ${nom}`,
      type: 'URSSAF',
      telephone: '36 98',
      site: 'https://www.urssaf.fr',
    },
    sie: {
      nom: `Service des impôts des entreprises de ${chefLieu}`,
      type: 'SIE',
      adresse: chefLieu,
      site: 'https://www.impots.gouv.fr',
    },
    banqueDeFrance: {
      nom: `Banque de France – succursale de ${chefLieu}`,
      type: 'Médiation du crédit',
      telephone: '0810 00 12 10',
      site: 'https://mediateur-credit.banque-france.fr',
    },
    dreets: {
      nom: `DREETS ${nom}`,
      type: 'Direction régionale de l\u2019économie',
      site: 'https://dreets.gouv.fr',
    },
  };
}

writeFileSync(
  resolve(__dirname, '../data/organismes.json'),
  JSON.stringify(out, null, 2)
);
console.log(`Generated ${Object.keys(out).length} departments.`);
