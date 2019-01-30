#!/bin/bash
rm ./releases/butWhyMod_xul.xpi
zip -r ./releases/butWhyMod_xul.xpi chrome.manifest content locale install.rdf skin
