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