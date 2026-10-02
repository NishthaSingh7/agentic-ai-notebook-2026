import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "multimodal-vla",
  instructor:
    "I am a senior engineer sitting next to you. We will start from zero. You do not need to know what 'multimodal' means yet. I will build the idea from a photo and a question, then we will get to agents that click, and why a screenshot is a last resort.",
  promise:
    "By the end you will know what multimodal means, how a simple image-plus-question call works, what a vision-language-action agent is, why pixels are a weak observation, how to keep the action list small, and how to check that a click hit the thing you named.",
  story: {
    title: "The warehouse picker that paid the invoice on the thumbnail",
    body: [
      "A warehouse team had a weekly chore. A vendor website had no export button they could trust. A person clicked through the same three screens and pressed Confirm on an invoice. Someone pointed a 'it can see the screen' AI at the site. The AI took a picture of the page, said 'I see Confirm', and clicked a box. The first three Fridays it worked. A short video went to leadership. Someone used the word autonomous.",
      "The fourth Friday the website added a promotional tile above the invoice. The tile had a gold button that also said Confirm — confirm an upsell, not the invoice. The AI was looking at one big picture of the whole page. It clicked the largest, brightest Confirm. It bought extra pallets the warehouse did not want. There was no short list of allowed clicks. There was no check that the button lived inside the invoice panel. The observation was a picture. A picture does not know what a panel is.",
      "The same run had a quieter failure. Each turn sent a new huge image. Pictures are expensive for these models. The loop also kept old pictures 'for memory', so by step six the model was staring at a stack of photos and had lost the purchase-order number from step one. It guessed a number from a tiny thumbnail. The number was close. Close is how you confirm the wrong order.",
      "They asked a simpler question first: does this site have a spreadsheet export? It did. The weekly job became a script. For the one screen that still had no export, they stopped sending raw pictures as the main view. They sent a structured list of on-screen controls, and stored the picture on the side. The AI could only click named controls inside a named panel. A stale picture could not be clicked. The gold tile is still there. The agent cannot treat it as a legal target.",
    ],
    moral:
      "A screenshot is a tool result, not the truth. Prefer a normal API or a structured list of controls. If you must use pixels, give the model a small list of allowed actions and a freshness limit.",
  },
  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "The problem: text-only AI is blind",
      body: [
        "A normal chat model reads text and writes text. That is enough for email drafts and many questions. It is not enough when the useful fact is on a screen, in a photo, or in a PDF page that you do not want to type out by hand.",
        "Think of a friend on the phone. You can describe a website: 'there is a blue button on the right'. They might guess. If they could see the page, they would stop guessing. That is the first reason people add pictures to AI: so the model can look, not only listen.",
        "The everyday word is 'it can see'. The technical word we will use in a moment is multimodal: more than one kind of input. Text is one mode. An image is another. Audio and video are others. The model still writes text, or later it picks an action. The new part is what it is allowed to look at.",
        "Without this, teams type tables into prompts, or they give up on websites that have no API. An API is a door a program can call. Many old vendor portals have no such door. Humans click. That is the pain that leads people to screen-seeing agents, and also the pain that leads them to click the wrong Confirm.",
        "At this point you should understand the problem: we sometimes need an AI that can take in a picture, not only a sentence.",
      ],
      diagrams: [
        {
          title: "Text-only versus looking",
          caption:
            "The same question. One path has only words. The other path also has a picture. The picture is extra input, not magic.",
          chart: chart(
            `flowchart LR
    Q([User question]) --> TextOnly[Text-only model]
    TextOnly --> Guess([Guess from words])
    Q --> Multi[Model that also accepts an image]
    Pic[Picture] --> Multi
    Multi --> Look([Answer from words plus pixels])`,
            `class Q,Guess,Look hub
    class TextOnly,Multi grp1
    class Pic grp2`
          ),
        },
      ],
    },
    {
      id: "what-multimodal-means",
      level: "beginner",
      title: "What multimodal means, in plain language",
      body: [
        "Multimodal means the model can take more than one kind of input in the same request. The simplest useful pair is text plus image: 'what does this screenshot say next to Total?' plus the screenshot.",
        "The picture is not stored as 'meaning' the way you remember a face. The service turns the image into a large set of numbers the model can attend to. People call those vision tokens. A token, from the last sitting you may have done on models, is a billed chunk of input. A picture can cost as much as many pages of text. That is why a stack of screenshots becomes a bill and a confused prompt.",
        "What are we trying to do? Send one image and one question, and print the text reply.",
        "Here is the smallest version.",
        "Let's understand what just happened. We read bytes from a file, we attached them as an image part next to a question, and we printed the model's text. No clicking yet. No agent yet. Just look, then say.",
        "Pause and check. If the image is blurry, or the button is off-screen, the model cannot 'see' it any more than you can. If you send last week's screenshot, it will describe last week. Freshness is already a requirement, even for a toy caption.",
      ],
      diagrams: [
        {
          title: "Look, then say — not yet act",
          caption:
            "An image plus a question becomes text. No mouse. No Pay button. This is multimodal, not VLA.",
          chart: chart(
            `flowchart LR
    Q([Question]) --> Call[One model call]
    Img[Image bytes] --> Call
    Call --> Cap([Text answer])`,
            `class Q,Cap hub
    class Img,Call grp1`
          ),
        },
      ],
      codes: [
        {
          title: "look.py — one image, one question, text out",
          language: "python",
          code: `from pathlib import Path
from openai import OpenAI

client = OpenAI()
image_bytes = Path("invoice.png").read_bytes()

reply = client.chat.completions.create(
    model="gpt-4.1-mini",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What is the total on this invoice?"},
                {"type": "image", "image": image_bytes},
            ],
        }
    ],
)

print(reply.choices[0].message.content)`,
        },
      ],
    },
    {
      id: "from-see-to-act",
      level: "beginner",
      title: "From seeing to acting: what VLA means",
      body: [
        "Seeing is not acting. A caption that says 'I see Confirm' does not press Confirm. The jump is when the model is allowed to choose a next action in the world: click, type, move a robot arm. That family is often called vision-language-action, or VLA: look, say (or think in text), then act.",
        "An observation is what the agent is allowed to look at right now. It might be a picture. It might be a structured list of controls. It might be a normal API response. The screenshot is one kind of observation, and usually the worst one.",
        "An action space is the short list of verbs the agent is allowed to use. 'Click the control named Confirm inside the invoice panel' is a closed space. 'Move the mouse to any x,y' is an open space. Open spaces invent buttons that are ads.",
        "Think of a TV remote. A good remote has a few named buttons. A bad remote is a laser pointer you can aim at any pixel on the wall. VLA products often ship the laser pointer because the demo looks clever. Production wants the remote.",
        "At this point you should understand the concept: multimodal is extra input; VLA is extra input plus a limited set of actions. Next we will implement the smallest action picker.",
      ],
      diagrams: [
        {
          title: "Look, then pick from a short list",
          caption:
            "The model does not get a free mouse. It picks a named verb. Your code is what actually clicks.",
          chart: chart(
            `flowchart TD
    Obs[Observation] --> Modelq[Model]
    Modelq --> Pick{Allowed action}
    Pick -->|click named control| Act[Your code clicks]
    Pick -->|type into named field| Act
    Pick -->|stop| Done([Done])
    Act --> Obs`,
            `class Obs,Done hub
    class Modelq,Act grp1
    class Pick grp2`
          ),
        },
      ],
    },
    {
      id: "smallest-action-space",
      level: "intermediate",
      title: "How the simplest VLA loop works",
      body: [
        "What are we trying to do? Give the model a tiny menu of actions and refuse anything else. The model still 'sees' a short description of the page. Your code is the only thing that touches the mouse or the website.",
        "Here is the smallest version. Notice how small the menu is. There is no raw x,y. There is no 'click whatever looks like Confirm'.",
        "Let's understand what just happened. We listed legal verbs. We asked the model for one JSON object. If the name is not in the list, we do not click. That is the whole safety of the toy. Later we will add 'which panel' and 'how fresh is this view'.",
        "Connect this back to the story. The gold upsell button was also named Confirm. A menu that only says click(name) is still too wide. We will need a panel, or a role, or an id from a structured tree.",
        "When not to build this loop at all: if the site has a CSV export or an API. A script that downloads the invoice will beat a clever clicker every Friday.",
      ],
      codes: [
        {
          title: "action_space.py — named verbs only",
          language: "python",
          code: `ALLOWED = {
    "click_invoice_confirm",
    "click_back",
    "type_po_number",
    "stop",
}


def parse_action(raw: dict) -> str | None:
    name = raw.get("action")
    if name not in ALLOWED:
        return None
    return name


print(parse_action({"action": "click_invoice_confirm"}))
print(parse_action({"action": "click_any_confirm"}))`,
        },
      ],
    },
    {
      id: "pixels-are-last",
      level: "intermediate",
      title: "When the simple picture is not enough — and usually it should not be first",
      body: [
        "A screenshot is a lossy copy of a page. Lossy means it dropped structure. You can see ink. You cannot see that a button is disabled, or that it lives in an ad tile, or that a new tile appeared 200 milliseconds ago.",
        "Prefer observations in this order. First a normal API or file export. Then an accessibility tree: a structured list of roles and names the operating system already exposes for screen readers. Then pixels. Pixels are the leftover, not the brand.",
        "They look similar because both 'describe the screen'. The important difference is that a tree has names and parents. A PNG has colours. Grounding — attaching a click to the thing you named — is a join onto a tree row. On a PNG it is a guessed box.",
        "What are we trying to do? Resolve a name to a control, and refuse a click if the name is missing or the view is stale.",
        "Here is the smallest version.",
        "Let's understand what just happened. We looked up a name in a list of controls. We checked a timestamp. We never guessed a box. If the gold tile is not in the invoice panel list, it cannot be clicked. That is the rebuild from the story.",
      ],
      codes: [
        {
          title: "ground.py — resolve a name, do not guess a box",
          language: "python",
          code: `from dataclasses import dataclass


@dataclass
class Control:
    name: str
    panel: str


@dataclass
class View:
    controls: list[Control]
    age_ms: int


def resolve(view: View, name: str, panel: str) -> Control | None:
    if view.age_ms > 400:
        return None
    for row in view.controls:
        if row.name == name and row.panel == panel:
            return row
    return None


page = View([Control("Confirm", "invoice"), Control("Confirm", "upsell")], age_ms=120)
print(resolve(page, "Confirm", "invoice"))
print(resolve(page, "Confirm", "upsell"))`,
        },
      ],
      diagrams: [
        {
          title: "Try doors in this order",
          caption:
            "API, then a structured tree, then pixels. Each step down loses structure and costs more.",
          chart: chart(
            `flowchart TD
    Need([Need a fact from a screen]) --> Api{API or export}
    Api -->|yes| Script([Write a script])
    Api -->|no| Tree{Accessibility tree}
    Tree -->|yes| Named[Click named control]
    Tree -->|no| Pix[Screenshot as last resort]
    Named --> Done([Act])
    Pix --> Done`,
            `class Need,Script,Done hub
    class Api,Tree grp2
    class Named grp1
    class Pix grp3`
          ),
        },
      ],
    },
    {
      id: "real-app-loop",
      level: "intermediate",
      title: "How the pieces connect in a real application",
      body: [
        "A production loop has four parts. A sensor that fetches an observation and stamps the time. A budget that limits how many pictures you send. A model call that picks from the action space. A gateway that resolves the name and performs the side effect.",
        "Vision tokens are a budget, the same way step counts are a budget in a text agent. One 2-megapixel page can cost more than ten cheap text turns. Do not keep old PNGs in the prompt 'for memory'. Store a handle — an id you can fetch again — and keep a one-line note of what you already did.",
        "What are we trying to do? Cap images per run so a loop cannot wallpaper the context with photographs.",
        "Here is the smallest version.",
        "Let's understand what just happened. We counted images. After two, we stop sending pixels even if the model asks. That is hospitality to your bill and to the model's attention. The handle can still be logged for a human.",
        "At this point you should see the application: observation, budget, closed actions, resolve-then-act. Next we look at how this fails when the page moves.",
      ],
      codes: [
        {
          title: "vision_budget.py — images are a capped sensor",
          language: "python",
          code: `MAX_IMAGES = 2


def allow_image(sent: int) -> bool:
    return sent < MAX_IMAGES


sent = 0
for step in range(5):
    if allow_image(sent):
        sent += 1
        print(step, "send image", sent)
    else:
        print(step, "reuse handle, no new image")`,
        },
      ],
    },
    {
      id: "failures",
      level: "advanced",
      title: "How this fails: stale views, two Confirms, and physical side effects",
      body: [
        "Remember the simple loop: look, pick a named action, click. Real pages move. A view older than a few hundred milliseconds can show a button that has already changed. Clicking a stale view is how you confirm a dialog that is no longer there, or press Pay on a total that just updated.",
        "Hallucinated chrome is the model naming a control that is not in the tree — a button from a different site, or from its training data. If your gateway resolves names against the current tree, that click dies. If your gateway accepts a raw box, that click lands on an ad.",
        "Physical or money side effects need a human or a second check. A warehouse robot and a Pay button are not 'another click'. Close the action space so those verbs require a ticket id you already own, or a human token.",
        "What are we trying to do? Score a step on two things: did we pick a legal action, and did the name resolve in the right panel.",
        "Here is the smallest version.",
        "Let's understand what just happened. Policy pass means the verb was allowed. Grounding pass means the name joined to a live control. A pretty video of the mouse moving is not a score.",
      ],
      codes: [
        {
          title: "eval_vla.py — two scores, one step",
          language: "python",
          code: `def grade(action: str, resolved: bool, allowed: set[str]) -> dict[str, bool]:
    return {
        "policy": action in allowed,
        "grounding": resolved,
    }


print(grade("click_invoice_confirm", True, {"click_invoice_confirm", "stop"}))
print(grade("click_any_confirm", True, {"click_invoice_confirm", "stop"}))`,
        },
      ],
      diagrams: [
        {
          title: "A click that should have died",
          caption:
            "Stale picture or a name that is not in the panel. The gateway is the last door.",
          chart: chart(
            `flowchart TD
    Act[Chosen action] --> Fresh{View fresh}
    Fresh -->|no| Halt([Do not click])
    Fresh -->|yes| Name{Name in panel}
    Name -->|no| Halt
    Name -->|yes| Side[Perform click]
    Side --> Log([Log handle and time])`,
            `class Act,Halt,Log hub
    class Fresh,Name grp2
    class Side grp1`
          ),
        },
      ],
    },
    {
      id: "production-vla",
      level: "advanced",
      title: "Production: treat the screenshot as a tool result",
      body: [
        "In a real system the screenshot is fetched by a tool, like a database read. It gets a handle, a timestamp, and a byte size. It does not get pasted forever into the prompt. If the tool is 'take screenshot', the result you send the model should be a short caption plus the tree, not the raw megabytes, unless you are on a last-resort path with a budget left.",
        "Eval on frozen pages. Save the tree and the image. Replay. If you only watch live websites, a banner change becomes an unexplained fail and a GIF becomes your test suite.",
        "Computer-use products that expose a free mouse are demos until you wrap them. The wrap is the same contract: map their click down onto your named action space, or do not ship them at a Pay button.",
        "When you should use VLA: a UI with no API, a bounded task, a closed verb list, and a human nearby for the money step. When you should not: the CSV exists, the task is open-ended browsing, or you cannot say what a correct click is.",
        "The professional posture: grateful that models can look, loyal to structured observations, and suspicious of any plan whose first step is 'send the whole page as a PNG'.",
      ],
    },
  ],
  workedExample: {
    title: "Friday invoice: two Confirms, one legal target",
    setup:
      "A vendor portal shows an invoice panel with Confirm and a new upsell tile with Confirm. There is a CSV export for the table, but the final Confirm still has no API. You must not click the upsell.",
    walkthrough: [
      "Step 1 — Understand the problem. Two buttons share a label. A full-page screenshot cannot tell you which panel is which.",
      "Step 2 — Identify the relevant concept. You need an observation with structure, a closed action space, and grounding to a panel.",
      "Step 3 — Build the simplest solution. If the CSV covers the numbers, script the download. Keep VLA only for the last Confirm.",
      "Step 4 — Improve it. Observation is an accessibility tree plus a screenshot handle stored off to the side. Action is click(name, panel) only.",
      "Step 5 — Handle a failure. If the view is older than 400ms, or Confirm is missing from the invoice panel, do not click. If the model names the upsell panel, the gateway refuses.",
      "Step 6 — Explain the production version. Budget two images per run. Eval on a frozen tree that includes the gold tile. A human still owns Pay if the amount changed.",
    ],
    result:
      "The gold tile can stay. The agent cannot see it as a legal target. The weekly numbers come from a file, not from a guessed thumbnail.",
  },
  practice: {
    title: "Stop a clicker from using pixels when a tree exists",
    task:
      "A teammate wants to send a full-page PNG every turn 'because the model is multimodal'. The page has an accessibility tree with roles and names. Design the observation, the action space, and the one rule that makes pixels last. Think about freshness, two identical labels, and how you would score a step. No live browser needed.",
    hint:
      "Pixels are a tool result with a handle. Named verbs beat x,y. Expected reasoning: tree first, resolve by name and panel, budget images, score policy and grounding.",
    solution:
      "Sensor returns a tree plus an optional screenshot handle. The model sees the tree. Actions are click(name, panel) and type(name, panel, text). The gateway resolves against the current tree and drops clicks on stale views. Images send only when the tree is missing a needed field, and only inside a small budget. Why this works: two Confirms become two rows. Common wrong approach: send the PNG, ask for a bounding box, and click the brightest Confirm.",
  },
  takeaways: [
    "Multimodal means the model can take more than one kind of input, such as text plus an image.",
    "VLA means look, then pick from a list of actions your code will perform.",
    "A screenshot is a lossy, expensive observation, not ground truth.",
    "Prefer an API, then a structured control tree, then pixels.",
    "Close the action space. Raw x,y is how an ad becomes a purchase.",
    "Score grounding and policy, not a video of the mouse.",
  ],
  mistakes: [
    "Sending a full-page PNG every turn. Why people make it: 'the model can see'. What actually happens: the bill explodes and old pictures crowd out the instruction. Better approach: send a tree, store a handle, budget images.",
    "Allowing a free mouse coordinate. Why people make it: the demo looks general. What actually happens: the model clicks an ad that shares a label. Better approach: named verbs inside a panel.",
    "Skipping an API that already exists. Why people make it: the clicker is more exciting. What actually happens: a banner change becomes an incident. Better approach: script the export first.",
    "Clicking a view with no timestamp. Why people make it: the picture looks current. What actually happens: you confirm a dialog that already changed. Better approach: freshness bound in the gateway.",
    "Keeping old screenshots in the prompt for memory. Why people make it: it feels like context. What actually happens: the model reads a thumbnail and guesses a number. Better approach: one-line notes plus a handle.",
    "Scoring the GIF. Why people make it: leadership can watch it. What actually happens: a wrong Confirm still looks smooth. Better approach: policy pass and grounding pass on a frozen tree.",
  ],
  interviews: [
    {
      question: "What does multimodal mean, and what does it not mean?",
      difficulty: "easy",
      answer:
        "What they are testing: definition without magic. Good answer: the model can accept more than one kind of input in one request, usually text plus image. It does not mean the picture is trusted, cheap, or enough to act. Why that is good: it separates input from action. Follow-up: why can one screenshot cost more than a page of text?",
    },
    {
      question: "Why is a screenshot a last-resort observation for an agent?",
      difficulty: "medium",
      answer:
        "What they are testing: structure versus pixels. Good answer: a PNG drops role, parent, disabled state, and freshness. Two buttons can share a label. Grounding becomes a guessed box. An API or accessibility tree keeps names you can join to. Why that is good: it names what pixels lose. Follow-up: when would you still send pixels?",
    },
    {
      question:
        "Design the action space and gateway for a Pay button next to a promotional Confirm.",
      difficulty: "hard",
      answer:
        "What they are testing: closed verbs, panel grounding, money. Good answer: verbs are click(name, panel) only. Pay requires an amount you already computed or a human token. The gateway resolves against a fresh tree and refuses the promo panel. Screenshots are optional evidence, not the click target. Why that is good: it survives a convinced model. Follow-up: how do you eval this without the live site?",
    },
  ],
  glossary: [
    {
      term: "Multimodal",
      meaning:
        "A model that can take more than one kind of input, such as text and an image. Why it matters: extra input is not the same thing as permission to act.",
    },
    {
      term: "Vision token",
      meaning:
        "A billed chunk of image input the model attends to. Why it matters: pictures can cost as much as many pages of text.",
    },
    {
      term: "VLA",
      meaning:
        "Vision-language-action: look, think in text, then pick an action your code performs. Why it matters: this is how 'it can see' becomes 'it clicked Pay'.",
    },
    {
      term: "Observation",
      meaning:
        "What the agent is allowed to look at right now, with a time stamp. Why it matters: a stale picture is a wrong world.",
    },
    {
      term: "Action space",
      meaning:
        "The short list of verbs the agent may use. Why it matters: an open mouse is how an ad becomes a purchase.",
    },
    {
      term: "Grounding",
      meaning:
        "Joining a named action to a real control on the current view. Why it matters: without it, the model is aiming at colours.",
    },
  ],
};
