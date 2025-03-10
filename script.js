async function translateText() {
    let text = document.getElementById("inputText").value;
    let lang = document.getElementById("languageSelect").value;

    let response = await fetch("/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text, lang: lang })
    });

    let data = await response.json();
    document.getElementById("outputText").value = data.translated_text;
}
