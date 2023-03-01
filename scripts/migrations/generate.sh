#!/usr/bin/env sh

npm run typeorm migration:generate src/database/migrations/$1
