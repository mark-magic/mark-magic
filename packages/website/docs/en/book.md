# Novel => Website + EPUB

## Prerequisites

1.  The latest LTS version of [nodejs](https://nodejs.org) is already installed.
2.  The latest version of [git](https://git-scm.com/) is already installed.
3.  A terminal for accessing mark-magic through the command line interface.
4.  A text editor that supports markdown and yaml, [vscode](https://code.visualstudio.com/) is recommended.

## Initialize the Novel Project

1.  Create an empty directory and initialize a package.json and the books directory to store the novel.

    ```sh
    mkdir my-book && cd my-book
    npm init -y
    mkdir books
    ```

2.  Install dependencies

    ```sh
    npm i -D @mark-magic/cli @mark-magic/plugin-docs @mark-magic/plugin-epub live-server
    ```

## Configure the Novel

Add the configuration file `mark-magic.config.yaml`, where the input is the local books directory and the outputs are epub/docs.

```yaml
# mark-magic.config.yaml
tasks:
  - name: epub
    input:
      name: '@mark-magic/plugin-local' # Input plugin, reads from the local directory
      config:
        path: ./books/ # Directory to read from
    output:
      name: '@mark-magic/plugin-epub' # Output plugin, generates epub file
      config:
        path: ./dist/my-book.epub # Path to generate
        id: my-book # Unique ID for the novel
        title: My First Book # Name of the novel
        creator: Mark Magic # Creator
  - name: docs
    input:
      name: '@mark-magic/plugin-local' # Same as above
      config:
        path: ./books/
    output:
      name: '@mark-magic/plugin-docs' # Same as above
      config:
        path: ./dist/docs/ # Directory to output
        name: 'My First Book' # Name of the novel
```

## Start Writing

Start with the homepage of the novel, create a readme.md in the books directory.

```md
# Hello World
```

Continue writing more chapters if desired, to maintain order, it is recommended to use prefixes like 01, 02, 03... for the file names.

File structure

```sh
.
├─ books
│  ├─ 01.md
│  ├─ 02.md
│  └─ readme.md
└─ package.json
```

## Run the Build

Now, it's time to build.

```sh
npx mark-magic
```

Once done, you can find the epub file and the built html files in the dist directory. Use live-server to preview it.

```sh
npx live-server dist/docs
```

> You can find a sample project at <https://github.com/mark-magic/book-demo>.

## What's next?

- If you want to deploy it online immediately, make sure to read the [Deployment Guide](./deploy.md).
- To have a better understanding of how it works, continue reading the [Plugins](./plugin/index.md).
