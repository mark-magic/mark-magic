import{_ as e}from"./chunks/joplin-webclipper.ijpMEC_x.js";import{_ as i,c as s,o as a,R as t}from"./chunks/framework.ZUvglspe.js";const n="/assets/joplin-blog-demo.0A9pB4BI.png",b=JSON.parse('{"title":"Notes => Blog","description":"","frontmatter":{},"headers":[],"relativePath":"en/blog.md","filePath":"en/blog.md"}'),o={name:"en/blog.md"},l=t('<h1 id="notes-blog" tabindex="-1">Notes =&gt; Blog <a class="header-anchor" href="#notes-blog" aria-label="Permalink to &quot;Notes =&gt; Blog&quot;">​</a></h1><h2 id="prerequisites" tabindex="-1">Prerequisites <a class="header-anchor" href="#prerequisites" aria-label="Permalink to &quot;Prerequisites&quot;">​</a></h2><blockquote><p>Below we will use <a href="https://joplinapp.org/" target="_blank" rel="noreferrer">joplin</a> as the note-taking tool, and <a href="https://hexo.io/" target="_blank" rel="noreferrer">hexo</a> as the blogging platform for illustration. However, both can be replaced, for example, the source of notes can be replaced with obsidian, and the output blog can be replaced with hugo.</p></blockquote><ol><li>First, make sure that the joplin web clipper is already enabled. <img src="'+e+'" alt="joplin-webclipper"></li><li>Furthermore, you need a hexo project. If you already have one, please refer to <a href="#connecting-joplin-to-an-existing-hexo-blog">Connecting Joplin to an existing Hexo blog</a>, otherwise proceed to the next step.</li></ol><h2 id="creating-a-hexo-blog-from-scratch" tabindex="-1">Creating a hexo blog from scratch <a class="header-anchor" href="#creating-a-hexo-blog-from-scratch" aria-label="Permalink to &quot;Creating a hexo blog from scratch&quot;">​</a></h2><p>If you don&#39;t have a hexo blog yet, you can directly use a template to reduce the configuration.</p><ol><li>Create a new project on GitHub using the template project <a href="https://github.com/mark-magic/joplin-hexo-demo" target="_blank" rel="noreferrer">joplin-hexo-demo</a>, following the path <strong>Use this template &gt; Create a new repository</strong>. If you don&#39;t have a GitHub account yet, please <a href="https://github.com/signup" target="_blank" rel="noreferrer">sign up</a>.</li><li>Use git to clone your project to your local machine via the command line <code>git clone https://github.com/&lt;username&gt;/&lt;repo&gt;.git</code></li><li>Modify the <code>baseUrl</code> and <code>token</code> values in the mark-magic.config.yaml configuration file to match the values set in joplin.</li><li>Add the <code>blog</code> tag to the notes you wish to publish in joplin.</li><li>Run the command <code>npx mark-magic &amp;&amp; npx hexo server</code>, then open <a href="http://localhost:4000/joplin-hexo-demo/" target="_blank" rel="noreferrer">http://localhost:4000/joplin-hexo-demo/</a> to see your notes. <img src="'+n+`" alt="joplin-blog-demo"></li><li>Now modify the value of <code>root</code> in the _config.yml configuration file to be the name of your cloned github <code>&lt;repo&gt;</code>.</li><li>Under the <strong>Pages</strong> menu item in the repository settings on GitHub, select <strong>Build and deployment &gt; Source</strong>, then choose <strong>GitHub Actions</strong>.</li><li>Finally, run <code>npm run commit</code> to push all the notes you want to publish.</li></ol><p>Wait for GitHub Actions to complete, you can check the progress at <code>https://github.com/&lt;username&gt;/&lt;repo&gt;/actions</code>.</p><p>Once everything is done, your site should be deployed at either <code>https://&lt;username&gt;.github.io/&lt;repo&gt;/</code> or <code>https://&lt;custom-domain&gt;/</code>, depending on your settings.</p><blockquote><p>You can find the sample project at <a href="https://github.com/mark-magic/joplin-hexo-demo" target="_blank" rel="noreferrer">https://github.com/mark-magic/joplin-hexo-demo</a>.</p></blockquote><h2 id="connecting-joplin-to-an-existing-hexo-blog" tabindex="-1">Connecting Joplin to an existing Hexo blog <a class="header-anchor" href="#connecting-joplin-to-an-existing-hexo-blog" aria-label="Permalink to &quot;Connecting Joplin to an existing Hexo blog&quot;">​</a></h2><ol><li><p>Install dependencies <code>npm i -D @mark-magic/cli @mark-magic/plugin-joplin @mark-magic/plugin-hexo</code></p></li><li><p>Add configuration <code>mark-magic.config.yaml</code></p><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># mark-magic.config.yaml</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">tasks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">blog</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    input</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;@mark-magic/plugin-joplin&#39;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # Input plugin to read data from Joplin notes</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      config</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        baseUrl</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;http://localhost:27583&#39;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # The address of the Joplin web clipper service, usually http://localhost:41184, here we use the development-time http://localhost:27583 for demonstration purposes</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        token</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;5bcfa49330788dd68efea27a0a133d2df24df68c3fd78731eaa9914ef34811a34a782233025ed8a651677ec303de6a04e54b57a27d48898ff043fd812d8e0b31&#39;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # The token of the Joplin web clipper service</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        tag</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">blog</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # Filter notes based on tag</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    output</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;@mark-magic/plugin-hexo&#39;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # Output plugin to generate files required by Hexo</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      config</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        path</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;./&#39;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # The root directory of the hexo project</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        base</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/joplin-hexo-demo/</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # The baseUrl when deployed, defaults to the root path of the domain, should match the root configuration in hexo _config.yml</span></span></code></pre></div></li><li><p>Modify the hexo configuration <code>_config.yml</code>, if it contains</p><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">permalink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/p/:abbrlink/</span></span></code></pre></div></li><li><p>Read notes from Joplin and generate the files required by hexo blog</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npx</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> mark-magic</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # This will empty the source/_posts and source/resources directories, so please backup any important files</span></span></code></pre></div></li></ol><p>After that, you can see the generated files in the <code>source/_posts</code> and <code>source/resources</code> directories, and now you can continue with hexo build and publish.</p>`,13),h=[l];function p(r,c,d,g,k,u){return a(),s("div",null,h)}const E=i(o,[["render",p]]);export{b as __pageData,E as default};
