import type { LessonContent } from "../lesson-types";
import { createLesson, iq } from "./builder";

export const phase2Lessons: Record<string, LessonContent> = {
  "neural-networks": createLesson({
    concept:
      "Neural networks are layered functions that learn patterns from data by adjusting weights — the universal building block behind every modern AI system including LLMs.",
    whyItExists:
      "Hand-crafted rules fail on messy real-world data (images, language, speech). Neural networks learn representations automatically from examples, scaling from simple classifiers to billion-parameter language models.",
    analogy:
      "Imagine a factory assembly line where each worker tweaks a dial based on how far the final product missed the target. After thousands of iterations, the line produces correct outputs without anyone writing explicit rules.",
    technicalExplanation:
      "A neural network stacks layers of neurons. Each neuron computes weighted_sum(inputs) + bias, then applies a non-linear activation. Forward pass: input flows layer-by-layer to produce output. Training adjusts weights to minimize loss. Depth enables hierarchical features — early layers detect edges/words, deeper layers combine them into concepts. Parameters = all weights and biases; capacity grows with width (neurons per layer) and depth (number of layers).",
    architecture:
      "Input Layer → Hidden Layers (Linear transform + Activation, repeated) → Output Layer. For LLMs: token embeddings enter, pass through dozens of transformer blocks (attention + FFN), exit as vocabulary logits.",
    diagram: `flowchart LR
    A[Input Features] --> B[Layer 1: Wx + b]
    B --> C[Activation ReLU/GELU]
    C --> D[Layer 2: Wx + b]
    D --> E[Activation]
    E --> F[Output Layer]
    F --> G[Prediction]`,
    example:
      "Classifying emails as spam: 500 input features (word counts) → 128-neuron hidden layer → 1 output (spam probability). The network learns which word patterns correlate with spam without you defining rules.",
    code: `import torch
import torch.nn as nn

class SimpleClassifier(nn.Module):
    def __init__(self, input_dim: int, hidden_dim: int):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1),
            nn.Sigmoid(),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)

model = SimpleClassifier(input_dim=500, hidden_dim=128)
x = torch.randn(32, 500)  # batch of 32 emails
output = model(x)           # shape: (32, 1)`,
    project:
      "Build a digit classifier on MNIST using PyTorch: 784 inputs → 128 ReLU → 10 softmax outputs. Log training loss per epoch and visualize misclassified digits.",
    interviewQuestions: [
      iq("What is the difference between parameters and hyperparameters?", "Parameters (weights, biases) are learned during training. Hyperparameters (learning rate, layer sizes, epochs) are set by the engineer before training.", "easy"),
      iq("Why do we need non-linear activation functions?", "Without non-linearity, stacking linear layers collapses to a single linear transform — the network cannot learn complex decision boundaries no matter how deep.", "medium"),
      iq("How does depth vs width affect model capacity?", "Depth enables compositional/hierarchical features (edges → shapes → objects). Width increases representational power per layer. LLMs use both: deep stacks with wide hidden dimensions.", "hard"),
    ],
    revisionNotes: {
      fiveMin: [
        "Neural net = layers of weighted sums + non-linear activations",
        "Forward pass computes output; training adjusts weights via loss",
        "Depth = hierarchical features; width = capacity per layer",
        "Every LLM is a very large neural network",
      ],
      fifteenMin: [
        "Neuron: y = activation(Wx + b)",
        "Parameters learned; hyperparameters configured",
        "Non-linearity essential for expressive power",
        "Batch dimension: process multiple samples in parallel",
        "PyTorch: nn.Module + forward() defines architecture",
        "Overfitting = memorizing training data, poor generalization",
      ],
      oneHour: [
        "Implement forward pass from scratch with NumPy",
        "Build MNIST classifier in PyTorch end-to-end",
        "Visualize learned weights in first hidden layer",
        "Compare shallow vs deep network accuracy",
        "Understand parameter count formula for MLPs",
        "Connect MLP intuition to transformer blocks in LLMs",
      ],
      cheatSheet: [
        "y = activation(Wx + b)",
        "Params = weights + biases (learned)",
        "Hyperparams = lr, layers, epochs (set manually)",
        "ReLU/GELU = common activations",
        "Forward pass = inference; backward = training",
        "nn.Module in PyTorch defines architecture",
      ],
    },
    glossary: ["Neuron", "Weight", "Bias", "Forward Pass"],
    commonMistakes: [
      "Confusing parameters with hyperparameters in interviews",
      "Building networks without activation functions between layers",
      "Not normalizing inputs — causes slow or unstable training",
      "Judging model quality on training accuracy alone",
    ],
  }),

  "gradient-descent": createLesson({
    concept:
      "Gradient descent is the optimization algorithm that finds good neural network weights by repeatedly stepping downhill on the loss surface in the direction of steepest decrease.",
    whyItExists:
      "Neural networks have millions of parameters — no closed-form solution exists. Gradient descent provides a general, scalable method to minimize loss by using calculus (derivatives) to know which direction to adjust each weight.",
    analogy:
      "You're blindfolded on a hilly landscape trying to reach the lowest valley. You feel the slope under your feet and take small steps downhill. Learning rate controls step size — too big and you overshoot; too small and you take forever.",
    technicalExplanation:
      "Loss L is a function of all weights θ. The gradient ∇L tells you the direction of steepest increase. Update rule: θ_new = θ_old - η·∇L, where η is learning rate. Mini-batch GD computes gradient on a subset of data (faster, noisy but effective). Stochastic GD uses one sample. In practice, mini-batch (32-512) balances speed and stability. The loss surface is non-convex for neural nets — GD finds local minima that generalize well.",
    architecture:
      "Training loop: (1) Forward pass → compute loss, (2) Backward pass → compute gradients, (3) Optimizer step → update weights, (4) Repeat for N epochs over dataset.",
    diagram: `flowchart TD
    A[Initialize Weights] --> B[Forward Pass: Compute Loss]
    B --> C[Backward Pass: Compute Gradients]
    C --> D[Update: w = w - lr * gradient]
    D --> E{Converged?}
    E -->|No| B
    E -->|Yes| F[Trained Model]`,
    example:
      "Training a linear regression: loss = MSE. Gradient of MSE w.r.t. weight w points uphill. Subtracting η·gradient moves w toward the value that minimizes average squared error across training points.",
    code: `import torch

# Simple gradient descent on y = 2x
w = torch.tensor([0.0], requires_grad=True)
lr = 0.1

for step in range(50):
    # Forward: predict y = w * x
    x = torch.tensor([3.0])
    y_pred = w * x
    loss = (y_pred - 6.0) ** 2  # target y=6

    loss.backward()              # compute gradient
    with torch.no_grad():
        w -= lr * w.grad         # update weight
    w.grad.zero_()

print(f"Learned w: {w.item():.2f}")  # ~2.0`,
    project:
      "Implement gradient descent from scratch in NumPy for linear regression on a CSV dataset. Plot loss curve over iterations and compare with sklearn's closed-form solution.",
    interviewQuestions: [
      iq("What happens if learning rate is too high or too low?", "Too high: loss oscillates or diverges — overshooting minima. Too low: convergence is extremely slow and may get stuck in poor local minima.", "easy"),
      iq("Why use mini-batch instead of full-batch gradient descent?", "Full-batch is accurate but slow on large datasets. Mini-batch provides noisy but unbiased gradient estimates, enabling faster updates and better generalization via implicit regularization.", "medium"),
      iq("Why does gradient descent work on non-convex loss surfaces?", "We don't find global minima — we find basins where loss is low enough to generalize. SGD noise helps escape sharp minima; overparameterized nets have many good solutions.", "hard"),
    ],
    revisionNotes: {
      fiveMin: [
        "GD: move weights opposite to gradient direction",
        "Learning rate controls step size",
        "Mini-batch = practical default for large data",
        "θ_new = θ_old - η·∇L",
      ],
      fifteenMin: [
        "Gradient points uphill; we step downhill",
        "Batch: full / mini / stochastic tradeoffs",
        "Loss.backward() in PyTorch computes gradients",
        "optimizer.step() applies the update rule",
        "Learning rate scheduling improves convergence",
        "Non-convex surfaces have many local minima",
      ],
      oneHour: [
        "Derive gradient for linear regression by hand",
        "Implement GD loop in pure NumPy",
        "Visualize loss surface for 2-parameter model",
        "Experiment with learning rates: 0.001 vs 0.1 vs 1.0",
        "Compare SGD, mini-batch, full-batch convergence",
        "Connect GD to Adam optimizer used in LLM training",
      ],
      cheatSheet: [
        "θ ← θ - η·∇L",
        "η = learning rate (typical: 1e-4 to 1e-2)",
        "loss.backward() → gradients",
        "optimizer.step() → weight update",
        "Mini-batch size: 32, 64, 128, 256",
        "Watch loss curve for divergence",
      ],
    },
    glossary: ["Gradient", "Learning Rate", "Mini-batch", "Convergence"],
    commonMistakes: [
      "Using learning rate too high — loss explodes to NaN",
      "Forgetting zero_grad() between iterations in PyTorch",
      "Assuming GD always finds global minimum",
      "Not monitoring loss curve during training",
    ],
  }),

  "backpropagation": createLesson({
    concept:
      "Backpropagation is the algorithm that efficiently computes gradients of the loss with respect to every weight in a neural network using the chain rule of calculus.",
    whyItExists:
      "A network with millions of weights needs millions of gradients per training step. Naively computing each gradient separately is O(n²). Backprop reuses intermediate computations via the chain rule, making training deep networks feasible in O(n) time.",
    analogy:
      "A billing error at the end of a supply chain: backprop traces backward through each supplier to assign blame proportionally. Each layer asks 'how much did my output contribute to the final error?' and passes that signal backward.",
    technicalExplanation:
      "Forward pass stores activations at each layer. Backward pass applies chain rule from output to input: ∂L/∂w = ∂L/∂activation · ∂activation/∂z · ∂z/∂w. Each layer computes its local gradient and passes ∂L/∂input upstream. PyTorch's autograd automates this — you define forward(), call loss.backward(), gradients populate .grad attributes. Vanishing gradients (deep nets, sigmoid) and exploding gradients (RNNs) are key challenges solved by better activations (ReLU, GELU), normalization, and gradient clipping.",
    architecture:
      "Computational graph: each operation (matmul, activation, loss) is a node. Forward pass evaluates nodes left-to-right storing values. Backward pass traverses right-to-left applying chain rule via local Jacobians.",
    diagram: `flowchart RL
    A[Input x] --> B[Layer 1: z1 = W1x]
    B --> C[a1 = ReLU z1]
    C --> D[Layer 2: z2 = W2a1]
    D --> E[Loss L]
    E -.->|dL/dz2| D
    D -.->|dL/dW2| D
    D -.->|dL/da1| C
    C -.->|dL/dz1| B
    B -.->|dL/dW1| B`,
    example:
      "Two-layer network: loss depends on output of layer 2, which depends on layer 1 activations, which depend on layer 1 weights. Backprop computes ∂L/∂W2 first, then uses that to compute ∂L/∂W1 without re-deriving from scratch.",
    code: `import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(10, 5),
    nn.ReLU(),
    nn.Linear(5, 1),
)

x = torch.randn(4, 10)
y_true = torch.randn(4, 1)

# Forward
y_pred = model(x)
loss = nn.MSELoss()(y_pred, y_true)

# Backward — autograd computes all gradients
loss.backward()

# Inspect gradients
for name, param in model.named_parameters():
    print(f"{name}: grad shape {param.grad.shape}")`,
    project:
      "Implement a 2-layer MLP backprop from scratch in NumPy (forward + backward for ReLU and linear layers). Verify gradients match PyTorch autograd using torch.autograd.gradcheck.",
    interviewQuestions: [
      iq("What is the chain rule's role in backpropagation?", "Each layer's gradient is the upstream gradient (∂L/∂output) multiplied by the local gradient (∂output/∂input). Chain rule composes these across layers efficiently.", "medium"),
      iq("What is the vanishing gradient problem?", "In deep networks with saturating activations (sigmoid/tanh), gradients shrink exponentially as they propagate backward, making early layers learn extremely slowly.", "medium"),
      iq("How does PyTorch autograd work?", "Operations on tensors with requires_grad=True build a dynamic computational graph. backward() traverses this graph in reverse, accumulating gradients via chain rule into .grad buffers.", "hard"),
    ],
    revisionNotes: {
      fiveMin: [
        "Backprop = chain rule applied backward through the network",
        "Computes ∂L/∂w for every weight efficiently",
        "PyTorch autograd automates backpropagation",
        "Forward stores activations; backward uses them",
      ],
      fifteenMin: [
        "∂L/∂w = upstream_grad × local_grad",
        "Vanishing gradients: early layers stop learning",
        "Exploding gradients: clip or lower learning rate",
        "ReLU/GELU reduce vanishing vs sigmoid",
        "loss.backward() triggers the backward pass",
        "zero_grad() clears stale gradients before next step",
      ],
      oneHour: [
        "Derive backprop equations for 2-layer MLP by hand",
        "Implement backward pass in NumPy from scratch",
        "Use gradcheck to verify custom backward",
        "Visualize gradient magnitudes per layer",
        "Experiment with activation functions on gradient flow",
        "Understand how LayerNorm stabilizes gradients in transformers",
      ],
      cheatSheet: [
        "Chain rule: ∂L/∂x = ∂L/∂y · ∂y/∂x",
        "loss.backward() → all .grad populated",
        "optimizer.zero_grad() before each step",
        "Vanishing: sigmoid in deep nets",
        "Fix: ReLU, residual connections, LayerNorm",
        "gradcheck validates custom gradients",
      ],
    },
    glossary: ["Chain Rule", "Computational Graph", "Autograd", "Vanishing Gradient"],
    commonMistakes: [
      "Forgetting optimizer.zero_grad() — gradients accumulate incorrectly",
      "Detaching tensors unintentionally, breaking the graph",
      "Assuming backprop finds global optimum — it only computes local gradients",
      "Not understanding that inference (eval mode) skips gradient computation",
    ],
  }),

  "activation-functions": createLesson({
    concept:
      "Activation functions introduce non-linearity after each linear layer, enabling neural networks to learn complex patterns instead of collapsing into a single linear transform.",
    whyItExists:
      "Without activations, stacking layers is mathematically equivalent to one matrix multiply. Non-linear activations let networks approximate arbitrary functions (universal approximation) and learn hierarchical features.",
    analogy:
      "A linear layer is like adjusting volume on a stereo — you can only make things louder or quieter. An activation function is the equalizer that shapes the sound — boosting bass, cutting treble — enabling rich, complex output.",
    technicalExplanation:
      "Common activations: ReLU(x) = max(0,x) — fast, avoids vanishing gradients for positive values, but 'dead neurons' if always negative. GELU(x) ≈ x·Φ(x) — smooth, used in GPT/BERT transformers. Sigmoid σ(x) = 1/(1+e⁻ˣ) — outputs (0,1), used in gates and binary output. Tanh — zero-centered sigmoid, range (-1,1). Softmax — converts logits to probability distribution (sum=1), used at output layer for classification. LLMs use GELU/SwiGLU in FFN blocks; output uses softmax over vocabulary.",
    architecture:
      "Typical block: Linear → Activation → Linear → Activation. In transformers: Attention output → Add & Norm → FFN (Linear → GELU → Linear) → Add & Norm.",
    diagram: `flowchart LR
    A[Linear Output z] --> B{Activation}
    B -->|ReLU| C[max 0 z]
    B -->|GELU| D[smooth gate]
    B -->|Sigmoid| E[0 to 1]
    C --> F[Next Layer Input]
    D --> F
    E --> F`,
    example:
      "In a transformer FFN: input 768-dim → Linear to 3072 → GELU → Linear back to 768. GELU's smooth gating lets the model learn which dimensions to pass through, improving over ReLU in language tasks.",
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

x = torch.tensor([-2.0, -1.0, 0.0, 1.0, 2.0])

relu = F.relu(x)       # [0, 0, 0, 1, 2]
gelu = F.gelu(x)       # smooth, near 0 for negatives
sigmoid = torch.sigmoid(x)

# Transformer FFN pattern
ffn = nn.Sequential(
    nn.Linear(768, 3072),
    nn.GELU(),
    nn.Linear(3072, 768),
)`,
    project:
      "Plot ReLU, GELU, SiLU, and Sigmoid on the same chart. Train identical MLPs with each activation on MNIST and compare convergence speed and final accuracy.",
    interviewQuestions: [
      iq("Why is ReLU preferred over sigmoid in hidden layers?", "ReLU has constant gradient (=1) for positive inputs, avoiding vanishing gradients. Sigmoid saturates at 0 and 1 where gradient ≈ 0, killing learning in deep networks.", "easy"),
      iq("What activation do modern LLMs use in FFN blocks?", "GELU or SwiGLU (gated linear unit with SiLU). GPT-2/3 use GELU; LLaMA uses SwiGLU. Both are smooth and outperform ReLU on language modeling.", "medium"),
      iq("What is the dying ReLU problem?", "If a neuron's input is always negative, ReLU output is always 0 and gradient is 0 — the neuron never updates. Leaky ReLU (small slope for negatives) mitigates this.", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "Activations add non-linearity between linear layers",
        "ReLU: max(0,x) — fast, standard for CNNs",
        "GELU/SwiGLU — used in transformers/LLMs",
        "Softmax at output for probability distributions",
      ],
      fifteenMin: [
        "No activation → network is just one linear layer",
        "Sigmoid/tanh saturate → vanishing gradients",
        "ReLU dead neurons when input always negative",
        "GELU: smooth probabilistic gating",
        "SwiGLU: gated FFN in LLaMA/Mistral",
        "Choose activation based on architecture era",
      ],
      oneHour: [
        "Plot and compare activation function curves",
        "Train same MLP with different activations",
        "Measure gradient magnitudes per activation",
        "Implement SwiGLU FFN block",
        "Understand why transformers moved from ReLU to GELU",
        "Connect softmax output to cross-entropy loss",
      ],
      cheatSheet: [
        "ReLU = max(0, x)",
        "GELU = x · Φ(x) — GPT family",
        "SwiGLU = x · SiLU(Wx) — LLaMA",
        "Softmax = exp(xi)/Σexp(xj)",
        "Sigmoid for gates/binary output",
        "No activation = linear collapse",
      ],
    },
    glossary: ["ReLU", "GELU", "Softmax", "SwiGLU"],
    commonMistakes: [
      "Using softmax in hidden layers — causes saturation issues",
      "Applying sigmoid in deep hidden layers — vanishing gradients",
      "Forgetting softmax at multi-class output layer",
      "Confusing which activation modern LLMs actually use",
    ],
  }),

  "loss-functions": createLesson({
    concept:
      "Loss functions quantify how wrong a model's predictions are — providing the signal that gradient descent uses to improve weights during training.",
    whyItExists:
      "Training needs a single scalar objective to minimize. Loss functions map prediction errors to a number: lower loss = better model. Different tasks need different losses — regression, classification, and language modeling each have specialized formulations.",
    analogy:
      "A report card for your model. MSE is like grading on distance from the correct answer. Cross-entropy is like grading how surprised the model was by the correct answer — heavily penalizing confident wrong predictions.",
    technicalExplanation:
      "MSE (Mean Squared Error): average (y - ŷ)² — for regression. Cross-Entropy Loss: -Σ y·log(ŷ) — for classification; penalizes confident wrong predictions heavily. Binary CE for two classes; Categorical CE for multi-class. Language modeling uses Cross-Entropy over vocabulary: loss = -log P(correct_next_token). Lower perplexity = lower CE loss. Huber loss combines MSE and MAE — robust to outliers. Loss choice affects gradient behavior and what the model optimizes for.",
    architecture:
      "Forward pass produces logits → Loss function compares logits to targets → Scalar loss → Backprop computes gradients. In LLMs: final linear layer outputs vocab-sized logits → CE loss against next token ID.",
    diagram: `flowchart TD
    A[Model Logits] --> B{Task Type}
    B -->|Regression| C[MSE Loss]
    B -->|Classification| D[Cross-Entropy]
    B -->|Language Model| E[Next-Token CE]
    C --> F[Scalar Loss]
    D --> F
    E --> F
    F --> G[Backpropagation]`,
    example:
      "LLM predicts next token. Vocabulary = 50,000 tokens. Model outputs 50,000 logits; softmax converts to probabilities. Correct token 'Paris' had probability 0.3 → loss = -log(0.3) ≈ 1.2. If model was confident wrong (p=0.01) → loss = -log(0.01) ≈ 4.6.",
    code: `import torch
import torch.nn as nn

# Classification
logits = torch.tensor([[2.0, 1.0, 0.1]])
target = torch.tensor([0])  # class 0
ce_loss = nn.CrossEntropyLoss()(logits, target)

# Language modeling (next token)
vocab_logits = torch.randn(1, 50257)  # GPT-2 vocab
next_token = torch.tensor([1234])
lm_loss = nn.CrossEntropyLoss()(vocab_logits, next_token)

# Regression
pred = torch.tensor([3.5])
true = torch.tensor([4.0])
mse = nn.MSELoss()(pred, true)

print(f"CE: {ce_loss:.3f}, LM: {lm_loss:.3f}, MSE: {mse:.3f}")`,
    project:
      "Train a sentiment classifier with CrossEntropyLoss and a price predictor with MSELoss. Plot loss curves and explain why you cannot swap the loss functions between tasks.",
    interviewQuestions: [
      iq("Why does cross-entropy work well for classification?", "It penalizes confident wrong predictions exponentially. Combined with softmax, gradients are well-behaved and directly push probability mass toward the correct class.", "medium"),
      iq("What loss function do LLMs use during pre-training?", "Cross-entropy over the vocabulary for next-token prediction. Minimizing CE = maximizing likelihood of training text. Perplexity = exp(average CE).", "easy"),
      iq("What is label smoothing?", "Instead of hard 0/1 targets, use soft targets (e.g., 0.9 for correct, 0.1/(K-1) for others). Prevents overconfidence, improves calibration and generalization.", "hard"),
    ],
    revisionNotes: {
      fiveMin: [
        "Loss = single number measuring prediction error",
        "MSE for regression, Cross-Entropy for classification",
        "LLMs: CE over vocabulary for next-token prediction",
        "Lower loss = better model",
      ],
      fifteenMin: [
        "CE = -log(p_correct) — punishes confident mistakes",
        "Perplexity = exp(avg CE) for language models",
        "Softmax + CE is numerically stable pair",
        "Huber loss: robust regression alternative",
        "Loss choice defines what model optimizes",
        "Label smoothing prevents overconfidence",
      ],
      oneHour: [
        "Derive CE gradient w.r.t. logits",
        "Compute perplexity from CE loss manually",
        "Compare MSE vs MAE on outlier-heavy data",
        "Implement focal loss for imbalanced classes",
        "Track train vs validation loss for overfitting",
        "Connect CE loss to maximum likelihood estimation",
      ],
      cheatSheet: [
        "MSE = mean((y - ŷ)²)",
        "CE = -Σ y·log(ŷ)",
        "LM loss = CE over vocab logits",
        "Perplexity = exp(CE)",
        "nn.CrossEntropyLoss() includes softmax",
        "Lower perplexity = better language model",
      ],
    },
    glossary: ["Cross-Entropy", "MSE", "Perplexity", "Logits"],
    commonMistakes: [
      "Applying softmax before nn.CrossEntropyLoss (it includes softmax)",
      "Using MSE for classification — wrong gradient behavior",
      "Ignoring class imbalance — need weighted CE or focal loss",
      "Confusing loss with accuracy — low loss doesn't always mean high accuracy",
    ],
  }),

  "optimizers": createLesson({
    concept:
      "Optimizers are algorithms that use gradients to update neural network weights — going beyond basic gradient descent with momentum, adaptive learning rates, and memory of past gradients.",
    whyItExists:
      "Plain SGD is slow and sensitive to learning rate choice. Different parameters need different update speeds (embeddings vs attention weights). Optimizers like Adam adapt per-parameter learning rates and use momentum for faster, more stable convergence.",
    analogy:
      "Basic GD is walking downhill blindly. Momentum is a ball rolling downhill — it accelerates in consistent directions and rolls over small bumps. Adam is a smart hiker with a GPS that remembers which paths were steep and adjusts step size per direction.",
    technicalExplanation:
      "SGD: θ -= lr·∇L. SGD+Momentum: accumulates velocity v = βv + ∇L; θ -= lr·v — faster convergence, smooths noisy gradients. Adam: maintains per-parameter first moment (mean of gradients) and second moment (variance). Update: θ -= lr·m̂/(√v̂ + ε). Adapts learning rate per parameter automatically. AdamW: Adam with decoupled weight decay (L2 regularization applied to weights, not gradients) — standard for transformer training. LLM fine-tuning often uses AdamW with lr=1e-5 to 5e-5, warmup, and cosine decay.",
    architecture:
      "Training step: zero_grad() → forward → loss → backward() → optimizer.step(). Scheduler adjusts lr over training (warmup, cosine decay, step decay).",
    diagram: `flowchart TD
    A[Gradients from Backprop] --> B{Optimizer}
    B -->|SGD| C[θ -= lr * grad]
    B -->|Momentum| D[velocity += grad; θ -= lr * v]
    B -->|AdamW| E[update moments; adaptive lr per param]
    C --> F[Updated Weights]
    D --> F
    E --> F`,
    example:
      "Fine-tuning BERT: AdamW optimizer, lr=2e-5, warmup 10% of steps, linear decay. Weight decay=0.01 regularizes. Momentum helps push through noisy mini-batch gradients from small datasets.",
    code: `import torch
import torch.nn as nn

model = nn.Linear(10, 2)

# AdamW — default for transformer fine-tuning
optimizer = torch.optim.AdamW(model.parameters(), lr=2e-5, weight_decay=0.01)

# Learning rate scheduler with warmup
from torch.optim.lr_scheduler import CosineAnnealingLR
scheduler = CosineAnnealingLR(optimizer, T_max=100)

for step in range(100):
    optimizer.zero_grad()
    loss = model(torch.randn(8, 10)).sum()  # dummy
    loss.backward()
    optimizer.step()
    scheduler.step()`,
    project:
      "Train the same MNIST model with SGD, SGD+Momentum, and AdamW. Plot loss curves side-by-side and compare convergence speed and final accuracy.",
    interviewQuestions: [
      iq("What is the difference between Adam and AdamW?", "Adam applies L2 regularization through gradients (coupled weight decay). AdamW decouples weight decay — directly shrinking weights each step — which works better for transformers.", "medium"),
      iq("Why use learning rate warmup?", "Early training has noisy gradient estimates. Warmup gradually increases lr from near-zero, preventing large destructive updates before momentum estimates stabilize.", "medium"),
      iq("When might SGD outperform Adam?", "SGD with momentum sometimes generalizes better on vision tasks (lower test error at same train error). Adam converges faster but may find sharper minima. Task-dependent choice.", "hard"),
    ],
    revisionNotes: {
      fiveMin: [
        "Optimizer applies gradient updates to weights",
        "AdamW = standard for transformer training",
        "Learning rate warmup prevents early instability",
        "weight_decay = L2 regularization",
      ],
      fifteenMin: [
        "SGD: simple, needs careful lr tuning",
        "Momentum: accumulates velocity, faster convergence",
        "Adam: adaptive per-parameter learning rates",
        "AdamW: decoupled weight decay for transformers",
        "Schedulers: warmup, cosine decay, step decay",
        "Fine-tune LLMs: lr 1e-5 to 5e-5 typical",
      ],
      oneHour: [
        "Compare SGD vs AdamW on same task",
        "Implement SGD with momentum from scratch",
        "Plot learning rate schedule over training",
        "Tune weight decay effect on overfitting",
        "Fine-tune a small model with HuggingFace Trainer",
        "Understand why LLM pre-training uses AdamW + cosine",
      ],
      cheatSheet: [
        "AdamW(lr=2e-5, weight_decay=0.01)",
        "zero_grad → backward → step",
        "Warmup: linear lr increase first N steps",
        "Cosine decay: lr follows cosine curve",
        "Momentum β=0.9 typical",
        "SGD better generalization sometimes",
      ],
    },
    glossary: ["AdamW", "Momentum", "Weight Decay", "Learning Rate Schedule"],
    commonMistakes: [
      "Using same learning rate for pre-training and fine-tuning",
      "Skipping warmup on large transformer fine-tuning runs",
      "Applying weight decay to bias and LayerNorm parameters",
      "Not using a learning rate scheduler for long training runs",
    ],
  }),

  attention: createLesson({
    concept:
      "Attention is a mechanism that lets a model dynamically focus on the most relevant parts of its input when producing each output — the core innovation behind transformers and LLMs.",
    whyItExists:
      "RNNs process sequences step-by-step, struggling with long-range dependencies and parallelization. Attention lets any position directly access any other position in one step, solving both problems and enabling the parallel training that made LLMs possible.",
    analogy:
      "Reading a contract to answer a question: you don't re-read every word equally. Your eyes jump to relevant clauses (dates, payment terms). Attention is the model learning where to 'look' for each decision it makes.",
    technicalExplanation:
      "Given query Q, keys K, and values V: Attention(Q,K,V) = softmax(QKᵀ/√d_k)V. Query asks 'what am I looking for?', Key says 'what do I contain?', Value says 'here's my content if selected'. Softmax produces attention weights (sum to 1) over all keys. Weighted sum of values = context-aware output. Scaled dot-product: dividing by √d_k prevents softmax saturation when dimensions are large. Cross-attention: Q from decoder, K/V from encoder (translation). Self-attention: Q, K, V all from same sequence.",
    architecture:
      "Attention block: Input → Linear projections to Q, K, V → Scaled dot-product attention → Output projection. In transformers, this is wrapped in multi-head attention + residual connection + layer norm.",
    diagram: `flowchart LR
    A[Input Sequence] --> B[Linear: Q, K, V]
    B --> C[Scores: Q x K^T]
    C --> D[Scale / sqrt d_k]
    D --> E[Softmax Weights]
    E --> F[Weighted Sum of V]
    F --> G[Output Projection]`,
    example:
      "Translating 'The cat sat on the mat' → French. When generating 'chat', the decoder's query attends strongly to encoder keys at 'cat' position. Attention weights might be [0.01, 0.85, 0.02, 0.05, 0.03, 0.04] — focusing on the source word.",
    code: `import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, V), weights

# Example: 1 head, seq_len=4, d_k=8
Q = K = V = torch.randn(1, 4, 8)
output, weights = scaled_dot_product_attention(Q, K, V)
print(f"Output: {output.shape}, Weights: {weights.shape}")`,
    project:
      "Implement scaled dot-product attention from scratch. Visualize attention weight heatmaps for a simple seq2seq task (e.g., copying a reversed sequence).",
    interviewQuestions: [
      iq("Why divide by sqrt(d_k) in attention?", "Without scaling, dot products grow large with dimension, pushing softmax into saturation regions with near-zero gradients. Scaling keeps variance stable.", "medium"),
      iq("What is the difference between cross-attention and self-attention?", "Self-attention: Q, K, V from same sequence — each token attends to all tokens. Cross-attention: Q from one sequence, K/V from another — decoder attending to encoder output.", "easy"),
      iq("What is the computational complexity of attention?", "O(n²·d) where n is sequence length, d is dimension. Quadratic in sequence length is the main bottleneck for very long contexts — motivates sparse/linear attention research.", "hard"),
    ],
    revisionNotes: {
      fiveMin: [
        "Attention = weighted sum based on relevance scores",
        "Q asks, K indexes, V provides content",
        "softmax(QKᵀ/√d_k)V is the core formula",
        "Enables direct long-range connections",
      ],
      fifteenMin: [
        "Scaled dot-product prevents softmax saturation",
        "Self-attention: Q,K,V from same input",
        "Cross-attention: Q from decoder, K,V from encoder",
        "Attention weights sum to 1 (probability distribution)",
        "O(n²) complexity limits very long sequences",
        "Masking prevents attending to future tokens",
      ],
      oneHour: [
        "Implement attention from scratch in PyTorch",
        "Visualize attention heatmaps for translation",
        "Compare attention vs RNN on long sequences",
        "Understand causal masking in decoder",
        "Calculate memory for n=4096 sequence attention",
        "Trace attention flow in a pretrained model",
      ],
      cheatSheet: [
        "Attn = softmax(QKᵀ/√d_k)V",
        "Q=query, K=key, V=value",
        "Self-attn: same sequence",
        "Cross-attn: different sequences",
        "Mask: -inf for blocked positions",
        "O(n²d) complexity",
      ],
    },
    glossary: ["Query", "Key", "Value", "Attention Weights"],
    commonMistakes: [
      "Forgetting to scale by sqrt(d_k) — unstable softmax",
      "Not applying causal mask in decoder self-attention",
      "Confusing attention weights with model confidence",
      "Assuming attention always aligns with human intuition",
    ],
  }),

  "self-attention": createLesson({
    concept:
      "Self-attention lets every token in a sequence attend to every other token in the same sequence — enabling each position to gather context from the entire input in parallel.",
    whyItExists:
      "Language understanding requires knowing how words relate to each other ('bank' near 'river' vs 'money'). Self-attention computes these relationships for all pairs simultaneously, replacing sequential RNN processing with parallel computation.",
    analogy:
      "A group discussion where everyone can hear everyone else at once. Each person (token) listens to the whole conversation and decides which speakers are most relevant to their own contribution.",
    technicalExplanation:
      "Input X (seq_len × d_model) is projected to Q = XW_Q, K = XW_K, V = XW_V via learned weight matrices. Each row of Q is one token's query; each row of K is one token's key. Attention matrix A = softmax(QKᵀ/√d_k) has shape (seq_len × seq_len) — A[i,j] = how much token i attends to token j. Output = AV gives each token a context-aware representation. Causal (masked) self-attention: set future positions to -∞ before softmax so token i only sees tokens 1..i — essential for autoregressive generation in GPT.",
    architecture:
      "Input Embeddings + Positional Encoding → Self-Attention (Q,K,V from same input) → Residual + LayerNorm → Feed-Forward → Residual + LayerNorm. Stacked N times in encoder/decoder blocks.",
    diagram: `flowchart TD
    A[Token Embeddings X] --> B[W_Q: Query]
    A --> C[W_K: Key]
    A --> D[W_V: Value]
    B --> E[QK^T / sqrt d_k]
    C --> E
    E --> F[Causal Mask]
    F --> G[Softmax]
    G --> H[Multiply V]
    D --> H
    H --> I[Context-Aware Output]`,
    example:
      "Sentence: 'The animal didn't cross the street because it was too tired.' Self-attention lets 'it' attend strongly to 'animal' (weight 0.7) rather than 'street' (weight 0.1), resolving the pronoun reference.",
    code: `import torch
import torch.nn as nn

class SelfAttention(nn.Module):
    def __init__(self, d_model: int):
        super().__init__()
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)

    def forward(self, x, mask=None):
        Q, K, V = self.W_q(x), self.W_k(x), self.W_v(x)
        scores = torch.matmul(Q, K.transpose(-2, -1)) / (Q.size(-1) ** 0.5)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))
        weights = torch.softmax(scores, dim=-1)
        return torch.matmul(weights, V)

