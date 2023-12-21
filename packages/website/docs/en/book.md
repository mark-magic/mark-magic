# Novel => Website + EPUB

## Prerequisites

1.  [Node.js](https://nodejs.org) latest lts version must be installed.
2.  [Git](https://git-scm.com/) latest version must be installed.
3.  A terminal to access mark-magic via command line.
4.  A text editor that supports markdown and yaml, such as [VSCode](https://code.visualstudio.com/).

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

Add a configuration file `mark-magic.config.yaml`, with inputs from the local books directory, and outputs to epub/docs respectively.

```yaml
# mark-magic.config.yaml
tasks:
  - name: epub
    input:
      name: '@mark-magic/plugin-local' # Input plugin, reads from local directory
      config:
        path: ./books/ # Directory to read from
    output:
      name: '@mark-magic/plugin-epub' # Output plugin, generates epub files
      config:
        path: ./dist/my-book.epub # Output path
        id: my-book # Unique ID of the novel
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

Start with the novel's homepage, create a readme.md file in the books directory to serve as the homepage.

```md
# Hello World
```

You can continue writing more by using prefixes like 01, 02, 03, etc. for file names to maintain order.

File structure

```sh
.
├─ books
│  ├─ 01.md
│  ├─ 02.md
│  └─ readme.md
└─ package.json
```

## Run Build

Now you can start the build process.

```sh
npx mark-magic
```

Once finished, you can see the generated epub file and the built HTML files in the dist folder. Use live-server to preview them.

```sh
npx live-server dist/docs
```

> You can find the example project at <https://github.com/mark-magic/book-demo>.

## What's Next?

- If you want to deploy it online immediately, make sure to read the [Deployment Guide](./deploy.md).
- To have a better understanding of how it works, continue reading the [Plugins](./plugin/index.md).
