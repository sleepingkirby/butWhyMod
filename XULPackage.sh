#!/bin/bash
rm ./releases/butWhyMod_xul.xpi
zip -r ./releases/butWhyMod_xul.xpi chrome.manifest chrome defaults install.rdf
