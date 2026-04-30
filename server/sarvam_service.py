from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sarvamai import SarvamAI
import uvicorn
import os
import tempfile
import json
import re
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

SARVAM_KEY = os.getenv("SARVAM_API_KEY")
OUTPUT_DIR = "outputs"

if not SARVAM_KEY:
    raise Exception("SARVAM_API_KEY not set in .env or environment")

client = SarvamAI(api_subscription_key=SARVAM_KEY)

app = FastAPI()

def clean_ai_response(text: str, tag: str = "result") -> str:
    """Robustly extracts the result by stripping thinking blocks FIRST."""
    if not text:
        return ""
    
    # 1. PRE-CLEAN: Remove all <think> blocks immediately to prevent meta-talk confusion
    # This handles both closed and unclosed <think> blocks.
    text = re.sub(r'<think.*?>.*?(?:</think>|$)', '', text, flags=re.DOTALL | re.IGNORECASE)
    
    # 2. EXTRACT: Look for the specific tag in the already-stripped text
    pattern = rf'<{tag}>(.*?)</{tag}>'
    match = re.search(pattern, text, flags=re.DOTALL | re.IGNORECASE)
    if match:
        cleaned = match.group(1).strip()
    else:
        # Fallback: Check for an unclosed tag
        pattern = rf'<{tag}>(.*)'
        match = re.search(pattern, text, flags=re.DOTALL | re.IGNORECASE)
        if match:
            cleaned = match.group(1).strip()
        else:
            # Last resort: if it's the main result, just take the whole remaining text
            cleaned = text.strip() if tag == "result" else ""

    # 3. FINAL POLISH: Remove any stray HTML-like tags and quotes
    cleaned = re.sub(r'</?.*?>', '', cleaned)
    cleaned = cleaned.strip().strip('"').strip("'").strip()
    return cleaned

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Path(OUTPUT_DIR).mkdir(exist_ok=True)


@app.post("/stt")
async def speech_to_text(
    file: UploadFile = File(...),
    language: str = Form("en-IN"),
):
    try:
        with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
            tmp.write(await file.read())
            tmp.seek(0)

            # ==========================
            # STEP 1: ORIGINAL TRANSCRIPT (STT) - Synchronous for speed
            # ==========================

            response = client.speech_to_text.transcribe(
                file=tmp,
                model="saaras:v3",
                language_code=language
            )

        original_text = response.transcript

        # ==========================
        # STEP 2: COMBINED AI RESPONSE (TRANSLATION + TUTOR)
        # ==========================

        prompt = f"""
        The user said: "{original_text}"

        Please do two things:
        1. Translate the user's text to English inside <translation> tags.
        2. Provide a helpful, conversational tutor response in English inside <result> tags.
        """

        messages = [
            {
                "role": "system",
                "content": "You are a helpful AI Voice Tutor. You receive multilingual transcripts and provide English translations and educational responses.",
            },
            {"role": "user", "content": prompt},
        ]

        # Single LLM call for both tasks
        response = client.chat.completions(messages=messages)
        raw_content = response.choices[0].message.content

        # Extract the two parts
        translated_text = clean_ai_response(raw_content, tag="translation")
        ai_reply = clean_ai_response(raw_content, tag="result")

        return {
            "original_text": original_text,
            "translated_text": translated_text if translated_text else "Translation unavailable",
            "ai_response": ai_reply if ai_reply else "Response unavailable",
        }


    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    uvicorn.run("sarvam_service:app", host="0.0.0.0", port=8000, reload=True)