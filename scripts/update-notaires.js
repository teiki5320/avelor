// Mise à jour des Chambres des Notaires par département.
// Données collectées via annuaire-administration.com + notaires.fr (28/05/2026).
// Lancement : node scripts/update-notaires.js
//
// Particularité : plusieurs chambres sont interdépartementales (Cour d'appel),
// ce qui explique les adresses partagées entre départements voisins.

const fs = require('fs');
const path = require('path');

const NOTAIRES = {
  "01": { nom: "Chambre des notaires de l'Ain", adresse: "18 bis rue des Dîmes, 01000 Bourg-en-Bresse", telephone: "04 74 23 20 21" },
  "02": { nom: "Chambre départementale des notaires de l'Aisne", adresse: "26 rue Georges Ermant, 02000 Laon", telephone: "03 23 20 27 47" },
  "03": { nom: "Chambre départementale des notaires de l'Allier", adresse: "19 rue Diderot, 03000 Moulins", telephone: "04 70 44 10 30" },
  "04": { nom: "Chambre des notaires des Alpes-de-Haute-Provence", adresse: "8 boulevard du Roi René, 13100 Aix-en-Provence", telephone: "04 42 16 03 30" },
  "05": { nom: "Chambre interdépartementale des notaires du Dauphiné (Hautes-Alpes)", adresse: "10 rue Jean Moulin, 38180 Seyssins", telephone: "04 76 48 13 47" },
  "06": { nom: "Chambre départementale des notaires des Alpes-Maritimes", adresse: "18 rue du Congrès, 06000 Nice", telephone: "04 97 03 02 02" },
  "07": { nom: "Chambre départementale des notaires de l'Ardèche", adresse: "5 Cours du Palais, 07000 Privas", telephone: "04 75 64 21 36" },
  "08": { nom: "Chambre interdépartementale des notaires de la cour d'appel de Reims (Ardennes)", adresse: "132 avenue Charles Boutet, BP 358, 08105 Charleville-Mézières Cedex", telephone: "03 24 56 03 29" },
  "09": { nom: "Chambre interdépartementale des notaires (Ariège, Hte-Garonne, Tarn, Tarn-et-Gne)", adresse: "11 boulevard des Récollets, Immeuble le Belvédère, CS 97802, 31078 Toulouse Cedex 4", telephone: "05 62 73 58 68" },
  "10": { nom: "Chambre interdépartementale des notaires de la cour d'appel de Reims (Aube)", adresse: "126 rue du Général de Gaulle, 10000 Troyes", telephone: "03 25 73 05 10" },
  "11": { nom: "Chambre départementale des notaires de l'Aude", adresse: "52 rue Aimé Ramond, CS 60086, 11890 Carcassonne Cedex 9", telephone: "04 68 25 67 08" },
  "12": { nom: "Chambre départementale des notaires de l'Aveyron", adresse: "7 rue du Château, 12740 Sebazac-Concoures", telephone: "05 65 46 90 63" },
  "13": { nom: "Chambre départementale des notaires des Bouches-du-Rhône", adresse: "77 boulevard Périer, 13008 Marseille", telephone: "04 91 53 49 67" },
  "14": { nom: "Chambre interdépartementale des notaires de la cour d'appel de Caen (Calvados)", adresse: "6 place Louis Guillouard, BP 66146, 14065 Caen Cedex 4", telephone: "02 31 85 44 62" },
  "15": { nom: "Chambre départementale des notaires du Cantal", adresse: "13 rue Eloy Chapsal, 15000 Aurillac", telephone: "04 71 48 00 14" },
  "16": { nom: "Chambre départementale des notaires de la Charente", adresse: "16 rue Prudent, BP 60262, 16007 Angoulême Cedex", telephone: "05 45 95 09 60" },
  "17": { nom: "Chambre départementale des notaires de la Charente-Maritime", adresse: "16 rue Saint-Michel, 17100 Saintes", telephone: "05 46 93 11 04" },
  "18": { nom: "Chambre interdépartementale des notaires du Cher et de l'Indre", adresse: "16 rue Jean Baffier, 18000 Bourges", telephone: "02 48 21 14 98" },
  "19": { nom: "Chambre interdépartementale des notaires (Corrèze, Creuse, Hte-Vienne)", adresse: "3 Place Winston Churchill, 87000 Limoges", telephone: "05 55 77 15 91" },
  "21": { nom: "Chambre interdépartementale des notaires de la cour d'appel de Dijon (Côte-d'Or)", adresse: "2B avenue de Marbotte, 21000 Dijon", telephone: "03 80 67 12 21" },
  "22": { nom: "Chambre des notaires de la cour d'appel de Rennes — Pôle Côtes-d'Armor", adresse: "1 allée Jacques Chaban-Delmas, CS 80218, 22002 Saint-Brieuc", telephone: "02 96 68 30 90" },
  "23": { nom: "Chambre interdépartementale des notaires (Corrèze, Creuse, Hte-Vienne)", adresse: "3 Place Winston Churchill, 87000 Limoges", telephone: "05 55 77 15 91" },
  "24": { nom: "Chambre départementale des notaires de la Dordogne", adresse: "36 rue Louis-Mie, 24000 Périgueux", telephone: "05 53 08 20 07" },
  "25": { nom: "Chambre interdépartementale des notaires de Franche-Comté", adresse: "22A rue de Trey, CS 21286, 25005 Besançon Cedex", telephone: "03 81 50 40 52" },
  "26": { nom: "Chambre départementale des notaires de la Drôme", adresse: "Le Crysval, 5 avenue de la Gare, 26300 Alixan", telephone: "04 75 60 06 11" },
  "27": { nom: "Chambre départementale des notaires de l'Eure", adresse: "5 place Dupont de l'Eure, 27000 Évreux", telephone: "02 32 33 13 39" },
  "28": { nom: "Chambre interdépartementale des notaires de l'Ouest parisien (Eure-et-Loir)", adresse: "54 rue Chanzy, BP 80175, 28003 Chartres Cedex", telephone: "02 37 88 03 60" },
  "29": { nom: "Chambre des notaires de la cour d'appel de Rennes — Pôle Finistère", adresse: "38 bis boulevard Dupleix, BP 1135, 29101 Quimper Cedex", telephone: "02 98 53 18 55" },
  "2A": { nom: "Chambre départementale des notaires de Corse-du-Sud", adresse: "19 cours Général Leclerc, Résidence Napoléon, 20000 Ajaccio", telephone: "04 95 51 31 36" },
  "2B": { nom: "Chambre départementale des notaires de Haute-Corse", adresse: "8 rue Chanoine Colombani, Immeuble le 108 Capanelle, 20200 Bastia", telephone: "04 95 31 47 79" },
  "30": { nom: "Chambre des notaires du Gard", adresse: "Parc Georges Besse, 30035 Nîmes Cedex 1", telephone: "04 66 04 91 08" },
  "31": { nom: "Chambre interdépartementale des notaires (Ariège, Hte-Garonne, Tarn, Tarn-et-Gne)", adresse: "11 boulevard des Récollets, Immeuble le Belvédère, CS 97802, 31078 Toulouse Cedex 4", telephone: "05 62 73 58 68" },
  "32": { nom: "Chambre interdépartementale des notaires (Gers, Lot, Lot-et-Garonne)", adresse: "23 rue des Colonels Lacuée, 47000 Agen", telephone: "05 53 48 14 81" },
  "33": { nom: "Chambre des notaires de la Gironde", adresse: "6 rue Mably, CS 31454, 33064 Bordeaux Cedex", telephone: "05 56 48 00 75" },
  "34": { nom: "Chambre départementale des notaires de l'Hérault", adresse: "565 avenue des Apothicaires, Parc Euromédecine, 34196 Montpellier Cedex 5", telephone: "04 67 04 10 52" },
  "35": { nom: "Chambre interdépartementale des notaires — Pôle Ille-et-Vilaine", adresse: "2 mail Anne-Catherine, CS 54337, 35043 Rennes Cedex", telephone: "02 99 65 23 24" },
  "36": { nom: "Chambre interdépartementale des notaires du Cher et de l'Indre", adresse: "43 rue de la Gare, 36000 Châteauroux", telephone: "02 54 34 26 85" },
  "37": { nom: "Chambre départementale des notaires d'Indre-et-Loire", adresse: "32 rue Richelieu, 37000 Tours", telephone: "02 47 05 60 20" },
  "38": { nom: "Chambre interdépartementale des notaires du Dauphiné (Isère)", adresse: "10 rue Jean Moulin, 38180 Seyssins", telephone: "04 76 48 13 47" },
  "39": { nom: "Chambre interdépartementale des notaires de Franche-Comté (Jura)", adresse: "22A rue de Trey, CS 21286, 25005 Besançon Cedex", telephone: "03 81 50 40 52" },
  "40": { nom: "Chambre interdépartementale des notaires (Hautes-Pyrénées, Landes, Pyr-Atl)", adresse: "1 rue Alfred de Vigny, BP 97547, 64075 Pau", telephone: "05 59 80 33 18" },
  "41": { nom: "Chambre des notaires du Loir-et-Cher", adresse: "12 place Jean Jaurès, 41000 Blois", telephone: "02 54 78 13 16" },
  "42": { nom: "Chambre des notaires de la Loire", adresse: "28 boulevard Pierre-Antoine et Jean-Michel Dalgabio, 42000 Saint-Étienne", telephone: "04 77 57 26 36" },
  "43": { nom: "Chambre des notaires de la Haute-Loire", adresse: "9 Place Michelet, 43000 Le Puy-en-Velay", telephone: "04 71 02 11 29" },
  "44": { nom: "Chambre départementale des notaires de la Loire-Atlantique", adresse: "119 rue de Coulmiers, CS 74223, 44042 Nantes Cedex 1", telephone: "02 40 74 37 16" },
  "45": { nom: "Chambre des notaires du Loiret", adresse: "4 rue d'Escures, CS 21964, 45009 Orléans Cedex 1", telephone: "02 38 24 04 24" },
  "46": { nom: "Chambre interdépartementale des notaires (Gers, Lot, Lot-et-Garonne)", adresse: "23 rue des Colonels Lacuée, 47000 Agen", telephone: "05 53 48 14 81" },
  "47": { nom: "Chambre interdépartementale des notaires (Gers, Lot, Lot-et-Garonne)", adresse: "23 rue des Colonels Lacuée, 47000 Agen", telephone: "05 53 48 14 81" },
  "48": { nom: "Chambre départementale des notaires de la Lozère", adresse: "7 allée Paul Doumer, BP 65, 48002 Mende Cedex 01", telephone: "04 66 49 02 83" },
  "49": { nom: "Chambre interdépartementale des notaires (Maine-et-Loire, Mayenne, Sarthe)", adresse: "19 rue Chevreul, 49100 Angers", telephone: "02 41 25 37 37" },
  "50": { nom: "Chambre départementale des notaires de la Manche", adresse: "4 rue Saint-Thomas, BP 306, 50000 Saint-Lô", telephone: "02 33 57 46 80" },
  "51": { nom: "Chambre interdépartementale des notaires de la cour d'appel de Reims (Marne)", adresse: "44 cours Jean-Baptiste Langlet, BP 1181, 51057 Reims Cedex", telephone: "03 26 86 72 10" },
  "52": { nom: "Chambre départementale des notaires de la Haute-Marne", adresse: "7 Boulevard Barotte, 52000 Chaumont", telephone: "03 25 32 27 55" },
  "53": { nom: "Chambre interdépartementale des notaires (Mayenne)", adresse: "29 rue des Déportés, 53000 Laval", telephone: "02 43 53 01 29" },
  "54": { nom: "Chambre interdépartementale des notaires de la cour d'appel de Nancy", adresse: "22 rue de la Ravinelle, 54000 Nancy", telephone: "03 83 35 69 30" },
  "55": { nom: "Chambre interdépartementale des notaires de la cour d'appel de Nancy (Meuse)", adresse: "22 rue de la Ravinelle, 54000 Nancy", telephone: "03 83 35 69 30" },
  "56": { nom: "Chambre des notaires de la cour d'appel de Rennes — Pôle Morbihan", adresse: "20 rue des Halles, CP 43905, 56039 Vannes Cedex", telephone: "02 97 47 19 97" },
  "57": { nom: "Chambre départementale des notaires de la Moselle", adresse: "1 rue Pierre-Hardie, BP 67002, 57030 Metz Cedex 1", telephone: "03 87 75 27 93" },
  "58": { nom: "Chambre départementale des notaires de la Nièvre", adresse: "3 avenue Pierre Bérégovoy, 58006 Nevers Cedex", telephone: "03 86 61 35 04" },
  "59": { nom: "Chambre interdépartementale des notaires du Nord-Pas-de-Calais", adresse: "9-13 rue de Puebla, CS 29907, 59044 Lille Cedex", telephone: "03 20 14 90 50" },
  "60": { nom: "Chambre départementale des notaires de l'Oise", adresse: "10 rue Saint-Louis, 60000 Beauvais", telephone: "03 44 45 12 96" },
  "61": { nom: "Chambre des notaires de l'Orne", adresse: "45 cours Clemenceau, 61000 Alençon", telephone: "02 33 26 61 30" },
  "62": { nom: "Chambre interdépartementale des notaires du Nord-Pas-de-Calais (Pas-de-Calais)", adresse: "1 bis rue du Collège, 62000 Arras", telephone: "03 21 71 42 20" },
  "63": { nom: "Chambre interdépartementale des notaires d'Auvergne", adresse: "10 rue du Maréchal Foch, 63000 Clermont-Ferrand", telephone: "04 73 29 01 95" },
  "64": { nom: "Chambre interdépartementale des notaires (Hautes-Pyrénées, Landes, Pyr-Atl)", adresse: "1 rue Alfred de Vigny, BP 97547, 64075 Pau", telephone: "05 59 80 33 18" },
  "65": { nom: "Chambre interdépartementale des notaires (Hautes-Pyrénées, Landes, Pyr-Atl)", adresse: "1 rue Alfred de Vigny, BP 97547, 64075 Pau", telephone: "05 59 80 33 18" },
  "66": { nom: "Chambre départementale des notaires des Pyrénées-Orientales", adresse: "21 boulevard Clemenceau, 66000 Perpignan", telephone: "04 68 35 14 79" },
  "67": { nom: "Chambre départementale des notaires du Bas-Rhin", adresse: "2 rue des Juifs, CS 40001, 67080 Strasbourg Cedex", telephone: "03 88 32 10 55" },
  "68": { nom: "Chambre départementale des notaires du Haut-Rhin", adresse: "4 Place des Martyrs de la Résistance, 68000 Colmar", telephone: "03 89 41 19 71" },
  "69": { nom: "Chambre des notaires du Rhône", adresse: "58 boulevard des Belges, 69458 Lyon Cedex 06", telephone: "04 72 69 98 88" },
  "70": { nom: "Chambre interdépartementale des notaires de Franche-Comté (Haute-Saône)", adresse: "22A rue de Trey, CS 21286, 25005 Besançon Cedex", telephone: "03 81 50 40 52" },
  "71": { nom: "Chambre départementale des notaires de Saône-et-Loire", adresse: "69 place Saint-Vincent, BP 213, 71007 Mâcon Cedex", telephone: "03 85 38 45 94" },
  "72": { nom: "Chambre interdépartementale des notaires (Sarthe)", adresse: "19 rue Chevreul, 49100 Angers", telephone: "02 41 25 37 37" },
  "73": { nom: "Chambre interdépartementale des notaires de Savoie et de Haute-Savoie", adresse: "130 route du Viéran, Proméry, 74370 Pringy", telephone: "04 50 27 24 56" },
  "74": { nom: "Chambre interdépartementale des notaires de Savoie et de Haute-Savoie", adresse: "130 route du Viéran, Proméry, 74370 Pringy", telephone: "04 50 27 24 56" },
  "75": { nom: "Chambre interdépartementale des notaires de Paris", adresse: "12 avenue Victoria, 75001 Paris", telephone: "01 44 82 24 00" },
  "76": { nom: "Chambre interdépartementale des notaires de la cour d'appel de Rouen (Seine-Mar.)", adresse: "39 rue du Champ des Oiseaux, CS 30248, 76003 Rouen", telephone: "02 35 88 63 88" },
  "77": { nom: "Chambre départementale des notaires de Seine-et-Marne", adresse: "24 boulevard Chamblain, 77000 Melun", telephone: "01 64 39 53 93" },
  "78": { nom: "Chambre interdépartementale des notaires de l'Ouest parisien (Yvelines)", adresse: "38-40 avenue de Paris, 78000 Versailles", telephone: "01 39 50 01 75" },
  "79": { nom: "Chambre interdépartementale des notaires (Vienne et Deux-Sèvres)", adresse: "32 rue des Trois Coigneaux, 79000 Niort", telephone: "05 49 24 45 53" },
  "80": { nom: "Chambre interdépartementale des notaires de Picardie (Somme)", adresse: "11 place d'Aguesseau, CS 90331, 80003 Amiens Cedex 1", telephone: "03 22 82 08 92" },
  "81": { nom: "Chambre interdépartementale des notaires (Tarn)", adresse: "30 Place Henri de Gorsse, 81000 Albi", telephone: "05 63 54 09 17" },
  "82": { nom: "Chambre interdépartementale des notaires (Tarn-et-Garonne)", adresse: "13 rue Armand Saintis, 82000 Montauban", telephone: "05 63 63 35 85" },
  "83": { nom: "Chambre départementale des notaires du Var", adresse: "165 Place de la Liberté, 83000 Toulon", telephone: "04 94 89 70 30" },
  "84": { nom: "Chambre départementale des notaires de Vaucluse", adresse: "23 bis rue Thiers, BP 119, 84007 Avignon Cedex 1", telephone: "04 90 85 24 00" },
  "85": { nom: "Chambre départementale des notaires de la Vendée", adresse: "30 rue Gaston Ramon, 85000 La Roche-sur-Yon", telephone: "02 51 37 14 96" },
  "86": { nom: "Chambre interdépartementale des notaires (Vienne et Deux-Sèvres)", adresse: "Avenue Thomas Edison, Bâtiment Futuropolis 3, 86360 Chasseneuil-du-Poitou", telephone: "05 49 49 42 60" },
  "87": { nom: "Chambre interdépartementale des notaires (Corrèze, Creuse, Hte-Vienne)", adresse: "3 Place Winston Churchill, 87000 Limoges", telephone: "05 55 77 15 91" },
  "88": { nom: "Chambre interdépartementale des notaires de la cour d'appel de Nancy (Vosges)", adresse: "22 rue de la Ravinelle, 54000 Nancy", telephone: "03 83 35 69 30" },
  "89": { nom: "Chambre départementale des notaires de l'Yonne", adresse: "61 avenue des Clairions, 89000 Auxerre", telephone: "03 86 94 20 84" },
  "90": { nom: "Chambre interdépartementale des notaires de Franche-Comté (Territoire-de-Belfort)", adresse: "22A rue de Trey, CS 21286, 25005 Besançon Cedex", telephone: "03 81 50 40 52" },
  "91": { nom: "Chambre des notaires de l'Essonne", adresse: "14 rue des Douze Apôtres, 91000 Évry-Courcouronnes", telephone: "01 60 78 01 27" },
  "92": { nom: "Chambre interdépartementale des notaires de l'Ouest parisien (Hauts-de-Seine)", adresse: "9 rue de l'Ancienne Mairie, 92513 Boulogne-Billancourt Cedex", telephone: "01 41 10 27 80" },
  "93": { nom: "Chambre interdépartementale des notaires de Paris (Seine-Saint-Denis)", adresse: "12 avenue Victoria, 75001 Paris", telephone: "01 44 82 24 00" },
  "94": { nom: "Chambre interdépartementale des notaires de Paris (Val-de-Marne)", adresse: "12 avenue Victoria, 75001 Paris", telephone: "01 44 82 24 00" },
  "95": { nom: "Chambre interdépartementale des notaires de l'Ouest parisien (Val-d'Oise)", adresse: "38-40 avenue de Paris, 78000 Versailles", telephone: "01 39 50 01 75" },
  "971": { nom: "Chambre des notaires de Guadeloupe, St-Barthélemy et St-Martin", adresse: "Immeuble Le Diamant, Rue Ferdinand Forest prolongée, ZI Jarry, 97122 Baie-Mahault", telephone: "05 90 38 11 52" },
  "972": { nom: "Chambre interdépartementale des notaires de Guyane et de Martinique", adresse: "Résidence Le Patio de Cluny, 97233 Schoelcher", telephone: "05 96 60 62 75" },
  "973": { nom: "Chambre interdépartementale des notaires de Guyane et de Martinique", adresse: "Résidence Le Patio de Cluny, 97233 Schoelcher", telephone: "05 96 60 62 75" },
  "974": { nom: "Chambre des notaires de La Réunion et de Mayotte", adresse: "63 rue Alexis de Villeneuve, BP 61, 97462 Saint-Denis Cedex", telephone: "02 62 94 79 65" },
  "976": { nom: "Chambre des notaires de La Réunion et de Mayotte", adresse: "63 rue Alexis de Villeneuve, BP 61, 97462 Saint-Denis Cedex", telephone: "02 62 94 79 65" },
};

const inputPath = path.join(__dirname, '..', 'data', 'organismes.json');
const raw = fs.readFileSync(inputPath, 'utf-8');
const data = JSON.parse(raw);

let updated = 0;
for (const [code, ch] of Object.entries(NOTAIRES)) {
  if (!data[code]) continue;
  data[code].chambreNotaires = {
    nom: ch.nom,
    type: "Ordre des notaires — entraide",
    adresse: ch.adresse,
    telephone: ch.telephone,
    site: "https://www.notaires.fr",
  };
  updated++;
}

fs.writeFileSync(inputPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Chambres notaires mises à jour : ${updated} départements / ${Object.keys(NOTAIRES).length} attendus`);