# Causal mask for GPT-style generation
seq_len = 5
mask = torch.tril(torch.ones(seq_len, seq_len))`,
    project:
      "Visualize self-attention maps from a pretrained BERT or GPT model using BertViz or similar. Identify which tokens attend to each other in 5 example sentences.",
    interviewQuestions: [
      iq("Why is causal masking needed in decoder self-attention?", "During training, the model sees the full sequence. Without masking, token i could attend to future tokens i+1, i+2 — cheating at next-token prediction. Mask ensures autoregressive property.", "medium"),
      iq("How does self-attention differ from RNNs for sequence modeling?", "RNNs: O(n) sequential steps, vanishing gradients on long sequences. Self-attention: O(1) parallel depth per layer, O(n²) compute, direct paths between any two positions.", "medium"),
      iq("What do the Q, K, V projections learn?", "W_Q, W_K, W_V are learned linear transforms that project embeddings into subspaces optimized for computing relevance (Q·K) and retrieving content (V). Different heads learn different relationship types.", "hard"),
    ],
    revisionNotes: {
      fiveMin: [
        "Self-attention: each token attends to all tokens in same sequence",
        "Q, K, V all derived from same input X",
        "Causal mask prevents seeing future tokens in GPT",
        "Parallel computation replaces sequential RNNs",
      ],
      fifteenMin: [
        "Q = XW_Q, K = XW_K, V = XW_V",
        "Attention matrix: seq_len × seq_len",
        "Causal mask: lower triangular allowed",
        "Residual connection: output + input",
        "LayerNorm stabilizes training",
        "Enables pronoun resolution, syntax capture",
      ],
      oneHour: [
        "Implement self-attention with causal mask",
        "Visualize attention patterns in real sentences",
        "Compare masked vs unmasked attention outputs",
        "Trace self-attention in HuggingFace model",
        "Understand residual + LayerNorm placement",
        "Measure compute cost for varying seq lengths",
      ],
      cheatSheet: [
        "Self-attn: Q,K,V from same X",
        "Causal mask: tril(ones(n,n))",
        "Output = softmax(QKᵀ/√d)V",
        "Residual: x + sublayer(x)",
        "Pre-norm vs post-norm variants",
        "Parallel over sequence length",
      ],
    },
    glossary: ["Causal Mask", "Autoregressive", "Residual Connection", "Layer Normalization"],
    commonMistakes: [
      "Omitting causal mask in decoder — model cheats during training",
      "Confusing self-attention with cross-attention",
      "Assuming attention weights are interpretable ground truth",
      "Forgetting residual connections around attention blocks",
    ],
  }),

  "multi-head-attention": createLesson({
    concept:
      "Multi-head attention runs several attention operations in parallel — each 'head' learns to focus on different types of relationships (syntax, semantics, position) and their outputs are concatenated.",
    whyItExists:
      "A single attention head can only capture one type of relationship at a time. Multiple heads let the model simultaneously attend to different representation subspaces — one head for subject-verb agreement, another for coreference, another for local context.",
    analogy:
      "A newsroom with multiple reporters covering the same event from different angles — politics, economics, human interest. The editor (concatenation + projection) combines all perspectives into one comprehensive story.",
    technicalExplanation:
      "Instead of one attention with d_model dimensions, use h heads each with d_k = d_model/h dimensions. Each head: Q_i = XW_Q_i, K_i = XW_K_i, V_i = XW_V_i → head_i = Attention(Q_i, K_i, V_i). Concatenate all heads: [head_1; head_2; ...; head_h] → multiply by W_O (output projection) to get d_model output. Typical: 8-16 heads for base models, 96+ for large LLMs. Each head operates in a lower-dimensional subspace, reducing per-head compute while increasing representational diversity.",
    architecture:
      "Input (d_model) → h parallel attention heads (each d_k = d_model/h) → Concatenate (h × d_k = d_model) → Linear W_O (d_model → d_model) → Output.",
    diagram: `flowchart TD
    A[Input X] --> B1[Head 1: Q1 K1 V1]
    A --> B2[Head 2: Q2 K2 V2]
    A --> B3[Head h: Qh Kh Vh]
    B1 --> C1[Attn Output 1]
    B2 --> C2[Attn Output 2]
    B3 --> C3[Attn Output h]
    C1 --> D[Concatenate]
    C2 --> D
    C3 --> D
    D --> E[Linear W_O]
    E --> F[Final Output]`,
    example:
      "In 'The cat sat on the mat because it was comfortable', Head 3 might attend 'it'→'mat' (location), Head 7 might attend 'sat'→'cat' (subject-verb), Head 12 might capture local bigram patterns. Combined, the model understands the full sentence.",
    code: `import torch
