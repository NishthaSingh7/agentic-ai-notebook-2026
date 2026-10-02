import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "computer-use",
  instructor:
    "I teach this from zero. We start with a screen that has no clean API: buttons, boxes, and pop-ups. Then we learn how a helper can click without getting lost or walking onto a dangerous page.",
  promise:
    "You will go from 'the model can click' to keeping a tiny memory of where the helper is, stopping circles, allowing only known websites, keeping passwords out of the model's notes, and saying when you should demand an API instead.",

  story: {
    title: "The intern bot that booked the same demo twelve times",
    body: [
      "A sales team asked for a helper that could schedule product demos from a public calendar page. There was no scheduling API. There was a website with a date picker, a form, and a cookie banner that appeared on the first visit. The first version treated this as 'the model can click'. It took a screenshot, guessed a button, clicked, and looked again.",
      "On the first real Monday the cookie banner won. The helper clicked Accept, the page reloaded, the banner appeared again in a slightly different place, and the helper clicked Accept again. After four minutes it had not booked a demo. It had a folder of similar screenshots and a large model bill.",
      "They 'fixed' it by telling the model to be more careful. The next failure was different. The helper followed a 'partner login' link, landed on a page the company did not own, and typed the demo guest's email into a form that was not the calendar. Nobody had told the helper which websites were allowed. A screen is not a typed API. Any button is a possible door.",
      "The rebuild was small and boring. The helper stored the current URL, the last action, and a set of pages it had already seen. The same URL twice was a loop, not progress. Only two hosts were allowed. Credentials came from a vault keyed to those hosts, never from the model's notes. The cookie banner was a named state with one scripted click. Demos started booking once each.",
    ],
    moral:
      "A computer-use helper is a navigation machine with a short memory and a list of allowed doors. 'The model can click' is not a design.",
  },

  stages: [
    {
      id: "no-api-only-screen",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let's start from zero. Many products give you a clean function: get_order(id) returns a record. That is an API. You pass data in. You get data out. Types help you. Errors have names.",
        "A website is not that. A website is pixels, boxes, and buttons that move. A cookie banner can cover the thing you need. A login wall can appear. The same page can look different tomorrow. Computer use means letting a helper operate that messy world: look at the screen or the page structure, click, type, look again.",
        "Why would anyone do this? Because some work has no API yet. A calendar page. An old admin console. A government form. The alternative is a human clicking.",
        "What happens if you treat it like a magic clicker? The helper gets lost. It clicks the same banner. It follows a link you did not intend. It types into the wrong box. Those are not rare edge cases. They are the default.",
        "You still have a loop underneath, the same idea as any agent: look, decide, act, look. The 'tools' are just more dangerous: click, type, screenshot, open_url. Dangerous because they can leave your site and they can submit a form.",
        "At this point you should understand: computer use is operating a UI when no API exists. The world is messy on purpose. Your job is to give the helper a map, not only eyes.",
      ],
      diagrams: [
        {
          title: "Look, act, look again",
          caption:
            "The loop is ordinary. The tool is a click, which is why the map matters.",
          chart: chart(
            `flowchart TD
    Goal([Goal]) --> Look[Look at the page]
    Look --> Decide{Need a click or type}
    Decide -->|yes| Act[Click or type]
    Act --> Look
    Decide -->|done| Done([Finished])`,
            `class Goal,Done hub
    class Look,Act grp1
    class Decide grp2`
          ),
        },
      ],
    },
    {
      id: "what-computer-use-is",
      level: "beginner",
      title: "What the helper must remember besides the picture",
      body: [
        "A screenshot is a picture of now. It is not memory. If that is all you keep, the helper cannot know it already accepted cookies, or that it already opened this URL.",
        "So we keep a small navigation state. State here just means a few fields your program stores: the goal, the current URL, the last action, and a list of URLs already visited.",
        "Why these fields? The goal stops the helper from chasing a new task it saw on a sidebar. The current URL is 'where am I'. The last action is 'what I just tried'. The visited list is how you notice a circle.",
        "The simplest example is you in a mall. You remember the shop you want, the corridor you are in, the last turn you took, and the food court you already walked through. Without those, you circle the fountain.",
        "They look similar: a screenshot and a URL both 'describe the page'. The important difference is that a URL is a stable name you can compare. Pixels change when a banner slides. The URL may stay the same — which is your loop signal.",
        "At this point you should be able to say: computer use needs navigation memory, not only eyes.",
      ],
      diagrams: [
        {
          title: "Four fields besides the picture",
          caption: "Pixels change. These names let your code compare.",
          chart: chart(
            `flowchart TD
    Pic[Screenshot] --> Now[Now]
    Goal([Goal]) --> Mem[Navigation state]
    Url[Current URL] --> Mem
    Last[Last action] --> Mem
    Seen[Visited set] --> Mem`,
            `class Goal,Mem hub
    class Pic,Now,Url,Last,Seen grp1`
          ),
        },
      ],
    },
    {
      id: "smallest-nav-state",
      level: "beginner",
      title: "How the simplest version works",
      body: [
        "What are we trying to do? Make 'I have been here already' a fact your code can test, so the model does not have to notice.",
        "Here is the smallest version. Before open_url or a click that navigates, look at the destination. If you have already seen it in this run, stop. That is a loop, not progress.",
        "Let's understand what just happened. The visited set is a guardrail for navigation. The model can still propose the same click. Your code can still say no.",
        "Add a step budget. A calendar booking that needs forty clicks is usually a confused helper, not a hard site. Ten to twenty actions is plenty for a form. When the budget trips, halt and ask a human.",
        "Name the boring pop-ups. Cookie banners and login walls are known states. A tiny scripted click beats asking a large model to rediscover Accept every run.",
        "At this point you should understand: loop detection is a set of URLs plus a step cap. It is not a prompt that says 'do not repeat yourself'.",
      ],
      codes: [
        {
          title: "Remember where you have been",
          language: "python",
          code: `def open_url(url: str, visited: set[str]) -> dict:
    if url in visited:
        return {"error": "loop", "url": url}
    visited.add(url)
    return {"ok": True, "url": url, "visited": len(visited)}`,
        },
      ],
    },
    {
      id: "loops-are-default",
      level: "intermediate",
      title: "Circles are the default failure",
      body: [
        "Once you have a visited set, you will see how often the helper circles. Cookie banners, 'skip for now', a dropdown that closes itself, a date picker that resets. Humans sigh and adjust. A helper without memory repeats.",
        "Detect more than exact URLs. Some sites add tracking junk to the query string. Compare the host plus the path, or you will never match. Some circles stay on one URL and toggle a widget. Then you need 'same URL plus same last two actions' as the signal.",
        "When a loop trips, do not nudge the model with 'please try something else' forever. That burns two more steps proving the nudge failed. Halt, screenshot the last page for a human, and record the loop on the trace.",
        "This is the same stop-condition idea as any agent loop. Computer use just hits it sooner, because UIs are sticky.",
        "Pause and check. If the helper has clicked Accept four times, is it making progress? No. The page state did not change in a way you care about. Count that as no-progress even if the URL changed by a tracking parameter.",
        "At this point you should understand: assume circles, then add memory and a halt. Do not assume a clever model will get bored.",
      ],
      codes: [
        {
          title: "Same path twice is not progress",
          language: "python",
          code: `def no_progress(path: str, last_two: list[str]) -> bool:
    return last_two.count(path) >= 2`,
        },
      ],
      diagrams: [
        {
          title: "Visited pages are how you stop the circle",
          caption:
            "The allow-list sits next to the click. Memory sits next to the URL.",
          chart: chart(
            `flowchart TD
    Goal([Goal]) --> Agent[Helper]
    Agent --> View[Page state]
    View --> Act[Click or type]
    Act --> View
    View --> Seen{Seen this URL}
    Seen -->|yes| Stop([Break loop])
    Seen -->|no| Agent
    Allow[Allowed hosts] -.-> Act`,
            `class Goal,Stop hub
    class Agent,View,Act grp1
    class Seen,Allow grp2`
          ),
        },
      ],
    },
    {
      id: "allowlists-not-open-web",
      level: "intermediate",
      title: "Only allowed websites, and why that is safety not taste",
      body: [
        "If the helper can open any URL, it can leave your product. It can also hit addresses that are not websites in the everyday sense: internal cloud metadata, admin ports, your own localhost tools. That class of bug is called SSRF, which means the helper is tricked into fetching something on your network that a stranger should not be able to fetch.",
        "You do not need the full attack catalogue. You need the rule: the helper may only open hosts you listed. docs.internal and calendar.internal, not 'the web'.",
        "What are we trying to do? Parse the URL, check the host, deny everything else, and log the deny.",
        "This is the same gateway idea as the guardrails sitting. The click is a tool. The host is a dangerous argument. You bind it to an allow-list, not to a sentence the model copied from a page.",
        "Pages can contain links that look helpful and point elsewhere. Treat every href as untrusted data. The helper may propose it. Your code may still refuse it.",
        "At this point you should understand: an open-web clicker on a production network is not research. It is an unlisted HTTP client with a confused driver.",
      ],
      codes: [
        {
          title: "Only these hosts",
          language: "python",
          code: `from urllib.parse import urlparse

ALLOWED = {"calendar.internal", "docs.internal"}

def allowed(url: str) -> bool:
    host = urlparse(url).hostname or ""
    return host in ALLOWED`,
        },
      ],
    },
    {
      id: "structure-and-secrets",
      level: "intermediate",
      title: "Prefer page structure over pixels, and never type a guessed password",
      body: [
        "A screenshot is expensive and brittle. Lighting, ads, and a two-pixel shift all change the picture. Many pages also expose an accessibility tree: a list of roles and names, such as button 'Accept cookies' or textbox 'Email'. That list is a contract. Prefer it when you can.",
        "They look similar because both describe the page. The important difference is stability. A name and a role survive a theme change. A pixel box may not.",
        "Secrets are a separate rule. The model must not invent or relay passwords. Credentials come from a vault your code holds, keyed to the allowed host. The helper can say 'I need to log in'. Your code types the secret into the right box and does not put the secret in the scratch notes.",
        "If you paste a password into the prompt so the model can 'type it', you have stored a secret in logs, traces, and the vendor's prompt store. That is the incident.",
        "In a real app, login is often a scripted step, not a model step. Cookie banners too. Save the model for the parts that actually vary: which date, which guest name already sitting on the ticket.",
        "At this point you should understand: structure beats pixels when you can get it, and secrets never come from the model.",
      ],
      diagrams: [
        {
          title: "Vault types the secret. The model never sees it.",
          caption:
            "The helper can request login. The vault and your code perform it.",
          chart: chart(
            `flowchart LR
    Helper[Helper] --> Need{Need login}
    Need -->|yes| Vault[Vault for this host]
    Vault --> Type[Code types the secret]
    Type --> Page[Page]
    Need -->|no| Page
    Helper -.->|never sees secret| Vault`,
            `class Helper,Page hub
    class Need grp2
    class Vault,Type grp1`
          ),
        },
      ],
    },
    {
      id: "smaller-computer",
      level: "advanced",
      title: "Give the helper a smaller, dumber computer",
      body: [
        "Remember the simple clicker. The advanced version assumes the helper will click the worst remaining thing. So you shrink the computer.",
        "Use a dedicated browser profile. No saved payroll tabs. No admin cookies. No password manager full of production. If the helper wanders, it should wander in an empty apartment, not in your house.",
        "The same idea applies to a terminal-use helper — one that types shell commands instead of clicks. Give it a working folder, no SSH keys, a command allow-list. 'Full shell' is not a feature. It is an open door.",
        "Network allow-lists belong at the browser and at the machine. Even if your URL check has a bug, the profile should be unable to reach the cloud metadata address.",
        "Trade-off: a tiny computer cannot do some demos. That is the point. If the job needs payroll, it needs a human or a real API with a policy, not a clicker.",
        "At this point you should understand: blast radius is a property of the machine you attached, not of the model's manners.",
      ],
      codes: [
        {
          title: "A toy command allow-list for a terminal helper",
          language: "python",
          code: `ALLOWED = {"ls", "cat", "python"}

def run(cmd: str) -> dict:
    name = cmd.strip().split(" ")[0]
    if name not in ALLOWED:
        return {"error": "denied_command", "name": name}
    return {"ok": True, "name": name}`,
        },
      ],
    },
    {
      id: "eval-the-clicker",
      level: "advanced",
      title: "A demo GIF is not coverage",
      body: [
        "Computer use fails in ways a happy-path recording will not show. Banner, login wall, loop, denied host, timeout, wrong textbox. Put those in a small suite you can rerun.",
        "Score the path, not only the booked demo. Did it leave the allow-list? Did it visit the same path four times? Did a secret appear in the scratch notes? Those are automatic checks.",
        "Public suites exist for web navigation and terminal tasks. Use them as extra signal. They do not replace your own calendar page fixtures.",
        "Operate it like any agent. Trace every action. Budget steps and seconds. When the site changes, the suite fails and you update a selector — you do not 'prompt harder' for a week.",
        "When not to use computer use. If an API exists, use the API. A typed tool with a gateway is cheaper, faster, and easier to audit than a clicker. Computer use is for the leftover world.",
        "At this point you can teach the sitting: messy UI, navigation state, loops, allow-lists, vaulted secrets, a smaller machine, and tests that are not a GIF.",
      ],
      diagrams: [
        {
          title: "The leftover world, with doors you installed",
          caption: "If a real API exists, do not start here.",
          chart: chart(
            `flowchart TD
    Job([Job]) --> Api{API exists}
    Api -->|yes| Tool[Typed tool]
    Api -->|no| Cu[Computer use]
    Cu --> State[Nav state]
    Cu --> Allow[Host allow-list]
    Cu --> Vault[Vault]
    Tool --> Done([Done])
    Cu --> Done`,
            `class Job,Done hub
    class Api grp2
    class Cu,State,Allow,Vault,Tool grp1`
          ),
        },
      ],
    },
  ],

  workedExample: {
    title: "Book one demo without circling the cookie banner",
    setup:
      "A public calendar page. Cookie banner on first load. Tools: screenshot, click, type, open_url. A guest email sits on the sales ticket.",
    walkthrough: [
      "Step 1 — Understand the problem. There is no scheduling API. The page can trap a clicker in a banner loop or send it off-site.",
      "Step 2 — Identify the relevant concept. Navigation state, visited set, host allow-list, vaulted login if needed.",
      "Step 3 — Build the simplest solution. Store URL and visited. Script the cookie banner once. Allow only calendar.internal.",
      "Step 4 — Improve it. Prefer the accessibility name 'Book demo' over clicking pixels. Fill the guest email from the ticket, not from page text.",
      "Step 5 — Handle a failure or edge case. If the same path appears twice, halt and attach the last screenshot for a human.",
      "Step 6 — Explain the production version. Dedicated browser profile, step budget of 15, traces on every action, a test that the banner path does not repeat.",
    ],
    result:
      "One demo is booked. The helper cannot leave calendar.internal. The banner is a scripted state, not a weekly prompt debate.",
  },

  practice: {
    title: "A helper that updates a listing on an old admin site",
    task:
      "An old admin website has no API. The agent must find a listing and change its price. Problem: design the navigation state, the host allow-list, how you would detect a loop, and where the price comes from. Then say what machine you would give the helper, and one test that is not a happy-path recording. Think about: the price already living on a ticket, and what a convinced clicker can still reach.",
    hint:
      "The admin site may link to a help centre on another host. Expected reasoning: state fields, admin.internal only, path-twice halt, price bound to the ticket, tiny browser profile, off-host deny fixture.",
    solution:
      "State: goal, current URL, last action, visited paths, step count. Allow-list: admin.internal only. Loop: same path twice, or same URL plus the same last two actions. Price is bound to the ticket field; the model cannot type a price it found in a blog comment. Machine: dedicated browser profile, no saved admin cookies beyond that host, no vault entry except the admin login. Test: a fixture where the listing page links off-host — the helper must deny. A second fixture where the cookie banner reappears — visited or no-progress must halt. Why this works: a convinced clicker still cannot leave the host or invent a price. Common wrong approach: 'the model can see the price on the page' plus open-web browsing.",
  },

  takeaways: [
    "Computer use is operating a UI when no API exists. The world is messy: banners, logins, moving buttons.",
    "Keep navigation state: goal, current URL, last action, visited pages. A screenshot is not memory.",
    "Circles are the default failure. A visited set and a step budget are the first stop conditions.",
    "Allow only known hosts. An open-web clicker can leave your product or fetch internal addresses.",
    "Prefer page roles and names over pixels when you can. Secrets come from a vault, never from the model's notes.",
    "Give the helper a smaller computer. If a real API exists, use the API.",
  ],

  mistakes: [
    "Mistake: treat 'the model can click' as the design. Why people make it: the demo looks smooth. What actually happens: banners and sidebars drive the run. Better approach: navigation state and scripted pop-ups.",
    "Mistake: no visited set. Why people make it: the model 'should notice'. What actually happens: Accept, reload, Accept. Better approach: compare URL or path in code.",
    "Mistake: open-web browsing from a production network. Why people make it: research sounds open-ended. What actually happens: SSRF and off-site forms. Better approach: host allow-list.",
    "Mistake: pixels only, when the page exposes names and roles. Why people make it: screenshots are easy to show. What actually happens: brittle clicks and a bigger bill. Better approach: accessibility tree first.",
    "Mistake: put passwords in the prompt. Why people make it: then the model can type them. What actually happens: secrets land in logs. Better approach: vault plus your code.",
    "Mistake: ship a full shell or a browser with admin cookies. Why people make it: setup is faster. What actually happens: the worst remaining click is catastrophic. Better approach: a tiny profile and a command allow-list.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "What state does a browser helper need besides the screenshot?",
      answer:
        "What they are testing: navigation memory. Good answer: goal, current URL, last action, visited URLs, and an allow-list. Why that is good: you can detect loops and deny hosts without asking the model to notice. Follow-up: how do you detect a loop on a site that changes query strings?",
    },
    {
      difficulty: "medium",
      question:
        "How do you stop a computer-use agent from becoming an SSRF client?",
      answer:
        "What they are testing: allow-lists as safety. Good answer: parse every URL, allow only named hosts, treat hrefs as untrusted, and also restrict the browser profile's network. Why that is good: you did not rely on the model to avoid internal addresses. Follow-up: where do credentials come from?",
    },
    {
      difficulty: "hard",
      question: "When would you refuse computer use and demand an API instead?",
      answer:
        "What they are testing: judgment. Good answer: when the action is money, payroll, or admin, or when a typed API already exists; computer use is for leftover UIs with a tiny machine, step budgets, and fixtures for banners and off-host links. Why that is good: you treated clicking as a last resort. Follow-up: what belongs in the first eval suite?",
    },
  ],

  glossary: [
    {
      term: "Computer use",
      meaning:
        "Letting a helper operate a UI — look, click, type — when no clean API exists. Why it matters: the world is buttons, not typed functions.",
    },
    {
      term: "Navigation state",
      meaning:
        "The small memory of this run: goal, URL, last action, visited pages. Why it matters: a screenshot cannot tell you that you already circled.",
    },
    {
      term: "Visited set",
      meaning:
        "The list of pages already opened in this run. Why it matters: the same URL twice is a loop.",
    },
    {
      term: "Allow-list",
      meaning:
        "The hosts the helper may open. Why it matters: any other link is a door you did not intend.",
    },
    {
      term: "SSRF",
      meaning:
        "Tricking a helper into fetching an internal address. Why it matters: an open-web clicker is an HTTP client on your network.",
    },
    {
      term: "Accessibility tree",
      meaning:
        "The page described as roles and names, not pixels. Why it matters: those names are a stabler contract than a screenshot.",
    },
  ],
};
