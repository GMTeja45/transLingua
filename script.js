document.addEventListener('DOMContentLoaded', function () {
    const languages = {
        'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'zh': 'Chinese',
        'ar': 'Arabic', 'hi': 'Hindi', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese',
        'ko': 'Korean', 'it': 'Italian', 'tr': 'Turkish', 'nl': 'Dutch',
        'bn': 'Bengali', 'gu': 'Gujarati', 'kn': 'Kannada', 'ml': 'Malayalam', 'mr': 'Marathi',
        'pa': 'Punjabi', 'ta': 'Tamil', 'te': 'Telugu', 'ur': 'Urdu', 'as': 'Assamese',
        'or': 'Odia', 'mai': 'Maithili', 'sa': 'Sanskrit', 'kok': 'Konkani', 'sd': 'Sindhi'
    };

    const sourceLanguageSelect = document.getElementById('sourceLanguage');
    const targetLanguageSelect = document.getElementById('targetLanguage');
    const sourceTextArea = document.getElementById('sourceText');
    const translatedTextArea = document.getElementById('translatedText');
    const translateButton = document.getElementById('translateButton');
    const recordButton = document.getElementById('recordButton');
    const copyButton = document.getElementById('copyButton');
    const swapLanguagesButton = document.getElementById('swapLanguages');
    const statusMessage = document.getElementById('statusMessage');
    const clearSourceButton = document.getElementById('clearSourceButton');
    const historyList = document.getElementById('historyList');

    function populateLanguageDropdowns() {
        for (const [code, name] of Object.entries(languages)) {
            const sourceOption = document.createElement('option');
            sourceOption.value = code;
            sourceOption.textContent = name;
            sourceLanguageSelect.appendChild(sourceOption);

            const targetOption = document.createElement('option');
            targetOption.value = code;
            targetOption.textContent = name;
            targetLanguageSelect.appendChild(targetOption);
        }
        sourceLanguageSelect.value = 'en';
        targetLanguageSelect.value = 'hi';
    }

    async function translateText() {
        const sourceText = sourceTextArea.value.trim();
        if (!sourceText) {
            alert('Please enter some text to translate.');
            return;
        }

        const sourceLang = sourceLanguageSelect.value;
        const targetLang = targetLanguageSelect.value;
        
        statusMessage.textContent = 'Translating...';

        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`);
            const data = await response.json();
            const translatedText = data[0].map(item => item[0]).join('');
            translatedTextArea.value = translatedText;
            
            // Add to history
            addToHistory(sourceLang, targetLang, sourceText, translatedText);
            
            statusMessage.textContent = 'Translation complete!';
        } catch (error) {
            console.error('Translation Error:', error);
            statusMessage.textContent = 'Translation failed.';
            alert('Failed to translate. Try again later.');
        }
    }

    function addToHistory(sourceLang, targetLang, sourceText, translatedText) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const textContent = document.createElement('div');
        textContent.innerHTML = `<div class="history-languages">${languages[sourceLang]} → ${languages[targetLang]}</div>
                                <div>${sourceText.substring(0, 30)}${sourceText.length > 30 ? '...' : ''}</div>`;
        
        historyItem.appendChild(textContent);
        
        // Add to the beginning of the list
        if (historyList.firstChild) {
            historyList.insertBefore(historyItem, historyList.firstChild);
        } else {
            historyList.appendChild(historyItem);
        }
        
        // Limit history items
        if (historyList.children.length > 10) {
            historyList.removeChild(historyList.lastChild);
        }
        
        // Make history item clickable to restore the translation
        historyItem.addEventListener('click', function() {
            sourceTextArea.value = sourceText;
            translatedTextArea.value = translatedText;
            sourceLanguageSelect.value = sourceLang;
            targetLanguageSelect.value = targetLang;
        });
    }

    function copyToClipboard() {
        translatedTextArea.select();
        document.execCommand('copy');
        
        // Visual feedback
        statusMessage.textContent = 'Text copied to clipboard!';
        setTimeout(() => {
            statusMessage.textContent = 'Ready to translate';
        }, 2000);
    }

    function swapLanguages() {
        const tempLang = sourceLanguageSelect.value;
        sourceLanguageSelect.value = targetLanguageSelect.value;
        targetLanguageSelect.value = tempLang;
        
        // Also swap text if both areas have content
        if (sourceTextArea.value && translatedTextArea.value) {
            const tempText = sourceTextArea.value;
            sourceTextArea.value = translatedTextArea.value;
            translatedTextArea.value = tempText;
        }
    }

    function clearSourceText() {
        sourceTextArea.value = '';
        sourceTextArea.focus();
    }

    let recognition;
    function setupSpeechRecognition() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!window.SpeechRecognition) {
            recordButton.disabled = true;
            statusMessage.textContent = 'Speech recognition not supported in this browser.';
            return;
        }
        
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = function() {
            recordButton.innerHTML = '<span class="material-icons">mic</span> Stop Recording';
            recordButton.classList.add('recording');
            statusMessage.textContent = 'Listening...';
        };

        recognition.onresult = function(event) {
            sourceTextArea.value = event.results[0][0].transcript;
            statusMessage.textContent = 'Speech recognized!';
        };

        recognition.onend = function() {
            recordButton.innerHTML = '<span class="material-icons">mic</span> Start Recording';
            recordButton.classList.remove('recording');
            statusMessage.textContent = 'Ready to translate';
        };

        recognition.onerror = function(event) {
            statusMessage.textContent = 'Speech recognition error: ' + event.error;
            recordButton.innerHTML = '<span class="material-icons">mic</span> Start Recording';
            recordButton.classList.remove('recording');
        };
    }

    function toggleRecording() {
        if (recognition.isStarted) {
            recognition.stop();
            recognition.isStarted = false;
        } else {
            recognition.lang = sourceLanguageSelect.value;
            recognition.start();
            recognition.isStarted = true;
        }
    }

    // Event listeners
    translateButton.addEventListener('click', translateText);
    copyButton.addEventListener('click', copyToClipboard);
    swapLanguagesButton.addEventListener('click', swapLanguages);
    recordButton.addEventListener('click', toggleRecording);
    clearSourceButton.addEventListener('click', clearSourceText);

    // Initialize
    populateLanguageDropdowns();
    setupSpeechRecognition();
});