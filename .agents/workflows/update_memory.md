---
description: Update the project memory file after a session
---

// turbo-all

## Update Project Memory After Session

After completing a significant set of changes, run through these steps:

1. Reflect on what was built/changed in this session
2. Open `.agents/PROJECT_MEMORY.md`
3. Add a new dated entry to the **Session Log** section:
   ```
   ### YYYY-MM-DD
   - ✅ [Feature/fix implemented]
   - ✅ [Another thing done]
   ```
4. Update the **Next Steps / Backlog** section — check off completed items, add new ones
5. If any new ENV variables were added, update the **ENV Variables** table
6. If the product catalog changed, update the **Product Catalog** table
7. If new files/components were added, update the **Project Structure** section
8. Commit the memory update:
   ```
   git add .agents/PROJECT_MEMORY.md GEMINI.md
   git commit -m "docs: update project memory for [date] session"
   git push origin main
   ```
