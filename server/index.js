const path = require("path");
const fs = require("fs");

require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
  override: true,
});

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

const apiKey = process.env.OPENROUTER_API_KEY?.trim();

if (!apiKey) {
  console.error(
    "\n[ERROR] OPENROUTER_API_KEY is not set.\n" +
      "Create server/.env and add:\n\n" +
      "OPENROUTER_API_KEY=sk-or-v1-...\n"
  );
}

app.use(cors());
app.use(express.json());

/*
==========================================
PU-GPT KNOWLEDGE BASE
==========================================
*/

const knowledgeDir = path.join(__dirname, "knowledge");

/*
==========================================
GET ALL KNOWLEDGE FILES RECURSIVELY
==========================================
*/

function getKnowledgeFiles(dir) {
  let files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      files = files.concat(
        getKnowledgeFiles(fullPath)
      );
    } else if (
      item.isFile() &&
      item.name.endsWith(".txt")
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

/*
==========================================
GET FIELD FROM NOTICE
==========================================
*/

function getNoticeField(content, field) {
  const lines = content.split(/\r?\n/);
  const fieldPrefix = `${field}:`;

  const startIndex = lines.findIndex((line) =>
    line.trim().startsWith(fieldPrefix)
  );

  if (startIndex === -1) {
    return "";
  }

  const firstLine = lines[startIndex]
    .trim()
    .slice(fieldPrefix.length)
    .trim();

  const valueLines = [firstLine];

  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];

    // Stop when another FIELD: starts
    if (/^[A-Z][A-Z0-9_ ]*:\s*/.test(line.trim())) {
      break;
    }

    valueLines.push(line.trim());
  }

  return valueLines.join("\n").trim();
}
/*
==========================================
GET ALL NOTICES
==========================================
*/

function getNotices() {
  const noticesDir = path.join(
    knowledgeDir,
    "notices"
  );

  if (!fs.existsSync(noticesDir)) {
    return [];
  }

  const files = getKnowledgeFiles(noticesDir);

  return files
    .map((filePath) => {
      try {
        const content = fs.readFileSync(
          filePath,
          "utf8"
        );

        const date = getNoticeField(
          content,
          "DATE"
        );

        return {
          title: getNoticeField(
            content,
            "TITLE"
          ),

          date: date,

          academicSession: getNoticeField(
            content,
            "ACADEMIC SESSION"
          ),

          category: getNoticeField(
            content,
            "CATEGORY"
          ),

          programme: getNoticeField(
            content,
            "PROGRAMME"
          ),

          status: getNoticeField(
            content,
            "STATUS"
          ),

          importantDate: getNoticeField(
            content,
            "IMPORTANT DATE"
          ),

          summary: getNoticeField(
            content,
            "SUMMARY"
          ),

          source: getNoticeField(
            content,
            "SOURCE"
          ),

          file: path.relative(
            knowledgeDir,
            filePath
          ),

          rawContent: content,
        };
      } catch (error) {
        console.error(
          `Could not read notice: ${filePath}`,
          error
        );

        return null;
      }
    })
    .filter(Boolean);
}

/*
==========================================
SORT NOTICES BY DATE
==========================================
*/

function sortNoticesByDate(notices) {
  return [...notices].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    const timeA = isNaN(dateA.getTime())
      ? 0
      : dateA.getTime();

    const timeB = isNaN(dateB.getTime())
      ? 0
      : dateB.getTime();

    return timeB - timeA;
  });
}

/*
==========================================
NOTICE STATUS HELPERS
==========================================
*/

function normalizeText(text) {
  return String(text || "")
    .trim()
    .toLowerCase();
}

function getCurrentNotices(notices) {
  return notices.filter(
    (notice) =>
      normalizeText(notice.status) ===
      "current"
  );
}

function getExpiredNotices(notices) {
  return notices.filter(
    (notice) =>
      normalizeText(notice.status) ===
      "expired"
  );
}

function getUpcomingNotices(notices) {
  return notices.filter(
    (notice) =>
      normalizeText(notice.status) ===
      "upcoming"
  );
}

/*
==========================================
NOTICE CATEGORY FILTER
==========================================
*/

function filterNoticesByCategory(
  notices,
  category
) {
  if (!category) {
    return notices;
  }

  const searchCategory =
    normalizeText(category);

  return notices.filter((notice) =>
    normalizeText(notice.category).includes(
      searchCategory
    )
  );
}

