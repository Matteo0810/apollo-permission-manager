const path = require("path");
const fs = require("fs");
const YAML = require("yaml");

const ressources = [];

/**
 * @description load policies folder
 * @param {*} policiesFolder the provided policies folder (relative or absolute path)
 */
function loadPolicies(policiesFolder) {
    if(!policiesFolder)
        throw new Error("Missing required policies folder path.");
    try {
        const folder = fs.readdirSync(policiesFolder);
        for(const file of folder)
            ressources.push(...YAML.parse(fs.readFileSync(path.join(policiesFolder, file), "utf-8")));
    } catch(e) {
        console.error(e);
    }
}

function getRulesOf(ressourceName) {
    return ressources.find(({ressource}) => ressource === ressourceName)?.rules ?? null;
}

module.exports = {
    loadPolicies,
    getRulesOf
}