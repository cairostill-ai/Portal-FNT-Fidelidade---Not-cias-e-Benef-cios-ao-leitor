
import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem, Category } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchNewsFromAI(category?: Category): Promise<NewsItem[]> {
  try {
    const categoryQuery = category ? ` na categoria ${category}` : "";
    const prompt = `Acesse o site https://www.portalfnt.com.br e extraia as 6 notícias mais recentes e importantes de Franca e região da Alta Mogiana${categoryQuery}. 
    Se não encontrar notícias específicas para a categoria, retorne as notícias gerais mais recentes do portal.
    Retorne os dados EXATAMENTE no formato JSON de array de objetos.
    Cada objeto deve ter: id, title, excerpt, content (pelo menos 3 parágrafos baseados na notícia real), category (uma das seguintes: Franca, Região, Política, Esportes, Cultura, Polícia, Colunistas), imageUrl (use a URL da imagem real da notícia se disponível, ou uma do Unsplash relacionada ao tema), date (formatada DD/MM/AAAA), author, sourceUrl (URL original da notícia).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              content: { type: Type.STRING },
              category: { type: Type.STRING },
              imageUrl: { type: Type.STRING },
              date: { type: Type.STRING },
              author: { type: Type.STRING },
              sourceUrl: { type: Type.STRING }
            },
            required: ["id", "title", "excerpt", "content", "category", "imageUrl", "date", "author", "sourceUrl"]
          }
        }
      }
    });

    const news: NewsItem[] = JSON.parse(response.text || "[]");
    return news;
  } catch (error) {
    console.error("Erro ao buscar notícias com Gemini e Google Search:", error);
    return [];
  }
}

export async function generateCoupon(): Promise<any> {
  // Retornando parceiros reais fixos conforme solicitado pelo usuário
  return [
    {
      id: "p1",
      partnerName: "Two Brothers Pizzaria",
      description: "A melhor pizza de Franca com massa artesanal e ingredientes selecionados. Em breve, descontos exclusivos para leitores do Portal FNT.",
      discount: "EM BREVE",
      code: "FNT-2BROS",
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
      link: "https://twobrothers.app/"
    },
    {
      id: "p2",
      partnerName: "Chillis Bar Videokê",
      description: "O ponto de encontro mais animado da cidade! Muita música, drinks e diversão. Prepare seu gogó, benefícios exclusivos chegando em breve no seu Portal FNT.",
      discount: "EM BREVE",
      code: "FNT-CHILLIS",
      // Imagem atualizada conforme fornecido pelo usuário (Banner oficial Chillis)
      imageUrl: "https://images.unsplash.com/photo-1485872299829-c673f5194813?auto=format&fit=crop&q=80&w=1200", 
      link: "https://www.instagram.com/chillisvideoke/"
    }
  ];
}