/*
==========================================
NOTICE QUERY DETECTION
==========================================
*/

function isNoticeQuestion(message) {
  const text = normalizeText(message);

  const noticeWords = [
    "notice",
    "notices",
    "notification",
    "notifications",
    "latest notice",
    "current notice",
    "expired notice",
    "upcoming notice",
  ];

  return noticeWords.some((word) =>
    text.includes(word)
  );
}

/*
==========================================
BUILD NOTICE CONTEXT
==========================================
*/

function buildNoticeContext(message) {
  const notices = sortNoticesByDate(
    getNotices()
  );

  if (notices.length === 0) {
    return `
NOTICE SEARCH RESULT:

No notices are currently available
in the PU-GPT notices directory.
`;
  }

  const text = normalizeText(message);

  let selectedNotices = notices;
  let selectionType = "all notices";

  /*
  ------------------------------------------
  LATEST NOTICE
  ------------------------------------------
  */

  if (
    text.includes("latest notice") ||
    text.includes("latest notification") ||
    text.includes("most recent notice") ||
    text.includes("newest notice")
  ) {
    selectedNotices = notices.slice(0, 1);
    selectionType = "latest notice";
  }

  /*
  ------------------------------------------
  CURRENT NOTICES
  ------------------------------------------
  */

  else if (
    text.includes("current notice") ||
    text.includes("current notices") ||
    text.includes("active notice") ||
    text.includes("active notices")
  ) {
    selectedNotices =
      getCurrentNotices(notices);

    selectionType = "current notices";
  }

  /*
  ------------------------------------------
  EXPIRED NOTICES
  ------------------------------------------
  */

  else if (
    text.includes("expired notice") ||
    text.includes("expired notices")
  ) {
    selectedNotices =
      getExpiredNotices(notices);

    selectionType = "expired notices";
  }

  /*
  ------------------------------------------
  UPCOMING NOTICES
  ------------------------------------------
  */

  else if (
    text.includes("upcoming notice") ||
    text.includes("upcoming notices")
  ) {
    selectedNotices =
      getUpcomingNotices(notices);

    selectionType = "upcoming notices";
  }

  /*
  ------------------------------------------
  CATEGORY FILTER
  ------------------------------------------
  */

  let category = null;

  if (text.includes("admission")) {
    category = "admission";
  } else if (text.includes("scholarship")) {
    category = "scholarship";
  } else if (text.includes("exam")) {
    category = "exam";
  } else if (text.includes("hostel")) {
    category = "hostel";
  } else if (text.includes("placement")) {
    category = "placement";
  }

  if (category) {
    selectedNotices =
      filterNoticesByCategory(
        selectedNotices,
        category
      );

    selectionType += ` - ${category}`;
  }

  /*
  ------------------------------------------
  FORMAT RESULT
  ------------------------------------------
  */

if (selectedNotices.length === 0) {
  return `
NOTICE SEARCH RESULT:

There are currently 0 ${selectionType} in the PU-GPT knowledge base.

IMPORTANT:
This means the requested notice category was checked and no notices currently match it.
Do NOT say the information is unavailable.
Do NOT say the knowledge base does not contain notice information.
Clearly state that there are currently 0 ${selectionType}.
`;
}

  const formatted = selectedNotices
    .map((notice, index) => {
      return `
NOTICE ${index + 1}

TITLE: ${notice.title || "Not specified"}
DATE: ${notice.date || "Not specified"}
ACADEMIC SESSION: ${
        notice.academicSession ||
        "Not specified"
      }
CATEGORY: ${
        notice.category || "Not specified"
      }
PROGRAMME: ${
        notice.programme || "Not specified"
      }
STATUS: ${
        notice.status || "Not specified"
      }
IMPORTANT DATE: ${
        notice.importantDate ||
        "Not specified"
      }
SUMMARY: ${
        notice.summary || "Not specified"
      }
SOURCE: ${
        notice.source || "Not specified"
      }
FILE: ${notice.file}
`;
    })
    .join("\n------------------------------\n");

  return `
NOTICE SEARCH RESULT:

The backend identified this request as:
${selectionType}

${formatted}

IMPORTANT:
Use ONLY the notice information above.
Do not invent missing information.
`;
}

