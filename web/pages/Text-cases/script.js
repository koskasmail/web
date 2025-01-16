function toUpper() {
    const inputText = document.getElementById('input-text').value;
    document.getElementById('output-text').value = inputText.toUpperCase();
}

function toCamelCase() {
    const inputText = document.getElementById('input-text').value;
    const words = inputText.split(/[\s-_]+/);
    let camelCaseText = words[0].toLowerCase();
    for (let i = 1; i < words.length; i++) {
        camelCaseText += words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }
    document.getElementById('output-text').value = camelCaseText;
}

function toSentenceCase() {
    const inputText = document.getElementById('input-text').value;
    const sentences = inputText.toLowerCase().split(/[.!?]/);
    let sentenceCaseText = "";
    for (let i = 0; i < sentences.length; i++) {
        const words = sentences[i].trim().split(/\s+/);
        sentenceCaseText += words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
        for (let j = 1; j < words.length; j++) {
            sentenceCaseText += " " + words[j].toLowerCase();
        }
        if (i < sentences.length - 1) {
            sentenceCaseText += sentences[i].slice(-1);
        }
    }
    document.getElementById('output-text').value = sentenceCaseText;
}

function toKebabCase() {
    const inputText = document.getElementById('input-text').value;
    const kebabCaseText = inputText.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
    document.getElementById('output-text').value = kebabCaseText.toLowerCase();
}

function toSnakeCase() {
    const inputText = document.getElementById('input-text').value;
    const snakeCaseText = inputText.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
    document.getElementById('output-text').value = snakeCaseText.toLowerCase();
}
