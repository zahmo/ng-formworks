const simpleGit = require('simple-git');
const minimist = require('minimist');
const fs = require('fs');
const path = require('path');

const git = simpleGit();

/**
 * Configure minimist
 * argv.config: captures --config <path>
 * argv.revertonly: boolean flag
 */
const argv = minimist(process.argv.slice(2), {
    string: ['config'], // --config is followed by a string
    boolean: ['revertonly'], // --revertonly is a boolean toggle
    alias: {
        c: 'config',
        r: 'revertonly'
    },
    default: {
        config: 'git_merge_ignore.json', // Default config file
        revertonly: false
    }
});

/**
 * Reads the ignore list from the JSON file specified by the --config flag.
 */
function readConfig() {
    const absolutePath = path.resolve(process.cwd(), argv.config);

    if (fs.existsSync(absolutePath)) {
        try {
            const data = fs.readFileSync(absolutePath, 'utf8');
            const json = JSON.parse(data);
            return Array.isArray(json) ? json : (json.ignore || []);
        } catch (err) {
            console.error(`Error parsing JSON at ${argv.config}:`, err.message);
            process.exit(1);
        }
    }

    // If a custom config was provided but not found, throw an error
    if (argv.config !== 'git_merge_ignore.json') {
        console.error(`Error: Config file not found at ${argv.config}`);
        process.exit(1);
    }

    return [];
}

async function revertIgnored(filesToIgnore) {
    console.log(`Reverting ${filesToIgnore.length} files...`);
    for (const file of filesToIgnore) {
        try {
            await git.reset(['HEAD', file]);
            await git.checkout(file);
            console.log(`  [OK] Kept local: ${file}`);
        } catch (e) {
            console.warn(`  [SKIP] Could not revert ${file}`);
        }
    }
}

async function mergeWithIgnore(sourceBranch, filesToIgnore) {
    try {
        console.log(`Starting merge from ${sourceBranch}...`);
        await git.merge([sourceBranch, '--no-commit', '--no-ff']);
        await revertIgnored(filesToIgnore);
        await git.commit(`Merged ${sourceBranch} while ignoring specific files`);
        console.log('Successfully merged and committed.');
    } catch (err) {
        console.error('Error during merge:', err.message);
    }
}

// --- Execution Logic ---

const sourceBranch = argv._[0]; // Positional argument for branch
const isRevertOnly = argv.revertonly;
const filesToIgnore = readConfig();

if (isRevertOnly) {
    revertIgnored(filesToIgnore);
} else if (sourceBranch) {
    mergeWithIgnore(sourceBranch, filesToIgnore);
} else {
    console.error('Usage: node git_merge.js <branch> [--config path.json] [--revertonly]');
}