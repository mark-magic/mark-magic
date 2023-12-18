# Novel => Website + EPUB

## Prerequisites

1.  Latest LTS version of [nodejs](https://nodejs.org) is already installed.
2.  Terminal to access mark-magic through the command-line interface.
3.  Text editor that supports markdown and yaml. [vscode](https://code.visualstudio.com/) is recommended.

## Initialize Novel Project

1.  Create an empty directory and initialize a package.json and a books directory to store the novel.

    ```sh
    mkdir my-book && cd my-book
    npm init -y
    mkdir books
    ```

2.  Install dependencies

    ```sh
    npm i -D @mark-magic/cli @mark-magic/plugin-docs @mark-magic/plugin-epub live-server
    ```

## Configure Novel

Add a configuration file `mark-magic.config.yaml` with the input as the local books directory and the output as epub/docs respectively.

```yaml
# mark-magic.config.yaml
tasks:
  - name: epub
    input:
      name: '@mark-magic/plugin-local' # Input plugin to read from local directory
      config:
        path: ./books/ # Directory to read from
    output:
      name: '@mark-magic/plugin-epub' # Output plugin to generate epub files
      config:
        path: ./dist/my-book.epub # Output path
        id: my-book # Unique id of the novel
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
        path: ./dist/docs/ # Output directory
        name: 'My First Book' # Name of the novel
```

## Start Writing

Start from the homepage of the novel by creating a readme.md file in the books directory.

```md
# Hello World
```

You can then continue writing more. To maintain the order, it is recommended to use prefixes like 01, 02, 03... for file names.

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

Now, you can start the build process.

```sh
npx mark-magic
```

Once completed, you can find the epub file and the built HTML files in the dist folder. Use live-server to preview them.

```sh
npx live-server dist/docs
```

> You can see a sample project at <https://github.com/mark-magic/book-demo>.

## What's Next?

- If you want to deploy it online immediately, be sure to read the [deployment guide](./deploy.md)
- To have a better understanding of the functioning, continue reading about the [plugins](./plugin/index.md)
