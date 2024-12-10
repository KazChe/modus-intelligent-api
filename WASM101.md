# WebAssembly 101

Here was/is/still is my high level understanding of WebAssembly when I started to look into it in more details:
 It takes your program in a language that supports for WebAssembply (wasm) and takes it to that very intermediary step for it to be compiled to what is very close in resemblance to the machine code (binary) executable.

According to Mozilla Developer Network (MDN):

>WebAssembly is a type of code that can be run in modern web browsers — it is a low-level assembly-like language with a compact binary format that runs with near-native performance and provides languages such as C/C++, C# and Rust with a compilation target so that they can run on the web. It is also designed to run alongside JavaScript, allowing both to work together.

I added this to point out that although on the surface we see a lot of emphasis on `Web` and the name itself **Web**Assembly carries the same emphasis, it is not all `Web` stuff.

## WebAssembly is not just for the browser, but it was

Maintainers of WebAssembly use the term `Embedding` which seems to be in reference to how WebAssembly module/application can be integrated into a larger environment. This larger environment provides the WebAssemboly module to come alive and do its work. SO, the larger environment or hosts provides I/O, system calls, and memory access that a WebAssembly module needs, an execution context. In its most simplest term WebAssembly module is nothing but a set of low-level instructions that needs to be embedded in order to do its work.

Originally the intent for WASM was to address and target web based applications' performance in the browser. As developers realized that since this WASM thing can run in the browser's runtime or `web embedded` across multiple Operating Systems, then what the heck let's tweak it and extend it beyond the browser runtime, within a standaline runtime that's embedded directly on an Operating System, `Non-Web embedded`. WASM broke out of its browser runtime cage.



```
Development of the WebAssembly System Interface (WASI): In 2019, Mozilla introduced the WebAssembly System Interface (WASI), 

Creation of Standalone Wasm Runtimes
```





