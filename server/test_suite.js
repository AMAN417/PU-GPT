const { test, describe } = require("node:test");
const assert = require("node:assert");
const path = require("path");

const {
  getNoticeField,
  getNotices,
  sortNoticesByDate,
  normalizeText,
  getCurrentNotices,
  getExpiredNotices,
  getUpcomingNotices,
  filterNoticesByCategory,
  isNoticeQuestion,
  findRelevantKnowledge,
  getKnowledge,
} = require("./index");

const knowledgeDir = path.join(__dirname, "knowledge");

/*
==================================================
1. NOTICE PARSING TESTS
==================================================
*/
describe("1. Notice Parsing", () => {
  test("should parse single-line fields correctly", () => {
    const raw = `
TITLE: B.Tech Admission Notice
DATE: 2026-08-15
ACADEMIC SESSION: 2026-27
CATEGORY: Admission
PROGRAMME: B.Tech CSE
STATUS: CURRENT
IMPORTANT DATE: 2026-08-30
SOURCE: Official Portal
`;
    assert.strictEqual(getNoticeField(raw, "TITLE"), "B.Tech Admission Notice");
    assert.strictEqual(getNoticeField(raw, "DATE"), "2026-08-15");
    assert.strictEqual(getNoticeField(raw, "ACADEMIC SESSION"), "2026-27");
    assert.strictEqual(getNoticeField(raw, "CATEGORY"), "Admission");
    assert.strictEqual(getNoticeField(raw, "PROGRAMME"), "B.Tech CSE");
    assert.strictEqual(getNoticeField(raw, "STATUS"), "CURRENT");
    assert.strictEqual(getNoticeField(raw, "IMPORTANT DATE"), "2026-08-30");
    assert.strictEqual(getNoticeField(raw, "SOURCE"), "Official Portal");
  });

  test("should parse multi-line SUMMARY correctly without bleeding into subsequent fields", () => {
    const raw = `
TITLE: Hostel Allocation Notice
STATUS: UPCOMING
SUMMARY:
First paragraph explaining hostel details.
Second line with requirements.

Third line with allocation schedule.
SOURCE: Chief Warden Office
`;
    const expectedSummary =
      "First paragraph explaining hostel details.\nSecond line with requirements.\n\nThird line with allocation schedule.";
    assert.strictEqual(getNoticeField(raw, "SUMMARY"), expectedSummary);
    assert.strictEqual(getNoticeField(raw, "STATUS"), "UPCOMING");
    assert.strictEqual(getNoticeField(raw, "SOURCE"), "Chief Warden Office");
  });

  test("should return empty string for missing fields gracefully", () => {
    const raw = `TITLE: Test Notice\nDATE: 2026-08-10`;
    assert.strictEqual(getNoticeField(raw, "SUMMARY"), "");
    assert.strictEqual(getNoticeField(raw, "NON_EXISTENT_FIELD"), "");
  });
});

/*
==================================================
2. NOTICE SORTING TESTS
==================================================
*/
describe("2. Notice Sorting", () => {
  test("should sort notices newest date first", () => {
    const notices = [
      { title: "Old Notice", date: "2025-06-01" },
      { title: "Newest Notice", date: "2026-08-15" },
      { title: "Mid Notice", date: "2026-01-10" },
    ];

    const sorted = sortNoticesByDate(notices);
    assert.strictEqual(sorted[0].title, "Newest Notice");
    assert.strictEqual(sorted[1].title, "Mid Notice");
    assert.strictEqual(sorted[2].title, "Old Notice");
  });

  test("should handle invalid or missing dates gracefully during sorting", () => {
    const notices = [
      { title: "Notice A", date: "invalid-date" },
      { title: "Notice B", date: "2026-08-01" },
      { title: "Notice C", date: "" },
    ];

    const sorted = sortNoticesByDate(notices);
    assert.strictEqual(sorted[0].title, "Notice B");
    assert.strictEqual(sorted.length, 3);
  });
});

/*
==================================================
3. NOTICE STATUS FILTERING TESTS
==================================================
*/
describe("3. Notice Status Filtering", () => {
  const sampleNotices = [
    { title: "Notice 1", status: "CURRENT" },
    { title: "Notice 2", status: "current" },
    { title: "Notice 3", status: "UPCOMING" },
    { title: "Notice 4", status: "EXPIRED" },
  ];

  test("should filter CURRENT notices case-insensitively", () => {
    const current = getCurrentNotices(sampleNotices);
    assert.strictEqual(current.length, 2);
    assert.strictEqual(current[0].title, "Notice 1");
    assert.strictEqual(current[1].title, "Notice 2");
  });

  test("should filter UPCOMING notices case-insensitively", () => {
    const upcoming = getUpcomingNotices(sampleNotices);
    assert.strictEqual(upcoming.length, 1);
    assert.strictEqual(upcoming[0].title, "Notice 3");
  });

  test("should filter EXPIRED notices case-insensitively", () => {
    const expired = getExpiredNotices(sampleNotices);
    assert.strictEqual(expired.length, 1);
    assert.strictEqual(expired[0].title, "Notice 4");
  });
});

