#!/bin/bash
kill $(lsof -t -i:5173) || true
npm run dev
