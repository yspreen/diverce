import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ConversionOptions {
  projectPath: string;
  projectName: string;
  enableKVCache?: boolean;
  kvNamespaceId?: string;
  packageJsonPath?: string; // Optional relative path to package.json (e.g., 'src')
}

export interface ConversionResult {
  success: boolean;
  message: string;
  logs: string[];
}

export class ConversionPipeline {
  private options: ConversionOptions;
  private logs: string[] = [];

  constructor(options: ConversionOptions) {
    this.options = options;
  }

  // Helper method to get the package.json path
  private getPackageJsonPath(): string {
    if (this.options.packageJsonPath) {
      return path.join(this.options.projectPath, this.options.packageJsonPath, 'package.json');
    }
    return path.join(this.options.projectPath, 'package.json');
  }

  private log(message: string) {
    this.logs.push(message);
    console.log(message);
  }

  async run(): Promise<ConversionResult> {
    try {
      this.log('Starting conversion pipeline...');

      // Step 1: Verify Next.js project and check for edge runtime
      await this.verifyNextJsProject();

      // Step 2: Install OpenNext dependencies
      await this.installDependencies();

      // Step 3: Generate or update open-next.config.ts
      await this.createOpenNextConfig();

      // Step 4: Generate or update wrangler.jsonc
      await this.createWranglerConfig();

      // Step 5: Update package.json scripts
      await this.updatePackageJson();

      // Step 6: Remove conflicting references (@cloudflare/next-on-pages, edge runtime)
      await this.removeConflictingReferences();

      // Step 7: Add .open-next to .gitignore
      await this.updateGitignore();

      this.log('Conversion completed successfully! 🎉');

      return {
        success: true,
        message: 'Project successfully converted to use @opennextjs/cloudflare',
        logs: this.logs,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log(`Error during conversion: ${errorMessage}`);

      return {
        success: false,
        message: `Conversion failed: ${errorMessage}`,
        logs: this.logs,
      };
    }
  }

  private async verifyNextJsProject() {
    this.log('Verifying Next.js project...');

    // Get the package.json path
    const packageJsonPath = this.getPackageJsonPath();

    if (this.options.packageJsonPath) {
      this.log(`Using custom package.json path: ${this.options.packageJsonPath}`);
    }

    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`Could not find package.json at ${packageJsonPath}`);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Check for Next.js dependency
    if (!packageJson.dependencies?.next && !packageJson.devDependencies?.next) {
      throw new Error('This project does not appear to be a Next.js project (next package not found)');
    }

    this.log('Next.js project verified ✅');

    // Check for edge runtime references
    this.log('Checking for Edge Runtime usage...');
    try {
      const { stdout } = await execAsync('grep -r "export const runtime = \\"edge\\"" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" .', { cwd: this.options.projectPath });

      if (stdout.trim()) {
        this.log('⚠️ WARNING: Edge Runtime usage detected. These will be removed during conversion.');
      } else {
        this.log('No Edge Runtime usage detected ✅');
      }
    } catch (error) {
      // If grep returns no matches, it exits with code 1, which causes exec to throw
      // This is normal and expected when no matches are found
      this.log('No Edge Runtime usage detected ✅');
    }
  }

