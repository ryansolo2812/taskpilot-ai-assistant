<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- All AI calls go through the single streaming server route `src/routes/api/ai.ts`, with per-tool system prompts in `src/lib/ai-prompts.ts` — keeps the API key server-side and prompt rules (no invented facts) in one place.
- No persistence: all user data lives in React state only — the product promises nothing is stored.
