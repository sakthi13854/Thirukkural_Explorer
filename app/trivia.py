"""
Curated 'Did You Know?' cultural trivia about Thirukkural and Thiruvalluvar.
Displayed in the loading overlay while Gemini generates short-story explanations.
"""

from typing import List, Dict

TRIVIA_FACTS: List[Dict[str, str]] = [
    {
        "en": "Thirukkural is composed of exactly 1,330 couplets organized into 133 chapters (Athigarams), exactly 10 kurals per chapter.",
        "ta": "திருக்குறள் 133 அதிகாரங்களைக் கொண்டது; ஒவ்வொரு அதிகாரத்திற்கும் 10 குறட்பாக்கள் வீதம் மொத்தம் 1,330 குறட்பாக்கள் உள்ளன."
    },
    {
        "en": "Each kural consists of exactly seven words ('seers')—four in the first line and three in the second line—forming the Venba meter.",
        "ta": "ஒவ்வொரு குறளும் முதலடியில் நான்கு சீர்களும், இரண்டாமடியில் மூன்று சீர்களுமாக மொத்தம் ஏழு சீர்களைக் கொண்ட வெண்பா யாப்பில் இயற்றப்பட்டது."
    },
    {
        "en": "Thirukkural is divided into three universal books (Mu-paal): Aram (Virtue/Ethics), Porul (Wealth/Governance), and Inbam (Love/Desire).",
        "ta": "திருக்குறள் அறத்துப்பால், பொருட்பால், காமத்துப்பால் என்ற மூன்று பால்களாக (முப்பால்) பகுக்கப்பட்டுள்ளது."
    },
    {
        "en": "Reverend G.U. Pope completed his monumental English translation of Thirukkural in 1886, praising Thiruvalluvar as the 'bard of universal mankind'.",
        "ta": "ஜி.யு. போப் 1886-இல் திருக்குறளை ஆங்கிலத்தில் மொழிபெயர்த்து, திருவள்ளுவரை 'உலக மாந்தரின் பொதுப்புலவர்' என்று போற்றினார்."
    },
    {
        "en": "Thirukkural is one of the most translated non-religious literary works on Earth, with translations into over 60 languages worldwide.",
        "ta": "திருக்குறள் எந்த ஒரு மதத்தையும் சாராத உலகப் பொதுமறையாக விளங்கி, 60-க்கும் மேற்பட்ட உலக மொழிகளில் மொழிபெயர்க்கப்பட்டுள்ளது."
    },
    {
        "en": "Throughout all 1,330 verses, Thiruvalluvar never once mentions any religion, deity name, caste, or race, making its ethics truly secular and universal.",
        "ta": "1,330 குறள்களில் திருவள்ளுவர் எங்குமே எந்த ஒரு மதத்தின் பெயரையோ, கடவுளின் பெயரையோ, சாதியையோ குறிப்பிடவில்லை; அது மனித குலம் முழுமைக்கும் உரியது."
    },
    {
        "en": "Albert Schweitzer, Nobel Peace Prize laureate, remarked: 'There hardly exists in world literature another collection of maxims in which we find so lofty an ethical wisdom as in the Thirukkural.'",
        "ta": "நோபல் பரிசு பெற்ற ஆல்பர்ட் சுவைட்சர்: 'திருக்குறளைப் போல இத்தனை உயர்ந்த அறநெறிகளைக் கொண்ட நூல் உலக இலக்கியங்களிலேயே காண்பது அரிது' என்றார்."
    },
    {
        "en": "The letter 'ஔ' (Au) is the only Tamil alphabet letter that does not appear even once anywhere in all 1,330 kurals.",
        "ta": "திருக்குறளில் உள்ள 1330 குறள்களிலும் 'ஔ' என்ற தமிழ் உயிர் எழுத்து ஒருமுறை கூட பயன்படுத்தப்படவில்லை என்பது ஓர் அரிய சிறப்பு."
    },
    {
        "en": "In Kanyakumari at the southern tip of India, a 133-foot stone statue of Thiruvalluvar stands tall, symbolizing the 133 chapters of the work.",
        "ta": "கன்னியாகுமரியில் கடல் நடுவே அமைந்துள்ள திருவள்ளுவர் சிலை, திருக்குறளின் 133 அதிகாரங்களைக் குறிக்கும் வகையில் 133 அடி உயரத்தில் கம்பீரமாக நிற்கிறது."
    },
    {
        "en": "The word 'Tamil' itself is not mentioned even once in Thirukkural, proving its creator intended its philosophy for every human on Earth.",
        "ta": "திருக்குறளில் 'தமிழ்' என்ற சொல் ஒருமுறை கூட இடம் பெறவில்லை; உலகம் முழுவதும் வாழும் மனிதர்களுக்கு அது பொதுவானது என்பதை இது உணர்த்துகிறது."
    }
]

def get_all_trivia() -> List[Dict[str, str]]:
    return TRIVIA_FACTS
