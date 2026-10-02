import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "rag-foundations",
  instructor:
    "I teach this from zero. If you have never heard RAG, embeddings, or chunking, that is fine. We will start with why a model cannot know your company's prices, then add one idea at a time until you can retrieve, answer, and point at the paragraph you used.",
  promise:
    "You will leave able to explain RAG in plain language, split documents into pieces a search can use, retrieve the right pieces for a question, make the model answer from those pieces, and refuse to invent a citation when the pieces do not support the claim.",

  story: {
    title: "The quote that belonged to a different article",
    body: [
      "A support team put six thousand help articles into a search box and let a model answer customers. The first week felt like a win. The bot quoted a sentence and showed a link. A customer asked whether they could export audit logs on the Pro plan. The bot said yes, with a tidy quotation and a URL. The customer upgraded. The export did not exist on Pro.",
      "The quoted sentence was real. Every word of it appeared in an Enterprise article. The link under the answer pointed at a Pro overview, because the screen simply attached 'the first search result' to 'the first footnote'. The model had mixed two neighbors. The page had made the mix look like proof.",
      "The team had already booked two months to add a smarter agent that would rewrite questions and hop between documents. On a set of real questions, the simple system — better article splits, a filter for which plan the customer was on, and 'cite this piece or say you do not know' — already answered most of them. The rest were missing articles or missing plan labels. Those are data problems. A fancier loop would have walked around a filter they had not added.",
      "They fixed the page first. Every factual sentence had to name the piece of text it came from. A checker confirmed the quote really sat in that piece. The URL came from that piece's article, not from search rank. They added plan as a filter before search. They did not build the agent that quarter. The refunds stopped.",
    ],
    moral:
      "Retrieval only tells the truth if a sentence is joined to the exact piece that supports it. A link under a paragraph is not proof. It is decoration until that join exists.",
  },

  stages: [
    {
      id: "why-the-model-needs-help",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let us start from zero. A large language model is a program that predicts the next word. It was trained on a huge pile of public text. It can sound sure. It does not have a live copy of your help center, your prices, or yesterday's policy change. Those facts live in your files.",
        "If you ask 'can I export audit logs on Pro?' and you only send the question, the model has two bad options. It can guess from old blog posts in its training. Or it can invent a confident sentence. People call a confident wrong sentence a hallucination. The everyday picture is a student who did not bring the textbook and still fills the blank.",
        "What happens without outside information? Customers get answers that sound like your docs and are not. Support spends the afternoon undoing upgrades. The model is not 'lying' in a human sense. It is completing a sentence. Completion is not lookup.",
        "So the problem this sitting solves is simple: how do we give the model the right pieces of your files at the moment of the question, and how do we prove it used them?",
        "At this point you should understand the why. We are not making the model smarter. We are handing it a textbook page before it writes.",
      ],
      diagrams: [
        {
          title: "Guessing versus looking it up",
          caption:
            "Without your files, the model can only complete a sentence. Completion is not lookup.",
          chart: chart(
            `flowchart TD
    Q([Customer question]) --> Guess[Model guesses from training]
    Q --> Look[Hand it a page from your files]
    Guess --> Risk([Confident wrong answer])
    Look --> Safer([Answer while looking at the page])`,
            `class Q,Risk,Safer hub
    class Guess grp3
    class Look grp1`
          ),
        },
      ],
    },
    {
      id: "what-rag-is",
      level: "beginner",
      title: "What retrieval-augmented generation is",
      body: [
        "The everyday picture: you do not ask a colleague to recite the employee handbook from memory. You search the handbook, open a page, and then they answer while looking at it. Search first, speak second.",
        "That is the idea. We will give it a name after the picture is clear. Retrieval means 'find the relevant pieces'. Generation means 'write the answer'. Putting them together is retrieval-augmented generation, usually shortened to RAG. The model is augmented — helped — by retrieved text at answer time, not by hoping the fact is already in its weights.",
        "Weights are the billions of numbers the model learned during training. They are frozen when you call the API. Fine-tuning would change those numbers later. RAG does not change them. It adds pages to the prompt. They look similar because both try to add knowledge. The important difference is when the knowledge arrives: training time versus this question, right now.",
        "The simplest example is one file and one question. File: 'Audit log export is available on the Enterprise plan only.' Question: 'Can I export logs on Pro?' You paste the file under the question and say 'answer using only this text'. That is RAG with no database at all.",
        "Why does the term matter? Because teams say 'we built RAG' when they mean 'we pasted a wiki into the prompt'. Real RAG is a pipeline you can inspect: find pieces, show them to the model, and keep a pointer from each claim back to a piece.",
      ],
      diagrams: [
        {
          title: "Find pages, then write",
          caption:
            "The model never sees 'the whole company'. It sees the few pieces you retrieved for this question.",
          chart: chart(
            `flowchart LR
    Q([Question]) --> Find[Find relevant pieces]
    Files[(Your files)] --> Find
    Find --> Prompt[Question plus pieces]
    Prompt --> Write[Model writes]
    Write --> Out([Answer])`,
            `class Q,Out hub
    class Files,Find grp1
    class Prompt,Write grp2`
          ),
        },
      ],
    },
    {
      id: "simplest-rag",
      level: "beginner",
      title: "The simplest version: one folder, one question",
      body: [
        "What are we trying to do? Search a folder of text files by shared words, take the top few files, and ask the model to answer using only those files. No special database yet. You should be able to run this in your head.",
        "Here is the smallest version. Split each file into lines. Count how many question words appear in the file. Sort. Keep the top three. Paste them under the question with a hard rule: if the files do not say, say you do not know.",
        "Let's understand what just happened. Retrieval here is a word count. It will miss a paraphrase and it will over-rank a file that repeats a common word. That is fine. We are proving the shape: find, paste, write, refuse if empty.",
        "What happens if retrieval returns nothing? You do not still ask the model to 'do its best'. That is a guessing machine with a search badge. You return a refusal. That is a product feature.",
        "At this point you should understand the simplest RAG: a finder, a prompt that includes the finds, and a rule that the answer may not wander off the page.",
      ],
      codes: [
        {
          title: "naive_rag.py — search by shared words, then ask",
          language: "python",
          code: `def score(question: str, text: str) -> int:
    words = set(question.lower().split())
    return sum(1 for w in words if w in text.lower())


def retrieve(question: str, files: dict[str, str], k: int = 3) -> list[str]:
    ranked = sorted(files, key=lambda name: score(question, files[name]), reverse=True)
    return [name for name in ranked[:k] if score(question, files[name]) > 0]


def prompt(question: str, files: dict[str, str], names: list[str]) -> str:
    pages = "\\n\\n".join(f"[{n}]\\n{files[n]}" for n in names)
    return (
        "Answer using only the pages. If they do not say, say you do not know.\\n\\n"
        f"{pages}\\n\\nQuestion: {question}"
    )`,
        },
      ],
    },
    {
      id: "chunks-and-embeddings",
      level: "intermediate",
      title: "How we implement it: pieces, then meaning",
      body: [
        "A whole article is often too big and too mixed. The Pro overview mentions logs in one section and refunds in another. If you retrieve the whole page, the model sees neighbors that are not about the question. So we cut the page into chunks: smaller pieces, each with an id you can point at later.",
        "How do you cut? Start with headings. A heading is a natural seam. If a section is still huge, cut on paragraphs and keep a little overlap so a sentence is not split from the one that explains it. Give every piece a chunk id, an article id, and the heading it came from.",
        "Word count still misses 'card bounce' when the article says 'declined'. An embedding is a list of numbers that stands in for meaning. You send a piece of text to an embedding model and get back a vector — that list. Pieces with nearby vectors are treated as similar in meaning. We will spend a later sitting on the store that holds those vectors. For now you only need: embed the chunks, embed the question, pick the nearest chunks.",
        "What are we trying to do? Turn each chunk into a row you can find later. The row is not only the vector. It is the text, the chunk id, the article url, and labels such as plan.",
        "Let's understand what just happened. You did not teach the language model your docs. You built an index of pieces and a way to pull a few of them into the prompt. The model still only writes. The index is what finds.",
      ],
      codes: [
        {
          title: "chunk.py — a piece you can cite later",
          language: "python",
          code: `from dataclasses import dataclass


@dataclass
class Chunk:
    id: str
    article_id: str
    heading: str
    text: str
    plan: str  # "pro" | "enterprise" | "any"


def from_section(article_id: str, heading: str, text: str, plan: str, n: int) -> Chunk:
    return Chunk(
        id=f"{article_id}#{n}",
        article_id=article_id,
        heading=heading,
        text=text.strip(),
        plan=plan,
    )`,
        },
      ],
      diagrams: [
        {
          title: "Cut, number, search, write",
          caption:
            "The chunk id is the thing a sentence can name. Without it, a URL is only decoration.",
          chart: chart(
            `flowchart LR
    Doc[Article] --> Cut[Cut on headings]
    Cut --> Row[Chunk id plus text]
    Row --> Index[(Index)]
    Q([Question]) --> Near[Nearest chunks]
    Index --> Near
    Near --> Write[Model writes]
    Write --> Cite[Sentence names a chunk id]`,
            `class Q,Cite hub
    class Doc,Cut,Row grp1
    class Index,Near grp2
    class Write grp3`
          ),
        },
      ],
    },
    {
      id: "filters-and-cite",
      level: "intermediate",
      title: "When meaning search is not enough: filters and citations",
      body: [
        "Nearest meaning will happily return the Enterprise article for a Pro customer, because both articles are about logs. A filter is a hard label check before or during search: plan must be Pro or any. Filters are not optional polish. They are how you stop a neighbor from entering the prompt.",
        "Here is the key idea. A citation is not a link you sprinkle at the bottom. A citation is a join: this sentence, this chunk id. If you cannot name the chunk, you do not publish the sentence. The URL is copied from that chunk's article, not from whoever ranked first.",
        "What are we trying to do? After the model writes, split the answer into claims. For each claim, require a chunk id. Check that the quoted words actually appear in that chunk, or that a small entailment check agrees. If the check fails, drop the sentence or replace it with 'I do not know'.",
        "Let's understand why rank-as-citation failed in the story. Search rank is 'these pieces seemed near the question'. A footnote is 'this piece contains this claim'. Those are different jobs. Mixing them sold a feature that lived next door.",
        "Pause and check. If two chunks disagree — Pro is silent, Enterprise says yes — and you forgot the filter, what should happen? The model will blend them. The filter had to run before generation, not after the customer upgraded.",
      ],
      codes: [
        {
          title: "cite.py — a sentence must name a piece",
          language: "python",
          code: `def supported(claim: str, chunk_id: str, chunks: dict[str, str]) -> bool:
    if chunk_id not in chunks:
        return False
    piece = chunks[chunk_id].lower()
    # Tiny stand-in: the claim's content words must appear.
    words = [w for w in claim.lower().split() if len(w) > 3]
    return bool(words) and all(w in piece for w in words[:4])


def publish(sentences: list[tuple[str, str]], chunks: dict[str, str]) -> str:
    kept = []
    for claim, chunk_id in sentences:
        if supported(claim, chunk_id, chunks):
            kept.append(f"{claim} [{chunk_id}]")
    return " ".join(kept) if kept else "I do not know from the pages I have."`,
        },
      ],
    },
    {
      id: "how-it-fits",
      level: "intermediate",
      title: "How the pieces connect in a real app",
      body: [
        "Put the pieces on one path. Documents land in a store you own. A job cuts them into chunks, labels them, and embeds them. A user asks a question. You apply filters you already know — plan, locale, product. You retrieve a handful of chunks. You build a prompt that lists each chunk with its id. The model writes. A checker joins each claim to a chunk. The page shows the sentence and a link from that chunk.",
        "The documents stay the system of record. The index is derived. If you edit a price, you re-cut and re-embed that article. If you delete an article, you delete its chunks. An index that forgets to forget will keep quoting last quarter.",
        "k — how many chunks you retrieve — is a knob, not a personality. Larger k raises the chance you included the right piece and the chance you included a neighbor. Start small, measure, then widen.",
        "Connect this back to fine-tuning. Fine-tuning is useful for style and for tasks you repeat. It is a poor way to ship a price that changes next Tuesday. RAG is for facts that must stay outside the weights.",
        "At this point you should be able to walk a teammate from a markdown file to a cited sentence without naming a vendor.",
      ],
      diagrams: [
        {
          title: "The join is the last arrow",
          caption:
            "Search finds neighbors. The checker decides whether a sentence may leave the building.",
          chart: chart(
            `flowchart TD
    Ask([Question]) --> Filter[Apply plan and product]
    Filter --> Retr[Retrieve chunks]
    Retr --> Prompt[Prompt with chunk ids]
    Prompt --> Draft[Model draft]
    Draft --> Join{Each claim has a chunk?}
    Join -->|no| Refuse([Say you do not know])
    Join -->|yes| Page([Answer plus real links])`,
            `class Ask,Refuse,Page hub
    class Filter,Retr,Prompt grp1
    class Draft,Join grp2`
          ),
        },
      ],
    },
    {
      id: "how-rag-fails",
      level: "advanced",
      title: "How RAG fails: blends, empty hits, stale pages",
      body: [
        "Now that you understand the simple pipeline, let's see how it breaks. The first failure is a blend. Two nearby chunks disagree. The model writes a third sentence that appears in neither. A citation list at the bottom will not save you. The checker must see each claim against one chunk.",
        "The second failure is empty retrieval. Nothing scores high enough. If you still ask the model to 'do its best', you have built a guessing machine with a search badge. Return a refusal. That is a product feature, not a shy error.",
        "The third failure is stale pages. You published a new price and forgot to re-index, or you 'deleted' a chunk by flipping a flag the query does not read. The assistant keeps quoting last quarter. Deletes and rebuilds are part of RAG. They are not chores you do after launch.",
        "The fourth failure is missing negatives. The Enterprise article says the feature exists. No Pro article says it does not. After you filter to Pro, recall of the 'not on Pro' fact is zero because you never wrote it. You cannot retrieve a sentence you did not store.",
        "A fifth failure is chasing an agent when the misses are data. Cluster the failures: missing article, wrong cut, missing filter, blend, bad page join. Only then decide whether you need rewriting or a second hop.",
      ],
    },
    {
      id: "production-and-when-enough",
      level: "advanced",
      title: "Production RAG and when the simple path is enough",
      body: [
        "In production you measure more than 'the answer sounded good'. Keep a small labelled set: question, article ids that should appear, a short gold answer. Track recall@k — did the right piece appear in the top k — precision@k, faithfulness — did the claim match its chunk — and whether a person would accept the answer. Change one thing at a time.",
        "Naive RAG — one retrieve, one generate — is enough for many help centers. It is the right default when questions are single hop and the corpus is curated. Agentic RAG, where a loop may retrieve again, is a later tool. You approve it when miss analysis shows true multi-hop and a prototype beats the simple path enough to pay for the extra latency.",
        "Trade-offs are plain. Larger k raises recall and lowers precision. A reranker — a second, slower model that reorders the first hits — can buy precision. Filters buy correctness and can hide a fact if you never wrote the negative. Fine-tuning will not replace retrieval for facts that change next Tuesday.",
        "The reason we do this is so a customer is not sold a feature that lives in the neighbor article. Fancy retrieval does not fix a page that attributes by rank.",
        "At this point you should be able to teach RAG with four verbs — cut, embed, retrieve, cite — and one warning: cite is a join.",
      ],
      codes: [
        {
          title: "eval.py — one change, one scoreboard",
          language: "python",
          code: `from dataclasses import dataclass


@dataclass
class Report:
    recall_at_5: float
    precision_at_5: float
    faithful: float
    accepted: float


def better(candidate: Report, baseline: Report) -> bool:
    gained = candidate.accepted >= baseline.accepted + 0.02
    honest = candidate.faithful >= baseline.faithful - 0.01
    return honest and gained`,
        },
      ],
      diagrams: [
        {
          title: "Cluster the miss before you add a loop",
          caption:
            "An agent is one possible fix. Missing data and a broken join are cheaper fixes.",
          chart: chart(
            `flowchart TD
    Miss([Wrong answer]) --> Kind{What failed}
    Kind -->|no article| Data[Write or fix the doc]
    Kind -->|wrong neighbor| Retr[Filters or cutter]
    Kind -->|blend| Gen[Claim to chunk check]
    Kind -->|bad URL| Page[Join on chunk id]
    Kind -->|true multi hop| Agent[Then consider a second retrieve]`,
            `class Miss hub
    class Kind grp2
    class Data,Retr,Gen,Page grp1
    class Agent grp3`
          ),
        },
      ],
    },
  ],

  workedExample: {
    title: "Question: 'Can I export audit logs on Pro?'",
    setup:
      "Two articles exist. The Pro overview mentions logs but not export. The Enterprise security article has a section that says export is Enterprise-only. Simple meaning search returns both, plus three generic logging tips. The old page attaches the first URL to every footnote.",
    walkthrough: [
      "Step 1 — Understand the problem. The customer needs a plan-specific fact. Two nearby articles will blend if both reach the model.",
      "Step 2 — Identify the relevant concept. RAG must filter by plan and join each sentence to a chunk id.",
      "Step 3 — Build the simplest solution. Cut on headings. Label each piece with plan. Retrieve top 3 with no filter. Both plan pieces appear. Recall looks fine. Precision is mixed.",
      "Step 4 — Improve it. Filter to plan in {pro, any}. The Enterprise piece disappears. If no Pro piece states the negative, you now have nothing to cite.",
      "Step 5 — Handle a failure. Write a Pro sentence: export is not on Pro. Re-index. The checker now has a chunk to join. If the model still quotes Enterprise, the filter or the checker drops it.",
      "Step 6 — Production version. The page only prints sentences that passed the join. The URL is the chunk's article. A labelled set watches this question. You do not add an agent until misses are truly multi-hop.",
    ],
    result:
      "The customer is told export is not on Pro, with a link to the Pro page that says so. The Enterprise sentence never wears a Pro URL.",
  },

  practice: {
    title: "Stop a quote from wearing the neighbor's URL",
    task:
      "Your assistant retrieves five chunks and prints one footnote: the URL of chunk 1. A user gets a true Enterprise sentence with a Pro link. Design the smallest change that makes that impossible. Say what a citation is, when you check it, and what the user sees if the check fails.",
    hint:
      "Rank is not a join. Ask which id a sentence names. Ask what happens when retrieval is empty after a filter.",
    solution:
      "Expected reasoning: the bug is attribution, not 'the model is dumb'.\n\nSolution: each factual sentence must carry a chunk id. A checker confirms the claim against that chunk's text. The URL is copied from that chunk. If no sentence passes, the product says it does not know. Filters for plan run before retrieve.\n\nWhy it works: a neighbor can no longer donate a sentence to someone else's link.\n\nCommon wrong approach: add a longer system prompt that says 'please cite correctly', or build an agent that hops more pages while the page still attributes by rank.",
  },

  takeaways: [
    "RAG is a way of giving an LLM relevant external information at inference time instead of expecting the model to already contain the required knowledge.",
    "A chunk is a piece of a document with an id you can point at. If you cannot name the piece, you cannot cite it.",
    "An embedding is a list of numbers that stands in for meaning so you can find similar pieces, not exact titles.",
    "A citation is a join from a sentence to a chunk id. A link under a paragraph is decoration until that join exists.",
    "Filters belong before generation. Neighbors that 'feel similar' will otherwise blend in the answer.",
    "Empty retrieval should become a refusal. Asking the model to 'do its best' rebuilds guessing with a search badge.",
  ],

  mistakes: [
    "Mistake: paste the wiki into the prompt and call it RAG. Why people make it: it works on three documents. What actually happens: the window fills, the middle is ignored, and you cannot cite a piece. Better approach: cut, retrieve a few, join each claim.",
    "Mistake: treat search rank as the citation. Why people make it: the UI needs a URL. What actually happens: a true sentence wears the neighbor's link. Better approach: URL comes from the chunk the sentence named.",
    "Mistake: skip filters because 'the model will sort it out'. Why people make it: fewer fields to label. What actually happens: Pro users get Enterprise facts. Better approach: label and filter before retrieve.",
    "Mistake: ask the model to guess when nothing retrieved. Why people make it: silence feels like a failed product. What actually happens: confident wrong answers. Better approach: refuse, then go write the missing doc.",
    "Mistake: change cutter, model, and k in the same week. Why people make it: shipping pressure. What actually happens: you cannot tell what moved. Better approach: one change, one scoreboard.",
    "Mistake: jump to an agent because naive RAG missed. Why people make it: agents sound more capable. What actually happens: a loop walks around missing labels. Better approach: cluster the misses first.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "In one or two sentences, what is RAG?",
      answer:
        "What they are testing: the idea without vendor names.\n\nGood answer: you find relevant pieces of your files, add them to the prompt, and make the model answer from those pieces, with a pointer from each claim back to a piece.\n\nWhy that is good: it names retrieve, generate, and cite.\n\nFollow-up: how is that different from fine-tuning?",
    },
    {
      difficulty: "medium",
      question: "A bot quoted a real sentence and linked the wrong article. How do you fix the page?",
      answer:
        "What they are testing: citation as a join.\n\nGood answer: stop attaching the first URL to every footnote. Require a chunk id on each claim, check the claim against that chunk, and copy the URL from that chunk. If the check fails, say you do not know.\n\nWhy that is good: it fixes attribution, not just retrieval.\n\nFollow-up: where do plan filters belong in that path?",
    },
    {
      difficulty: "hard",
      question: "When is naive RAG enough, and when would you add a second retrieve?",
      answer:
        "What they are testing: trade-offs, not a default to agents.\n\nGood answer: naive RAG is enough for single-hop questions over a curated corpus. I add a second retrieve when miss analysis shows the answer is a join across pieces, and a prototype beats the simple path on faithfulness enough to pay for latency. I do not add it to paper over missing documents or missing filters.\n\nWhy that is good: it treats extra hops as a cost you can justify.\n\nFollow-up: what four buckets do you put misses in before you decide?",
    },
  ],

  glossary: [
    {
      term: "RAG",
      meaning:
        "Retrieval-augmented generation: find relevant pieces, then write the answer from them. Why it matters: it is how you add living facts without retraining the model.",
    },
    {
      term: "Chunk",
      meaning:
        "A piece of a document with an id, text, and labels. Why it matters: it is the unit you retrieve and the unit you cite.",
    },
    {
      term: "Embedding",
      meaning:
        "A list of numbers that stands in for a piece of text's meaning. Why it matters: nearby lists let you find similar pieces when the words differ.",
    },
    {
      term: "Citation",
      meaning:
        "A join from a published sentence to a chunk id. Why it matters: without it, a URL is decoration.",
    },
    {
      term: "Hallucination",
      meaning:
        "A confident sentence the model completed that is not supported by the retrieved pieces. Why it matters: RAG reduces it only if you refuse unsupported claims.",
    },
    {
      term: "Recall@k",
      meaning:
        "Whether the right piece appeared in the top k retrieved chunks. Why it matters: if the piece never arrived, the model cannot honestly cite it.",
    },
  ],
};
