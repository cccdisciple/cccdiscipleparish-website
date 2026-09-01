/* =========================================================
   Disciple Parish — Celestial Church of Christ
   2026 Bible Lessons data + rendering
   Source: Celestial Church of Christ Worldwide
           2026 Bible Lessons & Parishes
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  var MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  /* Each entry: day, weekday, service, time, designation (or null),
     lesson1, lesson2 (or null). Data drawn exactly from the CCC
     Worldwide 2026 Bible Lessons schedule, filtered to Disciple
     Parish's four regular service categories (Mercy Day, Power Day,
     Sunday Service, New Moon). No lessons invented or corrected. */
  var MONTHS = [
    { num: 1, entries: [
      { day: 1, weekday: "Thursday", service: "New Moon Service", time: "10:00 PM", lesson1: "Isaiah 43:15–21", lesson2: null },
      { day: 2, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "2 Corinth. 5:16–19", lesson2: null },
      { day: 4, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Genesis 1:1–10", lesson2: "John 1:1–12" },
      { day: 7, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Luke 8:13–19", lesson2: null },
      { day: 9, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Deut. 18:13–19", lesson2: null },
      { day: 11, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Exodus 4:1–10", lesson2: "Matthew 13:18–24" },
      { day: 14, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Genesis 17:1–8", lesson2: null },
      { day: 16, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Matthew 7:21–27", lesson2: null },
      { day: 18, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Deut. 28:1–8", lesson2: "James 1:21–24" },
      { day: 21, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "2 Samuel 22:21–31", lesson2: null },
      { day: 23, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Proverb 6:20–27", lesson2: null },
      { day: 25, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Joshua 1:1–10", lesson2: "1 Corinth. 4:1–6" },
      { day: 28, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Nehemiah 9:1–3", lesson2: null },
      { day: 30, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Genesis 4:6–12", lesson2: null }
    ]},
    { num: 2, entries: [
      { day: 1, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Nehemiah 8:1–10", lesson2: "Romans 12:1–3" },
      { day: 4, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Proverb 6:12–19", lesson2: null },
      { day: 5, weekday: "Thursday", service: "New Moon Service", time: "10:00 PM", lesson1: "Ezekiel 28:14–19", lesson2: null },
      { day: 6, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Acts 12:20–24", lesson2: null },
      { day: 8, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Daniel 4:29–33", lesson2: "1 Peter 5:5–7" },
      { day: 11, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "1 Samuel 16:4–11", lesson2: null },
      { day: 13, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "John 12:1–8", lesson2: null },
      { day: 15, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Joshua 7:19–26", lesson2: "Acts 5:1–10" },
      { day: 18, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Proverb 25:18–20", lesson2: null },
      { day: 20, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Acts 21:26–36", lesson2: null },
      { day: 22, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Numbers 16:41–50", lesson2: "Matthew 9:32–34" },
      { day: 25, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Titus 3:8–11", lesson2: null },
      { day: 27, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Judges 20:34–44", lesson2: null }
    ]},
    { num: 3, entries: [
      { day: 1, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Genesis 13:8–18", lesson2: "Romans 16:10–20" },
      { day: 4, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Luke 10:38–42", lesson2: null },
      { day: 5, weekday: "Thursday", service: "New Moon Service", time: "10:00 PM", lesson1: "Judges 4:1–9", lesson2: null },
      { day: 6, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Mark 15:37–43", lesson2: null },
      { day: 8, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Proverb 31:1–10", lesson2: "Acts 9:36–43" },
      { day: 11, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "2 Corinth. 11:21–30", lesson2: null },
      { day: 13, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Jeremiah 38:1–6", lesson2: null },
      { day: 15, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Genesis 37:16–37", lesson2: "Matthew 10:32–40" },
      { day: 18, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Isaiah 43:16–21", lesson2: null },
      { day: 20, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Acts 26:24–32", lesson2: null },
      { day: 22, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Isaiah 29:11–16", lesson2: "1 Corinth. 1:18–21" },
      { day: 25, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Matthew 16:20–24", lesson2: null },
      { day: 27, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Matthew 4:22–34", lesson2: null },
      { day: 29, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", designation: "Palm Sunday", lesson1: "Zechariah 9:9–12", lesson2: "Luke 19:28–38" }
    ]},
    { num: 4, entries: [
      { day: 1, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", designation: "Holy Wednesday", lesson1: "John 17:1–19", lesson2: null },
      { day: 2, weekday: "Thursday", service: "New Moon Service", time: "10:00 PM", designation: "Lord's Supper / New Moon", lesson1: "Matthew 21:1–11", lesson2: null },
      { day: 5, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", designation: "Easter Sunday", lesson1: "Psalms 16:5–11", lesson2: "Luke 24:1–10" },
      { day: 8, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Romans 3:21–24", lesson2: null },
      { day: 10, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Luke 24:28–35", lesson2: null },
      { day: 12, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "2 Kings 4:32–37", lesson2: "Mark 16:12–20" },
      { day: 15, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Mark 5:25–43", lesson2: null },
      { day: 17, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "1 Samuel 17:41–51", lesson2: null },
      { day: 19, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Genesis 22:1–18", lesson2: "Hebrew 11:1–12" },
      { day: 22, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "John 1:21–31", lesson2: null },
      { day: 24, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Matthew 3:11–17", lesson2: null },
      { day: 26, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Ezekiel 36:23–36", lesson2: "Acts 19:1–10" },
      { day: 29, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Matthew 12:32–37", lesson2: null }
    ]},
    { num: 5, entries: [
      { day: 1, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Isaiah 26:14–21", lesson2: null },
      { day: 3, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Daniel 7:23–28", lesson2: "Rev. 20:11–15" },
      { day: 6, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Isaiah 30:20–24", lesson2: null },
      { day: 7, weekday: "Thursday", service: "New Moon Service", time: "10:00 PM", lesson1: "Daniel 5:1–12", lesson2: null },
      { day: 8, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Luke 3:1–18", lesson2: null },
      { day: 10, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Exodus 3:1–10", lesson2: "John 16:7–16" },
      { day: 13, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "1 Kings 18:27–39", lesson2: null },
      { day: 15, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "John 4:1–4", lesson2: null },
      { day: 17, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Exodus 13:17–22", lesson2: "Matthew 3:13–17" },
      { day: 20, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "John 14:12–20", lesson2: null },
      { day: 22, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Exodus 31:1–11", lesson2: null },
      { day: 24, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", designation: "Pentecost Day", lesson1: "Exodus 19:1–20", lesson2: "Acts 2:1–21" },
      { day: 27, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Psalm 51:4–13", lesson2: null },
      { day: 29, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "John 15:18–27", lesson2: null },
      { day: 31, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", designation: "Pentecost Day", lesson1: "Joel 2:23–32", lesson2: "Luke 4:12–21" }
    ]},
    { num: 6, entries: [
      { day: 3, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Luke 2:41–52", lesson2: null },
      { day: 4, weekday: "Thursday", service: "New Moon Service", time: "10:00 PM", lesson1: "Genesis 22:1–8", lesson2: null },
      { day: 5, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "1 Samuel 3:1–10", lesson2: null },
      { day: 7, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", designation: "Juvenile Harvest", lesson1: "Proverbs 4:20–27", lesson2: "Luke 18:15–17" },
      { day: 10, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Exodus 3:7–15", lesson2: null },
      { day: 12, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Luke 11:14–28", lesson2: null },
      { day: 14, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "1 Samuel 3:8–18", lesson2: "2 Timothy 1:1–14" },
      { day: 17, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Proverb 29:18–22", lesson2: null },
      { day: 19, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Genesis 25:1–5", lesson2: null },
      { day: 21, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Deut. 5:11–16", lesson2: "Matthew 15:1–9" },
      { day: 24, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Matthew 19:1–12", lesson2: null },
      { day: 26, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "1 Samuel 16:1–16", lesson2: null },
      { day: 28, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "2 Kings 16:1–8", lesson2: "Ephesians 6:1–8" }
    ]},
    { num: 7, entries: [
      { day: 1, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Genesis 3:1–8", lesson2: null },
      { day: 2, weekday: "Thursday", service: "New Moon Service", time: "10:00 PM", lesson1: "Genesis 2:18–25", lesson2: null },
      { day: 3, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", designation: "Holy Mary Day", lesson1: "Luke 1:26–38", lesson2: null },
      { day: 5, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Genesis 3:1–16", lesson2: "Luke 1:39–56" },
      { day: 8, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Luke 7:36–50", lesson2: null },
      { day: 10, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "John 8:1–11", lesson2: null },
      { day: 12, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Joshua 2:1–21", lesson2: "John 4:19–39" },
      { day: 15, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "1 Kings 21:1–16", lesson2: null },
      { day: 17, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Matthew 27:15–26", lesson2: null },
      { day: 19, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "2 Samuel 6:19–23", lesson2: "Mark 6:14–29" },
      { day: 22, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "1 Samuel 2:1–10", lesson2: null },
      { day: 24, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Luke 1:46–56", lesson2: null },
      { day: 26, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "1 Samuel 1:1–20", lesson2: "Luke 2:25–39" },
      { day: 29, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Judges 4:1–9", lesson2: null },
      { day: 31, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Esther 2:5–17", lesson2: null }
    ]},
    { num: 8, entries: [
      { day: 2, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "1 Samuel 25:21–40", lesson2: "Acts 5:1–10" },
      { day: 5, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Nehemiah 10:34–39", lesson2: null },
      { day: 6, weekday: "Thursday", service: "New Moon Service", time: "10:00 PM", lesson1: "Genesis 14:10–20", lesson2: null },
      { day: 7, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Leviticus 27:28–34", lesson2: null },
      { day: 9, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Malachi 3:7–12", lesson2: "Hebrew 7:4–10" },
      { day: 12, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "2 Chron. 31:1–12", lesson2: null },
      { day: 14, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Deut. 12:4–12", lesson2: null },
      { day: 16, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Deut. 14:22–29", lesson2: "Galatians 6:3–10" },
      { day: 19, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "1 Kings 17:8–16", lesson2: null },
      { day: 21, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "2 Kings 4:8–17", lesson2: null },
      { day: 23, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Genesis 18:1–14", lesson2: "Hebrew 13:1–8" },
      { day: 26, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Luke 10:25–27", lesson2: null },
      { day: 28, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "1 Chron. 21:17–27", lesson2: null },
      { day: 30, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "1 John 17:1–16", lesson2: "Luke 21:1–6" }
    ]},
    { num: 9, entries: [
      { day: 2, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Matthew 16:13–18", lesson2: null },
      { day: 3, weekday: "Thursday", service: "New Moon Service", time: "10:00 PM", lesson1: "Acts 11:19–26", lesson2: null },
      { day: 4, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Acts 15:5–20", lesson2: null },
      { day: 6, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Genesis 46:1–7", lesson2: "Acts 2:29–41" },
      { day: 9, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Leviticus 26:1–13", lesson2: null },
      { day: 11, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Acts 13:1–12", lesson2: null },
      { day: 13, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Exodus 14:19–31", lesson2: "1 Corinth. 10:1–11" },
      { day: 16, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Acts 9:1–8", lesson2: null },
      { day: 18, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Ephesian 4:1–13", lesson2: null },
      { day: 20, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Numbers 11:10–26", lesson2: "1 Corinth. 12:1–14" },
      { day: 23, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Matthew 18:12–20", lesson2: null },
      { day: 25, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Matthew 16:13–21", lesson2: null },
      { day: 27, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Exodus 19:1–11", lesson2: "Rev. 1:1–11" },
      { day: 30, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Job 1:1–12", lesson2: null }
    ]},
    { num: 10, entries: [
      { day: 1, weekday: "Thursday", service: "New Moon Service", time: "10:00 PM", lesson1: "Genesis 3:1–7", lesson2: null },
      { day: 2, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Exodus 32:1–8", lesson2: null },
      { day: 4, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Ezekiel 28:12–19", lesson2: "John 8:42–49" },
      { day: 7, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Jude 1:4–11", lesson2: null },
      { day: 9, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Luke 4:1–13", lesson2: null },
      { day: 11, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Numbers 16:1–14", lesson2: "2 Thess. 2:3–10" },
      { day: 14, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Nehemiah 4:1–11", lesson2: null },
      { day: 16, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Matthew 15:10–20", lesson2: null },
      { day: 18, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Zechariah 3:1–8", lesson2: "Rev. 12:7–12" },
      { day: 21, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "1 Chron. 21:1–10", lesson2: null },
      { day: 23, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Matthew 16:21–28", lesson2: null },
      { day: 25, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Job 2:1–10", lesson2: "Acts 5:1–6" },
      { day: 28, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Mark 15:14–20", lesson2: null },
      { day: 30, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "1 Peter 5:1–10", lesson2: null }
    ]},
    { num: 11, entries: [
      { day: 1, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "2 Kings 23:4–9", lesson2: "Ephesian 4:17–32" },
      { day: 4, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Genesis 3:1–7", lesson2: null },
      { day: 5, weekday: "Thursday", service: "New Moon Service", time: "10:00 PM", lesson1: "Genesis 2:14–20", lesson2: null },
      { day: 6, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "2 Kings 4:38–41", lesson2: null },
      { day: 8, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Genesis 3:9–19", lesson2: "1 Corinth. 15:51–56" },
      { day: 11, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Proverb 20:17–22", lesson2: null },
      { day: 13, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Proverb 5:1–6", lesson2: null },
      { day: 15, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Proverb 13:11–15", lesson2: "1 Timothy 6:4–11" },
      { day: 18, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Romans 6:19–23", lesson2: null },
      { day: 20, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Job 20:1–16", lesson2: null },
      { day: 22, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "1 Samuel 25:32–38", lesson2: "Romans 1:24–32" },
      { day: 25, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Mark 5:37–43", lesson2: null },
      { day: 27, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "2 Kings 4:32–37", lesson2: null },
      { day: 29, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Psalm 51:1–9", lesson2: "1 Corinth. 15:51–58" }
    ]},
    { num: 12, entries: [
      { day: 2, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Genesis 49:8–12", lesson2: null },
      { day: 3, weekday: "Thursday", service: "New Moon Service", time: "10:00 PM", lesson1: "Exodus 3:14–21", lesson2: null },
      { day: 4, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Deut. 14:8–20", lesson2: null },
      { day: 6, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Genesis 14:14–24", lesson2: "John 8:51–59" },
      { day: 9, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Isaiah 8:5–13", lesson2: null },
      { day: 11, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Deut. 18:13–19", lesson2: null },
      { day: 13, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Micah 5:1–9", lesson2: "Matthew 2:1–8" },
      { day: 16, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Jeremiah 31:31–38", lesson2: null },
      { day: 18, weekday: "Friday", service: "Power Day Service", time: "6:00 PM", lesson1: "Isaiah 44:1–5", lesson2: null },
      { day: 20, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Isaiah 66:15–24", lesson2: "Rev. 3:1–6" },
      { day: 23, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "Luke 1:26–38", lesson2: null },
      { day: 27, weekday: "Sunday", service: "Sunday Service", time: "10:00 AM", lesson1: "Isaiah 25:1–10", lesson2: "1 John 2:7–17" },
      { day: 30, weekday: "Wednesday", service: "Mercy Day Service", time: "6:00 PM", lesson1: "1 Chron. 17:16–27", lesson2: null }
    ]}
  ];

  var YEAR = 2026;
  var monthNav = document.getElementById("lessonsMonthNav");
  var panelsContainer = document.getElementById("lessonsMonthPanels");
  if (!monthNav || !panelsContainer) return;

  var now = new Date();
  var todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  /* Determine which month to open initially */
  var initialMonth;
  if (now.getFullYear() < YEAR) {
    initialMonth = 1;
  } else if (now.getFullYear() > YEAR) {
    initialMonth = 12;
  } else {
    initialMonth = now.getMonth() + 1;
  }

  /* Find the first entry (across the whole year) that has not yet passed */
  var upcomingKey = null;
  outer:
  for (var m = 0; m < MONTHS.length; m++) {
    var monthData = MONTHS[m];
    for (var e = 0; e < monthData.entries.length; e++) {
      var entry = monthData.entries[e];
      var entryDate = new Date(YEAR, monthData.num - 1, entry.day);
      if (entryDate >= todayMidnight) {
        upcomingKey = monthData.num + "-" + entry.day;
        break outer;
      }
    }
  }

  function buildCard(monthNum, entry) {
    var card = document.createElement("article");
    card.className = "lesson-card";

    var key = monthNum + "-" + entry.day;
    if (upcomingKey && key === upcomingKey) {
      card.className += " lesson-card--upcoming";
      var badge = document.createElement("span");
      badge.className = "lesson-card-badge";
      badge.textContent = "Upcoming";
      card.appendChild(badge);
    }

    var dateEl = document.createElement("p");
    dateEl.className = "lesson-card-date";
    dateEl.textContent = entry.weekday + ", " + MONTH_NAMES[monthNum - 1] + " " + entry.day;
    card.appendChild(dateEl);

    var serviceEl = document.createElement("h3");
    serviceEl.className = "lesson-card-service";
    serviceEl.textContent = entry.service;
    card.appendChild(serviceEl);

    var timeEl = document.createElement("p");
    timeEl.className = "lesson-card-time";
    timeEl.textContent = entry.time;
    card.appendChild(timeEl);

    if (entry.designation) {
      var designationEl = document.createElement("span");
      designationEl.className = "lesson-card-designation";
      designationEl.textContent = entry.designation;
      card.appendChild(designationEl);
    }

    var readings = document.createElement("div");
    readings.className = "lesson-card-readings";

    var l1wrap = document.createElement("div");
    var l1label = document.createElement("span");
    l1label.className = "lesson-label";
    l1label.textContent = "1st Lesson";
    var l1ref = document.createElement("span");
    l1ref.className = "lesson-ref";
    l1ref.textContent = entry.lesson1;
    l1wrap.appendChild(l1label);
    l1wrap.appendChild(l1ref);
    readings.appendChild(l1wrap);

    var l2wrap = document.createElement("div");
    var l2label = document.createElement("span");
    l2label.className = "lesson-label";
    l2label.textContent = "2nd Lesson";
    var l2ref = document.createElement("span");
    l2ref.className = entry.lesson2 ? "lesson-ref" : "lesson-ref lesson-ref--empty";
    l2ref.textContent = entry.lesson2 ? entry.lesson2 : "—";
    l2wrap.appendChild(l2label);
    l2wrap.appendChild(l2ref);
    readings.appendChild(l2wrap);

    card.appendChild(readings);

    return card;
  }

  function buildPanel(monthData) {
    var panel = document.createElement("div");
    panel.className = "lessons-month-panel";
    panel.id = "lessons-panel-" + monthData.num;
    panel.setAttribute("role", "tabpanel");
    panel.hidden = monthData.num !== initialMonth;

    var heading = document.createElement("h2");
    heading.className = "lessons-month-heading";
    heading.textContent = MONTH_NAMES[monthData.num - 1] + " " + YEAR;
    panel.appendChild(heading);

    var grid = document.createElement("div");
    grid.className = "lessons-grid";
    monthData.entries.forEach(function (entry) {
      grid.appendChild(buildCard(monthData.num, entry));
    });
    panel.appendChild(grid);

    return panel;
  }

  var monthButtons = [];

  MONTHS.forEach(function (monthData) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lessons-month-btn";
    btn.textContent = MONTH_NAMES[monthData.num - 1];
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", monthData.num === initialMonth ? "true" : "false");
    btn.setAttribute("aria-controls", "lessons-panel-" + monthData.num);
    btn.dataset.month = monthData.num;
    monthNav.appendChild(btn);
    monthButtons.push(btn);

    panelsContainer.appendChild(buildPanel(monthData));
  });

  monthNav.addEventListener("click", function (event) {
    var btn = event.target.closest(".lessons-month-btn");
    if (!btn) return;

    var monthNum = btn.dataset.month;

    monthButtons.forEach(function (b) {
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });

    panelsContainer.querySelectorAll(".lessons-month-panel").forEach(function (panel) {
      panel.hidden = panel.id !== "lessons-panel-" + monthNum;
    });
  });

  /* Scroll the active month pill into view on load (helps mobile) */
  var activeBtn = monthNav.querySelector('[aria-selected="true"]');
  if (activeBtn && activeBtn.scrollIntoView) {
    activeBtn.scrollIntoView({ block: "nearest", inline: "center" });
  }

});
