const axios = require("axios");


async function getCambridgeWordScramble(payload) {
  try {
    const response = await axios.get(
      "https://dictionary.cambridge.org/cdoapi/v1/wordscramble/",
      payload,
      {
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "vi,en-US;q=0.9,en;q=0.8",
            "Connection": "keep-alive",
            "Cookie": `amp-access=amp-trI5173JAiELOADm3t9NHg; _fbp=fb.1.1747501415546.292940895765543421; _ga=GA1.3.426701113.1747501416; preferredDictionaries="british-grammar,english,english-french,french-english"; XSRF-TOKEN=1a192c7a-2dce-4357-b8c5-e1364a81bdb2; beta-redesign=active; _sp_ses.103f=*; _wsd=2025-06-12T00:00:00.000; _sp_id.103f=fc5f9e7c-112a-45ee-9fba-b0d6484c69d1.1747501415.4.1749722523.1748333149.fa9c6ade-3cd7-4036-a52d-e67dd469ab7d.f16fed93-9de1-416d-9db6-22b660b8d89a.72aed1a9-9f26-4c67-b978-ce852338db8e.1749720733143.8; OptanonConsent=isGpcEnabled=0&datestamp=Thu+Jun+12+2025+17%3A02%3A03+GMT%2B0700+(Indochina+Time)&version=202504.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&AwaitingReconsent=false&geolocation=VN%3BHN; OptanonAlertBoxClosed=2025-06-12T10:02:03.112Z; _ga_L9GCR21SZ7=GS2.3.s1749720733$o4$g1$t1749722524$j51$l0$h0`,
            "Host": "dictionary.cambridge.org",
            "Referer": "https://dictionary.cambridge.org/wordscramble/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": `Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36`,
            "X-XSRF-TOKEN": "1a192c7a-2dce-4357-b8c5-e1364a81bdb2",
            "accessKey": `J7plrhSlB0UmHUBGNrONRCyHywIih2SmsKgyEeuaQWUn0+yceDqgo5LHn20SW5Mvt7Vz+sU8A8wvDkfMLL42rRizHjfLvEuIgfuw6zSbISo=`,
            "sec-ch-ua": `"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"`,
            "sec-ch-ua-mobile": `?1`,
            "sec-ch-ua-platform": "Android"
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi Cambridge API:", error.message);
    throw error;
  }
}

module.exports = getCambridgeWordScramble;
