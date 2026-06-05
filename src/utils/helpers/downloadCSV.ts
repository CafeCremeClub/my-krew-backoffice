import Papa from 'papaparse';

/**
 * Génère un fichier CSV à partir d'un tableau d'objets et déclenche son
 * téléchargement dans le navigateur.
 *
 * - Délimiteur point-virgule (`;`) : c'est le séparateur attendu par Excel en
 *   locale française/européenne, ce qui garantit que chaque valeur tombe dans
 *   sa propre colonne à l'ouverture (la virgule, elle, laisse tout en colonne A).
 * - BOM UTF-8 ajouté pour que les accents s'affichent correctement dans Excel.
 *
 * @param rows     Les lignes à exporter (un objet par ligne).
 * @param filename Le nom du fichier téléchargé (extension .csv ajoutée si absente).
 */
export const downloadCSV = <T extends Record<string, unknown>>(
  rows: T[],
  filename: string
): void => {
  const csv = Papa.unparse(rows, { delimiter: ';' });
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
