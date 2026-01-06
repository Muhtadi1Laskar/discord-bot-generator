export const checkRepetitions = (text, maxRepeats) => {
    const regex = new RegExp(`([.,\\/#!$%<>\\^&\\*;:{}=\\-_~\`()!?])\\1{${maxRepeats},}`, 'g');
    const isRepeitiveSigns = regex.test(text);

    if (isRepeitiveSigns) {
        return true;
    }

    const charFreq = {};
    const textArray = text.trim().split(' ');

    for (let word of textArray) {
        charFreq[word] = (charFreq[word] || 0) + 1;
        if (charFreq[word] > maxRepeats) return true;
    }
    return false;
}

const isCapitalChar = (char) => /[A-Z]/.test(char);

export const calculateCapitalRatio = (sentence) => {
    if (sentence.length === 0) {
        return 0;
    }

    const len = sentence.length;
    let capitalCharCount = 0;

    for (let i = 0; i < len; i++) {
        if (isCapitalChar(sentence[i])) {
            capitalCharCount++;
        }
    }
    return (capitalCharCount / len);
}

export const checkLinks = (text) => {
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return regex.test(text);
}

export const detectGlobalPing = (text) => {
    return /@everyone|@here/g.test(text);
}