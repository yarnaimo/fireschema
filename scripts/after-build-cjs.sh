#!/bin/sh

for f in `find dist -name '*.cjs'`; do
  sed -i.bak -e 's#require("\(.\+\)\.js")#require("\1.cjs")#' $f
  rm $f.bak
done
