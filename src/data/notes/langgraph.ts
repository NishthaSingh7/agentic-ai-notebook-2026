import type { StudyCard } from "@/data/notes";

export const langgraphCards: StudyCard[] = [
  {
    slug: "what-it-is",
    part: "Start here",
    title: "What LangGraph is",
    lead: "LangChain hands you the pieces. LangGraph runs them as a graph.",
    picture: `flowchart LR
      startNode[Start] --> work[A node]
      work --> choice{Yes or no?}
      choice -->|Yes| toolNode[A tool]
      choice -->|No| doneNode[End]
      toolNode --> doneNode`,
    pictureCaption: "Start, one step, a decision, then a tool or the end.",
    story:
      "You already know how to cook one dish. You have a pan, salt, and a recipe card. That is LangChain: the pieces. Dinner for guests is different. Someone has to say who chops, who tastes, and whether the soup goes back to the stove. LangGraph is that someone. It does not replace the pan. It runs the kitchen.",
    plain:
      "LangChain gives you components for building an application that uses a model: the model, prompts, chains, tools, structured output, and a basic agent. LangGraph gives you a way to orchestrate those components as a graph. A LangGraph application is mostly four things stacked. State, then nodes, then edges, then the graph. State is what information the workflow carries. A node is a unit of work. An edge is the connection between nodes. The graph is the complete workflow. The graph controls what happens next. Hold the picture in your head as a state machine for an application that uses a model. The state sits in the middle, with fields like messages, user input, a result, and a status. Nodes hang off that state. A decision after the nodes sends you to another node or to the end. The line to memorize is this: nodes modify state, and edges determine where execution goes next.",
    example:
      "A run starts. It enters a node. The node writes something into the state. A decision looks at that state. Yes goes to a tool, then to the end. No goes straight to the end. Nothing in that picture is a model yet. It is only the shape.",
    tryThis:
      "Say the four words out loud, in order: state, nodes, edges, graph. Then say which one chooses the next step. The edges do.",
    remember: "Remember it as: the pieces already exist. The graph decides what happens next.",
  },
  {
    slug: "why-a-graph",
    part: "Start here",
    title: "Why a straight line breaks",
    lead: "User, model, answer is easy. A real agent loops, branches, and sometimes waits.",
    picture: `flowchart LR
      userNode[User] --> understand[Understand]
      understand --> plan[Plan]
      plan --> toolNode[Tool]
      toolNode --> look[Inspect]
      look --> again{Another tool?}
      again -->|Yes| toolNode
      again -->|No| answer[Answer]`,
    pictureCaption: "Understand, plan, act, look, then decide if you go again.",
    story:
      "Asking a friend for directions is a chat. Handing them the keys and saying 'move the car to the shade, then tell me where it is' is an errand. They look. They might move it again. They might come back and ask you before they touch a second car. A single slide from question to answer cannot hold that errand.",
    plain:
      "A simple LangChain application is the user, then the model, then an answer. Easy. An actual agent might need to understand the request, plan, call a tool, inspect the result, and ask whether it should call another tool. Yes means another tool, then inspect again. No means answer. Now you have loops, branching, shared state, multiple nodes, retries, human intervention, persistence, and long-running execution. That list is where LangGraph becomes useful. In a project, you are not adding a graph to look sophisticated. You are adding it because the next step depends on what just happened.",
    example:
      "'Draft a reply' is the easy line. 'Draft a reply, and if I say yes, send it' already has a branch and a person in the middle. The draft has to sit somewhere both steps can see. That somewhere is the shared state.",
    tryThis:
      "Write two lines for a job you have. One line is only talk. The other line loops, or waits for you, or might fail and try again. If the second line is real, that job is why this stack of notes exists.",
    remember: "Remember it as: a line is a chat. Loops, branches, and a pause are a graph.",
  },
  {
    slug: "install",
    part: "A graph with no model",
    title: "Install it",
    lead: "A virtual environment, LangGraph, and a key that stays out of the file.",
    picture: `flowchart LR
      folder[A folder] --> env[A virtual env]
      env --> pkg[LangGraph]
      pkg --> key[A key in the environment]`,
    pictureCaption: "The library first. The model package only if this machine will call one.",
    story:
      "You do not season a pan you have not bought. You also do not write the pantry password on the recipe card where every guest can read it. The key lives in the environment. The recipe only asks for it.",
    plain:
      "Create a virtual environment with python3 -m venv .venv, then activate it. On macOS or Linux that is source .venv/bin/activate. On Windows that is .venv\\Scripts\\activate. Install LangGraph with pip install -U langgraph. If you are using LangChain models or tools, also run pip install -U langchain langchain-openai. For OpenAI, set the key in the shell. On macOS or Linux that is export OPENAI_API_KEY=\"your-key\". On Windows PowerShell that is $env:OPENAI_API_KEY=\"your-key\". You do not need the model package for the first graph. That graph has no model on purpose.",
    example:
      "You are on a Mac. You make .venv, you activate it, you install LangGraph, and you stop. The hello graph on the next card runs with no key at all. The key shows up only when a later card calls ChatOpenAI.",
    tryThis:
      "Decide which machine you are on, and say the activate line for that machine before you look it up. If you hesitate, that is the line to keep.",
    functions: [
      {
        title: "macOS or Linux",
        why: "Create the environment, turn it on, install the library, and park the key beside the shell.",
        language: "bash",
        code: `python3 -m venv .venv
source .venv/bin/activate
pip install -U langgraph
pip install -U langchain langchain-openai
export OPENAI_API_KEY="your-key"`,
      },
      {
        title: "Windows",
        why: "Same environment. The activate line and the key line are the ones that change.",
        language: "powershell",
        code: `.venv\\Scripts\\activate
$env:OPENAI_API_KEY="your-key"`,
      },
    ],
    remember: "Remember it as: install the graph first. The key stays in the environment.",
  },
  {
    slug: "hello-graph",
    part: "A graph with no model",
    title: "Hello, with no model",
    lead: "Understand the graph before you attach a model.",
    picture: `flowchart LR
      startNode[Start] --> hello[hello]
      hello --> doneNode[End]`,
    pictureCaption: "Start, hello, end. Then compile, then invoke.",
    story:
      "The first time you use a new kitchen, you boil water. You do not cater a wedding. Boiling water tells you the stove works. A graph with no model is the boiling water. If the hello fails, you fix the wire. You do not blame a model you have not invited in.",
    plain:
      "StateGraph(State) creates a graph based on a state schema. add_node(\"hello\", hello) registers the function under a name. add_edge(START, \"hello\") is where execution begins, so the path is start, then hello. add_edge(\"hello\", END) continues that path to the end. compile turns the graph definition into an executable application. invoke runs it with a starting state. The node receives that state and returns a dictionary. The dictionary is the update.",
    example:
      "The state has one field, message. You invoke it with Nishtha. hello returns \"Hello \" plus that message. The printed result is a dictionary whose message is Hello Nishtha.",
    tryThis:
      "Read the function first. Then read only the two add_edge lines and say the path: start, hello, end. Then find the line that turns the drawing into something you can run. That line is compile.",
    functions: [
      {
        title: "The hello graph",
        why: "No model. One schema, one node, two edges, compile, invoke.",
        language: "python",
        code: `from langgraph.graph import StateGraph, START, END
from typing import TypedDict

class State(TypedDict):
    message: str

def hello(state: State):
    return {"message": "Hello " + state["message"]}

graph = StateGraph(State)
graph.add_node("hello", hello)
graph.add_edge(START, "hello")
graph.add_edge("hello", END)

app = graph.compile()
result = app.invoke({"message": "Nishtha"})
print(result)
# {"message": "Hello Nishtha"}`,
      },
    ],
    remember: "Remember it as: register the node, draw the edges, compile, then invoke.",
  },
  {
    slug: "state",
    part: "A graph with no model",
    title: "State",
    lead: "State is the most important concept. Every node can see it, and a return value updates it.",
    picture: `flowchart LR
      stateNode[question and answer] --> nodeA[Node A]
      stateNode --> nodeB[Node B]
      nodeA --> updated[Updated state]
      nodeB --> updated`,
    pictureCaption: "The same fields are on the table. A node writes an update back.",
    story:
      "A group project dies when the brief is a napkin that says everything. A shared notebook with named lines is kinder. The question has a line. The answer has a line. You can see who was allowed to write which one.",
    plain:
      "State is probably the most important concept in LangGraph. It is a schema, often a TypedDict. Once the graph is built on that schema, every node can access the state. A node receives the state, reads a field, and returns a dictionary. That returned dictionary updates the state. It does not have to send the whole object back. In a project, treat the field names as the contract between nodes. If a field is not on the schema, the next node is guessing.",
    example:
      "The schema has question and answer, both strings. A node prints state[\"question\"] and returns an answer, \"Some answer\". After that node, the question is still there. The answer field now holds the new string.",
    tryThis:
      "Write a two-field schema for a helper you want. Read it as if you were the next node. If you cannot tell what you are allowed to read, the names are still foggy.",
    functions: [
      {
        title: "A state every node can read",
        why: "Two fields. The node reads one and returns an update for the other.",
        language: "python",
        code: `from typing import TypedDict

class State(TypedDict):
    question: str
    answer: str

def node(state: State):
    print(state["question"])
    return {"answer": "Some answer"}`,
      },
    ],
    remember: "Remember it as: the node receives state, and the dictionary it returns is the update.",
  },
  {
    slug: "nodes",
    part: "A graph with no model",
    title: "One job per node",
    lead: "A node is a Python function. Give it one responsibility you can say out loud.",
    picture: `flowchart TD
      graphNode[Graph] --> understand[Understand the request]
      graphNode --> searchNode[Search]
      graphNode --> generate[Generate]
      generate --> validate[Validate]`,
    pictureCaption: "Understand, search, generate, validate. Four jobs, four nodes.",
    story:
      "One person can cook and also answer the door. At some point the soup burns because the conversation was interesting. A second person at the door saves the soup. A node that tries to be the whole kitchen will burn the soup the same way.",
    plain:
      "A node is simply a Python function. It might be called research, or call_llm, or search_database. A useful architecture is a graph whose nodes are understand the request, search for data, and generate an answer. Each node should generally have one clear responsibility. The bad version is one giant function that searches, hits a database, validates, calls the model, retries, formats, and logs. The better version splits those jobs, and validation sits where you can see it. Splitting makes debugging easier, testing easier, observability easier, retries easier, and reasoning about the graph easier. In a project, if you cannot name the job in one sentence, the function is still doing two jobs.",
    example:
      "\"Find three lines in the notes\" is a node. \"Write the email from those lines\" is a different node. One function that finds the lines and also writes the email will defend its own draft, because it did both jobs.",
    tryThis:
      "Take a helper you have sketched. Write the jobs as separate sentences. If two sentences are the same job with different nicknames, they are one node.",
    remember: "Remember it as: a node is a function with one job you can name.",
  },
  {
    slug: "a-line",
    part: "A graph with no model",
    title: "Nodes in a line",
    lead: "Start, step one, step two, step three, end. Each step sees the number the last step wrote.",
    picture: `flowchart LR
      startNode[Start] --> step1[step 1]
      step1 --> step2[step 2]
      step2 --> step3[step 3]
      step3 --> doneNode[End]`,
    pictureCaption: "5 becomes 6, then 12, then 22.",
    story:
      "A relay is won by the baton, not by three people sprinting in circles. Step one hands a number to step two. Step two hands a number to step three. If someone drops the baton and invents a new number, the finish line is a lie.",
    plain:
      "Sequential nodes are ordinary edges in order. The state is one integer, value. step_1 adds 1. step_2 multiplies by 2. step_3 adds 10. You register the three nodes, then you draw start to step_1, step_1 to step_2, step_2 to step_3, and step_3 to the end. compile and invoke with value 5. The walk is 5, then plus 1 makes 6, then times 2 makes 12, then plus 10 makes 22. Nothing here decides. The edge list is the order. In a project, a line is the right shape when every step really does wait on the previous number.",
    example:
      "You can say 6, 12, 22 before you run it. If the print is anything else, a node read the wrong field or returned a replacement instead of an update.",
    tryThis:
      "Cover the print. Start at 5 and do the three operations on paper. Uncover only after you have 22.",
    functions: [
      {
        title: "Three steps in a line",
        why: "Add, double, add ten. The edges are the whole design.",
        language: "python",
        code: `from langgraph.graph import StateGraph, START, END
from typing import TypedDict

class State(TypedDict):
    value: int

def step_1(state):
    return {"value": state["value"] + 1}

def step_2(state):
    return {"value": state["value"] * 2}

def step_3(state):
    return {"value": state["value"] + 10}

graph = StateGraph(State)
graph.add_node("step_1", step_1)
graph.add_node("step_2", step_2)
graph.add_node("step_3", step_3)
graph.add_edge(START, "step_1")
graph.add_edge("step_1", "step_2")
graph.add_edge("step_2", "step_3")
graph.add_edge("step_3", END)

app = graph.compile()
print(app.invoke({"value": 5}))`,
      },
    ],
    remember: "Remember it as: 5, then 6, then 12, then 22. The edges did the walking.",
  },
  {
    slug: "a-fork",
    part: "A graph with no model",
    title: "A decision",
    lead: "A router function returns a name. The graph follows that edge. It does not decide for you.",
    picture: `flowchart TD
      startNode[Start] --> analyze[Analyze]
      analyze --> choice{Is it valid?}
      choice -->|Yes| process[Process]
      choice -->|No| reject[Reject]
      process --> doneNode[End]
      reject --> doneNode`,
    pictureCaption: "Analyze, then a name, then process or reject, then the end.",
    story:
      "A receptionist can sound warm and still only be allowed to answer questions. They do not walk into the office and file your taxes. A router is that desk. It looks at one fact and says which door opens. The building does not guess the door.",
    plain:
      "Conditional edges are where LangGraph starts becoming interesting. After a node such as analyze, you write a routing function. It reads the state and returns a route name. add_conditional_edges takes the node you are leaving, the function, and a map from those names to nodes. Do not think LangGraph magically decides. Think: node, then router function, then a returned route name, then the graph follows the corresponding edge. If value is greater than 10, return \"process\". Otherwise return \"reject\". The same shape later is needs_search: return \"search\" or return \"answer\", and the map sends search to a tool and answer to the end. In the complete example the schema has value and result. analyze returns the state unchanged. process sets result to \"Processed successfully\". reject sets result to \"Rejected\". The route used in that complete example returns \"process\" when value is at least 10, and \"reject\" otherwise. Both process and reject have an edge to the end. You compile, then you invoke.",
    example:
      "Invoke with value 15 and an empty result. The route name is process, and the result becomes Processed successfully. Invoke with 3 and the name is reject, so the result is Rejected. If you had used the earlier snippet that checks value greater than 10, 10 itself would reject. The complete example uses greater than or equal to 10, so 10 would process. Read the comparison you actually wrote.",
    tryThis:
      "Cover the map. For 15, say the string the function returns. For 3, say the other string. Then check that those strings are the keys in the map.",
    functions: [
      {
        title: "The router, then the whole fork",
        why: "The small function is the decision. The graph below is that decision with nodes on both sides.",
        language: "python",
        code: `def route(state):
    if state["value"] > 10:
        return "process"
    return "reject"

graph.add_conditional_edges(
    "analyze",
    route,
    {"process": "process", "reject": "reject"},
)`,
      },
      {
        title: "A complete conditional graph",
        why: "Analyze does not change the state. The route name picks process or reject. Both end.",
        language: "python",
        code: `from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    value: int
    result: str

def analyze(state):
    return state

def process(state):
    return {"result": "Processed successfully"}

def reject(state):
    return {"result": "Rejected"}

def route(state):
    if state["value"] >= 10:
        return "process"
    return "reject"

graph = StateGraph(State)
graph.add_node("analyze", analyze)
graph.add_node("process", process)
graph.add_node("reject", reject)
graph.add_edge(START, "analyze")
graph.add_conditional_edges(
    "analyze",
    route,
    {"process": "process", "reject": "reject"},
)
graph.add_edge("process", END)
graph.add_edge("reject", END)

app = graph.compile()
print(app.invoke({"value": 15, "result": ""}))`,
      },
    ],
    remember: "Remember it as: your function returns the name. The map is the door that name opens.",
  },
  {
    slug: "a-loop",
    part: "A graph with no model",
    title: "A loop",
    lead: "An edge can point back. That is one of LangGraph's biggest strengths.",
    picture: `flowchart TD
      startNode[Start] --> generate[Generate]
      generate --> check[Check]
      check -->|Good| doneNode[End]
      check -->|Bad| improve[Improve]
      improve --> generate`,
    pictureCaption: "A good check ends. A bad check goes back to generate.",
    story:
      "You cook pasta by tasting, not by one guess at the start. Salt, taste, salt, taste. The loop is the tasting. A graph that only moves forward is a person who salts the pot and walks away. A graph that can return to generate is a person who tastes and tries again.",
    plain:
      "A graph can return to an earlier node. Generate, then check. Good goes to the end. Bad goes to improve, and improve goes back to generate. The small version you can run without a model is a counter. increment adds 1 to count. should_continue returns \"continue\" while count is under 5, and \"done\" otherwise. The continue edge points at increment. The done edge is the end. Start at 0 and the walk is 1, then 2, then 3, then 4, then 5, then the end. In a project, write the sentence that means done before you draw the arrow back. A loop with no done is a stove left on.",
    example:
      "Invoke with count 0. You should be willing to say the five visits before you look at the print. If it stops at 4, the comparison is wrong. If it never stops, the done name is not wired to the end.",
    tryThis:
      "On paper, draw generate, check, and the arrow back. Write the one sentence that is allowed to take the end door.",
    functions: [
      {
        title: "Count to five, then stop",
        why: "The continue name points at the same node. The done name points at the end.",
        language: "python",
        code: `from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    count: int

def increment(state):
    return {"count": state["count"] + 1}

def should_continue(state):
    if state["count"] < 5:
        return "continue"
    return "done"

graph = StateGraph(State)
graph.add_node("increment", increment)
graph.add_edge(START, "increment")
graph.add_conditional_edges(
    "increment",
    should_continue,
    {"continue": "increment", "done": END},
)

app = graph.compile()
print(app.invoke({"count": 0}))`,
      },
    ],
    remember: "Remember it as: a loop is a conditional edge that points backward, with a done that does not.",
  },
  {
    slug: "messages",
    part: "The model joins",
    title: "Messages",
    lead: "The conversation is a list: human, assistant, tool, assistant.",
    picture: `flowchart TD
      human[Human message] --> ai[Assistant message]
      ai --> toolMsg[Tool message]
      toolMsg --> ai2[Assistant message again]`,
    pictureCaption: "Each turn is another line on the same list.",
    story:
      "A brilliant coworker still needs the thread in front of them. You do not shout a new question down the hall and hope they remember the tool result. You hand them the page: what you said, what they said, what the tool said. They write the next line on that page.",
    plain:
      "For conversational and agent applications, LangGraph provides MessagesState. You can subclass it and pass, or you can use MessagesState itself as the graph state. The important idea is the messages list. It holds a human message, an assistant message, a tool message, another assistant message, and so on. That list is extremely useful for agent workflows, because the model does not remember a tool result by magic. The result is a message sitting in state. When you introduce LangChain here, you import ChatOpenAI and create the model. One note in the original set uses model=\"gpt-4.1-mini\" at this moment. The full graph on the next card uses gpt-4o-mini. Keep the name you actually deployed, and do not treat the two strings as the same bill.",
    example:
      "The user asks a question. That is a human message. The model replies. That is an assistant message. If the reply asked for a tool, the tool result is a tool message. The next assistant message is allowed to mention 84 because 84 is on the list.",
    tryThis:
      "Write four labels in a column: human, assistant, tool, assistant. Point at which line a later node is allowed to trust. All of them, if they are still on the list.",
    functions: [
      {
        title: "The model, before it is a node",
        why: "This is only the import and the object. The graph comes next.",
        language: "python",
        code: `from langchain_openai import ChatOpenAI
from langgraph.graph import MessagesState

llm = ChatOpenAI(model="gpt-4.1-mini")

class State(MessagesState):
    pass`,
      },
    ],
    remember: "Remember it as: messages are the tape. The model reads the tape.",
  },
  {
    slug: "a-model-node",
    part: "The model joins",
    title: "A model node",
    lead: "Same edges as hello. The node calls a model and appends one reply.",
    picture: `flowchart LR
      userNode[User] --> messages[MessagesState]
      messages --> modelNode[Model node]
      modelNode --> reply[Assistant message]
      reply --> doneNode[End]`,
    pictureCaption: "You, the message list, the model node, one reply, the end.",
    story:
      "You pass a coworker a single sheet and ask for bullets a new hire could follow. They write on that sheet. They do not open a second notebook and lose the question. The return value is one new message, added to the list you already handed over.",
    plain:
      "Load the key with find_dotenv and load_dotenv, walking up from the file until the project .env is found. The model in this full example is gpt-4o-mini. call_model takes MessagesState, invokes the model on state[\"messages\"], and returns {\"messages\": [response]}. The graph is StateGraph(MessagesState), one node named model, an edge from start to model, and an edge from model to the end. compile, invoke with one user message, and print the content of the last message. The user message in the notes asks for workplace rules to follow as an SDE-2 engineer, in bullet points. In a project, this node is the voice. The edges are still yours.",
    example:
      "You invoke with that one user message. The state holds it. The model node appends an assistant message. result[\"messages\"][-1].content is the bullets. If the list had been replaced instead of appended, the user message would be gone and you would be printing a conversation that forgot the question.",
    tryThis:
      "Point at the return. It is a list of one message. Say what would be wrong if the node returned the whole history rewritten from scratch.",
    functions: [
      {
        title: "A graph whose only node is the model",
        why: "Hello, with a chat model in the node. The prompt is the one from the notes.",
        language: "python",
        code: `from dotenv import find_dotenv, load_dotenv
from langgraph.graph import StateGraph, START, END, MessagesState
from langchain_openai import ChatOpenAI

load_dotenv(find_dotenv())
llm = ChatOpenAI(model="gpt-4o-mini")

def call_model(state: MessagesState):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

graph = StateGraph(MessagesState)
graph.add_node("model", call_model)
graph.add_edge(START, "model")
graph.add_edge("model", END)

app = graph.compile()
result = app.invoke({
    "messages": [{
        "role": "user",
        "content": "Tell all workplace rules to follow as a SDE 2 Engineer in bullet points.",
    }]
})
print(result["messages"][-1].content)`,
      },
    ],
    remember: "Remember it as: the model appends one message. The path is still start, node, end.",
  },
  {
    slug: "tools",
    part: "The model joins",
    title: "Tools",
    lead: "Bind a tool so the model can ask. ToolNode is what runs the ask.",
    picture: `flowchart LR
      assistant[Assistant message] --> calls{A tool call?}
      calls -->|Yes| toolNode[ToolNode]
      toolNode --> toolMsg[Tool message]`,
    pictureCaption: "The model requests. ToolNode executes. The result is a tool message.",
    story:
      "You do not ask a friend to multiply 12 by 7 and also demand they build the calculator. You leave a calculator on the desk with a label. They may pick it up. Something else presses the buttons and puts the slip of paper back on the desk.",
    plain:
      "This is the agent pattern. The user reaches a model node. That node asks whether a tool is required. Yes goes to the tool, then back toward an answer. No goes to the end. A tool is a function decorated with @tool, with a docstring the model can read. multiply takes two integers and returns their product. llm.bind_tools([multiply]) gives the model that menu, so the model can request the tool. LangGraph provides ToolNode. ToolNode([multiply]) is a node that executes tool calls requested by the model. Conceptually the assistant message contains a tool call, ToolNode runs it, and a tool message comes back. In a normal agent workflow you do not write tool.invoke yourself for every call. The node does that. Binding lets the model ask. ToolNode does the work.",
    example:
      "The model sees multiply on the menu. It does not return 84 by itself. It returns a tool call. ToolNode runs multiply and writes the tool message. The number exists because the function ran, not because the model sounded sure.",
    tryThis:
      "Say the two different moments out loud. Binding is the menu. ToolNode is the pair of hands. If you merge them, you will debug the wrong one.",
    functions: [
      {
        title: "A tool, the menu, and the node that runs it",
        why: "Three lines of idea. The loop that uses them is the next card.",
        language: "python",
        code: `from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode

@tool
def multiply(a: int, b: int) -> int:
    """Multiply two numbers."""
    return a * b

llm_with_tools = llm.bind_tools([multiply])
tool_node = ToolNode([multiply])`,
      },
    ],
    remember: "Remember it as: the model requests the tool. ToolNode writes the tool message.",
  },
  {
    slug: "the-agent-loop",
    part: "The model joins",
    title: "The agent loop",
    lead: "Agent, maybe tools, then agent again, until the model answers in words.",
    picture: `flowchart TD
      startNode[Start] --> agent[Agent]
      agent --> choice{Tool call or answer?}
      choice -->|Tool| tools[Tools]
      tools --> agent
      choice -->|Answer| doneNode[End]`,
    pictureCaption: "Tools always return to the agent. An answer ends the run.",
    story:
      "You ask what 12 times 7 is. A friend who wants to look careful picks up a calculator, reads 84, and then tells you 84. The friend is not the calculator. The friend decided to use it, read the slip, and spoke. If you call the calculator the friend, you will be surprised when it cannot explain the number.",
    plain:
      "The architecture is start, then the agent, then a split. A tool call goes to tools, and tools go back to the agent, which may call tools again. An answer goes to the end. That loop is the heart of many LangGraph agents. A common beginner mistake is to say the model is the agent. Not necessarily. The agent holds the model, the state, the tools, the routing, the memory, and the control loop. The model is one component inside the agent. In the runnable graph, the model is gpt-4.1-mini with multiply bound. call_model invokes it and returns the new message. should_continue looks at the last message. If it has tool_calls, return \"tools\". Otherwise return END. The tools node is a ToolNode of multiply. Edges: start to agent, conditional edges from agent, and tools back to agent. compile, invoke with the question, print the last message content.",
    example:
      "The user says: what is 12 multiplied by 7? The agent runs. The model decides it needs the multiply tool. ToolNode runs multiply(12, 7). The tool message is 84. The agent runs again. The model sees 84 and answers 84. There is no further tool call, so the run ends. That walk is the core mental model to master.",
    tryThis:
      "Tell the walk without the code: ask, tool, 84, answer, stop. If you skip the second visit to the agent, you skipped the reason the edge points backward.",
    functions: [
      {
        title: "A tool-calling agent",
        why: "The menu, the router, and the edge from tools back to the agent. This is the loop.",
        language: "python",
        code: `from langgraph.graph import StateGraph, START, END, MessagesState
from langgraph.prebuilt import ToolNode
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

@tool
def multiply(a: int, b: int) -> int:
    """Multiply two numbers."""
    return a * b

llm = ChatOpenAI(model="gpt-4.1-mini").bind_tools([multiply])

def call_model(state: MessagesState):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

def should_continue(state):
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tools"
    return END

tools = ToolNode([multiply])
graph = StateGraph(MessagesState)
graph.add_node("agent", call_model)
graph.add_node("tools", tools)
graph.add_edge(START, "agent")
graph.add_conditional_edges(
    "agent",
    should_continue,
    {"tools": "tools", END: END},
)
graph.add_edge("tools", "agent")

app = graph.compile()
result = app.invoke({
    "messages": [{"role": "user", "content": "What is 12 multiplied by 7?"}]
})
print(result["messages"][-1].content)`,
      },
    ],
    remember: "Remember it as: the model asks, the tool answers, the model speaks. The model is not the whole agent.",
  },
  {
    slug: "reducers",
    part: "State you share",
    title: "Reducers",
    lead: "A reducer decides whether a new list replaces the old one or gets added on.",
    picture: `flowchart LR
      oldList["messages A, B"] --> node[Node returns C]
      node --> added["messages A, B, C"]`,
    pictureCaption: "Append keeps A and B. Replace would have left only C.",
    story:
      "Two people share a shopping list on the fridge. One writes milk at the bottom. The other takes the paper down and puts up a new paper that only says eggs. The milk is gone. They thought a new list was the update. A reducer is the rule that would have stopped them.",
    plain:
      "This is an SDE-level idea. Suppose messages is a list and more than one node wants to update it. Should the new list replace the old list, or should it append? A reducer determines how updates are combined. For message state, LangGraph already has message-specific handling, which is why returning [response] keeps the earlier turns. Without the right reducer you can accidentally overwrite state. You can declare the rule yourself. Annotate a list with operator.add. Existing numbers are 1 and 2. The node returns 3. The reducer is addition. The result is 1, 2, and 3. That pattern matters whenever several steps contribute to the same list.",
    example:
      "Old messages are A and B. The node returns C. With the message reducer, the new state is A, B, and C. With replacement, the new state is only C, and the next node answers a question it can no longer see. The bug looks like a forgetful model. The page was swapped.",
    tryThis:
      "Pick one list you would put on a state. Say replace or append before you write the node. Write that word next to the field.",
    functions: [
      {
        title: "A list that adds",
        why: "operator.add is the reducer. The node contributes a piece. It does not own the whole list.",
        language: "python",
        code: `from typing import Annotated, TypedDict
import operator

class State(TypedDict):
    numbers: Annotated[list[int], operator.add]

# Existing: [1, 2]
# Node returns: [3]
# Result: [1, 2, 3]`,
      },
    ],
    remember: "Remember it as: say how updates combine, or a later node will wipe the page.",
  },
  {
    slug: "shape-the-state",
    part: "State you share",
    title: "A state you can trust",
    lead: "Name the fields. A blob called everything is not a contract.",
    picture: `flowchart LR
      nodeA[Node A writes] --> contract[The fields]
      contract --> nodeB[Node B reads]`,
    pictureCaption: "Node A updates the contract. Node B consumes it.",
    story:
      "A recipe card on the fridge beats a story you retell differently every Sunday. The card is a bit boring. Dinner happens. A state schema is that card. If the card says 'stuff', Sunday is a negotiation.",
    plain:
      "For SDE-2 work, do not make the state enormous. The bad shape is one field, everything, typed as a dict. Prefer an explicit state: user_query as a string, documents as a list, answer as a string, confidence as a float. Think of state as the contract between nodes. Node A updates it. Node B consumes it. You already saw why the jobs should be split. The contract is what makes the split safe. A node named generate is allowed to read documents because the schema says documents exist. It is not allowed to rummage through a junk drawer.",
    example:
      "A retrieval node writes documents. A generate node reads documents and writes answer and confidence. If generate reaches into everything[\"maybe_docs\"], you no longer have a contract. You have a hope.",
    tryThis:
      "Write the four fields from this card on paper: user_query, documents, answer, confidence. Cross out any you cannot explain to a teammate in one sentence.",
    remember: "Remember it as: state is a contract. Name the fields a node is allowed to touch.",
  },
  {
    slug: "parallel",
    part: "Running it for real",
    title: "Side by side",
    lead: "Work that does not depend on itself can fan out, then join.",
    picture: `flowchart TD
      startNode[Start] --> fan[Split]
      fan --> aNode[Search A]
      fan --> bNode[Search B]
      fan --> cNode[Search C]
      aNode --> combine[Combine]
      bNode --> combine
      cNode --> combine
      combine --> doneNode[End]`,
    pictureCaption: "Three searches that do not need each other, then one combine.",
    story:
      "You can send three people to three shops at the same time when none of them needs what the others bought. You do not send the third person only after the first two have returned, unless the third errand really depends on the bags. Waiting in a line for independent errands is how a Saturday disappears.",
    plain:
      "LangGraph can model workflows where multiple nodes operate independently. Start splits into search A, search B, and search C, and those three join at combine, then the end. That is useful when the tasks do not depend on one another. A research shape is search the web, search the docs, and search the database, then synthesize. Sequential A then B then C at three seconds each is nine seconds. Parallel is about the max of those three, plus the combine. If each search is three seconds and combine is three, that is about six seconds. Actual performance depends on your implementation and on the external services, but the architectural idea matters. In a project, only fan out the steps that can be wrong alone without poisoning the others.",
    example:
      "A question needs the public web, your handbook, and a database row. None of those lookups needs the other two to start. Combine is the first node that is allowed to see all three. If you line them up, you paid for waiting.",
    tryThis:
      "List three lookups in a job you have. Circle the ones that can start together. If you circled none, a line is honest.",
    remember: "Remember it as: independent work fans out. The join is a node that can see all of it.",
  },
  {
    slug: "fan-out",
    part: "Running it for real",
    title: "Send, then reduce",
    lead: "When you do not know how many items you have yet, you create the work at runtime.",
    picture: `flowchart TD
      inputNode[Input] --> split[Split items]
      split --> itemA[Item A]
      split --> itemB[Item B]
      split --> itemC[Item C]
      itemA --> reduce[Reduce]
      itemB --> reduce
      itemC --> reduce
      reduce --> output[Output]`,
    pictureCaption: "Map each item. Reduce the results into one output.",
    story:
      "You would not hire three clerks before you know whether the stack is three pages or a hundred. You look at the stack, then you hand out a page per person, then you staple what they return. The hand-out is the map. The staple is the reduce.",
    plain:
      "Send is how you dynamically create work. Get the documents, then fan out to process A, process B, and process C, then merge. If the list is only known at runtime, documents might be A through F, or a hundred files, and you fan out processing for however many there are. That is useful for document processing, batch analysis, parallel research, and map/reduce patterns. The map-reduce picture is input, split items, each item becomes a result, the results join at reduce, then output. A common case is 100 documents, process each, 100 summaries, synthesize, final report. Do not draw a fixed node per document in the source if the count changes every request. Create the work from the list.",
    example:
      "A folder arrives with a number of PDFs you will not know until the request. Split them. Summarize each. Reduce the summaries into one report. The report node is the first place that should see every summary.",
    tryThis:
      "Write the split sentence and the reduce sentence for one batch you care about. If you cannot say what the reduce is allowed to ignore, the fan-out is not designed yet.",
    remember: "Remember it as: map the items you actually have. Reduce when every result is back.",
  },
  {
    slug: "a-person",
    part: "Running it for real",
    title: "A person approves",
    lead: "The workflow pauses. Asking the model if it is sure is a different thing.",
    picture: `flowchart TD
      agent[Agent] --> danger[A dangerous action]
      danger --> person[A person reviews]
      person --> choice{Approve?}
      choice -->|Yes| toolNode[Tool]
      choice -->|No| stopNode[Stop]
      toolNode --> doneNode[End]`,
    pictureCaption: "Propose, wait, then the tool. A confident model is not approval.",
    story:
      "You would not let a house guest delete your photos because they sounded sure. You would leave the request on the table. When you come back, the request is still the request, and your yes or no is what moves it. The guest does not get to narrate your permission.",
    plain:
      "Human-in-the-loop is one of LangGraph's important production capabilities. Imagine an agent wants to delete database records. You do not want model, then tool, then delete. You want model, then a proposed action, then human approval, then the tool, then the result. interrupt, imported from langgraph.types, is how a node pauses. approval_node calls interrupt with the question \"Approve this action?\" and returns the decision as approved. The graph pauses. Later, execution can be resumed with the human's response. That is fundamentally different from asking the model \"are you sure?\". The workflow itself pauses. In a project, write the sentence the person will read before you wire the tool.",
    example:
      "The proposed action is delete these rows. The node interrupts. Nothing is deleted while the run is paused. A yes resumes into the tool. A no takes the stop edge. The model does not get a vote after the person has answered.",
    tryThis:
      "Write the approval sentence for one tool that changes the world. If the sentence is vague, the tool is not ready to sit behind interrupt.",
    functions: [
      {
        title: "A node that waits",
        why: "interrupt pauses the graph. The return value is the person's decision, stored on the state.",
        language: "python",
        code: `from langgraph.types import interrupt

def approval_node(state):
    decision = interrupt("Approve this action?")
    return {"approved": decision}`,
      },
    ],
    remember: "Remember it as: the run pauses. The model being sure is not a yes.",
  },
  {
    slug: "checkpoints",
    part: "Running it for real",
    title: "Checkpoints and threads",
    lead: "Save the state after steps, under a thread id, so a crash or a pause can resume.",
    picture: `flowchart LR
      nodeA[Node A] --> saveA[Checkpoint]
      saveA --> nodeB[Node B]
      nodeB --> saveB[Checkpoint]
      saveB --> resume[Resume at the next node]`,
    pictureCaption: "If the process dies after B, you continue. You do not restart from A.",
    story:
      "A form left on a desk is still the same form in the morning. You do not ask the visitor to retell their name because the office closed. The form has a name on it, and a pile, so Wednesday's forms do not mix with Thursday's.",
    plain:
      "Suppose the agent is executing node A, then B, then C, and the server crashes after B. Without persistence the process dies, the state is lost, and you restart from the beginning. With checkpointing, A is saved, B is saved, and after the crash you resume at C. Checkpointing enables resumable workflows, long-running agents, human approval, conversation state, fault recovery, debugging, and durable execution. The picture is graph execution, then state changes, then a checkpoint, then persistent storage. Persistent applications need a way to distinguish executions. Think of thread_id as \"user-123-conversation-456\". Thread A has its own state, messages, and checkpoints. Thread B has its own. That matters as soon as more than one person uses the app. For local experimentation you may use InMemorySaver from langgraph.checkpoint.memory. compile the graph with checkpointer=checkpointer. Invoke with a config whose configurable.thread_id is \"user-123\". The thread id selects the checkpoint namespace, which selects the stored graph state. For production, use a persistent checkpointer or backend. Do not rely on in-memory storage once the process is allowed to die.",
    example:
      "Two users approve two different deletes. Same graph, two thread ids. User 123 resumes onto their own proposed action. They do not approve user 456's rows. If you forget the thread id, the desk has one pile.",
    tryThis:
      "Write one thread id you would use for yourself in one conversation. It should name the person and the conversation, not the word default.",
    functions: [
      {
        title: "An in-memory checkpointer",
        why: "Fine on your laptop. The thread id is the part to keep when you swap in a real store.",
        language: "python",
        code: `from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()
app = graph.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "user-123"}}
result = app.invoke(input_data, config=config)`,
      },
    ],
    remember: "Remember it as: a checkpoint is where the run stopped. A thread id is whose run it is.",
  },
  {
    slug: "memory-and-streaming",
    part: "Running it for real",
    title: "Memory, streaming, and the picture",
    lead: "This run is a checkpoint. A later day is a different store. Streaming lets you watch the run.",
    picture: `flowchart LR
      request[Request] --> token1[A piece]
      token1 --> token2[Another piece]
      token2 --> complete[Complete]`,
    pictureCaption: "The person sees the answer arrive, instead of a bar and then everything.",
    story:
      "A cook who tastes out loud lets you stop them when the soup is already too salty. A cook who hides in the pantry and presents a finished bowl makes you argue with the bowl. Streaming is tasting out loud. A preference you still know next month is a note on the fridge, not the pot you are stirring tonight.",
    plain:
      "Do not confuse short-term and long-term memory. Short-term memory is the state and checkpoints for an execution or a conversation: conversation, then state, then checkpoint. Long-term memory is information you intentionally kept beyond that workflow or session: a user, then a preference or profile, then a memory store, then future conversations. LangGraph is especially concerned with stateful workflow execution. Your long-term memory architecture is a separate design decision. Streaming matters because people do not always want to wait for a complete answer after a long bar. They want tokens, or events, as the graph progresses. LangGraph can stream execution so you observe outputs and events while it runs. for chunk in app.stream(input_data) prints those chunks. The stream mode you choose depends on whether you want state updates, messages, or other execution information. One of the nicest development features is seeing the graph. app.get_graph() then draw_mermaid() gives a Mermaid picture. Use it to inspect start, agent, the tools question, the tool, the end, and the edge back to the agent. That picture is extremely useful once the graph is hard to hold in your head.",
    example:
      "Tonight's messages and the checkpoint for thread user-123 are short-term. \"This person likes short bullets\" saved for next month is long-term, and it does not appear just because you checkpointed tonight. A stream of chunks is how the screen shows the bullets before the run has fully ended.",
    tryThis:
      "Point at one fact in a product and say short-term or long-term. If it must survive a new thread id, it is long-term, and a checkpoint will not hold it for you.",
    functions: [
      {
        title: "Watch the run, and print the graph",
        why: "stream is the live view. draw_mermaid is the map you check when a branch surprises you.",
        language: "python",
        code: `for chunk in app.stream(input_data):
    print(chunk)

graph = app.get_graph()
print(graph.draw_mermaid())`,
      },
    ],
    remember: "Remember it as: a checkpoint is this run. A preference for later is a store you design. Streaming is how you watch.",
  },
  {
    slug: "subgraphs",
    part: "Larger systems",
    title: "Subgraphs",
    lead: "Hide a section that has earned its own name. Do not hide every pair of nodes.",
    picture: `flowchart TD
      main[Main graph] --> research[Research graph]
      main --> planning[Planning graph]
      main --> execution[Execution graph]`,
    pictureCaption: "Three sections, each a graph, inside one main graph.",
    story:
      "A kitchen can have a pastry corner without becoming three restaurants. The corner has its own steps. The head cook still runs the night. A subgraph is that corner. If you build a corner for boiling water, you have only added doors.",
    plain:
      "As the application grows, one giant graph becomes ugly. A main graph can hold a retrieval graph, a planning graph, and an execution graph. A subgraph is a graph used as a component inside another graph. That lets you organize larger systems. A main agent might contain a research subgraph whose steps are search, filter, and summarize, and an execution subgraph whose steps are validate, execute, and verify. Use a subgraph when a section has enough complexity to deserve its own abstraction. Do not create subgraphs for every two-node workflow. In a project, the test is whether you can name the section the way you would name a module. If the name is \"stuff the agent does\", it is not a subgraph yet.",
    example:
      "Search, filter, and summarize are a research section. Validate, execute, and verify are an execution section. Hello-then-end is not a section. It is two nodes, and it can live in the parent.",
    tryThis:
      "Look at a graph you have sketched. If a cluster has a name and at least a small path inside it, it may be a subgraph. If it is two boxes, leave it inline.",
    remember: "Remember it as: a subgraph is a named section. Two nodes are still just two nodes.",
  },
  {
    slug: "command",
    part: "Larger systems",
    title: "Command",
    lead: "A node can update the state and say where to go, in one return.",
    picture: `flowchart LR
      node[A node] --> update[Update the state]
      node --> goto[Name the next node]`,
    pictureCaption: "One return. A state change and a destination.",
    story:
      "A coworker can update the shared notebook and also point at the next person, instead of updating the notebook and waiting for a separate receptionist to read their mind. Command is that coworker. The update and the pointing happen together.",
    plain:
      "Command lets a node combine a state update and a routing decision. The longer shape is node, then state update, then a router, then the next node. With Command, the node updates state and tells the graph where to go. If state[\"approved\"] is true, return Command with update status approved and goto execute. Otherwise return Command with update status rejected and goto end. This becomes particularly useful for sophisticated routing, when the destination is part of the node's own result rather than a separate function that re-reads the state. You still need the destination to be a real node. Command does not invent a room that you forgot to build.",
    example:
      "The approval bit is already on the state when this node runs. True means status becomes approved and the next node is execute. False means status becomes rejected and the next name is end. One return did both jobs.",
    tryThis:
      "Find one node in a sketch where the update and the next step are the same decision. That node is a candidate for Command. A node that only writes a field can stay a normal return.",
    functions: [
      {
        title: "Update and go",
        why: "approved picks execute. Anything else picks end. The status is written either way.",
        language: "python",
        code: `from langgraph.types import Command

def node(state):
    if state["approved"]:
        return Command(update={"status": "approved"}, goto="execute")
    return Command(update={"status": "rejected"}, goto="end")`,
      },
    ],
    remember: "Remember it as: Command is a state update and a destination in one return.",
  },
  {
    slug: "when-it-fails",
    part: "Larger systems",
    title: "Retries and errors",
    lead: "Retry the call that flakes. Handle an empty result on purpose. Fail clearly on a bug.",
    picture: `flowchart TD
      toolNode[Tool] --> failed{Failure?}
      failed -->|No| goOn[Continue]
      failed -->|Yes| retry[Retry]
      retry --> still{Still failing?}
      still -->|No| goOn
      still -->|Yes| fallback[Fallback]`,
    pictureCaption: "A retry wraps the flaky call. The whole workflow is not the thing you blindly rerun.",
    story:
      "If the shop is closed for ten minutes, you wait and knock again. You do not rebuild the house because the door was stuck. And if you wrote the address wrong, knocking again will not invent the right street. Different failures want different manners.",
    plain:
      "Real systems fail. A tool might see an API timeout, a rate limit, a database that is unavailable, or a network failure. Do not make the entire agent fail for a blip, and do not wrap the entire workflow in a blind retry. The shape is: tool, then failure or not. No means continue. Yes means retry. If it still fails, fallback. If the retry works, continue. LangGraph has mechanisms for retry and error handling around node execution. The principle is that retries belong around operations that can transiently fail, not blindly around the entire workflow. Separate three kinds of error. Expected errors are invalid user input, a tool that returns no result, and a search that returns empty. Handle those explicitly, as branches. Transient errors are a timeout, a rate limit, and a temporary network failure. Retry those where it is appropriate. Fatal errors are an invalid configuration, a broken schema, and a programming bug. Fail clearly.",
    example:
      "A search that returns no pages is expected. The graph should take the branch that says so. A timeout on that same search is transient, so the node may try again. A state field you misspelled is fatal. Retrying it will misspell it again.",
    tryThis:
      "Take one tool. Write one expected failure, one transient failure, and one fatal failure. Only the middle one gets a retry.",
    remember: "Remember it as: retry the blip, branch on the empty result, fail loud on a bug.",
  },
  {
    slug: "the-shape-of-an-agent",
    part: "Larger systems",
    title: "The shape of an agent",
    lead: "A person, an agent, a router, a few tools, then a decision to continue or finish.",
    picture: `flowchart TD
      userNode[User] --> agent[Agent]
      agent --> router[Router]
      router --> searchNode[Search]
      router --> db[Database]
      router --> api[API]
      searchNode --> observe[Observe]
      db --> observe
      api --> observe
      observe --> decide{Continue or done?}
      decide -->|Continue| agent
      decide -->|Done| doneNode[End]`,
    pictureCaption: "State exists across the whole picture, not only inside one tool.",
    story:
      "A front desk that can only talk will send every guest to the same hallway. A desk that can send you to search, to the database, or to an API, and then look at what came back, is an office. The guest should not have to know which hallway. The desk should.",
    plain:
      "A production-oriented agent often looks like this. The user reaches an agent. The agent reaches a router. The router can go to search, a database, or an API. Those results join at observe. Decide either continues, back into the agent, or is done and ends. State exists across the entire workflow, which is why observe can see what the tool just did and the agent can see it on the next pass. This is the same loop you already ran with multiply, drawn with the tools a real product actually has. In a project, draw this before you pick a framework feature. If you cannot point at observe, you will debug the model for a tool that returned nothing.",
    example:
      "A billing question might go to the database. A policy question might go to search. An external status might go to an API. Observe is where you notice an empty result before decide sends the agent around again or lets it answer.",
    tryThis:
      "Sketch your tools as the three boxes. If you only have one box, you still have this picture. The router has one door, and that is fine.",
    remember: "Remember it as: route, observe, then continue or finish. The state is still there.",
  },
  {
    slug: "rag",
    part: "Larger systems",
    title: "RAG that can try again",
    lead: "Retrieve, look at the pages, and rewrite the question if the pages are weak.",
    picture: `flowchart TD
      question[Question] --> retrieve[Retrieve]
      retrieve --> useful{Context useful?}
      useful -->|Yes| generate[Generate]
      useful -->|No| rewrite[Rewrite the query]
      rewrite --> retrieve
      generate --> doneNode[End]`,
    pictureCaption: "Good pages become the answer. Weak pages go back for another search.",
    story:
      "An open-book test still fails if you opened the wrong page. A careful student notices, changes the question they are searching under, and opens a better page. A careless student writes a confident paragraph from the parking policy. The graph is the careful student.",
    plain:
      "You already know RAG. Think of LangGraph as the orchestration. Traditional RAG is question, retrieve, context, model, answer. LangGraph RAG can analyze, retrieve, and evaluate the context. Good context goes to generate. Bad context rewrites the query, retrieves again, and evaluates again. Now RAG is an iterative workflow. The self-correcting picture is question, retrieve, then context useful or not. Yes generates and ends. No rewrites the query and the edge goes back to retrieve. This is exactly where graph-based orchestration becomes valuable. In a project, the evaluate node should be allowed to say the pages are wrong. If it can only say they are fine, you have drawn a line and called it a loop.",
    example:
      "The question is about a refund. Retrieve returns the parking page because both mention Friday. Evaluate says the context is bad. Rewrite asks for the refund rule. Retrieve returns the refund page. Generate answers from that page and ends.",
    tryThis:
      "Write the sentence the evaluate node uses to call a page bad. If the sentence is 'the model felt unsure', you have not designed the check.",
    remember: "Remember it as: weak pages go back. Good pages are the only ones allowed to become the answer.",
  },
  {
    slug: "a-team",
    part: "Larger systems",
    title: "More than one agent",
    lead: "Learn one loop first. A supervisor is a node that picks a worker with a different job.",
    picture: `flowchart TD
      supervisor[Supervisor] --> research[Research]
      supervisor --> code[Code]
      supervisor --> review[Review]
      research --> supervisor
      code --> supervisor
      review --> supervisor
      supervisor --> doneNode[End]`,
    pictureCaption: "The supervisor asks who should work, hears them, and may ask again.",
    story:
      "Two people moving a couch sometimes lift the same end. The couch gets stuck in the doorway. A second person is worth it when they hold the other end, or when they stand at the door so the soup does not burn. A second person who copies you is a slower mess.",
    plain:
      "Do not immediately build multi-agent systems. First understand a single graph, the agent loop, state, tools, routing, and persistence. Then a supervisor can sit over workers. Research, code, and review report back, and a finalizer can sit at the end. LangGraph is particularly useful for orchestrating that. The supervisor pattern is a node that decides who should work. Research, coding, and review each do their job and return to the supervisor, which may end. The supervisor itself can be a LangGraph node. How it chooses is an engineering decision. Deterministic routing is code: if state[\"type\"] is billing, return billing. It is predictable, cheap, and testable. LLM routing lets the model decide, for example \"research\". It is flexible and can handle an ambiguous request. The best systems often combine them: deterministic constraints, plus model reasoning, plus explicit graph control. A second agent still needs a second job. If two workers share the same instruction, you have one worker with a nickname.",
    example:
      "A billing question hits the deterministic billing node, because money should not depend on a mood. A fuzzy \"figure out why the customer is unhappy\" may let the model choose research. The graph still owns the doors. The model only returns a name you already mapped.",
    tryThis:
      "Name two workers. Write the do-not for each. If the do-nots match, delete one worker.",
    remember: "Remember it as: one solid loop first. A supervisor picks a different job, not a copy.",
  },
  {
    slug: "when-to-use-it",
    part: "How you work",
    title: "When to use it",
    lead: "Use a graph when the path can change. A single call does not need one.",
    picture: `flowchart LR
      line[A then B then C] --> choice{Does the path change?}
      choice -->|Yes| graphNode[A graph]
      choice -->|No| leave[Leave it as a line]`,
    pictureCaption: "A chain is a line. A graph can branch, loop, and come back.",
    story:
      "You do not hire a moving truck to carry a book. You also do not carry a sofa on a bicycle and then blame the bicycle. The truck is for the sofa. The graph is for a path that forks, loops, or waits.",
    plain:
      "LangGraph is not just another agent framework. The distinction is control over execution. A traditional chain is A, then B, then C. A graph can go from A to B to C, and also from A to D, and D can lead back. You get explicit control over the topology. That is the architectural value. Use it when you have multiple steps, a branch, a loop, stateful execution where state goes to a node and back to state, human approval where the agent goes to a person and back, a long-running workflow that starts and resumes hours later, or multiple agents where a supervisor goes to workers. Do not create a graph for user, then model, then answer. That is unnecessary. Question, then retriever, then model does not automatically need LangGraph either. Start when workflow control becomes meaningful. The sentence to carry: LangChain gives you the building blocks. LangGraph gives you control over how those building blocks execute.",
    example:
      "A chatbot that only drafts is a line, and a line is enough. The same draft plus a tool, a check, and your approval is a graph, because the path is no longer one slide. A RAG pipeline that never rewrites a bad query is still a line, even if the line has a retriever in the middle.",
    tryThis:
      "Look at one thing you might build this month. If you can draw it as A then B then C with no arrow back and no person, leave it as a line.",
    remember: "Remember it as: LangChain is the blocks. LangGraph is control over the run.",
  },
  {
    slug: "how-the-files-sit",
    part: "How you work",
    title: "How the files sit",
    lead: "Split the files when the graph grows. A toy can live in one file.",
    picture: `flowchart TD
      appNode[app] --> graphFile[graph]
      appNode --> stateFile[state]
      appNode --> nodes[nodes]
      appNode --> routing[routing]`,
    pictureCaption: "State, nodes, and routing are files once they are no longer a sketch.",
    story:
      "A recipe for Tuesday can live on one card. A restaurant that serves Tuesday through Sunday needs a drawer for sauces and a drawer for the tickets. You do not build the drawer system before you have cooked Tuesday.",
    plain:
      "For an SDE-2 project, a calm layout is a folder my-agent. Inside it, app holds graph.py, state.py, a nodes folder, a routing folder, and config.py. nodes can hold agent.py, tools.py, retrieval.py, and validation.py. routing holds router.py. tests sits beside app, with test_nodes.py, test_routing.py, and test_graph.py. The root has .env, requirements.txt, and a README. Do not start with this structure for a toy example. Introduce it when the graph actually grows. The hello graph does not need a nodes package. The agent with a router, a retriever, and a validator does.",
    example:
      "You are still on hello. One file is the honest home. You add a tool and a router and the file becomes a scroll. That is the day state.py and router.py earn a path.",
    tryThis:
      "If your current file is still something you can read in one sitting, leave it. Write the folder list on paper and do not create it yet.",
    functions: [
      {
        title: "A layout for when it grows",
        why: "This is a map, not a requirement for the first afternoon.",
        language: "text",
        code: `my-agent/
├── app/
│   ├── graph.py
│   ├── state.py
│   ├── nodes/
│   │   ├── agent.py
│   │   ├── tools.py
│   │   ├── retrieval.py
│   │   └── validation.py
│   ├── routing/
│   │   └── router.py
│   └── config.py
├── tests/
│   ├── test_nodes.py
│   ├── test_routing.py
│   └── test_graph.py
├── .env
├── requirements.txt
└── README.md`,
      },
    ],
    remember: "Remember it as: one file while it is a toy. Split state, nodes, and routing when it grows.",
  },
  {
    slug: "tests",
    part: "How you work",
    title: "Tests",
    lead: "Test the node, test the graph, and test the failure you promised to handle.",
    picture: `flowchart LR
      input[Input state] --> node[Node]
      node --> expected[Expected state]`,
    pictureCaption: "A node test is a state in and a state out. No model required.",
    story:
      "You taste the sauce before you serve the table. You also check that the fire alarm works, not only that the sauce is good. A node test is the taste. A failure test is the alarm. Serving the whole table is the graph test.",
    plain:
      "Test at more than one level. A node test is input state, then the node, then the expected state. A graph test is input, then the graph, then the expected output. A failure test is a tool that fails, then the retry or the fallback, then the behavior you promised. The router is the cheapest powerful test, because it is ordinary Python. Given value 20, route returns \"process\". You can test the other side too, a value that should reject. In a project, a green node test that never runs the model will catch a wrong field long before a flaky end-to-end call does.",
    example:
      "route({\"value\": 20}) should be \"process\" if that is the cutoff you wrote. A graph test invokes the fork with 15 and expects the result string Processed successfully. A failure test stubs the tool to time out once and expects the retry, or stubs it to stay down and expects the fallback.",
    tryThis:
      "Write the assert for your router before you write the graph. One input above the line, one input below it.",
    functions: [
      {
        title: "A router test",
        why: "The route name is a string. The test does not need a model, a key, or a network.",
        language: "python",
        code: `def test_router():
    state = {"value": 20}
    assert route(state) == "process"`,
      },
    ],
    remember: "Remember it as: test the node, test the whole run, and test the failure you said you would handle.",
  },
  {
    slug: "when-it-looks-wrong",
    part: "How you work",
    title: "When it looks wrong",
    lead: "Ask where the wrong state first appeared. Tracing is how you answer that in production.",
    picture: `flowchart TD
      initial[Initial state] --> node[Node]
      node --> update[State update]
      update --> router[Router]
      router --> nextNode[Next node]
      nextNode --> toolNode[Tool]
      toolNode --> toolResult[Tool result]
      toolResult --> modelNode[Model]`,
    pictureCaption: "Walk in order. The first bad value is the bug.",
    story:
      "When dinner tastes wrong, you do not blame the salt shaker before you know who salted it. You walk the pot. Who added what, and which addition was the first one that turned it. An agent that misbehaves deserves the same walk. The model is often the last person who touched the pot, not the first.",
    plain:
      "When the graph is production software, you need to answer a list. Why did the agent do that? Which node was slow? Which tool failed? How many times did the graph loop? What did the model receive? What did it return? Where did latency come from? Think of the graph as node execution, model calls, tool calls, state transitions, and errors. Tracing is extremely valuable there. When an agent behaves incorrectly, do not immediately blame the model. Debug in order: initial state, the node, the state update, the router, the next node, the tool, the tool result, then the model. Ask where the wrong state first appeared. That is a much better debugging strategy. In a project, the trace should let you point at that step without rerunning the whole evening.",
    example:
      "The answer mentions a refund of 30 days. The policy node wrote 14 into the state. The model received 14 and still said 30. The wrong value first appeared at the model, and the pages were fine. Or the policy node wrote 30, and the model only repeated it. Those are different bugs. The walk tells you which.",
    tryThis:
      "Next time an answer looks wrong, write the eight steps in a column and stop at the first step that is already bad. Fix that step.",
    remember: "Remember it as: find the first wrong state. Then fix that node, not the loudest one.",
  },
  {
    slug: "what-to-learn-first",
    part: "How you work",
    title: "What to learn first",
    lead: "Three tiers, then a path. Do not study the whole stack on the same afternoon.",
    picture: `flowchart TD
      tier1[State, nodes, edges] --> tier2[Messages, tools, checkpoints]
      tier2 --> tier3[People, teams, fan-out]`,
    pictureCaption: "The first tier is the graph. The rest hangs on it.",
    story:
      "You learn to boil water before you learn a menu. A menu is exciting. It is also how you skip the stove and blame the sauce. The path in the notes is a menu with an order. Stay on the step you are on until the words are boring.",
    plain:
      "If you are learning for interviews and for real engineering, the notes split the ideas into three tiers. Tier 1, must know: state, nodes, edges, start and end, conditional edges, graph compilation, and graph invocation. Tier 2, must build with: MessagesState, ToolNode, agent loops, tool calling, reducers, streaming, checkpointing, and thread ids. Tier 3, advanced: interrupts, human-in-the-loop, Command, Send, subgraphs, parallel execution, map-reduce, retries, persistence, and multi-agent orchestration. Since you already know LangChain, do not study everything simultaneously. The path is StateGraph, then state, then nodes, then edges, then conditional edges, then loops, then MessagesState, then ToolNode, then the agent loop, then checkpointing, then human-in-the-loop, then subgraphs and Command, then multi-agent systems. The cards in this note follow that path. You can open any card. The order is still the order that keeps the later cards from floating.",
    example:
      "If conditional edges are still fuzzy, a supervisor card will feel like magic. It is not magic. It is a router with extra names. Go back to the fork until the name-and-map idea is dull. Then the supervisor is just a fancier map.",
    tryThis:
      "Mark the tier you can already say without notes. Start the next card at the first idea you cannot say. Do not start at multi-agent because it sounds like the job title.",
    remember: "Remember it as: state, nodes, and edges first. Teams and fan-out after the loop is boring.",
  },
  {
    slug: "cheat-sheet",
    part: "How you work",
    title: "The calls you will type again",
    lead: "Graph, node, edges, a fork, compile, invoke, stream, tools, and a checkpoint.",
    picture: `flowchart LR
      schema[StateGraph] --> node[add node]
      node --> edges[add edges]
      edges --> run[compile and invoke]`,
    pictureCaption: "The order you type is the order the run will live in.",
    story:
      "A recipe card on the fridge is allowed to be short. You already know why salt matters. The card only has to remind you of the amount. This card is the amount. The reasons live on the cards behind you.",
    plain:
      "Create the graph with StateGraph(State). Add a node with a name and a function. An edge from START to that name starts the run. An edge from one node to another is the normal step. An edge to END finishes. A conditional edge takes the node you are leaving, the router, and a map of names such as yes and no. compile builds the app. invoke runs it on input data. stream yields chunks. ToolNode wraps the tool list. compile again with a checkpointer when the run must be able to pause or resume. These are the calls from the notes, gathered so you can find them without rereading every story.",
    example:
      "You are about to add a fork. You do not need the pasta story again. You need add_conditional_edges, the router, and the map. This card is that page.",
    tryThis:
      "Cover the code. Write add_node, add_edge, and compile from memory. Uncover and fix the argument order, not the poetry.",
    functions: [
      {
        title: "The calls",
        why: "One page of the surface you use while building. The behavior is on the earlier cards.",
        language: "python",
        code: `graph = StateGraph(State)

graph.add_node("name", function)

graph.add_edge(START, "node")
graph.add_edge("node_a", "node_b")
graph.add_edge("node", END)

graph.add_conditional_edges(
    "node",
    router,
    {"yes": "node_a", "no": "node_b"},
)

app = graph.compile()
result = app.invoke(input_data)

for chunk in app.stream(input_data):
    print(chunk)

tools_node = ToolNode(tools)

app = graph.compile(checkpointer=checkpointer)`,
      },
    ],
    remember: "Remember it as: these are the calls. The earlier cards are why each call exists.",
  },
  {
    slug: "the-one-picture",
    part: "How you work",
    title: "The one picture",
    lead: "State, a node, a router, then a tool that returns to state or an answer that ends.",
    picture: `flowchart TD
      stateNode[State] --> node[Node]
      node --> router[Router]
      router -->|Tool| toolNode[Tool]
      router -->|Answer| doneNode[End]
      toolNode --> stateNode`,
    pictureCaption: "The tool writes back into state, and state feeds the node again.",
    story:
      "If you remember only one diagram from the notes, remember a desk. The desk holds the messages, the context, the results, and the metadata. A person at the desk does one piece of work, model or tool or plain logic. Then someone asks what's next. A tool means the result goes back on the desk and the person works again. An answer means you stand up and the run is over.",
    plain:
      "The one diagram is state, then a node, then a router. State holds messages, context, results, and metadata. The node is a model, a tool, or other logic. The router asks what's next. One branch is a tool, and that tool updates state, and state leads back to the node. The other branch is an answer, and that answer ends. Coming from LangChain, the transition is this. LangChain is models, tools, retrievers, prompts, chains, and agents. LangGraph is state, then nodes, then edges, then loops and branching and routing, then persistence and a human and parallel work, and that is how you get to production agents. The simplest definition: LangGraph is a framework for building stateful, controllable workflows around models, tools, and other application logic, using nodes, edges, and shared state. For an SDE-2 mindset, LangChain gives you the building blocks. LangGraph gives you control over how those building blocks execute. That distinction is the one to carry into every LangGraph project.",
    example:
      "A multiply agent is this picture with the costume on. State is the messages. The node is the model. The router sees a tool call or an answer. The tool writes 84 back onto the messages. The node speaks. The router sees no tool call. The run ends.",
    tryThis:
      "Draw the desk, the worker, and the question 'what's next' on paper without labels from a library. If the tool arrow does not return to the desk, the picture is still a line.",
    remember: "Remember it as: state, node, router. A tool returns to state. An answer ends.",
  },
];
