import { defineConfig, mergeConfig } from 'vitepress'

/**
 * 清理粗体之后的空格
 */
function _clearStrongAfterSpace(ends) {
  return (md) => {
    const renderInline = md.renderer.renderInline.bind(md.renderer)
    md.renderer.renderInline = (tokens, options, env) => {
      const checkTokenIndexs = tokens
        .map((token, i) => {
          return {
            p:
              token.type === 'strong_close' &&
              ends.some((end) => tokens[i - 1].content.endsWith(end)) &&
              i + 1 < tokens.length &&
              tokens[i + 1].type === 'text',
            i: i + 1,
          }
        })
        .filter((item) => item.p)
        .map((item) => item.i)
      const newTokens = tokens.map((token, i) => {
        if (!checkTokenIndexs.includes(i)) {
          return token
        }
        return {
          ...token,
          content: token.content.trimStart(),
        }
      })
      return renderInline(newTokens, options, env)
    }
  }
}

// TODO 从外部替换
const config = '{{config}}'

// refer https://vitepress.dev/reference/site-config for details
export default mergeConfig(
  defineConfig({
    markdown: {
      config: (md) => {
        md.use(_clearStrongAfterSpace(['，', '。', '？', '！']))
      },
    },
  }),
  config,
)
