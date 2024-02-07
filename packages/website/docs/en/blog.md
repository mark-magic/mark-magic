# Notes to Blog

## Premise

> The following uses [joplin](https://joplinapp.org/) as a note-taking tool and [hexo](https://hexo.io/) as a blog for illustration. However, these two can be replaced. For example, the source of the notes can be replaced with obsidian, and the outputted blog can be replaced with hugo.

1. First, ensure that joplin has already opened the web clipper.
   ![joplin-webclipper](./resources/joplin-webclipper.png)
2. Next, you need a hexo project. If you already have one, please refer to [connect joplin to the existing hexo blog](#connect-joplin-to-existing-hexo-blog), otherwise, continue to the next step.

## Creating a hexo blog from scratch

If you don't have a hexo blog yet, you can directly use a template to create one to reduce configurations.

1. Use the template project [joplin-hexo-demo](https://github.com/mark-magic/joplin-hexo-demo) on github to create a new project. The operation path is **Use this template > Create a new repository**. If you don't have a github account yet, please [register](https://github.com/signup) for one.
2. Use git to clone your project to your local directory via command line `git clone https://github.com/<username>/<repo>.git`
3. Modify the `baseUrl` and `token` in the mark-magic.config.yaml configuration file to the values set in joplin
4. Add the `blog` tag in joplin for the notes you want to publish
5. Run the command `npx mark-magic && npx hexo server`, open <http://localhost:4000/joplin-hexo-demo/> to see your notes
   ![joplin-blog-demo](./resources/joplin-blog-demo.png)
6. Now modify the `root` value in the \_config.yml configuration file to the name of the github `<repo>` you have cloned
7. In the **Pages** menu item in the repository settings on GitHub, select **GitHub Actions** in **Build and deployment > Source**.
8. Finally, run `npm run commit` to push all notes content to be published.

Wait for GitHub Actions to finish. You can view the progress at `https://github.com/<username>/<repo>/actions`.

After completion, you should be able to see the site deployed at `https://<username>.github.io/<repo>/` or `https://<custom-domain>/`, depending on the settings.

> The sample project can be seen at <https://github.com/mark-magic/joplin-hexo-demo>.

## Connect joplin to existing hexo blog

1. Install dependencies `npm i -D @mark-magic/cli @mark-magic/plugin-joplin @mark-magic/plugin-hexo`

2. Add configuration `mark-magic.config.yaml`

   ```yaml
   # mark-magic.config.yaml
   tasks:
     - name: blog
       input:
         name: '@mark-magic/plugin-joplin' # Input plugin, read data from joplin notes
         config:
           baseUrl: 'http://localhost:27583' # Address of joplin web clipper service, is generally http://localhost:41184, here demonstrated with http://localhost:27583 for development
           token: '5bcfa49330788dd68efea27a0a133d2df24df68c3fd78731eaa9914ef34811a34a782233025ed8a651677ec303de6a04e54b57a27d48898ff043fd812d8e0b31' # Token of joplin web clipper service
           tag: blog # Filter notes by tag
       output:
         name: '@mark-magic/plugin-hexo' # Output plugin, generates files for hexo
         config:
           path: './' # Root directory of the hexo project
           base: /joplin-hexo-demo/ # BaseUrl for deployment, deployed by default at domain root, should be consistent with the root configuration in hexo _config.yml
   ```

3. Modify hexo's `_config.yml` configuration, if it contains

   ```yaml
   permalink: /p/:abbrlink/
   ```

4. Read notes from joplin to generate files needed by hexo blog

   ```sh
   npx mark-magic # This will empty source/_posts and source/resources directories, backup if you have any files
   ```

After completion, you can see the generated files in the `source/_posts` and `source/resources` directories. Now you can continue to build and publish with hexo.
