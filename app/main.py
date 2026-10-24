import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv

from app.data import get_kural_by_number, search_kurals, get_random_famous_kurals, Kural, SearchResponse

load_dotenv()

app = FastAPI(
    title="Thirukural Explainer API",
    description="Interactive bilingual Thirukkural explainer combining G.U. Pope translations and LLM short stories.",
    version="1.0.0"
)

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(STATIC_DIR, exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/", include_in_schema=False)
async def serve_index():
    index_file = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "Thirukural Explainer API running. Visit /docs for interactive API."}

@app.get("/api/kural/search", response_model=SearchResponse, summary="Search kurals by number, words, or Athigaram")
async def search(q: str = Query(..., description="Kural number, starting words, or Athigaram (e.g. '1', 'அகர', 'adhigaram 5')")):
    return search_kurals(q)

@app.get("/api/kural/{number}", response_model=Kural, summary="Get Kural by number (1-1330)")
async def get_kural(number: int):
    if number < 1 or number > 1330:
        raise HTTPException(status_code=404, detail="Kural number must be between 1 and 1330.")
    kural = get_kural_by_number(number)
    if not kural:
        raise HTTPException(status_code=404, detail=f"Kural #{number} not found.")
    return kural

@app.get("/api/famous", response_model=list[Kural], summary="Get random famous kurals for exploration")
async def famous_kurals(count: int = Query(5, ge=1, le=10)):
    return get_random_famous_kurals(count)

@app.get("/api/health", summary="Health check")
async def health():
    return {"status": "ok", "total_kurals": 1330}
