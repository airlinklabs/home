import fs from 'fs-extra';
import path from 'path';

const root = path.resolve(new URL('.', import.meta.url).pathname, '../../');
const file = path.join(root, 'data', 'github-cache', 'cache.xml');
const xml = await fs.readFile(file, 'utf8');

const required = [
  /<generatedAt>[^<]+<\/generatedAt>/,
  /<stats>[\s\S]*<\/stats>/,
  /<contributors>[\s\S]*<\/contributors>/,
  /<panelCommits>[\s\S]*<\/panelCommits>/,
  /<daemonCommits>[\s\S]*<\/daemonCommits>/,
  /<addons>[\s\S]*<\/addons>/,
];

const failures = required.filter(rule => !rule.test(xml));
const contributorCount = (xml.match(/<contributor>/g) || []).length;
const commitCount = (xml.match(/<commit>/g) || []).length;

if (failures.length || /<contributor>[\s\S]*<\/contributor>/.test(xml) && !/<name>[^<]+<\/name>/.test(xml)) {
  console.error('GitHub cache validation failed. Expected named contributor records and top-level sections.');
  process.exit(1);
}

console.log(`GitHub cache OK: ${contributorCount} contributors, ${commitCount} commits.`);
