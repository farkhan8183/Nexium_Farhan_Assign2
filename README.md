# AI Blog Summarizer – Assignment 2

This project was built as part of **Assignment 2** for our Web Development course. The goal was to implement a blog summarization app using only **static logic**, with the following features:



- [x] Input a **blog URL**  
- [x] **Scrape** the full text content from that blog  
- [x] Simulate an **AI-generated summary** using static logic  
- [x] **Translate** the summary into **Urdu** using a JS dictionary  
- [x] Store the **summary in Supabase**  
- [x] Store the **full blog content in MongoDB**  
- [x] Use **ShadCN UI components**  
- [x] Deploy the app using **Vercel**  
- [x] All project code inside `assignment-2/` folder

---

##  Purpose & Challenge

The core challenge was:  
**How do we allow summarizing any blog URL and still translate it without using APIs?**

At first, I thought I could use a translation API like Google Translate or DeepL to handle Urdu translation of any dynamic summary. But later, I realized this violates the requirement of using **static logic** (no API calls).

That’s when I understood the expected approach was to:
- Use a **static JavaScript dictionary** for English → Urdu mapping
- Avoid using **any AI/ML or API** for translation
- Simulate “AI summary” with basic static logic (e.g., slicing paragraphs)

---

## Final Approach

To stay within the scope of **static logic**, I:

- Added a list of **3 predefined blog URLs** (`BLOG_DATA`)  
- Created **hardcoded translations** using a static dictionary  
- Let users **select from those blogs only** via UI  
- Simulated summary and Urdu translation for those only  
- Still made the UI feel dynamic, even without APIs

✅ This satisfies both:
- No API used for translation  
- Full summarization + translation experience from the user’s side

---

##  Tech Stack

- **Next.js 14 App Router**
- **Tailwind CSS** + **ShadCN UI**
- **Supabase** for saving summaries
- **MongoDB (via API route)** for saving full blog content
- **Deployed on Vercel**

---


##  Features Overview

-  Enter blog URL or select one from above  
-  Scrapes the blog content  
-  Simulates summary (static slicing logic)  
-  Translates summary to Urdu via JS dictionary  
-  Saves:
  - Summary → **Supabase**
  - Full Content → **MongoDB**
-  Mobile responsive with clear UI  
- Smooth scroll to summary after generation  
- Recently saved summaries shown at the bottom  

#### Note:

Due to static translation logic, the app currently supports **only selected blog URLs** defined in `BLOG_DATA.js`. Summarizing and translating arbitrary URLs would require APIs, which were probably
not allowed for this assignment.


---

##  Final Words

This project challenged me to think of **creative, static alternatives** instead of relying on dynamic APIs. I learned how to simulate AI behavior using JavaScript logic, and how to store structured data using Supabase + MongoDB in a Next.js environment.

Thanks for checking it out!

##  Deployment
Live at: https://nexium-farhan-assign2-ywpg.vercel.app/
