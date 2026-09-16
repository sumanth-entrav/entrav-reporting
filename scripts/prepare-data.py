#!/usr/bin/env python3
"""Build the dashboard dataset from the master travel-spend report.

Usage:  python3 scripts/prepare-data.py /path/to/master_report_file.csv

Writes:
  lib/data/spend.json  — cleaned invoice lines (NO passenger names retained)
  lib/data/meta.json   — aggregate metadata (e.g. distinct traveller count)

Privacy: individual passenger names are deliberately NOT written to the output.
Only an anonymous distinct-traveller count is kept, so no personal names are
committed to this (public) repository. Trailing export "total" rows — lines
with no invoice number and no invoice date — are dropped.
"""
import csv
import json
import os
import re
import sys

def num(s):
    try:
        return round(float((s or "").replace(",", "").strip() or 0), 2)
    except ValueError:
        return 0.0

def strip_code(s):
    return re.sub(r"\s*\([^()]*\)\s*$", "", (s or "").strip()).strip()

def iso(d):
    d = (d or "").strip()
    m = re.match(r"(\d{2})/(\d{2})/(\d{4})", d)
    return f"{m.group(3)}-{m.group(2)}-{m.group(1)}" if m else ""

def norm_reason(s):
    s = (s or "").strip()
    if not s:
        return "Unspecified"
    m = re.match(r"^\d+\s*\(([^)]+)\)\s*$", s)
    if m:
        s = m.group(1)
    s = re.sub(r"\s+", " ", s).strip()
    return s[:1].upper() + s[1:] if s else "Unspecified"

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    src = sys.argv[1]
    rows = list(csv.DictReader(open(src, encoding="utf-8-sig")))

    out = []
    travellers = set()
    dropped = 0
    for r in rows:
        inv = (r.get("Invoice No") or "").strip()
        idate = iso(r.get("Invoice Date"))
        # Drop trailing export total / summary rows.
        if not inv and not idate:
            dropped += 1
            continue
        pax = strip_code(r.get("Passenger"))
        if pax:
            travellers.add(pax.lower())
        out.append({
            "client": strip_code(r.get("Client Name")) or "Unknown",
            "invDate": idate,
            "month": idate[:7],
            "invNo": inv,
            "amount": num(r.get("Invoice Amount (Old)")),
            # passenger name intentionally omitted (privacy)
            "airportTax": num(r.get("Airport Taxes")),
            "netFare": num(r.get("Net Fare")),
            "vat": (r.get("Vat Code") or "").strip(),
            "category": strip_code(r.get("Commission Type")) or "Other",
            "tvlDate": iso(r.get("Tvl Date")),
            "reason": norm_reason(r.get("Reason For Travel")),
            "costCentre": (r.get("Cost Centre") or "").strip() or "Unassigned",
            "supTyp": (r.get("SupTyp") or "").strip() or "N/A",
            "supplier": strip_code(r.get("Supplier Name")) or "Non-supplier / fees",
        })

    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(here, "lib", "data")
    os.makedirs(data_dir, exist_ok=True)
    json.dump(out, open(os.path.join(data_dir, "spend.json"), "w"),
              separators=(",", ":"), ensure_ascii=False)
    json.dump({"travellers": len(travellers)},
              open(os.path.join(data_dir, "meta.json"), "w"), ensure_ascii=False, indent=2)

    print(f"records: {len(out)}  (dropped {dropped} summary row(s))")
    print(f"distinct travellers (count only): {len(travellers)}")
    print(f"gross: R{sum(r['amount'] for r in out):,.2f}")

if __name__ == "__main__":
    main()
