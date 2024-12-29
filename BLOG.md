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

Note that, Modus can help the developers leverage using Wasm as their runtime without needing to understand WebAssembly's internals. Just write your code in Go or AssemblyScript and Modu will take of the rest.
Developers can reap the benefits of Wasm's sandbox execution, protability, performance and language agnosticism. Should be noteed that only Go and AssemblyScript are available for now, but word is others are in the works.

Looking into their GitHub repository:

- AssemblyScript code compiles to Wasm (that's what AssemblyScript can do)
- Go code complies to Wasm via TinyGo
- Then Wazeo executes resulting Wasm modules regardless of source language (github.com/tetratelabs/wazero)

Wazero is one runtime to Wasm, like [WASI](https://kamc.hashnode.dev/webassembly-101-bridging-the-gap-between-web-and-machine)

> wazero is a WebAssembly runtime, written completely in Go. It has no platform dependencies, so can be used in any environment supported by Go.

WASI is an excellent general purpose for Wasm and a formal spec for system-level interfaces for Wasm, but Wazero is Wasm runtime for embedding Wasm execution within Go applications and Go ecosystem. However, I should emphasize that Wazero is a Wasm runtime and at the end of the day it provides execution context to Wasm modules whether they were compiled from Go or AssemblyScript.

#### Model-Native Design:

This concept of Model-Native refers to how Modus integrates AI models directly into its platform and how they are treated as first-class components. Leveraging this concept and its implementation by Modus, provides us with the following advantages:

##### Seamless AI integration

Modus includes a built-in model interface that allows you to interact with AI models just as you would be with APIs.This interface abstracts away complexities like SDK integration or API specific parameters.

##### Centralized Model Management

Models are defined in the Modus manifest (modus.json). You can configure models, for example, specifying parameters like token limits, temperature and more, creating a consistent access. For instance integrating a new AI model might require only updating the Modus manifest (modus.json).

Here we're using OpenAI's gpt-4o model:

```json
{
  "$schema": "https://schema.hypermode.com/modus.json",
  "endpoints": {
    "default": {
      "type": "graphql",
      "path": "/graphql",
      "auth": "bearer-token"
    }
  },
  "connections": {
    "openai": {
      "type": "http",
      "baseUrl": "https://api.openai.com/",
      "headers": {
        "Authorization": "Bearer {{API_KEY}}"
      }
    }
  },
  "models": {
    "llm": {
      "sourceModel": "gpt-4o",
      "connection": "openai",
      "path": "v1/chat/completions"
    }
  }
}
```

##### Unified Workflow

Instead of writing specific HTTP requests for various AI model, you then use a standardized Modus model interface and this interface supports tasks like text generation, embeddings, classification, and more.

#### GraphQL Schema Generation:

//TODO: To provide more (visual) clarity to reader, add modus soruce code, set breakpoints and take screenshot (or use the new fancy screen recorder?)

Behind the magic of Modus is how it generates GraphQL schema for you. Functions that you expose in your code (`export`ed in AssemblyScript and starting with capital letters in Go)

Digging into the code base, you will see how they identify query field names:

```go
// prefixes that are used to identify query fields, and will be trimmed from the field name
var queryTrimPrefixes = []string{"get", "list"}
```

and how they identify GraphQl mutations. As part of Modus's function-grpahql mapping, it uses the function names, specifically as documented below, the prefixes you use to name your functions to generate the mutations for you on the fly:

```go
// prefixes that are used to identify mutation fields
var mutationPrefixes = []string{
	"mutate",
	"post", "patch", "put", "delete",
	"add", "update", "insert", "upsert",
	"create", "edit", "save", "remove", "alter", "modify",
}
```

what happens if none of mutaitonPrefixes are found in a function's name? if none of the `mutationPrefixes` are found in a function's name then it becomes a Query by default. This can be seen in the `isMutation` function in `conventions.go`

```go
func isMutation(fnName string) bool {
	prefix := getPrefix(fnName, mutationPrefixes)
	if prefix == "" {
		return false
	}

	// embedders are not mutations
	embedders := getEmbedderFields()
	return !embedders[fnName]
}
```

the check for `embedders` as you might have guessed is a special type of function that is used for vector search/embeddings in collections. These are filtered out from both GraphQl Queries and Mutations. here is the relevant code - `filters.go`

```go
func getFieldFilter() func(*FieldDefinition) bool {
    embedders := getEmbedderFields()
    return func(f *FieldDefinition) bool {
        return !embedders[f.Name]  // Filter out embedder fields
    }
}

func getEmbedderFields() map[string]bool {
    embedders := make(map[string]bool)
    for _, collection := range manifestdata.GetManifest().Collections {
        for _, searchMethod := range collection.SearchMethods {
            embedders[getFieldName(searchMethod.Embedder)] = true
        }
    }
    return embedders
}
```

basically the framework uses above functions to say :

- `getEmbedderFields()` = "Here's the list of embedders"
- `getFieldFilter()` = "Here's a function that will filter out anything in that list"

and you can see here how they come together when used in the schema generation process, specifically in `transformFunctions()` in `schemagen.go`:

```go
func transformFunctions(functions metadata.FunctionMap, inputTypeDefs, resultTypeDefs map[string]*TypeDefinition, lti langsupport.LanguageTypeInfo) (*RootObjects, []*TransformError) {
    queryFields := make([]*FieldDefinition, 0, len(functions))
    mutationFields := make([]*FieldDefinition, 0, len(functions))
    errors := make([]*TransformError, 0)
    filter := getFieldFilter()  // here Get the filter function is called

    fnNames := utils.MapKeys(functions)
    sort.Strings(fnNames)
    for _, name := range fnNames {
        //some code
        field := &FieldDefinition{
            Name:      fieldName,
            Arguments: args,
            Type:      returnType,
            Function:  fn.Name,
        }
        if filter(field) { //apply the filter here
            if isMutation(fn.Name) {
                mutationFields = append(mutationFields, field)
            } else {
                queryFields = append(queryFields, field)
            }
        }
    }
}
```

#### Security Through Isolation

I like to start this section by stating that; this design makes Wasm specially suitable for environments requiring high levels of security, such as Modus, cloud-native applications, and multi-tenant systems. It is a fundamental principle in software and systems design that is applied across different technologies to enhance security and reliability. So, keep a mental note of this as we proceed.

The following is goes over the high level and the very basics of how Modus handles WebAssembly execution without getting into in the technical details. If I survive the next few weeks/months, I'm planning to dig deeper into each phase where posiible.

Assume your code is now complied, and you have a .wasm file. 

- This compiled Wasm module gets uploaded to the Modus environment and is associated with an API endpoint like a GraphQL query or mutation. //TODO: We will cover what is Hypermode, and deployment or import of your modus app to Hypermode via Hyp CLI and Hypermode console UI, but for now think of it a fully managed serverless framework providing the infrastructure and tolling for running modus applicatios.
- When a client sends a request, such as an HTTP or GraphQL query, the request gets maps to a function in your Wasm module and triggers the execution of the Wasm function

- At this point the Wazero runtime comes into play:
  - A new Wasm **instance** is created for the request
  - The Wazero runtime loads the Wasm module into memory and allocates a fresh **linear memory space** for the instance
  - The specific function mapped to the request is invoked within this Wasm **instance**
  - Wazero ensures that execution happens securely and in **isolation** leveraging Wasm’s sandboxing capabilities

Diagram below illustrates WebAssembly's sandbox security and isolation concepts we discussed. Showing the key components and their relationships:
Now the diagram shows key relationships:

- Resources control and limit what instances can use
- Each Wasm instance connects to its own memory space
- Memory spaces connect to function boundaries
- Function boundaries control interaction with external access
- All external communication flows through the controlled access layer

![Wasm Execution](//TODO: uploda WebAssemblySandboxSecurityIsolation image to cloudfront)

*Figure 1: High-level overview of WebAssembly Sandbox Security Isolation*

#### Sandboxed Execution

Given Modus' affinity to Wasm it is then blessed with 

#### Memory Safety

#### Controlled System Access

#### Cross-Language Compatibility

#### Performance Characteristics

WebAssembly's near-native performance makes it a viable alternative to traditional backend runtimes:

- **Quick Cold Starts**: =
- **Efficient Resource Usage**:
- **Predictable Performance**:

#### Trade-offs and Considerations

While WebAssembly brings many advantages, it's essential to understand the trade-offs:

- **Ecosystem Maturity**:
- **Development Workflow**:

A .wasm file from my own [export function generateExcuses(event: string): string](https://github.com/KazChe/modus-intelligent-api/blob/main/assembly/index.ts) converted to a textual representation .wat file snippet:

````c
(func $assembly/index/generateExcuses (;394;) (type 0) (param $event i32) (result i32)
    (local $model i32) (local $2 i32) (local $prompt i32) (local $4 i32) (local $5 i32) (local $input i32) (local $response i32) (local i32)
    global.get $~lib/memory/__stack_pointer
    i32.const 48
    i32.sub
    global.set $~lib/memory/__stack_pointer
    call $~stack_check
    global.get $~lib/memory/__stack_pointer
    i32.const 0
    i32.const 48
    memory.fill
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/@hypermode/modus-sdk-as/assembly/models/factory
    local.set 8
    global.get $~lib/memory/__stack_pointer
    ...
    ```


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
-->
references:

wazero https://wazero.io/docs/

webassembly

assemblyscrip

modus

hypermod
````
