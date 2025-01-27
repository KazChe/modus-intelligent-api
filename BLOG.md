## Introduction

I think before we talk about Modus or Hypermode, we need to talk about what problems this platform is helping us solve.

According their github repository:

> Modus: an open source, serverless framework for building model-native apps, powered by WebAssembly

Now, a brief look at their github repository examples and their documentation, you might notice they are doing somethings differently from the rest of the backend frameworks:

- WebAssembly. Where most of backend frameworks use Nodejs, Go, Python and Rust amongst others, Modus uses WebAssembly. I think this is a unique choice and dare I say smart as we will dive a bit deeper into this choice and its benefits.

- Model-native apps. This is a term I had to think about a bit, could not find an "official" definition. But, I think it borrows, although not the same thing, the spirit of `Cloud-native apps`. Both represent some sort of evolution of in software architecture. Cloud-native apps helped us with how we build and deploy software by deeply integrating cloud principles. Model-native apps aim to shift our designs by embedding AI/ML models as foundational components in developing intelligent APIs.

The question remains whether Modus truly brings about about a paradigm shift in software architecture. Modus, withstanding the fact that it is a relatively new project, I personally am curiously excited to follow them and see whether a broader adoption of WebAssembly and AI/ML models will have a long term impact on its adoption.

Can they bring about a paradigm shift? Will it gain the adoption needed for it to truly bring a paradigm shift? It can be argued that its uniqueness lies in combining not new ideas but rather re-using existing ones in a new way.

My opinion, as Modus stands right now, is that they can at least bring about a paradigm-enabling concept, if they haven't already, `the model-native approach`, treating AI/ML models as foundational, first class components in developing intelligent APIs.

## Why Modus?

While many modern backend frameworks already offer excellent developer experience with features like code generation, type safety, and reducing boilerplate configurations and code, Modus takes a unique approach by combining these familiar benefits with some distinctive twists of it own:

#### WebAssembly-First: A New Paradigm for Backend Services