/*
==========================================
LOAD ALL KNOWLEDGE
==========================================
*/

/*
==========================================
FIND RELEVANT KNOWLEDGE FILES
==========================================
*/

function findRelevantKnowledge(message) {
  const text = normalizeText(message);

  const files = getKnowledgeFiles(knowledgeDir);

  if (files.length === 0) {
    return [];
  }

  const keywords = [];

  // Admissions
  if (
    text.includes("admission") ||
    text.includes("apply") ||
    text.includes("application") ||
    text.includes("eligibility") ||
    text.includes("entrance")
  ) {
    keywords.push("admissions.txt");
  }

  // Courses
  if (
    text.includes("course") ||
    text.includes("b.tech") ||
    text.includes("btech") ||
    text.includes("cse") ||
    text.includes("computer science") ||
    text.includes("degree") ||
    text.includes("duration")
  ) {
    keywords.push("courses.txt");
  }

  // Fees
  if (
    text.includes("fee") ||
    text.includes("fees") ||
    text.includes("cost") ||
    text.includes("tuition")
  ) {
    keywords.push("fees.txt");
  }

  // Hostel
  if (
    text.includes("hostel") ||
    text.includes("room") ||
    text.includes("mess")
  ) {
    keywords.push("hostel.txt");
  }

  // Scholarships
  if (
    text.includes("scholarship") ||
    text.includes("financial aid") ||
    text.includes("financial assistance")
  ) {
    keywords.push("scholarships.txt");
  }

  // University
  if (
    text.includes("university") ||
    text.includes("campus") ||
    text.includes("department") ||
    text.includes("contact")
  ) {
    keywords.push("university.txt");
  }

  // Notices
  if (isNoticeQuestion(message)) {
    for (const file of files) {
      const relativePath = path.relative(
        knowledgeDir,
        file
      );

      if (
        relativePath
          .toLowerCase()
          .startsWith("notices" + path.sep)
      ) {
        keywords.push(relativePath);
      }
    }
  }

  /*
  ------------------------------------------
  REMOVE DUPLICATES
  ------------------------------------------
  */

  const uniqueKeywords = [
    ...new Set(
      keywords.map((item) =>
        item.toLowerCase()
      )
    ),
  ];

  /*
  ------------------------------------------
  MATCH FILES
  ------------------------------------------
  */

  return files.filter((filePath) => {
    const relativePath = path
      .relative(
        knowledgeDir,
        filePath
      )
      .toLowerCase();

    return uniqueKeywords.some(
      (keyword) =>
        relativePath === keyword ||
        relativePath.endsWith(
          path.sep + keyword
        )
    );
  });
}

function getKnowledge(filePaths = null) {
  try {
    if (!fs.existsSync(knowledgeDir)) {
      return {
        text:
          "The PU-GPT knowledge base directory does not exist.",
        sources: [],
      };
    }

    const files =
      Array.isArray(filePaths)
        ? filePaths
        : getKnowledgeFiles(knowledgeDir);

    if (files.length === 0) {
      return {
        text:
          "The PU-GPT knowledge base is currently empty.",
        sources: [],
      };
    }

    const sources = [];

    const knowledge = files.map((filePath) => {
      const content = fs.readFileSync(
        filePath,
        "utf8"
      );

      const relativePath = path
        .relative(
          knowledgeDir,
          filePath
        )
        .replace(/\\/g, "/");

      sources.push(relativePath);

      return `
==============================
SOURCE: ${relativePath}
==============================

${content}
`;
    });

    return {
      text: knowledge.join("\n"),
      sources: [...new Set(sources)],
    };
  } catch (error) {
    console.error(
      "Could not read knowledge base:",
      error
    );

    return {
      text:
        "The PU-GPT knowledge base is currently unavailable.",
      sources: [],
    };
  }
}

/*
==========================================
ROUTES
==========================================
*/

app.get("/", (req, res) => {
  res.send("PU-GPT backend running");
});

/*
==========================================
HEALTH CHECK
==========================================
*/

