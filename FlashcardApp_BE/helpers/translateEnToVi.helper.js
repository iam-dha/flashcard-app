
async function translateEnToVi(text) {
  const apiUrl = 'https://lingva.ml/api/v1/en/vi/' + encodeURIComponent(text);

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.status}`);
    }

    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.error('Lỗi khi dịch văn bản:', error);
    return null;
  }
}

module.exports = translateEnToVi;