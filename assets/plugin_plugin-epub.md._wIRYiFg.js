import{_ as a,o as i,c as s,R as e}from"./chunks/framework.UjU5Kp2a.js";const E=JSON.parse('{"title":"plugin-epub","description":"","frontmatter":{},"headers":[],"relativePath":"plugin/plugin-epub.md","filePath":"plugin/plugin-epub.md"}'),t={name:"plugin/plugin-epub.md"},n=e(`<h1 id="plugin-epub" tabindex="-1">plugin-epub <a class="header-anchor" href="#plugin-epub" aria-label="Permalink to &quot;plugin-epub&quot;">​</a></h1><p>输出插件，输出为 epub 的电子书文件，同时保持正确的章节之间和对资源引用。</p><h2 id="output" tabindex="-1">output <a class="header-anchor" href="#output" aria-label="Permalink to &quot;output&quot;">​</a></h2><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">tasks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">book</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    output</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;@mark-magic/plugin-epub&#39;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      config</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        path</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">./dist/my-book.epub</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">my-book</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        title</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">My First Book</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        creator</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Mark Magic</span></span></code></pre></div><h2 id="path" tabindex="-1">path <a class="header-anchor" href="#path" aria-label="Permalink to &quot;path&quot;">​</a></h2><p>输出文件的路径，必须是 <code>.epub</code> 后缀。</p><h2 id="id" tabindex="-1">id <a class="header-anchor" href="#id" aria-label="Permalink to &quot;id&quot;">​</a></h2><p>小说的唯一标识，用于生成 epub 文件的唯一标识符，必须是字母、数字、下划线组成。</p><h2 id="title" tabindex="-1">title <a class="header-anchor" href="#title" aria-label="Permalink to &quot;title&quot;">​</a></h2><p>小说的标题。</p><h2 id="creator" tabindex="-1">creator <a class="header-anchor" href="#creator" aria-label="Permalink to &quot;creator&quot;">​</a></h2><p>作者。</p><h2 id="publisher" tabindex="-1">publisher <a class="header-anchor" href="#publisher" aria-label="Permalink to &quot;publisher&quot;">​</a></h2><p>发布者，默认为 <code>mark-magic</code>。</p><h2 id="language" tabindex="-1">language <a class="header-anchor" href="#language" aria-label="Permalink to &quot;language&quot;">​</a></h2><p>语言，默认为 <code>en-US</code>。</p><h2 id="cover" tabindex="-1">cover <a class="header-anchor" href="#cover" aria-label="Permalink to &quot;cover&quot;">​</a></h2><p>封面图片，可以是本地路径，默认不存在。</p>`,18),l=[n];function p(h,r,k,o,d,c){return i(),s("div",null,l)}const g=a(t,[["render",p]]);export{E as __pageData,g as default};
