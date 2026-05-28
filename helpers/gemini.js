const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateAiChecklist(cardTitle, cardDescription, dueDate) {
	const prompt = `Kamu adalah AI Project Assistant yang bertugas menganalisis task dalam sebuah kanban board.

Berdasarkan judul, deskripsi, dan due date card berikut, lakukan assessment dan hasilkan:
1. Priority level task berdasarkan tingkat urgensi dan kompleksitasnya
2. Estimasi due date yang realistis berdasarkan kompleksitas task
3. Daftar checklist langkah-langkah yang perlu dilakukan untuk menyelesaikan task

WAJIB balas dalam format JSON valid saja.
Jangan gunakan markdown.
Jangan tambahkan penjelasan di luar JSON.
Jangan gunakan trailing comma.

ATURAN PRIORITY:
- Gunakan "low" jika task sederhana dan tidak mendesak
- Gunakan "medium" jika task cukup penting dan perlu diselesaikan dalam waktu normal
- Gunakan "high" jika task penting dan perlu segera diselesaikan
- Gunakan "urgent" jika task kritikal dan harus diselesaikan sesegera mungkin
- HANYA gunakan salah satu dari: "low", "medium", "high", "urgent"

ATURAN DUE DATE:
- Format ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
- Pertimbangkan due date yang sudah ada, sesuaikan jika dinilai tidak realistis berdasarkan kompleksitas task

ATURAN CHECKLIST:
- Buat 3 sampai 7 item checklist
- Setiap item harus konkret dan actionable
- Urutkan dari langkah awal hingga akhir
- position dimulai dari 1

Format JSON:
{
  "priority": "string",
  "dueDate": "string",
  "checklists": [
    { "title": "string", "position": 1 },
    { "title": "string", "position": 2 },
    { "title": "string", "position": 3 }
  ]
}

DATA CARD:
Title: ${cardTitle}
Description: ${cardDescription || "No description"}
Due Date: ${dueDate || "Not set"}
`;

	const response = await ai.models.generateContent({
		model: "gemini-3.5-flash",
		contents: prompt,
		config: {
			temperature: 0.2,
			responseMimeType: "application/json",
		},
	});

	return JSON.parse(response.text);
}

module.exports = { generateAiChecklist };
