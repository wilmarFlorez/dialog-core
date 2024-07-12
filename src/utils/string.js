function validateMaxLength(text, maxLength) {
  if (text.length > maxLength) {
    const newLength = maxLength - 3
    const slicedText = text.slice(0, newLength)
    return `${slicedText}...`
  }

  return text
}

module.exports = {
  validateMaxLength,
}
