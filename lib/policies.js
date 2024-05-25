const path = require("path");
const fs = require("fs");
const YAML = require("yaml");

class PoliciesValidationError extends Error {}

// loaded ressources
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

    checkPolicies();
}

function checkPolicies() {
    ressources.forEach(({ressource, rules }) => {
        if(!ressource)
            throw new PoliciesValidationError("Missing ressource name.");
        if(!rules?.length)
            throw new PoliciesValidationError("You need to have at least one rule.");
        if(!rules.every(rule => rule?.actions?.length))
            throw new PoliciesValidationError("Missing at least one action in each rules.");
    });
}

function getRulesOf(ressource) {
    // @todo manage condition logic
    return ressources.find(({ressource: r}) => r === ressource)?.rules ?? null;
}

module.exports = {
    loadPolicies,
    getRulesOf
}