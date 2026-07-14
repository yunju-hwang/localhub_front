#!/bin/bash
export PATH="$HOME/.local/node-v24.18.0/bin:$PATH"
cd "$(dirname "$0")"
exec npm run dev
