const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");

const DIST_FOLDER = path.resolve("dist");
const GH_PAGES_BRANCH = "gh-pages";

async function run() {
  try {
    console.log("Building the project...");
    execSync("npm run build", { stdio: "inherit" });

    console.log("Checking if 'gh-pages' branch exists...");
    try {
      execSync(`git rev-parse --verify ${GH_PAGES_BRANCH}`);
    } catch {
      console.log("'gh-pages' branch does not exist. Creating it...");
      execSync(`git checkout --orphan ${GH_PAGES_BRANCH}`);
      execSync("git rm -rf .", { stdio: "inherit" });
      fs.writeFileSync(".gitignore", "node_modules\n.DS_Store\n", "utf-8");
      execSync("git add .gitignore");
      execSync("git commit -m 'Initial commit for gh-pages'");
      execSync("git push -u origin ${GH_PAGES_BRANCH}");
      execSync("git checkout -");
    }

    console.log("Switching to 'gh-pages' branch...");
    execSync(`git checkout ${GH_PAGES_BRANCH}`);

    console.log("Cleaning up old files in 'gh-pages'...");
    rimraf.sync("*");

    console.log("Copying 'dist' content to 'gh-pages' branch...");
    fs.readdirSync(DIST_FOLDER).forEach((file) => {
      const src = path.join(DIST_FOLDER, file);
      const dest = path.join(process.cwd(), file);
      fs.cpSync(src, dest, { recursive: true });
    });

    console.log("Committing and pushing changes...");
    execSync("git add .", { stdio: "inherit" });
    execSync("git commit -m 'Deploy to GitHub Pages'", { stdio: "inherit" });
    execSync("git push", { stdio: "inherit" });

    console.log("Switching back to the main branch...");
    execSync("git checkout -", { stdio: "inherit" });

    console.log("Deployment completed successfully!");
  } catch (error) {
    console.error("Error during deployment:", error.message);
  }
}

run();
