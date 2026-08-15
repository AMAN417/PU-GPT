const { test, describe } = require("node:test");
const assert = require("node:assert");
const path = require("path");

const {
  getNoticeField,
  getNotices,
  sortNoticesByDate,
  getCurrentNotices,
  getExpiredNotices,
  getUpcomingNotices,
  filterNoticesByCategory,
  findRelevantKnowledge,
  getKnowledge,
} = require("./index");

const knowledgeDir = path.join(__dirname, "knowledge");

/* 1. Notice Parsing */
describe("1. Notice Parsing", () => {
  test("should parse single-line fields correctly", () => {
    const raw = `TITLE: Test Notice\nDATE: 2026-08-15\nSTATUS: CURRENT\nCATEGORY: Admission`;
    assert.strictEqual(getNoticeField(raw, "TITLE"), "Test Notice");
    assert.strictEqual(getNoticeField(raw, "DATE"), "2026-08-15");
    assert.strictEqual(getNoticeField(raw, "STATUS"), "CURRENT");
    assert.strictEqual(getNoticeField(raw, "CATEGORY"), "Admission");
  });

  test("should parse multi-line SUMMARY correctly", () => {
    const raw = `TITLE: Multiline\nSUMMARY:\nLine 1\nLine 2\nSOURCE: Portal`;
    assert.strictEqual(getNoticeField(raw, "SUMMARY"), "Line 1\nLine 2");
  });

  test("should return empty string for missing fields", () => {
    assert.strictEqual(getNoticeField("TITLE: Only", "SUMMARY"), "");
  });
});

/* 2. Notice Sorting */
describe("2. Notice Sorting", () => {
  test("should sort newest first", () => {
    const list = [{ date: "2025-01-01" }, { date: "2026-08-15" }];
    const sorted = sortNoticesByDate(list);
    assert.strictEqual(sorted[0].date, "2026-08-15");
  });
});

/* 3. Notice Status Filtering */
describe("3. Notice Status Filtering", () => {
  const sample = [
    { title: "A", status: "CURRENT" },
    { title: "B", status: "UPCOMING" },
    { title: "C", status: "EXPIRED" },
  ];

  test("should filter by status", () => {
    assert.strictEqual(getCurrentNotices(sample).length, 1);
    assert.strictEqual(getUpcomingNotices(sample).length, 1);
    assert.strictEqual(getExpiredNotices(sample).length, 1);
  });
});

/* 4. Notice Categories */
describe("4. Notice Categories", () => {
  const sample = [
    { title: "Admission Notice", category: "Admission" },
    { title: "Hostel Notice", category: "Hostel" },
  ];

  test("should filter category", () => {
    assert.strictEqual(filterNoticesByCategory(sample, "admission").length, 1);
    assert.strictEqual(filterNoticesByCategory(sample, "").length, 2);
  });
});

/* 5. Knowledge Retrieval */
describe("5. Knowledge Retrieval", () => {
  test("should find admissions.txt for eligibility", () => {
    const res = findRelevantKnowledge("B.Tech CSE eligibility").map((f) =>
      path.relative(knowledgeDir, f).replace(/\\/g, "/")
    );
    assert(res.includes("admissions.txt"));
  });

  test("should return empty array for unrelated question", () => {
    assert.strictEqual(findRelevantKnowledge("What is quantum physics?").length, 0);
  });
});

/* 6. Regression Protection */
describe("6. Regression Protection", () => {
  test("should read knowledge files from disk", () => {
    const k = getKnowledge();
    assert(k.sources.length > 0);
  });

  test("should read notices from disk", () => {
    const n = getNotices();
    assert(Array.isArray(n));
  });
});
