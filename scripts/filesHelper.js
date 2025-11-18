import Path from "path";
import fs from "fs/promises";

if (process.argv.length < 4) {
  console.error('Usage: node filesHelper.js [-c|-d] <sourcePath> <destinationPath>');
  process.exit(1);
}

const operation = process.argv[2];
const sourcePath = Path.resolve(process.argv[3]);
const destinationPath = process.argv[4] ? Path.resolve(process.argv[4]) : null;

async function copyFolders(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });

    const files = await fs.readdir(src);

    for (const file of files) {
      const srcPath = Path.join(src, file);
      const destPath = Path.join(dest, file);

      const stats = await fs.stat(srcPath);

      if (stats.isDirectory()) {
        await copyFolders(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    throw err;
  }
}

async function deleteFolder(folderPath) {
  try {
    const files = await fs.readdir(folderPath);

    for (const file of files) {
      const fullPath = Path.join(folderPath, file);
      const stats = await fs.stat(fullPath);

      if (stats.isDirectory()) {
        await deleteFolder(fullPath);
      } else {
        await fs.unlink(fullPath);
      }
    }

    await fs.rmdir(folderPath);
  } catch (err) {
    throw err;
  }
}

(async () => {
  try {
    if (operation === "-c") {
      await copyFolders(sourcePath, destinationPath);
      console.log("Copy completed successfully.");
    } else if (operation === "-d") {
      await deleteFolder(sourcePath);
      console.log("Delete completed successfully.");
    } else {
      console.error("Invalid operation. Use -c or -d.");
    }
  } catch (err) {
    console.error(`Error: ${err}`);
  }
})();
