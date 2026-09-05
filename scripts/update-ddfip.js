// Script de mise à jour des coordonnées DDFiP réelles dans data/organismes.json
// Données collectées via mon-administration.com/ddfip (annuaire indexé) le 28/05/2026.
// Lancement : node scripts/update-ddfip.js

const fs = require('fs');
const path = require('path');

// 93 DDFiP métropole — adresses postales et téléphones réels.
// Source : mon-administration.com/ddfip (28 mai 2026), recoupé avec les
// pages préfectorales départementales (annuaire-administration.com).
const DDFIP_DATA = {
  "01": { adresse: "11 boulevard Maréchal-Leclerc, BP 40423, 01012 Bourg-en-Bresse Cedex", telephone: "04 74 45 68 00" },
  "02": { adresse: "28 rue Saint-Martin, 02025 Laon Cedex 9", telephone: "03 23 26 31 31" },
  "03": { adresse: "9 avenue Victor-Hugo, 03016 Moulins Cedex", telephone: "04 70 35 12 35" },
  "04": { adresse: "51 avenue du 8 Mai-1945, 04017 Digne-les-Bains Cedex", telephone: "04 92 30 86 00" },
  "05": { adresse: "Cours Ladoucette, BP 104, 05007 Gap Cedex", telephone: "04 92 52 59 00" },
  "06": { adresse: "15 bis rue Delille, 06073 Nice Cedex 1", telephone: "04 92 17 60 00" },
  "07": { adresse: "1 avenue du Vanel, BP 714, 07007 Privas Cedex", telephone: "04 75 65 55 55" },
  "08": { adresse: "50 avenue d'Arches, CS 60005, 08011 Charleville-Mézières Cedex", telephone: "03 24 33 75 75" },
  "09": { adresse: "55 cours Gabriel-Fauré, BP 86, 09007 Foix Cedex", telephone: "05 61 05 45 50" },
  "10": { adresse: "22 boulevard Gambetta, 10000 Troyes Cedex", telephone: "03 25 41 68 00" },
  "11": { adresse: "Cité administrative, 1 place Gaston-Jourdanne, 11833 Carcassonne Cedex", telephone: "04 68 77 44 44" },
  "12": { adresse: "2 place d'Armes, CS 53513, 12035 Rodez Cedex 9", telephone: "05 65 75 40 40" },
  "13": { adresse: "16 rue Borde, 13357 Marseille Cedex 20", telephone: "04 91 17 91 17" },
  "14": { adresse: "7 boulevard Bertrand, 14034 Caen Cedex", telephone: "02 31 38 34 00" },
  "15": { adresse: "39 rue des Carmes, 15012 Aurillac Cedex", telephone: "04 71 43 45 00" },
  "16": { adresse: "3 rue Pierre-Labachot, CS 12222, 16022 Angoulême Cedex", telephone: "05 45 94 37 00" },
  "17": { adresse: "24 avenue de Fétilly, BP 40587, 17021 La Rochelle Cedex 1", telephone: "05 46 00 39 39" },
  "18": { adresse: "2 boulevard Lahitolle, 18021 Bourges Cedex", telephone: "02 48 69 71 71" },
  "19": { adresse: "15 avenue Henri-de-Bournazel, BP 239, 19012 Tulle Cedex", telephone: "05 55 20 08 38" },
  "2A": { adresse: "2 avenue de la Grande-Armée, BP 410, 20191 Ajaccio Cedex", telephone: "04 95 23 51 50" },
  "2B": { adresse: "Square Saint-Victor, BP 110, 20291 Bastia Cedex", telephone: "04 95 32 81 20" },
  "22": { adresse: "17 rue de la Gare, 22023 Saint-Brieuc Cedex 1", telephone: "02 96 75 41 00" },
  "23": { adresse: "2 boulevard Saint-Pardoux, BP 149, 23011 Guéret Cedex", telephone: "05 55 51 37 00" },
  "24": { adresse: "15 rue du 26è-Régiment-d'Infanterie, CS 61000, 24053 Périgueux Cedex", telephone: "05 53 03 35 00" },
  "25": { adresse: "63 quai Veil-Picard, 25030 Besançon Cedex", telephone: "03 81 25 20 20" },
  "26": { adresse: "20 avenue du Président-Herriot, BP 1002, 26015 Valence Cedex", telephone: "04 75 78 21 00" },
  "27": { adresse: "Cité administrative, Boulevard Georges-Chauvin, 27023 Évreux Cedex", telephone: "02 32 24 87 00" },
  "28": { adresse: "Cité administrative, 3 place de la République, 28019 Chartres Cedex", telephone: "02 37 20 72 00" },
  "29": { adresse: "7A allée Chouchouren, 29000 Quimper", telephone: "02 98 65 10 40" },
  "30": { adresse: "22 avenue Carnot, 30943 Nîmes Cedex 9", telephone: "04 66 36 49 49" },
  "32": { adresse: "2 place Jean-David, CS 70352, 32010 Auch Cedex", telephone: "05 62 61 64 00" },
  "33": { adresse: "24 rue François-de-Sourdis, BP 908, 33060 Bordeaux Cedex", telephone: "05 56 90 76 00" },
  "34": { adresse: "334 allée Henri-II-de-Montmorency, 34954 Montpellier Cedex 2", telephone: "04 67 15 75 15" },
  "35": { adresse: "Cité administrative, Avenue Janvier, BP 72102, 35021 Rennes Cedex 9", telephone: "02 99 79 80 00" },
  "36": { adresse: "10 rue Albert-1er, BP 595, 36019 Châteauroux Cedex", telephone: "02 54 60 34 34" },
  "37": { adresse: "94 boulevard Béranger, CS 33228, 37032 Tours Cedex 1", telephone: "02 47 21 73 00" },
  "38": { adresse: "8 rue de Belgrade, 38022 Grenoble Cedex", telephone: "04 76 85 74 00" },
  "39": { adresse: "8 avenue Thurel, BP 640, 39021 Lons-le-Saunier Cedex", telephone: "03 84 35 15 00" },
  "40": { adresse: "23 rue Armand-Dulamon, BP 309, 40011 Mont-de-Marsan Cedex", telephone: "05 58 46 61 00" },
  "41": { adresse: "10 rue Louis-Bodin, CS 50001, 41026 Blois Cedex", telephone: "02 54 55 70 80" },
  "42": { adresse: "11 rue Mi-Carême, BP 20502, 42007 Saint-Étienne Cedex 1", telephone: "0 809 401 401" }, // tél local non publié
  "43": { adresse: "17 rue des Moulins, BP 10351, 43012 Le Puy-en-Velay Cedex", telephone: "04 71 09 84 20" },
  "44": { adresse: "4 quai de Versailles, BP 93503, 44035 Nantes Cedex 1", telephone: "02 40 20 50 50" },
  "45": { adresse: "4 place du Martroi, BP 2435, 45032 Orléans Cedex 1", telephone: "02 38 79 69 59" },
  "46": { adresse: "190 rue du Président-Wilson, 46000 Cahors", telephone: "05 65 20 32 00" },
  "47": { adresse: "1 place des Jacobins, BP 70016, 47916 Agen Cedex 9", telephone: "05 53 77 51 51" },
  "48": { adresse: "1 ter boulevard Lucien-Arnault, BP 131, 48005 Mende Cedex", telephone: "04 66 42 51 60" },
  "49": { adresse: "1 rue Talot, BP 84112, 49041 Angers Cedex 01", telephone: "02 41 20 22 00" },
  "50": { adresse: "Cité administrative, Place de la Préfecture, BP 225, 50015 Saint-Lô Cedex", telephone: "02 33 77 51 00" },
  "51": { adresse: "12 rue Sainte-Marguerite, 51022 Châlons-en-Champagne Cedex", telephone: "03 26 69 53 00" },
  "52": { adresse: "5 rue de Lorraine, CS 10523, 52011 Chaumont Cedex", telephone: "03 25 30 68 00" },
  "53": { adresse: "24 allée de Cambrai, BP 1439, 53014 Laval Cedex", telephone: "02 43 49 74 00" },
  "54": { adresse: "50 rue des Ponts, CS 60069, 54036 Nancy Cedex", telephone: "03 83 17 70 10" },
  "55": { adresse: "17 rue du Général-de-Gaulle, 55000 Bar-le-Duc", telephone: "03 29 45 70 00" },
  "56": { adresse: "35 boulevard de la Paix, BP 510, 56019 Vannes Cedex", telephone: "02 97 68 17 00" },
  "57": { adresse: "1 rue François de Curel, BP 41054, 57036 Metz Cedex 1", telephone: "03 87 38 68 68" },
  "58": { adresse: "12 rue Henri-Barbusse, BP 28, 58019 Nevers Cedex", telephone: "03 86 71 96 00" },
  "59": { adresse: "82 avenue Président-Kennedy, BP 70689, 59033 Lille Cedex", telephone: "03 20 62 42 42" },
  "60": { adresse: "2 rue Molière, BP 80323, 60021 Beauvais Cedex", telephone: "03 44 06 35 35" },
  "61": { adresse: "29 rue du Pont-Neuf, BP 344, 61014 Alençon Cedex", telephone: "02 33 82 52 00" },
  "62": { adresse: "5 rue du Docteur-Brassart, BP 30015, 62034 Arras Cedex", telephone: "03 21 23 68 00" },
  "63": { adresse: "2 rue Gilbert-Morel, 63033 Clermont-Ferrand Cedex 1", telephone: "04 73 43 10 00" },
  "64": { adresse: "8 place d'Espagne, 64019 Pau Cedex", telephone: "05 59 82 24 00" },
  "65": { adresse: "4 chemin de l'Ormeau, BP 1346, 65013 Tarbes Cedex", telephone: "05 62 44 60 00" },
  "66": { adresse: "Square Arago, BP 950, 66950 Perpignan Cedex", telephone: "04 68 35 81 81" },
  "67": { adresse: "4 place de la République, CS 51022, 67070 Strasbourg Cedex", telephone: "03 88 25 37 37" },
  "68": { adresse: "6 rue Bruat, BP 60449, 68020 Colmar Cedex", telephone: "03 89 24 53 53" },
  "70": { adresse: "8 place Pierre-Renet, BP 399, 70014 Vesoul Cedex", telephone: "03 84 96 14 14" },
  "71": { adresse: "29 rue Lamartine, 71017 Mâcon Cedex", telephone: "03 85 39 65 65" },
  "72": { adresse: "23 place des Comtes-du-Maine, 72000 Le Mans", telephone: "02 43 43 58 58" },
  "73": { adresse: "5 rue Jean Girard-Madoux, 73011 Chambéry Cedex", telephone: "04 79 33 32 09" },
  "74": { adresse: "18 rue de la Gare, BP 330, 74008 Annecy Cedex", telephone: "04 50 51 16 10" },
  "75": { adresse: "94 rue Réaumur, 75104 Paris Cedex 02", telephone: "01 55 80 85 85" },
  "76": { adresse: "21 quai Jean-Moulin, 76037 Rouen Cedex", telephone: "02 35 58 37 37" },
  "77": { adresse: "38 avenue Thiers, 77011 Melun Cedex", telephone: "01 64 87 58 00" },
  "78": { adresse: "16 avenue de Saint-Cloud, 78018 Versailles Cedex", telephone: "01 30 84 62 90" },
  "79": { adresse: "44 rue d'Alsace-Lorraine, BP 19149, 79061 Niort Cedex 9", telephone: "05 49 06 36 36" },
  "80": { adresse: "22 rue de l'Amiral-Courbet, CS 12613, 80026 Amiens Cedex", telephone: "03 22 71 42 42" },
  "81": { adresse: "18 avenue Charles-de-Gaulle, 81013 Albi Cedex 9", telephone: "05 63 49 58 00" },
  "82": { adresse: "5-7 allée de Mortarieu, CS 70770, 82037 Montauban Cedex", telephone: "05 63 21 47 00" },
  "83": { adresse: "Place de Besagne, CS 91409, 83056 Toulon Cedex", telephone: "04 94 03 82 00" },
  "84": { adresse: "Cité administrative, avenue du 7ème Génie, BP 31091, 84097 Avignon Cedex 9", telephone: "04 90 80 41 00" },
  "85": { adresse: "26 rue Jean-Jaurès, 85024 La Roche-sur-Yon Cedex", telephone: "02 51 36 58 58" },
  "86": { adresse: "11 rue Riffault, BP 549, 86020 Poitiers Cedex", telephone: "05 49 55 62 00" },
  "87": { adresse: "31 rue Montmailler, 87043 Limoges Cedex", telephone: "05 55 45 69 00" },
  "88": { adresse: "25 rue Antoine-Hurault, 88026 Épinal Cedex", telephone: "03 29 69 25 25" },
  "89": { adresse: "9 rue Marie-Noël, BP 109, 89011 Auxerre Cedex", telephone: "03 86 72 36 00" },
  "90": { adresse: "9 bis Faubourg de Montbéliard, BP 10489, 90016 Belfort Cedex", telephone: "03 84 36 62 20" },
  "91": { adresse: "27 rue de Mazières, 91011 Évry Cedex", telephone: "01 69 13 26 40" },
  "92": { adresse: "167 avenue Joliot-Curie, 92013 Nanterre Cedex", telephone: "01 40 97 30 30" },
  "93": { adresse: "7 rue Hector-Berlioz, 93000 Bobigny", telephone: "0 809 401 401" }, // tél local non publié
  "94": { adresse: "1 place du Général-Billotte, 94040 Créteil Cedex", telephone: "01 43 99 38 00" },
  "95": { adresse: "5 avenue Bernard-Hirsch, 95010 Cergy-Pontoise Cedex", telephone: "01 34 25 27 02" },
  // Départements manquants (DRFiP = direction régionale qui exerce les fonctions DDFiP)
  "21": { adresse: "1 bis place de la Banque, 21000 Dijon", telephone: "03 80 59 26 00" },
  "31": { adresse: "34 rue des Lois, 31039 Toulouse Cedex 09", telephone: "05 61 26 57 00" },
  "69": { adresse: "3 rue de la Charité, 69002 Lyon", telephone: "04 72 40 84 00" },
  // DOM-TOM (DRFiP outre-mer)
  "971": { adresse: "Route de Bologne, ZI de Calebassier, 97100 Basse-Terre", telephone: "05 90 99 24 27" },
  "972": { adresse: "Jardin Desclieux, BP 654 et 655, 97263 Fort-de-France Cedex", telephone: "05 96 59 07 07" },
  "973": { adresse: "Rue Fiedmond, 97300 Cayenne", telephone: "05 94 29 91 91" },
  "974": { adresse: "7 avenue André-Malraux, CS 21015, 97744 Saint-Denis Cedex 9", telephone: "02 62 90 88 00" },
  "976": { adresse: "Avenue de la Préfecture, BP 501, 97600 Mamoudzou", telephone: "02 69 61 16 40" },
};

const inputPath = path.join(__dirname, '..', 'data', 'organismes.json');
const raw = fs.readFileSync(inputPath, 'utf-8');
const data = JSON.parse(raw);

let updated = 0;
for (const [code, ddfip] of Object.entries(DDFIP_DATA)) {
  if (!data[code] || !data[code].ddfip) continue;
  data[code].ddfip = {
    ...data[code].ddfip,
    adresse: ddfip.adresse,
    telephone: ddfip.telephone,
  };
  updated++;
}

fs.writeFileSync(inputPath, JSON.stringify(data, null, 2) + '\n');
console.log(`DDFiP mis à jour : ${updated} départements / ${Object.keys(DDFIP_DATA).length} attendus`);
