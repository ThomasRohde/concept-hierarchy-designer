import { NodeData } from '../types';

export const genId = (): string => Math.random().toString(36).substring(2, 15);

// Create initial data in the flat structure
export const createInitialData = (): NodeData[] => {
  const rootId = genId();
  const quantum = genId();
  const theories = genId();
  const applications = genId();
  const wave = genId();
  const superposition = genId();
  const mechanics = genId();
  const string = genId();
  const relativity = genId();

  return [
  {
    id: "root",
    name: "Quantum Physics",
    description: `
### Quantum Physics

Quantum physics explores the behavior of matter and energy at the smallest scales—**atoms**, **electrons**, **photons**, and the quantum *fields* that underlie them.

- Bridges **classical physics** and **modern technology** (lasers, semiconductors, MRI).
- Provides the theoretical scaffolding for the **Standard Model** of particle physics.
- Inspires philosophical questions about *measurement*, *reality*, and *information*.

> “If you think you understand quantum mechanics, you don't understand quantum mechanics.” — *Richard Feynman*
    `,
    parent: null
  },
  {
    id: "intro",
    name: "Introduction to Quantum Physics",
    description: `
### Introduction

The introduction gathers foundational concepts that every learner should grasp before venturing into advanced topics.

1. **Historical Roots** – Planck, Einstein, Bohr, Schrödinger.
2. **Conceptual Pillars** – quantization, superposition, uncertainty.
3. **Mathematical Language** – linear algebra, complex vector spaces, operators.
4. **Experimental Bedrock** – double‑slit, photoelectric, Stern‑Gerlach.

    `,
    parent: "root"
  },
  {
    id: "wave",
    name: "Wave–Particle Duality",
    description: `
### Wave–Particle Duality

Quantum entities behave as *both* waves and particles.

- **Young (1801)** – light interference.  
- **Einstein (1905)** – photons explain the photoelectric effect.  
- **de Broglie (1924)** – matter waves ($\lambda = h/p$).

$$p = \frac{h}{\lambda}$$

    `,
    parent: "intro"
  },
  {
    id: "superposition",
    name: "Quantum Superposition",
    description: `
### Quantum Superposition

A quantum system can exist in multiple mutually exclusive states *simultaneously* until measured.

$$|\psi\rangle = c_1|0\rangle + c_2|1\rangle$$

- Enables **quantum computing qubits**.  
- Collapses to an eigenstate on measurement.

    `,
    parent: "intro"
  },
  {
    id: "planckConstant",
    name: "Planck's Constant",
    description: `
### Planck's Constant ($h$)

$h = 6.62607015\times10^{-34}\,\text{J·s}$ serves as the scaling factor for quantum phenomena.

- Links energy and frequency ($E=hf$).  
- Sets the size of the quantum of action.

    `,
    parent: "intro"
  },
  {
    id: "uncertainty",
    name: "Heisenberg Uncertainty Principle",
    description: `
### Uncertainty Principle

$$\sigma_x \sigma_p \ge \tfrac{\hbar}{2}$$

- Limit on simultaneous knowledge of complementary variables.  
- Reflects *intrinsic* quantum fuzziness, not measurement flaws.

    `,
    parent: "intro"
  },
  {
    id: "wavefunction",
    name: "Wavefunction",
    description: `
### The Wavefunction ($|\psi\rangle$)

A complete mathematical description of a system’s state.

- Defined over *Hilbert space*.  
- Evolves via **Schrödinger's equation**.

    `,
    parent: "intro"
  },
  {
    id: "measurementProblem",
    name: "Measurement Problem",
    description: `
### Measurement Problem

Why and how does a definite outcome emerge from a superposition?

- **Collapse postulate** vs. **Many‑worlds branching**.  
- Central to quantum foundations.

    `,
    parent: "intro"
  },
  {
    id: "operators",
    name: "Observables & Operators",
    description: `
### Observables & Operators

Physical observables correspond to *Hermitian operators* acting on the wavefunction.

- Eigenvalues give possible outcomes.  
- Commutation relations encode uncertainties.

    `,
    parent: "intro"
  },
  {
    id: "spin",
    name: "Spin",
    description: `
### Spin

Intrinsic angular momentum with **half‑integer** and **integer** values.

- No classical analogue.  
- Source of ***Pauli exclusion*** in fermions.

    `,
    parent: "intro"
  },
  {
    id: "entanglement",
    name: "Entanglement",
    description: `
### Entanglement

Non‑classical correlations between subsystems.

- Violates **Bell inequalities**.  
- Resource for quantum teleportation & cryptography.

    `,
    parent: "intro"
  },
  {
    id: "decoherence",
    name: "Decoherence",
    description: `
### Decoherence

Interaction with the environment destroys phase relations, making quantum systems appear classical.

- Timescale critical for **quantum computing** stability.  
- Explains apparent collapse without modifying unitary evolution.

    `,
    parent: "intro"
  },
  {
    id: "experiments",
    name: "Experiments & Evidence",
    description: `
### Experiments & Evidence

Key experiments validate and probe quantum theory’s predictions.

    `,
    parent: "root"
  },
  {
    id: "photoelectric",
    name: "Photoelectric Effect",
    description: `
### Photoelectric Effect

Emission of electrons from a metal when illuminated.

- Showed $E=hf$; photons carry quantized energy.  
- Earned Einstein the 1921 Nobel Prize.

    `,
    parent: "experiments"
  },
  {
    id: "doubleSlit",
    name: "Double‑Slit Experiment",
    description: `
### Double‑Slit Experiment

Interference pattern even with single particles demonstrates wavefunction reality.

- Collapse upon *which‑path* detection.

    `,
    parent: "experiments"
  },
  {
    id: "sternGerlach",
    name: "Stern‑Gerlach Experiment",
    description: `
### Stern‑Gerlach Experiment

Spatially separates spin states in a non‑uniform magnetic field.

- First direct evidence of **quantized spin**.

    `,
    parent: "experiments"
  },
  {
    id: "bellTest",
    name: "Bell‑Test Experiments",
    description: `
### Bell‑Test Experiments

Test local realism using entangled particles.

- Violations confirm **quantum non‑locality**.  
- 2022 Nobel Prize (Aspect, Clauser, Zeilinger).

    `,
    parent: "experiments"
  },
  {
    id: "bec",
    name: "Bose‑Einstein Condensate",
    description: `
### Bose‑Einstein Condensate (BEC)

Matter-wave macroscopic quantum state achieved near absolute zero.

- First realized in 1995 (Cornell & Wieman).  
- Demonstrates quantum statistics at mesoscopic scale.

    `,
    parent: "experiments"
  },
  {
    id: "theories",
    name: "Key Theories",
    description: `
### Key Theories

Form the mathematical backbone connecting quantum phenomena with fundamental forces.

    `,
    parent: "root"
  },
  {
    id: "quantumMechanics",
    name: "Quantum Mechanics",
    description: `
### Non‑Relativistic Quantum Mechanics

Built on the **Schrödinger equation**:

$$i\hbar\frac{\partial}{\partial t}|\psi\rangle = \hat{H}|\psi\rangle$$

Covers atoms, molecules, and condensed‑matter systems.

    `,
    parent: "theories"
  },
  {
    id: "quantumFieldTheory",
    name: "Quantum Field Theory (QFT)",
    description: `
### Quantum Field Theory

Fields are fundamental; particles are excitations.

- Unifies **special relativity** & **quantum mechanics**.  
- Uses **Feynman diagrams** & path integrals.

    `,
    parent: "theories"
  },
  {
    id: "quantumElectrodynamics",
    name: "Quantum Electrodynamics (QED)",
    description: `
### Quantum Electrodynamics

Quantum theory of the electromagnetic field.

- Most precise predictions (anomalous magnetic moment).  
- Renormalizable gauge theory with symmetry U(1).

    `,
    parent: "theories"
  },
  {
    id: "quantumChromodynamics",
    name: "Quantum Chromodynamics (QCD)",
    description: `
### Quantum Chromodynamics

Theory of the strong interaction.

- **Color charge** and gluon self‑interaction.  
- Confinement & asymptotic freedom.

    `,
    parent: "theories"
  },
  {
    id: "electroweak",
    name: "Electroweak Theory",
    description: `
### Electroweak Theory

Unified electromagnetic and weak forces (Glashow, Weinberg, Salam).

- Predicts **W**, **Z** bosons.  
- Broken by Higgs mechanism.

    `,
    parent: "theories"
  },
  {
    id: "standardModel",
    name: "Standard Model",
    description: `
### Standard Model

Combines **QCD** and **Electroweak** into a unified framework.

- Particle content: 12 fermions, 4 gauge bosons, 1 scalar (Higgs).  
- Leaves gravity unexplained.

    `,
    parent: "theories"
  },
  {
    id: "diracEquation",
    name: "Dirac Equation",
    description: `
### Dirac Equation

Relativistic wave equation for spin‑½ particles.

$$ (i\gamma^\mu \partial_\mu - m)\psi = 0 $$

Predicts **antimatter**.

    `,
    parent: "theories"
  },
  {
    id: "pathIntegral",
    name: "Feynman Path Integral",
    description: `
### Feynman Path Integral

Sum over histories approach:

$$ \langle x_f, t_f | x_i, t_i \rangle = \int \mathcal{D}[x(t)] e^{\tfrac{i}{\hbar} S[x(t)]} $$

Offers intuitive picture for quantum amplitudes.

    `,
    parent: "theories"
  },
  {
    id: "supersymmetry",
    name: "Supersymmetry (SUSY)",
    description: `
### Supersymmetry

Hypothesized symmetry between bosons and fermions.

- Stabilizes Higgs mass.  
- Predicts superpartners (selectron, neutralino).

    `,
    parent: "theories"
  },
  {
    id: "quantumGravity",
    name: "Quantum Gravity (Overview)",
    description: `
### Quantum Gravity

Attempts to reconcile **general relativity** with quantum mechanics.

    `,
    parent: "theories"
  },
  {
    id: "loopQuantumGravity",
    name: "Loop Quantum Gravity",
    description: `
### Loop Quantum Gravity

Quantizes spacetime itself into discrete loops.

- Predicts minimal length scale.  
- Background‑independent formalism.

    `,
    parent: "quantumGravity"
  },
  {
    id: "stringTheory",
    name: "String Theory",
    description: `
### String Theory

Fundamental constituents are 1‑D strings (open/closed).

- Vibrational modes correspond to particles.  
- Requires extra dimensions.

    `,
    parent: "quantumGravity"
  },
  {
    id: "mTheory",
    name: "M‑Theory",
    description: `
### M‑Theory

11‑dimensional unification of string theories.

- Membranes (branes) generalize strings.

    `,
    parent: "quantumGravity"
  },
  {
    id: "interpretations",
    name: "Interpretations of Quantum Mechanics",
    description: `
### Interpretations

Philosophical frameworks for the measurement problem.

    `,
    parent: "theories"
  },
  {
    id: "copenhagen",
    name: "Copenhagen Interpretation",
    description: `
### Copenhagen Interpretation

Wavefunction collapse is real; physical properties undefined until measurement.

    `,
    parent: "interpretations"
  },
  {
    id: "manyWorlds",
    name: "Many‑Worlds Interpretation",
    description: `
### Many‑Worlds Interpretation

All branches coexist; no collapse—just decoherence and branching universes.

    `,
    parent: "interpretations"
  },
  {
    id: "pilotWave",
    name: "Pilot‑Wave (de Broglie–Bohm) Theory",
    description: `
### Pilot‑Wave Theory

Particles follow definite trajectories guided by a *pilot wave*.

- Deterministic yet reproduces quantum statistics.

    `,
    parent: "interpretations"
  },
  {
    id: "generalRelativity",
    name: "General Relativity (Brief)",
    description: `
### General Relativity

Einstein’s classical theory of gravitation.

- Spacetime curvature equals energy‑momentum.  
- Quantum gravity seeks to supersede this with a quantized framework.

    `,
    parent: "theories"
  },
  {
    id: "applications",
    name: "Applications",
    description: `
### Applications

Leveraging quantum principles to revolutionize technology.

    `,
    parent: "root"
  },
  {
    id: "quantumComputing",
    name: "Quantum Computing",
    description: `
### Quantum Computing

Uses qubits to perform computations with *superposition* and *entanglement*.

- **Algorithms**: Shor's (factoring), Grover's (search).  
- **Hardware**: superconducting circuits, trapped ions.

    `,
    parent: "applications"
  },
  {
    id: "quantumCryptography",
    name: "Quantum Cryptography",
    description: `
### Quantum Cryptography

Unbreakable keys via quantum principles.

- **BB84** protocol.  
- Relies on **no‑cloning** theorem.

    `,
    parent: "applications"
  },
  {
    id: "quantumCommunication",
    name: "Quantum Communication",
    description: `
### Quantum Communication

Transmitting quantum states over distance.

- **Quantum teleportation**.  
- Satellite QKD links (e.g., *Micius*).

    `,
    parent: "applications"
  },
  {
    id: "quantumSensing",
    name: "Quantum Sensing",
    description: `
### Quantum Sensing

Exploits quantum coherence for ultra‑sensitive measurements.

- Atomic clocks, SQUID magnetometers.

    `,
    parent: "applications"
  },
  {
    id: "quantumOptics",
    name: "Quantum Optics",
    description: `
### Quantum Optics

Manipulation of light–matter interactions at the quantum level.

- Single‑photon sources, cavity QED.

    `,
    parent: "applications"
  },
  {
    id: "quantumSimulation",
    name: "Quantum Simulation",
    description: `
### Quantum Simulation

Using controllable quantum systems to emulate complex quantum models.

- Study high‑Tc superconductivity, lattice gauge theories.

    `,
    parent: "applications"
  },
  {
    id: "quantumMaterials",
    name: "Quantum Materials",
    description: `
### Quantum Materials

Materials where quantum effects dominate macroscopically.

- Topological insulators, graphene, Weyl semimetals.

    `,
    parent: "applications"
  },
  {
    id: "semiconductors",
    name: "Semiconductors",
    description: `
### Semiconductors

Band‑gap engineering underpins modern electronics.

- Transistors, LEDs, solar cells.

    `,
    parent: "applications"
  },
  {
    id: "lasers",
    name: "Lasers",
    description: `
### Lasers

Light Amplification by Stimulated Emission of Radiation.

- Coherent, monochromatic beams used for communication, medicine.

    `,
    parent: "applications"
  },
  {
    id: "mri",
    name: "Magnetic Resonance Imaging (MRI)",
    description: `
### MRI

Medical imaging technique exploiting nuclear spin resonance.

- Non‑invasive, high contrast for soft tissue.

    `,
    parent: "applications"
  },
  {
    id: "transistors",
    name: "Transistors",
    description: `
### Transistors

Quantum tunnelling governs current flow in nanoscale MOSFETs.

- Basis of digital logic.

    `,
    parent: "applications"
  },
];
};

// Get all nodes in the flat structure
export const getAllNodes = (nodes: NodeData[]): NodeData[] => {
  return nodes;
};

// Get all children of a specific node in the flat structure
export const getChildren = (nodes: NodeData[], parentId: string | null): NodeData[] => {
  return nodes.filter(node => node.parent === parentId);
};

// Get the parent of a specific node
export const getParent = (nodes: NodeData[], childId: string): NodeData | null => {
  const child = nodes.find(node => node.id === childId);
  if (!child || child.parent === null) return null;
  return nodes.find(node => node.id === child.parent) || null;
};

interface FindNodeResult {
  node: NodeData;
  parent: NodeData | null;
}

// Find a node and its parent
export const findNode = (nodes: NodeData[], id: string): FindNodeResult | null => {
  const node = nodes.find(node => node.id === id);
  if (!node) return null;
  
  const parent = node.parent ? nodes.find(n => n.id === node.parent) || null : null;
  return { node, parent };
};