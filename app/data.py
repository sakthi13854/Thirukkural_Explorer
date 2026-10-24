import json
import os
import random
import re
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class Kural(BaseModel):
    number: int
    line1: str
    line2: str
    translation: str
    pope_couplet: Optional[str] = ""
    explanation_en: Optional[str] = ""
    explanation_ta: Optional[str] = ""
    adhigaram_number: int
    adhigaram_name: str
    adhigaram_name_en: str
    paal: str
    paal_en: str

class SearchResponse(BaseModel):
    found: bool
    query: str
    kural: Optional[Kural] = None
    results: List[Kural] = []
    fallback_kurals: List[Kural] = []
    message: Optional[str] = None

# Famous, widely celebrated kurals for fallback discovery
FAMOUS_KURAL_NUMBERS = [1, 66, 78, 102, 311, 391, 392, 400, 616, 788, 1071, 1330]

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "thirukkural.json")

KURALS_BY_NUMBER: Dict[int, Kural] = {}
ALL_KURALS: List[Kural] = []

def load_data():
    global KURALS_BY_NUMBER, ALL_KURALS
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Thirukkural data file not found at {DATA_PATH}")
    
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        raw_items = json.load(f)
        
    ALL_KURALS = [Kural(**item) for item in raw_items]
    KURALS_BY_NUMBER = {k.number: k for k in ALL_KURALS}
    print(f"Loaded {len(ALL_KURALS)} kurals into memory.")

def get_kural_by_number(number: int) -> Optional[Kural]:
    return KURALS_BY_NUMBER.get(number)

def get_random_famous_kurals(count: int = 5) -> List[Kural]:
    selected_numbers = random.sample(FAMOUS_KURAL_NUMBERS, min(count, len(FAMOUS_KURAL_NUMBERS)))
    return [KURALS_BY_NUMBER[n] for n in selected_numbers if n in KURALS_BY_NUMBER]

def search_kurals(query: str, limit: int = 5) -> SearchResponse:
    q = query.strip()
    if not q:
        return SearchResponse(
            found=False,
            query="",
            fallback_kurals=get_random_famous_kurals(limit),
            message="Please enter a kural number, text, or Athigaram."
        )

    # 1. Exact numeric search
    if q.isdigit():
        num = int(q)
        if 1 <= num <= 1330 and num in KURALS_BY_NUMBER:
            kural = KURALS_BY_NUMBER[num]
            return SearchResponse(
                found=True,
                query=q,
                kural=kural,
                results=[kural],
                message=f"Found Kural #{num}"
            )
        else:
            return SearchResponse(
                found=False,
                query=q,
                fallback_kurals=get_random_famous_kurals(limit),
                message=f"Kural #{num} does not exist. Thirukkural contains 1,330 verses."
            )

    # 2. Athigaram / Chapter search (e.g. "adhigaram 5", "chapter 12", "அதிகாரம் 1")
    chapter_match = re.search(r"(?:adhigaram|chapter|அதிகாரம்)\s*(\d+)", q, re.IGNORECASE)
    if chapter_match:
        ch_num = int(chapter_match.group(1))
        if 1 <= ch_num <= 133:
            first_kural_num = (ch_num - 1) * 10 + 1
            if first_kural_num in KURALS_BY_NUMBER:
                kural = KURALS_BY_NUMBER[first_kural_num]
                return SearchResponse(
                    found=True,
                    query=q,
                    kural=kural,
                    results=[kural],
                    message=f"Found Athigaram #{ch_num}: {kural.adhigaram_name} ({kural.adhigaram_name_en})"
                )

    # 3. Text search across Tamil text, English translations, and Athigaram names
    q_lower = q.lower()
    matches = []
    
    # Priority 1: Prefix match on line 1 or line 2
    for k in ALL_KURALS:
        if k.line1.lower().startswith(q_lower) or k.line2.lower().startswith(q_lower):
            matches.append(k)
            if len(matches) >= limit:
                break
                
    # Priority 2: Substring match in lines or Athigaram
    if len(matches) < limit:
        for k in ALL_KURALS:
            if k not in matches:
                if (q_lower in k.line1.lower() or 
                    q_lower in k.line2.lower() or 
                    q_lower in k.adhigaram_name.lower() or 
                    q_lower in k.adhigaram_name_en.lower() or
                    q_lower in k.translation.lower()):
                    matches.append(k)
                    if len(matches) >= limit:
                        break

    if matches:
        return SearchResponse(
            found=True,
            query=q,
            kural=matches[0],
            results=matches,
            message=f"Found {len(matches)} matching verse(s)."
        )

    # 4. Search miss: Return randomized famous kurals
    return SearchResponse(
        found=False,
        query=q,
        fallback_kurals=get_random_famous_kurals(limit),
        message=f"No verse found matching '{q}'. Explore these celebrated kurals instead:"
    )

# Preload data on module import
load_data()
