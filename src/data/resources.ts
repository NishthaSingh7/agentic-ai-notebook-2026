export interface Resource {
  title: string;
  url: string;
  description: string;
  type: "book" | "paper" | "blog" | "course" | "github" | "youtube" | "tool" | "api" | "dataset";
}

export const resources: Record<string, Resource[]> = {
  Books: [
    {
      title: "Designing Machine Learning Systems",
      url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/",
      description: "Production ML systems by Chip Huyen — essential for AI engineers.",
      type: "book",
    },
    {
      title: "Build a Large Language Model (From Scratch)",
      url: "https://www.manning.com/books/build-a-large-language-model-from-scratch",
      description: "Hands-on LLM implementation by Sebastian Raschka.",
      type: "book",
    },
    {
      title: "AI Engineering",
      url: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/",
      description: "Chip Huyen's guide to building production AI applications.",
      type: "book",
    },
  ],
  Papers: [
    {
      title: "Attention Is All You Need",
      url: "https://arxiv.org/abs/1706.03762",
      description: "The original Transformer paper — foundational reading.",
      type: "paper",
    },
    {
      title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
      url: "https://arxiv.org/abs/2005.11401",
      description: "The original RAG paper by Lewis et al.",
      type: "paper",
    },
    {
      title: "ReAct: Synergizing Reasoning and Acting in Language Models",
      url: "https://arxiv.org/abs/2210.03629",
      description: "Foundational agent pattern combining reasoning and tool use.",
      type: "paper",
    },
  ],
  Courses: [
    {
      title: "DeepLearning.AI — Generative AI for Everyone",
      url: "https://www.deeplearning.ai/courses/generative-ai-for-everyone/",
      description: "Andrew Ng's accessible introduction to GenAI.",
      type: "course",
    },
    {
      title: "LangChain Academy",
      url: "https://academy.langchain.com/",
      description: "Official LangChain and LangGraph courses.",
      type: "course",
    },
    {
      title: "Full Stack LLM Bootcamp",
      url: "https://fullstackdeeplearning.com/llm-bootcamp/",
      description: "Intensive LLM engineering bootcamp by FSDL.",
      type: "course",
    },
  ],
  Tools: [
    {
      title: "LangSmith",
      url: "https://smith.langchain.com/",
      description: "LLM application observability and evaluation platform.",
      type: "tool",
    },
    {
      title: "Ollama",
      url: "https://ollama.com/",
      description: "Run open-source LLMs locally with a simple CLI.",
      type: "tool",
    },
    {
      title: "Pinecone",
      url: "https://www.pinecone.io/",
      description: "Managed vector database for production RAG.",
      type: "tool",
    },
    {
      title: "vLLM",
      url: "https://github.com/vllm-project/vllm",
      description: "High-throughput LLM inference engine.",
      type: "tool",
    },
  ],
  APIs: [
    {
      title: "OpenAI API",
      url: "https://platform.openai.com/docs",
      description: "GPT-4, embeddings, fine-tuning, and assistants API.",
      type: "api",
    },
    {
      title: "Anthropic Claude API",
      url: "https://docs.anthropic.com/",
      description: "Claude models with strong reasoning and safety.",
      type: "api",
    },
    {
      title: "Google Gemini API",
      url: "https://ai.google.dev/docs",
      description: "Gemini multimodal models and embeddings.",
      type: "api",
    },
  ],
};
