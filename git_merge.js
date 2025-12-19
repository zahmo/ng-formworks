const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');

const git = simpleGit();

/**
 * Reads the ignore list from a JSON file.
 * Priority: Command line argument > git_merge_ignore.json > empty array
 */
function readConfigFromCLI() {
    const configFile = process.argv[3] || 'git_merge_ignore.json';
    const absolutePath = path.resolve(process.cwd(), configFile);

    if (fs.existsSync(absolutePath)) {
        try {
            const data = fs.readFileSync(absolutePath, 'utf8');
            const json = JSON.parse(data);
            return Array.isArray(json) ? json : (json.ignore || []);
        } catch (err) {
            console.error(`Error parsing JSON file at ${configFile}:`, err.message);
            process.exit(1);
        }
    }

    console.log(`No config file found at ${configFile}. Proceeding with 0 files ignored.`);
    return [];
}

/**
 * Merges sourceBranch into current branch while keeping local versions of filesToIgnore
 */
async function mergeWithIgnore(sourceBranch, filesToIgnore) {
    try {
        console.log(`Starting merge from ${sourceBranch}...`);

        // 1. Start Merge (no commit, no fast-forward)
        await git.merge([sourceBranch, '--no-commit', '--no-ff']);

        // 2. Reset and Checkout specific files to keep current branch versions
        for (const file of filesToIgnore) {
            try {
                await git.reset(['HEAD', file]);
                await git.checkout(file);
                console.log(`  [OK] Kept local version of: ${file}`);
            } catch (fileErr) {
                console.warn(`  [SKIP] Could not protect ${file} (file may not exist in merge)`);
            }
        }

        // 3. Commit the merge
        await git.commit(`Merged ${sourceBranch} while ignoring specific files`);
        console.log('Successfully merged and committed.');
    } catch (err) {
        console.error('Error during merge:', err.message);
        console.error('The merge may have conflicts. Please resolve them manually.');
    }
}

// --- Execution ---

const sourceBranch = process.argv[2];

if (!sourceBranch) {
    console.error('Usage: node script.js <source-branch> [config-file.json]');
    process.exit(1);
}

// 1. Read the list
const filesToIgnore = readConfigFromCLI();

// 2. Execute the merge
mergeWithIgnore(sourceBranch, filesToIgnore);