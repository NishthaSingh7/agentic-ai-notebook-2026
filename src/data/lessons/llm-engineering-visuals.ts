import type { WorkflowDiagram } from "../lesson-types";
import { pastelChart } from "@/lib/mermaid-pastel";

export interface Phase2Visuals {
  diagram: string;
  analogyDiagram: string;
  workflowDiagrams: WorkflowDiagram[];
  commandsToRemember: string[];
}

export const LLM_ENGINEERING_VISUALS: Record<string, Phase2Visuals> = {
  "openai-apis": {
    analogyDiagram: pastelChart(
      `flowchart LR
    User["Your app needs intelligence"] --> Grid["OpenAI API - intelligence on tap"]
    Grid --> Chat["Chat - GPT models"]
    Grid --> Emb["Embeddings"]
    Grid --> Img["Images"]
    Grid --> Aud["Audio"]`,
      `class User grp1
    class Grid hub
    class Chat,Emb grp2
    class Img,Aud grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    OA([OpenAI APIs])

    subgraph APIs["Core APIs"]
        A1[Chat Completions - GPT-4o]
        A2[Embeddings - text-embedding-3]
        A3[Images - DALL-E 3]
        A4[Audio - Whisper and TTS]
    end

    subgraph Params["Key Parameters"]
        P1[model - which model to call]
        P2[messages - system / user / assistant]
        P3[temperature - creativity]
        P4[max_tokens - output limit]
        P5[stream - token by token]
        P6[tools - function calling]
    end

    subgraph Cost["Cost and Limits"]
        C1[Pay per input token]
        C2[Pay per output token]
        C3[Rate limits by tier]
        C4[Use mini for high volume]
    end

    OA --> APIs
    OA --> Params
    OA --> Cost`,
      `class OA hub
    class A1,A2,A3,A4 grp1
    class P1,P2,P3,P4,P5,P6 grp2
    class C1,C2,C3,C4 grp3
    style APIs fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Params fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style Cost fill:#eff6ff,stroke:#93c5fd,color:#1e40af`
    ),
    workflowDiagrams: [
      {
        title: "Chat Completions Request Flow",
        caption: "Every chat call is messages in, tokens out — plus optional tools and streaming.",
        chart: pastelChart(
          `flowchart LR
    App[Your Application] --> SDK[OpenAI SDK]
    SDK --> API[Chat Completions API]
    API --> Model[GPT-4o or mini]
    Model --> Resp[Assistant message]
    Resp --> App`,
          `class App,SDK grp1
    class API,Model grp2
    class Resp grp3`
        ),
      },
      {
        title: "When to Use Which Model",
        caption: "Pick mini for volume, flagship for hard reasoning and multimodal.",
        chart: pastelChart(
          `flowchart TD
    Q([Which OpenAI model?])

    subgraph Pick["Decision"]
        D1[Simple classify / extract - gpt-4o-mini]
        D2[Hard reasoning / coding - gpt-4o]
        D3[Need vectors - text-embedding-3-small]
        D4[Need a picture - DALL-E 3]
    end

    Q --> Pick`,
          `class Q hub
    class D1,D2,D3,D4 grp1
    style Pick fill:#ecfdf5,stroke:#6ee7b7,color:#065f46`
        ),
      },
    ],
    commandsToRemember: [
      "pip install openai python-dotenv  # install the OpenAI SDK",
      'export OPENAI_API_KEY="sk-..."  # never hardcode keys',
      "client.chat.completions.create(model='gpt-4o-mini', messages=[...])  # text generation",
      "client.embeddings.create(model='text-embedding-3-small', input=text)  # vectors",
      "stream=True  # stream tokens instead of waiting for the full reply",
    ],
  },

  gemini: {
    analogyDiagram: pastelChart(
      `flowchart LR
    OA["OpenAI - like iOS"] --> Choice["Pick a provider"]
    Gem["Gemini - like Android"] --> Choice
    Choice --> Why["Cost, Google Cloud, video, 2M context"]`,
      `class OA grp1
    class Gem grp2
    class Choice hub
    class Why grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    GEM([Google Gemini])

    subgraph Family["Model Family"]
        F1[Gemini 2.0 Flash - fast and cheap]
        F2[Gemini 2.0 Pro - capable]
        F3[Gemini 1.5 Pro - up to 2M tokens]
    end

    subgraph Access["How You Call It"]
        A1[Google AI Studio - developer]
        A2[Vertex AI - enterprise IAM]
        A3[google-generativeai SDK]
    end

    subgraph Super["Native Strengths"]
        S1[Text + image + audio + video]
        S2[Google Search grounding]
        S3[Context caching for long prefixes]
        S4[Code execution tool]
    end

    GEM --> Family
    GEM --> Access
    GEM --> Super`,
      `class GEM hub
    class F1,F2,F3 grp1
    class A1,A2,A3 grp2
    class S1,S2,S3,S4 grp3
    style Family fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Access fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style Super fill:#eff6ff,stroke:#93c5fd,color:#1e40af`
    ),
    workflowDiagrams: [
      {
        title: "AI Studio vs Vertex AI",
        caption: "Same models — Studio for prototypes, Vertex for production Google Cloud.",
        chart: pastelChart(
          `flowchart TD
    App[Application] --> Path{Access method}
    Path -->|Developer| Studio[Google AI Studio]
    Path -->|Enterprise| Vertex[Vertex AI]
    Studio --> API[Gemini API]
    Vertex --> API
    API --> Flash[Flash]
    API --> Pro[Pro]`,
          `class App grp1
    class Path hub
    class Studio,Vertex grp2
    class API,Flash,Pro grp3`
        ),
      },
    ],
    commandsToRemember: [
      "pip install google-generativeai  # Gemini SDK",
      'export GOOGLE_API_KEY="..."  # AI Studio key',
      'genai.GenerativeModel("gemini-2.0-flash")  # pick Flash for volume',
      "model.generate_content([prompt, image])  # native multimodal",
    ],
  },

  claude: {
    analogyDiagram: pastelChart(
      `flowchart LR
    GPT["GPT - versatile generalist"] --> Pick["Choose a brain"]
    Claude["Claude - careful analyst"] --> Pick
    Pick --> Fit["Long docs, code review, precise instructions"]`,
      `class GPT grp1
    class Claude grp2
    class Pick hub
    class Fit grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    CL([Claude by Anthropic])

    subgraph Tiers["Model Tiers"]
        T1[Haiku - fast and cheap]
        T2[Sonnet - best value default]
        T3[Opus - hardest reasoning]
    end

    subgraph Features["Key Features"]
        F1[200K token context]
        F2[Prompt caching - cheaper repeats]
        F3[Tool use / computer use]
        F4[Vision - image input]
        F5[Constitutional AI safety]
    end

    subgraph Fit["Best At"]
        B1[Code review and generation]
        B2[Long document analysis]
        B3[Agentic tool loops]
        B4[Structured extraction]
    end

    CL --> Tiers
    CL --> Features
    CL --> Fit`,
      `class CL hub
    class T1,T2,T3 grp1
    class F1,F2,F3,F4,F5 grp2
    class B1,B2,B3,B4 grp3
    style Tiers fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Features fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style Fit fill:#eff6ff,stroke:#93c5fd,color:#1e40af`
    ),
    workflowDiagrams: [
      {
        title: "Messages API + Prompt Cache",
        caption: "Cache the long system prompt or document once, then pay a discount on every follow-up.",
        chart: pastelChart(
          `flowchart LR
    Sys[System prompt + docs] --> Cache[Prompt cache]
    User[User message] --> API[Messages API]
    Cache --> API
    API --> Model[Haiku / Sonnet / Opus]
    Model --> Out[Text or tool_use]`,
          `class Sys,Cache grp1
    class User,API grp2
    class Model,Out grp3`
        ),
      },
    ],
    commandsToRemember: [
      "pip install anthropic  # Anthropic SDK",
      "client.messages.create(model='claude-sonnet-4-20250514', max_tokens=1024, ...)  # max_tokens is required",
      "system='...'  # instructions go in system, not a system role message",
      "cache_control={'type': 'ephemeral'}  # cache repeated prefixes",
    ],
  },

  ollama: {
    analogyDiagram: pastelChart(
      `flowchart LR
    Cloud["Cloud API - streaming Spotify"] --> Trade["Tradeoff"]
    Local["Ollama - offline download"] --> Trade
    Trade --> Win["Privacy, zero token cost, your hardware"]`,
      `class Cloud grp1
    class Local grp2
    class Trade hub
    class Win grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    OL([Ollama - local LLMs])

    subgraph CLI["Everyday Commands"]
        C1[ollama pull - download model]
        C2[ollama run - chat in terminal]
        C3[ollama list - see local models]
        C4[ollama serve - API daemon]
    end

    subgraph API["How Apps Connect"]
        A1[REST on localhost:11434]
        A2[OpenAI SDK via base_url]
        A3[Modelfile - custom system prompt]
    end

    subgraph HW["Hardware Reality"]
        H1[8B Q4 needs about 5GB RAM]
        H2[70B Q4 needs about 40GB]
        H3[GPU much faster than CPU]
    end

    OL --> CLI
    OL --> API
    OL --> HW`,
      `class OL hub
    class C1,C2,C3,C4 grp1
    class A1,A2,A3 grp2
    class H1,H2,H3 grp3
    style CLI fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style API fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style HW fill:#eff6ff,stroke:#93c5fd,color:#1e40af`
    ),
    workflowDiagrams: [
      {
        title: "Local Dev Loop",
        caption: "Pull once, then point the same OpenAI client at localhost.",
        chart: pastelChart(
          `flowchart LR
    Pull[ollama pull llama3.2] --> Serve[ollama serve]
    Serve --> API[localhost:11434/v1]
    App[Your OpenAI SDK] --> API
    API --> Engine[llama.cpp on GPU or CPU]`,
          `class Pull,Serve grp1
    class API,Engine grp2
    class App grp3`
        ),
      },
    ],
    commandsToRemember: [
      "curl -fsSL https://ollama.com/install.sh | sh  # install Ollama",
      "ollama pull llama3.2  # download a quantized model",
      "ollama run llama3.2  # chat in the terminal",
      "OpenAI(base_url='http://localhost:11434/v1', api_key='ollama')  # same SDK, local model",
    ],
  },

  "open-source-models": {
    analogyDiagram: pastelChart(
      `flowchart LR
    Rent["Closed API - rent a furnished flat"] --> Own["Open weights - buy the house"]
    Own --> Work["You host, fine-tune, and pay GPU not tokens"]`,
      `class Rent grp1
    class Own hub
    class Work grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    OS([Open Source LLMs])

    subgraph Families["Major Families"]
        F1[Llama 3 - strong general]
        F2[Mistral / Mixtral - efficient]
        F3[Qwen - multilingual and code]
        F4[Gemma / Phi - compact]
    end

    subgraph Path["From Hub to Prod"]
        P1[Download weights - HuggingFace]
        P2[Optional LoRA / QLoRA fine-tune]
        P3[Quantize GGUF or GPTQ]
        P4[Serve with Ollama / vLLM / TGI]
    end

    subgraph License["License Check"]
        L1[Apache 2.0 - fully open]
        L2[Llama Community - commercial limits]
        L3[Always read the card before shipping]
    end

    OS --> Families
    OS --> Path
    OS --> License`,
      `class OS hub
    class F1,F2,F3,F4 grp1
    class P1,P2,P3,P4 grp2
    class L1,L2,L3 grp3
    style Families fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Path fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style License fill:#eff6ff,stroke:#93c5fd,color:#1e40af`
    ),
    workflowDiagrams: [
      {
        title: "Deploy Path",
        caption: "Weights are not a product until they are quantized and served.",
        chart: pastelChart(
          `flowchart LR
    Hub[HuggingFace Hub] --> FT[Fine-tune optional]
    FT --> Q[Quantize]
    Q --> Serve[Ollama or vLLM]
    Serve --> App[Your application]`,
          `class Hub,FT grp1
    class Q,Serve grp2
    class App grp3`
        ),
      },
    ],
    commandsToRemember: [
      "ollama pull llama3.2  # easiest local open-source run",
      "pip install transformers accelerate  # HuggingFace inference",
      "pip install vllm  # high-throughput GPU serving",
      "Check the model card license before commercial use  # Llama vs Apache 2.0",
    ],
  },

  "prompt-templates": {
    analogyDiagram: pastelChart(
      `flowchart LR
    Merge["Mail merge - Dear {name}"] --> Tpl["Prompt template - Context {context}"]
    Tpl --> Fill["Fill variables at runtime"]
    Fill --> LLM["LLM sees a complete prompt"]`,
      `class Merge grp1
    class Tpl hub
    class Fill,LLM grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    PT([Prompt Templates])

    subgraph Structure["What a Template Holds"]
        S1[System - persona and rules]
        S2[User - task with variables]
        S3[Few-shot examples block]
        S4[Format instructions]
    end

    subgraph Tools["How You Build Them"]
        T1[LangChain ChatPromptTemplate]
        T2[Jinja2 strings]
        T3[tokenizer.apply_chat_template]
        T4[Git or LangSmith versioning]
    end

    subgraph Vars["Typical Variables"]
        V1[context from retrieval]
        V2[question from the user]
        V3[format instructions]
    end

    PT --> Structure
    PT --> Tools
    PT --> Vars`,
      `class PT hub
    class S1,S2,S3,S4 grp1
    class T1,T2,T3,T4 grp2
    class V1,V2,V3 grp3
    style Structure fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Tools fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style Vars fill:#eff6ff,stroke:#93c5fd,color:#1e40af`
    ),
    workflowDiagrams: [
      {
        title: "Fill Then Call",
        caption: "Version the template in git — swap wording without touching business logic.",
        chart: pastelChart(
          `flowchart LR
    Store[Template in git] --> Engine[Fill {variables}]
    Engine --> Prompt[Formatted messages]
    Prompt --> API[LLM API]
    API --> Out[Response]`,
          `class Store,Engine grp1
    class Prompt,API grp2
    class Out grp3`
        ),
      },
    ],
    commandsToRemember: [
      "from langchain_core.prompts import ChatPromptTemplate  # reusable chat templates",
      "ChatPromptTemplate.from_messages([('system', '...'), ('human', '{question}')])  # define once",
      "prompt.invoke({'question': user_text})  # fill at runtime",
      "tokenizer.apply_chat_template(messages)  # match Llama / ChatML format",
    ],
  },

  "output-parsers": {
    analogyDiagram: pastelChart(
      `flowchart LR
    Chef["LLM talks in free text"] --> Parser["Parser - the translator"]
    Parser --> Card["Typed object your code can use"]`,
      `class Chef grp1
    class Parser hub
    class Card grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    OP([Output Parsers])

    subgraph Types["Parser Types"]
        T1[PydanticOutputParser]
        T2[JSONOutputParser]
        T3[StructuredOutputParser]
        T4[List / enum parsers]
    end

    subgraph Loop["Parse Loop"]
        L1[Inject format instructions]
        L2[LLM generates text]
        L3[parser.parse]
        L4[Retry with the error if it fails]
    end

    subgraph Prefer["When Possible"]
        P1[Native structured outputs]
        P2[Tool calling for agents]
        P3[Parsers for older models]
    end

    OP --> Types
    OP --> Loop
    OP --> Prefer`,
      `class OP hub
    class T1,T2,T3,T4 grp1
    class L1,L2,L3,L4 grp2
    class P1,P2,P3 grp3
    style Types fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Loop fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style Prefer fill:#eff6ff,stroke:#93c5fd,color:#1e40af`
    ),
    workflowDiagrams: [
      {
        title: "Parse or Retry",
        caption: "Format instructions go into the prompt. Failed JSON gets a second chance with the error.",
        chart: pastelChart(
          `flowchart TD
    Prompt[Prompt + format instructions] --> LLM[LLM text]
    LLM --> Parse{Parser}
    Parse -->|ok| Obj[Pydantic object]
    Parse -->|fail| Retry[Re-prompt with error]
    Retry --> LLM`,
          `class Prompt,LLM grp1
    class Parse hub
    class Obj grp4
    class Retry grp5`
        ),
      },
    ],
    commandsToRemember: [
      "from langchain_core.output_parsers import PydanticOutputParser  # text to typed object",
      "parser.get_format_instructions()  # inject schema into the prompt",
      "parser.parse(llm_output)  # raises if JSON does not match",
      "Prefer response_format json_schema when the provider supports it  # fewer retries",
    ],
  },

  streaming: {
    analogyDiagram: pastelChart(
      `flowchart LR
    Wait["Wait for the full recording"] --> Blank["10s blank screen"]
    Live["Live broadcast - streaming"] --> First["First token in about 300ms"]`,
      `class Wait,Blank grp1
    class Live hub
    class First grp4`
    ),
    diagram: pastelChart(
      `flowchart TD
    ST([Streaming])

    subgraph Why["Why It Exists"]
        W1[TTFT - time to first token]
        W2[Users start reading immediately]
        W3[Same total time, better feel]
    end

    subgraph How["How It Works"]
        H1[stream=True on the API]
        H2[SSE chunks with delta.content]
        H3[Client appends to the UI]
        H4[Abort signal to cancel]
    end

    subgraph Limits["Do Not"]
        L1[Parse JSON mid-stream]
        L2[Forget to flush the buffer]
        L3[Ignore disconnect errors]
    end

    ST --> Why
    ST --> How
    ST --> Limits`,
      `class ST hub
    class W1,W2,W3 grp1
    class H1,H2,H3,H4 grp2
    class L1,L2,L3 grp3
    style Why fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style How fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style Limits fill:#fdf2f8,stroke:#f9a8d4,color:#9d174d`
    ),
    workflowDiagrams: [
      {
        title: "Token-by-Token Path",
        caption: "Each SSE chunk is a delta. Accumulate for the full string; render as you go.",
        chart: pastelChart(
          `flowchart LR
    Req[stream=true] --> Server[Model generates]
    Server --> T1[Token 1]
    T1 --> UI[Update chat bubble]
    Server --> T2[Token 2]
    T2 --> UI
    UI --> Done[Complete response]`,
          `class Req,Server grp1
    class T1,T2 grp2
    class UI,Done grp3`
        ),
      },
    ],
    commandsToRemember: [
      "stream=True  # OpenAI / compatible APIs",
      "for chunk in stream: print(chunk.choices[0].delta.content or '', end='')  # render live",
      "await client.chat.completions.create(..., stream=True)  # async astream",
      "Parse structured JSON only after the stream ends  # partial JSON is invalid",
    ],
  },

  "image-models": {
    analogyDiagram: pastelChart(
      `flowchart LR
    Words["Text prompt"] --> Artist["Image model - illustrator in 10 seconds"]
    Artist --> Pic["Custom image"]`,
      `class Words grp1
    class Artist hub
    class Pic grp4`
    ),
    diagram: pastelChart(
      `flowchart TD
    IM([Image Models])

    subgraph Models["Common Models"]
        M1[DALL-E 3 - OpenAI API]
        M2[Stable Diffusion - open, local]
        M3[Midjourney - product, not API-first]
    end

    subgraph How["Generation"]
        H1[Text encoder CLIP]
        H2[Latent noise]
        H3[Denoise 20-50 steps]
        H4[Decode to pixels]
    end

    subgraph Prompt["Prompt Craft"]
        P1[Subject + style + lighting]
        P2[Size 1024x1024]
        P3[Negative prompts on SD]
        P4[ControlNet for pose / edges]
    end

    IM --> Models
    IM --> How
    IM --> Prompt`,
      `class IM hub
    class M1,M2,M3 grp1
    class H1,H2,H3,H4 grp2
    class P1,P2,P3,P4 grp3
    style Models fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style How fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style Prompt fill:#eff6ff,stroke:#93c5fd,color:#1e40af`
    ),
    workflowDiagrams: [
      {
        title: "DALL-E vs Stable Diffusion",
        caption: "API convenience versus local control, LoRA styles, and zero per-image vendor bill.",
        chart: pastelChart(
          `flowchart TD
    Need([Need an image])
    Need --> D["DALL-E 3 - easy, paid, high quality"]
    Need --> S["Stable Diffusion - GPU, customizable, free inference"]`,
          `class Need hub
    class D grp1
    class S grp2`
        ),
      },
    ],
    commandsToRemember: [
      "client.images.generate(model='dall-e-3', prompt=..., size='1024x1024')  # OpenAI images",
      "quality='hd'  # sharper, costs more",
      "pip install diffusers transformers  # local Stable Diffusion",
      "Be specific: subject, style, lighting, medium  # vague prompts look generic",
    ],
  },

  "vision-models": {
    analogyDiagram: pastelChart(
      `flowchart LR
    Blind["Text-only LLM - hears a description"] --> Eyes["Vision model - looks at the photo"]
    Eyes --> Answer["Caption, OCR, visual QA"]`,
      `class Blind grp1
    class Eyes hub
    class Answer grp4`
    ),
    diagram: pastelChart(
      `flowchart TD
    VM([Vision Models])

    subgraph Input["What You Send"]
        I1[Image URL]
        I2[Base64 bytes]
        I3[File upload]
        I4[Ask a specific question]
    end

    subgraph Stack["How It Is Wired"]
        S1[Native multimodal - GPT-4o / Gemini / Claude]
        S2[Vision encoder then LLM - LLaVA]
        S3[Visual tokens + text tokens]
    end

    subgraph Uses["Use Cases"]
        U1[OCR and receipts]
        U2[Charts and dashboards]
        U3[UI screenshot testing]
        U4[Document pages]
    end

    VM --> Input
    VM --> Stack
    VM --> Uses`,
      `class VM hub
    class I1,I2,I3,I4 grp1
    class S1,S2,S3 grp2
    class U1,U2,U3,U4 grp3
    style Input fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Stack fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style Uses fill:#eff6ff,stroke:#93c5fd,color:#1e40af`
    ),
    workflowDiagrams: [
      {
        title: "Image + Text in One Call",
        caption: "Resize first — extra pixels cost tokens and rarely add accuracy.",
        chart: pastelChart(
          `flowchart LR
    Img[Image] --> Enc[Vision encoder]
    Txt[Question] --> Tok[Text tokens]
    Enc --> Mix[Combined sequence]
    Tok --> Mix
    Mix --> LLM[LLM]
    LLM --> Out[Text answer]`,
          `class Img,Enc grp1
    class Txt,Tok grp2
    class Mix,LLM,Out grp3`
        ),
      },
    ],
    commandsToRemember: [
      "content=[{type:'text', text: question}, {type:'image_url', image_url:{url: data_url}}]  # GPT-4o vision",
      "base64.b64encode(open('photo.png','rb').read()).decode()  # inline image",
      "Ask a specific question, not just 'what is this?'  # better answers",
      "Resize large screenshots before sending  # tokens and latency",
    ],
  },

  "audio-models": {
    analogyDiagram: pastelChart(
      `flowchart LR
    Ear["STT - earpiece to text"] --> Brain["LLM"]
    Brain --> Mouth["TTS - spoken reply"]`,
      `class Ear grp1
    class Brain hub
    class Mouth grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    AU([Audio Models])

    subgraph STT["Speech to Text"]
        S1[Whisper - multilingual]
        S2[Timestamps / verbose_json]
        S3[Auto language detect]
    end

    subgraph TTS["Text to Speech"]
        T1[OpenAI tts-1 / tts-1-hd]
        T2[Voices - nova, alloy, echo]
        T3[ElevenLabs - cloning]
    end

    subgraph Voice["Voice Agent"]
        V1[Streaming STT]
        V2[LLM turn]
        V3[Streaming TTS]
        V4[Target under 1s per turn]
    end

    AU --> STT
    AU --> TTS
    AU --> Voice`,
      `class AU hub
    class S1,S2,S3 grp1
    class T1,T2,T3 grp2
    class V1,V2,V3,V4 grp3
    style STT fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style TTS fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style Voice fill:#eff6ff,stroke:#93c5fd,color:#1e40af`
    ),
    workflowDiagrams: [
      {
        title: "Meeting Notes Pipeline",
        caption: "Transcribe, summarize, then optionally speak the recap.",
        chart: pastelChart(
          `flowchart LR
    File[Meeting audio] --> Whisper[Whisper STT]
    Whisper --> Text[Transcript]
    Text --> LLM[Summarize decisions]
    LLM --> Speech[TTS recap]`,
          `class File,Whisper grp1
    class Text,LLM grp2
    class Speech grp3`
        ),
      },
    ],
    commandsToRemember: [
      "client.audio.transcriptions.create(model='whisper-1', file=audio_file)  # STT",
      "response_format='verbose_json'  # timestamps",
      "client.audio.speech.create(model='tts-1', voice='nova', input=text)  # TTS",
      "Split long files before upload  # API duration limits",
    ],
  },

  multimodal: {
    analogyDiagram: pastelChart(
      `flowchart LR
    Doc["Doctor sees labs + X-ray + speech"] --> One["One diagnosis"]
    MM["Multimodal model"] --> One`,
      `class Doc grp1
    class MM hub
    class One grp4`
    ),
    diagram: pastelChart(
      `flowchart TD
    MM([Multimodal AI])

    subgraph In["Inputs"]
        I1[Text]
        I2[Images]
        I3[Audio]
        I4[Video - Gemini]
    end

    subgraph Native["Native vs Pipeline"]
        N1[GPT-4o / Gemini trained mixed]
        N2[OCR then LLM - bolted on]
        N3[Unified token space is better]
    end

    subgraph Cost["Cost Notes"]
        C1[Image about 765 tokens]
        C2[Resize before send]
        C3[Multimodal RAG - CLIP + text]
    end

    MM --> In
    MM --> Native
    MM --> Cost`,
      `class MM hub
    class I1,I2,I3,I4 grp1
    class N1,N2,N3 grp2
    class C1,C2,C3 grp3
    style In fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Native fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style Cost fill:#eff6ff,stroke:#93c5fd,color:#1e40af`
    ),
    workflowDiagrams: [
      {
        title: "Mixed Content Array",
        caption: "One request can mix text and images. Video is still Gemini's edge.",
        chart: pastelChart(
          `flowchart TD
    Text[Text] --> Tok[Unified tokenizer]
    Image[Image] --> Tok
    Audio[Audio] --> Tok
    Tok --> XF[Shared transformer]
    XF --> Out[Text / image / audio out]`,
          `class Text,Image,Audio grp1
    class Tok,XF grp2
    class Out grp4`
        ),
      },
    ],
    commandsToRemember: [
      "model='gpt-4o'  # text + image + audio in one model",
      "content=[{type:'text',...}, {type:'image_url',...}]  # mixed message parts",
      "Gemini generate_content([prompt, video_file])  # native video",
      "Resize images and extract text when you can  # cheaper than full pixels",
    ],
  },
};
