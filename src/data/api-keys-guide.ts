export interface ApiKeyStep {
  title: string;
  detail: string;
}

export interface ApiProvider {
  id: string;
  name: string;
  tagline: string;
  recommended?: boolean;
  consoleUrl: string;
  docsUrl: string;
  envVar: string;
  freeTier: {
    headline: string;
    bullets: string[];
  };
  paidTier: {
    headline: string;
    bullets: string[];
  };
  steps: ApiKeyStep[];
  quickTest?: string;
}

export const apiKeysIntro = {
  title: "Get your API keys before you build anything",
  subtitle:
    "Every lesson with runnable code — LLM calls, RAG, agents — needs an API key. Free tiers are enough to complete Phase 1 and most early projects.",
  whyItMatters: [
    "You cannot call Gemini, GPT, or Grok without an API key — there is no workaround.",
    "Free tiers let you experiment without a credit card (Gemini & Grok) or with trial credits (OpenAI).",
    "Store keys in a `.env` file — never commit them to GitHub.",
    "Pick one provider to start; you can add others later for comparison or failover.",
  ],
};

export const apiProviders: ApiProvider[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    tagline: "Recommended — we use this most in the notebook",
    recommended: true,
    consoleUrl: "https://aistudio.google.com/apikey",
    docsUrl: "https://ai.google.dev/gemini-api/docs",
    envVar: "GOOGLE_API_KEY",
    freeTier: {
      headline: "Free tier (Google AI Studio)",
      bullets: [
        "Create a key at no cost — no credit card required for the free tier",
        "Gemini 2.0 Flash: fast, cheap, great for learning and prototyping",
        "Generous rate limits for personal study and small demos",
        "Multimodal: text, images, and more in one API",
      ],
    },
    paidTier: {
      headline: "Paid (when you outgrow free)",
      bullets: [
        "Enable billing in Google Cloud / AI Studio for higher limits",
        "Pay per token — Flash models stay very affordable at scale",
        "Vertex AI for enterprise: VPC, compliance, SLAs",
      ],
    },
    steps: [
      {
        title: "Open Google AI Studio",
        detail: "Go to aistudio.google.com/apikey and sign in with your Google account.",
      },
      {
        title: "Create API key",
        detail: 'Click "Create API key" → choose a Google Cloud project (or create one) → copy the key.',
      },
      {
        title: "Save in .env",
        detail: "In your project folder: `GOOGLE_API_KEY=your_key_here` inside a `.env` file.",
      },
      {
        title: "Install SDK & test",
        detail: "`pip install google-generativeai python-dotenv` then run a one-line generate call to confirm it works.",
      },
    ],
    quickTest: `import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")
print(model.generate_content("Say hello in one sentence.").text)`,
  },
  {
    id: "openai",
    name: "OpenAI",
    tagline: "Industry standard — GPT-4o, function calling, Assistants",
    consoleUrl: "https://platform.openai.com/api-keys",
    docsUrl: "https://platform.openai.com/docs",
    envVar: "OPENAI_API_KEY",
    freeTier: {
      headline: "Free / trial credits",
      bullets: [
        "New accounts may receive limited free trial credits (varies by region)",
        "After trial: pay-as-you-go — you only pay for tokens you use",
        "gpt-4o-mini is very cheap for learning (~$0.15/1M input tokens)",
        "No monthly minimum — ideal once you add a payment method",
      ],
    },
    paidTier: {
      headline: "Paid usage",
      bullets: [
        "gpt-4o: flagship model for complex reasoning and vision",
        "Batch API & caching for lower cost at scale",
        "Usage tiers unlock higher rate limits as spend grows",
      ],
    },
    steps: [
      {
        title: "Create an OpenAI account",
        detail: "Sign up at platform.openai.com with email or Google/Microsoft.",
      },
      {
        title: "Add billing (for continued use)",
        detail: "Settings → Billing → add a payment method when trial credits run out.",
      },
      {
        title: "Generate API key",
        detail: 'API keys → "Create new secret key" → name it (e.g. notebook-dev) → copy immediately.',
      },
      {
        title: "Save in .env",
        detail: "`OPENAI_API_KEY=sk-...` in `.env`. Add `.env` to `.gitignore`.",
      },
    ],
    quickTest: `import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
r = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Say hello in one sentence."}],
)
print(r.choices[0].message.content)`,
  },
  {
    id: "grok",
    name: "Grok (xAI)",
    tagline: "Fast reasoning from xAI — great alternative to compare models",
    consoleUrl: "https://console.x.ai/",
    docsUrl: "https://docs.x.ai/docs",
    envVar: "XAI_API_KEY",
    freeTier: {
      headline: "Free credits",
      bullets: [
        "xAI often provides promotional free credits for new developers",
        "Check console.x.ai for current offers and monthly free tiers",
        "OpenAI-compatible API — easy to swap in existing code",
        "Grok models strong at reasoning and coding tasks",
      ],
    },
    paidTier: {
      headline: "Paid usage",
      bullets: [
        "Prepaid credits or pay-as-you-go via xAI console",
        "Competitive pricing on Grok-2 and Grok-3 family models",
        "Higher rate limits with paid balance",
      ],
    },
    steps: [
      {
        title: "Sign up at xAI Console",
        detail: "Go to console.x.ai and create an account (X/Twitter login may be available).",
      },
      {
        title: "Create API key",
        detail: 'Navigate to API Keys → "Create" → copy the key (shown once).',
      },
      {
        title: "Save in .env",
        detail: "`XAI_API_KEY=your_key_here` in your `.env` file.",
      },
      {
        title: "Test with OpenAI SDK",
        detail: "xAI is OpenAI-compatible: set `base_url='https://api.x.ai/v1'` and use your XAI key.",
      },
    ],
    quickTest: `import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(
    api_key=os.getenv("XAI_API_KEY"),
    base_url="https://api.x.ai/v1",
)
r = client.chat.completions.create(
    model="grok-2-1212",
    messages=[{"role": "user", "content": "Say hello in one sentence."}],
)
print(r.choices[0].message.content)`,
  },
];

export const apiKeysSecurity = {
  title: "Keep your keys safe",
  rules: [
    "Never paste API keys in chat, Discord, or public repos",
    "Use `.env` locally and environment variables in production (Netlify, Vercel, etc.)",
    "Add `.env` to `.gitignore` on day one",
    "Rotate keys immediately if you accidentally expose one",
    "Create separate keys per project — revoke without breaking everything",
  ],
};
