import{_ as i,c as a,o as n,R as s}from"./chunks/framework.ZUvglspe.js";const d=JSON.parse('{"title":"Configuration","description":"","frontmatter":{},"headers":[],"relativePath":"en/config.md","filePath":"en/config.md"}'),t={name:"en/config.md"},l=s(`<h1 id="configuration" tabindex="-1">Configuration <a class="header-anchor" href="#configuration" aria-label="Permalink to &quot;Configuration&quot;">​</a></h1><p>Use mark-magic.config.yaml as the configuration file. The following describes the basic fields:</p><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">tasks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Define a series of tasks</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">blog</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # Task name</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    input</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Input plugin</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;@mark-magic/plugin-joplin&#39;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # Input plugin name</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      config</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Input plugin configuration, detailed explanations for each plugin configuration below</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    output</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;@mark-magic/plugin-hexo&#39;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # Output plugin name</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      config</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Output plugin configuration</span></span></code></pre></div><h2 id="input" tabindex="-1">input <a class="header-anchor" href="#input" aria-label="Permalink to &quot;input&quot;">​</a></h2><p>Input plugin used to read data from data sources, such as reading notes from Joplin or reading markdown files from local.</p><h3 id="input-name" tabindex="-1">input.name <a class="header-anchor" href="#input-name" aria-label="Permalink to &quot;input.name&quot;">​</a></h3><p>Name of the input plugin, for example <code>@mark-magic/plugin-joplin</code>.</p><h3 id="input-config" tabindex="-1">input.config <a class="header-anchor" href="#input-config" aria-label="Permalink to &quot;input.config&quot;">​</a></h3><p>Input plugin configuration, detailed explanations for each plugin configuration below.</p><ul><li><a href="./plugin/plugin-local.html">plugin-local</a></li><li><a href="./plugin/plugin-epub.html">plugin-epub</a></li><li><a href="./plugin/plugin-docs.html">plugin-docs</a></li><li><a href="./plugin/plugin-joplin.html">plugin-joplin</a></li><li><a href="./plugin/plugin-hexo.html">plugin-hexo</a></li></ul><h2 id="output" tabindex="-1">output <a class="header-anchor" href="#output" aria-label="Permalink to &quot;output&quot;">​</a></h2><p>Output plugin, similar configuration to the input plugin.</p>`,12),e=[l];function p(h,o,r,u,k,g){return n(),a("div",null,e)}const f=i(t,[["render",p]]);export{d as __pageData,f as default};
