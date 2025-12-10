#!/usr/bin/env node
/**
 * Script za analizu duplikata pločica u dokumentima.
 * 
 * Pravilo: Duplikat postoji ako se ista vrednost plocica pojavljuje više puta
 * u stavkama dokumenata koji imaju istu vrednost klasa.
 */

const fs = require('fs');

/**
 * Analizira fajl i pronalazi duplikate pločica po klasi.
 * 
 * @param {string} inputFile - Path to input JSON file
 * @param {string} outputFile - Path to output JSON file
 * @returns {Object} Rezultat analize
 */
function analyzeDuplicates(inputFile, outputFile) {
    // Učitaj podatke
    const rawData = fs.readFileSync(inputFile, 'utf-8');
    const documents = JSON.parse(rawData);
    
    // Grupiši pločice po klasi
    // Struktura: {klasa: {plocica: [{dokument_id, stavka_index}, ...]}}
    const plocicePoKlasi = {};
    const dokumentataPoKlasi = {};
    
    documents.forEach(doc => {
        const klasa = doc.klasa;
        const dokumentId = doc.idString || String(doc.id);
        const stavke = doc.stavke || [];
        
        // Broji dokumente po klasi
        dokumentataPoKlasi[klasa] = (dokumentataPoKlasi[klasa] || 0) + 1;
        
        // Inicijalizuj strukturu za klasu ako ne postoji
        if (!plocicePoKlasi[klasa]) {
            plocicePoKlasi[klasa] = {};
        }
        
        // Pregledaj sve stavke u dokumentu
        stavke.forEach((stavka, stavkaIndex) => {
            const plocicaObj = stavka.plocica;
            
            // Izvuci vrednost plocice
            let plocicaValue;
            if (plocicaObj) {
                if (typeof plocicaObj === 'object' && plocicaObj !== null) {
                    plocicaValue = plocicaObj.plocica;
                } else {
                    plocicaValue = plocicaObj;
                }
                
                if (plocicaValue) {
                    // Dodaj lokaciju pločice
                    if (!plocicePoKlasi[klasa][plocicaValue]) {
                        plocicePoKlasi[klasa][plocicaValue] = [];
                    }
                    
                    plocicePoKlasi[klasa][plocicaValue].push({
                        dokument_id: dokumentId,
                        stavka_index: stavkaIndex
                    });
                }
            }
        });
    });
    
    // Pronađi duplikate (pločice koje se pojavljuju više od jednom)
    const duplikati = [];
    
    Object.keys(plocicePoKlasi).forEach(klasa => {
        const plocice = plocicePoKlasi[klasa];
        
        Object.keys(plocice).forEach(plocicaValue => {
            const lokacije = plocice[plocicaValue];
            
            if (lokacije.length > 1) {
                duplikati.push({
                    klasa: klasa,
                    plocica: plocicaValue,
                    broj_ponavljanja: lokacije.length,
                    lokacije: lokacije
                });
            }
        });
    });
    
    // Sortiraj duplikate po klasi i broju ponavljanja
    duplikati.sort((a, b) => {
        if (a.klasa !== b.klasa) {
            return a.klasa.localeCompare(b.klasa);
        }
        if (a.broj_ponavljanja !== b.broj_ponavljanja) {
            return b.broj_ponavljanja - a.broj_ponavljanja;
        }
        return a.plocica.localeCompare(b.plocica);
    });
    
    // Kreiraj rezultat
    const rezultat = {
        ukupno_dokumenata: documents.length,
        dokumenata_po_klasi: dokumentataPoKlasi,
        duplikati: duplikati,
        ukupno_duplikata: duplikati.length
    };
    
    // Sačuvaj rezultat
    fs.writeFileSync(outputFile, JSON.stringify(rezultat, null, 2), 'utf-8');
    
    return rezultat;
}

/**
 * Glavna funkcija.
 */
function main() {
    const inputFile = 'SADRZAJ402905750.txt';
    const outputFile = 'rezultat_duplikati.json';
    
    console.log(`Analiziram fajl: ${inputFile}`);
    const rezultat = analyzeDuplicates(inputFile, outputFile);
    
    console.log('\nRezultati:');
    console.log(`  Ukupno dokumenata: ${rezultat.ukupno_dokumenata}`);
    console.log('  Dokumenata po klasi:');
    Object.keys(rezultat.dokumenata_po_klasi).sort().forEach(klasa => {
        console.log(`    ${klasa}: ${rezultat.dokumenata_po_klasi[klasa]}`);
    });
    console.log(`  Ukupno duplikata: ${rezultat.ukupno_duplikata}`);
    
    if (rezultat.ukupno_duplikata > 0) {
        console.log('\n  Duplikati po klasi:');
        const klasaDuplikati = {};
        rezultat.duplikati.forEach(dup => {
            const klasa = dup.klasa;
            klasaDuplikati[klasa] = (klasaDuplikati[klasa] || 0) + 1;
        });
        Object.keys(klasaDuplikati).sort().forEach(klasa => {
            console.log(`    ${klasa}: ${klasaDuplikati[klasa]}`);
        });
    }
    
    console.log(`\nRezultat sačuvan u: ${outputFile}`);
}

// Pokreni skriptu ako je direktno izvršena
if (require.main === module) {
    main();
}

module.exports = { analyzeDuplicates };
