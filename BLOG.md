## Introduction

I think before we talk about Modus or Hypermode, we need to talk about what problems this platform is helping us solve.

According their github repository:

> Modus: an open source, serverless framework for building model-native apps, powered by WebAssembly

Now, a brief look at their github repository examples and their documentation, you might notice they are doing somethings differently from the rest of the backend frameworks:

- WebAssembly. Where most of backend frameworks use Nodejs, Go, Pythone and Rust amongst others, Modus uses WebAssembly. I think this is a unique choice and dare I say smart as we will dive a bit deeper into this choice and its benefits.

- Model-native apps. This is a term I had to think about a bit, could not find an "official" definition. But, I think it borrows, although not the same thing, the spirit of `Cloud-native apps`. Both represent some sort of evolution of in software architecture. Cloud-native apps helped us with how we build and deploy software by deeply integrating cloud principles. Model-native apps aim to do the same by embedding AI/ML models as foundational components in develpoing intellegent APIs.

The question remains whether Modus truly brings about about paradigm shift in software architecture. Modus, withstanding the fact that it is a relatively new project, I personally am curiously excited to follow them and see whether a broader adoption of WebAssembly and AI/ML models will have a long term impact on its adoption.

Can they bring about a paradigm shift? Will it gain the adoption needed for it to truly bring a paradigm shift? It can be argued that its uniqueness lies in combining no new ideas but rather re-uisng existing ones in a new way.

My opinion, as Modus stands right now, is that they can at least bring about a paradigm-enabling concept, if they haven't already, `the model-native approach`, treating AI/ML models as foundational, first class components in developing intelligent APIs.

## Why Modus?

While many modern backend frameworks already offer excellent developer experience with features like code generation, type safety, and reducing boilerplate configurations and code, Modus takes a unique approach by combining these familiar benefits with some distinctive twists of it own:

1. **WebAssembly-First**: Unlike traditional backend frameworks that primarily use Node.js, Go, Python, or Rust, Modus leverages WebAssembly for secure, sandboxed function execution with near-native performance.

2. **Model-Native Design**: While other frameworks can certainly integrate with AI/ML models, Modus treats them as first-class citizens in the development process, making it particularly well-suited for building intelligent APIs.

3. **GraphQL Schema Generation**: Though automatic schema generation isn't unique to Modus (frameworks like Nexus, TypeGraphQL, and others offer similar capabilities), Modus's approach through WebAssembly enables this across multiple programming languages while maintaining type safety.

Let's dive deeper into these aspects and see how they complement existing backend development practices.


<!-- - What is Hypermode?
- What is Modus?
- Boilerplate abstraction -->

### Intelligent API, what does that mean?

### GraphQL-first API

### Under the hood

#### Go GraphQL tools

- WunderGraph

#### AssemblyScript?

- Bad stuff about AssemblyScript
- Good stuff about AssemblyScript
  - Modus does not use it for the Web Browser
  - Type safety
  - Performance
  - WebAssembly
  -

#### Building blocks

- Modus is a microservice architecture
-

#### Architecture

- Modus is a microservice architecture
-

## Demo

- manifest.json
-
