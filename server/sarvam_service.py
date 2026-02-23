from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sarvamai import SarvamAI
import uvicorn
import os
import tempfile
import json
from pathlib import Path

SARVAM_KEY = os.getenv("SARVAM_API_KEY")
OUTPUT_DIR = "outputs"

if not SARVAM_KEY:
    raise Exception("SARVAM_API_KEY not set")

client = SarvamAI(api_subscription_key=SARVAM_KEY)

app = FastAPI()

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
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # ==========================
        # STEP 1: ORIGINAL TRANSCRIPT
        # ==========================

        job = client.speech_to_text_job.create_job(
            model="saaras:v3",
            language_code=language,
            with_diarization=False,
        )

        job.upload_files(file_paths=[tmp_path])
        job.start()
        job.wait_until_complete()

        if job.is_failed():
            return {"error": "Transcription failed"}

        job_output_dir = Path(OUTPUT_DIR) / f"job_{job.job_id}"
        job_output_dir.mkdir(parents=True, exist_ok=True)
        job.download_outputs(output_dir=str(job_output_dir))

        json_files = list(job_output_dir.glob("*.json"))
        if not json_files:
            return {"error": "Transcript not found"}

        with open(json_files[0], "r", encoding="utf-8") as f:
            data = json.load(f)

        original_text = data.get("transcript", "")

        # ==========================
        # STEP 2: TRANSLATE TO ENGLISH
        # ==========================

        translation_prompt = f"""
        Translate the following text to English.
        Only return the translated English text.

        Text:
        {original_text}
        """

        translation_messages = [
            {"role": "system", "content": "You are a professional translator."},
            {"role": "user", "content": translation_prompt},
        ]

        translation_response = client.chat.completions(messages=translation_messages)
        translated_text = translation_response.choices[0].message.content

        # ==========================
        # STEP 3: AI RESPONSE
        # ==========================

        tutor_messages = [
            {
                "role": "system",
                "content": "You are a helpful AI tutor. Respond clearly and conversationally in English.",
            },
            {
                "role": "user",
                "content": translated_text,
            },
        ]

        tutor_response = client.chat.completions(messages=tutor_messages)
        ai_reply = tutor_response.choices[0].message.content

        return {
            "original_text": original_text,
            "translated_text": translated_text,
            "ai_response": ai_reply,
        }

    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    uvicorn.run("sarvam_service:app", host="0.0.0.0", port=8000, reload=True)