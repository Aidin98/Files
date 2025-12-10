# Analiza Duplikata Pločica

Skripta za analizu duplikata pločica u dokumentima iz fajla `SADRZAJ402905750.txt`.

## Pravilo za Duplikate

Duplikat postoji ako se **ista vrednost `plocica`** pojavljuje **više puta** u stavkama dokumenata koji imaju **istu vrednost `klasa`**.

**Važno:** Ako se ista `plocica` pojavi u dokumentima sa **različitim** vrednostima `klasa`, to **NIJE** duplikat.

## Dostupne Implementacije

### Python Skripta

**Fajl:** `analyze_duplicates.py`

**Pokretanje:**
```bash
python3 analyze_duplicates.py
```

**Zahtevi:**
- Python 3.6+
- Nema dodatnih biblioteka (koristi samo standardnu biblioteku)

### JavaScript/Node.js Skripta

**Fajl:** `analyze_duplicates.js`

**Pokretanje:**
```bash
node analyze_duplicates.js
```

**Zahtevi:**
- Node.js 10+
- Nema dodatnih biblioteka (koristi samo standardnu biblioteku)

## Struktura Ulaznih Podataka

```
Array od 12 dokumenata
  └─ svaki dokument ima property `klasa` (npr. "IS", "US", "OT")
  └─ svaki dokument ima `stavke` (array)
      └─ svaka stavka ima property `plocica` (objekat sa poljem `plocica`)
```

## Izlazni Format

Skripta generiše fajl `rezultat_duplikati.json` sa sledećom strukturom:

```json
{
  "ukupno_dokumenata": 12,
  "dokumenata_po_klasi": {
    "IS": 4,
    "US": 4,
    "OT": 4
  },
  "duplikati": [
    {
      "klasa": "IS",
      "plocica": "0605002394",
      "broj_ponavljanja": 2,
      "lokacije": [
        {
          "dokument_id": "40290575000001958",
          "stavka_index": 0
        },
        {
          "dokument_id": "40290575000001958",
          "stavka_index": 2
        }
      ]
    }
  ],
  "ukupno_duplikata": 3
}
```

## Polja u Rezultatu

- **ukupno_dokumenata**: Ukupan broj analiziranih dokumenata
- **dokumenata_po_klasi**: Broj dokumenata grupisanih po klasi
- **duplikati**: Lista svih pronađenih duplikata
  - **klasa**: Klasa dokumenta u kojoj se nalazi duplikat
  - **plocica**: Vrednost pločice koja se ponavlja
  - **broj_ponavljanja**: Koliko puta se pločica pojavljuje
  - **lokacije**: Lista svih mesta gde se pločica pojavljuje
    - **dokument_id**: ID dokumenta (koristi se `idString` polje)
    - **stavka_index**: Indeks stavke u nizu stavki (počinje od 0)
- **ukupno_duplikata**: Ukupan broj pronađenih duplikata

## Primer Rezultata

Na osnovu trenutnog fajla `SADRZAJ402905750.txt`:
- **Ukupno dokumenata:** 12
- **Dokumenata po klasi:**
  - IS: 4
  - US: 4
  - OT: 4
- **Ukupno duplikata:** 3 (po 1 u svakoj klasi)

Pločica `0605002394` se pojavljuje duplo u različitim klasama, ali svaki se tretira kao zaseban duplikat jer su u različitim klasama (što je u skladu sa pravilom).

## Napomene

- Obe skripte (Python i JavaScript) generišu identične rezultate
- Skripte automatski koriste postojeći fajl `SADRZAJ402905750.txt` u istom direktorijumu
- Rezultat se čuva u fajl `rezultat_duplikati.json` u istom direktorijumu
- Duplikati su sortirani po klasi i broju ponavljanja
