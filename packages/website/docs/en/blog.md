# Notes => Blog

> [Prerequisites](./book.md#prerequisites)

## Prerequisite

> In the following example, [joplin](https://joplinapp.org/) is used as the note-taking tool, and [hexo](https://hexo.io/) is used as the blogging platform. However, both can be replaced. For example, the note source can be replaced with Obsidian, and the blog output can be replaced with Hugo.

1.  First, make sure that the web clipper is enabled in Joplin.
    ![joplin-webclipper](./resources/joplin-webclipper.png)
2.  Secondly, you need a hexo project. If you already have one, please refer to [Connecting Joplin to an existing Hexo blog](#connecting-joplin-to-an-existing-hexo-blog). Otherwise, proceed to the next step.

## Creating a Hexo Blog from Scratch

If you don't have a hexo blog yet, you can use a template to reduce configuration.

1.  Create a new project using the template repository [joplin-hexo-demo](https://github.com/mark-magic/joplin-hexo-demo) on GitHub. Follow the path **Use this template > Create a new repository**. If you don't have a GitHub account yet, please [sign up](https://github.com/signup).
2.  Clone your project locally using Git: `git clone https://github.com/<username>/<repo>.git`
3.  Modify the `baseUrl` and `token` values in the mark-magic.config.yaml configuration file to match the values in the Joplin settings.
4.  Add the `blog` tag to the notes you want to publish in Joplin.
5.  Run the command `npx mark-magic && npx hexo server`. You can see your notes by opening <http://localhost:4000/joplin-hexo-demo/>.
    ![joplin-blog-demo](./resources/joplin-blog-demo.png)
6.  Now, modify the value of `root` in the \_config.yml configuration file to the name of your cloned GitHub `<repo>`.
7.  In the **Pages** menu in the repository settings on GitHub, choose **Build and deployment > Source > GitHub Actions**.
8.  Finally, run `npm run commit` to push all the notes you want to publish.

Wait for GitHub Actions to complete. You can check the progress at `https://github.com/<username>/<repo>/actions`.

Once everything is done, your site should be deployed at `https://<username>.github.io/<repo>/` or `https://<custom-domain>/`, depending on your settings.

> You can see the sample project at <https://github.com/mark-magic/joplin-hexo-demo>.

## Connecting Joplin to an Existing Hexo Blog

1.  Install dependencies: `npm i -D @mark-magic/cli @mark-magic/plugin-joplin @mark-magic/plugin-hexo`

2.  Add the configuration file `mark-magic.config.yaml`:

    ```yaml
    # mark-magic.config.yaml
    tasks:
      - name: blog
        input:
          name: '@mark-magic/plugin-joplin' # Input plugin to fetch data from Joplin notes
          config:
            baseUrl: 'http://localhost:27583' # Address of the Joplin web clipper service, usually http://localhost:41184, but here we use the development address http://localhost:27583 for demonstration
            token: '5bcfa49330788dd68efea27a0a133d2df24df68c3fd78731eaa9914ef34811a34a782233025ed8a651677ec303de6a04e54b57a27d48898ff043fd812d8e0b31' # Token for the Joplin web clipper service
            tag: blog # Filter notes based on the tag
        output:
          name: '@mark-magic/plugin-hexo' # Output plugin to generate files required by Hexo
          config:
            path: './' # Root directory of the Hexo project
            base: /joplin-hexo-demo/ # Base URL when deployed, usually the root path of the domain. Should match the 'root' configuration in hexo _config.yml
    ```

3.  Modify the Hexo configuration file `_config.yml` if it includes:

    ```yaml
    permalink: /p/:abbrlink/
    ```

4.  Fetch the notes from Joplin and generate the required files for the Hexo blog:

    ```sh
    npx mark-magic # This will clear the source/_posts and source/resources directories. Please backup any files you have there.
    ```

Afterwards, you can see the generated files in the `source/_posts` and `source/resources` directories. You can now continue building and publishing your blog using Hexo.