app.get("/notices", (req, res) => {
  try {
    const notices = sortNoticesByDate(
      getNotices()
    );

    res.json({
      count: notices.length,

      current:
        getCurrentNotices(notices).length,

      expired:
        getExpiredNotices(notices).length,

      upcoming:
        getUpcomingNotices(notices).length,

      notices: notices.map((notice) => ({
        title: notice.title,
        date: notice.date,
        academicSession:
          notice.academicSession,
        category:
          notice.category,
        programme:
          notice.programme,
        status:
          notice.status,
        importantDate:
          notice.importantDate,
        summary:
          notice.summary,
        source:
          notice.source,
        file:
          notice.file,
      })),
    });
  } catch (error) {
    console.error(
      "Could not read notices:",
      error
    );

    res.status(500).json({
      error:
        "Could not read notices.",
    });
  }
});
app.get("/health", (req, res) => {
  try {
    const files =
      getKnowledgeFiles(knowledgeDir);

    const notices = getNotices();

    res.json({
      status: "online",

      apiKey: apiKey
        ? "loaded"
        : "missing",

      model: "openrouter/free",

      knowledgeFiles:
        files.map((file) =>
          path.relative(
            knowledgeDir,
            file
          )
        ),

      knowledgeCount:
        files.length,

      noticeCount:
        notices.length,

      currentNotices:
        getCurrentNotices(notices).length,

      expiredNotices:
        getExpiredNotices(notices).length,

      upcomingNotices:
        getUpcomingNotices(notices).length,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message:
        "Could not read knowledge base.",
    });
  }
});


/*
==========================================
NOTICE API
==========================================
*/

/*
==========================================
CHAT
==========================================
*/

