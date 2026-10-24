import os
import logging
from typing import Dict, Optional
from pydantic import BaseModel
from dotenv import load_dotenv

from app.data import Kural

load_dotenv()

logger = logging.getLogger("thirukural.ai")

class StoryResponse(BaseModel):
    kural_number: int
    language: str
    story: str
    cached: bool
    source: str = "gemini-2.5-flash"

# In-memory session cache: key = "{kural_number}_{language}"
STORY_CACHE: Dict[str, str] = {}

def get_gemini_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key.strip() == "" or api_key == "your_gemini_api_key_here":
        return None
    try:
        from google import genai
        return genai.Client(api_key=api_key)
    except Exception as e:
        logger.warning(f"Could not initialize Google GenAI Client: {e}")
        return None

def craft_prompt(kural: Kural, language: str) -> str:
    lang_name = "Tamil" if language == "ta" else "English"
    
    if language == "ta":
        return f"""நீங்கள் ஒரு சிறந்த தமிழ் இலக்கியவாதி மற்றும் கதைசொல்லி. 
கீழே கொடுக்கப்பட்டுள்ள திருக்குறளின் மெய்யான வாழ்வியல் அறக்கருத்தை அனைவரும் எளிதில் புரிந்து கொள்ளும் வண்ணம் ஓர் அழகான, மனதைத் தொடும் 2 அல்லது 3 பத்திகள் கொண்ட எளிய சிறுகதையை எழுதவும்.

குறள் #{kural.number} ({kural.adhigaram_name}):
"{kural.line1}
{kural.line2}"

உரை விளக்கம்: {kural.explanation_ta}
ஜி.யு. போப் விளக்கம்: {kural.explanation_en}

வழிகாட்டுதல்கள்:
1. கதையை முற்றிலும் எளிய, இனிமையான தமிழில் எழுதவும்.
2. கதை சாதாரண மனிதர்களின் அன்றாட வாழ்வு அல்லது ஓர் உண்மைச் சூழலை அடிப்படையாகக் கொண்டு, குறளின் நீதியை இயற்கையாக உணர்த்துவதாக அமைய வேண்டும்.
3. எந்த ஒரு மதக் கோட்பாட்டையும் திணிக்காமல், மனிதநேயம், ஒழுக்கம், அல்லது உண்மை அன்பை முன்னிறுத்தவும்.
4. தலைப்பு அல்லது முன்னுரை ஏதுமின்றி நேரடியாகக் கதையைத் தொடங்கவும்."""
    else:
        return f"""You are a master storyteller and scholar of classical world ethics.
Write an engaging, heartwarming 2-to-3 paragraph short story set in everyday human life that vividly illustrates the core moral and practical wisdom of this Thirukkural couplet.

Verse #{kural.number} (Chapter: {kural.adhigaram_name_en} / {kural.paal_en}):
Tamil: "{kural.line1} {kural.line2}"
G.U. Pope Translation (1886): "{kural.pope_couplet or kural.translation}"
Prose Meaning: "{kural.explanation_en}"

Guidelines:
1. Write the story entirely in English.
2. Ground the narrative in a relatable human experience (e.g. mentorship, community, craftsmanship, kindness, or family life) that shows the verse in action.
3. Keep the tone inspiring, warm, and culturally respectful.
4. Output only the short story in 2 to 3 well-crafted paragraphs without markdown headings or introductory meta-chatter."""

def get_contextual_fallback_story(kural: Kural, language: str) -> str:
    """Intelligent fallback story when offline or API key is not yet configured."""
    if language == "ta":
        return (
            f"ஒரு கிராமத்தில் முதியவர் ஒருவர் இருந்தார். அவர் வாழ்நாள் முழுவதும் எத்தனையோ மனிதர்களைக் கண்டவர். "
            f"ஒருநாள் அவரது பேரன்பன் அவரிடம் வந்து, 'தாத்தா, இவ்வுலகில் வாழ்வதற்கு மிக அவசியமான வழி எது?' என்று கேட்டான். "
            f"முதியவர் புன்னகையுடன் அவனை அருகிலுள்ள பழமையான ஆலமரத்தின் நிழலுக்கு அழைத்துச் சென்றார்.\n\n"
            f"'பார்த்தாயா மகனே, இந்த மரத்தின் ஆழமான வேர்கள் நிலத்தை இறுகப் பற்றியிருப்பதைப்போல, மனித வாழ்க்கையும் சில அடிப்படை அறநெறிகளிலேயே தங்கியிருக்கிறது. "
            f"திருவள்ளுவர் {kural.adhigaram_name} என்ற அதிகாரத்தில் '{kural.line1}' என்று பாடியதும் இதைத்தான். "
            f"நாம் பிறருக்குச் செய்யும் நன்மையும், மனதில் கொண்டிருக்கும் தூய எண்ணமுமே நம்மை வழிநடத்தும் உண்மையான செல்வம்' என்றார்.\n\n"
            f"தாத்தாவின் சொற்களைக் கேட்ட இளைஞன், வெறும் சொற்களைவிட நற்செயல்களே வாழ்வின் தலையாய விழுமியம் என்பதை ஆழமாகப் புரிந்து கொண்டான்."
        )
    else:
        return (
            f"In a quiet coastal town, an old carpenter named Maran was renowned not for wealth, but for the quiet dignity of his work. "
            f"One evening, an ambitious young apprentice asked him how one could lead a life of true consequence without losing one's peace. "
            f"Maran set down his chisel, gestured to the carved timber before them, and reflected on the wisdom of the Thirukkural.\n\n"
            f"'Consider how every vessel must have its keel balanced before it braves the open sea,' Maran spoke softly. "
            f"'In Chapter {kural.adhigaram_number} ({kural.adhigaram_name_en}), the sage observed: \"{kural.pope_couplet or kural.explanation_en}\". "
            f"The outward circumstances of the world may shift like tides, but the integrity you carry within your heart remains your true compass.'\n\n"
            f"The apprentice reflected on those words and realized that true wisdom was never an abstract riddle, but an everyday habit of honesty, kindness, and moral courage."
        )

async def generate_kural_story(kural: Kural, language: str = "en") -> StoryResponse:
    cache_key = f"{kural.number}_{language}"
    
    # Check in-memory cache
    if cache_key in STORY_CACHE:
        return StoryResponse(
            kural_number=kural.number,
            language=language,
            story=STORY_CACHE[cache_key],
            cached=True,
            source="in-memory-cache"
        )

    client = get_gemini_client()
    story_text = ""
    source = "gemini-2.5-flash"

    if client:
        try:
            prompt = craft_prompt(kural, language)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            if response and response.text:
                story_text = response.text.strip()
        except Exception as e:
            logger.error(f"Gemini generation error for kural #{kural.number}: {e}")
            story_text = get_contextual_fallback_story(kural, language)
            source = "contextual-fallback"
    else:
        logger.info(f"No GEMINI_API_KEY found, using contextual fallback for kural #{kural.number}")
        story_text = get_contextual_fallback_story(kural, language)
        source = "contextual-fallback"

    # Cache for the lifetime of this session
    STORY_CACHE[cache_key] = story_text

    return StoryResponse(
        kural_number=kural.number,
        language=language,
        story=story_text,
        cached=False,
        source=source
    )
