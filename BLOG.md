## Introduction

I think before we talk about Modus or Hypermode, we need to talk about what problems this platform is helping us solve.

According their github repository:

> Modus: an open source, serverless framework for building model-native apps, powered by WebAssembly

Now, a brief look at their github repository examples and their documentation, you might notice they are doing somethings differently from the rest of the backend frameworks:

- WebAssembly. Where most of backend frameworks use Nodejs, Go, Python and Rust amongst others, Modus uses WebAssembly. I think this is a unique choice and dare I say smart as we will dive a bit deeper into this choice and its benefits.

- Model-native apps. This is a term I had to think about a bit, could not find an "official" definition. But, I think it borrows, although not the same thing, the spirit of `Cloud-native apps`. Both represent some sort of evolution of in software architecture. Cloud-native apps helped us with how we build and deploy software by deeply integrating cloud principles. Model-native apps aim to do the same by embedding AI/ML models as foundational components in develpoing intellegent APIs.

The question remains whether Modus truly brings about about paradigm shift in software architecture. Modus, withstanding the fact that it is a relatively new project, I personally am curiously excited to follow them and see whether a broader adoption of WebAssembly and AI/ML models will have a long term impact on its adoption.

Can they bring about a paradigm shift? Will it gain the adoption needed for it to truly bring a paradigm shift? It can be argued that its uniqueness lies in combining no new ideas but rather re-uisng existing ones in a new way.

My opinion, as Modus stands right now, is that they can at least bring about a paradigm-enabling concept, if they haven't already, `the model-native approach`, treating AI/ML models as foundational, first class components in developing intelligent APIs.

## Why Modus?

While many modern backend frameworks already offer excellent developer experience with features like code generation, type safety, and reducing boilerplate configurations and code, Modus takes a unique approach by combining these familiar benefits with some distinctive twists of it own:

#### WebAssembly-First: A New Paradigm for Backend Services

If you are not familiar with WebAsselbly (Wasm), you can spend 30 seconds by reviewing the very very high level concepts in this article [WebAssembly 101: Bridging the Gap Between Web and Machine](https://kamc.hashnode.dev/webassembly-101-bridging-the-gap-between-web-and-machine)

Modus can help the developers leverage using Wasm as their runtime and at the same time abstracting much of the complexiity. Developers can reap the benefits of Wasm's sandbox execution, protability, performance and language agnosticism. Should be note that only Go and AssemblyScript are available for now, but word is others are in the works.

Looking into their GitHub repository:

- AssemblyScript code compiles to Wasm (that's what AssemblyScript can do)
- Go code complies to Wasm via TinyGo
- Then Wazeo executes resulting Wasm modules regardless of source language (github.com/tetratelabs/wazero)

Wazero is one runtime to Wasm, like [WASI](https://kamc.hashnode.dev/webassembly-101-bridging-the-gap-between-web-and-machine)
> wazero is the only zero dependency WebAssembly runtime written in Go.

WASI is an excellent general purpose for Wasm and a formal spec for system-level interfaces for Wasm, but Wazero is  Wasm runtime for embedding Wasm execution within Go applications and Go ecosystem. However, I should emphasize that Wazero is a Wasm runtime and at the end of the day it provides execution context to Wasm modules whether they were compiled from Go or AssemblyScript.



#### Model-Native Design:

#### GraphQL Schema Generation:

#### Security Through Isolation

#### Sandboxed Execution

#### Memory Safety

#### Controlled System Access

#### Cross-Language Compatibility

#### Performance Characteristics

WebAssembly's near-native performance makes it aviable alternative to traditional backend runtimes:

- **Quick Cold Starts**: =
- **Efficient Resource Usage**:
- **Predictable Performance**:

#### Trade-offs and Considerations

While WebAssembly brings many advantages, it's essential to understand the trade-offs:

- **Ecosystem Maturity**:
- **Development Workflow**:
- **Language Support**:

-

<!-- - What is Hypermode?


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
