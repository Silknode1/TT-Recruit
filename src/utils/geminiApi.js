import { API_KEY_STORAGE_KEY, GEMINI_CONFIG } from '../config/constants';

// --- GEMINI API HELPER ---
export const callGemini = async (prompt, systemInstruction = "") => {
  const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  const apiKey = storedKey || ""; 

  if (!apiKey) {
    throw new Error("MISSING_KEY");
  }

  const url = `${GEMINI_CONFIG.baseUrl}/${GEMINI_CONFIG.model}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) throw new Error(`Gemini Uplink Failed: ${response.statusText}`);
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No data received from core.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
