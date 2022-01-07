import esbuild from 'esbuild'
import mdx from '@mdx-js/esbuild'
import remarkGfm from 'remark-gfm'

await esbuild.build({
  entryPoints: ['story/index.js'],
  outfile: 'story/build/story.js',
  format: 'esm',
  plugins: [
    mdx({
      remarkPlugins: [remarkGfm]
    })
  ],
  bundle: true,
  loader: { '.js': 'jsx', '.tsx': 'tsx' }
})
