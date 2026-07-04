const buildSearchPrompt = (userQuery) => {
  return `
    Extract product search parameters from this user query: "${userQuery}"
    
    Return ONLY a valid JSON object with these exact keys:
    {
      "keywords": ["word1", "word2", "word3"],
      "category": "suggested_category_or_null",
      "priceRange": {
        "min": 0,
        "max": 999999
      }
    }
    
    Rules:
    - Extract the most important 3-5 keywords
    - Suggest category if obvious (shoes, electronics, clothing, books, etc.)
    - Extract price range if mentioned
    - If no price mentioned, set min: 0, max: 999999
    
    Examples:
    Query: "I need running shoes under $100" 
    → {"keywords": ["running", "shoes"], "category": "shoes", "priceRange": {"min": 0, "max": 100}}
    
    Query: "Show me blue jeans"
    → {"keywords": ["blue", "jeans"], "category": "clothing", "priceRange": {"min": 0, "max": 999999}}
    
    Query: "Gaming laptop"
    → {"keywords": ["gaming", "laptop"], "category": "electronics", "priceRange": {"min": 0, "max": 999999}}
  `;
};

module.exports = { buildSearchPrompt };