import torch.nn as nn

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model: int, num_heads: int):
        super().__init__()
        assert d_model % num_heads == 0
        self.d_k = d_model // num_heads
        self.num_heads = num_heads
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)

    def forward(self, x):
        B, S, D = x.shape
        Q = self.W_q(x).view(B, S, self.num_heads, self.d_k).transpose(1, 2)
        K = self.W_k(x).view(B, S, self.num_heads, self.d_k).transpose(1, 2)
        V = self.W_v(x).view(B, S, self.num_heads, self.d_k).transpose(1, 2)
        scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.d_k ** 0.5)
        weights = torch.softmax(scores, dim=-1)
        out = torch.matmul(weights, V)
        out = out.transpose(1, 2).contiguous().view(B, S, D)
        return self.W_o(out)`,
    project:
      "Implement multi-head attention from scratch. Use BertViz to visualize individual attention heads in BERT and document what linguistic patterns each head captures.",
    interviewQuestions: [
      iq("Why use multiple heads instead of one large attention?", "Multiple heads attend in different learned subspaces simultaneously — capturing diverse relationships (syntax, coreference, position). One head would need to compress all relationship types.", "medium"),
      iq("How is d_k related to d_model and num_heads?", "d_k = d_model / num_heads. Total compute is similar to single-head with full d_model, but representational diversity increases. Standard: d_model=768, heads=12, d_k=64.", "easy"),
      iq("What does the output projection W_O do?", "W_O mixes information across heads after concatenation, allowing the model to combine different attention patterns into a unified representation for the next layer.", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "Multi-head = parallel attention in subspaces",
        "d_k = d_model / num_heads",
        "Concatenate heads → project with W_O",
        "Each head learns different relationship types",
      ],
      fifteenMin: [
        "h heads run simultaneously, not sequentially",
        "Head diversity: syntax, coreference, position",
        "W_Q, W_K, W_V per head (or shared then split)",
        "Output projection mixes head information",
        "GPT-3: 96 heads, d_model=12288",
        "BertViz visualizes per-head patterns",
      ],
      oneHour: [
        "Implement MHA from scratch with reshape tricks",
        "Visualize 12 BERT heads on same sentence",
        "Ablate heads: remove one, measure impact",
        "Compare 4-head vs 16-head on small task",
        "Understand nn.MultiheadAttention API",
        "Connect head count to model size scaling",
      ],
      cheatSheet: [
        "d_k = d_model / h",
        "head_i = Attn(Q_i, K_i, V_i)",
        "out = Concat(heads) @ W_O",
        "Typical: 8-16 heads (base models)",
        "view + transpose for head splitting",
        "W_O mixes cross-head information",
      ],
    },
    glossary: ["Head", "d_k", "Output Projection", "Subspace"],
    commonMistakes: [
      "d_model not divisible by num_heads — reshape fails",
      "Forgetting output projection W_O after concatenation",
      "Assuming each head has a fixed linguistic role — they're learned",
      "Confusing num_heads with num_layers",
    ],
  }),

  encoder: createLesson({
    concept:
      "The transformer encoder processes input sequences with bidirectional self-attention — each token can see all other tokens, producing rich contextual representations for understanding tasks.",
    whyItExists:
      "Understanding tasks (classification, NER, QA) need full context from both directions. The encoder builds deep contextualized representations where each token's embedding encodes information from the entire input sequence.",
    analogy:
      "A team reviewing a document together — everyone reads the full report and discusses it. Each team member's understanding is enriched by seeing the whole picture, not just what came before.",
    technicalExplanation:
      "Encoder stack: N identical layers, each containing (1) Multi-Head Self-Attention (bidirectional, no causal mask), (2) Add & Norm, (3) Position-wise FFN (Linear → GELU → Linear), (4) Add & Norm. Input: token embeddings + positional encoding. Output: contextualized representations for each token. BERT uses encoder-only architecture. Each layer refines representations — lower layers capture syntax, higher layers capture semantics. Encoder output feeds cross-attention in decoder (seq2seq) or classification head (BERT).",
    architecture:
      "Token Embeddings + Positional Encoding → [Encoder Layer × N] → Output Representations. Each Encoder Layer: MHA (bidirectional) → Add&Norm → FFN → Add&Norm.",
    diagram: `flowchart TD
    A[Token Embeddings] --> B[+ Positional Encoding]
    B --> C[Encoder Layer 1]
    C --> D[Encoder Layer 2]
    D --> E[... Layer N]
    E --> F[Contextualized Representations]
    subgraph EL[Each Encoder Layer]
      G[MHA Bidirectional] --> H[Add and Norm]
      H --> I[FFN GELU]
      I --> J[Add and Norm]
    end`,
    example:
      "BERT encoding 'Time flies like an arrow': after 12 encoder layers, the embedding for 'flies' encodes that it's a verb (not insects) because bidirectional attention saw 'arrow' and 'Time' on both sides.",
    code: `from transformers import BertModel, BertTokenizer

tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
model = BertModel.from_pretrained("bert-base-uncased")

text = "Time flies like an arrow"
inputs = tokenizer(text, return_tensors="pt")
outputs = model(**inputs)

# outputs.last_hidden_state: (1, seq_len, 768)
# Each token has a contextualized 768-dim embedding
print(outputs.last_hidden_state.shape)`,
    project:
      "Use BERT encoder to extract embeddings for sentences, then train a simple classifier on top for sentiment analysis. Compare [CLS] token vs mean-pooled embeddings.",
    interviewQuestions: [
      iq("Why is encoder self-attention bidirectional?", "Understanding tasks need context from both left and right. 'bank' meaning depends on words after it too. Bidirectional attention lets each token see the full sequence.", "easy"),
      iq("What is the difference between encoder and decoder stacks?", "Encoder: bidirectional self-attention, sees full input. Decoder: causal self-attention (masked), can only see past tokens. Encoder understands; decoder generates.", "medium"),
      iq("How does BERT use the encoder output?", "BERT adds a [CLS] token whose final hidden state serves as sequence representation for classification. Other tokens' hidden states used for token-level tasks (NER, QA span).", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "Encoder: bidirectional self-attention layers",
        "Each token sees entire input sequence",
        "BERT = encoder-only transformer",
        "Outputs contextualized token embeddings",
      ],
      fifteenMin: [
        "N encoder layers stacked identically",
        "MHA → Add&Norm → FFN → Add&Norm per layer",
        "No causal mask — full visibility",
        "[CLS] token for sequence classification",
        "Lower layers: syntax; higher: semantics",
        "Feeds cross-attention in seq2seq decoders",
      ],
      oneHour: [
        "Trace BERT encoder layer by layer",
        "Extract and visualize token embeddings",
        "Fine-tune BERT encoder for classification",
        "Compare layer 1 vs layer 12 representations",
        "Implement encoder layer from scratch",
        "Understand encoder-only vs encoder-decoder",
      ],
      cheatSheet: [
        "Encoder = bidirectional MHA + FFN",
        "BERT: 12 layers, 768 dim, 12 heads",
        "[CLS] for classification",
        "No causal mask",
        "Add&Norm after each sublayer",
        "Output: (batch, seq_len, d_model)",
      ],
    },
    glossary: ["Bidirectional Attention", "BERT", "[CLS] Token", "Contextualized Embeddings"],
    commonMistakes: [
      "Applying causal mask in encoder — loses bidirectional context",
      "Using encoder for autoregressive generation without modification",
      "Ignoring [CLS] vs mean-pooling tradeoffs for classification",
      "Confusing encoder layers with decoder layers",
    ],
  }),

  decoder: createLesson({
    concept:
      "The transformer decoder generates output sequences token-by-token using causal self-attention (only past tokens) and cross-attention to encoder representations — powering GPT and machine translation.",
    whyItExists:
      "Generation must be autoregressive: predict next token given only previous tokens. The decoder enforces this via causal masking while optionally attending to encoder output for tasks like translation where input and output differ.",
    analogy:
      "Writing a story one sentence at a time — you can only read what you've already written (causal), but you can also refer to your research notes (cross-attention to encoder) for facts.",
    technicalExplanation:
      "Decoder layer has three sublayers: (1) Masked Multi-Head Self-Attention — causal mask prevents attending to future tokens, (2) Cross-Attention — Q from decoder, K/V from encoder output (in seq2seq; absent in GPT), (3) FFN. GPT is decoder-only: stacks N decoder layers with only masked self-attention + FFN. During inference, generate one token at a time, append to sequence, repeat. Training uses teacher forcing: ground-truth previous tokens as input.",
    architecture:
      "Token Embeddings + Positional Encoding → [Decoder Layer × N] → Linear → Softmax(vocab). Decoder Layer: Masked MHA → Add&Norm → Cross-Attention (optional) → Add&Norm → FFN → Add&Norm.",
    diagram: `flowchart TD
    A[Previous Tokens] --> B[+ Positional Encoding]
    B --> C[Masked Self-Attention]
    C --> D[Add and Norm]
    E[Encoder Output] --> F[Cross-Attention]
    D --> F
    F --> G[Add and Norm]
    G --> H[FFN]
    H --> I[Add and Norm]
    I --> J[Linear to Vocab]
    J --> K[Next Token Prediction]`,
    example:
      "GPT generating text: input 'The capital of France is' → decoder processes with causal mask → outputs probability distribution over vocabulary → sample 'Paris' → append → input 'The capital of France is Paris' → continue.",
    code: `from transformers import GPT2LMHeadModel, GPT2Tokenizer

tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")