/*
==================================================
4. NOTICE CATEGORIES TESTS
==================================================
*/
describe("4. Notice Categories", () => {
  const sampleNotices = [
    { title: "Admissions 2026", category: "Admission" },
    { title: "Hostel Allotment", category: "Hostel" },
    { title: "PMS Scheme", category: "Scholarship" },
    { title: "Mid Term Exams", category: "Exam" },
    { title: "Campus Placements", category: "Placement" },
  ];

  test("should filter by category name correctly", () => {
    const admission = filterNoticesByCategory(sampleNotices, "admission");
    assert.strictEqual(admission.length, 1);
    assert.strictEqual(admission[0].title, "Admissions 2026");

    const scholarship = filterNoticesByCategory(sampleNotices, "scholarship");
    assert.strictEqual(scholarship.length, 1);
    assert.strictEqual(scholarship[0].title, "PMS Scheme");
  });

  test("should return all notices if category is empty or null", () => {
    const all = filterNoticesByCategory(sampleNotices, "");
    assert.strictEqual(all.length, 5);
  });
});

/*
==================================================
5. KNOWLEDGE RETRIEVAL PRECISION TESTS
==================================================
*/
describe("5. Knowledge Retrieval", () => {
  function getRelFileNames(query) {
    return findRelevantKnowledge(query).map((f) =>
      path.relative(knowledgeDir, f).replace(/\\/g, "/")
    );
  }

  test("should retrieve relevant files for B.Tech CSE eligibility", () => {
    const files = getRelFileNames("What is the B.Tech CSE eligibility criteria?");
    assert(files.includes("admissions.txt"), "admissions.txt must be selected");
  });

  test("should retrieve fees.txt for B.Tech CSE fees query", () => {
    const files = getRelFileNames("How much is the fee for B.Tech CSE?");
    assert(files.includes("fees.txt"), "fees.txt must be selected");
  });

  test("should retrieve hostel.txt for hostel questions", () => {
    const files = getRelFileNames("Are hostel facilities available for boys?");
    assert(files.includes("hostel.txt"), "hostel.txt must be selected");
  });

  test("should retrieve scholarships.txt for scholarship questions", () => {
    const files = getRelFileNames("How to apply for post matric scholarship?");
    assert(files.includes("scholarships.txt"), "scholarships.txt must be selected");
  });

  test("should return empty array for unrelated general questions", () => {
    const files = getRelFileNames("What is the speed of light in vacuum?");
    assert.strictEqual(files.length, 0);

    const codingFiles = getRelFileNames("Write a React hook in TypeScript");
    assert.strictEqual(codingFiles.length, 0);
  });

  test("should retrieve relevant files for missing information queries without hallucinating", () => {
    const files = getRelFileNames("What is the 2026-27 hostel fee?");
    assert(files.includes("fees.txt") || files.includes("hostel.txt"));
  });

  test("should prevent false positive substring matches", () => {
    // "coffee" should not trigger fees.txt
    const files = getRelFileNames("Where can I buy coffee on campus?");
    assert(!files.includes("fees.txt"), "fees.txt must not match coffee");
  });
});

/*
==================================================
6. REGRESSION PROTECTION & LIVE KNOWLEDGE TESTS
==================================================
*/
describe("6. Regression Protection", () => {
  test("should successfully read and parse real knowledge files from disk", () => {
    const knowledge = getKnowledge();
    assert(knowledge.sources.length > 0, "Knowledge base must have sources loaded");
    assert(knowledge.text.length > 100, "Knowledge base text must not be empty");
  });

  test("should successfully read and parse existing notices from disk", () => {
    const notices = getNotices();
    assert(Array.isArray(notices), "getNotices must return an array");
    assert(notices.length > 0, "At least one notice must be loaded");

    const exampleNotice = notices.find((n) => n.file.includes("2026-08-14-example"));
    assert(exampleNotice, "2026-08-14-example.txt notice must be found");
    assert.strictEqual(exampleNotice.category, "Admission");
    assert.strictEqual(exampleNotice.status, "CURRENT");
    assert(
      exampleNotice.summary.includes("test admission notice"),
      "Summary must be parsed correctly"
    );
  });
});
