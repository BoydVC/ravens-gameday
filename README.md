# Ravens Game Day HQ 🏈

**Sunday Night Football command center for Boyd** — Baltimore Ravens (3-1) at Atlanta Falcons (2-2), Week 5, Sun Oct 11 2026, 8:20 PM EDT, Mercedes-Benz Stadium, NBC / Peacock.

Live kickoff countdown, clickable 2026 season strip, matchup board (public labels only), playful Simmons-style *your* pick card, radio call letters + official links, purple particle / stadium-silhouette background. Offline single-file HTML. No invented odds, injuries, or player stats.

* **Open:** double-click `dist/ravens-gameday.html`, or `./run.sh` → http://127.0.0.1:4281/
* **Best screenshot:** `screenshots/00-best-home.png`

## Screens

1. **Kickoff** — countdown to 8:20 PM EDT, venue, TV/radio, SNF chrome
2. **Season** — week chips with verified results + remaining slate (ET)
3. **Matchup** — BAL vs ATL side-by-side + household watch checklist (localStorage)
4. **Simmons Sunday** — fan pick UI (your pick only; not Bill’s actual pick)
5. **Radio & links** — 98 Rock / WBAL / Tico + official URLs

## Run

```
./run.sh            # build + serve :4281
./run.sh --test     # smoke test + serve
./run.sh --shots    # screenshots + serve
```

## Sources

* [baltimoreravens.com/schedule](https://www.baltimoreravens.com/schedule/) and [schedule/2026](https://www.baltimoreravens.com/schedule/2026/)
* [Week 5 game day](https://www.baltimoreravens.com/game-day/2026/reg-week5/ravens-at-falcons/)
* [2026 schedule release article](https://www.baltimoreravens.com/news/baltimore-ravens-2026-schedule) (weeks 6–18 opponents)
* [atlantafalcons.com Week 5](https://www.atlantafalcons.com/game-day/2026/reg-week5/falcons-vs-ravens/) for ATL 2-2

## Gaps

* Live player stats, odds, injuries: **not loaded**
* Week 17 venue listed as Cincinnati (Paycor name not confirmed on every page)
* Week 12 stadium: schedule page says Reliant; commonly NRG — both noted in-app
* Week 18 kickoff: TBD

Port **4281** · binds 127.0.0.1 only · no CDN / analytics.


---
## Repo notes
- **Built:** Oct 11 2026, by TokenMax (Boyd's Grok Bot) on the Grok Bot box.
- **Run:** `./run.sh` (then open the localhost URL it prints).
- Imported from `/workspace/tokenmax/ravens-gameday` on Oct 23, 2026. node_modules, virtualenvs, logs and files over 20 MB were left out.