prompt = "The capital of France is"
inputs = tokenizer(prompt, return_tensors="pt")
outputs = model.generate(**inputs, max_new_tokens=10, do_sample=False)
print(tokenizer.decode(outputs[0]))`,
    project:
      "Implement a causal mask and verify that position i cannot attend to position j where j > i. Generate text with GPT-2 and trace how the context window grows token by token.",
    interviewQuestions: [
      iq("What is teacher forcing during decoder training?", "Feed ground-truth previous tokens as decoder input instead of model's own predictions. Enables parallel training over all positions. At inference, use model's own outputs (exposure bias).", "medium"),
      iq("Why does GPT not need cross-attention?", "GPT is decoder-only for text generation — no separate encoder input. All context comes from the input prompt via masked self-attention. Cross-attention is for encoder-decoder models like original Transformer and T5.", "easy"),
      iq("What is exposure bias in autoregressive models?", "Training uses ground-truth context; inference uses model's own (potentially wrong) outputs. Errors compound over generation. Mitigated by scheduled sampling, RL fine-tuning (RLHF).", "hard"),
    ],
    revisionNotes: {
      fiveMin: [
        "Decoder generates tokens left-to-right",
        "Causal mask: only attend to past tokens",
        "GPT = decoder-only transformer",
        "Cross-attention connects to encoder in seq2seq",
      ],
      fifteenMin: [
        "Masked MHA → Cross-Attn → FFN per layer",
        "Teacher forcing for parallel training",
        "Autoregressive inference: one token at a time",
        "Exposure bias: train/inference mismatch",
        "GPT has no cross-attention layer",
        "Final linear projects to vocabulary size",
      ],
      oneHour: [
        "Implement causal mask from scratch",
        "Generate text step-by-step with GPT-2",
        "Compare decoder-only vs encoder-decoder",
        "Understand teacher forcing vs free running",
        "Trace token-by-token context growth",
        "Connect decoder to RLHF fine-tuning",
      ],
      cheatSheet: [
        "Causal mask: tril(ones(n,n))",
        "GPT: decoder-only, no cross-attn",
        "Generate: append token, re-forward",
        "Teacher forcing at train time",
        "LM head: d_model → vocab_size",
        "T5: encoder-decoder architecture",
      ],
    },
    glossary: ["Causal Masking", "Teacher Forcing", "Autoregressive", "Cross-Attention"],
    commonMistakes: [
      "Removing causal mask during GPT training — information leakage",
      "Using teacher forcing at inference time — not possible without ground truth",
      "Expecting decoder to see future tokens during generation",
      "Confusing GPT (decoder-only) with full encoder-decoder",
    ],
  }),

  "positional-encoding": createLesson({
    concept:
      "Positional encoding injects information about token order into transformer models — which lack the inherent sequential processing of RNNs and need to know that 'cat sat' differs from 'sat cat'.",
    whyItExists:
      "Self-attention is permutation-invariant: shuffling input tokens gives the same attention patterns (just reordered). Without position information, the model cannot distinguish word order — catastrophic for language.",
    analogy:
      "A bag of words vs a sentence. Attention alone treats input like a bag — positional encoding adds seat numbers so the model knows who sits where in the sentence.",
    technicalExplanation:
      "Original Transformer: sinusoidal PE — PE(pos, 2i) = sin(pos/10000^(2i/d)), PE(pos, 2i+1) = cos(...). Added to token embeddings before first layer. Fixed, not learned. RoPE (modern): encodes position in attention by rotating Q and K vectors — relative position emerges naturally. Learned embeddings: trainable position vectors (like token embeddings). ALiBi: attention bias based on distance — no explicit encoding. GPT uses learned positional embeddings; LLaMA/Mistral use RoPE.",
    architecture:
      "Token Embedding (d_model) + Positional Encoding (d_model) → Combined Input → Transformer Layers. Addition (not concatenation) is standard for sinusoidal/learned PE.",
    diagram: `flowchart LR
    A[Token ID] --> B[Token Embedding]
    C[Position Index] --> D{PE Type}
    D -->|Sinusoidal| E[sin/cos functions]
    D -->|Learned| F[Position Embedding Table]
    D -->|RoPE| G[Rotate Q and K in Attention]
    B --> H[Add]
    E --> H
    F --> H
    H --> I[Input to Transformer]`,
    example:
      "Without PE: 'dog bites man' and 'man bites dog' produce identical attention patterns. With PE: position 0's encoding differs from position 2's, so the model learns subject-verb-object structure.",
    code: `import torch
import math

def sinusoidal_pe(seq_len: int, d_model: int) -> torch.Tensor:
    pe = torch.zeros(seq_len, d_model)
    position = torch.arange(seq_len).unsqueeze(1).float()
    div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
    pe[:, 0::2] = torch.sin(position * div_term)
    pe[:, 1::2] = torch.cos(position * div_term)
    return pe

