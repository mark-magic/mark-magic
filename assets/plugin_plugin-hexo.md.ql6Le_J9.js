import{_ as s,c as a,o as i,R as e}from"./chunks/framework.ZUvglspe.js";const E=JSON.parse('{"title":"plugin-hexo","description":"","frontmatter":{},"headers":[],"relativePath":"plugin/plugin-hexo.md","filePath":"plugin/plugin-hexo.md"}'),t={name:"plugin/plugin-hexo.md"},n=e(`<h1 id="plugin-hexo" tabindex="-1">plugin-hexo <a class="header-anchor" href="#plugin-hexo" aria-label="Permalink to &quot;plugin-hexo&quot;">​</a></h1><p>输出插件，输出为 hexo 的 markdown 文件，同时保持正确的博客文章之间和对资源引用。</p><h2 id="output" tabindex="-1">output <a class="header-anchor" href="#output" aria-label="Permalink to &quot;output&quot;">​</a></h2><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">tasks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">test</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    input</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;@mark-magic/plugin-hexo&#39;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      config</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        path</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;./&#39;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        base</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/&#39;</span></span></code></pre></div><h3 id="path" tabindex="-1">path <a class="header-anchor" href="#path" aria-label="Permalink to &quot;path&quot;">​</a></h3><p>输出的根路径，默认情况下为当前命令行的路径，一般不需要配置。</p><h3 id="base" tabindex="-1">base <a class="header-anchor" href="#base" aria-label="Permalink to &quot;base&quot;">​</a></h3><p>输出的根路径，默认情况下为 <code>/</code>，一般不需要配置。如果你的博客不是部署在根路径下，可以配置为 <code>/blog/</code> 等。</p><p>例如如果你的博客部署在 GitHub Pages，不绑定域名的情况下，默认发布之后的路径是 <code>https://&lt;username&gt;.github.io/&lt;repo&gt;/</code>，那么这里就应该配置为 <code>/repo/</code>。</p>`,9),h=[n];function p(l,o,k,r,d,c){return i(),a("div",null,h)}const u=s(t,[["render",p]]);export{E as __pageData,u as default};