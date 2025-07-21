#!/bin/bash
cd /Users/jaytarzwell/jaystarz1.github.io
git revert --no-commit 38c3ab6 f1ab269
git add ai-news.html
git commit -m "Revert AI news page to working Daily AI Digest version"
