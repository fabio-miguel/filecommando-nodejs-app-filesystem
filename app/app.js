const { rename } = require("fs");
const fs = require("fs/promises");

(async () => {
  // commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete the file";
  const RENAME_FILE = "rename the file";
  const UPDATE_FILE = "update the file";

  // helper functions
  const createFile = async (path) => {
    try {
      // check if file already exists
      const existingFileHandle = await fs.open(path, "r");
      existingFileHandle.close();

      // if the file already exists...
      return console.log(`The file ${path} already exists.`);
    } catch (error) {
      // if we don't have the file, create it
      const newFileHandle = await fs.open(path, "w");
      console.log("A new file was created.");
      newFileHandle.close();
    }
  };

  const deleteFile = async (path) => {
    try {
      // delete file
      await fs.unlink(path, (err) => {
        if (err) throw err;
        console.log("File deleted!");
      });
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("No file to delete at this path.");
      } else {
        console.log("An error occured while delting the file.");
        console.log(error);
      }
    }
  };

  const renameFile = async (oldPath, newPath) => {
    try {
      // rename file
      await fs.rename(oldPath, newPath);
      console.log("File Renamed!");
    } catch (error) {
      if (error.code === "ENOENT") {
        Console.log(
          "No file at this path to rename, or the destination doesn't exist."
        );
      } else {
        console.log("An error occured while deleting the file.");
        console.log(error);
      }
    }
  };

  const updateFile = async (path, newText) => {
    try {
      // open file
      const fileHandle = await fs.open(path, "a");
      // write new text to file
      fileHandle.write(newText);
      console.log("Updated!");
      fileHandle.close();
    } catch (error) {
      if (error.code === "ENOENT") {
        Console.log("No file at this path to update.");
      } else {
        console.log("An error occured while updating the file");
        console.log(error);
      }
    }
  };

  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    // get the size of the file
    const fileSize = (await commandFileHandler.stat()).size;
    // allocate buffer size with size of file
    const buff = Buffer.alloc(fileSize);
    // location to start filling buffer
    const offset = 0;
    // how many bytes we want to read
    const length = buff.byteLength;
    // the position we want to start reading file from
    const position = 0;
    // read all content (from start to end)
    await commandFileHandler.read(buff, offset, length, position);
    // decode command
    const command = buff.toString("utf-8");

    // create a file:
    // create a file <path>
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);

      createFile(filePath);
    }

    // delete a file:
    // delete a file <path>
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);

      deleteFile(filePath);
    }

    // rename a file:
    // rename a file <path> to <new-path>
    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(_idx + 4);

      renameFile(oldFilePath, newFilePath);
    }

    // update a file
    // update a file <path> with <new-text>
    if (command.includes(UPDATE_FILE)) {
      const _idx = command.indexOf(" with ");
      const filePath = command.substring(UPDATE_FILE.length + 1, _idx);
      const updateText = command.substring(_idx + 6);

      updateFile(filePath, updateText);
    }
  });

  // watcher...
  const watcher = fs.watch("./command.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
