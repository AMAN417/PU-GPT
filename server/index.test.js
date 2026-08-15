const { GoogleGenAI } = require("@google/genai");

// Mock the @google/genai library
const mockGenerateContent = jest.fn();
const mockGetGenerativeModel = jest.fn(() => ({
  generateContent: mockGenerateContent,
}));
jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: mockGetGenerativeModel,
  })),
}));

const mockApp = {
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  listen: jest.fn((port, cb) => cb()),
};
jest.mock("express", () => () => mockApp);
jest.mock("cors", () => () => "cors-middleware");

describe("PU-GPT Server", () => {
  let originalEnv;

  beforeEach(() => {
    // Backup original process.env
    originalEnv = { ...process.env };
    // Reset mocks before each test
    jest.clearAllMocks();
    // Reset modules to re-evaluate them with new env variables
    jest.resetModules();
  });

  afterEach(() => {
    // Restore original process.env
    process.env = originalEnv;
  });

  // Helper to require the server index file which will now use the mocks
  const loadServer = () => require("./index");

  describe("chatHandler", () => {
    let mockReq, mockRes;

    beforeEach(() => {
      mockReq = {
        body: {},
      };
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
    });

    it("should return 400 if message is missing", async () => {
      process.env.GEMINI_API_KEY = "test-key";
      const { chatHandler } = loadServer();
      await chatHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        reply: "Please send a message.",
      });
    });

    it("should return 400 if message is empty", async () => {
      process.env.GEMINI_API_KEY = "test-key";
      const { chatHandler } = loadServer();
      mockReq.body.message = "   ";
      await chatHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        reply: "Please send a message.",
      });
    });

    it("should return 500 if GEMINI_API_KEY is missing", async () => {
      delete process.env.GEMINI_API_KEY;
      const { chatHandler } = loadServer();
      mockReq.body.message = "Hello";
      await chatHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        reply: "Missing GEMINI_API_KEY in the server environment.",
      });
    });

    it("should call Gemini API and return a reply on success", async () => {
      process.env.GEMINI_API_KEY = "test-key";
      const { chatHandler } = loadServer();
      const mockReply = "Hello from Gemini!";
      mockGenerateContent.mockResolvedValue({
        response: { text: () => mockReply },
      });

      mockReq.body.message = "  Hello  ";
      await chatHandler(mockReq, mockRes);

      expect(mockGetGenerativeModel).toHaveBeenCalledWith({
        model: expect.any(String),
      });
      expect(mockGenerateContent).toHaveBeenCalledWith("Hello");
      expect(mockRes.json).toHaveBeenCalledWith({ reply: mockReply });
    });

    it("should handle Gemini API errors gracefully", async () => {
      process.env.GEMINI_API_KEY = "test-key";
      const { chatHandler } = loadServer();
      const apiError = new Error("API Error");
      apiError.status = 429;
      mockGenerateContent.mockRejectedValue(apiError);

      mockReq.body.message = "Hello";
      await chatHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        reply: expect.stringContaining("quota"),
      });
    });
  });

  describe("getGeminiError", () => {
    let getGeminiError;

    beforeEach(() => {
      // getGeminiError is a pure function, we can import it once
      const serverModule = loadServer();
      getGeminiError = serverModule.getGeminiError;
    });

    it("should handle 429 RESOURCE_EXHAUSTED error", () => {
      const error = new Error(
        JSON.stringify({ error: { status: "RESOURCE_EXHAUSTED" } })
      );
      const result = getGeminiError(error);
      expect(result.statusCode).toBe(429);
      expect(result.reply).toContain("no remaining quota");
    });

    it("should handle 429 error by code", () => {
      const error = { status: 429 };
      const result = getGeminiError(error);
      expect(result.statusCode).toBe(429);
      expect(result.reply).toContain("no remaining quota");
    });

    it("should handle 400 Bad Request error", () => {
      const errorMessage = "Invalid request";
      const error = new Error(
        JSON.stringify({ error: { code: 400, message: errorMessage } })
      );
      const result = getGeminiError(error);
      expect(result.statusCode).toBe(400);
      expect(result.reply).toBe(errorMessage);
    });

    it("should handle 404 model not found error", () => {
      const error = { status: 404 };
      const result = getGeminiError(error);
      expect(result.statusCode).toBe(404);
      expect(result.reply).toContain("is not available for this API key");
    });

    it("should handle fetch failed error", () => {
      const error = new Error("fetch failed");
      const result = getGeminiError(error);
      expect(result.statusCode).toBe(503);
      expect(result.reply).toContain("could not reach Gemini");
    });

    it("should handle generic 500 error with a message", () => {
      const errorMessage = "Internal server error";
      const error = new Error(errorMessage);
      const result = getGeminiError(error);
      expect(result.statusCode).toBe(500);
      expect(result.reply).toBe(errorMessage);
    });

    it("should handle generic 500 error from API response", () => {
      const errorMessage = "Something went wrong";
      const error = new Error(
        `[500] ${JSON.stringify({ error: { message: errorMessage } })}`
      );
      const result = getGeminiError(error);
      expect(result.statusCode).toBe(500);
      expect(result.reply).toBe(errorMessage);
    });

    it("should handle unparseable error object", () => {
      const error = new Error("some weird unparseable string");
      const result = getGeminiError(error);
      expect(result.statusCode).toBe(500);
      expect(result.reply).toBe("some weird unparseable string");
    });

    it("should handle empty error", () => {
      const error = {};
      const result = getGeminiError(error);
      expect(result.statusCode).toBe(500);
      expect(result.reply).toBe("Unable to get a response from Gemini.");
    });
  });

  describe("Server Initialization", () => {
    it("should setup express server and listen on port", () => {
      process.env.GEMINI_API_KEY = "test-key";
      process.env.PORT = "5001";
      loadServer();

      expect(mockApp.use).toHaveBeenCalledWith("cors-middleware");
      expect(mockApp.use).toHaveBeenCalledWith(expect.any(Function)); // express.json
      expect(mockApp.get).toHaveBeenCalledWith("/", expect.any(Function));
      expect(mockApp.post).toHaveBeenCalledWith("/chat", expect.any(Function));
      expect(mockApp.post).toHaveBeenCalledWith(
        "/api/chat",
        expect.any(Function)
      );
      expect(mockApp.get).toHaveBeenCalledWith("/test", expect.any(Function));
      expect(mockApp.listen).toHaveBeenCalledWith("5001", expect.any(Function));
    });

    it("should initialize GoogleGenAI with API key", () => {
      process.env.GEMINI_API_KEY = "super-secret-key";
      loadServer();
      expect(GoogleGenAI).toHaveBeenCalledWith("super-secret-key");
    });

    it("should not initialize GoogleGenAI if no API key", () => {
      delete process.env.GEMINI_API_KEY;
      loadServer();
      expect(GoogleGenAI).not.toHaveBeenCalled();
    });
  });
});