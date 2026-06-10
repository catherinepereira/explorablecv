# Transformer Playground

An interactive walkthrough of self-attention. Type a sentence and a pretrained BERT-tiny tokenizes it, runs in your browser, and produces its attention matrix. Pick any layer and head to see how the model distributes attention across tokens. Runs entirely client-side via ONNX Runtime Web. The model is converted by [transformer-playground-model](https://github.com/catherinepereira/transformer-playground-model).

## Run

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5506`.

## Credits

The favicon is the "robot face" emoji from [Twemoji](https://github.com/twitter/twemoji) by Twitter, Inc. and other contributors, licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).