  private async installDependencies() {
    this.log('Installing OpenNext dependencies...');

    try {
      // Determine the correct directory to run npm install in
      let installDir = this.options.projectPath;

      // If a custom package.json path is provided, use that directory for npm install
      if (this.options.packageJsonPath) {
        installDir = path.join(this.options.projectPath, this.options.packageJsonPath);
        this.log(`Installing dependencies in custom directory: ${installDir}`);
      }

      await execAsync('npm install --save-dev @opennextjs/cloudflare@latest wrangler@latest', {
        cwd: installDir
      });
      this.log('Dependencies installed successfully ✅');
    } catch (error) {
      throw new Error(`Failed to install dependencies: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async createOpenNextConfig() {
    this.log('Creating or updating open-next.config.ts...');

    // Use the same directory as package.json for config files
    let configDir = this.options.projectPath;
    if (this.options.packageJsonPath) {
      configDir = path.join(this.options.projectPath, this.options.packageJsonPath);
    }

    const configPath = path.join(configDir, 'open-next.config.ts');
    const config = `import { defineCloudflareConfig } from "@opennextjs/cloudflare";
${this.options.enableKVCache ? 'import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";' : ''}

export default defineCloudflareConfig({
${this.options.enableKVCache ? '  incrementalCache: kvIncrementalCache,' : ''}
});
`;

    fs.writeFileSync(configPath, config);
    this.log('open-next.config.ts created/updated ✅');
  }

  private async createWranglerConfig() {
    this.log('Creating or updating wrangler.jsonc...');

    // Use the same directory as package.json for config files
    let configDir = this.options.projectPath;
    if (this.options.packageJsonPath) {
      configDir = path.join(this.options.projectPath, this.options.packageJsonPath);
    }

    const wranglerPath = path.join(configDir, 'wrangler.jsonc');
    const kvNamespaces = this.options.enableKVCache && this.options.kvNamespaceId
      ? `[
  {
    "binding": "NEXT_CACHE_WORKERS_KV",
    "id": "${this.options.kvNamespaceId}"
  }
]`
      : '[]';

    const config = `{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "${this.options.projectName}",
  "compatibility_date": "2024-12-30",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "kv_namespaces": ${kvNamespaces}
}
`;

    fs.writeFileSync(wranglerPath, config);
    this.log('wrangler.jsonc created/updated ✅');
  }

  private async updatePackageJson() {
    this.log('Updating package.json scripts...');

    const packageJsonPath = this.getPackageJsonPath();
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.preview = 'opennextjs-cloudflare build && wrangler dev';
    packageJson.scripts.deploy = 'opennextjs-cloudflare build && wrangler deploy';
    packageJson.scripts['cf-typegen'] = 'wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts';

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    this.log('package.json scripts updated ✅');
  }

  private async removeConflictingReferences() {
    this.log('Removing conflicting references...');

    const packageJsonPath = this.getPackageJsonPath();
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (packageJson.dependencies?.['@cloudflare/next-on-pages']) {
      delete packageJson.dependencies['@cloudflare/next-on-pages'];
      this.log('Removed @cloudflare/next-on-pages from dependencies');
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }

    if (packageJson.devDependencies?.['@cloudflare/next-on-pages']) {
      delete packageJson.devDependencies['@cloudflare/next-on-pages'];
      this.log('Removed @cloudflare/next-on-pages from devDependencies');
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }

    // Determine directory to search based on package.json location
    let searchDir = this.options.projectPath;
    if (this.options.packageJsonPath) {
      searchDir = path.join(this.options.projectPath, this.options.packageJsonPath);
    }

    // Replace "export const runtime = 'edge'" references
    try {
      await execAsync("find . -type f -name '*.js' -o -name '*.jsx' -o -name '*.ts' -o -name '*.tsx' | xargs -I{} sed -i '' 's/export const runtime = .edge.;/\\/\\/ Removed edge runtime declaration/g' {}", {
        cwd: searchDir,
      });

      this.log('Removed edge runtime declarations from files');
    } catch (error) {
      this.log('Note: Could not automatically remove edge runtime declarations. You may need to remove these manually.');
    }

    this.log('Conflicting references removed ✅');
  }

  private async updateGitignore() {
    this.log('Updating .gitignore...');

    // Find relevant .gitignore location
    // First check project root, then package.json directory if different
    let gitignorePath = path.join(this.options.projectPath, '.gitignore');
    let content = '';

    // If package.json is in a subfolder and root .gitignore doesn't exist, look in the subfolder
    if (this.options.packageJsonPath && !fs.existsSync(gitignorePath)) {
      const subfolderGitignore = path.join(this.options.projectPath, this.options.packageJsonPath, '.gitignore');
      if (fs.existsSync(subfolderGitignore)) {
        gitignorePath = subfolderGitignore;
        this.log(`Using .gitignore from subfolder: ${this.options.packageJsonPath}/.gitignore`);
      }
    }

    if (fs.existsSync(gitignorePath)) {
      content = fs.readFileSync(gitignorePath, 'utf8');
    } else {
      this.log('No existing .gitignore found, creating a new one');
    }

    if (!content.includes('.open-next')) {
      content += '\n# OpenNext build output\n.open-next\n';
      fs.writeFileSync(gitignorePath, content);
      this.log('Added .open-next to .gitignore ✅');
    } else {
      this.log('.open-next already in .gitignore ✅');
    }
  }
} 