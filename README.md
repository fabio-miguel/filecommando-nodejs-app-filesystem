## Node.js | File System 

### About FileComman-Do

A simple command application that watches a command.txt file for change events so files can be created, deleted, updated and renamed from this file.

Whenever there is a change, it gets the content of the file and decodes what the instructions are. If available, the command will execute.

### Goals

The main aim of this project was to explore and understand the Node.js File System module. In order to do so, I explored what files are and how Node.js handles files. 

### Bugs

There are several bugs I've noticed to keep in mind. First, I'm not handling all possible errors and this isn't production ready. Also, the index (_idx) variable may not work with special characters.