async function chatHandler(req, res) {
  const { message, history } =
    req.body || {};

  if (
    !message ||
    typeof message !== "string" ||
    !message.trim()
  ) {
    return res.status(400).json({
      reply:
        "Please send a message.",
    });
  }

  if (!apiKey) {
    return res.status(500).json({
      reply:
        "Missing OPENROUTER_API_KEY in server/.env",
    });
  }

  try {
    /*
    ------------------------------------------
    LOAD KNOWLEDGE
    ------------------------------------------
    */

  const relevantFiles =
  findRelevantKnowledge(message);

const knowledgeSources =
  relevantFiles.map((filePath) =>
    path
      .relative(
        knowledgeDir,
        filePath
      )
      .replace(/\\/g, "/")
  );

const knowledge =
  relevantFiles.length > 0
    ? relevantFiles
        .map((filePath) => {
          const content =
            fs.readFileSync(
              filePath,
              "utf8"
            );

          const relativePath =
            path
              .relative(
                knowledgeDir,
                filePath
              )
              .replace(/\\/g, "/");

          return `
==============================
SOURCE: ${relativePath}
==============================

${content}
`;
        })
        .join("\n")
    : "No specific knowledge files were found.";

console.log(
  "🔎 Relevant knowledge files:",
  knowledgeSources
);

/*
------------------------------------------
NOTICE CONTEXT
------------------------------------------
*/

let noticeContext = "";

if (
  isNoticeQuestion(message)
) {
  noticeContext =
    buildNoticeContext(
      message
    );
}

const messages = [];

    /*
    ==========================================
    SYSTEM INSTRUCTIONS
    ==========================================
    */

    messages.push({
  role: "system",

  content: `
You are PU-GPT, an AI assistant for Punjabi University students.

Your job is to answer questions using the PU-GPT knowledge base.

========================================
STRICT KNOWLEDGE-BASE RULES
========================================

RULE 1:
For any question specifically about Punjabi University,
ONLY use information explicitly present in the knowledge base.

RULE 2:
NEVER add Punjabi University facts from your own knowledge.

Do NOT guess, assume, infer, or complete missing information.

RULE 3:
Never invent or assume:

- fees
- admission dates
- eligibility
- entrance exams
- cutoffs
- seats
- courses
- departments
- campuses
- scholarships
- hostel information
- examination dates
- notices
- placement statistics
- recruiters
- faculty
- contact numbers
- email addresses
- university policies
- rankings
- accreditations
- official status

RULE 4:
If the user asks for information that is NOT explicitly
present in the knowledge base, respond:

"I don't currently have that information in the PU-GPT knowledge base."

Do NOT provide a guessed answer.

RULE 5:
Do NOT claim that information is official, confirmed,
verified, validated, or approved unless the relevant source
explicitly states that.

Do NOT use phrases such as:

- "official university information"
- "officially listed"
- "officially offered"
- "according to the university"
- "the university confirms"
- "the official website says"
- "confirmed"
- "verified"
- "officially confirmed"
- "validated"

unless the relevant source explicitly uses that wording.

When information is available in the knowledge base,
state the information directly and concisely.

Do NOT mention how many knowledge-base files contain
the same information unless the user specifically asks
about the sources.

RULE 6:
Do NOT tell the user to "check the official website",
"check the latest admission information", or similar
unless the knowledge base itself provides that instruction
or a specific official URL.

RULE 7:
Do not add recommendations or warnings containing
unverified Punjabi University information.

========================================
NOTICE RULES
========================================

When answering notice-related questions:

1. Use the NOTICE SEARCH RESULT when it is provided.

2. For "latest notice", use the notice with the
   most recent DATE provided by the backend.

3. For "current notices", only use notices whose
   STATUS is CURRENT.

4. For "expired notices", only use notices whose
   STATUS is EXPIRED.

5. For "upcoming notices", only use notices whose
   STATUS is UPCOMING.

6. If a category is specified, such as admission,
   scholarship, exam, hostel, or placement, only
   use matching notices.

7. Never change a notice's STATUS yourself.

8. Never invent a notice date.

9. Never invent an important date.

10. If no matching notice exists, clearly say that
    no matching notice is currently available in
    the PU-GPT knowledge base.

11. Do not describe a notice as official unless the
    notice source explicitly identifies it as official.

========================================
GENERAL QUESTIONS
========================================

For general questions unrelated to Punjabi University,
you may use your general knowledge.

Example:

User:
"What does CSE mean?"

You may explain CSE generally.

But:

User:
"What is B.Tech CSE at Punjabi University?"

You must use ONLY the knowledge base.

========================================
ANSWER STYLE
========================================

Be friendly.

Be concise.

Use bullet points when useful.

Do not repeat unnecessary information.

If information is missing, clearly say so.

Never pretend to know something that is not in
the knowledge base.

========================================
SOURCE REFERENCES — STRICT
========================================

For every Punjabi University answer that uses
knowledge-base information, you MUST include a
source line at the very end.

The source MUST be selected ONLY from the SOURCE
headers provided in the knowledge base.

Required format:

Source: fees.txt

OR:

Source: notices/2026-08-14-example.txt

Do NOT invent, modify, or guess a source filename.

If multiple knowledge-base files directly support
the answer, list each relevant source on a separate
line.

Example:

Source: courses.txt
Source: fees.txt

Do NOT list files that were not used to answer
the question.

========================================
SOURCE CLAIM RULE
========================================

The word "official" must NOT be used unless the
relevant knowledge-base content itself explicitly
uses the word "official".

The words "verified", "confirmed", "validated",
"approved", or "officially" must NOT be used unless
the relevant source explicitly supports that claim.

Do NOT say:

- "verified figures"
- "official document"
- "official Punjabi University document"
- "official admission document"
- "confirmed by Punjabi University"
- "according to the official website"

unless that exact claim is supported by the
knowledge-base source.

========================================
EXTERNAL WEBSITE RULE
========================================

Do NOT tell the user to check the official website,
admission portal, university website, or any other
external website unless a specific URL is explicitly
provided in the knowledge base.

If no such URL is provided, simply answer using the
knowledge base or state that the information is
unavailable.

========================================
FINAL RESPONSE CHECK
========================================

Before answering, check:

1. Did I use Punjabi University knowledge-base data?
2. If YES, did I include the correct Source line?
3. Did I use any unsupported word such as
   "official", "verified", "confirmed", or "approved"?
4. Did I tell the user to check an external website
   without a URL being provided?

If any answer violates these rules, correct the
response before sending it.

========================================
KNOWLEDGE BASE
========================================

${knowledge}

========================================
NOTICE SEARCH RESULT
========================================

${noticeContext}

========================================
END KNOWLEDGE BASE
========================================
`,
});

    /*
    ==========================================
    CONVERSATION HISTORY
    ==========================================
    */

    if (Array.isArray(history)) {
      for (const item of history) {
        if (
          !item ||
          !item.role
        ) {
          continue;
        }

        let role =
          item.role;

        if (
          role === "model"
        ) {
          role =
            "assistant";
        }

        if (
          role !== "user" &&
          role !== "assistant"
        ) {
          continue;
        }

        let content = "";

        if (
          Array.isArray(
            item.parts
          )
        ) {
          content =
            item.parts
              .map(
                (part) =>
                  part?.text ||
                  ""
              )
              .join("");
        } else if (
          typeof item.content ===
          "string"
        ) {
          content =
            item.content;
        }

        if (
          content.trim()
        ) {
          messages.push({
            role,
            content,
          });
        }
      }
    }

    /*
    ==========================================
    CURRENT USER MESSAGE
    ==========================================
    */

    messages.push({
      role: "user",

      content:
        message.trim(),
    });

    /*
    ==========================================
    OPENROUTER
    ==========================================
    */

    const response =
      await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${apiKey}`,

            "Content-Type":
              "application/json",

            "HTTP-Referer":
              "http://localhost:5173",

            "X-Title":
              "PU-GPT",
          },

          body: JSON.stringify({
            model:
              "openrouter/free",

            messages,

            temperature: 0.1,
          }),
        }
      );

    const data =
      await response.json();

    /*
    ==========================================
    HANDLE OPENROUTER ERROR
    ==========================================
    */

    if (!response.ok) {
      console.error(
        "OpenRouter API error:",
        data
      );

      return res
        .status(
          response.status
        )
        .json({
          reply:
            data?.error
              ?.message ||
            "OpenRouter returned an error.",
        });
    }

    /*
    ==========================================
    GET AI RESPONSE
    ==========================================
    */

    const text =
      data?.choices?.[0]
        ?.message
        ?.content;

    if (!text) {
      console.error(
        "Unexpected OpenRouter response:",
        data
      );

      return res.status(500).json({
        reply:
          "The AI returned an empty response.",
      });
    }

    /*
    ==========================================
    SEND RESPONSE TO FRONTEND
    ==========================================
    */

    res.json({
  reply: text,
  sources: knowledgeSources,
  });
  } catch (error) {
    console.error(
      "OpenRouter connection error:",
      error
    );

    res.status(500).json({
      reply:
        "Could not connect to OpenRouter. Check your internet connection and API key.",
    });
  }
}

/*
==========================================
API ROUTES
==========================================
*/

app.post(
  "/chat",
  chatHandler
);

app.post(
  "/api/chat",
  chatHandler
);

/*
==========================================
TEST ROUTE
==========================================
*/

app.get(
  "/test",
  async (req, res) => {
    req.body = {
      message:
        "What is PU-GPT?",
    };

    return chatHandler(
      req,
      res
    );
  }
);

/*
==========================================
START SERVER
==========================================
*/

app.listen(
  PORT,
  () => {
    let knowledgeFiles = [];

    try {
      knowledgeFiles =
        getKnowledgeFiles(
          knowledgeDir
        );
    } catch {
      // Knowledge directory may not exist yet.
    }

    const notices =
      getNotices();

    console.log(
      `\n🚀 PU-GPT backend running at http://localhost:${PORT}`
    );

    console.log(
      `🔑 OpenRouter API key loaded: ${
        apiKey
          ? "YES"
          : "NO"
      }`
    );

    console.log(
      `📚 Knowledge files loaded: ${
        knowledgeFiles.length
      }`
    );

    console.log(
      `📢 Notices loaded: ${
        notices.length
      }`
    );

    console.log(
      `🟢 Current notices: ${
        getCurrentNotices(
          notices
        ).length
      }`
    );

    console.log(
      `🔴 Expired notices: ${
        getExpiredNotices(
          notices
        ).length
      }`
    );

    console.log(
      `🔵 Upcoming notices: ${
        getUpcomingNotices(
          notices
        ).length
      }`
    );

    console.log(
      "📄 Files:"
    );

    if (
      knowledgeFiles.length
    ) {
      knowledgeFiles.forEach(
        (file) => {
          console.log(
            "   - " +
              path.relative(
                knowledgeDir,
                file
              )
          );
        }
      );
    } else {
      console.log(
        "   - NONE"
      );
    }

    console.log(
      `🤖 Model: openrouter/free\n`
    );
  }
);
module.exports = {
  getNoticeField,
  sortNoticesByDate,
  getCurrentNotices,
  getExpiredNotices,
  getUpcomingNotices,
  filterNoticesByCategory,
  findRelevantKnowledge,
  getKnowledge,
  getNotices,
};