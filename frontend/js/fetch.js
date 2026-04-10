/**
 * Fetches JSON data from APIs
 *
 * @param {string} url - api endpoint url
 * @param {Object} options - request options
 *
 * @returns {Object} response json data
 */

// Tokenilla on 1h vanhenemisaika. Nyt tämän avulla käyttäjä tietää automaattisesti kun token on vanhentunut, ja se pyytää kirjautumaan uusiksi.
const fetchData = async (url, options = {}) => {
  const response = await fetch(url, options);
  // Jos token vanhentunut tai ei oikeuksia
  if (response.status === 401 || response.status === 403) {
    console.log("Token expired. Logging out...");
    // poistetaan token
    localStorage.removeItem("token");
    // ohjataan login sivulle
    window.location.href = "index.html";
    return;
  }
let data;

try {
  data = await response.json();
} catch (error) {
  console.error("Response is not JSON:", await response.text());
  return { error: "Invalid JSON response" };
}

return data;
};

export { fetchData };