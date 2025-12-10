#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script za analizu duplikata pločica u dokumentima.

Pravilo: Duplikat postoji ako se ista vrednost plocica pojavljuje više puta
u stavkama dokumenata koji imaju istu vrednost klasa.
"""

import json


def analyze_duplicates(input_file, output_file):
    """
    Analizira fajl i pronalazi duplikate pločica po klasi.
    
    Args:
        input_file: Path to input JSON file
        output_file: Path to output JSON file
    """
    
    # Učitaj podatke
    with open(input_file, 'r', encoding='utf-8') as f:
        documents = json.load(f)
    
    # Grupiši pločice po klasi
    # Struktura: {klasa: {plocica: [(dokument_id, stavka_index), ...]}}
    plocice_po_klasi = {}
    dokumenata_po_klasi = {}
    
    for doc in documents:
        klasa = doc.get('klasa')
        dokument_id = doc.get('idString') or str(doc.get('id'))
        stavke = doc.get('stavke', [])
        
        # Broji dokumente po klasi
        dokumenata_po_klasi[klasa] = dokumenata_po_klasi.get(klasa, 0) + 1
        
        # Inicijalizuj strukturu za klasu ako ne postoji
        if klasa not in plocice_po_klasi:
            plocice_po_klasi[klasa] = {}
        
        # Pregledaj sve stavke u dokumentu
        for stavka_index, stavka in enumerate(stavke):
            plocica_obj = stavka.get('plocica')
            
            # Izvuci vrednost plocice
            if plocica_obj:
                if isinstance(plocica_obj, dict):
                    plocica_value = plocica_obj.get('plocica')
                else:
                    plocica_value = plocica_obj
                
                if plocica_value:
                    # Dodaj lokaciju pločice
                    if plocica_value not in plocice_po_klasi[klasa]:
                        plocice_po_klasi[klasa][plocica_value] = []
                    
                    plocice_po_klasi[klasa][plocica_value].append({
                        'dokument_id': dokument_id,
                        'stavka_index': stavka_index
                    })
    
    # Pronađi duplikate (pločice koje se pojavljuju više od jednom)
    duplikati = []
    
    for klasa, plocice in plocice_po_klasi.items():
        for plocica_value, lokacije in plocice.items():
            if len(lokacije) > 1:
                duplikat = {
                    'klasa': klasa,
                    'plocica': plocica_value,
                    'broj_ponavljanja': len(lokacije),
                    'lokacije': lokacije
                }
                duplikati.append(duplikat)
    
    # Sortiraj duplikate po klasi i broju ponavljanja
    duplikati.sort(key=lambda x: (x['klasa'], -x['broj_ponavljanja'], x['plocica']))
    
    # Kreiraj rezultat
    rezultat = {
        'ukupno_dokumenata': len(documents),
        'dokumenata_po_klasi': dokumenata_po_klasi,
        'duplikati': duplikati,
        'ukupno_duplikata': len(duplikati)
    }
    
    # Sačuvaj rezultat
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(rezultat, f, ensure_ascii=False, indent=2)
    
    return rezultat


def main():
    """Glavna funkcija."""
    input_file = 'SADRZAJ402905750.txt'
    output_file = 'rezultat_duplikati.json'
    
    print(f"Analiziram fajl: {input_file}")
    rezultat = analyze_duplicates(input_file, output_file)
    
    print(f"\nRezultati:")
    print(f"  Ukupno dokumenata: {rezultat['ukupno_dokumenata']}")
    print(f"  Dokumenata po klasi:")
    for klasa, broj in sorted(rezultat['dokumenata_po_klasi'].items()):
        print(f"    {klasa}: {broj}")
    print(f"  Ukupno duplikata: {rezultat['ukupno_duplikata']}")
    
    if rezultat['ukupno_duplikata'] > 0:
        print(f"\n  Duplikati po klasi:")
        klasa_duplikati = {}
        for dup in rezultat['duplikati']:
            klasa = dup['klasa']
            klasa_duplikati[klasa] = klasa_duplikati.get(klasa, 0) + 1
        for klasa, broj in sorted(klasa_duplikati.items()):
            print(f"    {klasa}: {broj}")
    
    print(f"\nRezultat sačuvan u: {output_file}")


if __name__ == '__main__':
    main()
