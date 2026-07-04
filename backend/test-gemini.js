const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const testGemini = async () => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    console.log(
      "🔑 API Key:",
      apiKey ? `${apiKey.substring(0, 10)}...` : "Not found",
    );
    console.log("📏 Key Length:", apiKey ? apiKey.length : 0);

    if (!apiKey || apiKey.length < 30) {
      console.error("❌ Invalid API Key!");
      console.log("Please check your .env file");
      return;
    }

    console.log("\n🔍 Testing Gemini API...");
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

    let success = false;

    for (const modelName of modelsToTry) {
      try {
        console.log(`📌 Trying: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(
          "Say 'Hello from ShopNest!'",
        );
        const response = await result.response.text();

        console.log(`✅ SUCCESS with ${modelName}!`);
        console.log("📝 Response:", response);
        console.log(`\n🎉 Use this model: ${modelName}`);
        success = true;
        break;
      } catch (error) {
        if (error.message.includes("404")) {
          console.log(`❌ ${modelName}: Not found`);
        } else if (
          error.message.includes("permission") ||
          error.message.includes("access")
        ) {
          console.log(
            `❌ ${modelName}: Permission denied - API might not be enabled`,
          );
        } else {
          console.log(`❌ ${modelName}: ${error.message}`);
        }
      }
    }

    if (!success) {
      console.log("\n❌ All models failed.");
      console.log("\n📌 Next steps:");
      console.log("1. Wait 2-5 minutes after enabling the API");
      console.log(
        "2. Make sure the API key has 'Generative Language API' restriction",
      );
      console.log("3. Check if billing is enabled (required for free tier)");
      console.log("4. Try creating a new API key");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

testGemini();
