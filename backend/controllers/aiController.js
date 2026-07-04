const model = require("../config/gemini");
const { buildSearchPrompt } = require("../prompts/searchPrompt");
const Product = require("../models/product.model");

const aiSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please describe what you are looking for",
      });
    }

    const prompt = buildSearchPrompt(query);
    console.log("Sending to Gemini:", prompt);

    let searchParams;

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const response = await result.response.text();
      console.log("Gemini Response:", response);
      searchParams = JSON.parse(response.trim());
    } catch (aiError) {
      console.error("Gemini failed, applying local fallback:", aiError.message);

      const words = query.split(" ").filter((w) => w.length > 2);

      const priceMatch = query.match(/\$?(\d+)/);
      const maxPrice = priceMatch ? Number(priceMatch[1]) : 999999;

      searchParams = {
        keywords: words.slice(0, 5),
        category: null,
        priceRange: { min: 0, max: maxPrice },
      };
    }

    const searchQuery = {};

    if (
      searchParams.category &&
      searchParams.category !== "null" &&
      searchParams.category !== null
    ) {
      searchQuery.category = {
        $regex: `^${searchParams.category}$`,
        $options: "i",
      };
    }

    if (searchParams.priceRange) {
      searchQuery.price = {
        $gte: Number(searchParams.priceRange.min) || 0,
        $lte: Number(searchParams.priceRange.max) || 999999,
      };
    }

    const stopWords = [
      "product",
      "products",
      "show",
      "me",
      "want",
      "those",
      "that",
      "items",
      "item",
      "under",
      "buy",
      "a",
      "to",
    ];
    const filteredKeywords = (searchParams.keywords || []).filter(
      (keyword) =>
        !stopWords.includes(keyword.toLowerCase()) && keyword.length > 1,
    );

    if (filteredKeywords.length > 0) {
      const flatOrConditions = [];

      filteredKeywords.forEach((keyword) => {
        flatOrConditions.push({ name: { $regex: keyword, $options: "i" } });
        flatOrConditions.push({
          description: { $regex: keyword, $options: "i" },
        });
      });

      searchQuery.$or = flatOrConditions;
    }

    const products = await Product.find(searchQuery).limit(20);

    return res.json({
      success: true,
      query,
      keywords: searchParams.keywords,
      category: searchParams.category,
      priceRange: searchParams.priceRange,
      products,
      total: products.length,
      message:
        products.length === 0
          ? "No products found matching your description. Try different keywords!"
          : `Found ${products.length} product${products.length > 1 ? "s" : ""} for you`,
    });
  } catch (error) {
    console.error("AI Search Error:", error);
    return res.status(500).json({
      success: false,
      message: "Search failed due to an internal server error.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = { aiSearch };
