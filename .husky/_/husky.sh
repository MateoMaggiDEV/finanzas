#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  if [ "$HUSKY_DEBUG" = "true" ]; then
    set -x
  fi
  command "$0" "$@"
fi
