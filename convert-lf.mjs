import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const workflowDir = ".github/workflows";
const files = readdirSync(workflowDir);

files.forEach((file) => {
  if (file.endsWith(".yaml")) {
    const path = join(workflowDir, file);
    const content = readFileSync(path, "utf8");
    const lfContent = content.replace(/\r\n/g, "\n");
    writeFileSync(path, lfContent);
    console.log(`Converted ${file} to LF`);
  }
});
