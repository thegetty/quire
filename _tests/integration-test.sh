#!/usr/bin/env bash

npm install file:packages/cli
npx quire new --debug --quire-path $(pwd)/packages/11ty test-pub $(pwd)/packages/quire-starter-default 
cd test-pub
npx quire build
npx quire pdf --page-pdfs