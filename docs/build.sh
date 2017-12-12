#! /bin/bash

# clear readme.md
: > ./readme.md

# merge all doc.md to readme.md doc by this order
for md in intro edit mock proxy group authority list push keymap faq
do
  ( cat ${md}.md; echo ) >> ./readme.md
done

echo "build readme.md done"
