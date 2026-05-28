// Mise à jour des Tribunaux de commerce / TAE / TJ (chambre commerciale).
// Données collectées via tribunal-de-commerce.fr + service-public.fr (28/05/2026).
// Particularités :
// - 13/22/69/72/75/84/87/92 : Tribunaux des Activités Économiques (réforme 2025)
// - 57/67/68 (Alsace-Moselle) : chambre commerciale du TJ
// - DOM : tribunaux mixtes de commerce
// Lancement : node scripts/update-tribunaux.js

const fs = require('fs');
const path = require('path');

const TRIBUNAUX = {
  "01": { nom: "Tribunal de commerce de Bourg-en-Bresse", adresse: "32 avenue Alsace-Lorraine, CS 50317, 01011 Bourg-en-Bresse Cedex", telephone: "04 74 32 00 03" },
  "02": { nom: "Tribunal de commerce de Saint-Quentin", adresse: "Palais de Justice Fervaque, aile gauche, 3e étage, BP 6453, 02322 Saint-Quentin Cedex", telephone: "03 23 62 34 10" },
  "03": { nom: "Tribunal de commerce de Cusset", adresse: "2-4 rue du Bief, BP 60201, 03306 Cusset Cedex", telephone: "04 70 98 39 13" },
  "04": { nom: "Tribunal de commerce de Manosque", adresse: "ZAC Chante Prunier, 9 rue Georges Martin Charpenel, 04100 Manosque", telephone: "04 86 89 70 28" },
  "05": { nom: "Tribunal de commerce de Gap", adresse: "Palais de Justice, 1-3 Place Saint-Arnoux, BP 140, 05000 Gap", telephone: "04 92 51 01 92" },
  "06": { nom: "Tribunal de commerce d'Antibes", adresse: "60 bis 2e Avenue, Quartier Nova Antipolis, BP 619, 06632 Antibes Cedex", telephone: "04 93 34 10 14" },
  "07": { nom: "Tribunal de commerce d'Aubenas", adresse: "Le château, place de l'Hôtel de Ville, 07200 Aubenas", telephone: "04 75 89 21 80" },
  "08": { nom: "Tribunal de commerce de Sedan", adresse: "1 rue de la Comédie, 08200 Sedan", telephone: "03 24 57 50 53" },
  "09": { nom: "Tribunal de commerce de Foix", adresse: "14 boulevard du Sud, 09000 Foix", telephone: "05 61 02 42 80" },
  "10": { nom: "Tribunal de commerce de Troyes", adresse: "134 rue du Général de Gaulle, 10003 Troyes", telephone: "03 25 73 15 08" },
  "11": { nom: "Tribunal de commerce de Carcassonne", adresse: "34 rue de Strasbourg, 11890 Carcassonne Cedex 9", telephone: "04 68 11 27 30" },
  "12": { nom: "Tribunal de commerce de Rodez", adresse: "2 boulevard Pierre Benoît, BP 731, 12007 Rodez Cedex", telephone: "05 65 73 56 10" },
  "13": { nom: "Tribunal des activités économiques de Marseille", adresse: "2 rue Emile Pollak, 13006 Marseille", telephone: "04 91 54 70 40" },
  "14": { nom: "Tribunal de commerce de Caen", adresse: "Palais de Justice, place Gambetta, BP 555, 14037 Caen Cedex 1", telephone: "02 31 85 40 00" },
  "15": { nom: "Tribunal de commerce d'Aurillac", adresse: "21 place du Square, BP 619, 15006 Aurillac Cedex", telephone: "04 71 48 14 54" },
  "16": { nom: "Tribunal de commerce d'Angoulême", adresse: "13 place du Champ de Mars, 16000 Angoulême", telephone: "05 45 92 66 03" },
  "17": { nom: "Tribunal de commerce de La Rochelle", adresse: "Hôtel de la Bourse, 14 rue du Palais, BP 50365, 17001 La Rochelle Cedex 1", telephone: "05 46 41 34 65" },
  "18": { nom: "Tribunal de commerce de Bourges", adresse: "1 place Henri-Mirpied, 18000 Bourges", telephone: "02 48 70 07 33" },
  "19": { nom: "Tribunal de commerce de Brive-la-Gaillarde", adresse: "6 rue Saint Bernard, 19100 Brive-la-Gaillarde", telephone: "05 55 17 76 76" },
  "2A": { nom: "Tribunal de commerce d'Ajaccio", adresse: "Avenue du Maréchal Lyautey, Palais du Finosello, CS 20983, 20700 Ajaccio Cedex 9", telephone: "04 95 23 17 82" },
  "2B": { nom: "Tribunal de commerce de Bastia", adresse: "10 boulevard Auguste Gaudin, 20297 Bastia Cedex", telephone: "04 95 34 84 70" },
  "21": { nom: "Tribunal de commerce de Dijon", adresse: "Cité judiciaire, 13 boulevard Georges Clémenceau, 21000 Dijon", telephone: "03 80 70 45 51" },
  "22": { nom: "Tribunal des activités économiques de Saint-Brieuc", adresse: "17 rue Parmentier, 22021 Saint-Brieuc Cedex 1", telephone: "02 96 33 68 92" },
  "23": { nom: "Tribunal de commerce de Guéret", adresse: "23 place Bonnyaud, 23000 Guéret", telephone: "05 55 41 10 11" },
  "24": { nom: "Tribunal de commerce de Périgueux", adresse: "3 place Yves Guéna, 24009 Périgueux Cedex", telephone: "05 53 45 60 00" },
  "25": { nom: "Tribunal de commerce de Besançon", adresse: "1 rue Mégevand, 25042 Besançon Cedex", telephone: "03 81 65 13 88" },
  "26": { nom: "Tribunal de commerce de Romans-sur-Isère", adresse: "2-4 rue Sabaton, Le Fanal, BP 209, 26105 Romans-sur-Isère Cedex", telephone: "04 75 71 18 48" },
  "27": { nom: "Tribunal de commerce d'Évreux", adresse: "7 rue de la Petite Cité, BP 382, 27003 Évreux", telephone: "02 32 22 37 20" },
  "28": { nom: "Tribunal de commerce de Chartres", adresse: "22 boulevard Chasles, BP 229, 28000 Chartres", telephone: "02 37 84 00 25" },
  "29": { nom: "Tribunal de commerce de Quimper", adresse: "23 rue du Palais, 29196 Quimper Cedex", telephone: "02 98 55 42 47" },
  "30": { nom: "Tribunal de commerce de Nîmes", adresse: "12 rue Cité Foulc, 30000 Nîmes", telephone: "04 66 76 03 51" },
  "31": { nom: "Tribunal de commerce de Toulouse", adresse: "Place de la Bourse, BP 7016, 31068 Toulouse Cedex 7", telephone: "05 61 11 02 00" },
  "32": { nom: "Tribunal de commerce d'Auch", adresse: "4 place du Maréchal Lannes, CS 70390, 32008 Auch Cedex", telephone: "05 62 05 02 24" },
  "33": { nom: "Tribunal de commerce de Bordeaux", adresse: "19 place de la Bourse, 33064 Bordeaux", telephone: "05 56 01 81 70" },
  "34": { nom: "Tribunal de commerce de Montpellier", adresse: "Cité Méditerranée, 9 rue de Tarragone, 34070 Montpellier", telephone: "04 67 60 80 88" },
  "35": { nom: "Tribunal de commerce de Rennes", adresse: "Cité Judiciaire, 7 rue Pierre Abélard, CS 43124, 35031 Rennes Cedex", telephone: "02 99 65 38 88" },
  "36": { nom: "Tribunal de commerce de Châteauroux", adresse: "11 rue Paul-Louis Courier, BP 633, 36020 Châteauroux Cedex", telephone: "02 54 34 06 26" },
  "37": { nom: "Tribunal de commerce de Tours", adresse: "12 rue Berthelot, BP 4104, 37041 Tours Cedex 1", telephone: "02 47 31 20 01" },
  "38": { nom: "Tribunal de commerce de Grenoble", adresse: "Place Firmin Gautier, BP 150, 38019 Grenoble Cedex 1", telephone: "04 56 58 50 50" },
  "39": { nom: "Tribunal de commerce de Lons-le-Saunier", adresse: "7 place de l'Ancien Collège, BP 10033, 39001 Lons-le-Saunier Cedex", telephone: "03 84 24 44 76" },
  "40": { nom: "Tribunal de commerce de Mont-de-Marsan", adresse: "7 place Francis Planté, 40000 Mont-de-Marsan", telephone: "05 58 46 60 70" },
  "41": { nom: "Tribunal de commerce de Blois", adresse: "15 rue du Père Brottier, BP 1818, 41018 Blois Cedex", telephone: "02 54 78 07 91" },
  "42": { nom: "Tribunal de commerce de Saint-Étienne", adresse: "36 rue de la Résistance, CS 50228, 42006 Saint-Étienne Cedex 1", telephone: "04 77 43 97 97" },
  "43": { nom: "Tribunal de commerce du Puy-en-Velay", adresse: "4 avenue de la Dentelle, CS 80109, 43009 Le Puy-en-Velay Cedex", telephone: "04 71 09 00 78" },
  "44": { nom: "Tribunal de commerce de Nantes", adresse: "2 bis quai François Mitterrand, BP 86209, 44262 Nantes Cedex 2", telephone: "02 40 41 02 00" },
  "45": { nom: "Tribunal de commerce d'Orléans", adresse: "44 rue de la Bretonnerie, BP 92015, 45000 Orléans", telephone: "02 38 78 07 07" },
  "46": { nom: "Tribunal de commerce de Cahors", adresse: "Boulevard Gambetta, 46010 Cahors", telephone: "05 65 35 24 34" },
  "47": { nom: "Tribunal de commerce d'Agen", adresse: "6 rue Lomet, 47000 Agen", telephone: "05 53 77 34 15" },
  "48": { nom: "Tribunal de commerce de Mende", adresse: "27 boulevard Henri Bourrillon, 48000 Mende", telephone: "04 66 48 41 41" },
  "49": { nom: "Tribunal de commerce d'Angers", adresse: "13 rue René Rouchy, 49043 Angers", telephone: "02 41 87 89 30" },
  "50": { nom: "Tribunal de commerce de Coutances", adresse: "67 rue Saint Nicolas, 50208 Coutances Cedex", telephone: "02 33 19 42 11" },
  "51": { nom: "Tribunal de commerce de Châlons-en-Champagne", adresse: "2 rue Perrot d'Ablancourt, BP 520, 51008 Châlons-en-Champagne Cedex", telephone: "03 26 68 48 60" },
  "52": { nom: "Tribunal de commerce de Chaumont", adresse: "6 rue Raymond Savignac, Bâtiment de l'Horloge, 52000 Chaumont", telephone: "03 25 03 80 37" },
  "53": { nom: "Tribunal de commerce de Laval", adresse: "12 allée de la Chartrie, 53000 Laval", telephone: "02 43 58 15 67" },
  "54": { nom: "Tribunal de commerce de Nancy", adresse: "Cité judiciaire, BP 30108, rue du Général Fabvier, 54003 Nancy Cedex", telephone: "03 83 40 69 60" },
  "55": { nom: "Tribunal de commerce de Bar-le-Duc", adresse: "Rue François de Guise, 55000 Bar-le-Duc", telephone: "03 29 79 09 39" },
  "56": { nom: "Tribunal de commerce de Vannes", adresse: "19 rue des Tribunaux, BP 505, 56019 Vannes Cedex", telephone: "02 97 47 22 89" },
  "57": { nom: "Tribunal judiciaire de Metz - Chambre commerciale", adresse: "3 rue Haute Pierre, 57036 Metz Cedex 01", telephone: "03 87 56 75 00" },
  "58": { nom: "Tribunal de commerce de Nevers", adresse: "19 rue Saint Martin, 58000 Nevers", telephone: "03 86 61 06 71" },
  "59": { nom: "Tribunal de commerce de Lille Métropole", adresse: "445 boulevard Gambetta, CS 60455, 59338 Tourcoing Cedex", telephone: "03 20 76 19 90" },
  "60": { nom: "Tribunal de commerce de Beauvais", adresse: "12 rue des Teinturiers, BP 458, 60004 Beauvais Cedex", telephone: "03 44 06 74 00" },
  "61": { nom: "Tribunal de commerce d'Alençon", adresse: "81 rue du Gué de Sorre, 61000 Alençon", telephone: "02 33 26 17 55" },
  "62": { nom: "Tribunal de commerce d'Arras", adresse: "13 rue Roger Salengro, 62008 Arras", telephone: "03 21 51 01 04" },
  "63": { nom: "Tribunal de commerce de Clermont-Ferrand", adresse: "40 rue de l'Ange, 63000 Clermont-Ferrand", telephone: "04 73 16 01 60" },
  "64": { nom: "Tribunal de commerce de Pau", adresse: "3 rue Duplaa, BP 90338, 64000 Pau", telephone: "05 59 98 60 60" },
  "65": { nom: "Tribunal de commerce de Tarbes", adresse: "Palais de Justice, 6B rue du Maréchal Foch, 65013 Tarbes Cedex", telephone: "05 62 51 77 77" },
  "66": { nom: "Tribunal de commerce de Perpignan", adresse: "4 rue André Bosch, BP 441, 66000 Perpignan", telephone: "04 68 34 24 33" },
  "67": { nom: "Tribunal judiciaire de Strasbourg - Chambre commerciale", adresse: "1 quai Finkmatt, 67070 Strasbourg Cedex", telephone: "03 88 75 27 27" },
  "68": { nom: "Tribunal judiciaire de Mulhouse - Chambre commerciale", adresse: "21 avenue Robert Schuman, 68100 Mulhouse", telephone: "03 89 36 25 00" },
  "69": { nom: "Tribunal des activités économiques de Lyon", adresse: "44 rue de Bonnel, 69433 Lyon Cedex 03", telephone: "04 72 60 69 80" },
  "70": { nom: "Tribunal de commerce de Vesoul", adresse: "20 rue Didon, BP 473, 70007 Vesoul Cedex", telephone: "03 84 75 82 70" },
  "71": { nom: "Tribunal de commerce de Mâcon", adresse: "9 cours Moreau, CS 60718, 71018 Mâcon Cedex", telephone: "03 85 38 04 85" },
  "72": { nom: "Tribunal des activités économiques du Mans", adresse: "1 avenue Pierre Mendès France, 72014 Le Mans Cedex", telephone: "02 43 14 18 50" },
  "73": { nom: "Tribunal de commerce de Chambéry", adresse: "12 boulevard de la Colonne, 73000 Chambéry", telephone: "04 79 33 72 25" },
  "74": { nom: "Tribunal de commerce d'Annecy", adresse: "19 avenue du Parmelan, BP 70259, 74007 Annecy Cedex", telephone: "04 50 05 05 45" },
  "75": { nom: "Tribunal des activités économiques de Paris", adresse: "1 quai de la Corse, 75198 Paris Cedex 04", telephone: "01 86 86 75 75" },
  "76": { nom: "Tribunal de commerce de Rouen", adresse: "3 rue Jacques le Lieur, BP 531, 76005 Rouen Cedex", telephone: "02 35 70 08 60" },
  "77": { nom: "Tribunal de commerce de Melun", adresse: "2 avenue du Général Leclerc, 77000 Melun", telephone: "01 64 79 84 00" },
  "78": { nom: "Tribunal de commerce de Versailles", adresse: "1 place André Mignot, 78000 Versailles", telephone: "01 39 07 16 40" },
  "79": { nom: "Tribunal de commerce de Niort", adresse: "18 rue Marcel Paul, BP 8818, 79028 Niort Cedex", telephone: "05 49 79 14 40" },
  "80": { nom: "Tribunal de commerce d'Amiens", adresse: "18 rue Lamartine, 2e étage, BP 40201, 80002 Amiens Cedex 1", telephone: "03 22 91 43 23" },
  "81": { nom: "Tribunal de commerce d'Albi", adresse: "Place du Palais, BP 156, 81005 Albi Cedex", telephone: "05 63 54 00 83" },
  "82": { nom: "Tribunal de commerce de Montauban", adresse: "2 place Antoine Bourdelle, 82000 Montauban", telephone: "05 63 63 20 88" },
  "83": { nom: "Tribunal de commerce de Toulon", adresse: "140 boulevard Maréchal Leclerc, BP 50, 83041 Toulon Cedex", telephone: "04 94 18 54 90" },
  "84": { nom: "Tribunal des activités économiques d'Avignon", adresse: "2 boulevard Limbert, BP 21063, 84097 Avignon Cedex 9", telephone: "04 90 14 31 82" },
  "85": { nom: "Tribunal de commerce de La Roche-sur-Yon", adresse: "55 rue Hoche, 85000 La Roche-sur-Yon", telephone: "02 51 37 67 05" },
  "86": { nom: "Tribunal de commerce de Poitiers", adresse: "4 boulevard de Lattre de Tassigny, CS 30871, 86036 Poitiers Cedex", telephone: "05 49 88 81 93" },
  "87": { nom: "Tribunal des activités économiques de Limoges", adresse: "Cité Judiciaire, 23 place Winston Churchill, 87000 Limoges", telephone: "05 55 34 60 75" },
  "88": { nom: "Tribunal de commerce d'Épinal", adresse: "Place Jeanne d'Arc, Espace judiciaire Julie-Victoire Daubié, 88000 Épinal", telephone: "03 54 59 18 50" },
  "89": { nom: "Tribunal de commerce d'Auxerre", adresse: "90 rue de Paris, BP 94, 89011 Auxerre Cedex", telephone: "03 86 72 21 00" },
  "90": { nom: "Tribunal de commerce de Belfort", adresse: "1 rue Morimont, BP 781, 90020 Belfort Cedex", telephone: "03 84 28 03 41" },
  "91": { nom: "Tribunal de commerce d'Évry-Courcouronnes", adresse: "1 rue de la Patinoire, 91011 Évry Cedex", telephone: "01 69 47 36 50" },
  "92": { nom: "Tribunal des activités économiques de Nanterre", adresse: "4 rue Pablo Néruda, 3e étage, 92020 Nanterre Cedex", telephone: "01 40 97 17 17" },
  "93": { nom: "Tribunal de commerce de Bobigny", adresse: "1-13 rue Michel de l'Hospital, 93008 Bobigny Cedex", telephone: "08 91 01 11 11" },
  "94": { nom: "Tribunal de commerce de Créteil", adresse: "Immeuble Le Pascal, Hall A, 1 avenue du Général de Gaulle, 94049 Créteil Cedex", telephone: "01 43 99 05 75" },
  "95": { nom: "Tribunal de commerce de Pontoise", adresse: "3 rue Victor Hugo, Palais de Justice, 95300 Pontoise", telephone: "01 34 25 47 60" },
  "971": { nom: "Tribunal mixte de commerce de Pointe-à-Pitre", adresse: "Place Gourbeyre, 97110 Pointe-à-Pitre", telephone: "05 90 89 69 51" },
  "972": { nom: "Tribunal mixte de commerce de Fort-de-France", adresse: "35 boulevard du Général de Gaulle, 97200 Fort-de-France", telephone: "05 96 48 41 41" },
  "973": { nom: "Tribunal mixte de commerce de Cayenne", adresse: "15 avenue du Général de Gaulle, 97300 Cayenne", telephone: "05 94 29 76 30" },
  "974": { nom: "Tribunal mixte de commerce de Saint-Denis-de-La-Réunion", adresse: "45 rue Sainte-Anne, 97400 Saint-Denis", telephone: "02 62 40 23 45" },
  "976": { nom: "Tribunal mixte de commerce de Mamoudzou", adresse: "Route Nationale Kaweni, Résidence l'Archipel, 97600 Mamoudzou", telephone: "02 69 61 11 15" },
};

const inputPath = path.join(__dirname, '..', 'data', 'organismes.json');
const raw = fs.readFileSync(inputPath, 'utf-8');
const data = JSON.parse(raw);

let updated = 0;
for (const [code, t] of Object.entries(TRIBUNAUX)) {
  if (!data[code]) continue;
  const existant = data[code].tribunal || {};
  data[code].tribunal = {
    nom: t.nom,
    type: existant.type || 'Tribunal de commerce',
    adresse: t.adresse,
    telephone: t.telephone,
    site: existant.site || 'https://www.tribunal-de-commerce.fr',
  };
  updated++;
}

fs.writeFileSync(inputPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Tribunaux mis à jour : ${updated} départements / ${Object.keys(TRIBUNAUX).length} attendus`);