If you are not familiar with WebAssembly (Wasm), you can spend 30 seconds by reviewing the very very high level concepts in this article [WebAssembly 101: Bridging the Gap Between Web and Machine](https://kamc.hashnode.dev/webassembly-101-bridging-the-gap-between-web-and-machine)

Modus can help the developers leverage using Wasm as their runtime without needing to understand WebAssembly's internals. Just write your code in Go or AssemblyScript and Modus will take care of the rest.

Developers can reap the benefits of Wasm's sandbox execution, portability, performance and language agnosticism. Should be noted that only Go and AssemblyScript are available for now, but word is others are in the works.

Looking into their GitHub repository:

- AssemblyScript code compiles to Wasm (that's what AssemblyScript can do)
- Go code complies to Wasm via TinyGo
- Then Wazero executes resulting Wasm modules regardless of source language (github.com/tetratelabs/wazero)

Wazero is used as the runtime to Wasm, very much like [WASI](https://kamc.hashnode.dev/webassembly-101-bridging-the-gap-between-web-and-machine#heading-webassembly-system-interface-wasi-and-cellular-biology-huh) is.

> wazero is a WebAssembly runtime, written completely in Go. It has no platform dependencies, so can be used in any environment supported by Go.

WASI is an excellent general purpose for Wasm and a formal spec for system-level interfaces for Wasm, but Wazero is Wasm runtime for embedding Wasm execution within Go applications and Go ecosystem. However, I should emphasize that Wazero is a Wasm runtime and at the end of the day it provides execution context to Wasm modules whether they were compiled from Go or AssemblyScript.

#### Model-Native Design:

This concept of Model-Native refers to how Modus integrates AI models directly into its platform and how they are treated as first-class components. Leveraging this concept and its implementation by Modus, provides us with the following advantages:

##### Seamless AI integration

Modus includes a built-in model interface that allows you to interact with AI models just as you would be with APIs. This interface abstracts away complexities like SDK integration or API specific parameters.

##### Centralized Model Management

Models are defined in the Modus manifest (modus.json). You can configure models, for example, specifying parameters like token limits, temperature and more, creating a consistent access. For instance integrating a new AI model might require only updating the Modus manifest (modus.json). We will talk more about what this manifest is but for now think of it as a declaration, like a ship's manifest that helps port authorities (in our case Hypermode) understand what's aboard, in short modus.json helps our runtime understand:

- How to map your functions to GraphQL operations
- Integration points with external services
- Required configurations and dependencies

In the following sample `manifest.json` we're declaring:

- Use gpt-4o as its source model ("sourceModel": "gpt-4o")
- Use "openai" connection defined via the `connections` property
- and specify the API endpoint path for chat completions `"path": "v1/chat/completions"`

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

We will cover more on this in the next series, but I felt it is befitting to briefly cover how modus addresses the GraphQL generation part.

Instead of writing specific HTTP requests for various AI model, you then use a standardized Modus model interface and this interface supports tasks like text generation, embeddings, classification, and more.

#### GraphQL Schema Generation:

Behind the magic of Modus is how it generates GraphQL schema for you. Functions that you expose in your code (`export`ed in AssemblyScript and starting with capital letters in Go)

Digging into their code base, you will see how they identify query field names:

```go
// prefixes that are used to identify query fields, and will be trimmed from the field name
var queryTrimPrefixes = []string{"get", "list"}
```

and how they identify GraphQL mutations. As part of Modus's function-graphql mapping, it uses the function names, specifically as documented below, the prefixes you use to name your functions to generate the mutations for you on the fly:

```go
// prefixes that are used to identify mutation fields
var mutationPrefixes = []string{
	"mutate",
	"post", "patch", "put", "delete",
	"add", "update", "insert", "upsert",
	"create", "edit", "save", "remove", "alter", "modify",
}
```

what happens if none of `mutaitonPrefixes` are found in a function's name? if none of the `mutationPrefixes` are found in a function's name then it becomes a Query by default. This can be seen in the `isMutation` function in `conventions.go`

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

I like to start this section by stating that; Security Through Isolation design principle makes Wasm specially suitable for environments requiring high levels of security, such as Modus, cloud-native applications, and multi-tenant systems. It is a fundamental principle in software and systems design that is applied across different technologies to enhance security and reliability. So, keep a mental note of this as we proceed.

The following goes over the high level and the very basics of how Modus handles WebAssembly execution without getting into in the technical details. If I survive the next few weeks/months, I'm planning to dig deeper into each phase where possible.

#### Sandboxed Execution

Assume your code is now complied, and you have a `.wasm` file.

- This compiled Wasm module gets uploaded to the Modus environment and is associated with an API endpoint like a GraphQL query or mutation. In next part of this series we will cover what is Hypermode, and deployment or import of your modus app to Hypermode via Hyp CLI and Hypermode console UI, but for now think of it a fully managed serverless framework providing the infrastructure for running modus applications.

- When a client sends a request, such as an HTTP or GraphQL query, the request gets mapped to a function in your Wasm module and triggers the execution of the Wasm function

- At this point the Wazero runtime comes into play:
  - A new Wasm **instance** is created for the request
  - The Wazero runtime loads the Wasm module into memory and allocates a fresh **linear memory space** for the instance
  - The specific function mapped to the request is invoked within this Wasm **instance**
  - Wazero ensures that execution happens securely and in **isolation** leveraging Wasm’s sandboxing capabilities

Diagram below illustrates WebAssembly's sandbox security and isolation concepts we discussed. Showing the key components and their relationships:

- Resources control and limit what instances can use
- Each Wasm instance connects to its own memory space
- Memory spaces connect to function boundaries
- Function boundaries control interaction with external access
- All external communication flows through the controlled access layer

_Figure 1: High-level overview of WebAssembly Sandbox Security Isolation_
![Wasm Execution](https://dhbtuus86mod.cloudfront.net/wasm-sandbox.svg)

#### Memory Safety

Few pointers on memory safety to keep in my mind:

- **Linear Memory Model**: Wasm modules can only access their own linear memory space, preventing unauthorized access to other parts of the system memory.

- **Bounds Checking**: All memory access is automatically bounds-checked, preventing buffer overflows and memory corruption vulnerabilities.

- **Type Safety**: Wasm's type system ensures that functions can only be called with correct parameter types and memory can only be accessed in well-defined ways. This is enforced at both runtime and compile time, please refer to reference material at the end of this post.

- **No Direct Pointer Access**: Unlike native code, Wasm cannot directly manipulate memory addresses or perform pointer arithmetic, eliminating entire classes of memory-related vulnerabilities. It worth mentioning that while direct pointer manipulation isn't possible, Wasm does provide controlled ways to work with memory indices.

These safety features make Wasm particularly ideal for secure sandboxed execution of code, whether in the browser or in server-side environment.

In the next part of this series we will dive into a demo of creating a modus app and deploying it to Hypermode platform.

`all opinions are me own`

References:
wazero wazero.io/docs
webassembly: memory and type safety

^^^ published at: https://kamc.hashnode.dev/challenging-the-hype-a-look-at-modus-and-the-future-of-model-native-apps-part-1 ^^^

## PART II

# notes-use

---

### on using own API keys to an LLM or Hypermode's hosted

Modus app that uses your own API key to OpenAI GPT-4 should still work when deployed to Hypermode. However, you'll need to ensure that your API key is properly managed as a secret.

When working locally, Modus uses environment variables to handle secrets like API keys. These are typically stored in a .env.dev.local file in your app folder. For example:

MODUS_OPENAI_API_KEY="your openai key"

When deploying to Hypermode, you'll need to make sure your API key is securely stored and accessible to your app. The exact method for managing secrets in Hypermode isn't explicitly mentioned in the their docs (please let me know if I'm mistaken), but it's likely that Hypermode provides a way to securely store and access such secrets in a deployed environment.

It's important to note that while Hypermode offers some hosted models, it also supports connections to external services like OpenAI. Your app's manifest file should define the connection to OpenAI, including how the API key is referenced.

---

In [Part I](https://kamc.hashnode.dev/challenging-hype-modus-model-native) we scratched the surface on Modus and how its Model-Native apps concept aims to shift our designs by embedding AI/ML models as foundational components in developing intelligent APIs. Now we're going to create a overly simple GraphQL endpoint that received a request and based on its content responds with some over-the-top sarcastic response.

Let's go through the high level flow of this modus app which the gist of it can be summarized in the following screenshot:

![IMG](https://dhbtuus86mod.cloudfront.net/graphql-req-resp.png)

- This is a modus app and it's running locally as you can tell
- It has a GraphQL `Query` type
- Along with a `generateExecses` method that returns us a `String` and a parameter call `event` that seems to be an invite to a wedding of some sort
- In the response portion of the UI we see a response to this call that provides couple of legit execuses

## Behind the scenes

As we mentioned in [part I](https://kamc.hashnode.dev/challenging-the-hype-a-look-at-modus-and-the-future-of-model-native-apps-part-1) of this series `modus.json` is like a manifest of your modus app.


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

and our `index.ts`, which serves as your main export for our AssemblyScript function `generateExcuses()` and makes it available in our app's generated API.

```js
import { models } from "@hypermode/modus-sdk-as";
import {
  OpenAIChatModel,
  SystemMessage,
  UserMessage,
} from "@hypermode/modus-sdk-as/models/openai/chat";

export function generateExcuses(event: string): string {
  const modelName: string = "llm";
  const model = models.getModel<OpenAIChatModel>(modelName);

  const prompt = `Generate 2 absurd, sarcastic, over-the-top and dark excuses for why I can't attend "${event}".
  Make them elaborate, ridiculous, and completely unbelievable.
  Each excuse should be at least 2 sentences long.
  Format the response as a JSON array of strings, with each excuse as a separate element.`;

  const input = model.createInput([
    new SystemMessage(
      "You are a creative, dark and sarcastic excuse generator. Your excuses should be outlandish and humorous."
    ),
    new UserMessage(prompt),
  ]);

  // set temperature to higher value for more creative responses
  input.temperature = 0.9;

  const response = model.invoke(input);
  return response.choices[0].message.content.trim();
}
```

to run the app locally we issue:
```bash
npx modus dev
```
and we will see an output like the following:

![IMG](https://dhbtuus86mod.cloudfront.net/npx-run-modus-output.png)

You can then use either of the following endpoints to interact with your app:

```bash
Your local endpoint is ready!
GraphQL (default): http://localhost:8686/graphql
View endpoint: http://localhost:8686/explorer
```

![IMG](https://dhbtuus86mod.cloudfront.net/graphql-req-resp.png)

Diagram below depicts the high level interaction and flow of how this simple modus app works:

![IMG](https://dhbtuus86mod.cloudfront.net/modus-blog-local-sample-app.png)

Codebase is available [here](https://github.com/KazChe/modus-intelligent-api)

//TODO: update end of Part I article with link to this (Part II)
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

modus

hypermod
