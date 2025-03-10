from flask import Flask, render_template, request, jsonify
from deep_translator import GoogleTranslator
import os

app = Flask(__name__, template_folder='templates', static_folder='static')

language_mapping = {
    "English": "en",
    "Hindi": "hi",
    "French": "fr",
    "Spanish": "es",
    "German": "de",
    "Chinese": "zh",
    "Japanese": "ja",
    "Korean": "ko",
    "Russian": "ru",
    "Arabic": "ar",
    "Portuguese": "pt",
    "Italian": "it",
    "Bengali": "bn",
    "Urdu": "ur",
    "Tamil": "ta",
    "Telugu": "te",
    "Marathi": "mr",
    "Gujarati": "gu",
    "Punjabi": "pa",
    "Malayalam": "ml",
    "Kannada": "kn",
    "Odia": "or",
    "Assamese": "as",
    "Maithili": "mai",
    "Konkani": "kok",
    "Santali": "sat",
    "Manipuri": "mni",
    "Bodo": "brx",
    "Dogri": "doi",
    "Sindhi": "sd",
    "Sanskrit": "sa",
    "Kashmiri": "ks",
    "Nepali": "ne",
    "Bhili": "bhb"
}

@app.route('/')
def home():
    return render_template('index.html', languages=list(language_mapping.keys()))

@app.route('/translate', methods=['POST'])
def translate():
    data = request.get_json()
    text = data.get("text", "").strip()
    target_lang = language_mapping.get(data.get("lang", "English"), "en")
    
    if not text:
        return jsonify({"error": "No text provided."}), 400
    
    try:
        translated_text = GoogleTranslator(source='auto', target=target_lang).translate(text)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    return jsonify({"translated_text": translated_text})

@app.route('/speak', methods=['POST'])
def speak():
    data = request.get_json()
    text = data.get("text", "").strip()
    lang_code = language_mapping.get(data.get("lang", "English"), "en")
    
    if not text:
        return jsonify({"error": "No text provided."}), 400
    
    try:
        from gtts import gTTS
        import base64
        from io import BytesIO
        
        tts = gTTS(text=text, lang=lang_code)
        audio_fp = BytesIO()
        tts.write_to_fp(audio_fp)
        audio_fp.seek(0)
        audio_base64 = base64.b64encode(audio_fp.read()).decode('utf-8')
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    return jsonify({"audio": audio_base64})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
