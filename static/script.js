document.addEventListener("DOMContentLoaded", function () {
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");
    const sourceLang = document.getElementById("sourceLang");
    const targetLang = document.getElementById("targetLang");
    const translateBtn = document.getElementById("translateBtn");
    const startRecording = document.getElementById("startRecording");
    const copyText = document.getElementById("copyText");
    const clearText = document.getElementById("clearText");

    const languageMapping = {
        "English": "en-US",
        "Hindi": "hi-IN",
        "French": "fr-FR",
        "Spanish": "es-ES",
        "German": "de-DE",
        "Chinese": "zh-CN",
        "Japanese": "ja-JP",
        "Korean": "ko-KR",
        "Russian": "ru-RU",
        "Arabic": "ar-SA",
        "Portuguese": "pt-PT",
        "Italian": "it-IT",
        "Bengali": "bn-IN",
        "Urdu": "ur-IN",
        "Tamil": "ta-IN",
        "Telugu": "te-IN",
        "Marathi": "mr-IN",
        "Gujarati": "gu-IN",
        "Punjabi": "pa-IN",
        "Malayalam": "ml-IN",
        "Kannada": "kn-IN",
        "Odia": "or-IN",
        "Assamese": "as-IN",
        "Maithili": "mai-IN",
        "Konkani": "kok-IN",
        "Santali": "sat-IN",
        "Manipuri": "mni-IN",
        "Bodo": "brx-IN",
        "Dogri": "doi-IN",
        "Sindhi": "sd-IN",
        "Sanskrit": "sa-IN",
        "Kashmiri": "ks-IN",
        "Nepali": "ne-IN",
        "Bhili": "bhb-IN"
    };

    function populateLanguages() {
        Object.keys(languageMapping).forEach(lang => {
            const option1 = document.createElement("option");
            option1.value = lang;
            option1.textContent = lang;
            sourceLang.appendChild(option1);

            const option2 = document.createElement("option");
            option2.value = lang;
            option2.textContent = lang;
            targetLang.appendChild(option2);
        });

        sourceLang.value = "English";
        targetLang.value = "Hindi";
    }

    populateLanguages();

    translateBtn.addEventListener("click", async function () {
        const text = inputText.value.trim();
        const lang = targetLang.value;

        if (!text) {
            alert("Please enter text to translate.");
            return;
        }

        try {
            const response = await fetch("/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, lang }),
            });

            const data = await response.json();
            if (data.error) {
                outputText.innerText = `Error: ${data.error}`;
            } else {
                outputText.innerText = data.translated_text;
            }
        } catch (error) {
            outputText.innerText = "Translation failed.";
        }
    });

    startRecording.addEventListener("click", function () {
        if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
            alert("Your browser does not support speech recognition.");
            return;
        }

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        const selectedLang = sourceLang.value;
        recognition.lang = languageMapping[selectedLang] || "en-US";  // Use language mapping

        recognition.start();

        recognition.onresult = function (event) {
            inputText.value = event.results[0][0].transcript;
        };

        recognition.onerror = function () {
            alert("Voice recognition failed. Try again.");
        };
    });

    copyText.addEventListener("click", function () {
        navigator.clipboard.writeText(outputText.value);
        alert("Copied to clipboard!");
    });

    clearText.addEventListener("click", function () {
        inputText.value = "";
        outputText.value = "";
    });
});