pe = sinusoidal_pe(128, 512)
token_emb = torch.randn(128, 512)
input_emb = token_emb + pe  # element-wise addition`,
    project:
      "Implement sinusoidal and learned positional embeddings. Train a tiny transformer with and without positional encoding on a word-order-sensitive task and compare accuracy.",
    interviewQuestions: [
      iq("Why add positional encoding instead of concatenating?", "Addition preserves dimensionality (d_model stays same). Sinusoidal PE allows extrapolation to longer sequences than seen in training. Concatenation would increase input dimension.", "medium"),
      iq("What problem does RoPE solve over absolute positional encoding?", "RoPE encodes relative position in attention via rotation matrices. Better length generalization and naturally captures relative distance — used in LLaMA, Mistral, modern LLMs.", "medium"),
      iq("Why is attention permutation-invariant without PE?", "Attention computes pairwise relationships based on content (Q·K) only. Swapping two input rows swaps two output rows identically — no way to know original order.", "easy"),
    ],
    revisionNotes: {
      fiveMin: [
        "PE tells transformer where each token is in sequence",
        "Added to token embeddings before layers",
        "Sinusoidal (original) vs learned (GPT) vs RoPE (modern)",
        "Without PE, word order is lost",
      ],
      fifteenMin: [
        "sin/cos PE: fixed, extrapolates to longer seqs",
        "Learned PE: trainable, limited to max_position",
        "RoPE: rotation in attention, relative position",
        "ALiBi: distance-based attention bias",
        "Addition not concatenation",
        "GPT-2: learned, max 1024 positions",
      ],
      oneHour: [
        "Implement sinusoidal PE from formula",
        "Compare learned vs sinusoidal on small task",
        "Understand RoPE rotation intuition",
        "Test extrapolation beyond trained length",
        "Trace PE in HuggingFace model config",
        "Connect PE choice to context length limits",
      ],
      cheatSheet: [
        "input = token_emb + pos_emb",
        "Sinusoidal: sin/cos of position",
        "Learned: nn.Embedding(max_len, d)",
        "RoPE: rotate Q,K by position",
        "ALiBi: linear attention bias",
        "Permutation-invariant without PE",
      ],
    },
    glossary: ["Sinusoidal Encoding", "Learned Positional Embeddings", "ALiBi", "Permutation Invariance"],
    commonMistakes: [
      "Forgetting positional encoding entirely in custom transformers",
      "Using learned PE beyond max_position_embeddings — out of range",
      "Confusing RoPE (applied in attention) with additive PE",
      "Assuming all modern LLMs use the same PE method",
    ],
  }),

  "transformer-architecture": createLesson({
    concept:
      "The transformer is the foundational architecture behind all modern LLMs — replacing recurrence with stacked attention and feed-forward layers that process sequences in parallel.",
    whyItExists:
      "RNNs/LSTMs were sequential (slow to train), struggled with long-range dependencies, and hard to parallelize on GPUs. Transformers solve all three: parallelizable, direct long-range connections via attention, and infinitely stackable.",
    analogy:
      "RNNs are like reading a book one word at a time, remembering in your head. Transformers are like having the entire book spread on a table, with highlighters connecting related passages instantly — all at once.",
    technicalExplanation:
      "Original 'Attention Is All You Need' (2017): Encoder-Decoder for translation. Modern LLM variants: Encoder-only (BERT), Decoder-only (GPT), Encoder-Decoder (T5). Core building block: Transformer Layer = Attention + FFN + Residual + LayerNorm. Decoder-only (GPT): N × (Masked MHA → Add&Norm → FFN → Add&Norm) → LM Head. Key hyperparameters: d_model (hidden dim), num_layers, num_heads, d_ff (FFN inner dim, typically 4×d_model), vocab_size, max_seq_len. Scaling laws: more parameters + more data = better performance predictably.",
    architecture:
      "Input → Embedding + PE → N Transformer Blocks → Output Head. Each Block: Multi-Head Attention → Dropout → Add&Norm → FFN (up-project → activation → down-project) → Dropout → Add&Norm.",
    diagram: `flowchart TD
    A[Input Tokens] --> B[Token Embedding + PE]
    B --> C[Transformer Block 1]
    C --> D[Transformer Block 2]
    D --> E[... Block N]
    E --> F[Layer Norm]
    F --> G[LM Head: Linear to Vocab]
    G --> H[Softmax: Next Token Probs]
    subgraph TB[Transformer Block]
      I[Multi-Head Attention] --> J[+ Norm]
      J --> K[FFN 4x expand]
      K --> L[+ Norm]
    end`,
    example:
      "GPT-3: 96 layers, d_model=12288, 96 heads, d_ff=49152, vocab=50257. Input 'Write a poem about' → 96 transformer blocks process → LM head outputs logits over 50257 tokens → 'the' sampled → append and repeat.",
    code: `from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "gpt2"  # 12 layers, 768 dim, 12 heads
model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Model architecture summary
print(f"Layers: {model.config.n_layer}")
print(f"Hidden size: {model.config.n_embd}")
print(f"Attention heads: {model.config.n_head}")
print(f"FFN dim: {model.config.n_inner or model.config.n_embd * 4}")
print(f"Vocab size: {model.config.vocab_size}")`,
    project:
      "Build a 'nano-GPT': implement a complete decoder-only transformer from scratch in PyTorch (~300 lines). Train on a small text corpus and generate samples.",
    interviewQuestions: [
      iq("What are the three transformer architecture variants?", "Encoder-only (BERT): bidirectional understanding. Decoder-only (GPT): autoregressive generation. Encoder-Decoder (T5, BART): understanding + generation for seq2seq.", "easy"),
      iq("Why do transformers use residual connections and layer normalization?", "Residual connections enable gradient flow through deep stacks (100+ layers). LayerNorm stabilizes activations and accelerates training. Pre-norm (norm before sublayer) is more stable for deep models.", "medium"),
      iq("How do scaling laws relate to transformer architecture?", "Performance improves predictably as parameters, data, and compute increase (power laws). Motivates building bigger models: GPT-2 (1.5B) → GPT-3 (175B) → GPT-4 (rumored 1T+ MoE).", "hard"),
    ],
    revisionNotes: {
      fiveMin: [
        "Transformer = Attention + FFN, stacked N times",
        "Three variants: encoder, decoder, encoder-decoder",
        "GPT = decoder-only, BERT = encoder-only",
        "Parallelizable — no sequential recurrence",
      ],
      fifteenMin: [
        "Each block: MHA → Add&Norm → FFN → Add&Norm",
        "d_ff typically 4× d_model",
        "Residual connections for deep networks",
        "LM head: final linear to vocab_size",
        "Scaling laws: bigger = better (predictably)",
        "Dropout for regularization during training",
      ],
      oneHour: [
        "Walk through 'Attention Is All You Need' paper",
        "Build nano-GPT from scratch",
        "Compare BERT vs GPT vs T5 architectures",
        "Profile memory and compute per layer",
        "Understand pre-norm vs post-norm",
        "Map GPT-2/3/4 architectural differences",
      ],
      cheatSheet: [
        "Block: Attn → Norm → FFN → Norm",
        "GPT: decoder-only, causal mask",
        "BERT: encoder-only, bidirectional",
        "d_ff = 4 × d_model (typical)",
        "Residual: x + sublayer(x)",
        "Scaling laws: params ∝ performance",
      ],
    },
    glossary: ["Transformer Block", "Residual Connection", "Layer Normalization", "Scaling Laws"],
    commonMistakes: [
      "Confusing encoder-only with decoder-only use cases",
      "Omitting residual connections in custom implementations",
      "Not accounting for FFN's 4× memory expansion",
      "Assuming all transformers have encoder AND decoder",
    ],
  }),

  word2vec: createLesson({
    concept:
      "Word2Vec learns dense vector representations of words where semantic similarity corresponds to geometric proximity — 'king - man + woman ≈ queen' — laying groundwork for modern embeddings.",
    whyItExists:
      "One-hot encoding gives sparse, high-dimensional, semantically meaningless vectors. Word2Vec learns that words appearing in similar contexts have similar meanings, producing compact embeddings that capture semantic relationships.",
    analogy:
      "Plotting cities on a map: Paris and London are close (both European capitals), far from Tokyo. Word2Vec creates a 'semantic map' where similar words cluster together in vector space.",
    technicalExplanation:
      "Two architectures: CBOW (predict word from context) and Skip-gram (predict context from word). Training: sliding window over corpus, maximize P(context|word) via negative sampling (contrast with random non-context words). Result: embedding matrix where each word maps to a dense vector (typically 100-300 dims). Properties: linear analogies (king-man+woman≈queen), clustering of synonyms. Limitations: one vector per word (no context sensitivity — 'bank' river vs money), no subword handling. Superseded by contextual embeddings (ELMo, BERT) but intuition remains foundational.",
    architecture:
      "Input word (one-hot) → Embedding lookup → Hidden layer → Output softmax over vocabulary (Skip-gram) or reverse (CBOW). Negative sampling replaces expensive full softmax.",
    diagram: `flowchart LR
    A[Target Word: king] --> B[Embedding Vector]
    B --> C[Dot Product with Context]
    C --> D{Positive or Negative?}
    D -->|Context: queen| E[Maximize Score]
    D -->|Random: table| F[Minimize Score]
    E --> G[Updated Embeddings]
    F --> G`,
    example:
      "Training on 'The king ruled the kingdom': Skip-gram with window=2 learns 'king' embedding predicts 'The', 'ruled'. After training, vector('king') - vector('man') + vector('woman') ≈ vector('queen').",
    code: `from gensim.models import Word2Vec

sentences = [
    ["king", "rules", "the", "kingdom"],
    ["queen", "rules", "the", "kingdom"],
    ["man", "works", "in", "the", "field"],
    ["woman", "works", "in", "the", "field"],
]

model = Word2Vec(sentences, vector_size=100, window=2, min_count=1, epochs=100)

# Semantic similarity
print(model.wv.similarity("king", "queen"))

# Linear analogy
result = model.wv.most_similar(
    positive=["king", "woman"], negative=["man"], topn=1
)
print(result)`,
    project:
      "Train Word2Vec on a Wikipedia subset. Evaluate with word analogies (king-man+woman=queen), visualize embeddings with t-SNE, and compare with static vs contextual embeddings from BERT.",
    interviewQuestions: [
      iq("What is the difference between CBOW and Skip-gram?", "CBOW predicts target word from surrounding context (faster, better for frequent words). Skip-gram predicts context from target word (better for rare words, more training data per word).", "medium"),
      iq("What is negative sampling and why is it needed?", "Full softmax over 100K+ vocabulary is expensive. Negative sampling trains on k random 'negative' words instead, approximating the loss efficiently. Makes Word2Vec training tractable.", "medium"),
      iq("Why did Word2Vec get replaced by contextual embeddings?", "Word2Vec assigns one vector per word regardless of context — 'bank' always same vector. Contextual models (BERT) produce different vectors based on surrounding words, resolving ambiguity.", "easy"),
    ],
    revisionNotes: {
      fiveMin: [
        "Word2Vec: dense word vectors from co-occurrence",
        "Similar context → similar vectors",
        "Skip-gram and CBOW architectures",
        "Static embeddings — one vector per word",
      ],
      fifteenMin: [
        "Negative sampling for efficient training",
        "Linear analogies: king-man+woman≈queen",
        "Window size controls context breadth",
        "vector_size typically 100-300",
        "Limitation: no context sensitivity",
        "Foundation for embedding layer in transformers",
      ],
      oneHour: [
        "Train Word2Vec on real corpus",
        "Evaluate analogy test set",
        "t-SNE visualization of word clusters",
        "Compare static vs BERT contextual embeddings",
        "Implement Skip-gram with negative sampling",
        "Understand path to subword embeddings (BPE)",
      ],
      cheatSheet: [
        "Skip-gram: word → context",
        "CBOW: context → word",
        "Negative sampling: k random negatives",
        "window=5 typical",
        "Static: one vec per word",
        "gensim Word2Vec API",
      ],
    },
    glossary: ["Skip-gram", "CBOW", "Negative Sampling", "Static Embeddings"],
    commonMistakes: [
      "Using Word2Vec for polysemous words without context disambiguation",
      "Expecting one embedding to capture all word senses",
      "Skipping negative sampling — training becomes impractically slow",
      "Confusing Word2Vec embeddings with transformer token embeddings",
    ],
  }),

  bert: createLesson({
    concept:
      "BERT (Bidirectional Encoder Representations from Transformers) is an encoder-only model pre-trained with masked language modeling — producing deep contextual embeddings that revolutionized NLP understanding tasks.",
    whyItExists:
      "Before BERT, NLP models were either unidirectional (GPT) or shallow (Word2Vec). BERT reads text bidirectionally and produces context-dependent representations — enabling state-of-the-art fine-tuning on classification, NER, QA with minimal task-specific architecture.",
    analogy:
      "Word2Vec gives each word a fixed dictionary definition. BERT is like a skilled reader who understands each word based on the full paragraph — 'bank' means river edge or financial institution depending on context.",
    technicalExplanation:
      "Pre-training objectives: (1) Masked Language Model (MLM) — randomly mask 15% of tokens, predict them using bidirectional context. (2) Next Sentence Prediction (NSP) — is sentence B after A? Fine-tuning: add task-specific head on [CLS] or token outputs. Architecture: encoder-only, 12 layers (base) or 24 (large), 768/1024 dim. Input: [CLS] sent1 [SEP] sent2 [SEP]. Variants: RoBERTa (no NSP, more data), DistilBERT (smaller, faster), ALBERT (parameter sharing). BERT embeddings power semantic search, classification, and as encoder in early RAG systems.",
    architecture:
      "[CLS] + tokens + [SEP] → Token Embeddings + Segment Embeddings + Position Embeddings → 12/24 Encoder Layers → Task Head ([CLS] for classification, token outputs for NER/QA).",
    diagram: `flowchart TD
    A["[CLS] The cat sat [SEP] It was happy [SEP]"] --> B[Token + Segment + Position Embeddings]
    B --> C[Encoder Layer x12]
    C --> D[Contextualized Hidden States]
    D --> E{Fine-tune Task}
    E -->|Classification| F["[CLS] -> Linear -> Classes"]
    E -->|NER| G[Each Token -> Labels]
    E -->|QA| H[Start/End Span Prediction]`,
    example:
      "Fine-tuning BERT for sentiment: input '[CLS] This movie was fantastic [SEP]' → 12 encoder layers → take [CLS] hidden state (768-dim) → linear layer → 2 classes (positive/negative). Achieves 95%+ on SST-2 with minimal training.",
    code: `from transformers import BertForSequenceClassification, BertTokenizer, Trainer
from datasets import load_dataset

model = BertForSequenceClassification.from_pretrained(
    "bert-base-uncased", num_labels=2
)
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

dataset = load_dataset("imdb", split="train[:1000]")
def tokenize(ex):
    return tokenizer(ex["text"], truncation=True, padding="max_length", max_length=128)
tokenized = dataset.map(tokenize, batched=True)

trainer = Trainer(model=model, train_dataset=tokenized, args=TrainingArguments(output_dir="./bert", num_train_epochs=1))
# trainer.train()`,
    project:
      "Fine-tune BERT-base on a text classification dataset (IMDB or AG News). Compare performance with and without fine-tuning. Extract embeddings for semantic similarity search.",
    interviewQuestions: [
      iq("How does BERT's MLM differ from GPT's language modeling?", "BERT masks random tokens and predicts them using bidirectional context. GPT predicts next token using only left context. BERT understands; GPT generates.", "easy"),
      iq("What is the purpose of the [CLS] token?", "[CLS] is a special token whose final hidden state aggregates sequence-level information. Used as input to classification heads. Its embedding represents the entire input sequence.", "medium"),
      iq("Why is BERT not suitable for text generation?", "BERT uses bidirectional attention — each token sees future tokens. Generation requires causal (left-only) attention. Using BERT for generation would leak future information.", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "BERT = encoder-only, bidirectional",
        "Pre-trained with Masked Language Model",
        "[CLS] token for classification",
        "Fine-tune on downstream tasks with small head",
      ],
      fifteenMin: [
        "MLM: mask 15%, predict from bidirectional context",
        "NSP: predict if sentence B follows A",
        "Token + Segment + Position embeddings",
        "bert-base: 12 layers, 768 dim, 110M params",
        "Not for generation — bidirectional",
        "RoBERTa, DistilBERT are popular variants",
      ],
      oneHour: [
        "Fine-tune BERT for classification end-to-end",
        "Extract embeddings for semantic search",
        "Compare BERT vs GPT embeddings on same text",
        "Implement MLM masking logic",
        "Evaluate on NER or QA task",
        "Understand BERT's role in early RAG pipelines",
      ],
      cheatSheet: [
        "BERT: encoder-only, bidirectional",
        "MLM: mask 15%, predict",
        "[CLS] for classification",
        "bert-base: 110M params",
        "Fine-tune: add task head, train",
        "Not autoregressive — no generation",
      ],
    },
    glossary: ["MLM", "[CLS] Token", "Fine-tuning", "Contextual Embeddings"],
    commonMistakes: [
      "Using BERT for autoregressive text generation",
      "Not using [CLS] for sequence classification tasks",
      "Forgetting segment embeddings for sentence-pair tasks",
      "Confusing BERT pre-training with fine-tuning objectives",
    ],
  }),

  gpt: createLesson({
    concept:
      "GPT (Generative Pre-trained Transformer) is a decoder-only autoregressive model trained to predict the next token — the architecture family behind ChatGPT and virtually all modern text-generating LLMs.",
    whyItExists:
      "A single generative model that learns from unlabeled text can perform any language task via prompting — no task-specific architecture needed. Scaling GPT from 117M (GPT-1) to 175B (GPT-3) parameters unlocked emergent capabilities like in-context learning and chain-of-thought reasoning.",
    analogy:
      "A student who learned by reading billions of books and can now write essays, answer questions, and solve problems — all by continuing text naturally, without being explicitly taught each skill.",
    technicalExplanation:
      "Architecture: decoder-only transformer. Pre-training: causal language modeling — predict token t given tokens 1..t-1. Training objective: minimize cross-entropy over next-token prediction on massive text corpora. Post-training: SFT (supervised fine-tuning on instruction-response pairs) → RLHF (reinforcement learning from human feedback) for alignment. Key insight from GPT-3: in-context learning — model learns from examples in the prompt without weight updates. Scaling: GPT-1 (117M) → GPT-2 (1.5B) → GPT-3 (175B) → GPT-4 (MoE, undisclosed). Each scale jump unlocks new capabilities.",
    architecture:
      "Token Embedding + Positional Encoding → N Decoder Layers (Masked MHA + FFN) → Layer Norm → Linear (d_model → vocab_size) → Softmax. Generation: sample token, append, repeat.",
    diagram: `flowchart TD
    A[Pre-training: Next Token Prediction] --> B[Base GPT Model]
    B --> C[SFT: Instruction Fine-tuning]
    C --> D[RLHF: Human Preference Alignment]
    D --> E[ChatGPT / Production LLM]
    subgraph Gen[Autoregressive Generation]
      F[Prompt Tokens] --> G[Decoder Layers]
      G --> H[Sample Next Token]
      H --> I[Append to Sequence]
      I --> F
    end`,
    example:
      "GPT-3 in-context learning: prompt 'Translate to French: hello → bonjour, goodbye →' → model generates 'au revoir' without any fine-tuning, learning the pattern from the single example in context.",
    code: `from openai import OpenAI

client = OpenAI()

# GPT-4 via API — decoder-only generation
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain GPT in one sentence."},
    ],
    temperature=0.7,
    max_tokens=100,
)
print(response.choices[0].message.content)

# In-context learning example
few_shot = """Classify sentiment:
Text: I love this! Sentiment: positive
Text: This is terrible. Sentiment: negative
Text: Best day ever! Sentiment:"""`,
    project:
      "Build a few-shot classifier using GPT via API: provide 5 labeled examples in the prompt, classify 20 test samples. Measure accuracy vs a fine-tuned BERT model.",
    interviewQuestions: [
      iq("What is in-context learning in GPT-3?", "The model learns tasks from examples in the prompt without weight updates. Provide input-output pairs in context, and the model continues the pattern. Emerges at scale (billions of parameters).", "medium"),
      iq("What is the GPT training pipeline from pre-training to ChatGPT?", "Pre-training (next-token prediction on web text) → SFT (fine-tune on instruction-response pairs) → RLHF (reward model + PPO to align with human preferences). Each stage adds capabilities.", "hard"),
      iq("Why is GPT decoder-only instead of encoder-decoder?", "Decoder-only with causal attention is simpler and scales better. A single unified model handles all tasks via prompting. Encoder-decoder adds complexity without clear benefit at scale.", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "GPT = decoder-only, autoregressive",
        "Trained to predict next token",
        "Pre-train → SFT → RLHF pipeline",
        "In-context learning at scale",
      ],
      fifteenMin: [
        "Causal LM: P(token_t | tokens_1..t-1)",
        "GPT-1/2/3/4 scaling progression",
        "SFT: instruction following fine-tune",
        "RLHF: align with human preferences",
        "Few-shot via prompt examples",
        "Temperature controls generation randomness",
      ],
      oneHour: [
        "Trace GPT training pipeline end-to-end",
        "Experiment with few-shot prompting",
        "Compare GPT-3.5 vs GPT-4 capabilities",
        "Implement autoregressive generation loop",
        "Understand emergent abilities at scale",
        "Build simple ChatGPT clone with API",
      ],
      cheatSheet: [
        "GPT: decoder-only, causal LM",
        "Pre-train → SFT → RLHF",
        "In-context learning: examples in prompt",
        "GPT-3: 175B params",
        "temperature: 0=deterministic, 1=creative",
        "max_tokens limits output length",
      ],
    },
    glossary: ["Autoregressive", "In-Context Learning", "SFT", "RLHF"],
    commonMistakes: [
      "Expecting small GPT models to do few-shot learning — needs scale",
      "Confusing pre-training with fine-tuning objectives",
      "Using high temperature for factual/reasoning tasks",
      "Assuming GPT 'understands' — it predicts likely next tokens",
    ],
  }),

  inference: createLesson({
    concept:
      "Inference is the process of running a trained model to generate predictions — for LLMs, this means autoregressive token-by-token generation with careful optimization for latency, throughput, and memory.",
    whyItExists:
      "Training happens once; inference runs millions of times in production. Serving LLMs requires optimizing for speed (tokens/second), cost (GPU hours), and quality — different from training optimization.",
    analogy:
      "Training is studying for an exam. Inference is taking the exam — you need to be fast, accurate, and efficient. You can't spend 10 minutes per answer in a timed test.",
    technicalExplanation:
      "Autoregressive loop: (1) tokenize input, (2) forward pass through model, (3) get logits for next token, (4) sample/select token (greedy, top-k, top-p, temperature), (5) append to sequence, (6) repeat until EOS or max_tokens. Key metrics: TTFT (time to first token), TPS (tokens per second), latency P50/P99. Optimizations: KV cache (avoid recomputing past keys/values), batching (process multiple requests), quantization (INT8/INT4 weights), speculative decoding (draft model proposes, main model verifies). Frameworks: vLLM, TGI, TensorRT-LLM, llama.cpp.",
    architecture:
      "Request → Tokenizer → Model Forward Pass → Sampling → Detokenizer → Response. Production: API gateway → request queue → GPU batch scheduler → model server → streaming response.",
    diagram: `flowchart TD
    A[User Prompt] --> B[Tokenize]
    B --> C[Forward Pass with KV Cache]
    C --> D[Logits for Next Token]
    D --> E{Sampling Strategy}
    E -->|Greedy| F[Argmax]
    E -->|Top-p| G[Nucleus Sampling]
    F --> H[Append Token]
    G --> H
    H --> I{EOS or Max Tokens?}
    I -->|No| C
    I -->|Yes| J[Detokenize and Return]`,
    example:
      "Serving GPT-4 API: user sends 500-token prompt. TTFT ~300ms (prefill phase processes all input tokens). Then ~50 tokens/sec generation. Total for 200 output tokens: ~4.3 seconds. Batching 8 requests doubles throughput.",
    code: `import time
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model = AutoModelForCausalLM.from_pretrained("gpt2")
tokenizer = AutoTokenizer.from_pretrained("gpt2")

prompt = "The future of AI is"
inputs = tokenizer(prompt, return_tensors="pt")

start = time.time()
with torch.no_grad():
    outputs = model.generate(
        **inputs,
        max_new_tokens=50,
        do_sample=True,
        temperature=0.7,
        top_p=0.9,
    )
elapsed = time.time() - start
tokens = outputs.shape[1] - inputs.input_ids.shape[1]
print(f"Generated {tokens} tokens in {elapsed:.2f}s ({tokens/elapsed:.1f} tok/s)")`,
    project:
      "Benchmark inference speed of a local model (GPT-2 or Llama) with and without KV cache. Measure TTFT and tokens/sec for prompts of varying lengths (100, 500, 2000 tokens).",
    interviewQuestions: [
      iq("What is the difference between prefill and decode phases?", "Prefill: process entire input prompt in parallel (compute-bound). Decode: generate one token at a time, each needing a full forward pass (memory-bandwidth-bound). TTFT dominated by prefill; TPS dominated by decode.", "medium"),
      iq("What sampling strategies exist for token generation?", "Greedy (argmax — deterministic), top-k (sample from top k tokens), top-p/nucleus (sample from smallest set whose cumulative prob ≥ p), temperature (scale logits before softmax).", "easy"),
      iq("How does batching improve inference throughput?", "Multiple requests processed simultaneously on GPU. Prefill batches are compute-efficient; decode batches amortize memory bandwidth. Continuous batching (vLLM) adds/removes requests dynamically.", "hard"),
    ],
    revisionNotes: {
      fiveMin: [
        "Inference = using trained model to generate output",
        "Autoregressive: one token at a time",
        "TTFT and tokens/sec are key metrics",
        "KV cache avoids recomputing past tokens",
      ],
      fifteenMin: [
        "Prefill phase: parallel input processing",
        "Decode phase: sequential token generation",
        "Greedy vs top-p vs temperature sampling",
        "Batching improves GPU utilization",
        "Quantization reduces memory and speeds inference",
        "vLLM, TGI for production serving",
      ],
      oneHour: [
        "Benchmark model with/without KV cache",
        "Implement greedy and top-p sampling",
        "Measure TTFT vs generation speed",
        "Set up vLLM or Ollama for local serving",
        "Compare FP16 vs INT8 inference speed",
        "Design API with streaming responses",
      ],
      cheatSheet: [
        "Prefill: process prompt (TTFT)",
        "Decode: generate tokens (TPS)",
        "Greedy: argmax, deterministic",
        "top_p=0.9: nucleus sampling",
        "temperature: 0=factual, 1=creative",
        "torch.no_grad() for inference",
      ],
    },
    glossary: ["TTFT", "Tokens Per Second", "Prefill", "Decode Phase"],
    commonMistakes: [
      "Not using torch.no_grad() during inference — wastes memory",
      "Recomputing full attention without KV cache — O(n²) per token",
      "Using high temperature for factual extraction tasks",
      "Ignoring batch size effects on latency vs throughput",
    ],
  }),

  "kv-cache": createLesson({
    concept:
      "KV cache stores previously computed Key and Value tensors during autoregressive generation — avoiding redundant recomputation and making inference O(n) per token instead of O(n²).",
    whyItExists:
      "Without caching, generating token 100 requires recomputing attention for all 99 previous tokens. KV cache stores each layer's K and V matrices, appending only the new token's K/V each step. Critical for production inference speed.",
    analogy:
      "Instead of re-reading an entire book from page 1 every time you want to write the next sentence, you keep bookmarks (cache) at each page you've already read and only read the new page.",
    technicalExplanation:
      "During decode: for each new token, compute Q, K, V for that token only. Append new K, V to cached K, V from all previous tokens. Attention: Q_new @ [K_cache; K_new]ᵀ → softmax → weighted sum of [V_cache; V_new]. Memory cost: 2 × num_layers × num_heads × seq_len × d_k × bytes_per_element. For Llama-70B at 4096 context: ~10GB just for KV cache. Optimizations: Multi-Query Attention (MQA), Grouped-Query Attention (GQA) reduce KV heads, PagedAttention (vLLM) manages cache like virtual memory.",
    architecture:
      "Prefill: compute K,V for all prompt tokens, store in cache. Decode loop: new token → compute Q,K,V → append K,V to cache → attend over full cached K,V → output token → repeat.",
    diagram: `flowchart TD
    A[Prefill: Process Full Prompt] --> B[Store K,V for all prompt tokens]
    B --> C[Generate Token 1]
    C --> D[Compute Q1,K1,V1]
    D --> E[Append K1,V1 to Cache]
    E --> F[Attend: Q1 x All Cached K,V]
    F --> G[Output Token 1]
    G --> H[Generate Token 2]
    H --> I[Compute Q2,K2,V2 only]
    I --> J[Append to Cache]
    J --> K[Attend over Growing Cache]`,
    example:
      "Generating 100 tokens without cache: 1+2+3+...+100 = 5050 attention computations. With KV cache: 100 (one per new token). ~50× speedup for long sequences.",
    code: `import torch

# Simplified KV cache concept
class KVCache:
    def __init__(self):
        self.keys = []
        self.values = []

    def update(self, k, v):
        self.keys.append(k)
        self.values.append(v)
        return torch.cat(self.keys, dim=2), torch.cat(self.values, dim=2)

cache = KVCache()
# Prefill: process prompt tokens, populate cache
# Decode: for each new token
for step in range(5):
    q = torch.randn(1, 8, 1, 64)  # query for new token only
    k = torch.randn(1, 8, 1, 64)  # key for new token only
    v = torch.randn(1, 8, 1, 64)  # value for new token only
    all_k, all_v = cache.update(k, v)
  # attention: q @ all_k.T -> softmax -> @ all_v`,
    project:
      "Implement autoregressive generation with and without KV cache. Measure tokens/sec for generating 200 tokens and calculate the speedup ratio.",
    interviewQuestions: [
      iq("Why does KV cache reduce computation but increase memory?", "Cache stores all previous K,V tensors — memory grows linearly with sequence length. But each decode step only computes one new Q,K,V instead of recomputing all — compute drops from O(n²) to O(n) per step.", "medium"),
      iq("What is Grouped-Query Attention (GQA)?", "Multiple query heads share one key-value head group. Reduces KV cache size (fewer K,V heads to store) while maintaining most of multi-head attention quality. Used in Llama 2/3.", "hard"),
      iq("What is PagedAttention in vLLM?", "Manages KV cache in non-contiguous memory pages (like OS virtual memory). Enables efficient memory sharing, reduces fragmentation, and allows larger batch sizes.", "hard"),
    ],
    revisionNotes: {
      fiveMin: [
        "KV cache stores past Key and Value tensors",
        "Avoids recomputing attention for previous tokens",
        "Essential for fast autoregressive inference",
        "Memory grows linearly with sequence length",
      ],
      fifteenMin: [
        "Prefill: compute and cache all prompt K,V",
        "Decode: append one K,V per new token",
        "Memory: 2 × layers × heads × seq × d_k",
        "MQA/GQA reduce cache size",
        "PagedAttention: vLLM memory management",
        "~50× speedup for long generation",
      ],
      oneHour: [
        "Implement KV cache from scratch",
        "Benchmark with/without cache",
        "Calculate KV cache memory for Llama-70B",
        "Understand MQA vs MHA vs GQA tradeoffs",
        "Explore vLLM PagedAttention docs",
        "Profile memory during long generation",
      ],
      cheatSheet: [
        "Cache K,V per layer per token",
        "Prefill: batch all prompt tokens",
        "Decode: one token at a time",
        "GQA: shared KV heads",
        "PagedAttention: vLLM",
        "Memory ∝ seq_len × layers × heads",
      ],
    },
    glossary: ["KV Cache", "GQA", "PagedAttention", "Prefill"],
    commonMistakes: [
      "Not using KV cache in production — inference is unusably slow",
      "Underestimating KV cache memory for long contexts",
      "Confusing KV cache with model weight caching",
      "Forgetting cache invalidation when context changes mid-conversation",
    ],
  }),

  rope: createLesson({
    concept:
      "RoPE (Rotary Position Embedding) encodes token position by rotating query and key vectors in attention — enabling relative position awareness and better length generalization than absolute positional encodings.",
    whyItExists:
      "Absolute positional embeddings (sinusoidal, learned) don't generalize well beyond training length and don't naturally encode relative distance. RoPE bakes relative position into the attention mechanism itself via rotation matrices.",
    analogy:
      "Instead of giving each person a fixed seat number (absolute position), RoPE measures the angle between two people — the relative distance matters more than absolute seat numbers for understanding relationships.",
    technicalExplanation:
      "For position m, rotate Q and K vectors by angle mθ_i where θ_i = 10000^(-2i/d). The dot product Q_m · K_n depends only on relative position (m-n) because rotations compose: R(m)ᵀR(n) = R(n-m). Applied to pairs of dimensions in Q and K before computing attention scores. Benefits: relative position encoding, length extrapolation (with scaling tricks like NTK-aware), no additional parameters. Used in LLaMA, Mistral, GPT-NeoX, PaLM. YaRN and LongRoPE extend context beyond training length.",
    architecture:
      "Standard attention but Q,K rotated by position-dependent angles before QKᵀ. Applied per-head, per-layer. No separate positional embedding added to input — position is in the attention computation.",
    diagram: `flowchart LR
    A[Query at pos m] --> B[Rotate by m*theta]
    C[Key at pos n] --> D[Rotate by n*theta]
    B --> E[Dot Product]
    D --> E
    E --> F["Depends on (m-n) only"]
    F --> G[Relative Position Encoded]`,
    example:
      "In LLaMA-2 with RoPE: attention between 'cat' (pos 3) and 'sat' (pos 4) encodes relative distance of 1. Same relative encoding applies whether they appear at positions 3-4 or 300-301 — enabling better length generalization.",
    code: `import torch

def apply_rope(x, position, dim, theta=10000.0):
    """Simplified RoPE for a single position."""
    freqs = 1.0 / (theta ** (torch.arange(0, dim, 2).float() / dim))
    angles = position * freqs
    cos, sin = angles.cos(), angles.sin()
    x1, x2 = x[..., 0::2], x[..., 1::2]
    rotated = torch.cat([x1 * cos - x2 * sin, x1 * sin + x2 * cos], dim=-1)
    return rotated

q = torch.randn(8)  # query vector
k = torch.randn(8)  # key vector
q_rot = apply_rope(q, position=5, dim=8)
k_rot = apply_rope(k, position=3, dim=8)
# dot(q_rot, k_rot) encodes relative position 5-3=2`,
    project:
      "Visualize how RoPE rotation angles change with position and dimension. Compare attention patterns with sinusoidal PE vs RoPE on sequences longer than training length.",
    interviewQuestions: [
      iq("How does RoPE encode relative position?", "Rotating Q by mθ and K by nθ makes their dot product depend on (m-n)θ — the relative distance. Rotation composition: R(m)ᵀR(n) = R(m-n), naturally encoding relative position.", "hard"),
      iq("Why does RoPE generalize better to longer sequences?", "Relative position encoding is more stable than absolute. With interpolation tricks (NTK-aware, YaRN), RoPE models can extend context 4-16× beyond training length.", "medium"),
      iq("How does RoPE differ from sinusoidal positional encoding?", "Sinusoidal PE adds position vectors to embeddings (absolute). RoPE rotates Q,K in attention (relative). RoPE needs no extra parameters and integrates position into attention mechanism.", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "RoPE rotates Q,K vectors by position angle",
        "Dot product depends on relative position (m-n)",
        "Used in LLaMA, Mistral, modern LLMs",
        "No separate positional embedding needed",
      ],
      fifteenMin: [
        "θ_i = 10000^(-2i/d) frequency pattern",
        "Rotation applied to Q,K pairs of dims",
        "Better length extrapolation than absolute PE",
        "YaRN/NTK-aware scaling for long context",
        "No additional learned parameters",
        "Replaces additive positional encoding",
      ],
      oneHour: [
        "Implement RoPE rotation from scratch",
        "Visualize rotation angles across positions",
        "Compare attention beyond training length",
        "Understand YaRN context extension",
        "Trace RoPE in LLaMA model code",
        "Connect RoPE to long-context models (128K+)",
      ],
      cheatSheet: [
        "RoPE: rotate Q,K by pos*θ",
        "θ_i = 10000^(-2i/d)",
        "Relative: depends on (m-n)",
        "LLaMA, Mistral use RoPE",
        "YaRN: extend context length",
        "No additive PE needed",
      ],
    },
    glossary: ["RoPE", "Relative Position", "YaRN", "NTK-Aware Scaling"],
    commonMistakes: [
      "Adding RoPE on top of existing positional embeddings — double encoding",
      "Not applying RoPE scaling when extending context length",
      "Confusing RoPE with ALiBi (different relative position method)",
      "Assuming RoPE works identically at 2× training length without scaling",
    ],
  }),

  moe: createLesson({
    concept:
      "Mixture of Experts (MoE) replaces the dense FFN in transformer layers with multiple 'expert' FFNs and a router that selects which experts process each token — dramatically increasing model capacity without proportional compute increase.",
    whyItExists:
      "Scaling dense models (every parameter active per token) is compute-expensive. MoE activates only a subset of experts per token — e.g., 8 of 64 experts — getting 64× parameter capacity with ~8× compute. Powers GPT-4, Mixtral, DBRX.",
    analogy:
      "A hospital with 64 specialists but each patient only sees 8 relevant ones. The receptionist (router) directs patients to the right specialists. The hospital has vast expertise but each visit is efficient.",
    technicalExplanation:
      "MoE layer: Router (linear gate) → softmax over experts → select top-k experts → each selected expert is a standard FFN → weighted sum of expert outputs. Mixtral 8x7B: 8 experts per layer, top-2 routing, 47B total params but only ~13B active per token. Challenges: load balancing (some experts overused), communication overhead in distributed training, memory (all experts must be in GPU memory even if only k active). Switch Transformer uses top-1 routing for simplicity. Expert parallelism distributes experts across GPUs.",
    architecture:
      "Transformer Block with MoE: MHA → Add&Norm → MoE FFN (Router → Top-k Expert Selection → Expert FFNs → Weighted Sum) → Add&Norm. Dense attention + sparse FFN.",
    diagram: `flowchart TD
    A[Token Input] --> B[Router/Gate Network]
    B --> C[Softmax over Experts]
    C --> D[Select Top-k Experts]
    D --> E1[Expert 1 FFN]
    D --> E2[Expert 2 FFN]
    D --> E3[Expert k FFN]
    E1 --> F[Weighted Sum]
    E2 --> F
    E3 --> F
    F --> G[MoE Output]`,
    example:
      "Mixtral 8x7B processing 'The cat sat on the mat': router sends 'cat' tokens to experts 2,5 (animal semantics), 'sat' to experts 1,7 (verb actions), 'mat' to experts 3,4 (object nouns). Each token uses only 2 of 8 experts.",
    code: `import torch
import torch.nn as nn

class MoELayer(nn.Module):
    def __init__(self, d_model, d_ff, num_experts, top_k=2):
        super().__init__()
        self.router = nn.Linear(d_model, num_experts)
        self.experts = nn.ModuleList([
            nn.Sequential(nn.Linear(d_model, d_ff), nn.GELU(), nn.Linear(d_ff, d_model))
            for _ in range(num_experts)
        ])
        self.top_k = top_k

    def forward(self, x):
        gate_scores = torch.softmax(self.router(x), dim=-1)
        top_weights, top_indices = gate_scores.topk(self.top_k, dim=-1)
        top_weights = top_weights / top_weights.sum(dim=-1, keepdim=True)
        output = torch.zeros_like(x)
        for i, expert in enumerate(self.experts):
            mask = (top_indices == i).any(dim=-1)
            if mask.any():
                output[mask] += expert(x[mask]) * top_weights[mask, (top_indices[mask] == i).int().argmax(dim=-1)].unsqueeze(-1)
        return output`,
    project:
      "Run Mixtral-8x7B via Ollama or HuggingFace. Compare generation quality and speed vs dense Llama-2-13B. Research which experts activate for different text domains.",
    interviewQuestions: [
      iq("How does MoE increase capacity without proportional compute?", "Only top-k of N experts are active per token. Total params = N × expert_size, but compute per token = k × expert_size. Mixtral: 47B params, ~13B active.", "medium"),
      iq("What is the load balancing problem in MoE?", "Router may favor few experts, leaving others undertrained. Solutions: auxiliary load-balancing loss, expert capacity limits, noisy top-k routing. Uneven load wastes capacity.", "hard"),
      iq("How does MoE affect inference memory?", "All experts must be loaded in GPU memory even though only k are active per token. Mixtral 8x7B needs ~90GB for FP16 — more than dense 13B model. Quantization helps significantly.", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "MoE: multiple expert FFNs + router",
        "Only top-k experts active per token",
        "More params, same-ish compute per token",
        "GPT-4, Mixtral use MoE",
      ],
      fifteenMin: [
        "Router: linear gate → softmax → top-k",
        "Mixtral: 8 experts, top-2, 47B total",
        "Load balancing: auxiliary loss needed",
        "All experts in memory at inference",
        "Expert parallelism across GPUs",
        "Sparse FFN + dense attention",
      ],
      oneHour: [
        "Implement simple MoE layer",
        "Run Mixtral via Ollama/HuggingFace",
        "Compare MoE vs dense model quality/speed",
        "Understand load balancing loss",
        "Calculate active vs total parameters",
        "Research GPT-4 MoE architecture rumors",
      ],
      cheatSheet: [
        "MoE: router + N expert FFNs",
        "top-k experts per token",
        "Mixtral 8x7B: 8 experts, top-2",
        "Active params << total params",
        "Load balancing loss required",
        "All experts in GPU memory",
      ],
    },
    glossary: ["Mixture of Experts", "Router", "Top-k Routing", "Load Balancing"],
    commonMistakes: [
      "Assuming MoE models use less memory — all experts must be loaded",
      "Ignoring load balancing — some experts become useless",
      "Comparing total MoE params to dense params directly — compare active params",
      "Expecting linear speedup from MoE — routing overhead exists",
    ],
  }),

  quantization: createLesson({
    concept:
      "Quantization reduces model weight precision from FP16/FP32 to INT8 or INT4 — shrinking model size and accelerating inference with minimal quality loss, enabling local LLM deployment.",
    whyItExists:
      "A 70B parameter model in FP16 needs ~140GB GPU memory — impossible on consumer hardware. INT4 quantization reduces this to ~35GB, making large models runnable on a single high-end GPU or even CPU.",
    analogy:
      "Storing a photo as PNG (lossless, large) vs JPEG (compressed, smaller, nearly identical to the eye). Quantization is JPEG for neural network weights — smaller file, slightly less precision, usually fine.",
    technicalExplanation:
      "Post-Training Quantization (PTQ): quantize after training — GPTQ, AWQ, GGUF formats. Quantization-Aware Training (QAT): simulate quantization during training for better accuracy. INT8: 2× compression vs FP16. INT4: 4× compression. Methods: GPTQ (layer-wise optimal quantization), AWQ (protect salient weights), GGUF (llama.cpp format with k-quant variants: Q4_K_M, Q5_K_S). Tradeoffs: lower bits = smaller/faster but more quality degradation. Q4_K_M is popular sweet spot for local models. Calibration dataset needed for PTQ to minimize error.",
    architecture:
      "FP16 Model → Calibration (run on sample data) → Quantize weights per layer → Pack into INT4/INT8 → Save as GGUF/GPTQ → Load in llama.cpp/Ollama/vLLM for inference.",
    diagram: `flowchart LR
    A[FP16 Model 140GB] --> B[Calibration Dataset]
    B --> C{Quantization Method}
    C -->|GPTQ| D[Layer-wise INT4]
    C -->|AWQ| E[Salience-aware INT4]
    C -->|GGUF| F[k-quant INT4]
    D --> G[INT4 Model 35GB]
    E --> G
    F --> G
    G --> H[llama.cpp / Ollama Inference]`,
    example:
      "Llama-3-70B: FP16 = 140GB (needs 2× A100). Q4_K_M GGUF = ~40GB (fits 1× A100 or Mac M2 Ultra). Quality: MMLU 79.5 (FP16) vs 78.1 (Q4) — 1.4 point drop for 3.5× size reduction.",
    code: `# Using Ollama with quantized models
# ollama pull llama3:70b-instruct-q4_K_M

# HuggingFace GPTQ quantization
from transformers import AutoModelForCausalLM, GPTQConfig

gptq_config = GPTQConfig(bits=4, dataset="c4", tokenizer=tokenizer)
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3-8B",
    quantization_config=gptq_config,
    device_map="auto",
)

# llama.cpp conversion
# python convert.py models/llama-3-8b --outtype q4_k_m`,
    project:
      "Download a model in FP16 and Q4_K_M formats. Benchmark perplexity, generation speed, and memory usage on the same hardware. Document the quality-speed-memory tradeoff.",
    interviewQuestions: [
      iq("What is the difference between PTQ and QAT?", "PTQ quantizes after training using calibration data — fast, no retraining. QAT simulates quantization during training — better accuracy at low bit-widths but requires full training run.", "medium"),
      iq("Why does INT4 quantization work well for LLMs?", "Neural network weights have redundancy — most weights are small and similar. Outliers (salient weights) matter most. Methods like AWQ protect outliers while aggressively quantizing the rest.", "medium"),
      iq("What are GGUF quantization levels (Q4_K_M, Q5_K_S)?", "GGUF k-quant variants balance size and quality. Q4_K_M: 4-bit with mixed precision (medium). Q5_K_S: 5-bit small. Higher Q = better quality, larger file. Q4_K_M is the popular default for local use.", "hard"),
    ],
    revisionNotes: {
      fiveMin: [
        "Quantization: lower precision weights (INT8/INT4)",
        "4× smaller model, faster inference",
        "GPTQ, AWQ, GGUF are common formats",
        "Enables local LLM on consumer hardware",
      ],
      fifteenMin: [
        "FP16 → INT8 (2×) → INT4 (4×) compression",
        "PTQ: quantize after training",
        "QAT: quantize during training",
        "AWQ protects salient weights",
        "Q4_K_M: sweet spot for local models",
        "Calibration dataset minimizes error",
      ],
      oneHour: [
        "Quantize model with Ollama/HuggingFace",
        "Benchmark FP16 vs Q4 speed and quality",
        "Compare GPTQ vs AWQ vs GGUF",
        "Measure perplexity degradation per quant level",
        "Deploy quantized model locally",
        "Calculate memory savings for production",
      ],
      cheatSheet: [
        "INT4 = 4× smaller than FP16",
        "GPTQ: layer-wise optimal PTQ",
        "AWQ: protect salient weights",
        "GGUF: llama.cpp format",
        "Q4_K_M: recommended default",
        "ollama pull model:q4_K_M",
      ],
    },
    glossary: ["GPTQ", "AWQ", "GGUF", "Post-Training Quantization"],
    commonMistakes: [
      "Using INT2 or aggressive quantization without quality testing",
      "Skipping calibration dataset for PTQ — poor accuracy",
      "Comparing quantized model quality to FP16 without same eval setup",
      "Assuming quantization speeds up training — it only helps inference",
    ],
  }),
};
